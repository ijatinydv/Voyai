'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { MobileNav } from '@/components/layout/MobileNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-navy-950 dark:bg-slate-950 dark:text-white">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((value) => !value)} />
      <div className={cn('min-h-screen transition-[padding] duration-200 ease-out md:pl-60', isCollapsed && 'md:pl-20')}>
        <TopBar />
        <main className="px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-12">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
