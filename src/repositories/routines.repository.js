import { pool, withTransaction } from '../config/database.js';

export async function listExercises(userId) {
  return (
    await pool.query(
      `SELECT id, name, muscle_group, instructions, media_url
    FROM exercises WHERE is_active = TRUE AND (is_public = TRUE OR created_by = $1) ORDER BY name`,
      [userId],
    )
  ).rows;
}

export async function exerciseLibrary(userId) {
  return (
    await pool.query(
      `SELECT e.id,e.name,e.muscle_group,e.instructions,e.media_url,e.is_public,e.is_active,
      EXISTS(SELECT 1 FROM routine_exercises re WHERE re.exercise_id=e.id) AS is_used
    FROM exercises e WHERE e.is_public=TRUE OR e.created_by=$1 ORDER BY e.is_public DESC,e.name`,
      [userId],
    )
  ).rows;
}

export async function createExercise(userId, input) {
  return (
    await pool.query(
      `INSERT INTO exercises (created_by, name, muscle_group, instructions, media_url)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        userId,
        input.name,
        input.muscleGroup || null,
        input.instructions || null,
        input.mediaUrl || null,
      ],
    )
  ).rows[0];
}

export async function createRoutine(trainerId, input) {
  return withTransaction((client) => insertRoutine(client, trainerId, input));
}

export async function updateExercise(id, userId, input) {
  return (
    (
      await pool.query(
        `UPDATE exercises SET name=$3,muscle_group=$4,instructions=$5,media_url=$6
    WHERE id=$1 AND created_by=$2 AND is_public=FALSE RETURNING *`,
        [
          id,
          userId,
          input.name,
          input.muscleGroup || null,
          input.instructions || null,
          input.mediaUrl || null,
        ],
      )
    ).rows[0] || null
  );
}

export async function setExerciseStatus(id, userId, isActive) {
  return (
    (
      await pool.query(
        `UPDATE exercises SET is_active=$3 WHERE id=$1 AND created_by=$2 AND is_public=FALSE RETURNING *`,
        [id, userId, isActive],
      )
    ).rows[0] || null
  );
}

export async function deleteExercise(id, userId) {
  return withTransaction(async (client) => {
    const exercise = (
      await client.query(
        'SELECT id FROM exercises WHERE id=$1 AND created_by=$2 AND is_public=FALSE FOR UPDATE',
        [id, userId],
      )
    ).rows[0];
    if (!exercise) return 'missing';
    if (
      (await client.query('SELECT 1 FROM routine_exercises WHERE exercise_id=$1 LIMIT 1', [id]))
        .rowCount
    )
      return 'used';
    await client.query('DELETE FROM exercises WHERE id=$1', [id]);
    return 'deleted';
  });
}

async function insertRoutine(client, trainerId, input, originRoutineId = null) {
  /* `end_date` se deriva siempre del inicio y la duración; no se recibe del
     cliente para que no puedan quedar incoherentes entre sí. */
  const routine = (
    await client.query(
      `INSERT INTO routines
        (trainer_id, athlete_id, name, description, status, start_date, end_date, weeks, origin_routine_id)
      VALUES ($1,$2,$3,$4,$5,$6,
        CASE WHEN $6::date IS NULL THEN NULL ELSE $6::date + ($7::int * 7 - 1) END,
        $7,$8)
      RETURNING *`,
      [
        trainerId,
        input.athleteId || null,
        input.name,
        input.description || null,
        input.status,
        input.startDate || null,
        input.weeks ?? 1,
        originRoutineId,
      ],
    )
  ).rows[0];

  /* Una rutina creada desde cero es el origen de su propio linaje. */
  if (!routine.origin_routine_id) {
    await client.query('UPDATE routines SET origin_routine_id=id WHERE id=$1', [routine.id]);
    routine.origin_routine_id = routine.id;
  }

  /* Los ejercicios ya insertados de cada franja, para poder resolver los
     días espejo sin volver a consultarlos. */
  const exercisesByDayOrder = new Map();

  for (let dayIndex = 0; dayIndex < input.days.length; dayIndex += 1) {
    const dayInput = input.days[dayIndex];
    const dayOrder = dayIndex + 1;
    const dayType = dayInput.dayType ?? 'training';

    /* Un día libre nunca tiene ejercicios ni espejo, aunque el cliente los envíe. */
    const mirrors = dayType === 'training' ? (dayInput.mirrorsDayOrder ?? null) : null;
    let exercises = dayType === 'training' ? (dayInput.exercises ?? []) : [];

    /* Si el día apunta a otro y no trae lista propia, se copia la del día
       espejado. Siempre es una franja anterior, así que ya está resuelta. */
    if (mirrors && exercises.length === 0) exercises = exercisesByDayOrder.get(mirrors) ?? [];

    const day = (
      await client.query(
        `INSERT INTO routine_days (routine_id,name,day_order,notes,day_type,mirrors_day_order)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [routine.id, dayInput.name, dayOrder, dayInput.notes || null, dayType, mirrors],
      )
    ).rows[0];

    for (let exerciseIndex = 0; exerciseIndex < exercises.length; exerciseIndex += 1) {
      const item = exercises[exerciseIndex];
      await client.query(
        `INSERT INTO routine_exercises
        (routine_day_id,exercise_id,exercise_order,sets,reps,target_weight,rest_seconds,rir,tempo,notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          day.id,
          item.exerciseId,
          exerciseIndex + 1,
          item.sets,
          item.reps,
          item.targetWeight ?? null,
          item.restSeconds ?? null,
          item.rir ?? null,
          item.tempo || null,
          item.notes || null,
        ],
      );
    }

    exercisesByDayOrder.set(dayOrder, exercises);
  }

  return routine;
}

export async function replaceRoutine(id, trainerId, input) {
  return withTransaction(async (client) => {
    const previous = (
      await client.query(
        'SELECT id, origin_routine_id FROM routines WHERE id=$1 AND trainer_id=$2 FOR UPDATE',
        [id, trainerId],
      )
    ).rows[0];
    if (!previous) return null;
    await client.query("UPDATE routines SET status='archived' WHERE id=$1", [id]);
    /* La versión nueva hereda el linaje para que el progreso ya registrado
       por el atleta siga siendo visible después de modificar el plan. */
    return insertRoutine(client, trainerId, input, previous.origin_routine_id || previous.id);
  });
}

/* `archived` solo lo usa el entrenador, para consultar lo que guardó. El
   atleta ve siempre y únicamente sus rutinas activas: una archivada dejó de
   estar vigente y mostrársela solo confundiría sobre qué le toca entrenar. */
export async function listRoutines(user, archived = false) {
  const condition =
    user.role === 'trainer'
      ? `r.trainer_id = $1 AND r.status ${archived ? '=' : '<>'} 'archived'`
      : "r.athlete_id = $1 AND r.status = 'active'";
  return (
    await pool.query(
      `SELECT r.*, u.first_name AS athlete_first_name, u.last_name AS athlete_last_name
    FROM routines r LEFT JOIN users u ON u.id = r.athlete_id WHERE ${condition} ORDER BY r.updated_at DESC`,
      [user.id],
    )
  ).rows;
}

/* Archiva o restaura una rutina. No se ofrece borrarla: las sesiones de
   entrenamiento apuntan a sus días mediante claves foráneas, así que eliminarla
   destruiría el historial del atleta. Archivar la retira de las listas y
   conserva todo lo registrado. */
export async function setRoutineStatus(id, trainerId, status) {
  return (
    await pool.query(
      `UPDATE routines SET status = $3
        WHERE id = $1 AND trainer_id = $2
        RETURNING id, name, status`,
      [id, trainerId, status],
    )
  ).rows[0];
}

export async function getRoutine(id, user) {
  const condition = user.role === 'trainer' ? 'r.trainer_id = $2' : 'r.athlete_id = $2';
  const routine = (
    await pool.query(`SELECT r.* FROM routines r WHERE r.id=$1 AND ${condition}`, [id, user.id])
  ).rows[0];
  if (!routine) return null;
  routine.days = (
    await pool.query(
      `SELECT d.id, d.name, d.day_order, d.notes, d.day_type, d.mirrors_day_order,
      COALESCE(json_agg(json_build_object('id',re.id,'exerciseId',e.id,'name',e.name,'muscleGroup',e.muscle_group,
        'instructions',e.instructions,'mediaUrl',e.media_url,
        'sets',re.sets,'reps',re.reps,'targetWeight',re.target_weight,'restSeconds',re.rest_seconds,'rir',re.rir,
        'tempo',re.tempo,'notes',re.notes) ORDER BY re.exercise_order) FILTER (WHERE re.id IS NOT NULL), '[]') AS exercises
    FROM routine_days d LEFT JOIN routine_exercises re ON re.routine_day_id=d.id LEFT JOIN exercises e ON e.id=re.exercise_id
    WHERE d.routine_id=$1 GROUP BY d.id ORDER BY d.day_order`,
      [id],
    )
  ).rows;
  return routine;
}

/* ---------- Registro del entrenamiento ---------- */

async function insertSet(client, sessionId, routineExerciseId, item) {
  await client.query(
    `INSERT INTO performed_sets (workout_session_id,routine_exercise_id,set_number,reps,weight,rpe,pain,notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      sessionId,
      routineExerciseId,
      item.setNumber,
      item.reps,
      item.weight,
      item.rpe ?? null,
      item.pain ?? false,
      item.notes || null,
    ],
  );
}

/* Vuelve a contar los ejercicios marcados y decide si el día queda cumplido.

   `allowReopen` solo se activa al desmarcar un ejercicio. Al marcar nunca se
   reabre un día ya cerrado, porque el atleta pudo haberlo cerrado a propósito
   con menos ejercicios de los planificados. */
async function refreshCompletion(client, sessionId, routineDayId, allowReopen) {
  const wasCompleted = Boolean(
    (await client.query('SELECT completed_at FROM workout_sessions WHERE id=$1', [sessionId]))
      .rows[0]?.completed_at,
  );
  const total = (
    await client.query('SELECT COUNT(*)::int AS n FROM routine_exercises WHERE routine_day_id=$1', [
      routineDayId,
    ])
  ).rows[0].n;
  const done = (
    await client.query(
      'SELECT COUNT(*)::int AS n FROM workout_exercise_log WHERE workout_session_id=$1',
      [sessionId],
    )
  ).rows[0].n;

  const completed = done >= total;
  const session = (
    await client.query(
      `UPDATE workout_sessions
        SET completed_at = CASE
              WHEN $2 THEN COALESCE(completed_at, NOW())
              WHEN $3 THEN NULL
              ELSE completed_at END
      WHERE id=$1 RETURNING *`,
      [sessionId, completed, allowReopen],
    )
  ).rows[0];

  return {
    session,
    totalExercises: total,
    completedExercises: done,
    newlyCompleted: !wasCompleted && Boolean(session.completed_at),
  };
}

/* Lo que el atleta ya registró en esta sesión: qué ejercicios dio por
   terminados y con qué series. Sin esto, al volver a un día a medias la
   pantalla no podría mostrar lo ya hecho ni recuperar los números escritos. */
async function loggedExercises(client, sessionId) {
  return (
    await client.query(
      `SELECT wel.routine_exercise_id AS "routineExerciseId",
        COALESCE(
          json_agg(
            json_build_object('setNumber', ps.set_number, 'reps', ps.reps,
              'weight', ps.weight, 'pain', ps.pain)
            ORDER BY ps.set_number
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'
        ) AS sets
      FROM workout_exercise_log wel
      LEFT JOIN performed_sets ps
        ON ps.workout_session_id = wel.workout_session_id
        AND ps.routine_exercise_id = wel.routine_exercise_id
      WHERE wel.workout_session_id = $1
      GROUP BY wel.routine_exercise_id`,
      [sessionId],
    )
  ).rows;
}

/* Abre el día o recupera el que ya existiera en esa semana.

   Se reutiliza la sesión aunque esté terminada: volver a un día cumplido
   tiene que mostrar lo que se registró, no empezar de cero. Una franja de la
   semana es una sola sesión.

   Comprueba que el día pertenezca de verdad a una rutina activa del atleta:
   el identificador llega del navegador y no puede darse por bueno. */
export async function startWorkout(athleteId, routineDayId, weekNumber) {
  return withTransaction(async (client) => {
    const day = (
      await client.query(
        `SELECT rd.id, rd.day_type, r.weeks
        FROM routine_days rd JOIN routines r ON r.id = rd.routine_id
        WHERE rd.id=$1 AND r.athlete_id=$2 AND r.status='active'`,
        [routineDayId, athleteId],
      )
    ).rows[0];
    if (!day) return { error: 'forbidden' };
    if (weekNumber > day.weeks) return { error: 'week' };

    const open = (
      await client.query(
        `SELECT * FROM workout_sessions
        WHERE athlete_id=$1 AND routine_day_id=$2 AND week_number=$3
        ORDER BY started_at DESC LIMIT 1`,
        [athleteId, routineDayId, weekNumber],
      )
    ).rows[0];

    const session =
      open ??
      (
        await client.query(
          `INSERT INTO workout_sessions (athlete_id,routine_day_id,week_number)
          VALUES ($1,$2,$3) RETURNING *`,
          [athleteId, routineDayId, weekNumber],
        )
      ).rows[0];

    /* Un día libre no tiene ejercicios, así que queda cumplido en el mismo
       momento en que el atleta lo marca. */
    const progress = await refreshCompletion(client, session.id, routineDayId, false);
    return { ...progress, logged: await loggedExercises(client, session.id) };
  });
}

/* Guarda las series de un solo ejercicio y lo marca como terminado. */
export async function logExercise(athleteId, sessionId, routineExerciseId, sets) {
  return withTransaction(async (client) => {
    const session = (
      await client.query(
        'SELECT id, routine_day_id, completed_at FROM workout_sessions WHERE id=$1 AND athlete_id=$2 FOR UPDATE',
        [sessionId, athleteId],
      )
    ).rows[0];
    if (!session) return { error: 'session' };

    const belongs = (
      await client.query('SELECT 1 FROM routine_exercises WHERE id=$1 AND routine_day_id=$2', [
        routineExerciseId,
        session.routine_day_id,
      ])
    ).rowCount;
    if (!belongs) return { error: 'exercise' };

    /* Volver a guardar el mismo ejercicio reemplaza sus series en lugar de
       duplicarlas, para que corregir un dato no choque con la unicidad. */
    await client.query(
      'DELETE FROM performed_sets WHERE workout_session_id=$1 AND routine_exercise_id=$2',
      [sessionId, routineExerciseId],
    );
    for (const item of sets) await insertSet(client, sessionId, routineExerciseId, item);

    await client.query(
      `INSERT INTO workout_exercise_log (workout_session_id,routine_exercise_id) VALUES ($1,$2)
      ON CONFLICT (workout_session_id,routine_exercise_id) DO UPDATE SET completed_at=NOW()`,
      [sessionId, routineExerciseId],
    );

    return refreshCompletion(client, sessionId, session.routine_day_id, false);
  });
}

/* Deshace el marcado de un ejercicio y, si el día estaba cerrado, lo reabre. */
export async function unlogExercise(athleteId, sessionId, routineExerciseId) {
  return withTransaction(async (client) => {
    const session = (
      await client.query(
        'SELECT id, routine_day_id FROM workout_sessions WHERE id=$1 AND athlete_id=$2 FOR UPDATE',
        [sessionId, athleteId],
      )
    ).rows[0];
    if (!session) return { error: 'session' };

    await client.query(
      'DELETE FROM workout_exercise_log WHERE workout_session_id=$1 AND routine_exercise_id=$2',
      [sessionId, routineExerciseId],
    );
    await client.query(
      'DELETE FROM performed_sets WHERE workout_session_id=$1 AND routine_exercise_id=$2',
      [sessionId, routineExerciseId],
    );

    return refreshCompletion(client, sessionId, session.routine_day_id, true);
  });
}

/* Cierra el día. Sirve para registrar energía y notas, y para dar por
   terminada una jornada aunque queden ejercicios sin marcar. */
export async function finishWorkout(athleteId, sessionId, input) {
  return withTransaction(async (client) => {
    const session = (
      await client.query(
        'SELECT id, routine_day_id FROM workout_sessions WHERE id=$1 AND athlete_id=$2 FOR UPDATE',
        [sessionId, athleteId],
      )
    ).rows[0];
    if (!session) return { error: 'session' };

    const sets = input.sets ?? [];
    if (sets.length) {
      const exerciseIds = [...new Set(sets.map((item) => item.routineExerciseId))];

      /* Todos los ejercicios enviados tienen que pertenecer al día de esta
         sesión; si alguno no pertenece, no se guarda nada. */
      const found = (
        await client.query(
          'SELECT id FROM routine_exercises WHERE routine_day_id=$1 AND id = ANY($2::uuid[])',
          [session.routine_day_id, exerciseIds],
        )
      ).rowCount;
      if (found !== exerciseIds.length) return { error: 'exercise' };

      for (const exerciseId of exerciseIds) {
        await client.query(
          'DELETE FROM performed_sets WHERE workout_session_id=$1 AND routine_exercise_id=$2',
          [sessionId, exerciseId],
        );
      }
      for (const item of sets) await insertSet(client, sessionId, item.routineExerciseId, item);
      for (const exerciseId of exerciseIds) {
        await client.query(
          `INSERT INTO workout_exercise_log (workout_session_id,routine_exercise_id) VALUES ($1,$2)
          ON CONFLICT (workout_session_id,routine_exercise_id) DO UPDATE SET completed_at=NOW()`,
          [sessionId, exerciseId],
        );
      }
    }

    const updated = (
      await client.query(
        `UPDATE workout_sessions SET completed_at=COALESCE(completed_at, NOW()), energy=$3, notes=$4
        WHERE id=$1 AND athlete_id=$2 RETURNING *`,
        [sessionId, athleteId, input.energy ?? null, input.notes || null],
      )
    ).rows[0];

    return {
      session: updated,
      newlyCompleted: !session.completed_at && Boolean(updated.completed_at),
    };
  });
}

/* Datos mínimos para avisar al entrenador cuando se completa una jornada. */
export async function workoutNotificationContext(sessionId) {
  return (
    await pool.query(
      `SELECT r.trainer_id, r.name AS routine_name, rd.name AS day_name, rd.day_type,
        ws.athlete_id, u.first_name AS athlete_first_name, u.last_name AS athlete_last_name
       FROM workout_sessions ws
       JOIN routine_days rd ON rd.id=ws.routine_day_id
       JOIN routines r ON r.id=rd.routine_id
       JOIN users u ON u.id=ws.athlete_id
       WHERE ws.id=$1`,
      [sessionId],
    )
  ).rows[0];
}

/* La rutina activa de cada atleta vinculado, para el resumen del entrenador.

   `DISTINCT ON` se queda con la más reciente cuando un atleta tiene varias
   activas. El `LEFT JOIN` conserva a los atletas que aún no tienen ninguna:
   en la lista deben aparecer igual, con su aviso. */
export async function trainerAthleteRoutines(trainerId) {
  return (
    await pool.query(
      `SELECT DISTINCT ON (u.id)
        u.id AS athlete_id, u.first_name, u.last_name,
        r.id AS routine_id, r.name AS routine_name, r.weeks, r.start_date,
        COALESCE(r.origin_routine_id, r.id) AS origin_id,
        (SELECT COUNT(*)::int FROM routine_days d
          WHERE d.routine_id = r.id AND d.day_type = 'training') AS training_days
      FROM trainer_athlete_links l
      JOIN users u ON u.id = l.athlete_id
      LEFT JOIN routines r
        ON r.athlete_id = u.id AND r.trainer_id = $1 AND r.status = 'active'
      WHERE l.trainer_id = $1 AND l.status = 'active'
      ORDER BY u.id, r.updated_at DESC NULLS LAST`,
      [trainerId],
    )
  ).rows;
}

/* Días de entrenamiento cumplidos en una semana concreta, para varias rutinas
   a la vez. Se resuelve en una sola consulta con dos listas en paralelo para
   no lanzar una por atleta. */
export async function completedTrainingDays(origins, weeks) {
  if (!origins.length) return [];

  return (
    await pool.query(
      `WITH objetivo AS (SELECT * FROM unnest($1::uuid[], $2::int[]) AS t(origin, week))
      SELECT o.origin, o.week,
        COUNT(DISTINCT CASE WHEN ws.id IS NOT NULL THEN rd.day_order END)::int AS completed
      FROM objetivo o
      LEFT JOIN routines r ON COALESCE(r.origin_routine_id, r.id) = o.origin
      LEFT JOIN routine_days rd ON rd.routine_id = r.id AND rd.day_type = 'training'
      LEFT JOIN workout_sessions ws
        ON ws.routine_day_id = rd.id AND ws.week_number = o.week AND ws.completed_at IS NOT NULL
      GROUP BY o.origin, o.week`,
      [origins, weeks],
    )
  ).rows;
}

/* Cumplimiento del atleta sobre una rutina, franja por franja.

   Recorre todo el linaje de la rutina —las versiones archivadas por
   modificaciones anteriores— porque cada edición crea una rutina nueva y, sin
   esto, el progreso desaparecería cada vez que el entrenador ajusta el plan. */
export async function routineProgress(routineId, athleteId) {
  return (
    await pool.query(
      `WITH lineage AS (
        SELECT r.id FROM routines r
        WHERE COALESCE(r.origin_routine_id, r.id) =
          (SELECT COALESCE(origin_routine_id, id) FROM routines WHERE id=$1)
      )
      SELECT ws.week_number, rd.day_order, ws.started_at, ws.completed_at,
        (SELECT COUNT(*)::int FROM workout_exercise_log wel WHERE wel.workout_session_id=ws.id)
          AS completed_exercises,
        (SELECT COUNT(*)::int FROM routine_exercises re WHERE re.routine_day_id=rd.id)
          AS total_exercises
      FROM workout_sessions ws JOIN routine_days rd ON rd.id=ws.routine_day_id
      WHERE rd.routine_id IN (SELECT id FROM lineage) AND ws.athlete_id=$2
      ORDER BY ws.week_number, rd.day_order, ws.started_at`,
      [routineId, athleteId],
    )
  ).rows;
}

export async function workoutHistory(athleteId) {
  return (
    await pool.query(
      `SELECT ws.id,ws.started_at,ws.completed_at,ws.energy,ws.notes,rd.name AS day_name,r.name AS routine_name,
      COUNT(ps.id)::int AS sets_completed, COALESCE(SUM(ps.weight * ps.reps),0) AS volume
    FROM workout_sessions ws LEFT JOIN routine_days rd ON rd.id=ws.routine_day_id LEFT JOIN routines r ON r.id=rd.routine_id
    LEFT JOIN performed_sets ps ON ps.workout_session_id=ws.id WHERE ws.athlete_id=$1
    GROUP BY ws.id,rd.name,r.name ORDER BY ws.started_at DESC LIMIT 100`,
      [athleteId],
    )
  ).rows;
}
