
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 1. Allow landing page
  if (pathname === '/') return NextResponse.next();
  // 2. Allow admin
  if (req.cookies.get('user_email')?.value === 'basisbadgerllc@gmail.com') return NextResponse.next();
  // 3. Allow guest audit
  if (req.cookies.get('guest_audit')?.value === 'true') return NextResponse.next();
  // 4. Otherwise, redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
