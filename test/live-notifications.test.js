/* Avisos en tiempo real.

   El emisor se prueba con un Socket.IO falso: basta con que ofrezca `to()` y
   `emit()`. Así se comprueba a qué sala se manda cada aviso sin levantar un
   servidor ni abrir conexiones. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as notifications from '../src/services/notifications.service.js';
import { setIo, emitToUser, userRoom } from '../src/sockets/emitter.js';

/* Registra a qué sala y con qué contenido se emitió. */
function ioFalso() {
  const emitidos = [];
  return {
    emitidos,
    to(sala) {
      return {
        emit(evento, carga) {
          emitidos.push({ sala, evento, carga });
        },
      };
    },
  };
}

test('sin Socket.IO configurado no se rompe nada', () => {
  setIo(null);
  /* Es el caso de las pruebas y el de cualquier proceso que importe los
     servicios sin levantar el servidor. Debe devolver falso, no lanzar. */
  assert.equal(emitToUser('alguien', 'notification:new', {}), false);
});

test('cada usuario tiene su propia sala', () => {
  assert.equal(userRoom('abc'), 'user:abc');
  assert.notEqual(userRoom('abc'), userRoom('abd'));
});

test('un aviso creado se emite a la sala de su destinatario', async (t) => {
  const marca = Date.now();
  const email = `vivo-${marca}@demo.local`;
  const user = await users.createUser({
    email,
    passwordHash: await bcrypt.hash('Prueba123', 4),
    firstName: 'Vivo',
    lastName: 'Temporal',
    role: 'athlete',
  });

  const falso = ioFalso();
  setIo(falso);

  /* Sin `pool.end()`: la prueba del contador de mensajes va después y todavía
     necesita la conexión. Se cierra en la última que usa la base. */
  t.after(async () => {
    setIo(null);
    const borrados = await pool.query('DELETE FROM users WHERE id = $1 AND email = $2', [
      user.id,
      email,
    ]);
    assert.equal(borrados.rowCount, 1);
  });

  await t.test('al crear un aviso llega a su sala', async () => {
    await notifications.create({
      userId: user.id,
      type: 'test_vivo',
      title: 'Aviso nuevo',
      link: '/atleta/panel.html',
    });

    assert.equal(falso.emitidos.length, 1);
    const [emitido] = falso.emitidos;
    assert.equal(emitido.sala, `user:${user.id}`, 'debe ir solo a esa persona');
    assert.equal(emitido.evento, 'notification:new');
    assert.equal(emitido.carga.notification.title, 'Aviso nuevo');
  });

  await t.test('lo que no se crea tampoco se emite', async () => {
    const evento = {
      userId: user.id,
      type: 'test_vivo_unico',
      title: 'Una sola vez',
      link: '/evento/unico',
    };

    await notifications.createOnce(evento);
    assert.equal(falso.emitidos.length, 2, 'la primera vez sí');

    /* La segunda no crea fila, así que no hay novedad que anunciar. */
    await notifications.createOnce(evento);
    assert.equal(falso.emitidos.length, 2, 'la repetición no debe emitir');
  });
});

test('la sala se deduce de la sesión y nunca del cliente', async () => {
  const chat = await readFile(new URL('../src/sockets/chat.js', import.meta.url), 'utf8');

  /* Si la sala se tomara de algo enviado por el cliente, cualquiera podría
     pedir unirse a la de otra persona y escuchar sus avisos. */
  assert.match(
    chat,
    /socket\.join\(userRoom\(socket\.request\.session\.user\.id\)\)/,
    'la sala personal debe salir de la sesión del servidor',
  );
});

test('el contador de mensajes cuenta solo lo ajeno y sin leer', async (t) => {
  const marca = Date.now();
  const crear = async (role, sufijo) =>
    users.createUser({
      email: `contador-${role}${sufijo}-${marca}@demo.local`,
      passwordHash: await bcrypt.hash('Prueba123', 4),
      firstName: 'Contador',
      lastName: 'Temporal',
      role,
    });

  const entrenador = await crear('trainer', 'a');
  const atleta = await crear('athlete', 'a');
  const ajeno = await crear('athlete', 'b');
  const ids = [entrenador.id, atleta.id, ajeno.id];

  const messages = await import('../src/services/messages.service.js');
  const { rows } = await pool.query(
    'INSERT INTO conversations (trainer_id, athlete_id) VALUES ($1,$2) RETURNING id',
    [entrenador.id, atleta.id],
  );
  const conversacion = rows[0].id;

  t.after(async () => {
    await pool.query('DELETE FROM messages WHERE sender_id = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM conversations WHERE trainer_id = ANY($1::uuid[])', [ids]);
    const borrados = await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [ids]);
    assert.equal(borrados.rowCount, 3);
    /* Última prueba de este archivo que toca la base: aquí se cierra. */
    await pool.end();
  });

  await t.test('lo que uno escribe no le queda pendiente a él', async () => {
    await messages.send(conversacion, atleta.id, 'Hola entrenador');
    assert.equal(await messages.unreadCount(atleta.id), 0, 'lo propio no cuenta');
    assert.equal(await messages.unreadCount(entrenador.id), 1, 'al destinatario sí');
  });

  await t.test('abrir la conversación lo pone a cero', async () => {
    await messages.messages(conversacion, entrenador.id);
    assert.equal(await messages.unreadCount(entrenador.id), 0);
  });

  await t.test('no cuenta conversaciones ajenas', async () => {
    await messages.send(conversacion, atleta.id, 'Otro más');
    assert.equal(await messages.unreadCount(ajeno.id), 0, 'quien no participa no ve nada');
    assert.equal(await messages.unreadCount(entrenador.id), 1);
  });
});

test('el navegador escucha los avisos y comparte una sola conexión', async () => {
  const [navigation, mensajes, socketModule] = await Promise.all([
    readFile(new URL('../public/js/comun/navigation.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/js/compartido/mensajes.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/js/comun/socket.js', import.meta.url), 'utf8'),
  ]);

  assert.match(navigation, /notification:new/, 'el menú debe escuchar los avisos');
  assert.match(navigation, /setUnreadBadges/, 'y actualizar el contador');

  /* Un mensaje debe anunciarse también sobre "Mensajes": si solo subiera el
     contador de avisos, habría que abrir la bandeja para saber qué llegó. */
  assert.match(navigation, /message_received/, 'el menú distingue los mensajes');
  assert.match(navigation, /setMessageBadges/, 'y marca el acceso a Mensajes');
  assert.match(navigation, /api\/messages\/unread-count/, 'pide el contador de mensajes');
  assert.match(mensajes, /setMessageBadges/, 'al leer, el contador debe bajar');

  /* Ambos usan el módulo común: dos llamadas a `window.io()` abrirían dos
     conexiones por página. */
  assert.match(navigation, /from '\.\/socket\.js'/);
  assert.match(mensajes, /from '\.\.\/comun\/socket\.js'/);
  assert.doesNotMatch(mensajes, /window\.io\(\)/, 'el chat ya no abre su propia conexión');
  assert.match(socketModule, /if \(conexion\) return conexion/, 'la conexión debe reutilizarse');
});
