/* Las mediciones son compartidas: las puede anotar el atleta o su entrenador
   y ambos ven exactamente las mismas. Como solo existe una ficha por día,
   escribir dos veces la misma fecha actualiza esa fila, y ahí estaba el
   riesgo: que la segunda escritura borrase lo que había puesto la primera. */

import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import * as users from '../src/repositories/auth.repository.js';
import * as tracking from '../src/services/tracking.service.js';

const marca = Date.now();

async function crearUsuario(role) {
  return users.createUser({
    email: `medicion-${role}-${marca}@demo.local`,
    passwordHash: await bcrypt.hash('Prueba123', 4),
    firstName: 'Medición',
    lastName: 'Temporal',
    role,
  });
}

test('mediciones compartidas entre el atleta y su entrenador', async (t) => {
  const trainer = await crearUsuario('trainer');
  const athlete = await crearUsuario('athlete');
  const comoEntrenador = { id: trainer.id, role: 'trainer' };
  const comoAtleta = { id: athlete.id, role: 'athlete' };
  const hoy = new Date().toISOString().slice(0, 10);

  await pool.query(
    "INSERT INTO trainer_athlete_links (trainer_id, athlete_id, status) VALUES ($1,$2,'active')",
    [trainer.id, athlete.id],
  );

  t.after(async () => {
    await pool.query('DELETE FROM measurements WHERE athlete_id=$1', [athlete.id]);
    await pool.query('DELETE FROM trainer_athlete_links WHERE trainer_id=$1', [trainer.id]);
    const borrados = await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [
      [trainer.id, athlete.id],
    ]);
    assert.equal(borrados.rowCount, 2, 'deben eliminarse los dos usuarios temporales');
    await pool.end();
  });

  await t.test('lo que anota uno lo ve el otro', async () => {
    await tracking.addMeasurement(comoAtleta, { measuredAt: hoy, weightKg: 80 });

    const vistaEntrenador = await tracking.listMeasurements(comoEntrenador, athlete.id);
    assert.equal(vistaEntrenador.length, 1);
    assert.equal(Number(vistaEntrenador[0].weight_kg), 80);
  });

  /* Este es el caso que motivó la corrección: el entrenador anota la cintura
     el mismo día en que el atleta anotó el peso. Antes, los campos que él
     dejaba vacíos llegaban como nulos y borraban lo ya guardado. */
  await t.test('anotar otra medida el mismo día no borra la anterior', async () => {
    await tracking.addMeasurement(comoEntrenador, {
      athleteId: athlete.id,
      measuredAt: hoy,
      waistCm: 88,
    });

    const [ficha] = await tracking.listMeasurements(comoAtleta, null);
    assert.equal(Number(ficha.weight_kg), 80, 'el peso del atleta sigue ahí');
    assert.equal(Number(ficha.waist_cm), 88, 'y se añadió la cintura');
  });

  await t.test('sigue habiendo una sola ficha por día', async () => {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS n FROM measurements WHERE athlete_id=$1 AND measured_at=$2',
      [athlete.id, hoy],
    );
    assert.equal(rows[0].n, 1);
  });

  await t.test('escribir un valor nuevo sí reemplaza al anterior', async () => {
    await tracking.addMeasurement(comoAtleta, { measuredAt: hoy, weightKg: 79.5 });
    const [ficha] = await tracking.listMeasurements(comoAtleta, null);
    assert.equal(Number(ficha.weight_kg), 79.5, 'corregir un dato debe funcionar');
    assert.equal(Number(ficha.waist_cm), 88, 'y no toca lo que no se envió');
  });

  await t.test('un entrenador ajeno no puede leer ni escribir', async () => {
    const ajeno = { id: trainer.id, role: 'trainer' };
    /* Se usa un identificador de atleta que no está vinculado con nadie. */
    await assert.rejects(
      () => tracking.listMeasurements(ajeno, trainer.id),
      /no está vinculado contigo/i,
    );
    await assert.rejects(
      () => tracking.addMeasurement(ajeno, { athleteId: trainer.id, measuredAt: hoy, weightKg: 1 }),
      /no está vinculado contigo/i,
    );
  });

  await t.test('un atleta no puede escribir en la ficha de otro', async () => {
    await assert.rejects(
      () => tracking.addMeasurement(comoAtleta, { athleteId: trainer.id, measuredAt: hoy }),
      /Sin permiso/i,
    );
  });
});
