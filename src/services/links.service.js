import crypto from 'node:crypto';
import * as links from '../repositories/links.repository.js';
import { HttpError } from '../utils/http-error.js';

export async function createInvitation(trainerId) {
  const code = crypto.randomBytes(5).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return links.createInvitation(trainerId, code, expiresAt);
}

export const listInvitations = links.listInvitations;
export const listAthletes = links.listAthletes;
export const listTrainers = links.listTrainers;

export async function acceptInvitation(code, athleteId) {
  const invitation = await links.acceptInvitation(code.toUpperCase(), athleteId);
  if (!invitation) throw new HttpError(404, 'La invitación no existe, venció o ya fue utilizada');
  return invitation;
}

export async function assertLink(trainerId, athleteId) {
  if (!(await links.activeLink(trainerId, athleteId)))
    throw new HttpError(403, 'No existe una vinculación activa con este atleta');
}
