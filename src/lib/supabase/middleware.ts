import { NextResponse, type NextRequest } from 'next/server'
import jwt from "jsonwebtoken";

interface SessionUser {
  userId: string;
  email: string;
  role?: string;
  exp: number;
}

function getSessionFromCookie(request: NextRequest): SessionUser | null {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie?.value) {
      return null;
    }

    const secret = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET;
    if (!secret) return null;

    const decoded = jwt.verify(sessionCookie.value, secret) as jwt.JwtPayload;
    
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

export async function updateSession(request: NextRequest) {
  const session = getSessionFromCookie(request);

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isHomepage = request.nextUrl.pathname === '/';

  if ((isAdminRoute || isDashboardRoute) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && session) {
    const target = session.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isHomepage && session && !request.nextUrl.searchParams.has('home')) {
    const target = session.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}
