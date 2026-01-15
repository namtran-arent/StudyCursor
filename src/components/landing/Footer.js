'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50">
              <Github className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
              <span>Ko0ls GitHub Analyzer</span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              AI-powered insights for open source GitHub repositories.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Pricing</Link></li>
              <li><Link href="/playground" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">API Playground</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Ko0ls GitHub Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
