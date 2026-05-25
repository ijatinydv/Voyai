'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { TripActivity } from '@/services/trip.service';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface ActivityItemProps {
  activity: TripActivity;
  currency?: string;
  isDeleting?: boolean;
  onSave: (activityId: string, data: Pick<TripActivity, 'title' | 'description'>) => Promise<void>;
  onDelete: (activityId: string) => void;
}

export function ActivityItem({ activity, currency = 'USD', isDeleting = false, onSave, onDelete }: ActivityItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      await onSave(activity.id, { title, description });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    setTitle(activity.title);
    setDescription(activity.description);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'relative pl-8 transition-all duration-200 ease-out',
        isDeleting && 'translate-x-4 opacity-0',
      )}
    >
      <span className="absolute left-[3px] top-2 h-3 w-3 rounded-full border-2 border-white bg-navy-950 shadow-sm" />
      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-3 animate-[inlineEditIn_150ms_ease-out]">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-navy-950 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
                />
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>
            ) : (
              <div className="animate-[inlineEditIn_150ms_ease-out]">
                <h4 className="text-sm font-semibold text-navy-950">{activity.title}</h4>
                <p className="mt-1 text-sm leading-6 text-stone-600">{activity.description}</p>
              </div>
            )}
          </div>

          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            {formatCurrency(activity.estimatedCost, currency)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={cancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button size="sm" onClick={save} isLoading={isSaving}>
                Save
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label={`Edit ${activity.title}`}
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-2 py-1 text-sm text-stone-500 transition-colors duration-150 ease-out hover:bg-stone-50 hover:text-navy-950"
              >
                ✏️
              </button>
              <button
                type="button"
                aria-label={`Delete ${activity.title}`}
                onClick={() => onDelete(activity.id)}
                className="rounded-lg px-2 py-1 text-sm text-stone-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
