import { currentUser, logout } from './auth.js';
import { escapeHtml } from './dom.js';
import { icon } from './icons.js';
import { themeButton } from './theme.js';

/* Cada entrada es [etiqueta, dirección, icono]. Las marcadas en
   `tabs` son las que aparecen en la barra inferior del celular;
   el resto queda en el menú deslizante. */
const menus = {
  trainer: {
    links: [
      ['Panel', '/entrenador/panel.html', 'panel'],
      ['Atletas', '/entrenador/atletas.html', 'atletas'],
      ['Invitaciones', '/entrenador/invitaciones.html', 'invitaciones'],
      ['Ejercicios', '/entrenador/ejercicios.html', 'ejercicios'],
      ['Rutinas', '/entrenador/rutinas.html', 'rutinas'],
      ['Nutrición', '/entrenador/nutricion.html', 'nutricion'],
      ['Check-ins', '/entrenador/checkins.html', 'checkins'],
      ['Mensajes', '/compartido/mensajes.html', 'mensajes'],
      ['Perfil', '/compartido/perfil.html', 'perfil'],
    ],
    tabs: [
      '/entrenador/panel.html',
      '/entrenador/atletas.html',
      '/entrenador/rutinas.html',
      '/compartido/mensajes.html',
    ],
  },
  athlete: {
    links: [
      ['Panel', '/atleta/panel.html', 'panel'],
      ['Rutinas', '/atleta/rutinas.html', 'rutinas'],
      ['Historial', '/atleta/historial.html', 'historial'],
      ['Nutrición', '/atleta/nutricion.html', 'nutricion'],
      ['Progreso', '/atleta/progreso.html', 'progreso'],
      ['Check-in', '/atleta/checkin.html', 'checkins'],
      ['Mensajes', '/compartido/mensajes.html', 'mensajes'],
      ['Perfil', '/compartido/perfil.html', 'perfil'],
    ],
    tabs: [
      '/atleta/panel.html',
      '/atleta/rutinas.html',
      '/atleta/progreso.html',
      '/compartido/mensajes.html',
    ],
  },
};

const brand = `<span class="logo-mark">${icon('pesa')}</span>Gym<span>Track</span>`;
const isCurrent = (url) => location.pathname === url;

function initials(user) {
  return `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '·';
}

function navLinks(links) {
  return links
    .map(
      ([label, url, name]) =>
        `<a class="nav-link${isCurrent(url) ? ' active' : ''}" href="${url}"${isCurrent(url) ? ' aria-current="page"' : ''}>${icon(name)}<span>${label}</span></a>`,
    )
    .join('');
}

function fillSidebar(sidebar, user, menu) {
  sidebar.innerHTML = `
    <div class="logo">${brand}</div>
    <nav aria-label="Secciones">${navLinks(menu.links)}</nav>
    <div class="sidebar-footer">
      <div class="user-chip">
        <span class="avatar">${escapeHtml(initials(user))}</span>
        <div>
          <strong>${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</strong>
          <small>${user.role === 'trainer' ? 'Entrenador' : 'Atleta'}</small>
        </div>
      </div>
      <div class="footer-actions">
        <button class="btn secondary small" id="logout">${icon('salir')}Cerrar sesión</button>
      </div>
    </div>`;
  sidebar.querySelector('#logout').onclick = logout;
  /* En escritorio la barra superior no existe, así que el cambio de
     tema vive aquí para estar siempre disponible. */
  sidebar.querySelector('.footer-actions').append(themeButton());
}

/* Barra superior con el botón que abre el menú y el cambio de tema.
   Solo se muestra por debajo de 1024 px; el CSS decide cuándo. */
function buildTopbar(openDrawer) {
  const topbar = document.createElement('header');
  topbar.className = 'topbar';

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'icon-btn';
  menuButton.innerHTML = icon('menu');
  menuButton.title = 'Abrir menú';
  menuButton.setAttribute('aria-label', 'Abrir menú');
  menuButton.onclick = openDrawer;

  const logo = document.createElement('div');
  logo.className = 'logo';
  logo.innerHTML = brand;

  topbar.append(menuButton, logo, themeButton());
  return topbar;
}

/* Barra inferior con los accesos frecuentes más un botón que abre
   el menú completo, para que ninguna sección quede inalcanzable. */
function buildBottomNav(menu, openDrawer) {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Accesos rápidos');

  const tabs = menu.tabs
    .map((url) => menu.links.find((link) => link[1] === url))
    .filter(Boolean)
    .map(
      ([label, url, name]) =>
        `<li><a class="tab${isCurrent(url) ? ' active' : ''}" href="${url}"${isCurrent(url) ? ' aria-current="page"' : ''}>${icon(name)}<span>${label}</span></a></li>`,
    )
    .join('');

  nav.innerHTML = `<ul>${tabs}<li><button type="button" class="tab" id="more-tab">${icon('mas')}<span>Más</span></button></li></ul>`;
  nav.querySelector('#more-tab').onclick = openDrawer;
  return nav;
}

export async function initNavigation() {
  const user = await currentUser();

  /* Un atleta no debe quedarse en una pantalla de entrenador ni al revés. */
  const expected = location.pathname.includes('/entrenador/')
    ? 'trainer'
    : location.pathname.includes('/atleta/')
      ? 'athlete'
      : null;
  if (expected && user.role !== expected) {
    location.href = user.role === 'trainer' ? '/entrenador/panel.html' : '/atleta/panel.html';
    return user;
  }

  const sidebar = document.querySelector('[data-sidebar]');
  if (!sidebar) return user;

  const menu = menus[user.role];
  fillSidebar(sidebar, user, menu);

  const shell = sidebar.parentElement;
  const scrim = document.createElement('div');
  scrim.className = 'scrim';

  const closeDrawer = () => {
    document.body.classList.remove('drawer-open');
    sidebar.removeAttribute('aria-modal');
  };
  const openDrawer = () => {
    document.body.classList.add('drawer-open');
    sidebar.setAttribute('aria-modal', 'true');
    sidebar.querySelector('.nav-link')?.focus();
  };

  scrim.onclick = closeDrawer;
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
  });

  shell.prepend(buildTopbar(openDrawer));
  shell.append(scrim, buildBottomNav(menu, openDrawer));

  /* Si la ventana crece hasta el tamaño de escritorio, el menú
     deslizante deja de tener sentido y debe cerrarse. */
  matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) closeDrawer();
  });

  return user;
}
