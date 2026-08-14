/* Convierte una rutina existente en el borrador de una rutina nueva.

   Este módulo no conoce el DOM ni llama a la API. Mantener la transformación
   aislada permite comprobar que una copia conserva todo el plan sin crear
   datos temporales en PostgreSQL. */

const DAYS_PER_WEEK = 7;
const COPY_SUFFIX = ' (copia)';
const MAX_NAME_LENGTH = 140;

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function emptyDay(index) {
  return {
    name: `Día ${index + 1}`,
    dayType: index === 0 ? 'training' : 'rest',
    mirrorsDayOrder: null,
    notes: '',
    exercises: [],
  };
}

function copyExercise(exercise) {
  return {
    exerciseId: exercise.exerciseId,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    targetWeight: exercise.targetWeight ?? null,
    restSeconds: exercise.restSeconds ?? null,
    rir: exercise.rir ?? null,
    tempo: exercise.tempo || '',
    notes: exercise.notes || '',
  };
}

function copyDay(day) {
  return {
    name: day.name,
    dayType: day.day_type || 'training',
    mirrorsDayOrder: day.mirrors_day_order ?? null,
    notes: day.notes || '',
    exercises: (day.exercises || []).map(copyExercise),
  };
}

export function copiedRoutineName(name) {
  const base = String(name || 'Rutina').replace(/ \(copia\)$/, '');
  return `${base.slice(0, MAX_NAME_LENGTH - COPY_SUFFIX.length)}${COPY_SUFFIX}`;
}

export function routineCopyDraft(routine, today = new Date()) {
  const week = Array.from({ length: DAYS_PER_WEEK }, (_, index) => emptyDay(index));

  for (const day of routine.days || []) {
    const index = Number(day.day_order) - 1;
    if (index >= 0 && index < DAYS_PER_WEEK) week[index] = copyDay(day);
  }

  return {
    name: copiedRoutineName(routine.name),
    athleteId: routine.athlete_id || '',
    description: routine.description || '',
    startDate: localDate(today),
    weeks: routine.weeks || 1,
    week,
  };
}
