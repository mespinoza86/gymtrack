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
/* La posición dentro de `days` es la franja de la semana: el primer elemento
   es el Día 1 y el último, como mucho, el Día 7. */
const dayInput = z.object({
  name: z.string().trim().min(1).max(100),
  notes: z.string().max(1000).optional(),
  dayType: z.enum(['training', 'rest', 'optional_rest']).default('training'),
  mirrorsDayOrder: z.union([z.number().int().min(1).max(7), z.null()]).optional(),
  exercises: z.array(exerciseItem).default([]),
});

const routineInput = z
  .object({
    athleteId: z.union([z.uuid(), z.null()]).optional(),
    name: z.string().trim().min(2).max(140),
    description: z.string().max(3000).optional(),
    status: z.enum(['draft', 'active', 'archived']).default('draft'),
    startDate: z.string().optional(),
    weeks: z.number().int().min(1).max(52).default(1),
    days: z.array(dayInput).min(1).max(7),
  })
  /* Reglas que dependen de varios días a la vez y que Zod no puede expresar
     campo por campo. Se validan aquí para que el repositorio pueda confiar
     en la forma de los datos que recibe. */
  .superRefine((input, context) => {
    input.days.forEach((day, index) => {
      const dayOrder = index + 1;
      const at = (field) => ({ path: ['days', index, field] });

      if (day.dayType !== 'training') {
        if (day.exercises.length)
          context.addIssue({
            code: 'custom',
            message: 'Un día libre no puede tener ejercicios',
            ...at('exercises'),
          });
        return;
      }

      if (day.mirrorsDayOrder == null) {
        if (!day.exercises.length)
          context.addIssue({
            code: 'custom',
            message: 'Un día de entrenamiento necesita al menos un ejercicio',
            ...at('exercises'),
          });
        return;
      }

      /* El día espejado tiene que existir y estar definido antes, para poder
         copiar su contenido en una sola pasada. */
      if (day.mirrorsDayOrder >= dayOrder) {
        context.addIssue({
          code: 'custom',
          message: 'Un día solo puede repetir un día anterior de la misma semana',
          ...at('mirrorsDayOrder'),
        });
        return;
      }
      if (input.days[day.mirrorsDayOrder - 1].dayType !== 'training')
        context.addIssue({
          code: 'custom',
          message: 'No se puede repetir un día libre',
          ...at('mirrorsDayOrder'),
        });
    });
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
router.get('/:id/progress', asyncHandler(controller.progress));
router.post(
  '/workouts/start',
  requireRole('athlete'),
  validate(
    z.object({ routineDayId: z.uuid(), weekNumber: z.number().int().min(1).max(52).default(1) }),
  ),
  asyncHandler(controller.start),
);

const performedSet = z.object({
  setNumber: z.number().int().min(1).max(30),
  reps: z.number().int().min(0).max(1000),
  weight: z.number().min(0).max(2000),
  rpe: optionalNumber(1, 10),
  pain: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

/* Marcar un ejercicio como terminado guarda solo sus series: el atleta
   avanza de a uno y no pierde lo registrado si abandona la pantalla. */
router.put(
  '/workouts/:id/exercises/:exerciseId',
  requireRole('athlete'),
  validate(z.object({ sets: z.array(performedSet).max(30).default([]) })),
  asyncHandler(controller.logExercise),
);
router.delete(
  '/workouts/:id/exercises/:exerciseId',
  requireRole('athlete'),
  asyncHandler(controller.unlogExercise),
);

/* Cierra el día completo. Las series siguen aceptándose aquí para poder
   registrar de una sola vez, sin marcar ejercicio por ejercicio. */
router.put(
  '/workouts/:id/finish',
  requireRole('athlete'),
  validate(
    z.object({
      energy: optionalNumber(1, 10),
      notes: z.string().max(2000).optional(),
      sets: z.array(performedSet.extend({ routineExerciseId: z.uuid() })).default([]),
    }),
  ),
  asyncHandler(controller.finish),
);
export default router;
