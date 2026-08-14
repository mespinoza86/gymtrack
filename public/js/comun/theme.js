import { icon } from './icons.js';

const KEY = 'gymtrack-theme';

/* Puede haber más de un botón en pantalla, por ejemplo el de la barra
   superior y el del menú lateral. Se guardan todos para que al cambiar
   el tema ninguno quede mostrando el icono contrario. */
const buttons = new Set();

/* El tema efectivo es el elegido a mano si existe; si no, oscuro, que
   es el tema base de la aplicación. La preferencia del sistema no
   interviene: el oscuro es siempre el punto de partida. */
function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function describe(button, theme) {
  const goingToDark = theme === 'light';
  button.innerHTML = icon(goingToDark ? 'luna' : 'sol');
  button.title = goingToDark ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
  button.setAttribute('aria-label', button.title);
}

function refreshAll() {
  const theme = currentTheme();
  buttons.forEach((button) => describe(button, theme));
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch (error) {
    /* almacenamiento no disponible */
  }
  refreshAll();
}

export function themeButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-btn';
  button.onclick = () => apply(currentTheme() === 'dark' ? 'light' : 'dark');
  buttons.add(button);
  describe(button, currentTheme());
  return button;
}
