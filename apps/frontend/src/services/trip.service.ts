import type { PaginationMeta } from '@voyai/types';
import { apiClient, del, get, patch, post, put } from '@/services/api.client';

export type BudgetType = 'low' | 'medium' | 'high';

export interface TripActivity {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
}

export interface DayPlan {
  dayNumber: number;
  activities: TripActivity[];
}

export interface Trip {
  _id: string;
  userId: string;
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  itinerary: DayPlan[];
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripInput {
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  customNotes?: string;
}

export interface TripListResponse {
  data: Trip[];
  pagination: PaginationMeta;
}

interface PaginatedTripApiResponse {
  success: boolean;
  data: Trip[];
  pagination: PaginationMeta;
  timestamp: string;
}

export const tripService = {
  async getMyTrips(page = 1, limit = 12): Promise<TripListResponse> {
    const response = await apiClient.get<PaginatedTripApiResponse>('/api/trips', {
      params: { page, limit },
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getTripById: (id: string): Promise<Trip> => get<Trip>(`/api/trips/${id}`),

  createTrip: (data: TripInput): Promise<Trip> => post<Trip>('/api/trips', data),

  updateTrip: (id: string, data: Partial<TripInput>): Promise<Trip> => put<Trip>(`/api/trips/${id}`, data),

  deleteTrip: (id: string): Promise<null> => del<null>(`/api/trips/${id}`),

  addActivity: (tripId: string, dayNumber: number, activity: Omit<TripActivity, 'id'>): Promise<Trip> =>
    post<Trip>(`/api/trips/${tripId}/days/${dayNumber}/activities`, activity),

  updateActivity: (
    tripId: string,
    dayNumber: number,
    activityId: string,
    data: Partial<Omit<TripActivity, 'id'>>,
  ): Promise<Trip> => patch<Trip>(`/api/trips/${tripId}/days/${dayNumber}/activities/${activityId}`, data),

  deleteActivity: (tripId: string, dayNumber: number, activityId: string): Promise<Trip> =>
    del<Trip>(`/api/trips/${tripId}/days/${dayNumber}/activities/${activityId}`),
};
