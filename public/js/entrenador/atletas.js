/* Lista de atletas vinculados al entrenador, con cómo van esta semana en su
   rutina, su último peso registrado y la fecha de su medición más reciente.

   El cumplimiento llega de un endpoint aparte del de vinculaciones, porque
   son dos módulos distintos del servidor; se piden a la vez y se cruzan aquí
   por el identificador del atleta. */

import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

/* Resumen de la semana en curso. Se cuentan solo los días de entrenamiento:
   los días libres no son deberes y contarlos inflaría el cumplimiento. */
function weekSummary(entry) {
  if (!entry?.routine) return '<span class="badge neutral">Sin rutina</span>';

  const { currentWeek, weeks, completedDays, trainingDays } = entry.routine;
  const semana = weeks > 1 ? `Semana ${currentWeek} de ${weeks}` : 'Semana 1';

  if (!trainingDays)
    return `<span class="badge neutral">${semana} · sin días de entrenamiento</span>`;

  /* Verde solo al completar la semana; ámbar si no ha empezado y quedan días
     por hacer. El estado intermedio se deja neutro para no regañar a nadie
     por ir a mitad de semana. */
  const completa = completedDays >= trainingDays;
  const clase = completa ? '' : completedDays === 0 ? ' warn' : ' neutral';

  return `
    <span class="badge${clase}">${completedDays} de ${trainingDays} días</span>
    <small class="muted">${semana}</small>`;
}

function renderAthlete(athlete, compliance) {
  /* Un atleta recién vinculado todavía no tiene mediciones. */
  const peso = athlete.latest_weight ? `${athlete.latest_weight} kg` : '—';
  const medicion = athlete.latest_measurement
    ? new Date(athlete.latest_measurement).toLocaleDateString()
    : '—';

  return `
    <tr>
      <td><strong>${escapeHtml(athlete.first_name)} ${escapeHtml(athlete.last_name)}</strong></td>
      <td>${weekSummary(compliance.get(athlete.id))}</td>
      <td>${escapeHtml(athlete.email)}</td>
      <td>${peso}</td>
      <td>${medicion}</td>
    </tr>`;
}

const [{ people }, { athletes }] = await Promise.all([
  api('/api/links/people'),
  api('/api/routines/compliance'),
]);

const compliance = new Map(athletes.map((item) => [item.athleteId, item]));

document.querySelector('#athletes').innerHTML = people.length
  ? people.map((athlete) => renderAthlete(athlete, compliance)).join('')
  : '<tr><td colspan="5">No hay atletas vinculados.</td></tr>';
