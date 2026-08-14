/* Bandeja de notificaciones y aislamiento por propietario.

   Crea dos usuarios temporales y elimina ambos al terminar. Las notificaciones
   desaparecen por ON DELETE CASCADE, de modo que la prueba no deja filas. */

import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as notifications from '../src/services/notifications.service.js';

const mark = Date.now();

async function createUser(suffix) {
  return users.createUser({
    email: `notificacion-${suffix}-${mark}@demo.local`,
    passwordHash: await bcrypt.hash('Prueba123', 4),
    firstName: 'Aviso',
    lastName: suffix,
    role: 'athlete',
  });
}

test('notificaciones privadas y estados de lectura', async (t) => {
  const owner = await createUser('propietario');
  const outsider = await createUser('ajeno');

  t.after(async () => {
    const deleted = await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [
      [owner.id, outsider.id],
    ]);
    assert.equal(deleted.rowCount, 2, 'deben eliminarse los dos usuarios temporales');
    await pool.end();
  });

  const first = await notifications.create({
    userId: owner.id,
    type: 'test_first',
    title: 'Primera',
    body: 'Solo del propietario',
    link: '/atleta/panel.html',
  });
  await notifications.create({ userId: owner.id, type: 'test_second', title: 'Segunda' });
  await notifications.create({ userId: outsider.id, type: 'test_outsider', title: 'Ajena' });

  await t.test('cada usuario solo lista y cuenta las suyas', async () => {
    const ownerList = await notifications.list(owner.id);
    const outsiderList = await notifications.list(outsider.id);
    assert.equal(ownerList.length, 2);
    assert.equal(outsiderList.length, 1);
    assert.equal(await notifications.unreadCount(owner.id), 2);
    assert.ok(ownerList.every((item) => item.type !== 'test_outsider'));
  });

  await t.test('un usuario ajeno no puede marcar una notificación', async () => {
    await assert.rejects(
      () => notifications.markRead(first.id, outsider.id),
      /Notificación no encontrada/,
    );
    assert.equal(await notifications.unreadCount(owner.id), 2);
  });

  await t.test('marca una y después todas sin alterar las ajenas', async () => {
    const read = await notifications.markRead(first.id, owner.id);
    assert.ok(read.read_at);
    assert.equal(await notifications.unreadCount(owner.id), 1);

    assert.equal(await notifications.markAllRead(owner.id), 1);
    assert.equal(await notifications.unreadCount(owner.id), 0);
    assert.equal(await notifications.unreadCount(outsider.id), 1);
  });

  await t.test('un evento con la misma clave solo se crea una vez', async () => {
    const event = {
      userId: owner.id,
      type: 'test_once',
      title: 'Una sola vez',
      link: '/evento/unico',
    };
    await notifications.createOnce(event);
    await notifications.createOnce(event);
    const rows = (await notifications.list(owner.id)).filter((item) => item.type === 'test_once');
    assert.equal(rows.length, 1);
  });
});
