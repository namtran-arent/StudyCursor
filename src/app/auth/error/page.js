'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please check your environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET).';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL. Check your GOOGLE_CLIENT_ID.';
      case 'OAuthCallback':
        return 'Error in handling the response from Google OAuth. Check your redirect URI in Google Cloud Console.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.';
      case 'EmailCreateAccount':
        return 'Could not create email account.';
      case 'Callback':
        return 'Error in the OAuth callback handler route.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account.';
      case 'EmailSignin':
        return 'Sending the e-mail with the verification token failed.';
      case 'CredentialsSignin':
        return 'Invalid credentials provided.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return error || 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 border border-red-200 dark:border-red-800">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Authentication Error
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm font-medium text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full block px-4 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-sm font-medium text-center"
          >
            Go Home
          </Link>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              Error Code:
            </p>
            <code className="text-xs text-red-600 dark:text-red-400">
              {error}
            </code>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-2">
            Troubleshooting Steps:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Check that GOOGLE_CLIENT_ID is set in .env.local</li>
            <li>Check that GOOGLE_CLIENT_SECRET is set in .env.local</li>
            <li>Check that NEXTAUTH_SECRET is set in .env.local</li>
            <li>Verify redirect URI in Google Cloud Console matches: http://localhost:3000/api/auth/callback/google</li>
            <li>Restart your development server after updating .env.local</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
