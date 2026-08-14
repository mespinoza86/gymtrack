import * as repo from '../repositories/tracking.repository.js';
import { activeLink } from '../repositories/links.repository.js';
import { HttpError } from '../utils/http-error.js';
export const measurements = repo.measurements;
export const checkins = repo.checkins;
export const nutritionPlans = repo.nutritionPlans;
async function authorizedAthlete(user, requested) {
  if (user.role === 'athlete') {
    if (requested && requested !== user.id) throw new HttpError(403, 'Sin permiso');
    return user.id;
  }
  if (!requested || !(await activeLink(user.id, requested)))
    throw new HttpError(403, 'El atleta no está vinculado contigo');
  return requested;
}
export async function addMeasurement(user, input) {
  const athleteId = await authorizedAthlete(user, input.athleteId);
  return repo.addMeasurement(athleteId, user.id, input);
}
export async function listMeasurements(user, athleteId) {
  return repo.measurements(await authorizedAthlete(user, athleteId));
}
export async function createCheckin(user, input) {
  if (!(await activeLink(input.trainerId, user.id)))
    throw new HttpError(403, 'El entrenador no está vinculado contigo');
  return repo.createCheckin(user.id, input);
}
export async function reviewCheckin(user, id, feedback) {
  const result = await repo.reviewCheckin(user.id, id, feedback);
  if (!result) throw new HttpError(404, 'Check-in no encontrado');
  return result;
}
export async function createNutritionPlan(user, input) {
  await authorizedAthlete(user, input.athleteId);
  return repo.createNutritionPlan(user.id, input);
}
