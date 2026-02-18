
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const guestCookie = request.cookies.get('guest_audit')?.value;
  const userEmail = request.cookies.get('user_email')?.value;

  // 1. ALWAYS allow these public paths
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/login' || pathname.startsWith('/preview')) {
    return NextResponse.next();
  }

  // 2. ADMIN & GUEST BYPASS: If they have the pass, let them into the dashboard
  if (userEmail === 'basisbadgerllc@gmail.com' || guestCookie === 'true') {
    return NextResponse.next();
  }

  // 3. PROTECT DASHBOARD: If they try to hit /dashboard without a pass, send to login
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
