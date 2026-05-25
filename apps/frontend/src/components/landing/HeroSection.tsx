import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M8 5.8v12.4c0 .8.9 1.3 1.6.9l9.4-6.2a1 1 0 0 0 0-1.8L9.6 4.9A1 1 0 0 0 8 5.8Z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-50 py-20 dark:bg-slate-950 lg:py-28">
      <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/20" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
        <div data-reveal>
          <Badge tone="emerald">AI Travel Planner</Badge>
          <h1 className="display mt-7 max-w-4xl text-6xl leading-[0.9] text-navy-950 dark:text-white lg:text-8xl">
            Your next adventure,<br />
            <span className="italic text-emerald-700 dark:text-emerald-300">planned</span> in seconds.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600 dark:text-slate-300">
            Voyai uses AI to generate personalized day-by-day itineraries, smart budget breakdowns,
            hotel picks, and destination-specific packing lists — built around your travel style.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800">
              Start planning free →
            </Link>
            <Link href="#how-it-works" className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-base font-semibold text-navy-700 transition-colors duration-150 ease-out hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900">
              <PlayIcon /> See how it works
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-slate-400">
            <span>Claude AI</span><span>·</span><span>Next.js</span><span>·</span><span>TypeScript</span><span>·</span><span>Multi-user secure</span>
          </div>
        </div>

        <div data-reveal className="lg:justify-self-end">
          <div className="-rotate-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl shadow-navy-950/15 dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">Tokyo itinerary</p>
                  <h3 className="display mt-2 text-4xl italic text-navy-950 dark:text-white">Day 1</h3>
                </div>
                <Badge tone="sky">Standard</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['9:00 AM', 'Tsukiji Outer Market', 'Street food breakfast and market walk.'],
                  ['1:30 PM', 'Meiji Shrine', 'Quiet culture break under cedar trees.'],
                  ['7:00 PM', 'Shinjuku izakaya crawl', 'Local dinner picks by neighborhood.'],
                ].map(([time, title, copy]) => (
                  <div key={title} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{time}</p>
                    <p className="mt-1 text-sm font-semibold text-navy-950 dark:text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-slate-400">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
