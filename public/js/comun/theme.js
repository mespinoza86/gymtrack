import { icon } from './icons.js';

const KEY = 'gymtrack-theme';
const system = matchMedia('(prefers-color-scheme: dark)');

/* Puede haber más de un botón en pantalla, por ejemplo el de la barra
   superior y el del menú lateral. Se guardan todos para que al cambiar
   el tema ninguno quede mostrando el icono contrario. */
const buttons = new Set();

/* El tema efectivo es el elegido a mano si existe; si no, el del sistema. */
function currentTheme() {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'dark' || chosen === 'light') return chosen;
  return system.matches ? 'dark' : 'light';
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
  try { localStorage.setItem(KEY, theme); } catch (error) { /* almacenamiento no disponible */ }
  refreshAll();
}

/* Mientras el usuario no elija manualmente, se sigue al sistema. */
system.addEventListener('change', () => {
  if (!document.documentElement.dataset.theme) refreshAll();
});

export function themeButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-btn';
  button.onclick = () => apply(currentTheme() === 'dark' ? 'light' : 'dark');
  buttons.add(button);
  describe(button, currentTheme());
  return button;
}
