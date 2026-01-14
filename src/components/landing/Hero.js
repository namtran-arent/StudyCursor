'use client';

import { Button } from '@/components/ui/button';
import { Github, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-zinc-950 dark:via-amber-950/10 dark:to-zinc-950 py-20 md:py-32">
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/40 to-yellow-300/20 rounded-full blur-3xl dark:from-amber-900/20 dark:to-yellow-800/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-purple-300/20 rounded-full blur-3xl dark:from-blue-900/15 dark:to-purple-800/10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-800/30 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-zinc-700 dark:text-zinc-300">AI-Powered GitHub Repository Insights</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-zinc-50">
            Analyze Any GitHub Repository
            <span className="block bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent underline decoration-amber-400/50 decoration-2 underline-offset-4">
              in Seconds
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl md:text-2xl">
            Get instant insights: summaries, stars, cool facts, latest PRs, and version updates
            for any open source GitHub repository.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-base bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
            >
              <Link href="/login" className="flex items-center gap-2">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-base border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Link href="#features" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-3">
                <Github className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">10K+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Repos Analyzed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-3">
                <Zap className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">&lt;5s</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Analysis Time</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-3">
                <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">99.9%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Uptime</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-3">
                <Sparkles className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">AI</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
