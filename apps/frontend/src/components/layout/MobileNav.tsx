'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const tabs = [
  { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { label: 'Trips', href: '/trips', icon: TripsIcon },
  { label: 'New', href: '/trips/new', icon: PlusIcon },
  { label: 'Profile', href: '/profile', icon: UserIcon },
];

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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl shadow-navy-950/10 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-stone-500 transition-colors duration-150 ease-out',
                isActive && 'text-navy-950',
              )}
            >
              <span className={cn('absolute top-0 h-0.5 w-6 rounded-full bg-transparent', isActive && 'bg-emerald-600')} />
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
