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

    await Promise.all([
      tripService.updateItinerary(userId, req.body.tripId as string, itinerary),
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
