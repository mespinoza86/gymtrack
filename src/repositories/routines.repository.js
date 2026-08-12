import { pool, withTransaction } from '../config/database.js';

export async function listExercises(userId) {
  return (await pool.query(`SELECT id, name, muscle_group, instructions, media_url
    FROM exercises WHERE is_active = TRUE AND (is_public = TRUE OR created_by = $1) ORDER BY name`, [userId])).rows;
}

export async function exerciseLibrary(userId) {
  return (await pool.query(`SELECT e.id,e.name,e.muscle_group,e.instructions,e.media_url,e.is_public,e.is_active,
      EXISTS(SELECT 1 FROM routine_exercises re WHERE re.exercise_id=e.id) AS is_used
    FROM exercises e WHERE e.is_public=TRUE OR e.created_by=$1 ORDER BY e.is_public DESC,e.name`, [userId])).rows;
}

export async function createExercise(userId, input) {
  return (await pool.query(`INSERT INTO exercises (created_by, name, muscle_group, instructions, media_url)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`, [userId, input.name, input.muscleGroup || null, input.instructions || null, input.mediaUrl || null])).rows[0];
}

export async function createRoutine(trainerId, input) {
  return withTransaction((client) => insertRoutine(client, trainerId, input));
}

export async function updateExercise(id, userId, input) {
  return (await pool.query(`UPDATE exercises SET name=$3,muscle_group=$4,instructions=$5,media_url=$6
    WHERE id=$1 AND created_by=$2 AND is_public=FALSE RETURNING *`,
  [id,userId,input.name,input.muscleGroup || null,input.instructions || null,input.mediaUrl || null])).rows[0] || null;
}

export async function setExerciseStatus(id, userId, isActive) {
  return (await pool.query(`UPDATE exercises SET is_active=$3 WHERE id=$1 AND created_by=$2 AND is_public=FALSE RETURNING *`,
    [id,userId,isActive])).rows[0] || null;
}

export async function deleteExercise(id, userId) {
  return withTransaction(async (client) => {
    const exercise=(await client.query('SELECT id FROM exercises WHERE id=$1 AND created_by=$2 AND is_public=FALSE FOR UPDATE',[id,userId])).rows[0];
    if(!exercise) return 'missing';
    if((await client.query('SELECT 1 FROM routine_exercises WHERE exercise_id=$1 LIMIT 1',[id])).rowCount) return 'used';
    await client.query('DELETE FROM exercises WHERE id=$1',[id]);
    return 'deleted';
  });
}

async function insertRoutine(client, trainerId, input) {
  const routine = (await client.query(`INSERT INTO routines (trainer_id, athlete_id, name, description, status, start_date, end_date)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
  [trainerId, input.athleteId || null, input.name, input.description || null, input.status, input.startDate || null, input.endDate || null])).rows[0];
  for (let dayIndex = 0; dayIndex < input.days.length; dayIndex += 1) {
    const dayInput = input.days[dayIndex];
    const day = (await client.query(`INSERT INTO routine_days (routine_id,name,day_order,notes) VALUES ($1,$2,$3,$4) RETURNING id`,
      [routine.id, dayInput.name, dayIndex + 1, dayInput.notes || null])).rows[0];
    for (let exerciseIndex = 0; exerciseIndex < dayInput.exercises.length; exerciseIndex += 1) {
      const item = dayInput.exercises[exerciseIndex];
      await client.query(`INSERT INTO routine_exercises
        (routine_day_id,exercise_id,exercise_order,sets,reps,target_weight,rest_seconds,rir,tempo,notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [day.id, item.exerciseId, exerciseIndex + 1, item.sets, item.reps, item.targetWeight ?? null,
        item.restSeconds ?? null, item.rir ?? null, item.tempo || null, item.notes || null]);
    }
  }
  return routine;
}

