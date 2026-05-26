'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { label: 'My Trips', href: '/trips', icon: TripsIcon },
  { label: 'New Trip', href: '/trips/new', icon: PlusIcon },
  { label: 'Profile', href: '/profile', icon: UserIcon },
];

function getInitials(name?: string | null, email?: string): string {
  const source = name?.trim() || email || 'Traveler';
  const parts = source.split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}` : source.slice(0, 2);
  return initials.toUpperCase();
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 16h25M16 3c3.6 3.7 5.4 8 5.4 13S19.6 25.3 16 29M16 3c-3.6 3.7-5.4 8-5.4 13S12.4 25.3 16 29" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 13h6V4H4v9ZM14 20h6V4h-6v16ZM4 20h6v-3H4v3Z" strokeLinejoin="round" />
    </svg>
  );
}

function TripsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 18V7.5A2.5 2.5 0 0 1 6.5 5H19v13H6.5A2.5 2.5 0 0 1 4 15.5V18Z" strokeLinejoin="round" />
      <path d="M7 8h8M7 11h6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

function CollapseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const initials = useMemo(() => getInitials(user?.name, user?.email), [user?.email, user?.name]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden border-r border-stone-200 bg-white/90 backdrop-blur-xl transition-[width] duration-200 ease-out dark:border-slate-800 dark:bg-slate-950/90 md:flex md:flex-col',
        isCollapsed ? 'w-20' : 'w-60',
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 text-navy-950 dark:text-white">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-sand-50 text-emerald-800 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300">
            <GlobeIcon className="h-5 w-5" />
          </span>
          <span className={cn('display text-3xl italic leading-none transition-opacity duration-150', isCollapsed && 'sr-only opacity-0')}>
            Voyai
          </span>
        </Link>

        <button
          type="button"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          className={cn(
            'hidden h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-all duration-150 ease-out hover:border-stone-300 hover:bg-stone-50 hover:text-navy-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white md:flex',
            isCollapsed && 'rotate-180',
          )}
        >
          <CollapseIcon className="h-4 w-4" />
        </button>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-600 transition-all duration-150 ease-out hover:bg-stone-50 hover:text-navy-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white',
                isCollapsed && 'justify-center px-0',
                isActive && 'bg-emerald-50/50 text-navy-950 dark:bg-emerald-950/30 dark:text-white',
              )}
            >
              <span
                className={cn(
                  'absolute left-0 top-2 h-6 w-px rounded-full bg-transparent transition-colors duration-150 ease-out',
                  isActive && 'bg-emerald-600',
                )}
              />
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className={cn(isCollapsed && 'sr-only')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-200 p-3 dark:border-slate-800">
        <div className={cn('flex items-center gap-3 rounded-lg bg-stone-50 p-3 dark:bg-slate-900', isCollapsed && 'justify-center p-2')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-950 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className={cn('min-w-0 flex-1', isCollapsed && 'sr-only')}>
            <p className="truncate text-sm font-semibold text-navy-950 dark:text-white">{user?.name ?? 'Voyai Traveler'}</p>
            <p className="truncate text-xs text-stone-500">{user?.email ?? 'traveler@voyai.app'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className={cn('mt-2 w-full', isCollapsed && 'sr-only')}>
          Logout
        </Button>
      </div>
    </aside>
  );
}
