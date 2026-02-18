
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 1. Public routes: /, /login, /api
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const userEmail = req.cookies.get('user_email')?.value;
  const guestAudit = req.cookies.get('guest_audit')?.value;

  // 2. Admin bypass: allow all
  if (userEmail === 'basisbadgerllc@gmail.com') {
    return NextResponse.next();
  }

  // 3. Guest audit: allow /dashboard
  if (pathname.startsWith('/dashboard') && guestAudit === 'true') {
    return NextResponse.next();
  }

  // 4. Guard: Only redirect to /login if accessing /dashboard or /admin and not logged in or guest
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !userEmail && guestAudit !== 'true') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 5. All other routes: allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
