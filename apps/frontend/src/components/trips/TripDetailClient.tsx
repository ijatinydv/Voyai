'use client';

import { useMemo, useState } from 'react';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { DayCard } from '@/components/itinerary/DayCard';
import { RegenerateDayModal } from '@/components/itinerary/RegenerateDayModal';
import { HotelCard } from '@/components/hotels/HotelCard';
import { Button } from '@/components/ui/Button';
import { useItinerary } from '@/hooks/useItinerary';
import { useToast } from '@/hooks/useToast';
import { tripService, type BudgetType, type Trip } from '@/services/trip.service';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface TripDetailClientProps {
  initialTrip: Trip;
}

type TabKey = 'itinerary' | 'budget' | 'hotels' | 'packing';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'budget', label: 'Budget' },
  { key: 'hotels', label: 'Hotels' },
  { key: 'packing', label: 'Packing List' },
];

const budgetLabels: Record<BudgetType, string> = {
  low: 'Budget',
  medium: 'Standard',
  high: 'Premium',
};

const budgetBadgeClasses: Record<BudgetType, string> = {
  low: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  medium: 'bg-sky-50 text-sky-800 ring-sky-200',
  high: 'bg-amber-50 text-amber-800 ring-amber-200',
};

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M20 12a8 8 0 0 1-14.7 4.4M4 12A8 8 0 0 1 18.7 7.6M18 4v4h-4M6 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TripDetailClient({ initialTrip }: TripDetailClientProps) {
  const toast = useToast();
  const {
    trip,
    deletingActivityIds,
    regeneratingDays,
    addActivity,
    updateActivity,
    deleteActivity,
    regenerateDay,
    replaceTrip,
  } = useItinerary(initialTrip);
  const [activeTab, setActiveTab] = useState<TabKey>('itinerary');
  const [regeneratingDayNumber, setRegeneratingDayNumber] = useState<number | null>(null);
  const [isRefreshingHotels, setIsRefreshingHotels] = useState(false);
  const [isRefreshingBudget, setIsRefreshingBudget] = useState(false);

  const currency = trip.budgetEstimate?.currency ?? 'USD';
  const budgetCategories = useMemo(() => {
    const budget = trip.budgetEstimate;
    if (!budget) return [];

    return [
      { icon: '✈️', label: 'Flights', amount: budget.flights },
      { icon: '🏨', label: 'Accommodation', amount: budget.accommodation },
      { icon: '🍽️', label: 'Food', amount: budget.food },
      { icon: '🎟️', label: 'Activities', amount: budget.activities },
      { icon: '🧾', label: 'Miscellaneous', amount: budget.miscellaneous },
    ];
  }, [trip.budgetEstimate]);

  const refreshHotels = async () => {
    setIsRefreshingHotels(true);
    try {
      const updatedTrip = await tripService.refreshHotels(trip._id);
      replaceTrip(updatedTrip);
      toast.success('Hotel suggestions refreshed.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to refresh hotels.');
    } finally {
      setIsRefreshingHotels(false);
    }
  };

  const refreshBudget = async () => {
    setIsRefreshingBudget(true);
    try {
      const updatedTrip = await tripService.generateTrip(trip._id);
      replaceTrip(updatedTrip);
      toast.success('Budget regenerated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to regenerate budget.');
    } finally {
      setIsRefreshingBudget(false);
    }
  };

  const submitRegenerateDay = async (instruction: string) => {
    if (!regeneratingDayNumber) return;
    await regenerateDay(regeneratingDayNumber, instruction);
    setRegeneratingDayNumber(null);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Trip Detail</p>
        <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="display text-6xl italic leading-none text-navy-950">{trip.destination}</h2>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'}
              </span>
              <span className={cn('rounded-full px-3 py-1.5 text-sm font-semibold ring-1', budgetBadgeClasses[trip.budgetType])}>
                {budgetLabels[trip.budgetType]}
              </span>
              {trip.interests.map((interest) => (
                <span key={interest} className="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium capitalize text-stone-600">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-stone-200">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors duration-150 ease-out',
                activeTab === tab.key
                  ? 'border-navy-950 text-navy-950'
                  : 'border-transparent text-stone-500 hover:text-navy-950',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'itinerary' ? (
        <section className="space-y-4">
          {trip.itinerary.map((day) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              currency={currency}
              isRegenerating={regeneratingDays.has(day.dayNumber)}
              deletingActivityIds={deletingActivityIds}
              onAddActivity={addActivity}
              onUpdateActivity={updateActivity}
              onDeleteActivity={deleteActivity}
              onRegenerateDay={setRegeneratingDayNumber}
            />
          ))}
        </section>
      ) : null}

      {activeTab === 'budget' ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-navy-950">Budget estimate</h3>
              <p className="mt-1 text-sm text-stone-500">AI-generated category breakdown.</p>
            </div>
            <button
              type="button"
              aria-label="Regenerate budget"
              onClick={refreshBudget}
              disabled={isRefreshingBudget}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-all duration-150 ease-out hover:border-stone-300 hover:text-navy-950 disabled:opacity-50"
            >
              <RefreshIcon className={cn('h-4 w-4', isRefreshingBudget && 'animate-spin')} />
            </button>
          </div>

          {trip.budgetEstimate ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {budgetCategories.map((category) => (
                  <BudgetCard
                    key={category.label}
                    icon={category.icon}
                    label={category.label}
                    amount={category.amount}
                    total={trip.budgetEstimate?.total ?? 0}
                    currency={currency}
                  />
                ))}
              </div>
              <div className="rounded-lg bg-navy-950 p-6 text-white shadow-xl shadow-navy-950/15">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/60">Estimated Total</p>
                <p className="mt-3 font-mono text-5xl font-semibold tabular-nums">
                  {formatCurrency(trip.budgetEstimate.total, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600 shadow-sm">
                {trip.budgetEstimate.notes}
              </div>
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
              No budget estimate yet. Regenerate the trip to create one.
            </p>
          )}
        </section>
      ) : null}

      {activeTab === 'hotels' ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-navy-950">Hotel suggestions</h3>
              <p className="mt-1 text-sm text-stone-500">Curated for this destination and budget tier.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={refreshHotels} isLoading={isRefreshingHotels}>
              Refresh Suggestions
            </Button>
          </div>
          {trip.hotelSuggestions.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {trip.hotelSuggestions.slice(0, 5).map((hotel) => (
                <HotelCard key={`${hotel.name}-${hotel.estimatedPricePerNight}`} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
              No hotel suggestions yet.
            </p>
          )}
        </section>
      ) : null}

      {activeTab === 'packing' ? (
        <section className="grid gap-4 md:grid-cols-2">
          {trip.packingList.length > 0 ? (
            trip.packingList.map((category) => (
              <article key={category.category} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-navy-950">{category.category}</h3>
                <ul className="mt-4 space-y-3">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 text-sm text-stone-600">
                      <span>{item.name}</span>
                      <span className="text-xs font-medium text-stone-400">
                        {item.quantity ? `x${item.quantity}` : item.essential ? 'Essential' : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500 md:col-span-2">
              Packing list generation is ready for the next implementation prompt.
            </p>
          )}
        </section>
      ) : null}

      <RegenerateDayModal
        dayNumber={regeneratingDayNumber}
        isLoading={regeneratingDayNumber ? regeneratingDays.has(regeneratingDayNumber) : false}
        onClose={() => setRegeneratingDayNumber(null)}
        onSubmit={submitRegenerateDay}
      />
    </div>
  );
}
