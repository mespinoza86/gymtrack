import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { app, sessionMiddleware } from './app.js';
import { env } from './config/environment.js';
import { pool } from './config/database.js';
import { configureChat } from './sockets/chat.js';
import { setIo } from './sockets/emitter.js';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: env.appOrigin, credentials: true } });
app.set('io', io);
/* Deja la instancia al alcance de los servicios, que no tienen `req`. */
setIo(io);
configureChat(io, sessionMiddleware);
httpServer.listen(env.port, () => console.log(`GymTrack disponible en ${env.appOrigin}`));
async function shutdown(signal) {
  console.log(`${signal}: cerrando servidor...`);
  io.close();
  httpServer.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
