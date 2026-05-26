import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  LLM_MODEL: z.string().default('gemini-2.0-flash'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  const errors = _parsed.error.flatten().fieldErrors;
  const messages = Object.entries(errors)
    .map(([key, msgs]) => `  ❌ ${key}: ${(msgs ?? []).join(', ')}`)
    .join('\n');

  console.error(`\n🚨 Invalid environment variables detected. Server cannot start.\n\n${messages}\n`);
  process.exit(1);
}

export const env = _parsed.data;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

/** Splits comma-separated CORS_ORIGIN into an array of trimmed origins. */
export const corsOrigins: string[] = env.CORS_ORIGIN.split(',').map((o) => o.trim());
