import mongoose from 'mongoose';
import { env } from './env.js';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1_000;

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  console.info('✅ MongoDB connected');
});

mongoose.connection.on('error', (err: Error) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

export async function connectDatabase(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
      heartbeatFrequencyMS: 10_000,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    if (attempt >= MAX_RETRIES) {
      console.error(
        `❌ Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Giving up.`,
        err.message,
      );
      process.exit(1);
    }

    // Exponential backoff: 1s → 2s → 4s → 8s, plus up to 500ms random jitter to avoid thundering herd.
    const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 500;
    console.warn(
      `⏳ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${Math.round(delayMs)}ms…`,
      err.message,
    );

    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    return connectDatabase(attempt + 1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  console.info('🔌 MongoDB connection closed');
}
