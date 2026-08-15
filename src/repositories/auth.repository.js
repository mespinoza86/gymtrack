import { pool } from '../config/database.js';

export async function findUserByEmail(email) {
  return (await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]))
    .rows[0];
}

export async function findSafeUserById(id) {
  return (
    await pool.query(
      `SELECT id, email, first_name, last_name, role, birth_date, phone, created_at
    FROM users WHERE id = $1 AND is_active = TRUE`,
      [id],
    )
  ).rows[0];
}

export async function findUserById(id) {
  return (await pool.query('SELECT * FROM users WHERE id = $1 AND is_active = TRUE', [id])).rows[0];
}

export async function createUser({ email, passwordHash, firstName, lastName, role }) {
  return (
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, first_name, last_name, role, created_at`,
      [email, passwordHash, firstName, lastName, role],
    )
  ).rows[0];
}

export async function updateProfile(id, values) {
  return (
    await pool.query(
      `UPDATE users SET first_name = $2, last_name = $3, phone = $4, birth_date = $5
    WHERE id = $1 RETURNING id, email, first_name, last_name, role, birth_date, phone`,
      [id, values.firstName, values.lastName, values.phone || null, values.birthDate || null],
    )
  ).rows[0];
}

export async function updatePassword(id, passwordHash) {
  return (
    await pool.query(
      `UPDATE users SET password_hash = $2
    WHERE id = $1 AND is_active = TRUE RETURNING id`,
      [id, passwordHash],
    )
  ).rows[0];
}

/* Tokens de recuperación y de confirmación de correo.
   Del token solo se guarda su SHA-256: la base nunca contiene el valor que
   viaja en el enlace. */

export async function createToken({ userId, purpose, tokenHash, expiresAt }) {
  /* Emitir uno nuevo anula los anteriores del mismo propósito. Si alguien pide
     el enlace tres veces, solo el último debe servir; de lo contrario un
     correo viejo reenviado seguiría abriendo la cuenta. */
  await pool.query(
    `UPDATE auth_tokens SET used_at = NOW()
      WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL`,
    [userId, purpose],
  );

  return (
    await pool.query(
      `INSERT INTO auth_tokens (user_id, purpose, token_hash, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING id, user_id, purpose, expires_at`,
      [userId, purpose, tokenHash, expiresAt],
    )
  ).rows[0];
}

/* Devuelve el token junto con su dueño, para no tener que consultar dos veces
   y para poder rechazar de una vez el de una cuenta desactivada. */
export async function findUsableToken(tokenHash, purpose) {
  return (
    await pool.query(
      `SELECT t.id, t.user_id, t.purpose,
              u.email, u.first_name, u.last_name, u.role, u.email_verified_at
         FROM auth_tokens t
         JOIN users u ON u.id = t.user_id AND u.is_active = TRUE
        WHERE t.token_hash = $1
          AND t.purpose = $2
          AND t.used_at IS NULL
          AND t.expires_at > NOW()`,
      [tokenHash, purpose],
    )
  ).rows[0];
}

export async function markTokenUsed(id) {
  return (
    await pool.query('UPDATE auth_tokens SET used_at = NOW() WHERE id = $1 RETURNING id', [id])
  ).rows[0];
}

export async function markEmailVerified(userId) {
  return (
    await pool.query(
      `UPDATE users SET email_verified_at = COALESCE(email_verified_at, NOW())
        WHERE id = $1 AND is_active = TRUE
        RETURNING id, email, first_name, last_name, role, email_verified_at`,
      [userId],
    )
  ).rows[0];
}

/* Cierra todas las sesiones abiertas de un usuario. Se llama al restablecer la
   contraseña: si alguien la restableció porque le habían entrado a la cuenta,
   la sesión del intruso tiene que morir con el cambio. Las sesiones viven en
   la tabla de `connect-pg-simple`, con el usuario dentro del JSON. */
export async function deleteSessions(userId) {
  return (
    await pool.query(`DELETE FROM user_sessions WHERE sess -> 'user' ->> 'id' = $1`, [userId])
  ).rowCount;
}
