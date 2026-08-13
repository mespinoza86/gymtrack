import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { renderChart, chartHeader } from '../comun/charts.js';

await initNavigation();

const message = document.querySelector('#message');
const history = document.querySelector('#measurements');
document.querySelector('[name=measuredAt]').value = new Date().toISOString().slice(0, 10);

const toNumber = (value) => (value === '' ? null : Number(value));
const formatDate = (value) => new Date(value).toLocaleDateString();

/* La API entrega las mediciones de la más reciente a la más antigua;
   las gráficas necesitan el orden contrario para leerse de izquierda
   a derecha. */
function series(measurements, field) {
  return [...measurements]
    .reverse()
    .map((item) => ({ x: item.measured_at, y: item[field] }))
    .filter((point) => point.y !== null && point.y !== undefined);
}

function drawChart(container, title, points, unit) {
  container.innerHTML = `${chartHeader(title, points, unit)}<div class="chart-holder"></div>`;
  renderChart(container.querySelector('.chart-holder'), points, {
    unit,
    height: 210,
    empty: 'Registra al menos una medición para ver la evolución.'
  });
}

function historyItem(item) {
  const detail = [
    item.weight_kg ? `${item.weight_kg} kg` : '',
    item.body_fat_percent ? `${item.body_fat_percent}% grasa` : ''
  ].filter(Boolean).join(' · ');

  const sizes = [
    item.waist_cm ? `Cintura ${item.waist_cm}` : '',
    item.hip_cm ? `Cadera ${item.hip_cm}` : '',
    item.chest_cm ? `Pecho ${item.chest_cm}` : '',
    item.arm_cm ? `Brazo ${item.arm_cm}` : ''
  ].filter(Boolean).join(' · ');

  return `<div class="list-item">
    <strong>${escapeHtml(formatDate(item.measured_at))}</strong>
    ${detail ? `<p>${escapeHtml(detail)}</p>` : ''}
    ${sizes ? `<small class="muted">${escapeHtml(sizes)}</small>` : ''}
  </div>`;
}

async function load() {
  const { measurements } = await api('/api/tracking/measurements');

  drawChart(document.querySelector('#chart-weight'), 'Peso corporal', series(measurements, 'weight_kg'), 'kg');
  drawChart(document.querySelector('#chart-waist'), 'Cintura', series(measurements, 'waist_cm'), 'cm');

  history.innerHTML = measurements.length
    ? measurements.map(historyItem).join('')
    : '<div class="empty">Registra tu primera medición.</div>';
}

document.querySelector('#measurement').onsubmit = async (event) => {
  event.preventDefault();
  const values = formData(event.target);
  for (const key of ['weightKg', 'bodyFatPercent', 'waistCm', 'hipCm', 'chestCm', 'armCm']) {
    values[key] = toNumber(values[key]);
  }
  try {
    await api('/api/tracking/measurements', { method: 'POST', body: JSON.stringify(values) });
    showMessage(message, 'Medición guardada correctamente.');
    await load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

await load();
