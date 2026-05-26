import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env, corsOrigins, isProduction } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { registerRoutes } from './routes/index.js';

const app: Express = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProduction,
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no origin are allowed (native mobile apps, curl, Postman).
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
  }),
);

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser() as express.RequestHandler);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many auth attempts' } },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'voyai-api',
    version: process.env['npm_package_version'] ?? '0.0.1',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

registerRoutes(app);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource does not exist',
  });
});

// errorHandler must be the last middleware — Express identifies error handlers by their 4-argument signature
app.use(errorHandler);

export default app;
