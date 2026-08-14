/* Planes nutricionales del entrenador: formulario para asignar un plan a
   un atleta vinculado y lista de los planes activos que ya creó. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const message = document.querySelector('#message');

/* El plan se asigna a un atleta concreto, así que el desplegable se llena
   con las personas vinculadas al entrenador. */
const { people } = await api('/api/links/people');

document.querySelector('#athlete').innerHTML = people
  .map(
    (person) =>
      `<option value="${person.id}">` +
      `${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}` +
      `</option>`,
  )
  .join('');

/* Los objetivos nutricionales son opcionales: un campo vacío se envía como
   nulo, no como cero, para no confundir "sin objetivo" con "cero calorías". */
const number = (value) => (value === '' ? null : Number(value));

/* ---------- Planes existentes ---------- */

function renderMeal(meal) {
  return `
      <strong>${escapeHtml(meal.name)}</strong>
      <p>${escapeHtml(meal.details)}</p>`;
}

function renderPlan(plan) {
  const atleta = `${escapeHtml(plan.athlete_first_name)} ${escapeHtml(plan.athlete_last_name)}`;

  return `
    <article class="list-item">
      <span class="badge">${atleta}</span>
      <h3>${escapeHtml(plan.name)}</h3>
      <p>${plan.calories || '—'} kcal · ${plan.protein_g || '—'} g proteína</p>
      ${plan.meals.map(renderMeal).join('')}
    </article>`;
}

async function load() {
  const { plans } = await api('/api/tracking/nutrition');

  document.querySelector('#plans').innerHTML = plans.length
    ? plans.map(renderPlan).join('')
    : '<div class="empty">Sin planes activos.</div>';
}

/* ---------- Alta de un plan ---------- */

document.querySelector('#nutrition').onsubmit = async (event) => {
  event.preventDefault();

  const data = formData(event.target);

  try {
    await api('/api/tracking/nutrition', {
      method: 'POST',
      body: JSON.stringify({
        athleteId: data.athleteId,
        name: data.name,
        description: data.description,
        calories: number(data.calories),
        proteinG: number(data.proteinG),
        carbsG: number(data.carbsG),
        fatsG: number(data.fatsG),
        /* Este primer formulario crea una sola comida; la API ya acepta
           varias y la pantalla podrá ampliarse sin tocar el servidor. */
        meals: [{ name: data.mealName, details: data.mealDetails }],
      }),
    });

    event.target.reset();
    showMessage(message, 'Plan asignado correctamente');
    load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

load();
