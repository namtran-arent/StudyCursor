import { NextResponse } from 'next/server';

/**
 * API endpoint to check NextAuth environment variables
 * Useful for debugging redirect_uri_mismatch issues
 */
export async function GET() {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

  // Get the expected redirect URI
  const expectedRedirectUri = nextAuthUrl 
    ? `${nextAuthUrl}/api/auth/callback/google`
    : 'NEXTAUTH_URL not set';

  return NextResponse.json({
    NEXTAUTH_URL: nextAuthUrl || 'NOT SET',
    expectedRedirectUri,
    hasGoogleClientId,
    hasGoogleClientSecret,
    hasNextAuthSecret,
    environment: process.env.NODE_ENV,
    // Get request URL if available (for debugging)
    requestUrl: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'Not on Vercel',
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
