import { Router } from 'express';
import {
  addActivity,
  createTrip,
  deleteActivity,
  deleteTrip,
  getMyTrips,
  getTripById,
  updateActivity,
  updateTrip,
} from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  activityInputSchema,
  activityUpdateSchema,
  addActivityParamsSchema,
  tripActivityParamsSchema,
  tripInputSchema,
  tripListQuerySchema,
  tripParamsSchema,
  tripUpdateSchema,
  validate,
} from '../utils/validate.js';

const router: Router = Router();

router.use(authenticate);

router.get('/', validate(tripListQuerySchema, 'query'), getMyTrips);
router.post('/', validate(tripInputSchema, 'body'), createTrip);
router.get('/:id', validate(tripParamsSchema, 'params'), getTripById);
router.put('/:id', validate(tripParamsSchema, 'params'), validate(tripUpdateSchema, 'body'), updateTrip);
router.delete('/:id', validate(tripParamsSchema, 'params'), deleteTrip);
router.post(
  '/:id/days/:dayNumber/activities',
  validate(addActivityParamsSchema, 'params'),
  validate(activityInputSchema, 'body'),
  addActivity,
);
router.patch(
  '/:id/days/:dayNumber/activities/:activityId',
  validate(tripActivityParamsSchema, 'params'),
  validate(activityUpdateSchema, 'body'),
  updateActivity,
);
router.delete(
  '/:id/days/:dayNumber/activities/:activityId',
  validate(tripActivityParamsSchema, 'params'),
  deleteActivity,
);

export default router;
