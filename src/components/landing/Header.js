'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, LayoutDashboard, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function LandingHeader() {
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-lg sm:text-xl">
            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden xs:inline sm:inline">Ko0ls GitHub Analyzer</span>
            <span className="xs:hidden">Ko0ls</span>
          </Link>
          
          {/* Dashboard Button - Only show when logged in, hidden on mobile */}
          {isAuthenticated && (
            <Button asChild variant="outline" size="sm" className="hidden sm:flex ml-2 sm:ml-4">
              <Link href="/dashboards" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </Button>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex flex-col items-end">
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
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log In</Link>
              </Button>
              <Button 
                asChild
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                <Link href="/login">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              href="#features" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <Link 
                href="/dashboards" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2">
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.user?.name || session.user?.email || 'User'}
                      </p>
                      {session.user?.email && session.user?.name && (
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="w-full" size="sm">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                    size="sm"
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
