/* Progreso del atleta: mediciones corporales, sus gráficas y el historial.

   Las mediciones las puede anotar tanto el atleta como su entrenador, y son
   exactamente las mismas: se guardan en una sola ficha por día. Esta pantalla
   y la ficha del entrenador comparten el módulo que dibuja las gráficas, para
   que los dos vean lo mismo. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { renderMeasurementCharts, measurementSummary, METRICS } from '../comun/mediciones.js';

await initNavigation();

const message = document.querySelector('#message');
const history = document.querySelector('#measurements');
document.querySelector('[name=measuredAt]').value = new Date().toISOString().slice(0, 10);

const toNumber = (value) => (value === '' ? null : Number(value));
const formatDate = (value) => new Date(value).toLocaleDateString();

function historyItem(item) {
  const anotado = measurementSummary(item);

  return `
    <div class="list-item">
      <strong>${escapeHtml(formatDate(item.measured_at))}</strong>
      ${anotado.length ? `<p>${escapeHtml(anotado.join(' · '))}</p>` : ''}
      ${item.notes ? `<small class="muted">${escapeHtml(item.notes)}</small>` : ''}
    </div>`;
}

async function load() {
  const { measurements } = await api('/api/tracking/measurements');

  renderMeasurementCharts(document.querySelector('#charts'), measurements);

  history.innerHTML = measurements.length
    ? measurements.map(historyItem).join('')
    : '<div class="empty">Registra tu primera medición.</div>';
}

document.querySelector('#measurement').onsubmit = async (event) => {
  event.preventDefault();
  const values = formData(event.target);

  /* Los campos vacíos se envían como nulos y no como cero: no medirse la
     cadera no significa que mida cero centímetros. El servidor conserva lo
     que ya hubiera guardado de ese día en los campos que lleguen vacíos. */
  for (const metric of METRICS) values[metric.name] = toNumber(values[metric.name]);

  try {
    await api('/api/tracking/measurements', { method: 'POST', body: JSON.stringify(values) });
    showMessage(message, 'Medición guardada correctamente.');
    await load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

await load();
