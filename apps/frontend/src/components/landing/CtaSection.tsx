import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white dark:bg-slate-950 lg:py-24">
      <div className="absolute inset-x-0 top-[-30%] mx-auto h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-3xl" />
      <div data-reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="display text-5xl italic leading-none lg:text-7xl">Ready to plan your next adventure?</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70">Create your free account and let Voyai handle the planning.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-base font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800">
            Start planning free →
          </Link>
          <Link href="https://github.com" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-base font-semibold text-white transition-all duration-150 ease-out hover:bg-white/10">
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
