'use client';

import { BudgetCard } from '@/components/ui/BudgetCard';
import { InterestPill } from '@/components/ui/InterestPill';
import { Stepper } from '@/components/ui/Stepper';
import { StepIndicator } from '@/components/trips/StepIndicator';
import { StepNavigation } from '@/components/trips/StepNavigation';
import { interests, type Interest, useTripForm } from '@/hooks/useTripForm';
import type { BudgetType } from '@/services/trip.service';
import { cn } from '@/utils/cn';

const budgetOptions: Array<{
  value: BudgetType;
  title: string;
  descriptor: string;
  icon: JSX.Element;
}> = [
  {
    value: 'low',
    title: 'Budget',
    descriptor: 'Hostels, street food, shared transport',
    icon: <BudgetIcon />,
  },
  {
    value: 'medium',
    title: 'Standard',
    descriptor: '3-star hotels, local restaurants, mixed transport',
    icon: <StandardIcon />,
  },
  {
    value: 'high',
    title: 'Premium',
    descriptor: 'Luxury hotels, fine dining, private transfers',
    icon: <PremiumIcon />,
  },
];

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9S14.4 18.4 12 21M12 3c-2.4 2.6-3.6 5.6-3.6 9s1.2 6.4 3.6 9" strokeLinecap="round" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
      <path d="M4 10h16v9H4v-9ZM7 10V7.5A3.5 3.5 0 0 1 10.5 4H16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StandardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
      <path d="M5 19V7l7-3 7 3v12M8 19v-7h8v7M10 9h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PremiumIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
      <path d="m12 3 3 6 6 .9-4.5 4.3 1.1 6.2L12 17.5l-5.6 2.9 1.1-6.2L3 9.9 9 9l3-6Z" strokeLinejoin="round" />
    </svg>
  );
}

function PlaneIcon({ className = 'h-9 w-9 animate-[wizardPlane_1.8s_ease-in-out_infinite]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <path d="M27 5 13.5 18.5M27 5l-7 22-6.5-8.5L5 12 27 5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NewTripPage() {
  const {
    form,
    currentStep,
    direction,
    isGenerating,
    loadingMessage,
    progress,
    goNext,
    goBack,
    submit,
    setNumberOfDays,
    selectBudget,
    toggleInterest,
  } = useTripForm();

  const destination = form.watch('destination');
  const departureLocation = form.watch('departureLocation');
  const numberOfDays = form.watch('numberOfDays');
  const budgetType = form.watch('budgetType');
  const selectedInterests = form.watch('interests');
  const selectedBudget = budgetOptions.find((budget) => budget.value === budgetType);

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator currentStep={currentStep} />

      <section
        key={currentStep}
        className={cn(
          'mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-6 shadow-xl shadow-navy-950/5 sm:p-8',
          direction === 'next'
            ? 'animate-[wizardSlideFromRight_220ms_ease-out]'
            : 'animate-[wizardSlideFromLeft_220ms_ease-out]',
        )}
      >
        {currentStep === 0 ? (
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Step 1</p>
            <h2 className="display mt-3 text-5xl italic leading-none text-navy-950">Where are you headed?</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">Start with the place. Voyai will shape the details around it.</p>

            <label className="mt-8 block">
              <span className="sr-only">Destination</span>
              <div className="flex items-center gap-4 rounded-lg border border-stone-200 bg-stone-50 px-6 py-4 transition-all duration-150 ease-out focus-within:border-emerald-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                <GlobeIcon className="h-6 w-6 shrink-0 text-emerald-800" />
                <input
                  {...form.register('destination')}
                  placeholder="Search a destination"
                  className="min-w-0 flex-1 bg-transparent text-xl font-medium text-navy-950 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              {form.formState.errors.destination ? (
                <span className="mt-2 block text-sm text-red-600">{form.formState.errors.destination.message}</span>
              ) : null}
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-stone-600">Where are you leaving from?</span>
              <div className="mt-2 flex items-center gap-4 rounded-lg border border-stone-200 bg-stone-50 px-6 py-4 transition-all duration-150 ease-out focus-within:border-emerald-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                <PlaneIcon className="h-6 w-6 shrink-0 text-emerald-800" />
                <input
                  {...form.register('departureLocation')}
                  placeholder="e.g. Mumbai, New York, London"
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-navy-950 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              <span className="mt-2 block text-xs leading-5 text-stone-500">
                Optional, but it makes flight and transport estimates more realistic.
              </span>
            </label>

            <div className="mt-8">
              <Stepper value={numberOfDays} min={1} max={30} onChange={setNumberOfDays} />
            </div>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Step 2</p>
            <h2 className="display mt-3 text-5xl italic leading-none text-navy-950">Set the travel texture</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">Choose the budget rhythm and the experiences that should lead the itinerary.</p>

            <div className="mt-8 space-y-3">
              {budgetOptions.map((budget) => (
                <BudgetCard
                  key={budget.value}
                  icon={budget.icon}
                  title={budget.title}
                  descriptor={budget.descriptor}
                  selected={budgetType === budget.value}
                  onSelect={() => selectBudget(budget.value)}
                />
              ))}
              {form.formState.errors.budgetType ? (
                <p className="text-sm text-red-600">{form.formState.errors.budgetType.message}</p>
              ) : null}
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-stone-600">Interests</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <InterestPill
                    key={interest}
                    label={interest}
                    selected={selectedInterests.includes(interest)}
                    onToggle={() => toggleInterest(interest)}
                  />
                ))}
              </div>
              {form.formState.errors.interests ? (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.interests.message}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Step 3</p>
            <h2 className="display mt-3 text-5xl italic leading-none text-navy-950">Review the brief</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">A clean snapshot before Voyai builds the itinerary, budget, hotels, and packing list.</p>

            <div className="mt-8 rounded-lg border border-stone-200 bg-stone-50 p-5">
              <div className="border-b border-dashed border-stone-300 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Destination</p>
                <p className="display mt-2 text-4xl italic leading-none text-navy-950">{destination || 'Not selected'}</p>
              </div>
              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-stone-500">Leaving from</dt>
                  <dd className="text-sm font-semibold text-navy-950">{departureLocation || 'Not provided'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-stone-500">Duration</dt>
                  <dd className="text-sm font-semibold text-navy-950">
                    {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-stone-500">Budget tier</dt>
                  <dd className="text-sm font-semibold text-navy-950">{selectedBudget?.title ?? 'Not selected'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">Interests</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {selectedInterests.map((interest: Interest) => (
                      <span key={interest} className="rounded-full bg-navy-950 px-3 py-1.5 text-xs font-medium text-white">
                        {interest}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : null}

        <StepNavigation
          currentStep={currentStep}
          isGenerating={isGenerating}
          onBack={goBack}
          onNext={goNext}
          onGenerate={submit}
        />
      </section>

      {isGenerating ? (
        <div className="fixed inset-0 z-[450] flex items-center justify-center bg-navy-950/70 px-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-lg border border-white/20 bg-white p-7 text-center shadow-2xl shadow-navy-950/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-emerald-800">
              <PlaneIcon />
            </div>
            <p className="mt-6 text-lg font-semibold text-navy-950">{loadingMessage}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">This can take a moment while Voyai stitches the trip together.</p>
            <div className="mt-7 h-2 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-emerald-700 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
