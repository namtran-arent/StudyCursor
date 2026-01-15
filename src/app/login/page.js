'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Always redirect to landing page after login
  const callbackUrl = '/';
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for error in URL
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }

    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4 py-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Authentication error: {error}
            </p>
            <p className="text-xs text-red-500 dark:text-red-500 mt-2">
              Please check your environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET)
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setError(null);
            signIn('google', { callbackUrl: '/' }); // Always redirect to landing page
          }}
          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
