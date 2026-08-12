import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';

await initNavigation();
const list = document.querySelector('#routines');
const detail = document.querySelector('#detail');
const message = document.querySelector('#message');

try {
  const { routines } = await api('/api/routines');
  list.innerHTML = routines.length ? routines.map((routine) => `<article class="card"><span class="badge">${routine.status}</span><h2>${routine.name}</h2><p>${routine.description || 'Sin descripción'}</p><p><small>${routine.athlete_first_name ? `${routine.athlete_first_name} ${routine.athlete_last_name}` : 'Plantilla sin asignar'}</small></p><div class="actions"><button class="btn secondary small" data-view="${routine.id}">Ver rutina</button><a class="btn small" href="rutina-formulario.html?id=${routine.id}">Modificar</a></div></article>`).join('') : '<div class="empty">Aún no has creado rutinas.</div>';
  document.querySelectorAll('[data-view]').forEach((button) => { button.onclick = () => openRoutine(button.dataset.view); });
} catch (error) { showMessage(message, error.message, 'error'); }

async function openRoutine(id) {
  try {
    const { routine } = await api(`/api/routines/${id}`);
    detail.innerHTML = `<article class="card"><header class="page-header"><div><span class="badge">${routine.status}</span><h2>${routine.name}</h2><p>${routine.description || 'Sin descripción'}</p></div><a class="btn" href="rutina-formulario.html?id=${routine.id}">Modificar rutina</a></header>${routine.days.map((day) => `<section class="routine-day"><h3>${day.name}</h3>${day.notes ? `<p>${day.notes}</p>` : ''}<div class="list">${day.exercises.map((exercise) => `<div class="list-item"><strong>${exercise.name}</strong><p>${exercise.sets} series · ${exercise.reps} repeticiones · descanso ${exercise.restSeconds ?? '—'} s</p></div>`).join('')}</div></section>`).join('')}</article>`;
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) { showMessage(message, error.message, 'error'); }
}
