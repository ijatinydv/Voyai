import { randomUUID } from 'node:crypto';
import { z, type ZodSchema } from 'zod';
import type { PaginationMeta } from '@voyai/types';
import {
  TripModel,
  type IBudgetEstimate,
  type IDayPlan,
  type IHotelSuggestion,
  type ITrip,
  type IPackingCategory,
} from '../models/Trip.model.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/AppError.js';
import {
  activityInputSchema,
  activityUpdateSchema,
  budgetEstimateSchema,
  hotelSuggestionsSchema,
  itinerarySchema,
  packingListSchema,
  tripInputSchema,
  tripUpdateSchema,
} from '../utils/validate.js';

type TripInput = z.infer<typeof tripInputSchema>;
type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
type ActivityInput = z.infer<typeof activityInputSchema>;
type ActivityUpdateInput = z.infer<typeof activityUpdateSchema>;

interface PaginatedTrips {
  data: ITrip[];
  pagination: PaginationMeta;
}

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

function parseInput<T>(schema: ZodSchema<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new BadRequestError(result.error.issues.map((issue) => issue.message).join(', '));
  return result.data;
}

function parseObjectId(value: string, fieldName: string): string {
  const result = objectIdSchema.safeParse(value);
  if (!result.success) throw new BadRequestError(`Invalid ${fieldName}`);
  return result.data;
}

function buildInitialItinerary(numberOfDays: number): IDayPlan[] {
  return Array.from({ length: numberOfDays }, (_value, index) => ({
    dayNumber: index + 1,
    activities: [],
  }));
}

function requireTrip(trip: ITrip | null): ITrip {
  if (!trip) throw new ForbiddenError('Trip not accessible');
  return trip;
}

export async function createTrip(userId: string, data: TripInput): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const tripData = parseInput(tripInputSchema, data);

  return TripModel.create({
    ...tripData,
    userId: validatedUserId,
    itinerary: buildInitialItinerary(tripData.numberOfDays),
  });
}

export async function getUserTrips(userId: string, page: number, limit: number): Promise<PaginatedTrips> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const safePage = Number.isFinite(page) ? Math.max(1, page) : 1;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(1, limit), 100) : 20;
  const skip = (safePage - 1) * safeLimit;

  const [trips, total] = await Promise.all([
    TripModel.find({ userId: validatedUserId }).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    TripModel.countDocuments({ userId: validatedUserId }),
  ]);
  const totalPages = Math.ceil(total / safeLimit);

  return {
    data: trips,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  };
}

export async function getTripById(userId: string, tripId: string): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');
  const trip = await TripModel.findOne({ _id: validatedTripId, userId: validatedUserId });

  return requireTrip(trip);
}

export async function updateTrip(userId: string, tripId: string, data: TripUpdateInput): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');
  const updateData = parseInput(tripUpdateSchema, data);

  await getTripById(validatedUserId, validatedTripId);
  const trip = await TripModel.findOneAndUpdate(
    { _id: validatedTripId, userId: validatedUserId },
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return requireTrip(trip);
}

export async function deleteTrip(userId: string, tripId: string): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');

  await getTripById(validatedUserId, validatedTripId);
  const trip = await TripModel.findOneAndDelete({ _id: validatedTripId, userId: validatedUserId });

  return requireTrip(trip);
}

export async function addActivity(
  userId: string,
  tripId: string,
  dayNumber: number,
  activity: ActivityInput,
): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');
  const validatedActivity = parseInput(activityInputSchema, activity);

  await getTripById(validatedUserId, validatedTripId);
  const trip = await TripModel.findOneAndUpdate(
    { _id: validatedTripId, userId: validatedUserId, 'itinerary.dayNumber': dayNumber },
    {
      $push: {
        'itinerary.$.activities': {
          id: validatedActivity.id ?? randomUUID(),
          title: validatedActivity.title,
          description: validatedActivity.description,
          estimatedCost: validatedActivity.estimatedCost,
        },
      },
    },
    { new: true, runValidators: true },
  );

  if (!trip) throw new NotFoundError('Day not found');
  return trip;
}

export async function updateActivity(
  userId: string,
  tripId: string,
  dayNumber: number,
  activityId: string,
  data: ActivityUpdateInput,
): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');
  const updateData = parseInput(activityUpdateSchema, data);

  await getTripById(validatedUserId, validatedTripId);
  const $set = Object.fromEntries(
    Object.entries(updateData).map(([key, value]) => [`itinerary.$[day].activities.$[activity].${key}`, value]),
  );
  const trip = await TripModel.findOneAndUpdate(
    {
      _id: validatedTripId,
      userId: validatedUserId,
      itinerary: { $elemMatch: { dayNumber, 'activities.id': activityId } },
    },
    { $set },
    {
      new: true,
      runValidators: true,
      arrayFilters: [{ 'day.dayNumber': dayNumber }, { 'activity.id': activityId }],
    },
  );

  if (!trip) throw new NotFoundError('Activity not found');
  return trip;
}

export async function deleteActivity(
  userId: string,
  tripId: string,
  dayNumber: number,
  activityId: string,
): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');

  await getTripById(validatedUserId, validatedTripId);
  const trip = await TripModel.findOneAndUpdate(
    {
      _id: validatedTripId,
      userId: validatedUserId,
      itinerary: { $elemMatch: { dayNumber, 'activities.id': activityId } },
    },
    { $pull: { 'itinerary.$.activities': { id: activityId } } },
    { new: true, runValidators: true },
  );

  if (!trip) throw new NotFoundError('Day not found');
  return trip;
}

export async function updateItinerary(userId: string, tripId: string, itinerary: IDayPlan[]): Promise<ITrip> {
  const validatedItinerary = parseInput(itinerarySchema, itinerary);
  const normalizedItinerary: IDayPlan[] = validatedItinerary.map((day) => ({
    dayNumber: day.dayNumber,
    activities: (day.activities ?? []).map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      estimatedCost: activity.estimatedCost ?? 0,
    })),
  }));

  return setTripField(userId, tripId, { itinerary: normalizedItinerary });
}

export async function updateBudget(
  userId: string,
  tripId: string,
  budget: IBudgetEstimate,
): Promise<ITrip> {
  const validatedBudget = parseInput(budgetEstimateSchema, budget);
  return setTripField(userId, tripId, { budgetEstimate: validatedBudget });
}

export async function updateHotels(
  userId: string,
  tripId: string,
  hotels: IHotelSuggestion[],
): Promise<ITrip> {
  const validatedHotels = parseInput(hotelSuggestionsSchema, hotels);
  return setTripField(userId, tripId, { hotelSuggestions: validatedHotels });
}

export async function updatePackingList(
  userId: string,
  tripId: string,
  packingList: IPackingCategory[],
): Promise<ITrip> {
  const validatedPackingList = parseInput(packingListSchema, packingList);
  const normalizedPackingList: IPackingCategory[] = validatedPackingList.map((category) => ({
    category: category.category,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      essential: item.essential ?? false,
      quantity: item.quantity ?? null,
    })),
  }));

  return setTripField(userId, tripId, { packingList: normalizedPackingList });
}

async function setTripField(userId: string, tripId: string, data: Record<string, unknown>): Promise<ITrip> {
  const validatedUserId = parseObjectId(userId, 'user id');
  const validatedTripId = parseObjectId(tripId, 'trip id');

  await getTripById(validatedUserId, validatedTripId);
  const trip = await TripModel.findOneAndUpdate(
    { _id: validatedTripId, userId: validatedUserId },
    { $set: data },
    { new: true, runValidators: true },
  );

  return requireTrip(trip);
}
