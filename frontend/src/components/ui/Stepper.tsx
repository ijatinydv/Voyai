'use client';

import { cn } from '@/utils/cn';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
}

export function Stepper({ value, min = 1, max = 30, onChange, label = 'Number of days' }: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-stone-600">{label}</p>
      <div className="inline-flex items-center rounded-full border border-stone-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          aria-label="Decrease days"
          onClick={decrement}
          disabled={value <= min}
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-medium text-navy-950 transition-all duration-150 ease-out hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-35"
        >
          -
        </button>
        <div className="flex min-w-24 flex-col items-center px-4">
          <span className="text-3xl font-semibold leading-none text-navy-950">{value}</span>
          <span className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
            {value === 1 ? 'day' : 'days'}
          </span>
        </div>
        <button
          type="button"
          aria-label="Increase days"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full text-xl font-medium text-navy-950 transition-all duration-150 ease-out hover:bg-stone-100',
            'disabled:pointer-events-none disabled:opacity-35',
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
