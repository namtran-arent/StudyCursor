'use client';

import { FileText, GitBranch, Star, TrendingUp, Package, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'AI-Powered Summaries',
    description: 'Get comprehensive summaries of any GitHub repository using advanced AI analysis.',
  },
  {
    icon: Star,
    title: 'Star Analytics',
    description: 'Track star growth, trending repositories, and community engagement metrics.',
  },
  {
    icon: Sparkles,
    title: 'Cool Facts Discovery',
    description: 'Discover interesting facts and insights about repositories automatically.',
  },
  {
    icon: GitBranch,
    title: 'Latest Pull Requests',
    description: 'Stay updated with the most important pull requests and their impact.',
  },
  {
    icon: Package,
    title: 'Version Updates',
    description: 'Monitor package updates, dependency changes, and release notes.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Understand repository trends, growth patterns, and community activity.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-white via-zinc-50/30 to-white dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-zinc-900 dark:text-zinc-50">
            Everything You Need to Understand
            <span className="block text-amber-600 dark:text-amber-400">Any GitHub Repository</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Powerful features to help you analyze and understand open source projects
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
