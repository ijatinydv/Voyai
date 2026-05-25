import { formatCurrency } from '@/utils/format';

export function BudgetPreviewSection() {
  const total = 950;
  const items = [
    ['✈️', 'Flights', 400],
    ['🏨', 'Accommodation', 300],
    ['🍽️', 'Food', 150],
    ['🎟️', 'Activities', 100],
  ] as const;

  return (
    <section className="bg-white py-20 dark:bg-slate-950 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800 dark:text-emerald-300">Budget Preview</p>
          <h2 className="display mt-4 text-5xl italic leading-none text-navy-950 dark:text-white lg:text-6xl">Know exactly what you&apos;ll spend</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 dark:text-slate-400">Voyai turns rough travel preferences into a clean budget model, so you can choose the trip that fits before you commit.</p>
        </div>
        <div data-reveal className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {items.map(([icon, label, amount]) => (
              <div key={label} className="rounded-lg border border-stone-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-navy-950 dark:text-white">{icon} {label}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-navy-950 dark:text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-700" style={{ width: `${Math.round((amount / total) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-navy-950 p-5 text-white dark:bg-slate-800">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/60">Estimated total</p>
            <p className="mt-2 font-mono text-4xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
