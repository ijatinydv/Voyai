import { apiClient, del, get, patch, post, put } from '@/services/api.client';
import type {
  BudgetType,
  PaginatedTripApiResponse,
  TripActivity,
  TripApiModel,
  TripBudgetEstimate,
  TripCreateInput,
  TripDayPlan,
  TripHotelSuggestion,
  TripListResponse,
  TripPackingCategory,
  TripPackingItem,
} from '@/types';

export type { BudgetType, TripActivity, TripListResponse };
export type DayPlan = TripDayPlan;
export type BudgetEstimate = TripBudgetEstimate;
export type HotelSuggestion = TripHotelSuggestion;
export type PackingItem = TripPackingItem;
export type PackingCategory = TripPackingCategory;
export type Trip = TripApiModel;
export type TripInput = TripCreateInput;

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

  generateTrip: (tripId: string): Promise<Trip> => post<Trip>('/api/ai/generate', { tripId }),

  regenerateDay: (tripId: string, dayNumber: number, instruction: string): Promise<Trip> =>
    post<Trip>('/api/ai/regenerate-day', { tripId, dayNumber, instruction }),

  refreshHotels: (tripId: string): Promise<Trip> => post<Trip>('/api/ai/suggest-hotels', { tripId }),

  generatePackingList: (tripId: string): Promise<Trip> => post<Trip>('/api/ai/generate-packing-list', { tripId }),
};
