'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { tripService } from '@/services/trip.service';
import { useTripsStore } from '@/store/trips.store';

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const currentTrip = useTripsStore((state) => state.currentTrip);
  const setCurrentTrip = useTripsStore((state) => state.setCurrentTrip);
  const setLoading = useTripsStore((state) => state.setLoading);
  const isLoading = useTripsStore((state) => state.isLoading);

  useEffect(() => {
    let isMounted = true;

    async function loadTrip() {
      if (!params.id || currentTrip?._id === params.id) return;

      setLoading(true);
      try {
        const trip = await tripService.getTripById(params.id);
        if (isMounted) setCurrentTrip(trip);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load trip.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTrip();

    return () => {
      isMounted = false;
    };
  }, [currentTrip?._id, params.id, setCurrentTrip, setLoading, toast]);

  const trip = currentTrip?._id === params.id ? currentTrip : null;

  if (isLoading && !trip) {
    return <div className="skeleton h-64 max-w-3xl" />;
  }

  if (!trip) {
    return (
      <section className="max-w-3xl rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="display text-5xl italic leading-none text-navy-950">Trip not found</h2>
        <Link href="/trips" className="mt-6 inline-flex text-sm font-semibold text-emerald-800">
          Back to trips
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Generated Trip</p>
      <h2 className="display mt-3 text-6xl italic leading-none text-navy-950">{trip.destination}</h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">
        {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'} planned with a {trip.budgetType} budget.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-navy-950">{trip.itinerary.length}</p>
          <p className="mt-2 text-sm text-stone-500">Itinerary days</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-navy-950">{trip.interests.length}</p>
          <p className="mt-2 text-sm text-stone-500">Interests</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold capitalize text-navy-950">{trip.budgetType}</p>
          <p className="mt-2 text-sm text-stone-500">Budget tier</p>
        </div>
      </div>
    </section>
  );
}
