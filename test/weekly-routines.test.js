/* Rutinas semanales y seguimiento del cumplimiento.

   Usa PostgreSQL local con un entrenador y un atleta temporales, aislados de
   las cuentas demo. Todo lo que crea se elimina al terminar. */

import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as routines from '../src/services/routines.service.js';

const marca = Date.now();

async function crearUsuario(role, sufijo = '') {
  return users.createUser({
    email: `rutina-${role}${sufijo}-${marca}@demo.local`,
    passwordHash: await bcrypt.hash('Prueba123', 4),
    firstName: 'Prueba',
    lastName: 'Temporal',
    role,
  });
}

test('rutina semanal con días libres, días espejo y cumplimiento por ejercicio', async (t) => {
  const trainer = await crearUsuario('trainer');
  const athlete = await crearUsuario('athlete');
  const comoEntrenador = { id: trainer.id, role: 'trainer' };
  const comoAtleta = { id: athlete.id, role: 'athlete' };

  await pool.query(
    "INSERT INTO trainer_athlete_links (trainer_id, athlete_id, status) VALUES ($1,$2,'active')",
    [trainer.id, athlete.id],
  );

  /* Se limpia en orden inverso a las dependencias: las sesiones apuntan a los
     días de la rutina, así que deben irse antes que la rutina. */
  t.after(async () => {
    await pool.query('DELETE FROM workout_sessions WHERE athlete_id=$1', [athlete.id]);
    await pool.query('DELETE FROM routines WHERE trainer_id=$1', [trainer.id]);
    await pool.query('DELETE FROM trainer_athlete_links WHERE trainer_id=$1', [trainer.id]);
    const borrados = await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [
      [trainer.id, athlete.id],
    ]);
    assert.equal(borrados.rowCount, 2, 'deben eliminarse exactamente los dos usuarios temporales');
    await pool.end();
  });

  const catalogo = await routines.listExercises(trainer.id);
  assert.ok(catalogo.length >= 2, 'el catálogo sembrado debe tener ejercicios');
  const [primero, segundo] = catalogo;

  const ejercicios = [
    { exerciseId: primero.id, sets: 3, reps: '10', restSeconds: 60 },
    { exerciseId: segundo.id, sets: 2, reps: '12', restSeconds: 45 },
  ];

  const plan = {
    athleteId: athlete.id,
    name: 'Semana de prueba',
    status: 'active',
    startDate: '2026-08-03',
    weeks: 6,
    days: [
      { name: 'Día 1', dayType: 'training', exercises: ejercicios },
      { name: 'Día 2', dayType: 'rest', exercises: [] },
      { name: 'Día 3', dayType: 'optional_rest', exercises: [] },
      /* Sin lista propia: el servidor debe copiar la del Día 1. */
      { name: 'Día 4', dayType: 'training', mirrorsDayOrder: 1, exercises: [] },
    ],
  };

  const creada = await routines.createRoutine(trainer.id, plan);

  await t.test('guarda la duración y deriva la fecha final', async () => {
    assert.equal(creada.weeks, 6);
    const { rows } = await pool.query(
      "SELECT to_char(end_date,'YYYY-MM-DD') AS fin FROM routines WHERE id=$1",
      [creada.id],
    );
    /* Seis semanas desde el 3 de agosto terminan el 13 de septiembre. */
    assert.equal(rows[0].fin, '2026-09-13');
    assert.equal(creada.origin_routine_id, creada.id, 'una rutina nueva es su propio origen');
  });

  const rutina = await routines.getRoutine(creada.id, comoEntrenador);
  const [dia1, dia2, dia3, dia4] = rutina.days;

  await t.test('crea los siete tipos de día correctamente', () => {
    assert.equal(rutina.days.length, 4);
    assert.equal(dia1.day_type, 'training');
    assert.equal(dia2.day_type, 'rest');
    assert.equal(dia3.day_type, 'optional_rest');
    assert.deepEqual(
      [dia2.exercises.length, dia3.exercises.length],
      [0, 0],
      'un día libre no lleva ejercicios',
    );
  });

  await t.test('el día espejo copia los ejercicios y conserva la referencia', () => {
    assert.equal(dia4.mirrors_day_order, 1);
    assert.equal(dia4.exercises.length, 2);
    assert.deepEqual(
      dia4.exercises.map((item) => item.exerciseId),
      dia1.exercises.map((item) => item.exerciseId),
    );
    /* Las filas son propias, no compartidas con el Día 1. */
    assert.notEqual(dia4.exercises[0].id, dia1.exercises[0].id);
  });

  await t.test('rechaza abrir un día que no es de tu rutina', async () => {
    await assert.rejects(
      () => routines.startWorkout(trainer.id, dia1.id, 1),
      /no pertenece a una rutina activa tuya/i,
    );
  });

  await t.test('rechaza una semana fuera del plan', async () => {
    await assert.rejects(() => routines.startWorkout(athlete.id, dia1.id, 7), /fuera del plan/i);
  });

  let sesion;

  await t.test('abrir el mismo día dos veces reutiliza la sesión', async () => {
    const primera = await routines.startWorkout(athlete.id, dia1.id, 1);
    const segunda = await routines.startWorkout(athlete.id, dia1.id, 1);
    assert.equal(primera.session.id, segunda.session.id);
    assert.equal(primera.session.week_number, 1);
    assert.equal(primera.completedAt ?? primera.session.completed_at, null);
    assert.equal(primera.totalExercises, 2);
    sesion = primera.session;
  });

  await t.test('rechaza registrar un ejercicio de otro día', async () => {
    await assert.rejects(
      () => routines.logExercise(athlete.id, sesion.id, dia4.exercises[0].id, []),
      /no pertenece al día de esta sesión/i,
    );
  });

  await t.test('marcar los ejercicios completa el día automáticamente', async () => {
    const series = [{ setNumber: 1, reps: 10, weight: 20 }];

    const parcial = await routines.logExercise(athlete.id, sesion.id, dia1.exercises[0].id, series);
    assert.equal(parcial.completedExercises, 1);
    assert.equal(parcial.session.completed_at, null, 'con un ejercicio el día sigue abierto');

    const total = await routines.logExercise(athlete.id, sesion.id, dia1.exercises[1].id, series);
    assert.equal(total.completedExercises, 2);
    assert.ok(total.session.completed_at, 'al marcar el último el día queda cumplido');
  });

  await t.test('volver a guardar un ejercicio reemplaza sus series', async () => {
    const repetido = await routines.logExercise(athlete.id, sesion.id, dia1.exercises[0].id, [
      { setNumber: 1, reps: 12, weight: 25 },
      { setNumber: 2, reps: 11, weight: 25 },
    ]);
    assert.equal(repetido.completedExercises, 2, 'no se duplica el registro del ejercicio');
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS n FROM performed_sets WHERE workout_session_id=$1 AND routine_exercise_id=$2',
      [sesion.id, dia1.exercises[0].id],
    );
    assert.equal(rows[0].n, 2);
  });

  await t.test('desmarcar un ejercicio reabre el día', async () => {
    const reabierto = await routines.unlogExercise(athlete.id, sesion.id, dia1.exercises[1].id);
    assert.equal(reabierto.completedExercises, 1);
    assert.equal(reabierto.session.completed_at, null);

    const cerrado = await routines.logExercise(athlete.id, sesion.id, dia1.exercises[1].id, [
      { setNumber: 1, reps: 10, weight: 20 },
    ]);
    assert.ok(cerrado.session.completed_at);
  });

  await t.test('un día libre queda cumplido al marcarlo, sin ejercicios', async () => {
    const libre = await routines.startWorkout(athlete.id, dia2.id, 1);
    assert.equal(libre.totalExercises, 0);
    assert.ok(libre.session.completed_at, 'un día sin ejercicios se cumple al instante');
  });

  /* Volver a un día ya cumplido no puede empezar de cero: el atleta perdería
     de vista lo que registró y aparecería una sesión duplicada en la semana. */
  await t.test('reabrir un día cumplido recupera la misma sesión', async () => {
    const vuelta = await routines.startWorkout(athlete.id, dia1.id, 1);
    assert.equal(vuelta.session.id, sesion.id);
    assert.ok(vuelta.session.completed_at, 'sigue estando cumplido');
    assert.equal(vuelta.completedExercises, 2);

    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS n FROM workout_sessions WHERE athlete_id=$1 AND routine_day_id=$2 AND week_number=1',
      [athlete.id, dia1.id],
    );
    assert.equal(rows[0].n, 1, 'no se creó una sesión repetida para la misma franja');
  });

  await t.test('al reabrir se recuperan los ejercicios marcados y sus series', async () => {
    const vuelta = await routines.startWorkout(athlete.id, dia1.id, 1);
    assert.equal(vuelta.logged.length, 2);

    const primero = vuelta.logged.find((item) => item.routineExerciseId === dia1.exercises[0].id);
    assert.ok(primero, 'el primer ejercicio aparece como terminado');
    assert.equal(primero.sets.length, 2, 'devuelve las dos series que se guardaron');
    assert.equal(primero.sets[0].setNumber, 1);
    assert.equal(primero.sets[0].reps, 12);
  });

  await t.test('la cuadrícula de cumplimiento refleja semana y día', async () => {
    const { progress } = await routines.routineProgress(creada.id, comoAtleta);
    const franja = progress.find((item) => item.weekNumber === 1 && item.dayOrder === 1);
    assert.equal(franja.status, 'completed');
    assert.equal(franja.completedExercises, 2);
    assert.equal(franja.totalExercises, 2);
    assert.ok(progress.some((item) => item.dayOrder === 2 && item.status === 'completed'));
  });

  /* El resumen mira siempre la semana en curso, que depende de la fecha de
     inicio del plan y por tanto del día en que se ejecute la prueba. Para no
     atarla al calendario se calcula esa semana y se completa un día en ella. */
  await t.test('el resumen del entrenador cuenta solo los días de entrenamiento', async () => {
    const semana = routines.currentWeek({ start_date: plan.startDate, weeks: plan.weeks });

    const abierta = await routines.startWorkout(athlete.id, dia1.id, semana);
    for (const ejercicio of dia1.exercises)
      await routines.logExercise(athlete.id, abierta.session.id, ejercicio.id, []);

    const { athletes } = await routines.trainerCompliance(trainer.id);
    assert.equal(athletes.length, 1, 'aparece el atleta vinculado');

    const resumen = athletes[0];
    assert.equal(resumen.athleteId, athlete.id);
    assert.equal(resumen.routine.name, 'Semana de prueba');
    assert.equal(resumen.routine.weeks, 6);
    assert.equal(resumen.routine.currentWeek, semana);

    /* La semana tiene cuatro franjas: dos de entrenamiento (Día 1 y Día 4),
       una libre y una libre opcional. Los días libres no cuentan. */
    assert.equal(resumen.routine.trainingDays, 2);

    /* Solo se completó el Día 1. El Día 2, que también quedó cumplido, es
       libre y no debe sumar. */
    assert.equal(resumen.routine.completedDays, 1);
  });

  await t.test('el resumen no incluye atletas de otro entrenador', async () => {
    const ajeno = await crearUsuario('trainer', '-ajeno');
    try {
      const { athletes } = await routines.trainerCompliance(ajeno.id);
      assert.equal(athletes.length, 0);
    } finally {
      await pool.query('DELETE FROM users WHERE id=$1', [ajeno.id]);
    }
  });

  await t.test('modificar la rutina conserva el progreso ya registrado', async () => {
    const modificada = await routines.updateRoutine(creada.id, trainer.id, {
      ...plan,
      name: 'Semana de prueba corregida',
      days: [{ name: 'Día 1', dayType: 'training', exercises: [ejercicios[0]] }],
    });
    assert.notEqual(modificada.id, creada.id, 'modificar crea una versión nueva');
    assert.equal(modificada.origin_routine_id, creada.id, 'la versión nueva hereda el linaje');

    const { progress } = await routines.routineProgress(modificada.id, comoEntrenador);
    assert.ok(
      progress.some((item) => item.weekNumber === 1 && item.dayOrder === 1),
      'el cumplimiento anterior sigue visible tras editar el plan',
    );
  });
});

test('la semana actual se calcula desde la fecha de inicio', () => {
  const haceDias = (dias) => new Date(Date.now() - dias * 86_400_000);

  assert.equal(routines.currentWeek({ start_date: null, weeks: 6 }), 1);
  assert.equal(routines.currentWeek({ start_date: haceDias(0), weeks: 6 }), 1);
  assert.equal(routines.currentWeek({ start_date: haceDias(6), weeks: 6 }), 1);
  assert.equal(routines.currentWeek({ start_date: haceDias(7), weeks: 6 }), 2);
  assert.equal(routines.currentWeek({ start_date: haceDias(14), weeks: 6 }), 3);
  /* Pasado el final del plan se queda en la última semana, no sigue subiendo. */
  assert.equal(routines.currentWeek({ start_date: haceDias(400), weeks: 6 }), 6);
});
