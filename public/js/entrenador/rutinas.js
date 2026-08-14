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

/* Duración del plan en palabras. Cuatro semanas se leen mejor como un mes. */
function durationLabel(weeks) {
  const total = weeks || 1;
  if (total === 1) return '1 semana';
  if (total === 4) return '4 semanas (1 mes)';
  return `${total} semanas`;
}

/* ---------- Resumen de la lista ---------- */

function renderRoutineCard(routine) {
  /* Una rutina puede existir como plantilla, todavía sin atleta asignado. */
  const destinatario = routine.athlete_first_name
    ? `${escapeHtml(routine.athlete_first_name)} ${escapeHtml(routine.athlete_last_name)}`
    : 'Plantilla sin asignar';

  return `
    <article class="card">
      <div class="actions">
        <span class="badge">${escapeHtml(routine.status)}</span>
        <span class="badge neutral">${durationLabel(routine.weeks)}</span>
      </div>
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

/* Etiqueta del día: libre, copia de otro día, o nada si es normal. */
function dayBadge(day) {
  if (day.day_type === 'rest') return '<span class="badge neutral">Día libre</span>';
  if (day.day_type === 'optional_rest')
    return '<span class="badge neutral">Día libre opcional</span>';
  if (day.mirrors_day_order != null)
    return `<span class="badge">Igual al Día ${day.mirrors_day_order}</span>`;
  return '';
}

function renderDay(day) {
  const notas = day.notes ? `<p>${escapeHtml(day.notes)}</p>` : '';
  const contenido = day.exercises.length
    ? `<div class="list">${day.exercises.map(renderExercise).join('')}</div>`
    : '';

  return `
      <section class="routine-day">
        <h3>Día ${day.day_order} · ${escapeHtml(day.name)} ${dayBadge(day)}</h3>
        ${notas}
        ${contenido}
      </section>`;
}

/* ---------- Mapa de cumplimiento ---------- */

/* Una fila por semana y una columna por día. De un vistazo se ve dónde
   abandonó el atleta, que es justo lo que el entrenador necesita saber. */
function renderComplianceCell(day, weekNumber, progress) {
  const slot = progress.find(
    (item) => item.weekNumber === weekNumber && item.dayOrder === day.day_order,
  );
  const isRest = day.day_type !== 'training';
  const total = day.exercises.length;
  const done = slot?.completedExercises ?? 0;

  let clase = 'pending';
  let texto = 'sin empezar';
  if (slot?.completedAt) {
    clase = 'done';
    texto = 'cumplido';
  } else if (slot) {
    clase = 'partial';
    texto = `${done} de ${total} ejercicios`;
  }
  /* Un día libre sin registrar no es un incumplimiento, así que se apaga
     en vez de mostrarse como pendiente. */
  if (isRest && !slot) {
    clase = 'rest';
    texto = 'día libre';
  }

  return `
            <td>
              <span
                class="heat ${clase}"
                title="Semana ${weekNumber} · Día ${day.day_order}: ${escapeHtml(texto)}"
              ><span class="sr-only">Semana ${weekNumber}, día ${day.day_order}: ${escapeHtml(texto)}</span></span>
            </td>`;
}

function renderCompliance(routine, progress) {
  if (!routine.athlete_id)
    return '<div class="empty">Esta rutina todavía no está asignada a ningún atleta.</div>';

  const semanas = Array.from({ length: routine.weeks || 1 }, (_, index) => index + 1);

  /* Se cuentan solo los días de entrenamiento: los libres no son deberes. */
  const diasEntreno = routine.days.filter((day) => day.day_type === 'training').length;
  const cumplidos = progress.filter(
    (item) =>
      item.completedAt &&
      routine.days.find((day) => day.day_order === item.dayOrder)?.day_type === 'training',
  ).length;
  const totalPlan = diasEntreno * semanas.length;

  return `
      <div class="compliance">
        <div class="compliance-head">
          <h3>Cumplimiento</h3>
          <span class="badge${cumplidos ? '' : ' neutral'}">
            ${cumplidos} de ${totalPlan} días de entrenamiento
          </span>
        </div>
        <div class="table-wrap">
          <table class="heatmap">
            <thead>
              <tr>
                <th><span class="sr-only">Semana</span></th>
                ${routine.days.map((day) => `<th>D${day.day_order}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${semanas
                .map(
                  (week) => `
              <tr>
                <th scope="row">S${week}</th>
                ${routine.days.map((day) => renderComplianceCell(day, week, progress)).join('')}
              </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <p class="compliance-legend">
          <span class="heat done"></span> Cumplido
          <span class="heat partial"></span> A medias
          <span class="heat pending"></span> Sin empezar
          <span class="heat rest"></span> Día libre
        </p>
      </div>`;
}

function renderRoutineDetail(routine, progress) {
  return `
    <article class="card">
      <header class="page-header">
        <div>
          <div class="actions">
            <span class="badge">${escapeHtml(routine.status)}</span>
            <span class="badge neutral">${durationLabel(routine.weeks)}</span>
          </div>
          <h2>${escapeHtml(routine.name)}</h2>
          <p>${escapeHtml(routine.description || 'Sin descripción')}</p>
        </div>
        <a class="btn" href="rutina-formulario.html?id=${routine.id}">Modificar rutina</a>
      </header>
      ${renderCompliance(routine, progress)}
      <h3 class="mt">La semana</h3>
      ${routine.days.map(renderDay).join('')}
    </article>`;
}

async function openRoutine(id) {
  try {
    /* El endpoint de progreso ya devuelve la rutina completa, así que con una
       sola petición se dibujan el detalle y el mapa de cumplimiento. */
    const { routine, progress } = await api(`/api/routines/${id}/progress`);
    detail.innerHTML = renderRoutineDetail(routine, progress);
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
