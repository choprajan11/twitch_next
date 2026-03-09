import { cookies } from "next/headers";
import { prisma } from "./prisma";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or ENCRYPTION_SECRET environment variable is required");
  }
  return secret;
}

export interface SessionUser {
  userId: string;
  email: string;
  role?: string;
  exp: number;
}

export function createSessionToken(user: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      exp: (decoded.exp ?? 0) * 1000,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    const session = verifySessionToken(sessionCookie.value);
    if (!session) {
      return null;
    }

    if (session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      funds: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}
