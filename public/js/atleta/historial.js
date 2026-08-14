/* Historial de entrenamientos del atleta: una fila por sesión terminada,
   con la rutina y el día trabajados, las series completadas, el volumen
   total levantado y la energía reportada. */

import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

function renderWorkout(workout) {
  const fecha = new Date(workout.started_at).toLocaleString();
  const volumen = `${Number(workout.volume).toFixed(1)} kg`;

  /* Una sesión libre puede no tener rutina ni día asociados. */
  const rutina = escapeHtml(workout.routine_name || '—');
  const dia = escapeHtml(workout.day_name || '—');

  return `
    <tr>
      <td>${fecha}</td>
      <td>${rutina}</td>
      <td>${dia}</td>
      <td>${workout.sets_completed}</td>
      <td>${volumen}</td>
      <td>${workout.energy || '—'}</td>
    </tr>`;
}

const { workouts } = await api('/api/routines/history');

document.querySelector('#history').innerHTML = workouts.length
  ? workouts.map(renderWorkout).join('')
  : '<tr><td colspan="6">Todavía no hay entrenamientos registrados.</td></tr>';
