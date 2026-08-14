/* Consultas de seguimiento: mediciones corporales, check-ins periódicos y
   planes nutricionales. Este es el único nivel que habla con PostgreSQL.
   Todas las consultas usan parámetros ($1, $2, ...), nunca concatenación de
   datos del usuario.

   Aviso sobre `${column}`: en dos consultas el nombre de la columna se elige
   según el rol. No es un dato escrito por nadie, sino uno de dos valores
   fijos decididos en este mismo archivo, así que no abre una vía de
   inyección; los valores sí viajan siempre como parámetros. */

import { pool } from '../config/database.js';

/* ---------- Mediciones ---------- */

/* Guarda una medición. Si ya existe una del mismo atleta en esa fecha, se
   actualiza en lugar de duplicarla: así corregir una medición del día no
   deja dos filas en el historial ni en las gráficas. */
export async function addMeasurement(athleteId, recordedBy, input) {
  const { rows } = await pool.query(
    `INSERT INTO measurements
       (athlete_id, recorded_by, measured_at, weight_kg, body_fat_percent,
        waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (athlete_id, measured_at) DO UPDATE SET
       recorded_by      = EXCLUDED.recorded_by,
       weight_kg        = EXCLUDED.weight_kg,
       body_fat_percent = EXCLUDED.body_fat_percent,
       waist_cm         = EXCLUDED.waist_cm,
       hip_cm           = EXCLUDED.hip_cm,
       chest_cm         = EXCLUDED.chest_cm,
       arm_cm           = EXCLUDED.arm_cm,
       thigh_cm         = EXCLUDED.thigh_cm,
       notes            = EXCLUDED.notes
     RETURNING *`,
    [
      athleteId,
      recordedBy,
      input.measuredAt,
      /* Todas las medidas son opcionales: sin valor se guarda nulo, que
         significa "no se midió", distinto de haber medido cero. */
      input.weightKg ?? null,
      input.bodyFatPercent ?? null,
      input.waistCm ?? null,
      input.hipCm ?? null,
      input.chestCm ?? null,
      input.armCm ?? null,
      input.thighCm ?? null,
      input.notes || null,
    ],
  );

  return rows[0];
}

export async function measurements(athleteId) {
  const { rows } = await pool.query(
    `SELECT *
       FROM measurements
      WHERE athlete_id = $1
      ORDER BY measured_at DESC
      LIMIT 365`,
    [athleteId],
  );

  return rows;
}

/* ---------- Check-ins ---------- */

export async function createCheckin(athleteId, input) {
  const { rows } = await pool.query(
    `INSERT INTO checkins
       (athlete_id, trainer_id, checkin_date, energy, sleep_hours, stress,
        hunger, adherence, pain_details, wins, difficulties)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      athleteId,
      input.trainerId,
      input.checkinDate,
      input.energy,
      input.sleepHours,
      input.stress,
      input.hunger,
      input.adherence,
      input.painDetails || null,
      input.wins || null,
      input.difficulties || null,
    ],
  );

  return rows[0];
}

/* La misma consulta sirve a las dos pantallas: el entrenador ve los
   check-ins que recibió y el atleta los que envió. */
export async function checkins(user) {
  const column = user.role === 'trainer' ? 'trainer_id' : 'athlete_id';

  const { rows } = await pool.query(
    `SELECT
       c.*,
       a.first_name AS athlete_first_name,
       a.last_name  AS athlete_last_name,
       t.first_name AS trainer_first_name,
       t.last_name  AS trainer_last_name
     FROM checkins c
     JOIN users a ON a.id = c.athlete_id
     JOIN users t ON t.id = c.trainer_id
     WHERE c.${column} = $1
     ORDER BY checkin_date DESC
     LIMIT 100`,
    [user.id],
  );

  return rows;
}

/* El `trainer_id = $2` no es un filtro cualquiera: impide que un entrenador
   responda un check-in que no le fue enviado. Si no coincide, no se
   actualiza ninguna fila y se devuelve undefined. */
export async function reviewCheckin(trainerId, id, feedback) {
  const { rows } = await pool.query(
    `UPDATE checkins
        SET trainer_feedback = $3,
            reviewed_at = NOW()
      WHERE id = $1 AND trainer_id = $2
      RETURNING *`,
    [id, trainerId, feedback],
  );

  return rows[0];
}

/* ---------- Planes nutricionales ---------- */

export async function createNutritionPlan(trainerId, input) {
  const { rows } = await pool.query(
    `INSERT INTO nutrition_plans
       (trainer_id, athlete_id, name, description, calories, protein_g,
        carbs_g, fats_g, fiber_g, water_ml, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
     RETURNING *`,
    [
      trainerId,
      input.athleteId,
      input.name,
      input.description || null,
      /* Los objetivos son opcionales; sin valor se guarda nulo. */
      input.calories ?? null,
      input.proteinG ?? null,
      input.carbsG ?? null,
      input.fatsG ?? null,
      input.fiberG ?? null,
      input.waterMl ?? null,
    ],
  );

  const plan = rows[0];

  /* Las comidas se guardan en su propia tabla, numeradas para conservar el
     orden en que las escribió el entrenador. */
  for (let i = 0; i < input.meals.length; i += 1) {
    await pool.query(
      `INSERT INTO nutrition_meals (plan_id, name, meal_order, details)
       VALUES ($1, $2, $3, $4)`,
      [plan.id, input.meals[i].name, i + 1, input.meals[i].details],
    );
  }

  return plan;
}

/* Devuelve los planes activos con sus comidas ya agrupadas en un arreglo
   JSON, para no tener que hacer una consulta por plan. El FILTER evita que
   un plan sin comidas aparezca con un elemento nulo dentro del arreglo. */
export async function nutritionPlans(user) {
  const column = user.role === 'trainer' ? 'trainer_id' : 'athlete_id';

  const { rows } = await pool.query(
    `SELECT
       p.*,
       u.first_name AS athlete_first_name,
       u.last_name  AS athlete_last_name,
       COALESCE(
         json_agg(
           json_build_object(
             'id', m.id,
             'name', m.name,
             'details', m.details,
             'order', m.meal_order
           ) ORDER BY m.meal_order
         ) FILTER (WHERE m.id IS NOT NULL),
         '[]'
       ) AS meals
     FROM nutrition_plans p
     JOIN users u ON u.id = p.athlete_id
     LEFT JOIN nutrition_meals m ON m.plan_id = p.id
     WHERE p.${column} = $1 AND p.status = 'active'
     GROUP BY p.id, u.first_name, u.last_name
     ORDER BY p.updated_at DESC`,
    [user.id],
  );

  return rows;
}
