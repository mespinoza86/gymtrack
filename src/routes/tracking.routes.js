import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/tracking.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';
const r = Router();
r.use(requireAuth);
const n = (min, max) => z.union([z.number().min(min).max(max), z.null()]).optional();
r.get('/measurements', asyncHandler(c.measurements));
r.post(
  '/measurements',
  validate(
    z.object({
      athleteId: z.uuid().optional(),
      measuredAt: z.string(),
      weightKg: n(1, 1000),
      bodyFatPercent: n(0, 100),
      waistCm: n(1, 500),
      hipCm: n(1, 500),
      chestCm: n(1, 500),
      armCm: n(1, 500),
      thighCm: n(1, 500),
      notes: z.string().max(2000).optional(),
    }),
  ),
  asyncHandler(c.addMeasurement),
);
r.get('/checkins', asyncHandler(c.checkins));
r.post(
  '/checkins',
  requireRole('athlete'),
  validate(
    z.object({
      trainerId: z.uuid(),
      checkinDate: z.string(),
      energy: z.number().int().min(1).max(10),
      sleepHours: z.number().min(0).max(24),
      stress: z.number().int().min(1).max(10),
      hunger: z.number().int().min(1).max(10),
      adherence: z.number().int().min(0).max(100),
      painDetails: z.string().max(2000).optional(),
      wins: z.string().max(2000).optional(),
      difficulties: z.string().max(2000).optional(),
    }),
  ),
  asyncHandler(c.addCheckin),
);
r.put(
  '/checkins/:id/review',
  requireRole('trainer'),
  validate(z.object({ feedback: z.string().min(1).max(3000) })),
  asyncHandler(c.review),
);
r.get('/nutrition', asyncHandler(c.nutrition));
r.post(
  '/nutrition',
  requireRole('trainer'),
  validate(
    z.object({
      athleteId: z.uuid(),
      name: z.string().min(2).max(140),
      description: z.string().max(3000).optional(),
      calories: n(1, 20000),
      proteinG: n(0, 2000),
      carbsG: n(0, 3000),
      fatsG: n(0, 2000),
      fiberG: n(0, 500),
      waterMl: n(0, 20000),
      meals: z
        .array(z.object({ name: z.string().min(1).max(100), details: z.string().min(1).max(5000) }))
        .min(1),
    }),
  ),
  asyncHandler(c.addNutrition),
);
export default r;
