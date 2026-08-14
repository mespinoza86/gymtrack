import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/routines.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.use(requireAuth);
const optionalNumber = (min, max) => z.union([z.number().min(min).max(max), z.null()]).optional();
const exerciseItem = z.object({
  exerciseId: z.uuid(),
  sets: z.number().int().min(1).max(20),
  reps: z.string().min(1).max(30),
  targetWeight: optionalNumber(0, 2000),
  restSeconds: optionalNumber(0, 3600),
  rir: optionalNumber(0, 10),
  tempo: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
});
const routineInput = z.object({
  athleteId: z.union([z.uuid(), z.null()]).optional(),
  name: z.string().trim().min(2).max(140),
  description: z.string().max(3000).optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  days: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(100),
        notes: z.string().max(1000).optional(),
        exercises: z.array(exerciseItem).min(1),
      }),
    )
    .min(1),
});
const customExerciseInput = z.object({
  name: z.string().trim().min(2).max(140),
  muscleGroup: z.string().trim().max(80).optional(),
  instructions: z.string().trim().max(3000).optional(),
  mediaUrl: z.union([z.url(), z.literal('')]).optional(),
});
router.get('/exercises', asyncHandler(controller.exercises));
router.get('/exercises/library', requireRole('trainer'), asyncHandler(controller.exerciseLibrary));
router.post(
  '/exercises',
  requireRole('trainer'),
  validate(customExerciseInput),
  asyncHandler(controller.createExercise),
);
router.put(
  '/exercises/:id',
  requireRole('trainer'),
  validate(customExerciseInput),
  asyncHandler(controller.updateExercise),
);
router.put(
  '/exercises/:id/status',
  requireRole('trainer'),
  validate(z.object({ isActive: z.boolean() })),
  asyncHandler(controller.setExerciseStatus),
);
router.delete('/exercises/:id', requireRole('trainer'), asyncHandler(controller.deleteExercise));
router.get('/', asyncHandler(controller.routines));
router.post(
  '/',
  requireRole('trainer'),
  validate(routineInput),
  asyncHandler(controller.createRoutine),
);
router.get('/history', requireRole('athlete'), asyncHandler(controller.history));
router.get('/:id', asyncHandler(controller.routine));
router.put(
  '/:id',
  requireRole('trainer'),
  validate(routineInput),
  asyncHandler(controller.updateRoutine),
);
router.post(
  '/workouts/start',
  requireRole('athlete'),
  validate(z.object({ routineDayId: z.uuid() })),
  asyncHandler(controller.start),
);
router.put(
  '/workouts/:id/finish',
  requireRole('athlete'),
  validate(
    z.object({
      energy: optionalNumber(1, 10),
      notes: z.string().max(2000).optional(),
      sets: z
        .array(
          z.object({
            routineExerciseId: z.uuid(),
            setNumber: z.number().int().min(1).max(30),
            reps: z.number().int().min(0).max(1000),
            weight: z.number().min(0).max(2000),
            rpe: optionalNumber(1, 10),
            pain: z.boolean().optional(),
            notes: z.string().max(500).optional(),
          }),
        )
        .min(1),
    }),
  ),
  asyncHandler(controller.finish),
);
export default router;
