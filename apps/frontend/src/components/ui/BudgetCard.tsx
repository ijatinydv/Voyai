'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BudgetCardProps {
  icon: ReactNode;
  title: string;
  descriptor: string;
  selected: boolean;
  onSelect: () => void;
}

export function BudgetCard({ icon, title, descriptor, selected, onSelect }: BudgetCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'group relative flex w-full items-start gap-4 rounded-lg border bg-white p-5 text-left shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md',
        selected && 'border-2 border-emerald-700 bg-emerald-50/55 shadow-md shadow-emerald-950/5',
        !selected && 'border-stone-200',
      )}
    >
      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-navy-950">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-navy-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-stone-600">{descriptor}</span>
      </span>
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-150 ease-out',
          selected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-200 text-transparent',
        )}
      >
        ✓
      </span>
    </button>
  );
}
