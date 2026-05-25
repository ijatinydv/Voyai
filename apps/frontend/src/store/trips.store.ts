'use client';

import { create } from 'zustand';
import type { PaginationMeta } from '@voyai/types';
import type { Trip } from '@/services/trip.service';

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  setTrips: (trips: Trip[], pagination?: PaginationMeta | null) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  removeTrip: (id: string) => void;
  addTrip: (trip: Trip) => void;
  updateCurrentTrip: (trip: Trip) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  currentTrip: null,
  pagination: null,
  isLoading: false,
  setTrips: (trips, pagination = null) => set({ trips, pagination }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  removeTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip._id !== id),
      currentTrip: state.currentTrip?._id === id ? null : state.currentTrip,
    })),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateCurrentTrip: (trip) =>
    set((state) => ({
      currentTrip: trip,
      trips: state.trips.map((item) => (item._id === trip._id ? trip : item)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
