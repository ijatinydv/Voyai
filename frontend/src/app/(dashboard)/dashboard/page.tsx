'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { EmptyTrips } from '@/components/trips/EmptyTrips';
import { TripCard } from '@/components/trips/TripCard';
import { TripCardSkeleton } from '@/components/trips/TripCardSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { tripService } from '@/services/trip.service';
import { useTripsStore } from '@/store/trips.store';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const trips = useTripsStore((state) => state.trips);
  const isLoading = useTripsStore((state) => state.isLoading);
  const setTrips = useTripsStore((state) => state.setTrips);
  const setLoading = useTripsStore((state) => state.setLoading);

  useEffect(() => {
    let isMounted = true;

    async function loadTrips() {
      setLoading(true);
      try {
        const result = await tripService.getMyTrips(1, 24);
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

  const stats = useMemo(() => {
    const destinations = new Set(trips.map((trip) => trip.destination.trim().toLowerCase())).size;
    const daysPlanned = trips.reduce((total, trip) => total + trip.numberOfDays, 0);

    return [
      { label: 'Total Trips', value: trips.length },
      { label: 'Days Planned', value: daysPlanned },
      { label: 'Destinations', value: destinations },
    ];
  }, [trips]);

  const recentTrips = useMemo(
    () => [...trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3),
    [trips],
  );

  if (isLoading && trips.length === 0) {
    return (
      <div className="space-y-10">
        <div className="skeleton h-20 max-w-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          <TripCardSkeleton />
          <TripCardSkeleton />
          <TripCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-11">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Today in Voyai</p>
          <h2 className="display mt-3 text-6xl italic leading-none text-navy-950 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Traveler'}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Keep your upcoming plans organized, polished, and easy to act on.
          </p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex h-11 w-fit items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          Plan New Trip
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-4xl font-semibold leading-none text-navy-950">{stat.value}</p>
            <p className="mt-3 text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {trips.length === 0 ? (
        <EmptyTrips />
      ) : (
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-navy-950">Recent trips</h3>
              <p className="mt-1 text-sm text-stone-500">The latest itineraries in your workspace.</p>
            </div>
            <Link href="/trips" className="text-sm font-semibold text-emerald-800 transition-colors duration-150 ease-out hover:text-emerald-900">
              View all
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {recentTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
