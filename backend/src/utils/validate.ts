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

    // Express 5 exposes req.query as getter-only, so keep query validation read-only.
    if (target === 'body') req.body = result.data as typeof req.body;
    else if (target === 'params') req.params = result.data as typeof req.params;

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

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid trip id');

export const tripParamsSchema = z.object({
  id: objectIdSchema,
});

export const tripActivityParamsSchema = z.object({
  id: objectIdSchema,
  dayNumber: z.coerce.number().int().min(1, 'Day number must be at least 1'),
  activityId: z.string().min(1, 'Activity id is required'),
});

export const addActivityParamsSchema = tripActivityParamsSchema.omit({ activityId: true });

export const tripListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const activityInputSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1, 'Activity title is required'),
  description: z.string().min(1, 'Activity description is required'),
  estimatedCost: z.number().min(0).optional().default(0),
});

export const activityUpdateSchema = activityInputSchema
  .omit({ id: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one activity field is required',
  });

export const tripUpdateSchema = tripInputSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one trip field is required',
});

export const itinerarySchema = z.array(
  z.object({
    dayNumber: z.number().int().min(1),
    activities: z.array(activityInputSchema.required({ id: true })).default([]),
  }),
);

export const budgetEstimateSchema = z.object({
  flights: z.coerce.number().min(0),
  accommodation: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  activities: z.coerce.number().min(0),
  miscellaneous: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  currency: z.string().min(1),
  notes: z.string().min(1),
});

export const hotelSuggestionsSchema = z.array(
  z.object({
    name: z.string().min(1),
    type: z.enum(['budget', 'mid-range', 'luxury']),
    estimatedPricePerNight: z.coerce.number().min(0),
    currency: z.string().min(1),
    highlights: z.array(z.string().min(1)),
  }),
);

export const packingListSchema = z.array(
  z.object({
    category: z.string().min(1),
    items: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        essential: z.boolean().default(false),
        quantity: z.number().nullable().default(null),
      }),
    ),
  }),
);

export const aiTripIdBodySchema = z.object({
  tripId: objectIdSchema,
});

export const regenerateDayBodySchema = z.object({
  tripId: objectIdSchema,
  dayNumber: z.coerce.number().int().min(1, 'Day number must be at least 1'),
  instruction: z.string().min(1, 'Instruction is required'),
});
