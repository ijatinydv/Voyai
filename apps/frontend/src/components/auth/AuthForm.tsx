import type { ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
    <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-sand-200 bg-white/95 p-8 shadow-xl shadow-navy-950/10">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sand-50/80 to-transparent" />
      <div className="relative">
        <div className="mb-10">
          <p className="mb-5 inline-flex rounded-full border border-sand-200 bg-sand-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-emerald-800">
            Voyai
          </p>
          <h1 className="display text-5xl italic leading-none text-navy-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
