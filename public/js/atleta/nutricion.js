/* Plan nutricional del atleta: muestra los planes activos con sus
   objetivos diarios y el desglose de comidas que definió el entrenador. */

import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

/* Cada comida es un título con su detalle. El texto lo escribe el
   entrenador, por eso se escapa antes de insertarlo. */
function renderMeal(meal) {
  return `
      <h3>${escapeHtml(meal.name)}</h3>
      <p>${escapeHtml(meal.details)}</p>`;
}

function renderPlan(plan) {
  return `
    <article class="card">
      <span class="badge">Plan activo</span>
      <h2>${escapeHtml(plan.name)}</h2>
      <p>${escapeHtml(plan.description || '')}</p>

      <div class="grid three">
        <div><strong>${plan.calories || '—'}</strong><br><small>kcal</small></div>
        <div><strong>${plan.protein_g || '—'} g</strong><br><small>proteína</small></div>
        <div><strong>${plan.water_ml || '—'} ml</strong><br><small>agua</small></div>
      </div>

      <hr>
      ${plan.meals.map(renderMeal).join('')}
    </article>`;
}

const { plans } = await api('/api/tracking/nutrition');

document.querySelector('#plans').innerHTML = plans.length
  ? plans.map(renderPlan).join('')
  : '<div class="empty">No tienes un plan activo.</div>';
