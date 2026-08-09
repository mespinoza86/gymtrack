import { pool, withTransaction } from '../config/database.js';

export async function createInvitation(trainerId, code, expiresAt) {
  return (await pool.query(`INSERT INTO invitations (trainer_id, code, expires_at) VALUES ($1, $2, $3)
    RETURNING id, code, status, expires_at, created_at`, [trainerId, code, expiresAt])).rows[0];
}

export async function listInvitations(trainerId) {
  return (await pool.query(`SELECT id, code, status, expires_at, accepted_at, created_at
    FROM invitations WHERE trainer_id = $1 ORDER BY created_at DESC`, [trainerId])).rows;
}

export async function acceptInvitation(code, athleteId) {
  return withTransaction(async (client) => {
    const invitation = (await client.query(`SELECT * FROM invitations
      WHERE code = $1 AND status = 'pending' AND expires_at > NOW() FOR UPDATE`, [code])).rows[0];
    if (!invitation) return null;
    await client.query(`INSERT INTO trainer_athlete_links (trainer_id, athlete_id, status, ended_at)
      VALUES ($1, $2, 'active', NULL)
      ON CONFLICT (trainer_id, athlete_id) DO UPDATE SET status = 'active', ended_at = NULL`, [invitation.trainer_id, athleteId]);
    await client.query(`UPDATE invitations SET status = 'accepted', accepted_by = $2, accepted_at = NOW() WHERE id = $1`, [invitation.id, athleteId]);
    await client.query(`INSERT INTO conversations (trainer_id, athlete_id) VALUES ($1, $2)
      ON CONFLICT (trainer_id, athlete_id) DO NOTHING`, [invitation.trainer_id, athleteId]);
    return invitation;
  });
}

export async function listAthletes(trainerId) {
  return (await pool.query(`SELECT u.id, u.first_name, u.last_name, u.email, l.started_at,
      (SELECT weight_kg FROM measurements WHERE athlete_id = u.id ORDER BY measured_at DESC LIMIT 1) AS latest_weight,
      (SELECT measured_at FROM measurements WHERE athlete_id = u.id ORDER BY measured_at DESC LIMIT 1) AS latest_measurement
    FROM trainer_athlete_links l JOIN users u ON u.id = l.athlete_id
    WHERE l.trainer_id = $1 AND l.status = 'active' ORDER BY u.first_name, u.last_name`, [trainerId])).rows;
}

export async function listTrainers(athleteId) {
  return (await pool.query(`SELECT u.id, u.first_name, u.last_name, u.email, l.started_at
    FROM trainer_athlete_links l JOIN users u ON u.id = l.trainer_id
    WHERE l.athlete_id = $1 AND l.status = 'active' ORDER BY u.first_name`, [athleteId])).rows;
}

export async function activeLink(trainerId, athleteId) {
  return Boolean((await pool.query(`SELECT 1 FROM trainer_athlete_links WHERE trainer_id=$1 AND athlete_id=$2 AND status='active'`, [trainerId, athleteId])).rowCount);
}
