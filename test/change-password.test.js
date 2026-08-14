import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as auth from '../src/services/auth.service.js';

test('cambia la contraseña solo con la contraseña actual correcta', async (t) => {
  const email = `password-test-${Date.now()}@demo.local`;
  const passwordHash = await bcrypt.hash('Actual123', 12);
  const user = await users.createUser({
    email,
    passwordHash,
    firstName: 'Prueba',
    lastName: 'Temporal',
    role: 'athlete',
  });

  t.after(async () => {
    const found = (await pool.query('SELECT email FROM users WHERE id = $1', [user.id])).rows[0];
    assert.equal(found?.email, email);
    const deleted = await pool.query('DELETE FROM users WHERE id = $1 AND email = $2', [
      user.id,
      email,
    ]);
    assert.equal(deleted.rowCount, 1);
    await pool.end();
  });

  await assert.rejects(
    () => auth.changePassword(user.id, 'Incorrecta1', 'Nueva123'),
    /contraseña actual es incorrecta/i,
  );
  await assert.rejects(
    () => auth.changePassword(user.id, 'Actual123', 'Actual123'),
    /debe ser diferente/i,
  );

  await auth.changePassword(user.id, 'Actual123', 'Nueva123');
  await assert.rejects(() => auth.login(email, 'Actual123'), /Correo o contraseña incorrectos/);
  const loggedIn = await auth.login(email, 'Nueva123');
  assert.equal(loggedIn.id, user.id);
});
