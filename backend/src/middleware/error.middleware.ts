import { type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import type { MongoServerError } from '../types';
import { AppError } from '../utils/AppError.js';
import { isProduction } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let errors: string[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'`;
  } else if ((err as unknown as MongoServerError).code === 11000) {
    const field = Object.keys((err as unknown as MongoServerError).keyValue ?? {})[0] ?? 'field';
    statusCode = 409;
    message = `${field} is already in use`;
  }

  console.error({
    timestamp: new Date().toISOString(),
    route: `${req.method} ${req.path}`,
    statusCode,
    userId: req.user?.id ?? 'unauthenticated',
    message: err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });

  const body: { success: false; message: string; errors?: string[] } = {
    success: false,
    message: isProduction && statusCode === 500 ? 'An unexpected error occurred' : message,
    ...(errors ? { errors } : {}),
  };

  res.status(statusCode).json(body);
}
