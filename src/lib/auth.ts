import { cookies } from "next/headers";
import { prisma } from "./prisma";

export interface SessionUser {
  userId: string;
  email: string;
  role?: string;
  exp: number;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    ) as SessionUser;

    // Check if session is expired
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
