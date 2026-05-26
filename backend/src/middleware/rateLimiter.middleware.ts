import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? ''),
  handler: (_req, res) => {
    res.setHeader('Retry-After', '900');
    res.status(429).json({
      success: false,
      message: 'Too many AI requests. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  },
});
