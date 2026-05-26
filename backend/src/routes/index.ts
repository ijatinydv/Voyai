import type { Express } from 'express';
import aiRouter from './ai.routes.js';
import authRouter from './auth.routes.js';
import tripRouter from './trip.routes.js';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRouter);
  app.use('/api/trips', tripRouter);
  app.use('/api/ai', aiRouter);
}
