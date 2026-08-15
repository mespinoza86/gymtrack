/* Recuperación de contraseña y confirmación de correo.

   Usa el transporte de consola, que no envía nada y deja el mensaje en
   `outbox`, de donde se extrae el token: la base solo guarda su hash.

   Crea usuarios temporales propios y los elimina al terminar, comprobando el
   número de filas borradas. Los tokens desaparecen por ON DELETE CASCADE. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/config/database.js';
import { env } from '../src/config/environment.js';
import * as auth from '../src/services/auth.service.js';
import { outbox } from '../src/services/mail.service.js';

/* Si alguien deja MAIL_TRANSPORT=brevo en su .env para probar el envío real,
   estas pruebas intentarían mandar correos de verdad a direcciones inventadas
   y fallarían sin explicar por qué. Mejor detenerse aquí y decirlo. */
if (env.mailTransport !== 'console') {
  throw new Error(
    `Las pruebas necesitan MAIL_TRANSPORT=console y ahora vale "${env.mailTransport}". ` +
      'Cámbialo en .env antes de ejecutarlas.',
  );
}

const mark = Date.now();
const emailFor = (suffix) => `correo-${suffix}-${mark}@demo.local`;
const PASSWORD = 'Prueba123';

const register = (suffix) =>
  auth.register({
    email: emailFor(suffix),
    password: PASSWORD,
    firstName: 'Correo',
    lastName: 'Prueba',
    role: 'athlete',
  });

/* El token solo existe dentro del enlace del último correo enviado. */
function lastToken() {
  const message = outbox.at(-1);
  assert.ok(message, 'no se envió ningún correo');
  const found = message.text.match(/token=([a-f0-9]{64})/);
  assert.ok(found, `el correo no contiene un enlace con token:\n${message.text}`);
  return found[1];
}

test('confirmación de correo y recuperación de contraseña', async (t) => {
  const creados = [];

  t.after(async () => {
    const deleted = await pool.query('DELETE FROM users WHERE email LIKE $1', [
      `correo-%-${mark}@demo.local`,
    ]);
    assert.equal(deleted.rowCount, creados.length, 'deben borrarse todos los usuarios temporales');
    await pool.end();
  });

  await t.test('al registrarse la cuenta queda sin confirmar y se envía el correo', async () => {
    const { user, emailSent } = await register('alta');
    creados.push(user.id);

    assert.equal(emailSent, true);
    assert.match(outbox.at(-1).subject, /Confirma tu correo/);
    assert.equal(outbox.at(-1).to, emailFor('alta'));

    const { rows } = await pool.query('SELECT email_verified_at FROM users WHERE id = $1', [
      user.id,
    ]);
    assert.equal(rows[0].email_verified_at, null, 'no debe nacer verificada');
  });

  await t.test('sin confirmar no se puede entrar, y el error trae su código', async () => {
    await assert.rejects(
      () => auth.login(emailFor('alta'), PASSWORD),
      (error) => {
        assert.equal(error.status, 403);
        assert.equal(error.code, 'email_not_verified');
        return true;
      },
    );
  });

  await t.test('una contraseña incorrecta no revela que la cuenta existe', async () => {
    /* Debe responder 401 genérico, no el 403 de "sin confirmar": si no,
       cualquiera podría averiguar qué correos están registrados. */
    await assert.rejects(
      () => auth.login(emailFor('alta'), 'OtraClave9'),
      (error) => {
        assert.equal(error.status, 401);
        assert.equal(error.code, undefined);
        return true;
      },
    );
  });

  await t.test('un token inventado no confirma nada', async () => {
    await assert.rejects(() => auth.verifyEmail('a'.repeat(64)), /no es válido/);
  });

  await t.test('el enlace del correo confirma la cuenta y permite entrar', async () => {
    const token = lastToken();
    const resultado = await auth.verifyEmail(token);
    assert.equal(resultado.email, emailFor('alta'));

    const user = await auth.login(emailFor('alta'), PASSWORD);
    assert.equal(user.email, emailFor('alta'));

    /* De un solo uso: reenviar el mismo enlace no debe volver a servir. */
    await assert.rejects(() => auth.verifyEmail(token), /no es válido/);
  });

  await t.test('pedir recuperación de un correo desconocido no falla ni envía', async () => {
    const antes = outbox.length;
    await auth.requestPasswordReset(`inexistente-${mark}@demo.local`);
    assert.equal(outbox.length, antes, 'no debe enviarse nada a una cuenta que no existe');
  });

  await t.test('emitir un enlace nuevo anula el anterior', async () => {
    await auth.requestPasswordReset(emailFor('alta'));
    const viejo = lastToken();

    await auth.requestPasswordReset(emailFor('alta'));
    const nuevo = lastToken();
    assert.notEqual(viejo, nuevo);

    await assert.rejects(() => auth.resetPassword(viejo, 'Nueva1234'), /no es válido/);
  });

  await t.test('restablecer cambia la contraseña y cierra las sesiones abiertas', async () => {
    const [{ id }] = (await pool.query('SELECT id FROM users WHERE email = $1', [emailFor('alta')]))
      .rows;

    /* Sesión falsa con la forma real que guarda connect-pg-simple. */
    await pool.query(
      `INSERT INTO user_sessions (sid, sess, expire)
       VALUES ($1, $2::json, NOW() + INTERVAL '1 day')`,
      [`prueba-${mark}`, JSON.stringify({ user: { id } })],
    );

    await auth.requestPasswordReset(emailFor('alta'));
    await auth.resetPassword(lastToken(), 'Nueva1234');

    const sesiones = await pool.query('SELECT 1 FROM user_sessions WHERE sid = $1', [
      `prueba-${mark}`,
    ]);
    assert.equal(sesiones.rowCount, 0, 'la sesión abierta debe cerrarse al restablecer');

    await assert.rejects(() => auth.login(emailFor('alta'), PASSWORD), /incorrectos/);
    const user = await auth.login(emailFor('alta'), 'Nueva1234');
    assert.equal(user.email, emailFor('alta'));
  });

  await t.test('restablecer también deja el correo confirmado', async () => {
    const { user } = await register('sinconfirmar');
    creados.push(user.id);

    await auth.requestPasswordReset(emailFor('sinconfirmar'));
    await auth.resetPassword(lastToken(), 'Nueva1234');

    /* Quien abrió el enlace demostró que controla el buzón, así que ya no
       debería quedar bloqueado por falta de confirmación. */
    const entrada = await auth.login(emailFor('sinconfirmar'), 'Nueva1234');
    assert.equal(entrada.email, emailFor('sinconfirmar'));
  });

  await t.test('no se reenvía la confirmación a una cuenta ya confirmada', async () => {
    const antes = outbox.length;
    await auth.resendVerification(emailFor('alta'));
    assert.equal(outbox.length, antes);
  });
});
