import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { icon } from '../comun/icons.js';

await initNavigation();

const [{ people }, { routines }, { measurements }] = await Promise.all([
  api('/api/links/people'),
  api('/api/routines'),
  api('/api/tracking/measurements'),
]);

document.querySelector('#link-card').innerHTML = people.length
  ? ''
  : `<div class="notice"><strong>Aún no tienes entrenador.</strong> Introduce el código que te compartió en <a href="/compartido/perfil.html">tu perfil</a>.</div>`;

const stat = (label, value, name) =>
  `<article class="card stat"><span>${label}</span><strong>${value}</strong><span class="stat-icon">${icon(name)}</span></article>`;

const latestWeight = measurements[0]?.weight_kg;

document.querySelector('#stats').innerHTML = [
  stat('Rutinas activas', routines.length, 'rutinas'),
  stat('Último peso', latestWeight ? `${escapeHtml(latestWeight)} kg` : '—', 'progreso'),
  stat('Entrenadores', people.length, 'atletas'),
].join('');

document.querySelector('#routines').innerHTML = routines.length
  ? routines
      .map(
        (routine) => `<div class="list-item">
      <strong>${escapeHtml(routine.name)}</strong>
      ${routine.description ? `<p>${escapeHtml(routine.description)}</p>` : ''}
    </div>`,
      )
      .join('')
  : '<div class="empty">No tienes una rutina activa.</div>';
