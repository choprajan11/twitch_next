import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { createSessionToken } from "@/lib/auth";
import { rateLimit } from "@/lib/security";
import { logSecurityEvent, getClientIp, trackFailedAttempt } from "@/lib/security-monitor";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { allowed } = rateLimit(`verify-code:${normalizedEmail}`, 5, 600_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.vcode) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (user.vcodeExpiresAt && user.vcodeExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const codeA = Buffer.from(String(user.vcode));
    const codeB = Buffer.from(String(code));
    if (codeA.length !== codeB.length || !crypto.timingSafeEqual(codeA, codeB)) {
      const ip = getClientIp(request);
      trackFailedAttempt(ip);
      logSecurityEvent({
        type: "auth_failure",
        severity: "warn",
        ip,
        path: "/api/auth/verify-code",
        method: "POST",
        details: { email: normalizedEmail, reason: "invalid_code" },
      });
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { vcode: null, vcodeExpiresAt: null },
    });

    const sessionToken = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      needsPassword: !user.password,
      message: "Logged in successfully",
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    response.cookies.set('user_email', user.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
