export function HowItWorksSection() {
  const steps = [
    ['01', 'Create your account', 'Register securely. Your trips are private.'],
    ['02', 'Fill the trip form', 'Destination, days, budget tier, interests in a 3-step wizard.'],
    ['03', 'AI generates everything', 'Itinerary, budget, hotels, and packing list in one go.'],
    ['04', 'Edit and explore', 'Tweak activities, regenerate days, check off your packing list.'],
  ];

  return (
    <section id="how-it-works" className="bg-white py-20 dark:bg-slate-950 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800 dark:text-emerald-300">The Flow</p>
          <h2 className="display mt-4 max-w-3xl text-5xl italic leading-none text-navy-950 dark:text-white lg:text-6xl">
            From idea to full itinerary in four steps
          </h2>
        </div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-9 hidden border-t border-dashed border-stone-300 dark:border-slate-700 md:block" />
          {steps.map(([number, title, description]) => (
            <article key={number} data-reveal className="relative bg-white pr-5 dark:bg-slate-950">
              <p className="display text-6xl italic leading-none text-stone-300 dark:text-slate-700">{number}</p>
              <h3 className="mt-5 text-base font-semibold text-navy-950 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
