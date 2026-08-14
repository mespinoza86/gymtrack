/* Rutinas del entrenador. La lista muestra un resumen de cada plan y, al
   pulsar "Ver rutina", se despliega debajo el detalle completo de sus días
   y ejercicios sin abandonar la pantalla. */

import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const list = document.querySelector('#routines');
const detail = document.querySelector('#detail');
const message = document.querySelector('#message');

/* ---------- Resumen de la lista ---------- */

function renderRoutineCard(routine) {
  /* Una rutina puede existir como plantilla, todavía sin atleta asignado. */
  const destinatario = routine.athlete_first_name
    ? `${escapeHtml(routine.athlete_first_name)} ${escapeHtml(routine.athlete_last_name)}`
    : 'Plantilla sin asignar';

  return `
    <article class="card">
      <span class="badge">${escapeHtml(routine.status)}</span>
      <h2>${escapeHtml(routine.name)}</h2>
      <p>${escapeHtml(routine.description || 'Sin descripción')}</p>
      <p><small>${destinatario}</small></p>
      <div class="actions">
        <button class="btn secondary small" data-view="${routine.id}">Ver rutina</button>
        <a class="btn small" href="rutina-formulario.html?id=${routine.id}">Modificar</a>
      </div>
    </article>`;
}

/* ---------- Detalle desplegable ---------- */

function renderExercise(exercise) {
  const descanso = exercise.restSeconds ?? '—';

  return `
          <div class="list-item">
            <strong>${escapeHtml(exercise.name)}</strong>
            <p>
              ${exercise.sets} series · ${escapeHtml(exercise.reps)} repeticiones ·
              descanso ${descanso} s
            </p>
          </div>`;
}

function renderDay(day) {
  const notas = day.notes ? `<p>${escapeHtml(day.notes)}</p>` : '';

  return `
      <section class="routine-day">
        <h3>${escapeHtml(day.name)}</h3>
        ${notas}
        <div class="list">${day.exercises.map(renderExercise).join('')}</div>
      </section>`;
}

function renderRoutineDetail(routine) {
  return `
    <article class="card">
      <header class="page-header">
        <div>
          <span class="badge">${escapeHtml(routine.status)}</span>
          <h2>${escapeHtml(routine.name)}</h2>
          <p>${escapeHtml(routine.description || 'Sin descripción')}</p>
        </div>
        <a class="btn" href="rutina-formulario.html?id=${routine.id}">Modificar rutina</a>
      </header>
      ${routine.days.map(renderDay).join('')}
    </article>`;
}

async function openRoutine(id) {
  try {
    const { routine } = await api(`/api/routines/${id}`);
    detail.innerHTML = renderRoutineDetail(routine);
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

/* ---------- Carga inicial ---------- */

try {
  const { routines } = await api('/api/routines');

  list.innerHTML = routines.length
    ? routines.map(renderRoutineCard).join('')
    : '<div class="empty">Aún no has creado rutinas.</div>';

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.onclick = () => openRoutine(button.dataset.view);
  });
} catch (error) {
  showMessage(message, error.message, 'error');
}
