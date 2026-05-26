import type { Metadata } from 'next';
import { BudgetPreviewSection } from '@/components/landing/BudgetPreviewSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { LandingNav } from '@/components/landing/LandingNav';
import { PackingFeatureSection } from '@/components/landing/PackingFeatureSection';

export const metadata: Metadata = {
  title: 'Voyai — AI Travel Planner',
  description: 'Generate personalized day-by-day travel itineraries, smart budgets, hotel picks, and packing lists with Voyai.',
};

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BudgetPreviewSection />
        <PackingFeatureSection />
        <CtaSection />
      </main>
    </>
  );
}
