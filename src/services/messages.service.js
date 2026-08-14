import * as repo from '../repositories/messages.repository.js';
import { HttpError } from '../utils/http-error.js';
import * as notifications from './notifications.service.js';
export const conversations = repo.conversations;
async function access(id, userId) {
  if (!(await repo.canAccess(id, userId)))
    throw new HttpError(403, 'No perteneces a esta conversación');
}
export async function messages(id, userId) {
  await access(id, userId);
  await repo.markRead(id, userId);
  return repo.messages(id);
}
export async function send(id, userId, body) {
  await access(id, userId);
  const message = await repo.send(id, userId, body);
  const recipient = await repo.recipient(id, userId);
  /* Un aviso pendiente por conversación, no uno por mensaje: el enlace lleva la
     conversación y sirve de clave estable. Al leerlo, el siguiente mensaje
     vuelve a avisar. */
  if (recipient)
    await notifications.createUnlessUnread({
      userId: recipient,
      type: 'message_received',
      title: 'Nuevo mensaje',
      body: 'Tienes un mensaje nuevo en tu conversación.',
      link: `/compartido/mensajes.html?conversation=${id}`,
    });
  return message;
}
