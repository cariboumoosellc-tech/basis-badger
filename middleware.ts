
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const guestAudit = req.cookies.get('guest_audit')?.value;
  const userEmail = req.cookies.get('user_email')?.value;
  // Allow if admin, logged-in, or guest audit
  if (userEmail || guestAudit === 'true') {
    return NextResponse.next();
  }
  // Otherwise, redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
