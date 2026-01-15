import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, auth routes, static files, and root path (landing page)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Get token - handle case where NEXTAUTH_SECRET might not be set
  let token = null;
  try {
    token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
  } catch (error) {
    console.error('Error getting token in middleware:', error);
    // If NEXTAUTH_SECRET is missing, allow access but log warning
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn('⚠️  NEXTAUTH_SECRET is not set - authentication may not work properly');
    }
  }

  // Protect dashboard routes - require authentication
  const protectedPaths = ['/dashboards', '/protected'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', '/'); // Always redirect to landing page
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page to landing page
  if (pathname === '/login' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
