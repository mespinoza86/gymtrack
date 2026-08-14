import * as repository from '../repositories/notifications.repository.js';
import { HttpError } from '../utils/http-error.js';

export const create = repository.create;
export const createOnce = repository.createOnce;
export const list = repository.list;
export const unreadCount = repository.unreadCount;

export async function markRead(id, userId) {
  const notification = await repository.markRead(id, userId);
  if (!notification) throw new HttpError(404, 'Notificación no encontrada');
  return notification;
}

export const markAllRead = repository.markAllRead;
