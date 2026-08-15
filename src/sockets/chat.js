import { canAccess } from '../repositories/messages.repository.js';
import { userRoom } from './emitter.js';
export function configureChat(io, sessionMiddleware) {
  io.engine.use(sessionMiddleware);
  io.use((socket, next) =>
    socket.request.session?.user ? next() : next(new Error('No autorizado')),
  );
  io.on('connection', (socket) => {
    /* Cada quien entra a su sala personal nada más conectarse. El servidor la
       deduce de la sesión y nunca de lo que diga el cliente, así que nadie
       puede escuchar los avisos de otra persona pidiendo unirse a su sala. */
    socket.join(userRoom(socket.request.session.user.id));

    socket.on('conversation:join', async (conversationId, acknowledge) => {
      try {
        if (!(await canAccess(conversationId, socket.request.session.user.id)))
          return acknowledge?.({ ok: false });
        await socket.join(`conversation:${conversationId}`);
        acknowledge?.({ ok: true });
      } catch {
        acknowledge?.({ ok: false });
      }
    });
  });
}
