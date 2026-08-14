/* Mapa de cumplimiento de una rutina: una fila por semana y una columna por
   día. De un vistazo se ve en qué semana abandonó el atleta, que es lo que el
   entrenador necesita saber para ajustar el plan.

   Vive en un módulo compartido porque lo usan la pantalla de rutinas y la
   ficha del atleta, y las dos deben pintarlo exactamente igual. */

import { escapeHtml } from './dom.js';

function renderCell(day, weekNumber, progress) {
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

  /* Un día libre sin registrar no es un incumplimiento, así que se apaga en
     vez de mostrarse como pendiente. */
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

/* Cuenta los días de entrenamiento cumplidos en todo el plan. Los días libres
   se excluyen a propósito: no son deberes y contarlos inflaría la cifra. */
function countCompleted(routine, progress) {
  return progress.filter(
    (item) =>
      item.completedAt &&
      routine.days.find((day) => day.day_order === item.dayOrder)?.day_type === 'training',
  ).length;
}

export function renderCompliance(routine, progress) {
  if (!routine.athlete_id)
    return '<div class="empty">Esta rutina todavía no está asignada a ningún atleta.</div>';

  const semanas = Array.from({ length: routine.weeks || 1 }, (_, index) => index + 1);
  const diasEntreno = routine.days.filter((day) => day.day_type === 'training').length;
  const cumplidos = countCompleted(routine, progress);

  return `
      <div class="compliance">
        <div class="compliance-head">
          <h3>Cumplimiento</h3>
          <span class="badge${cumplidos ? '' : ' neutral'}">
            ${cumplidos} de ${diasEntreno * semanas.length} días de entrenamiento
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
                ${routine.days.map((day) => renderCell(day, week, progress)).join('')}
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
