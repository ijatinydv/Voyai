export type UserId = string & { readonly __brand: 'UserId' };
export type TripId = string & { readonly __brand: 'TripId' };
export type ActivityId = string & { readonly __brand: 'ActivityId' };
export type HotelId = string & { readonly __brand: 'HotelId' };

export type TripStatus = 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';
export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'adventure'
  | 'culture'
  | 'shopping'
  | 'relaxation'
  | 'transport';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD' | 'CAD';
export type TravelStyle = 'budget' | 'moderate' | 'luxury';
export type TravelerType = 'solo' | 'couple' | 'family' | 'group';

export interface User {
  readonly id: UserId;
  email: string;
  name: string;
  avatarUrl?: string;
  preferredCurrency: Currency;
  travelStyle: TravelStyle;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  readonly id: ActivityId;
  title: string;
  description: string;
  category: ActivityCategory;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    googleMapsUrl?: string;
  };
  durationMinutes: number;
  estimatedCost: number;
  currency: Currency;
  rating?: number;
  imageUrl?: string;
  bookingUrl?: string;
  tips?: string[];
}

export interface DayPlan {
  dayNumber: number;
  date: Date;
  theme: string;
  activities: Activity[];
  notes?: string;
}

export interface HotelSuggestion {
  readonly id: HotelId;
  name: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  location: {
    address: string;
    distanceFromCenterKm: number;
    lat: number;
    lng: number;
  };
  pricePerNightUsd: number;
  amenities: string[];
  imageUrl?: string;
  bookingUrl?: string;
  reviewScore?: number;
  reviewCount?: number;
}

export interface BudgetEstimate {
  currency: Currency;
  accommodation: number;
  activities: number;
  food: number;
  transport: number;
  miscellaneous: number;
  total: number;
  perPersonPerDay: number;
  breakdown: {
    label: string;
    amount: number;
    percentage: number;
  }[];
}

export interface PackingItem {
  id: string;
  name: string;
  quantity?: number;
  isPacked: boolean;
  isEssential: boolean;
}

export interface PackingCategory {
  id: string;
  name: string;
  icon: string;
  items: PackingItem[];
}

export interface Trip {
  readonly id: TripId;
  readonly userId: UserId;
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  coverImageUrl?: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  numberOfTravelers: number;
  travelerType: TravelerType;
  travelStyle: TravelStyle;
  status: TripStatus;
  dayPlans: DayPlan[];
  hotels: HotelSuggestion[];
  budget: BudgetEstimate;
  packingList: PackingCategory[];
  aiGeneratedSummary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripInput {
  destination: string;
  startDate: string; // ISO 8601 date string, e.g. "2024-12-01"
  endDate: string;
  numberOfTravelers: number;
  travelerType: TravelerType;
  travelStyle: TravelStyle;
  budget?: number;
  currency?: Currency;
  interests?: ActivityCategory[];
  specialRequirements?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}
