'use client';

import { cn } from '@/utils/cn';

interface InterestPillProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function InterestPill({ label, selected, onToggle }: InterestPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ease-out',
        selected
          ? 'border-navy-950 bg-navy-950 text-white shadow-sm shadow-navy-950/15'
          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-navy-950',
      )}
    >
      {label}
    </button>
  );
}
