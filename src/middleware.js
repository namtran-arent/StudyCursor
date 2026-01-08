import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Redirect root path to dashboards
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboards';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only the root path
     */
    '/',
  ],
};
