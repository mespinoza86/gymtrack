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
