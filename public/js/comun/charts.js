import { escapeHtml } from './dom.js';

/* Gráficas de línea dibujadas como SVG propio.

   No se usa ninguna librería porque la política de seguridad del
   servidor solo permite cargar scripts propios. El SVG se construye
   con el ancho real del contenedor en lugar de escalarlo con
   viewBox, para que las etiquetas conserven su tamaño legible
   tanto en un monitor como en un celular. */

let sequence = 0;

const MARGIN = { top: 16, right: 16, bottom: 28, left: 44 };

function scale(min, max) {
  if (min === max) return { lo: min - 1, hi: max + 1 };
  const padding = (max - min) * 0.15;
  return { lo: min - padding, hi: max + padding };
}

/* Se muestran pocos decimales para que el eje no se vuelva ruidoso. */
function shorten(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

const shortDate = (value) =>
  new Date(value).toLocaleDateString('es', { day: 'numeric', month: 'short' });

function buildSvg(points, width, height, unit) {
  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 10);
  const innerHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 10);
  const values = points.map((point) => point.y);
  const { lo, hi } = scale(Math.min(...values), Math.max(...values));

  const x = (index) =>
    MARGIN.left +
    (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
  const y = (value) => MARGIN.top + innerHeight - ((value - lo) / (hi - lo)) * innerHeight;

  const id = `chart-fade-${(sequence += 1)}`;

  const ticks = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const value = lo + (hi - lo) * (1 - ratio);
      const position = MARGIN.top + innerHeight * ratio;
      return `<line class="chart-grid" x1="${MARGIN.left}" y1="${position}" x2="${MARGIN.left + innerWidth}" y2="${position}"/>
      <text class="chart-axis" x="${MARGIN.left - 8}" y="${position + 4}" text-anchor="end">${shorten(value)}</text>`;
    })
    .join('');

  const line = points
    .map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(point.y).toFixed(1)}`)
    .join(' ');
  const base = MARGIN.top + innerHeight;
  const area = `${line} L${x(points.length - 1).toFixed(1)},${base} L${x(0).toFixed(1)},${base} Z`;

  const dots = points
    .map((point, index) => {
      const last = index === points.length - 1;
      /* Con muchos registros solo se marcan los extremos para no saturar. */
      if (!last && points.length > 14 && index !== 0) return '';

      /* El <title> es el detalle que el navegador muestra al posar
         el puntero encima del punto. */
      const detalle = escapeHtml(
        `${shortDate(point.x)}: ${shorten(point.y)}${unit ? ` ${unit}` : ''}`,
      );

      return `
        <circle
          class="${last ? 'chart-dot-last' : 'chart-dot'}"
          cx="${x(index).toFixed(1)}"
          cy="${y(point.y).toFixed(1)}"
          r="${last ? 5 : 4}"
        ><title>${detalle}</title></circle>`;
    })
    .join('');

  const first = shortDate(points[0].x);
  const last = shortDate(points[points.length - 1].x);
  const labels =
    points.length === 1
      ? `<text class="chart-axis" x="${x(0)}" y="${height - 8}" text-anchor="middle">${escapeHtml(first)}</text>`
      : `<text class="chart-axis" x="${MARGIN.left}" y="${height - 8}">${escapeHtml(first)}</text>
       <text class="chart-axis" x="${MARGIN.left + innerWidth}" y="${height - 8}" text-anchor="end">${escapeHtml(last)}</text>`;

  return `<svg class="chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop class="chart-fade-from" offset="0"/><stop class="chart-fade-to" offset="1"/>
    </linearGradient></defs>
    ${ticks}
    <path d="${area}" fill="url(#${id})"/>
    <path class="chart-line" d="${line}"/>
    ${dots}
    ${labels}
  </svg>`;
}

/* Dibuja la gráfica dentro del contenedor y la vuelve a dibujar si
   la ventana cambia de tamaño, para que siga ajustada al girar el
   teléfono o al redimensionar la ventana. */
export function renderChart(
  container,
  points,
  { height = 240, unit = '', empty = 'Sin datos suficientes para graficar.' } = {},
) {
  const usable = points
    .filter((point) => point.y !== null && point.y !== undefined && !Number.isNaN(Number(point.y)))
    .map((point) => ({ x: point.x, y: Number(point.y) }))
    .sort((a, b) => new Date(a.x) - new Date(b.x));

  const draw = () => {
    if (!usable.length) {
      container.innerHTML = `<div class="empty">${escapeHtml(empty)}</div>`;
      return;
    }
    const width = Math.max(container.clientWidth || 640, 260);
    container.innerHTML = buildSvg(usable, width, height, unit);
  };

  draw();

  let pending;
  addEventListener('resize', () => {
    clearTimeout(pending);
    pending = setTimeout(draw, 150);
  });
}

/* Encabezado con el valor más reciente y su variación respecto al
   primer registro del periodo mostrado. */
export function chartHeader(title, points, unit = '') {
  const usable = points.filter(
    (point) => point.y !== null && point.y !== undefined && !Number.isNaN(Number(point.y)),
  );
  if (!usable.length) return `<div class="chart-head"><h3>${escapeHtml(title)}</h3></div>`;

  const latest = Number(usable[usable.length - 1].y);
  const oldest = Number(usable[0].y);
  const change = latest - oldest;
  const direction = Math.abs(change) < 0.05 ? 'flat' : change > 0 ? 'up' : 'down';
  /* Solo se indica la dirección del cambio, sin sugerir si es
     favorable: eso depende del objetivo de cada persona. */
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '';
  const delta =
    usable.length > 1
      ? `<span class="chart-delta ${direction}">${direction === 'flat' ? 'Sin cambio' : `${arrow} ${shorten(Math.abs(change))} ${escapeHtml(unit)}`}</span>`
      : '';

  return `<div class="chart-head">
    <div><h3>${escapeHtml(title)}</h3><span class="chart-value tabular">${shorten(latest)} ${escapeHtml(unit)}</span></div>
    ${delta}
  </div>`;
}
