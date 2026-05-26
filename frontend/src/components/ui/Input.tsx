import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block space-y-2" htmlFor={inputId}>
        <span className="text-sm font-medium text-navy-800">{label}</span>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-navy-950 shadow-sm transition-all duration-150 ease-out',
            'placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
              : 'border-stone-200 hover:border-stone-300',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="block text-sm text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
