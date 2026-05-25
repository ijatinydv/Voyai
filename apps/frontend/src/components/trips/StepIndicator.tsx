import { cn } from '@/utils/cn';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Destination', 'Preferences', 'Review'];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mx-auto mb-8 grid w-full max-w-xl grid-cols-3 gap-3">
      {steps.map((label, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={label} className="min-w-0">
            <div
              className={cn(
                'mb-2 h-0.5 rounded-full bg-stone-200 transition-colors duration-200 ease-out',
                isCurrent && 'bg-navy-950',
                isCompleted && 'bg-emerald-700',
              )}
            />
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ease-out',
                  isCurrent ? 'text-navy-950' : 'text-stone-400',
                  isCompleted && 'text-emerald-800',
                )}
              >
                {isCompleted ? '✓' : `0${index + 1}`}
              </span>
              <span className={cn('truncate text-sm font-medium', isCurrent ? 'text-navy-950' : 'text-stone-500')}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
