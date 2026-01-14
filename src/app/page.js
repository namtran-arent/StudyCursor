import LandingHeader from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import LandingFooter from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50/50 to-white dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-950">
      <LandingHeader />
      <Hero />
      <Features />
      <Pricing />
      <LandingFooter />
    </main>
  );
}
