import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type SecurityEventType =
  | "auth_failure"
  | "rate_limit_hit"
  | "suspicious_input"
  | "admin_action"
  | "payment_anomaly"
  | "brute_force_detected"
  | "ip_blocked"
  | "unauthorized_access"
  | "webhook_signature_failure";

export type SecuritySeverity = "info" | "warn" | "critical";

interface SecurityEventData {
  type: SecurityEventType;
  severity?: SecuritySeverity;
  ip?: string | null;
  userId?: string | null;
  path?: string | null;
  method?: string | null;
  details?: Record<string, unknown>;
  blocked?: boolean;
}

const eventBuffer: SecurityEventData[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL_MS = 5_000;
const MAX_BUFFER_SIZE = 50;

async function flushEvents() {
  if (eventBuffer.length === 0) return;

  const batch = eventBuffer.splice(0, eventBuffer.length);

  try {
    await prisma.securityEvent.createMany({
      data: batch.map((evt) => ({
        type: evt.type,
        severity: evt.severity || "info",
        ip: evt.ip || null,
        userId: evt.userId || null,
        path: evt.path || null,
        method: evt.method || null,
        details: (evt.details as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        blocked: evt.blocked || false,
      })),
    });
  } catch (err) {
    console.error("[SecurityMonitor] Failed to flush events:", err);
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(async () => {
    flushTimer = null;
    await flushEvents();
  }, FLUSH_INTERVAL_MS);
}

export function logSecurityEvent(event: SecurityEventData) {
  eventBuffer.push(event);

  if (event.severity === "critical") {
    console.warn(
      `[SECURITY] ${event.type} | ${event.severity} | IP: ${event.ip} | Path: ${event.path} | ${JSON.stringify(event.details)}`
    );
  }

  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

const suspiciousPatterns = [
  /(\.\.\/)/, // path traversal
  /(<script)/i, // XSS attempts
  /(union\s+select)/i, // SQL injection
  /(drop\s+table)/i, // SQL injection
  /(\bor\b\s+1\s*=\s*1)/i, // SQL injection
  /(javascript:)/i, // JS protocol
  /(eval\s*\()/i, // eval injection
  /(document\.cookie)/i, // cookie theft
  /(\{\{.*\}\})/i, // template injection
];

export function detectSuspiciousInput(value: string): boolean {
  return suspiciousPatterns.some((pattern) => pattern.test(value));
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const ips = xff.split(",").map((s) => s.trim());
    return ips[ips.length - 1] || "unknown";
  }
  return "unknown";
}

const ipFailureCounts = new Map<string, { count: number; firstSeen: number }>();
const BRUTE_FORCE_WINDOW_MS = 300_000;
const BRUTE_FORCE_THRESHOLD = 15;

export function trackFailedAttempt(ip: string): boolean {
  const now = Date.now();
  const entry = ipFailureCounts.get(ip);

  if (!entry || now - entry.firstSeen > BRUTE_FORCE_WINDOW_MS) {
    ipFailureCounts.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  entry.count++;

  if (entry.count >= BRUTE_FORCE_THRESHOLD) {
    logSecurityEvent({
      type: "brute_force_detected",
      severity: "critical",
      ip,
      details: {
        failedAttempts: entry.count,
        windowMs: BRUTE_FORCE_WINDOW_MS,
      },
      blocked: true,
    });
    return true;
  }

  return false;
}

export function isIpBlocked(ip: string): boolean {
  const entry = ipFailureCounts.get(ip);
  if (!entry) return false;

  const now = Date.now();
  if (now - entry.firstSeen > BRUTE_FORCE_WINDOW_MS) {
    ipFailureCounts.delete(ip);
    return false;
  }

  return entry.count >= BRUTE_FORCE_THRESHOLD;
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipFailureCounts) {
      if (now - entry.firstSeen > BRUTE_FORCE_WINDOW_MS) {
        ipFailureCounts.delete(ip);
      }
    }
  }, 600_000);
}
