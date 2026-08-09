CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('trainer', 'athlete');
CREATE TYPE link_status AS ENUM ('active', 'ended');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');
CREATE TYPE plan_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),
  password_hash TEXT NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  role user_role NOT NULL,
  birth_date DATE,
  phone VARCHAR(30),
  avatar_path TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trainer_athlete_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  athlete_id UUID NOT NULL REFERENCES users(id),
  status link_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  UNIQUE (trainer_id, athlete_id),
  CHECK (trainer_id <> athlete_id)
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  code VARCHAR(20) NOT NULL UNIQUE,
  status invitation_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_by UUID REFERENCES users(id),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  name VARCHAR(140) NOT NULL,
  muscle_group VARCHAR(80),
  instructions TEXT,
  media_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  athlete_id UUID REFERENCES users(id),
  name VARCHAR(140) NOT NULL,
  description TEXT,
  status plan_status NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE routine_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  day_order SMALLINT NOT NULL CHECK (day_order > 0),
  notes TEXT,
  UNIQUE (routine_id, day_order)
);

CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_day_id UUID NOT NULL REFERENCES routine_days(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  exercise_order SMALLINT NOT NULL CHECK (exercise_order > 0),
  sets SMALLINT NOT NULL CHECK (sets > 0),
  reps VARCHAR(30) NOT NULL,
  target_weight NUMERIC(7,2),
  rest_seconds SMALLINT CHECK (rest_seconds >= 0),
  rir SMALLINT CHECK (rir BETWEEN 0 AND 10),
  tempo VARCHAR(20),
  notes TEXT,
  UNIQUE (routine_day_id, exercise_order)
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id),
  routine_day_id UUID REFERENCES routine_days(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  energy SMALLINT CHECK (energy BETWEEN 1 AND 10),
  notes TEXT
);

CREATE TABLE performed_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  routine_exercise_id UUID NOT NULL REFERENCES routine_exercises(id),
  set_number SMALLINT NOT NULL CHECK (set_number > 0),
  reps SMALLINT NOT NULL CHECK (reps >= 0),
  weight NUMERIC(7,2) NOT NULL DEFAULT 0 CHECK (weight >= 0),
  rpe NUMERIC(3,1) CHECK (rpe BETWEEN 1 AND 10),
  pain BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  UNIQUE (workout_session_id, routine_exercise_id, set_number)
);

CREATE TABLE nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  athlete_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(140) NOT NULL,
  description TEXT,
  calories INTEGER CHECK (calories > 0),
  protein_g NUMERIC(7,2) CHECK (protein_g >= 0),
  carbs_g NUMERIC(7,2) CHECK (carbs_g >= 0),
  fats_g NUMERIC(7,2) CHECK (fats_g >= 0),
  fiber_g NUMERIC(7,2) CHECK (fiber_g >= 0),
  water_ml INTEGER CHECK (water_ml >= 0),
  status plan_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nutrition_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES nutrition_plans(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  meal_order SMALLINT NOT NULL CHECK (meal_order > 0),
  details TEXT NOT NULL,
  UNIQUE (plan_id, meal_order)
);

CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id),
  recorded_by UUID NOT NULL REFERENCES users(id),
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(6,2) CHECK (weight_kg > 0),
  body_fat_percent NUMERIC(5,2) CHECK (body_fat_percent BETWEEN 0 AND 100),
  waist_cm NUMERIC(6,2),
  hip_cm NUMERIC(6,2),
  chest_cm NUMERIC(6,2),
  arm_cm NUMERIC(6,2),
  thigh_cm NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (athlete_id, measured_at)
);

CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id),
  measurement_id UUID REFERENCES measurements(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  angle VARCHAR(20) CHECK (angle IN ('front', 'side', 'back', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id),
  trainer_id UUID NOT NULL REFERENCES users(id),
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  energy SMALLINT CHECK (energy BETWEEN 1 AND 10),
  sleep_hours NUMERIC(4,1) CHECK (sleep_hours BETWEEN 0 AND 24),
  stress SMALLINT CHECK (stress BETWEEN 1 AND 10),
  hunger SMALLINT CHECK (hunger BETWEEN 1 AND 10),
  adherence SMALLINT CHECK (adherence BETWEEN 0 AND 100),
  pain_details TEXT,
  wins TEXT,
  difficulties TEXT,
  trainer_feedback TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (athlete_id, trainer_id, checkin_date)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  athlete_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (trainer_id, athlete_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL CHECK (LENGTH(body) BETWEEN 1 AND 4000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES users(id),
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_links_trainer ON trainer_athlete_links(trainer_id) WHERE status = 'active';
CREATE INDEX idx_links_athlete ON trainer_athlete_links(athlete_id) WHERE status = 'active';
CREATE INDEX idx_routines_athlete ON routines(athlete_id, status);
CREATE INDEX idx_workouts_athlete_date ON workout_sessions(athlete_id, started_at DESC);
CREATE INDEX idx_measurements_athlete_date ON measurements(athlete_id, measured_at DESC);
CREATE INDEX idx_checkins_trainer_date ON checkins(trainer_id, checkin_date DESC);
CREATE INDEX idx_messages_conversation_date ON messages(conversation_id, created_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE read_at IS NULL;

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_touch_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER routines_touch_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER nutrition_touch_updated_at BEFORE UPDATE ON nutrition_plans FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE user_sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX idx_user_sessions_expire ON user_sessions(expire);
