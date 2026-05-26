import type { UseFormReturn } from 'react-hook-form';

export interface TripFormData {
  destination: string;
  departureLocation?: string;
  startDate?: string;
  endDate?: string;
  numberOfDays?: number;
  numberOfTravelers?: number;
  travelerType?: TravelerType;
  travelStyle?: TravelStyle;
  budgetType?: UIBudgetType;
  budget?: number;
  currency?: Currency;
  interests: ActivityCategory[] | string[];
  specialRequirements?: string;
}

export type UIBudgetType = 'low' | 'medium' | 'high';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UIActivity extends Activity {
  isSelected?: boolean;
  isEditing?: boolean;
  localId?: string;
}

export interface UITripCard {
  id: string;
  title: string;
  destination: string;
  coverImageUrl?: string;
  dateRange: string;
  status: TripStatus;
  estimatedTotal?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export type BudgetType = 'low' | 'medium' | 'high';

export interface PlaceSuggestion {
  id: string;
  label: string;
  city?: string;
  country?: string;
}

export interface GeoapifyAutocompleteFeature {
  properties?: {
    place_id?: string;
    formatted?: string;
    city?: string;
    country?: string;
  };
}

export interface GeoapifyAutocompleteResponse {
  features?: GeoapifyAutocompleteFeature[];
}

export interface TripActivity {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
}

export interface TripDayPlan {
  dayNumber: number;
  activities: TripActivity[];
}

export interface TripBudgetEstimate {
  flights: number;
  localTransport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: string;
  notes: string;
}

export interface TripHotelSuggestion {
  name: string;
  type: 'budget' | 'mid-range' | 'luxury';
  estimatedPricePerNight: number;
  currency: string;
  highlights: string[];
}

export interface TripPackingItem {
  id: string;
  name: string;
  essential: boolean;
  quantity: number | null;
}

export interface TripPackingCategory {
  category: string;
  items: TripPackingItem[];
}

export interface TripApiModel {
  _id: string;
  userId: string;
  destination: string;
  departureLocation?: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  itinerary: TripDayPlan[];
  budgetEstimate: TripBudgetEstimate | null;
  hotelSuggestions: TripHotelSuggestion[];
  packingList: TripPackingCategory[];
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripCreateInput {
  destination: string;
  departureLocation?: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  customNotes?: string;
}

export interface TripListResponse {
  data: TripApiModel[];
  pagination: PaginationMeta;
}

export interface PaginatedTripApiResponse {
  success: boolean;
  data: TripApiModel[];
  pagination: PaginationMeta;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshSession {
  accessToken: string;
}

export type RefreshResponse = RefreshSession;

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string) => string;
    error: (message: string) => string;
    warning: (message: string) => string;
    info: (message: string) => string;
  };
}

export interface TripsState {
  trips: TripApiModel[];
  currentTrip: TripApiModel | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  setTrips: (trips: TripApiModel[], pagination?: PaginationMeta | null) => void;
  setCurrentTrip: (trip: TripApiModel | null) => void;
  removeTrip: (id: string) => void;
  addTrip: (trip: TripApiModel) => void;
  updateCurrentTrip: (trip: TripApiModel) => void;
  setLoading: (isLoading: boolean) => void;
}

export interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export interface UseItineraryResult {
  trip: TripApiModel;
  deletingActivityIds: Set<string>;
  regeneratingDays: Set<number>;
  addActivity: (dayNumber: number, data: Omit<TripActivity, 'id'>) => Promise<void>;
  updateActivity: (
    dayNumber: number,
    activityId: string,
    data: Pick<TripActivity, 'title' | 'description'>,
  ) => Promise<void>;
  deleteActivity: (dayNumber: number, activityId: string) => void;
  regenerateDay: (dayNumber: number, instruction: string) => Promise<void>;
  replaceTrip: (trip: TripApiModel) => void;
}

export interface PackingProgress {
  checked: number;
  total: number;
}

export interface UsePackingListResult {
  checkedItems: Set<string>;
  toggleItem: (itemId: string) => void;
  getProgress: () => PackingProgress;
  resetAll: () => void;
  exportToClipboard: () => Promise<void>;
}

export type Interest =
  | 'Food'
  | 'Culture'
  | 'Adventure'
  | 'Shopping'
  | 'Nature'
  | 'Nightlife'
  | 'History'
  | 'Art'
  | 'Sports'
  | 'Wellness';

export interface TripFormValues {
  destination: string;
  departureLocation: string;
  numberOfDays: number;
  budgetType: BudgetType | '';
  interests: Interest[];
}

export type StepDirection = 'next' | 'back';

export interface UseTripFormResult {
  form: UseFormReturn<TripFormValues>;
  currentStep: number;
  direction: StepDirection;
  isGenerating: boolean;
  loadingMessage: string;
  progress: number;
  goNext: () => Promise<void>;
  goBack: () => void;
  submit: () => Promise<void>;
  setNumberOfDays: (value: number) => void;
  selectBudget: (budget: BudgetType) => void;
  toggleInterest: (interest: Interest) => void;
}

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
  departureLocation?: string;
  startDate: string;
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
