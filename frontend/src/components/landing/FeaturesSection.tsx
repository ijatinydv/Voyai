import { Badge } from '@/components/ui/Badge';

export function FeaturesSection() {
  return (
    <section id="features" className="bg-stone-50 py-20 dark:bg-slate-950 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800 dark:text-emerald-300">What Voyai Does</p>
          <h2 className="display mt-4 max-w-3xl text-5xl italic leading-none text-navy-950 dark:text-white lg:text-6xl">
            Everything for your trip, nothing you don&apos;t need
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article data-reveal className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/10 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h3 className="display text-4xl italic text-navy-950 dark:text-white">AI Day-by-Day Itinerary</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-slate-400">Voyai turns a destination and travel style into a practical day plan you can edit, regenerate, and explore.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Day 1 · Markets, shrine, local dinner', 'Day 2 · Architecture walk, museum, skyline drinks'].map((item) => (
                <div key={item} className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-medium text-navy-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white">{item}</div>
              ))}
            </div>
          </article>
          <article data-reveal className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/10 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="display text-3xl italic text-navy-950 dark:text-white">Smart Budget Estimation</h3>
            <p className="mt-4 text-sm leading-6 text-stone-600 dark:text-slate-400">Understand flights, hotels, food, activities, and total spend before the trip takes shape.</p>
          </article>
          {[
            ['Hotel Suggestions', 'Budget-aware hotel picks with highlights and nightly estimates.'],
            ['Multi-user Secure Auth', 'JWT auth and private user-scoped trips for every traveler.'],
          ].map(([title, description]) => (
            <article key={title} data-reveal className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/10 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="display text-3xl italic text-navy-950 dark:text-white">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-stone-600 dark:text-slate-400">{description}</p>
            </article>
          ))}
          <article data-reveal className="rounded-2xl border border-amber-200 bg-amber-50/55 p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/10 dark:border-amber-900/70 dark:bg-amber-950/20">
            <Badge tone="amber">Creative Feature</Badge>
            <h3 className="display mt-4 text-3xl italic text-navy-950 dark:text-white">Smart Packing List</h3>
            <p className="mt-4 text-sm leading-6 text-stone-700 dark:text-slate-300">A checklist that reads your itinerary and suggests what you actually need for the activities ahead.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
