/* Mediciones corporales: qué se mide y cómo se dibuja.

   Vive en un módulo compartido porque lo usan la pantalla de progreso del
   atleta y la ficha del entrenador, y las dos tienen que enseñar exactamente
   lo mismo: los datos son los mismos, los ponga quien los ponga. */

import { renderChart, chartHeader } from './charts.js';

/* El orden es el que se ve en pantalla: primero lo que más se sigue. */
export const METRICS = [
  { field: 'weight_kg', name: 'weightKg', label: 'Peso corporal', unit: 'kg' },
  { field: 'body_fat_percent', name: 'bodyFatPercent', label: 'Grasa corporal', unit: '%' },
  { field: 'waist_cm', name: 'waistCm', label: 'Cintura', unit: 'cm' },
  { field: 'hip_cm', name: 'hipCm', label: 'Cadera', unit: 'cm' },
  { field: 'chest_cm', name: 'chestCm', label: 'Pecho', unit: 'cm' },
  { field: 'arm_cm', name: 'armCm', label: 'Brazo', unit: 'cm' },
  { field: 'thigh_cm', name: 'thighCm', label: 'Muslo', unit: 'cm' },
];

/* La API entrega las mediciones de la más reciente a la más antigua; las
   gráficas necesitan el orden contrario para leerse de izquierda a derecha. */
function series(measurements, field) {
  return [...measurements]
    .reverse()
    .map((item) => ({ x: item.measured_at, y: item[field] }))
    .filter((point) => point.y !== null && point.y !== undefined);
}

/* Dibuja una gráfica por cada medida que tenga datos.

   No se pintan las siete siempre: quien solo registra el peso vería seis
   recuadros vacíos y tendría que buscar el único que le sirve. Con dos puntos
   o más ya se ve una tendencia; con uno solo se muestra igual, porque el
   punto existe y el encabezado da el valor. */
export function renderMeasurementCharts(container, measurements) {
  const conDatos = METRICS.map((metric) => ({
    ...metric,
    points: series(measurements, metric.field),
  })).filter((metric) => metric.points.length);

  if (!conDatos.length) {
    container.innerHTML =
      '<div class="empty">Todavía no hay mediciones registradas. En cuanto se anote la primera aparecerán aquí las gráficas.</div>';
    return;
  }

  container.innerHTML = conDatos
    .map(
      (metric) => `
      <div class="chart-panel" data-metric="${metric.field}">
        ${chartHeader(metric.label, metric.points, metric.unit)}
        <div class="chart-holder"></div>
      </div>`,
    )
    .join('');

  /* Cada gráfica se dibuja sobre su contenedor ya insertado, porque
     `renderChart` mide el ancho real para elegir el tamaño del texto. */
  conDatos.forEach((metric) => {
    const panel = container.querySelector(`[data-metric="${metric.field}"] .chart-holder`);
    renderChart(panel, metric.points, { unit: metric.unit, height: 200 });
  });
}

/* Resumen de una medición para el historial, con solo lo que se anotó. */
export function measurementSummary(item) {
  return METRICS.map((metric) =>
    item[metric.field] === null || item[metric.field] === undefined
      ? ''
      : `${metric.label}: ${item[metric.field]} ${metric.unit}`,
  ).filter(Boolean);
}
