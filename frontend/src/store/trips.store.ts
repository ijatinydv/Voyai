'use client';

import { create } from 'zustand';
import type { TripsState } from '@/types';

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
