'use client';

import { useEffect, useMemo, useState } from 'react';
import { DeleteTripModal } from '@/components/trips/DeleteTripModal';
import { EmptyTrips } from '@/components/trips/EmptyTrips';
import { TripCard } from '@/components/trips/TripCard';
import { TripCardSkeleton } from '@/components/trips/TripCardSkeleton';
import { useToast } from '@/hooks/useToast';
import { tripService, type Trip } from '@/services/trip.service';
import { useTripsStore } from '@/store/trips.store';

type SortMode = 'newest' | 'oldest' | 'destination';

export default function TripsPage() {
  const toast = useToast();
  const trips = useTripsStore((state) => state.trips);
  const isLoading = useTripsStore((state) => state.isLoading);
  const setTrips = useTripsStore((state) => state.setTrips);
  const setLoading = useTripsStore((state) => state.setLoading);
  const removeTrip = useTripsStore((state) => state.removeTrip);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrips() {
      setLoading(true);
      try {
        const result = await tripService.getMyTrips(1, 48);
        if (isMounted) setTrips(result.data, result.pagination);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load trips.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTrips();

    return () => {
      isMounted = false;
    };
  }, [setLoading, setTrips, toast]);

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      if (sortMode === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortMode === 'destination') return a.destination.localeCompare(b.destination);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [sortMode, trips]);

  const handleDelete = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      await tripService.deleteTrip(tripToDelete._id);
      removeTrip(tripToDelete._id);
      toast.success(`${tripToDelete.destination} was deleted.`);
      setTripToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Trip Library</p>
          <h2 className="display mt-3 text-6xl italic leading-none text-navy-950">My Trips</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">
            Compare, reopen, and refine every itinerary you have shaped with Voyai.
          </p>
        </div>

        <label className="flex w-full max-w-xs flex-col gap-2 text-sm font-medium text-stone-600">
          Sort trips
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm text-navy-950 shadow-sm transition-all duration-150 ease-out focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="destination">Destination A-Z</option>
          </select>
        </label>
      </section>

      {isLoading && trips.length === 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TripCardSkeleton key={index} />
          ))}
        </section>
      ) : sortedTrips.length === 0 ? (
        <EmptyTrips />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} onDelete={setTripToDelete} />
          ))}
        </section>
      )}

      <DeleteTripModal
        trip={tripToDelete}
        isDeleting={isDeleting}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
