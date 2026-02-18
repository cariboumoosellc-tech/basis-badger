
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Guest audit bypass: allow immediately if guest_audit cookie is set
  const guestAudit = req.cookies.get('guest_audit')?.value;
  if (guestAudit === 'true') return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  const isApi = pathname.startsWith('/api');

  // Allow all API routes
  if (isApi) return NextResponse.next();

  // Dashboard: allow admin, logged in, or redirect
  if (isDashboard) {
    const userEmail = req.cookies.get('user_email')?.value;
    if (userEmail === 'basisbadgerllc@gmail.com') return NextResponse.next(); // admin bypass
    if (userEmail) return NextResponse.next(); // logged in
    // Otherwise, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin route: only allow admin
  if (isAdmin) {
    const userEmail = req.cookies.get('user_email')?.value;
    if (userEmail === 'basisbadgerllc@gmail.com') return NextResponse.next();
    return NextResponse.redirect(new URL('/', req.url));
  }

  // All other routes: public
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
