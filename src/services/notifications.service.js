import * as repository from '../repositories/notifications.repository.js';
import { emitToUser } from '../sockets/emitter.js';
import { HttpError } from '../utils/http-error.js';

/* Crear un aviso siempre es un efecto secundario de una operación que ya se
   guardó: el atleta ya quedó vinculado, el mensaje ya se envió, la medición ya
   se registró. Si el aviso falla, la petición no debe fallar con él.

   El caso que obliga a esto es la invitación: su código es de un solo uso, así
   que devolver un error después de haberlo consumido dejaría al atleta
   vinculado pero convencido de que falló, y sin forma de reintentar. Perder un
   aviso es mucho menos grave que eso. El fallo se registra para poder verlo. */
function sideEffect(name, run) {
  return async (input) => {
    try {
      const notification = await run(input);

      /* Solo se avisa por socket si de verdad se creó una fila. Las variantes
         idempotentes no devuelven nada cuando deciden no repetir el aviso, y
         entonces tampoco hay novedad que anunciar. */
      if (notification) emitToUser(input.userId, 'notification:new', { notification });

      return notification;
    } catch (error) {
      console.error(`[notificaciones] ${name} falló para "${input?.type}":`, error.message);
      return null;
    }
  };
}

export const create = sideEffect('create', repository.create);
export const createOnce = sideEffect('createOnce', repository.createOnce);
export const createUnlessUnread = sideEffect('createUnlessUnread', repository.createUnlessUnread);

/* De aquí para abajo ya no son efectos secundarios sino la operación que el
   usuario pidió sobre su propia bandeja. Aquí un fallo sí debe llegarle. */
export const list = repository.list;
export const unreadCount = repository.unreadCount;

export async function markRead(id, userId) {
  const notification = await repository.markRead(id, userId);
  if (!notification) throw new HttpError(404, 'Notificación no encontrada');
  return notification;
}

export const markAllRead = repository.markAllRead;
