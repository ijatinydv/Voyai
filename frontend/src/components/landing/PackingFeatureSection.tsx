import { Badge } from '@/components/ui/Badge';

export function PackingFeatureSection() {
  const rows = [
    ['Clothing', '☑', 'Walking shoes', 'x2', true],
    ['Clothing', '☐', 'Light rain shell', null, false],
    ['Documents', '☑', 'Passport', null, true],
    ['Destination-Specific', '☐', 'Reef-safe sunscreen', null, true],
    ['Destination-Specific', '☑', 'Slip-on temple shoes', null, true],
  ] as const;

  return (
    <section className="bg-amber-50/50 py-20 dark:bg-slate-900 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
        <div data-reveal className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xl shadow-amber-950/5 dark:border-amber-900/60 dark:bg-slate-950">
          <p className="text-sm font-semibold text-navy-950 dark:text-white">10 of 16 items packed</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-slate-800">
            <div className="h-full w-[62%] rounded-full bg-emerald-700" />
          </div>
          <div className="mt-5 space-y-2">
            {rows.map(([category, state, item, qty, essential]) => (
              <div key={`${category}-${item}`} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-sm">{state}</span>
                <span className={state === '☑' ? 'flex-1 text-sm text-stone-500 line-through' : 'flex-1 text-sm font-medium text-navy-950 dark:text-white'}>{item}</span>
                {qty ? <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-stone-500 dark:bg-slate-800">{qty}</span> : null}
                {essential ? <span className="text-amber-600">⭐</span> : null}
              </div>
            ))}
          </div>
        </div>
        <div data-reveal>
          <Badge tone="amber">Creative Feature</Badge>
          <h2 className="display mt-4 text-5xl italic leading-none text-navy-950 dark:text-white lg:text-6xl">Packing lists that actually know where you&apos;re going</h2>
          <ul className="mt-7 space-y-4">
            {[
              'Reads your actual itinerary activities',
              'Temple visits → slip-on shoes. Beach day → reef-safe sunscreen',
              'Essential item markers + progress tracking',
              'Copy to clipboard in one click',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-stone-700 dark:text-slate-300">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
