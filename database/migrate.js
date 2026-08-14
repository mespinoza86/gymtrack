import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/config/database.js';

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

try {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const applied = new Set(
    (await pool.query('SELECT filename FROM schema_migrations')).rows.map((row) => row.filename),
  );
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
  for (const filename of files) {
    if (applied.has(filename)) continue;
    const sql = await fs.readFile(path.join(directory, filename), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
      await client.query('COMMIT');
      console.log(`Aplicada: ${filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  console.log('Migraciones al día.');
} finally {
  await pool.end();
}
