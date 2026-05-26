import { type NextFunction, type Request, type Response } from 'express';
import type { ApiResponse, IDayPlan, ITrip } from '../types';
import { estimateBudget } from '../services/budget.service.js';
import { suggestHotels as suggestHotelOptions } from '../services/hotel.service.js';
import { generateItinerary, regenerateSingleDay, type TripInput } from '../services/itinerary.service.js';
import { generatePackingList as generatePackingListForTrip } from '../services/packing.service.js';
import * as tripService from '../services/trip.service.js';
import { NotFoundError, UnauthorizedError } from '../utils/AppError.js';

function userIdFrom(req: Request): string {
  if (!req.user) throw new UnauthorizedError('Not authenticated');
  return req.user.id;
}

function tripInputFrom(trip: ITrip): TripInput {
  return {
    destination: trip.destination,
    ...(trip.departureLocation ? { departureLocation: trip.departureLocation } : {}),
    numberOfDays: trip.numberOfDays,
    budgetType: trip.budgetType,
    interests: trip.interests,
    ...(trip.customNotes ? { customNotes: trip.customNotes } : {}),
  };
}

function sendTrip(res: Response, trip: ITrip, message: string): void {
  const response: ApiResponse<ITrip> = {
    success: true,
    data: trip,
    message,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}

function normalizeItineraryCosts(itinerary: IDayPlan[], activityBudget: number): IDayPlan[] {
  const targetTotal = Math.max(0, Math.round(Number.isFinite(activityBudget) ? activityBudget : 0));
  const activityCount = itinerary.reduce((total, day) => total + day.activities.length, 0);

  if (activityCount === 0) return itinerary;

  const currentTotal = itinerary.reduce(
    (total, day) =>
      total +
      day.activities.reduce((dayTotal, activity) => {
        const cost = Number.isFinite(activity.estimatedCost) ? activity.estimatedCost : 0;
        return dayTotal + Math.max(0, cost);
      }, 0),
    0,
  );

  let activityIndex = 0;
  let assignedTotal = 0;

  return itinerary.map((day) => ({
    ...day,
    activities: day.activities.map((activity) => {
      activityIndex += 1;
      let estimatedCost = 0;

      if (targetTotal > 0) {
        if (currentTotal > 0) {
          estimatedCost =
            activityIndex === activityCount
              ? targetTotal - assignedTotal
              : Math.round((Math.max(0, activity.estimatedCost) / currentTotal) * targetTotal);
        } else {
          const baseCost = Math.floor(targetTotal / activityCount);
          const remainder = targetTotal % activityCount;
          estimatedCost = baseCost + (activityIndex <= remainder ? 1 : 0);
        }
      }

      assignedTotal += estimatedCost;
      return { ...activity, estimatedCost };
    }),
  }));
}

export async function generateFullTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = userIdFrom(req);
    const trip = await tripService.getTripById(userId, req.body.tripId as string);
    const input = tripInputFrom(trip);

    const [itinerary, budget, hotels] = await Promise.all([
      generateItinerary(input),
      estimateBudget(input),
      suggestHotelOptions(input.destination, input.budgetType),
    ]);
    const normalizedItinerary = normalizeItineraryCosts(itinerary, budget.activities);

    await Promise.all([
      tripService.updateItinerary(userId, req.body.tripId as string, normalizedItinerary),
      tripService.updateBudget(userId, req.body.tripId as string, budget),
      tripService.updateHotels(userId, req.body.tripId as string, hotels),
    ]);

    const updatedTrip = await tripService.getTripById(userId, req.body.tripId as string);
    sendTrip(res, updatedTrip, 'AI trip generated');
  } catch (err) {
    next(err);
  }
}

export async function regenerateDay(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = userIdFrom(req);
    const trip = await tripService.getTripById(userId, req.body.tripId as string);
    const dayNumber = Number(req.body.dayNumber);
    const activities = await regenerateSingleDay(
      tripInputFrom(trip),
      dayNumber,
      trip.itinerary,
      req.body.instruction as string,
    );
    let foundDay = false;
    const itinerary: IDayPlan[] = trip.itinerary.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      foundDay = true;
      return { dayNumber: day.dayNumber, activities };
    });

    if (!foundDay) throw new NotFoundError('Day not found');

    const updatedTrip = await tripService.updateItinerary(userId, req.body.tripId as string, itinerary);
    sendTrip(res, updatedTrip, 'Itinerary day regenerated');
  } catch (err) {
    next(err);
  }
}

export async function suggestHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = userIdFrom(req);
    const trip = await tripService.getTripById(userId, req.body.tripId as string);
    const hotels = await suggestHotelOptions(trip.destination, trip.budgetType);
    const updatedTrip = await tripService.updateHotels(userId, req.body.tripId as string, hotels);

    sendTrip(res, updatedTrip, 'Hotel suggestions generated');
  } catch (err) {
    next(err);
  }
}

export async function generatePackingList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = userIdFrom(req);
    const trip = await tripService.getTripById(userId, req.body.tripId as string);
    const packingList = await generatePackingListForTrip({ ...tripInputFrom(trip), itinerary: trip.itinerary });
    const updatedTrip = await tripService.updatePackingList(userId, req.body.tripId as string, packingList);

    sendTrip(res, updatedTrip, 'Packing list generated');
  } catch (err) {
    next(err);
  }
}
