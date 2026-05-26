'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { initializeTheme, toggleTheme } from '@/utils/theme';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/trips': 'My Trips',
  '/trips/new': 'New Trip',
  '/profile': 'Profile',
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="m20 20-4.5-4.5M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M18 9a6 6 0 1 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9ZM10 21h4" strokeLinecap="round" strokeLinejoin="round" />
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

function getInitials(name?: string | null, email?: string): string {
  const source = name?.trim() || email || 'Traveler';
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const initials = useMemo(() => getInitials(user?.name, user?.email), [user?.email, user?.name]);
  const title = pageTitles[pathname] ?? (pathname.startsWith('/trips') ? 'My Trips' : 'Dashboard');

  useEffect(() => {
    initializeTheme();
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/trips?search=${encodeURIComponent(query)}` : '/trips');
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">Voyai</p>
          <h1 className="truncate text-lg font-semibold text-navy-950 dark:text-white">{title}</h1>
        </div>

        <form onSubmit={handleSearch} className="hidden h-10 w-full max-w-xs items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-400 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 lg:flex">
          <SearchIcon className="h-4 w-4" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search trips, places, notes"
            className="min-w-0 flex-1 bg-transparent text-sm text-navy-950 placeholder:text-stone-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
          />
        </form>

        <Link
          href="/trips/new"
          className="hidden h-9 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white shadow-md shadow-emerald-900/15 transition-all duration-150 ease-out hover:bg-emerald-800 sm:inline-flex"
        >
          New Trip
        </Link>

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={handleThemeToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 shadow-sm transition-all duration-150 ease-out hover:border-stone-300 hover:text-navy-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ThemeIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setIsNotificationsOpen((value) => !value)}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 shadow-sm transition-all duration-150 ease-out hover:border-stone-300 hover:text-navy-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <BellIcon className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
        </button>

        {isNotificationsOpen ? (
          <div className="absolute right-20 top-14 w-72 rounded-lg border border-stone-200 bg-white p-4 shadow-xl shadow-navy-950/10 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-navy-950 dark:text-white">Notifications</p>
            <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-slate-400">
              No new alerts right now. Trip generation updates will appear here.
            </p>
          </div>
        ) : null}

        <div className="relative">
          <button
            type="button"
            aria-label="Open user menu"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-sm font-semibold text-white shadow-sm transition-transform duration-150 ease-out hover:-translate-y-0.5"
          >
            {initials}
          </button>

          {isMenuOpen ? (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl shadow-navy-950/10">
              <div className="border-b border-stone-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-navy-950">{user?.name ?? 'Voyai Traveler'}</p>
                <p className="truncate text-xs text-stone-500">{user?.email ?? 'traveler@voyai.app'}</p>
              </div>
              <Link
                href="/profile"
                className="block px-4 py-3 text-sm text-stone-600 transition-colors duration-150 ease-out hover:bg-stone-50 hover:text-navy-950"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-3 text-left text-sm text-red-600 transition-colors duration-150 ease-out hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
