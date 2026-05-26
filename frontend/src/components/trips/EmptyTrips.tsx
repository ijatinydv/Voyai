import Link from 'next/link';

function CompassIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-12 w-12">
      <circle cx="24" cy="24" r="18" />
      <path d="m30 18-4.2 10.8L18 30l4.2-10.8L30 18Z" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyTrips() {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-lg border border-stone-200 bg-sand-50 text-emerald-800">
        <CompassIcon />
      </div>
      <h2 className="display text-5xl italic leading-none text-navy-950">No trips yet</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">Your adventures start here. Build a focused itinerary, budget, and packing rhythm in minutes.</p>
      <Link
        href="/trips/new"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        Plan your first trip →
      </Link>
    </section>
  );
}
