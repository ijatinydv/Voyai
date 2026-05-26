'use client';

import { useState } from 'react';
import { AddActivityForm } from '@/components/itinerary/AddActivityForm';
import { ActivityItem } from '@/components/itinerary/ActivityItem';
import { Button } from '@/components/ui/Button';
import type { DayPlan, TripActivity } from '@/services/trip.service';
import { cn } from '@/utils/cn';

interface DayCardProps {
  day: DayPlan;
  currency?: string;
  isRegenerating?: boolean;
  deletingActivityIds?: Set<string>;
  onAddActivity: (dayNumber: number, data: Omit<TripActivity, 'id'>) => Promise<void>;
  onUpdateActivity: (dayNumber: number, activityId: string, data: Pick<TripActivity, 'title' | 'description'>) => Promise<void>;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
  onRegenerateDay: (dayNumber: number) => void;
}

export function DayCard({
  day,
  currency,
  isRegenerating = false,
  deletingActivityIds = new Set(),
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onRegenerateDay,
}: DayCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      {isRegenerating ? <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px]"><div className="skeleton h-full w-full rounded-none" /></div> : null}
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-sm font-semibold text-white">
            {day.dayNumber}
          </span>
          <div>
            <h3 className="text-base font-semibold text-navy-950">Day {day.dayNumber}</h3>
            <p className="text-sm text-stone-500">{day.activities.length} planned activities</p>
          </div>
        </div>
        <span className={cn('text-stone-400 transition-transform duration-150 ease-out', isOpen && 'rotate-180')}>⌄</span>
      </button>

      {isOpen ? (
        <div className="border-t border-stone-100 p-5 pt-4">
          <div className="relative space-y-4 before:absolute before:left-[8px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-stone-200">
            {day.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                currency={currency}
                isDeleting={deletingActivityIds.has(activity.id)}
                onSave={(activityId, data) => onUpdateActivity(day.dayNumber, activityId, data)}
                onDelete={(activityId) => onDeleteActivity(day.dayNumber, activityId)}
              />
            ))}
          </div>

          {day.activities.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-200 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500">
              No activities yet. Add one or regenerate the day.
            </p>
          ) : null}

          {isAdding ? (
            <AddActivityForm
              onSubmit={async (data) => {
                await onAddActivity(day.dayNumber, data);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          ) : null}

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)}>
              Add Activity
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onRegenerateDay(day.dayNumber)}>
              Regenerate Day
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
