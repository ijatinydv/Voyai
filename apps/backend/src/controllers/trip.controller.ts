import { type NextFunction, type Request, type Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@voyai/types';
import type { ITrip } from '../models/Trip.model.js';
import * as tripService from '../services/trip.service.js';
import { UnauthorizedError } from '../utils/AppError.js';

function userIdFrom(req: Request): string {
  if (!req.user) throw new UnauthorizedError('Not authenticated');
  return req.user.id;
}

function sendResponse<T>(res: Response, data: T, message: string, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

export async function createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.createTrip(userIdFrom(req), req.body);
    sendResponse(res, trip, 'Trip created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const result = await tripService.getUserTrips(userIdFrom(req), page, limit);
    const response: PaginatedResponse<ITrip> = {
      success: true,
      data: result.data,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getTripById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.getTripById(userIdFrom(req), req.params['id'] as string);
    sendResponse(res, trip, 'Trip retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.updateTrip(userIdFrom(req), req.params['id'] as string, req.body);
    sendResponse(res, trip, 'Trip updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await tripService.deleteTrip(userIdFrom(req), req.params['id'] as string);
    sendResponse(res, null, 'Trip deleted');
  } catch (err) {
    next(err);
  }
}

export async function addActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.addActivity(
      userIdFrom(req),
      req.params['id'] as string,
      Number(req.params['dayNumber']),
      req.body,
    );
    sendResponse(res, trip, 'Activity added', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.updateActivity(
      userIdFrom(req),
      req.params['id'] as string,
      Number(req.params['dayNumber']),
      req.params['activityId'] as string,
      req.body,
    );
    sendResponse(res, trip, 'Activity updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripService.deleteActivity(
      userIdFrom(req),
      req.params['id'] as string,
      Number(req.params['dayNumber']),
      req.params['activityId'] as string,
    );
    sendResponse(res, trip, 'Activity deleted');
  } catch (err) {
    next(err);
  }
}
