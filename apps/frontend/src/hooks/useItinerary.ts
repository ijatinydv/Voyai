'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { tripService, type DayPlan, type Trip, type TripActivity } from '@/services/trip.service';
import { useTripsStore } from '@/store/trips.store';

function updateDay(trip: Trip, dayNumber: number, updater: (day: DayPlan) => DayPlan): Trip {
  return {
    ...trip,
    itinerary: trip.itinerary.map((day) => (day.dayNumber === dayNumber ? updater(day) : day)),
  };
}

interface UseItineraryResult {
  trip: Trip;
  deletingActivityIds: Set<string>;
  regeneratingDays: Set<number>;
  addActivity: (dayNumber: number, data: Omit<TripActivity, 'id'>) => Promise<void>;
  updateActivity: (dayNumber: number, activityId: string, data: Pick<TripActivity, 'title' | 'description'>) => Promise<void>;
  deleteActivity: (dayNumber: number, activityId: string) => void;
  regenerateDay: (dayNumber: number, instruction: string) => Promise<void>;
  replaceTrip: (trip: Trip) => void;
}

export function useItinerary(initialTrip: Trip): UseItineraryResult {
  const toast = useToast();
  const updateCurrentTrip = useTripsStore((state) => state.updateCurrentTrip);
  const [trip, setTrip] = useState(initialTrip);
  const [deletingActivityIds, setDeletingActivityIds] = useState<Set<string>>(new Set());
  const [regeneratingDays, setRegeneratingDays] = useState<Set<number>>(new Set());

  const commitTrip = (nextTrip: Trip) => {
    setTrip(nextTrip);
    updateCurrentTrip(nextTrip);
  };

  const addActivity = async (dayNumber: number, data: Omit<TripActivity, 'id'>) => {
    const previousTrip = trip;
    const optimisticActivity: TripActivity = {
      ...data,
      id: `temp-${Date.now()}`,
    };
    const optimisticTrip = updateDay(trip, dayNumber, (day) => ({
      ...day,
      activities: [...day.activities, optimisticActivity],
    }));

    commitTrip(optimisticTrip);

    try {
      const syncedTrip = await tripService.addActivity(trip._id, dayNumber, data);
      commitTrip(syncedTrip);
      toast.success('Activity added.');
    } catch (error) {
      commitTrip(previousTrip);
      toast.error(error instanceof Error ? error.message : 'Unable to add activity.');
    }
  };

  const updateActivity = async (
    dayNumber: number,
    activityId: string,
    data: Pick<TripActivity, 'title' | 'description'>,
  ) => {
    const previousTrip = trip;
    const optimisticTrip = updateDay(trip, dayNumber, (day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.id === activityId ? { ...activity, ...data } : activity,
      ),
    }));

    commitTrip(optimisticTrip);

    try {
      const syncedTrip = await tripService.updateActivity(trip._id, dayNumber, activityId, data);
      commitTrip(syncedTrip);
      toast.success('Activity updated.');
    } catch (error) {
      commitTrip(previousTrip);
      toast.error(error instanceof Error ? error.message : 'Unable to update activity.');
    }
  };

  const deleteActivity = (dayNumber: number, activityId: string) => {
    const previousTrip = trip;

    setDeletingActivityIds((current) => new Set(current).add(activityId));

    window.setTimeout(async () => {
      const optimisticTrip = updateDay(previousTrip, dayNumber, (day) => ({
        ...day,
        activities: day.activities.filter((activity) => activity.id !== activityId),
      }));

      commitTrip(optimisticTrip);

      try {
        const syncedTrip = await tripService.deleteActivity(previousTrip._id, dayNumber, activityId);
        commitTrip(syncedTrip);
        toast.success('Activity deleted.');
      } catch (error) {
        commitTrip(previousTrip);
        toast.error(error instanceof Error ? error.message : 'Unable to delete activity.');
      } finally {
        setDeletingActivityIds((current) => {
          const next = new Set(current);
          next.delete(activityId);
          return next;
        });
      }
    }, 180);
  };

  const regenerateDay = async (dayNumber: number, instruction: string) => {
    setRegeneratingDays((current) => new Set(current).add(dayNumber));

    try {
      const syncedTrip = await tripService.regenerateDay(trip._id, dayNumber, instruction);
      commitTrip(syncedTrip);
      toast.success(`Day ${dayNumber} regenerated.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Unable to regenerate Day ${dayNumber}.`);
    } finally {
      setRegeneratingDays((current) => {
        const next = new Set(current);
        next.delete(dayNumber);
        return next;
      });
    }
  };

  return {
    trip,
    deletingActivityIds,
    regeneratingDays,
    addActivity,
    updateActivity,
    deleteActivity,
    regenerateDay,
    replaceTrip: commitTrip,
  };
}
