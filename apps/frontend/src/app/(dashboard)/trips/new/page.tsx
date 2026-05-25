import Link from 'next/link';

export default function NewTripPage() {
  return (
    <section className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">New Trip</p>
      <h2 className="display mt-3 text-6xl italic leading-none text-navy-950">Plan a new escape</h2>
      <p className="mt-4 text-sm leading-6 text-stone-600">
        The trip creation flow will connect here. For now, your dashboard shell and trip library are ready to receive it.
      </p>
      <Link
        href="/trips"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-navy-950 px-5 text-sm font-semibold text-white shadow-md shadow-navy-900/15 transition-all duration-150 ease-out hover:bg-navy-800"
      >
        Back to trips
      </Link>
    </section>
  );
}
