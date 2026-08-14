/* Lista de atletas vinculados al entrenador, con su último peso
   registrado y la fecha de su medición más reciente. */

import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

function renderAthlete(athlete) {
  /* Un atleta recién vinculado todavía no tiene mediciones. */
  const peso = athlete.latest_weight ? `${athlete.latest_weight} kg` : '—';
  const medicion = athlete.latest_measurement
    ? new Date(athlete.latest_measurement).toLocaleDateString()
    : '—';

  return `
    <tr>
      <td><strong>${escapeHtml(athlete.first_name)} ${escapeHtml(athlete.last_name)}</strong></td>
      <td>${escapeHtml(athlete.email)}</td>
      <td>${peso}</td>
      <td>${medicion}</td>
    </tr>`;
}

const { people } = await api('/api/links/people');

document.querySelector('#athletes').innerHTML = people.length
  ? people.map(renderAthlete).join('')
  : '<tr><td colspan="4">No hay atletas vinculados.</td></tr>';
