import { NextResponse } from 'next/server';

export function middleware(request) {
  // Redirect root path to dashboards
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboards', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
