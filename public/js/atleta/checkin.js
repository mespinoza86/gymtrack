/* Check-in semanal del atleta: envía el formulario de seguimiento
   y muestra debajo el historial de check-ins anteriores junto con la
   retroalimentación que haya dejado el entrenador. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const message = document.querySelector('#message');

/* El check-in se dirige a un entrenador concreto, así que el desplegable
   se llena con las personas vinculadas al atleta. */
const { people } = await api('/api/links/people');

document.querySelector('#trainer').innerHTML = people
  .map(
    (person) =>
      `<option value="${person.id}">` +
      `${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}` +
      `</option>`,
  )
  .join('');

/* Por comodidad, la fecha se propone ya con el día de hoy. */
document.querySelector('[name=checkinDate]').value = new Date().toISOString().slice(0, 10);

/* ---------- Historial ---------- */

function renderCheckin(checkin) {
  const fecha = new Date(checkin.checkin_date).toLocaleDateString();

  /* Mientras el entrenador no responda, se indica que sigue pendiente. */
  const respuesta = checkin.trainer_feedback
    ? `<div class="notice">${escapeHtml(checkin.trainer_feedback)}</div>`
    : '<small>Pendiente de revisión</small>';

  return `
    <article class="list-item">
      <strong>${fecha}</strong>
      <p>Energía ${checkin.energy}/10 · Adherencia ${checkin.adherence}%</p>
      ${respuesta}
    </article>`;
}

async function load() {
  const { checkins } = await api('/api/tracking/checkins');

  document.querySelector('#checkins').innerHTML = checkins.length
    ? checkins.map(renderCheckin).join('')
    : '<div class="empty">No hay check-ins anteriores.</div>';
}

/* ---------- Envío ---------- */

document.querySelector('#checkin').onsubmit = async (event) => {
  event.preventDefault();

  const data = formData(event.target);

  /* Los campos de un formulario siempre llegan como texto; el servidor
     espera números en las escalas de esfuerzo, sueño y adherencia. */
  for (const campo of ['energy', 'sleepHours', 'stress', 'hunger', 'adherence']) {
    data[campo] = Number(data[campo]);
  }

  try {
    await api('/api/tracking/checkins', { method: 'POST', body: JSON.stringify(data) });
    event.target.reset();
    showMessage(message, 'Check-in enviado');
    load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

load();
