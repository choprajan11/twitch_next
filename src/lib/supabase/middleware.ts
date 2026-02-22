import { NextResponse, type NextRequest } from 'next/server'

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

    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
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

export async function updateSession(request: NextRequest) {
  const session = getSessionFromCookie(request);

  // Protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if ((isAdminRoute || isDashboardRoute) && !session) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routing check: if a non-admin tries to access /admin, redirect to /dashboard
  if (isAdminRoute && session && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If admin tries to access /dashboard, redirect to /admin
  if (isDashboardRoute && session && session.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isAuthRoute && session) {
    // Redirect authenticated users from login based on role
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}
