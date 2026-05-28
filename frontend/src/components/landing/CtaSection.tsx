import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="relative border-t border-stone-200 bg-white py-20 text-navy-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white lg:py-24">
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="display text-5xl italic leading-none lg:text-7xl">Ready to plan your next adventure?</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600 dark:text-slate-300">Create your free account and let Voyai handle the planning.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-base font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800">
            Start planning free →
          </Link>
          <Link href="https://github.com/ijatinydv/Voyai" className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-6 text-base font-semibold text-navy-950 transition-all duration-150 ease-out hover:bg-white dark:border-white/20 dark:text-white dark:hover:bg-white/10">
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
