import { canAccess } from '../repositories/messages.repository.js';
export function configureChat(io, sessionMiddleware) {
  io.engine.use(sessionMiddleware);
  io.use((socket, next) => socket.request.session?.user ? next() : next(new Error('No autorizado')));
  io.on('connection', (socket) => {
    socket.on('conversation:join', async (conversationId, acknowledge) => {
      try {
        if (!(await canAccess(conversationId, socket.request.session.user.id))) return acknowledge?.({ ok: false });
        await socket.join(`conversation:${conversationId}`);
        acknowledge?.({ ok: true });
      } catch { acknowledge?.({ ok: false }); }
    });
  });
}