export async function replaceRoutine(id, trainerId, input) {
  return withTransaction(async (client) => {
    const previous = (await client.query('SELECT id FROM routines WHERE id=$1 AND trainer_id=$2 FOR UPDATE', [id, trainerId])).rows[0];
    if (!previous) return null;
    await client.query("UPDATE routines SET status='archived' WHERE id=$1", [id]);
    return insertRoutine(client, trainerId, input);
  });
}

export async function listRoutines(user) {
  const condition = user.role === 'trainer' ? "r.trainer_id = $1 AND r.status <> 'archived'" : "r.athlete_id = $1 AND r.status = 'active'";
  return (await pool.query(`SELECT r.*, u.first_name AS athlete_first_name, u.last_name AS athlete_last_name
    FROM routines r LEFT JOIN users u ON u.id = r.athlete_id WHERE ${condition} ORDER BY r.updated_at DESC`, [user.id])).rows;
}

export async function getRoutine(id, user) {
  const condition = user.role === 'trainer' ? 'r.trainer_id = $2' : 'r.athlete_id = $2';
  const routine = (await pool.query(`SELECT r.* FROM routines r WHERE r.id=$1 AND ${condition}`, [id, user.id])).rows[0];
  if (!routine) return null;
  routine.days = (await pool.query(`SELECT d.id, d.name, d.day_order, d.notes,
      COALESCE(json_agg(json_build_object('id',re.id,'exerciseId',e.id,'name',e.name,'muscleGroup',e.muscle_group,
        'instructions',e.instructions,'mediaUrl',e.media_url,
        'sets',re.sets,'reps',re.reps,'targetWeight',re.target_weight,'restSeconds',re.rest_seconds,'rir',re.rir,
        'tempo',re.tempo,'notes',re.notes) ORDER BY re.exercise_order) FILTER (WHERE re.id IS NOT NULL), '[]') AS exercises
    FROM routine_days d LEFT JOIN routine_exercises re ON re.routine_day_id=d.id LEFT JOIN exercises e ON e.id=re.exercise_id
    WHERE d.routine_id=$1 GROUP BY d.id ORDER BY d.day_order`, [id])).rows;
  return routine;
}

export async function startWorkout(athleteId, routineDayId) {
  return (await pool.query(`INSERT INTO workout_sessions (athlete_id,routine_day_id) VALUES ($1,$2) RETURNING *`, [athleteId, routineDayId])).rows[0];
}

export async function finishWorkout(athleteId, sessionId, input) {
  return withTransaction(async (client) => {
    const session = (await client.query(`UPDATE workout_sessions SET completed_at=NOW(), energy=$3, notes=$4
      WHERE id=$1 AND athlete_id=$2 AND completed_at IS NULL RETURNING *`, [sessionId, athleteId, input.energy ?? null, input.notes || null])).rows[0];
    if (!session) return null;
    for (const item of input.sets) {
      await client.query(`INSERT INTO performed_sets (workout_session_id,routine_exercise_id,set_number,reps,weight,rpe,pain,notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [sessionId,item.routineExerciseId,item.setNumber,item.reps,item.weight,item.rpe ?? null,item.pain ?? false,item.notes || null]);
    }
    return session;
  });
}

export async function workoutHistory(athleteId) {
  return (await pool.query(`SELECT ws.id,ws.started_at,ws.completed_at,ws.energy,ws.notes,rd.name AS day_name,r.name AS routine_name,
      COUNT(ps.id)::int AS sets_completed, COALESCE(SUM(ps.weight * ps.reps),0) AS volume
    FROM workout_sessions ws LEFT JOIN routine_days rd ON rd.id=ws.routine_day_id LEFT JOIN routines r ON r.id=rd.routine_id
    LEFT JOIN performed_sets ps ON ps.workout_session_id=ws.id WHERE ws.athlete_id=$1
    GROUP BY ws.id,rd.name,r.name ORDER BY ws.started_at DESC LIMIT 100`, [athleteId])).rows;
}
