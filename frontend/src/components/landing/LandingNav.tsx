'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { initializeTheme, toggleTheme as toggleSavedTheme } from '@/utils/theme';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
];

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="12" />
      <path d="m20.8 11.2-3.4 7.1-6.2 2.5 3.4-7.1 6.2-2.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M12 3v2M12 19v2M4.6 4.6 6 6M18 18l1.4 1.4M3 12h2M19 12h2M4.6 19.4 6 18M18 6l1.4-1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    initializeTheme();
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    toggleSavedTheme();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/78 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-navy-950 dark:text-white">
          <CompassIcon className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
          <span className="display text-3xl italic leading-none">Voyai</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-stone-600 transition-colors duration-150 ease-out hover:text-navy-950 dark:text-slate-300 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button type="button" aria-label="Toggle dark mode" onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition-colors duration-150 ease-out hover:bg-white hover:text-navy-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
            <ThemeIcon className="h-4 w-4" />
          </button>
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-navy-700 transition-colors duration-150 ease-out hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900">
            Sign in
          </Link>
          <Link href="/register" className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800">
            Start planning →
          </Link>
        </div>

        <button type="button" aria-label="Open menu" onClick={() => setIsOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-navy-950 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <div className={cn('fixed inset-0 z-50 bg-stone-50 px-5 py-5 transition-transform duration-200 ease-out dark:bg-slate-950 md:hidden', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-navy-950 dark:text-white" onClick={() => setIsOpen(false)}>
            <CompassIcon className="h-8 w-8 text-emerald-700" />
            <span className="display text-3xl italic">Voyai</span>
          </Link>
          <button type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-navy-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-12 grid gap-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="display text-5xl italic text-navy-950 dark:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 grid gap-3">
          <button type="button" onClick={toggleTheme} className="h-12 rounded-full border border-stone-200 bg-white text-sm font-semibold text-navy-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            Toggle theme
          </button>
          <Link href="/login" className="flex h-12 items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-semibold text-navy-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            Sign in
          </Link>
          <Link href="/register" className="flex h-12 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
            Start planning →
          </Link>
        </div>
      </div>
    </header>
  );
}
