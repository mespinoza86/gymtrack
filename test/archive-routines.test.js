/* Archivar y restaurar rutinas.

   Archivar es la alternativa a borrar: las sesiones de entrenamiento apuntan a
   los días de la rutina mediante claves foráneas, así que eliminarla
   destruiría el historial del atleta. */

import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as routines from '../src/services/routines.service.js';

const marca = Date.now();

const crearUsuario = async (role, sufijo = '') =>
  users.createUser({
    email: `archivo-${role}${sufijo}-${marca}@demo.local`,
    passwordHash: await bcrypt.hash('Prueba123', 4),
    firstName: 'Archivo',
    lastName: 'Temporal',
    role,
  });

test('archivar retira la rutina de las listas sin destruirla', async (t) => {
  const entrenador = await crearUsuario('trainer');
  const atleta = await crearUsuario('athlete');
  const ajeno = await crearUsuario('trainer', 'b');
  const ids = [entrenador.id, atleta.id, ajeno.id];

  const comoEntrenador = { id: entrenador.id, role: 'trainer' };
  const comoAtleta = { id: atleta.id, role: 'athlete' };

  await pool.query(
    "INSERT INTO trainer_athlete_links (trainer_id, athlete_id, status) VALUES ($1,$2,'active')",
    [entrenador.id, atleta.id],
  );

  t.after(async () => {
    await pool.query('DELETE FROM routines WHERE trainer_id = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM trainer_athlete_links WHERE trainer_id = ANY($1::uuid[])', [ids]);
    const borrados = await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [ids]);
    assert.equal(borrados.rowCount, 3, 'deben eliminarse los tres usuarios temporales');
    await pool.end();
  });

  const catalogo = await routines.listExercises(entrenador.id);
  const rutina = await routines.createRoutine(entrenador.id, {
    athleteId: atleta.id,
    name: 'Plan que se archivará',
    status: 'active',
    weeks: 1,
    startDate: new Date().toISOString().slice(0, 10),
    days: [
      {
        name: 'Día 1',
        dayOrder: 1,
        dayType: 'training',
        exercises: [{ exerciseId: catalogo[0].id, sets: 3, reps: '10', restSeconds: 60 }],
      },
    ],
  });

  await t.test('antes de archivar la ven los dos', async () => {
    const delEntrenador = await routines.listRoutines(comoEntrenador);
    const delAtleta = await routines.listRoutines(comoAtleta);
    assert.ok(delEntrenador.some((r) => r.id === rutina.id));
    assert.ok(delAtleta.some((r) => r.id === rutina.id));
  });

  await t.test('un entrenador ajeno no puede archivarla', async () => {
    await assert.rejects(
      () => routines.setRoutineStatus(rutina.id, ajeno.id, 'archived'),
      /no encontrada/,
    );
  });

  await t.test('al archivarla desaparece de ambas listas', async () => {
    const resultado = await routines.setRoutineStatus(rutina.id, entrenador.id, 'archived');
    assert.equal(resultado.status, 'archived');

    const delEntrenador = await routines.listRoutines(comoEntrenador);
    assert.ok(!delEntrenador.some((r) => r.id === rutina.id), 'no debe salir en la lista normal');

    /* Lo importante para el atleta: deja de verla mezclada con su plan real. */
    const delAtleta = await routines.listRoutines(comoAtleta);
    assert.ok(!delAtleta.some((r) => r.id === rutina.id), 'el atleta no debe seguir viéndola');
  });

  await t.test('sigue existiendo y se consulta pidiendo las archivadas', async () => {
    const archivadas = await routines.listRoutines(comoEntrenador, true);
    assert.ok(
      archivadas.some((r) => r.id === rutina.id),
      'debe aparecer entre las archivadas',
    );

    /* El atleta nunca ve archivadas, ni siquiera pidiéndolas. */
    const delAtleta = await routines.listRoutines(comoAtleta, true);
    assert.ok(!delAtleta.some((r) => r.id === rutina.id));
  });

  await t.test('restaurarla la devuelve a las listas', async () => {
    await routines.setRoutineStatus(rutina.id, entrenador.id, 'active');

    const delEntrenador = await routines.listRoutines(comoEntrenador);
    const delAtleta = await routines.listRoutines(comoAtleta);
    assert.ok(delEntrenador.some((r) => r.id === rutina.id));
    assert.ok(delAtleta.some((r) => r.id === rutina.id));
  });

  await t.test('la rutina conserva sus días y ejercicios', async () => {
    /* Si se hubiera borrado en vez de archivar, esto no existiría. Se compara
       con lo que se envió al crearla: las franjas vacías hasta siete las
       rellena el constructor del navegador, no la API. */
    const completa = await routines.getRoutine(rutina.id, comoEntrenador);
    assert.equal(completa.days.length, 1, 'conserva el día que se creó');
    assert.equal(completa.days[0].exercises.length, 1, 'y su ejercicio');
  });
});
