import * as repository from '../repositories/routines.repository.js';
import { activeLink } from '../repositories/links.repository.js';
import { HttpError } from '../utils/http-error.js';

export const listExercises = repository.listExercises;
export const createExercise = repository.createExercise;
export const exerciseLibrary = repository.exerciseLibrary;
export const listRoutines = repository.listRoutines;
export const workoutHistory = repository.workoutHistory;

export async function updateExercise(id, trainerId, input) {
  const exercise = await repository.updateExercise(id, trainerId, input);
  if (!exercise) throw new HttpError(404, 'Ejercicio personalizado no encontrado');
  return exercise;
}
export async function setExerciseStatus(id, trainerId, isActive) {
  const exercise = await repository.setExerciseStatus(id, trainerId, isActive);
  if (!exercise) throw new HttpError(404, 'Ejercicio personalizado no encontrado');
  return exercise;
}
export async function deleteExercise(id, trainerId) {
  const result = await repository.deleteExercise(id, trainerId);
  if (result === 'used')
    throw new HttpError(409, 'Este ejercicio forma parte de una rutina y solo puede desactivarse');
  if (result === 'missing') throw new HttpError(404, 'Ejercicio personalizado no encontrado');
}

export async function createRoutine(trainerId, input) {
  if (input.athleteId && !(await activeLink(trainerId, input.athleteId)))
    throw new HttpError(403, 'El atleta no está vinculado contigo');
  return repository.createRoutine(trainerId, input);
}
export async function updateRoutine(id, trainerId, input) {
  if (input.athleteId && !(await activeLink(trainerId, input.athleteId)))
    throw new HttpError(403, 'El atleta no está vinculado contigo');
  const routine = await repository.replaceRoutine(id, trainerId, input);
  if (!routine) throw new HttpError(404, 'Rutina no encontrada');
  return routine;
}
/* Semana en la que va el plan hoy, contando desde su fecha de inicio.
   Sin fecha de inicio se asume la primera; nunca se pasa de la duración. */
export function currentWeek(routine) {
  if (!routine.start_date) return 1;
  const elapsedDays = Math.floor(
    (Date.now() - new Date(routine.start_date).getTime()) / 86_400_000,
  );
  return Math.min(Math.max(Math.floor(elapsedDays / 7) + 1, 1), routine.weeks || 1);
}

export async function getRoutine(id, user) {
  const routine = await repository.getRoutine(id, user);
  if (!routine) throw new HttpError(404, 'Rutina no encontrada');
  routine.currentWeek = currentWeek(routine);
  return routine;
}

/* Traduce los errores del repositorio a respuestas HTTP. Se comparte entre
   las tres operaciones de registro para no repetir los mismos mensajes. */
function assertWorkout(result) {
  if (result.error === 'forbidden')
    throw new HttpError(403, 'Este día no pertenece a una rutina activa tuya');
  if (result.error === 'week') throw new HttpError(400, 'Esa semana está fuera del plan');
  if (result.error === 'session') throw new HttpError(404, 'Sesión no encontrada');
  if (result.error === 'exercise')
    throw new HttpError(403, 'El ejercicio no pertenece al día de esta sesión');
  return result;
}

export async function startWorkout(athleteId, routineDayId, weekNumber) {
  return assertWorkout(await repository.startWorkout(athleteId, routineDayId, weekNumber));
}
export async function logExercise(athleteId, sessionId, routineExerciseId, sets) {
  return assertWorkout(await repository.logExercise(athleteId, sessionId, routineExerciseId, sets));
}
export async function unlogExercise(athleteId, sessionId, routineExerciseId) {
  return assertWorkout(await repository.unlogExercise(athleteId, sessionId, routineExerciseId));
}
export async function finishWorkout(athleteId, sessionId, input) {
  return assertWorkout(await repository.finishWorkout(athleteId, sessionId, input));
}

/* Cuadrícula de cumplimiento de una rutina: una entrada por semana y día.

   Puede haber más de una sesión en la misma franja —repetir un día es
   legítimo—, así que se quedan el mejor estado y el mayor avance. */
export async function routineProgress(id, user) {
  const routine = await getRoutine(id, user);
  if (!routine.athlete_id) return { routine, progress: [] };

  const slots = new Map();
  for (const row of await repository.routineProgress(id, routine.athlete_id)) {
    const key = `${row.week_number}-${row.day_order}`;
    const previous = slots.get(key);
    const entry = {
      weekNumber: row.week_number,
      dayOrder: row.day_order,
      completedAt: row.completed_at,
      startedAt: row.started_at,
      completedExercises: row.completed_exercises,
      totalExercises: row.total_exercises,
      status: row.completed_at ? 'completed' : 'in_progress',
    };
    if (
      !previous ||
      (!previous.completedAt && entry.completedAt) ||
      entry.completedExercises > previous.completedExercises
    )
      slots.set(key, entry);
  }

  return { routine, progress: [...slots.values()] };
}
