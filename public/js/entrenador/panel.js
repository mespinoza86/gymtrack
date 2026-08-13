import { initNavigation } from '../comun/navigation.js';
import { api } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { icon } from '../comun/icons.js';

await initNavigation();

const [{ people }, { routines }, { checkins }] = await Promise.all([
  api('/api/links/people'),
  api('/api/routines'),
  api('/api/tracking/checkins')
]);

const stat = (label, value, name) =>
  `<article class="card stat"><span>${label}</span><strong>${value}</strong><span class="stat-icon">${icon(name)}</span></article>`;

document.querySelector('#stats').innerHTML = [
  stat('Atletas activos', people.length, 'atletas'),
  stat('Rutinas creadas', routines.length, 'rutinas'),
  stat('Check-ins por revisar', checkins.filter((item) => !item.reviewed_at).length, 'checkins')
].join('');

document.querySelector('#people').innerHTML = people.length
  ? people.slice(0, 6).map((person) => `<div class="list-item">
      <strong>${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}</strong>
      <p>${person.latest_weight ? `${escapeHtml(person.latest_weight)} kg` : 'Sin mediciones registradas'}</p>
    </div>`).join('')
  : '<div class="empty">Aún no tienes atletas vinculados.</div>';
