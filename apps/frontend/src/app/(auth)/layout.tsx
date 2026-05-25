import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-sand-50 text-navy-950 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-navy-950 lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#0f172a_34%,#064e3b_68%,#f5f0e8_140%)] bg-[length:160%_160%] animate-[authGradient_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(72deg,rgba(16,185,129,0.24),transparent_36%,rgba(245,240,232,0.16)_64%,transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(245,240,232,0.08)_0_1px,transparent_1px_80px)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />

        <div className="relative flex min-h-screen flex-col justify-between p-12 text-white">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold uppercase tracking-[0.32em] text-sand-100">Voyai</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-sand-100/80">AI Travel Planner</span>
          </div>

          <div className="max-w-2xl pb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.34em] text-emerald-200">Marrakech, Morocco</p>
            <blockquote className="display text-7xl italic leading-[0.92] text-sand-50">
              Travel lightly. Arrive deeply.
            </blockquote>
            <p className="mt-8 max-w-md text-base leading-7 text-sand-100/72">
              Shape itineraries that feel less like spreadsheets and more like stories waiting to happen.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:bg-white">
        {children}
      </section>
    </main>
  );
}
