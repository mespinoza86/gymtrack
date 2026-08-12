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
  if (result === 'used') throw new HttpError(409, 'Este ejercicio forma parte de una rutina y solo puede desactivarse');
  if (result === 'missing') throw new HttpError(404, 'Ejercicio personalizado no encontrado');
}

export async function createRoutine(trainerId, input) {
  if (input.athleteId && !(await activeLink(trainerId, input.athleteId))) throw new HttpError(403, 'El atleta no está vinculado contigo');
  return repository.createRoutine(trainerId, input);
}
export async function updateRoutine(id, trainerId, input) {
  if (input.athleteId && !(await activeLink(trainerId, input.athleteId))) throw new HttpError(403, 'El atleta no está vinculado contigo');
  const routine = await repository.replaceRoutine(id, trainerId, input);
  if (!routine) throw new HttpError(404, 'Rutina no encontrada');
  return routine;
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
