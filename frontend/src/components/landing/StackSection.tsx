export function StackSection() {
  const groups = [
    ['Frontend', ['Next.js 14 App Router', 'TypeScript strict', 'Tailwind CSS', 'Zustand', 'React Hook Form + Zod', 'Vercel']],
    ['Backend', ['Node.js + Express', 'TypeScript', 'MongoDB + Mongoose', 'JWT auth', 'Zod validation', 'Railway']],
    ['AI & Quality', ['Anthropic Claude (3.5 Sonnet)', 'Structured JSON prompts', 'Rate limiting', 'Jest + Supertest', 'GitHub Actions CI']],
  ] as const;

  return (
    <section id="stack" className="bg-white py-20 dark:bg-slate-950 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800 dark:text-emerald-300">Under the Hood</p>
          <h2 className="display mt-4 max-w-3xl text-5xl italic leading-none text-navy-950 dark:text-white lg:text-6xl">
            Production-grade stack, built to be read
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {groups.map(([title, items]) => (
            <article key={title} data-reveal className="rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="display text-3xl italic text-navy-950 dark:text-white">{title}</h3>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item} className="text-sm leading-6 text-stone-600 dark:text-slate-400">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
