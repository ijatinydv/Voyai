import { type Request, type Response, type NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';
import { BadRequestError } from './AppError.js';

export function validate(schema: ZodSchema, target: 'body' | 'query' | 'params') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      next(new BadRequestError(messages.join(', ')));
      return;
    }

    // Overwrite the parsed target with the coerced/defaulted Zod output
    if (target === 'body') req.body = result.data as typeof req.body;
    else if (target === 'query') req.query = result.data as typeof req.query;
    else req.params = result.data as typeof req.params;

    next();
  };
}

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const tripInputSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  numberOfDays: z.number().int().min(1).max(30),
  budgetType: z.enum(['low', 'medium', 'high']),
  interests: z.array(z.string()).optional().default([]),
  customNotes: z.string().optional(),
});
