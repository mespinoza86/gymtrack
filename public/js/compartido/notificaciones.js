import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { icon } from '../comun/icons.js';

await initNavigation();

const list = document.querySelector('#notifications');
const message = document.querySelector('#message');
const readAll = document.querySelector('#read-all');
let notifications = [];

function safeLink(value) {
  return typeof value === 'string' && value.startsWith('/') ? value : null;
}

function relativeDate(value) {
  const date = new Date(value);
  const elapsed = Date.now() - date.getTime();
  if (elapsed < 60_000) return 'Ahora';
  if (elapsed < 3_600_000) return `Hace ${Math.floor(elapsed / 60_000)} min`;
  if (elapsed < 86_400_000) return `Hace ${Math.floor(elapsed / 3_600_000)} h`;
  return date.toLocaleDateString();
}

function render() {
  const unread = notifications.filter((item) => !item.read_at).length;
  readAll.disabled = !unread;
  document.querySelectorAll('.nav-count,.tab-count').forEach((badge) => {
    if (!unread) badge.remove();
    else {
      badge.textContent = unread > 99 ? '99+' : String(unread);
      badge.setAttribute('aria-label', `${unread} notificaciones pendientes`);
    }
  });
  list.innerHTML = notifications.length
    ? notifications
        .map((item) => {
          const link = safeLink(item.link);
          return `
            <article class="notification-item${item.read_at ? '' : ' unread'}">
              <span class="notification-icon">${icon('notificaciones')}</span>
              <div class="notification-content">
                <div class="notification-heading">
                  <strong>${escapeHtml(item.title)}</strong>
                  <small>${escapeHtml(relativeDate(item.created_at))}</small>
                </div>
                ${item.body ? `<p>${escapeHtml(item.body)}</p>` : ''}
                <div class="actions">
                  ${link ? `<button class="btn small" data-open="${item.id}" data-link="${escapeHtml(link)}">Abrir</button>` : ''}
                  ${item.read_at ? '' : `<button class="btn secondary small" data-read="${item.id}">Marcar como leída</button>`}
                </div>
              </div>
            </article>`;
        })
        .join('')
    : '<div class="empty">No tienes notificaciones todavía.</div>';

  list.querySelectorAll('[data-read]').forEach((button) => {
    button.onclick = () => markOne(button.dataset.read);
  });
  list.querySelectorAll('[data-open]').forEach((button) => {
    button.onclick = () => openNotification(button.dataset.open, button.dataset.link);
  });
}

async function markOne(id) {
  try {
    const { notification } = await api(`/api/notifications/${id}/read`, { method: 'PUT' });
    const item = notifications.find((entry) => entry.id === id);
    if (item) item.read_at = notification.read_at;
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function openNotification(id, link) {
  try {
    await api(`/api/notifications/${id}/read`, { method: 'PUT' });
    location.href = safeLink(link) || '/compartido/notificaciones.html';
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

readAll.onclick = async () => {
  try {
    await api('/api/notifications/read-all', { method: 'PUT' });
    const now = new Date().toISOString();
    notifications.forEach((item) => {
      if (!item.read_at) item.read_at = now;
    });
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

try {
  notifications = (await api('/api/notifications')).notifications;
  render();
} catch (error) {
  showMessage(message, error.message, 'error');
  list.innerHTML = '<div class="empty">No se pudieron cargar las notificaciones.</div>';
}
