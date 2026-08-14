/* Revisión de check-ins. El entrenador ve los check-ins enviados por sus
   atletas y, en los que todavía no ha respondido, escribe directamente su
   retroalimentación desde la misma tarjeta. */

import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const message = document.querySelector('#message');

/* Un check-in ya revisado muestra la respuesta; uno pendiente muestra el
   formulario para escribirla. El identificador viaja en `data-id` para
   poder enlazar cada formulario con su check-in al terminar el dibujado. */
function renderResponse(checkin) {
  if (checkin.trainer_feedback) {
    return `
      <div class="notice">
        <strong>Respuesta:</strong> ${escapeHtml(checkin.trainer_feedback)}
      </div>`;
  }

  return `
      <form data-id="${checkin.id}">
        <div class="field">
          <label>Retroalimentación</label>
          <textarea required></textarea>
        </div>
        <button class="btn">Responder</button>
      </form>`;
}

function renderCheckin(checkin) {
  const fecha = new Date(checkin.checkin_date).toLocaleDateString();
  const nombre = `${escapeHtml(checkin.athlete_first_name)} ${escapeHtml(checkin.athlete_last_name)}`;

  return `
    <article class="card">
      <span class="badge">${fecha}</span>
      <h3>${nombre}</h3>
      <p>
        Energía ${checkin.energy}/10 · Estrés ${checkin.stress}/10 ·
        Sueño ${checkin.sleep_hours} h · Adherencia ${checkin.adherence}%
      </p>
      <p><strong>Logros:</strong> ${escapeHtml(checkin.wins || '—')}</p>
      <p><strong>Dificultades:</strong> ${escapeHtml(checkin.difficulties || '—')}</p>
      <p><strong>Molestias:</strong> ${escapeHtml(checkin.pain_details || 'Ninguna reportada')}</p>
      ${renderResponse(checkin)}
    </article>`;
}

/* Conecta cada formulario pendiente con su envío. Hay que hacerlo después
   de cada dibujado, porque al recargar la lista los elementos anteriores
   desaparecen junto con sus manejadores. */
function bindResponseForms() {
  document.querySelectorAll('form[data-id]').forEach((form) => {
    form.onsubmit = async (event) => {
      event.preventDefault();

      try {
        await api(`/api/tracking/checkins/${form.dataset.id}/review`, {
          method: 'PUT',
          body: JSON.stringify({ feedback: form.querySelector('textarea').value }),
        });
        load();
      } catch (error) {
        showMessage(message, error.message, 'error');
      }
    };
  });
}

async function load() {
  const { checkins } = await api('/api/tracking/checkins');

  document.querySelector('#checkins').innerHTML = checkins.length
    ? checkins.map(renderCheckin).join('')
    : '<div class="empty">Aún no hay check-ins.</div>';

  bindResponseForms();
}

load();
