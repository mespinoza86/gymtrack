import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { copiedRoutineName, routineCopyDraft } from '../public/js/comun/rutina-copia.js';

const source = {
  id: 'rutina-original',
  athlete_id: 'atleta-1',
  name: 'Fuerza de agosto',
  description: 'Plan original',
  start_date: '2026-07-01T00:00:00.000Z',
  weeks: 6,
  origin_routine_id: 'linaje-original',
  days: [
    {
      day_order: 1,
      name: 'Pierna',
      day_type: 'training',
      mirrors_day_order: null,
      notes: 'Controlar la técnica',
      exercises: [
        {
          id: 'fila-original',
          exerciseId: 'ejercicio-1',
          name: 'Sentadilla',
          sets: 4,
          reps: '6-8',
          targetWeight: '82.50',
          restSeconds: 120,
          rir: 2,
          tempo: '3-1-1',
          notes: 'Sin perder profundidad',
        },
      ],
    },
    {
      day_order: 2,
      name: 'Descanso',
      day_type: 'rest',
      mirrors_day_order: null,
      notes: '',
      exercises: [],
    },
    {
      day_order: 4,
      name: 'Pierna B',
      day_type: 'training',
      mirrors_day_order: 1,
      notes: 'Repetición',
      exercises: [],
    },
  ],
};

test('prepara una copia independiente y fiel para el constructor', () => {
  const draft = routineCopyDraft(source, new Date(2026, 7, 14));

  assert.equal(draft.name, 'Fuerza de agosto (copia)');
  assert.equal(draft.athleteId, 'atleta-1');
  assert.equal(draft.description, 'Plan original');
  assert.equal(draft.startDate, '2026-08-14', 'usa la fecha local nueva, no la fecha original');
  assert.equal(draft.weeks, 6);
  assert.equal(draft.week.length, 7, 'el constructor siempre recibe la semana completa');

  const exercise = draft.week[0].exercises[0];
  assert.deepEqual(exercise, {
    exerciseId: 'ejercicio-1',
    name: 'Sentadilla',
    sets: 4,
    reps: '6-8',
    targetWeight: '82.50',
    restSeconds: 120,
    rir: 2,
    tempo: '3-1-1',
    notes: 'Sin perder profundidad',
  });
  assert.equal(draft.week[1].dayType, 'rest');
  assert.equal(draft.week[3].mirrorsDayOrder, 1);
  assert.equal(draft.week[6].dayType, 'rest', 'las franjas ausentes se completan como libres');

  assert.equal(draft.id, undefined, 'no lleva el identificador de la original');
  assert.equal(draft.originRoutineId, undefined, 'no hereda el linaje');

  draft.week[0].name = 'Nombre cambiado';
  draft.week[0].exercises[0].sets = 99;
  assert.equal(source.days[0].name, 'Pierna');
  assert.equal(
    source.days[0].exercises[0].sets,
    4,
    'el borrador no comparte objetos con el origen',
  );
});

test('el nombre de la copia respeta el límite y no acumula sufijos', () => {
  assert.equal(copiedRoutineName('Base (copia)'), 'Base (copia)');
  assert.equal(copiedRoutineName('x'.repeat(200)).length, 140);
});

test('la lista y el constructor conectan el modo de duplicación', async () => {
  const [list, form, html] = await Promise.all([
    readFile(new URL('../public/js/entrenador/rutinas.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/js/entrenador/rutina-formulario.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/entrenador/rutina-formulario.html', import.meta.url), 'utf8'),
  ]);

  assert.equal(
    (list.match(/rutina-formulario\.html\?duplicar=/g) || []).length,
    2,
    'hay acceso desde la tarjeta y desde el detalle',
  );
  assert.match(form, /parameters\.get\('duplicar'\)/);
  assert.match(form, /loadDraft\(routineCopyDraft\(routine\)\)/);
  assert.match(form, /routineId \? 'PUT' : 'POST'/, 'duplicar usa POST porque no tiene routineId');
  assert.match(html, /id="copy-notice"[^>]*hidden/);
});
