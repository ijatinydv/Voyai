'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import type { Trip } from '@/services/trip.service';

interface DeleteTripModalProps {
  trip: Trip | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTripModal({ trip, isDeleting = false, onClose, onConfirm }: DeleteTripModalProps) {
  useEffect(() => {
    if (!trip) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, trip]);

  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close delete confirmation"
        className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <section role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-2xl shadow-navy-950/20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-red-600">Delete trip</p>
        <h2 className="display mt-3 text-4xl italic leading-none text-navy-950">Delete {trip.destination} trip?</h2>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          This removes the itinerary, budget estimate, hotel suggestions, and packing list from your Voyai workspace.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={isDeleting}>
            Delete trip
          </Button>
        </div>
      </section>
    </div>
  );
}
