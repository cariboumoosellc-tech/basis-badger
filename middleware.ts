import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  const isApi = pathname.startsWith('/api');

  // Allow all API routes
  if (isApi) return NextResponse.next();

  // Allow dashboard for guest audit if sessionStorage has 'guest_audit' flag
  if (isDashboard) {
    // This is a workaround: Next.js middleware can't access sessionStorage directly.
    // Instead, check for a cookie or query param set after a free audit.
    const guestAudit = req.cookies.get('guest_audit')?.value;
    const userEmail = req.cookies.get('user_email')?.value;
    if (userEmail === 'basisbadgerllc@gmail.com') return NextResponse.next(); // admin bypass
    if (userEmail) return NextResponse.next(); // logged in
    if (guestAudit === 'true') return NextResponse.next(); // allow guest audit
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
