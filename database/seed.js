import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';

try {
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  await pool.query(
    `
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES
      ('entrenador@demo.local', $1, 'Elena', 'Entrenadora', 'trainer'),
      ('atleta@demo.local', $1, 'Andrés', 'Atleta', 'athlete')
    ON CONFLICT (email) DO NOTHING
  `,
    [passwordHash],
  );
  const { rows } = await pool.query(
    "SELECT id, role FROM users WHERE email IN ('entrenador@demo.local', 'atleta@demo.local')",
  );
  const trainer = rows.find((row) => row.role === 'trainer');
  const athlete = rows.find((row) => row.role === 'athlete');
  if (trainer && athlete) {
    await pool.query(
      `INSERT INTO trainer_athlete_links (trainer_id, athlete_id)
      VALUES ($1, $2) ON CONFLICT (trainer_id, athlete_id) DO UPDATE SET status = 'active', ended_at = NULL`,
      [trainer.id, athlete.id],
    );
    await pool.query(
      `INSERT INTO conversations (trainer_id, athlete_id) VALUES ($1, $2)
      ON CONFLICT (trainer_id, athlete_id) DO NOTHING`,
      [trainer.id, athlete.id],
    );
  }
  console.log('Datos demo listos. Contraseña de ambas cuentas: Demo1234!');
} finally {
  await pool.end();
}
