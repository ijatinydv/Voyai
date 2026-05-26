import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeTone = 'stone' | 'emerald' | 'amber' | 'sky' | 'navy';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  stone: 'border-stone-200 bg-white text-stone-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200',
  amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
  sky: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200',
  navy: 'border-navy-900 bg-navy-950 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-950',
};

export function Badge({ className, tone = 'stone', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
