import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

interface SessionUser {
  userId: string;
  email: string;
  role?: string;
  exp: number;
}

async function getSessionFromCookie(request: NextRequest): Promise<SessionUser | null> {
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  const secret = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(secret)
    );

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string | undefined,
      exp: ((payload.exp ?? 0) as number) * 1000,
    };
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = await getSessionFromCookie(request);

  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith('/login');
  const isAdminRoute = path.startsWith('/admin');
  const isDashboardRoute = path.startsWith('/dashboard');
  const isHomepage = path === '/';

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
