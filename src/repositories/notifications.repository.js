import { pool } from '../config/database.js';

export async function create({ userId, type, title, body = null, link = null }) {
  return (
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, type, title, body, link],
    )
  ).rows[0];
}

/* Algunos eventos pueden volver a atravesar el mismo estado, por ejemplo si
   se desmarca y vuelve a completar un ejercicio. Para ellos el enlace lleva
   una clave estable del evento y evita repetir el mismo aviso. */
export async function createOnce({ userId, type, title, body = null, link }) {
  return (
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link)
       SELECT $1::uuid,$2::varchar(50),$3::varchar(160),$4::text,$5::text
       WHERE NOT EXISTS (
         SELECT 1 FROM notifications WHERE user_id=$1 AND type=$2 AND link=$5
       )
       RETURNING *`,
      [userId, type, title, body, link],
    )
  ).rows[0];
}

/* Para eventos que sí se repiten de verdad, como los mensajes de un chat.
   Agrupa mientras el aviso siga pendiente: en cuanto el usuario lo lee, el
   siguiente mensaje vuelve a avisar. Sin esto una conversación larga llenaría
   la bandeja con un aviso por mensaje. */
export async function createUnlessUnread({ userId, type, title, body = null, link }) {
  return (
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link)
       SELECT $1::uuid,$2::varchar(50),$3::varchar(160),$4::text,$5::text
       WHERE NOT EXISTS (
         SELECT 1 FROM notifications
          WHERE user_id=$1 AND type=$2 AND link=$5 AND read_at IS NULL
       )
       RETURNING *`,
      [userId, type, title, body, link],
    )
  ).rows[0];
}

export async function list(userId) {
  return (
    await pool.query(
      `SELECT id,type,title,body,link,read_at,created_at
       FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,
      [userId],
    )
  ).rows;
}

export async function unreadCount(userId) {
  return (
    await pool.query(
      'SELECT COUNT(*)::int AS total FROM notifications WHERE user_id=$1 AND read_at IS NULL',
      [userId],
    )
  ).rows[0].total;
}

export async function markRead(id, userId) {
  return (
    await pool.query(
      `UPDATE notifications SET read_at=COALESCE(read_at,NOW())
       WHERE id=$1 AND user_id=$2 RETURNING *`,
      [id, userId],
    )
  ).rows[0];
}

export async function markAllRead(userId) {
  return (
    await pool.query(
      'UPDATE notifications SET read_at=NOW() WHERE user_id=$1 AND read_at IS NULL',
      [userId],
    )
  ).rowCount;
}
