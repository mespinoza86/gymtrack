/* Rutinas semanales, días libres, duración en semanas y seguimiento
   del cumplimiento ejercicio por ejercicio.

   Compatible hacia atrás: las rutinas que ya existen quedan como un plan
   de una semana, con sus días actuales convertidos en días de entrenamiento. */

/* Un día de la semana puede ser de entrenamiento, libre, o libre opcional
   (el atleta decide si descansa o entrena igual). */
CREATE TYPE routine_day_type AS ENUM ('training', 'rest', 'optional_rest');

/* `weeks` es la duración del plan. La misma semana plantilla se repite
   ese número de veces; el cumplimiento se registra por separado en cada una.

   `origin_routine_id` conserva el linaje de la rutina. Modificar una rutina
   archiva la versión anterior y crea una nueva (para no romper los
   entrenamientos ya registrados), así que sin este enlace el progreso del
   atleta desaparecería de la vista cada vez que el entrenador edita el plan. */
ALTER TABLE routines
  ADD COLUMN weeks SMALLINT NOT NULL DEFAULT 1 CHECK (weeks BETWEEN 1 AND 52),
  ADD COLUMN origin_routine_id UUID REFERENCES routines(id);

UPDATE routines SET origin_routine_id = id WHERE origin_routine_id IS NULL;

/* `mirrors_day_order` solo guarda la etiqueta del día espejo ("igual al Día 1").
   Los ejercicios se copian de verdad en filas propias, para que el historial
   de cada día sea independiente. */
ALTER TABLE routine_days
  ADD COLUMN day_type routine_day_type NOT NULL DEFAULT 'training',
  ADD COLUMN mirrors_day_order SMALLINT;

/* `day_order` pasa a significar la franja de la semana, del 1 al 7. */
ALTER TABLE routine_days
  ADD CONSTRAINT routine_days_week_slot
    CHECK (day_order BETWEEN 1 AND 7),
  ADD CONSTRAINT routine_days_mirror_range
    CHECK (mirrors_day_order IS NULL OR mirrors_day_order BETWEEN 1 AND 7),
  ADD CONSTRAINT routine_days_mirror_not_self
    CHECK (mirrors_day_order IS NULL OR mirrors_day_order <> day_order);

/* Distingue "Semana 2 · Día 3" de "Semana 1 · Día 3".
   No se añade una restricción de unicidad por franja: repetir un mismo día
   dentro de la semana es legítimo y los datos existentes ya contienen casos. */
ALTER TABLE workout_sessions
  ADD COLUMN week_number SMALLINT NOT NULL DEFAULT 1 CHECK (week_number BETWEEN 1 AND 52);

/* Una fila por ejercicio terminado. Es lo que permite marcar el avance de a
   uno y decidir cuándo el día entero queda completado. */
CREATE TABLE workout_exercise_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  routine_exercise_id UUID NOT NULL REFERENCES routine_exercises(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workout_session_id, routine_exercise_id)
);

/* Los entrenamientos anteriores no tienen registro por ejercicio. Se deduce
   de las series que sí guardaron, para que el historial antiguo se lea con
   las mismas reglas que el nuevo. */
INSERT INTO workout_exercise_log (workout_session_id, routine_exercise_id, completed_at)
SELECT DISTINCT
    ps.workout_session_id,
    ps.routine_exercise_id,
    COALESCE(ws.completed_at, ws.started_at)
  FROM performed_sets ps
  JOIN workout_sessions ws ON ws.id = ps.workout_session_id
ON CONFLICT DO NOTHING;

CREATE INDEX idx_routines_origin ON routines(origin_routine_id);
CREATE INDEX idx_workout_sessions_day_week ON workout_sessions(routine_day_id, week_number);
CREATE INDEX idx_workout_exercise_log_session ON workout_exercise_log(workout_session_id);
