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
  const isHomepage = request.nextUrl.pathname === '/';

  if ((isAdminRoute || isDashboardRoute) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && session) {
    const target = session.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Redirect logged-in users from homepage to dashboard,
  // unless they explicitly clicked the logo/home link (indicated by ?home=true)
  if (isHomepage && session && !request.nextUrl.searchParams.has('home')) {
    const target = session.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}
