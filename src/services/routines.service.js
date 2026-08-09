import * as repository from '../repositories/routines.repository.js';
import { activeLink } from '../repositories/links.repository.js';
import { HttpError } from '../utils/http-error.js';

export const listExercises = repository.listExercises;
export const createExercise = repository.createExercise;
export const listRoutines = repository.listRoutines;
export const workoutHistory = repository.workoutHistory;

export async function createRoutine(trainerId, input) {
  if (input.athleteId && !(await activeLink(trainerId, input.athleteId))) throw new HttpError(403, 'El atleta no está vinculado contigo');
  return repository.createRoutine(trainerId, input);
}
export async function getRoutine(id, user) {
  const routine = await repository.getRoutine(id, user);
  if (!routine) throw new HttpError(404, 'Rutina no encontrada');
  return routine;
}
export const startWorkout = repository.startWorkout;
export async function finishWorkout(athleteId, sessionId, input) {
  const result = await repository.finishWorkout(athleteId, sessionId, input);
  if (!result) throw new HttpError(404, 'Sesión no encontrada o ya finalizada');
  return result;
}
