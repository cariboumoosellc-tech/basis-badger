
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 1. Public routes: /, /login, /api
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Guest bypass
  if (req.cookies.get('guest_audit')?.value === 'true') {
    return NextResponse.next();
  }

  // 3. Admin bypass
  if (req.cookies.get('user_email')?.value === 'basisbadgerllc@gmail.com') {
    return NextResponse.next();
  }

  // 4. Catch-all: redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
