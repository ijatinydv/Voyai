import Link from 'next/link';
import type { Trip, BudgetType } from '@/services/trip.service';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

interface TripCardProps {
  trip: Trip;
  onDelete?: (trip: Trip) => void;
}

const budgetClasses: Record<BudgetType, string> = {
  low: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  medium: 'bg-sky-50 text-sky-800 ring-sky-200',
  high: 'bg-amber-50 text-amber-800 ring-amber-200',
};

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const visibleInterests = trip.interests.slice(0, 3);
  const moreCount = Math.max(trip.interests.length - visibleInterests.length, 0);

  return (
    <article className="group relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-950/10">
      <div className="h-1 bg-gradient-to-r from-emerald-700 via-sky-500 to-sand-300" />
      <div className="p-5">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
              Updated {formatDate(trip.updatedAt)}
            </p>
            <h2 className="display mt-3 truncate text-4xl italic leading-none text-navy-950">{trip.destination}</h2>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1', budgetClasses[trip.budgetType])}>
            {trip.budgetType}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
            {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'}
          </span>
          {visibleInterests.map((interest) => (
            <span key={interest} className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium capitalize text-stone-600">
              {interest}
            </span>
          ))}
          {moreCount > 0 ? (
            <span className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-500">+{moreCount} more</span>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Link
            href={`/trips/${trip._id}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-navy-950 px-4 text-sm font-medium text-white shadow-md shadow-navy-900/15 transition-all duration-150 ease-out hover:bg-navy-800"
          >
            View Trip
          </Link>
          <button
            type="button"
            aria-label={`Delete ${trip.destination} trip`}
            onClick={() => onDelete?.(trip)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-all duration-150 ease-out hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
