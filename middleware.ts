
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 1. Public routes: /, /login, /api
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Guest bypass (check for cookie existence before user session)
  const hasGuestCookie = req.cookies.has('guest_audit');
  if (hasGuestCookie) {
    return NextResponse.next();
  }

  // 3. Admin bypass
  const isAdmin = req.cookies.get('user_email')?.value === 'basisbadgerllc@gmail.com';
  if (isAdmin) {
    return NextResponse.next();
  }

  // 4. Catch-all: redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
