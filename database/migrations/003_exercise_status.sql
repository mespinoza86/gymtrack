ALTER TABLE exercises ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX idx_exercises_created_by_active
  ON exercises(created_by, is_active)
  WHERE created_by IS NOT NULL;
