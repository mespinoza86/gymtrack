/* Consultas de mensajería. Este es el único nivel que habla con PostgreSQL:
   los permisos y las reglas viven en el servicio, y aquí solo hay SQL.
   Todas las consultas usan parámetros ($1, $2, ...), nunca concatenación,
   para que ningún dato del usuario pueda alterar la consulta. */

import { pool } from '../config/database.js';

/* Conversaciones en las que participa la persona, ordenadas por el mensaje
   más reciente. Como una conversación siempre une a un entrenador con un
   atleta, se devuelve el nombre de "la otra parte" según quién pregunte.
   Las subconsultas traen el último mensaje para la vista previa de la lista. */
export async function conversations(user) {
  const { rows } = await pool.query(
    `SELECT
       c.id,
       c.trainer_id,
       c.athlete_id,
       CASE WHEN c.trainer_id = $1 THEN a.first_name ELSE t.first_name END AS other_first_name,
       CASE WHEN c.trainer_id = $1 THEN a.last_name  ELSE t.last_name  END AS other_last_name,
       (SELECT body
          FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC
         LIMIT 1) AS last_message,
       (SELECT created_at
          FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC
         LIMIT 1) AS last_message_at
     FROM conversations c
     JOIN users t ON t.id = c.trainer_id
     JOIN users a ON a.id = c.athlete_id
     WHERE c.trainer_id = $1 OR c.athlete_id = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [user.id],
  );

  return rows;
}

/* Mensajes sin leer de todas las conversaciones de una persona. Los propios se
   excluyen con `sender_id <> $1`: nadie tiene pendiente lo que escribió él. */
export async function unreadCount(userId) {
  return (
    await pool.query(
      `SELECT COUNT(*)::int AS total
         FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
        WHERE (c.trainer_id = $1 OR c.athlete_id = $1)
          AND m.sender_id <> $1
          AND m.read_at IS NULL`,
      [userId],
    )
  ).rows[0].total;
}

/* Comprobación de permiso: solo las dos personas de la conversación
   pueden leerla o escribir en ella. */
export async function canAccess(id, userId) {
  const { rowCount } = await pool.query(
    `SELECT 1
       FROM conversations
      WHERE id = $1 AND (trainer_id = $2 OR athlete_id = $2)`,
    [id, userId],
  );

  return Boolean(rowCount);
}

/* Historial de la conversación. El límite evita traer un hilo enorme de
   una sola vez; la paginación queda pendiente para una etapa posterior. */
export async function messages(id) {
  const { rows } = await pool.query(
    `SELECT m.id, m.body, m.created_at, m.read_at, m.sender_id, u.first_name, u.last_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT 500`,
    [id],
  );

  return rows;
}

export async function send(id, senderId, body) {
  const { rows } = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, senderId, body],
  );

  return rows[0];
}

export async function recipient(id, senderId) {
  return (
    await pool.query(
      `SELECT CASE WHEN trainer_id=$2 THEN athlete_id ELSE trainer_id END AS user_id
       FROM conversations
       WHERE id=$1 AND (trainer_id=$2 OR athlete_id=$2)`,
      [id, senderId],
    )
  ).rows[0]?.user_id;
}

/* Marca como leídos los mensajes de la otra persona. Los propios se excluyen
   con `sender_id <> $2`, y los ya leídos se dejan con su fecha original. */
export async function markRead(id, userId) {
  await pool.query(
    `UPDATE messages
        SET read_at = NOW()
      WHERE conversation_id = $1
        AND sender_id <> $2
        AND read_at IS NULL`,
    [id, userId],
  );
}
