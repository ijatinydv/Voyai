import { Router } from 'express';
import {
  generateFullTrip,
  generatePackingList,
  regenerateDay,
  suggestHotels,
} from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware.js';
import { aiTripIdBodySchema, regenerateDayBodySchema, validate } from '../utils/validate.js';

const router: Router = Router();

router.use(authenticate, aiRateLimiter);

router.post('/generate', validate(aiTripIdBodySchema, 'body'), generateFullTrip);
router.post('/regenerate-day', validate(regenerateDayBodySchema, 'body'), regenerateDay);
router.post('/suggest-hotels', validate(aiTripIdBodySchema, 'body'), suggestHotels);
router.post('/generate-packing-list', validate(aiTripIdBodySchema, 'body'), generatePackingList);

export default router;
