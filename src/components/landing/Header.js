'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function LandingHeader() {
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);
  const isAuthenticated = status === 'authenticated' && session;

  // Get user's first name initial for avatar
  const getAvatarInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Github className="h-6 w-6" />
            <span>Dandi GitHub Analyzer</span>
          </Link>
          
          {/* Dashboard Button - Only show when logged in */}
          {isAuthenticated && (
            <Button asChild variant="outline" size="sm" className="ml-4">
              <Link href="/dashboards" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          )}
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">
                  {session.user?.name || session.user?.email || 'User'}
                </span>
                {session.user?.email && session.user?.name && (
                  <span className="text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                )}
              </div>
              
              {/* Profile Picture with Fallback */}
              <div className="relative">
                {session.user?.image && !imageError ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-border"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-border">
                    {getAvatarInitial()}
                  </div>
                )}
              </div>
              
              {/* Sign Out Button */}
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button 
                asChild
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                <Link href="/login">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
