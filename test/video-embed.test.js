/* Conversión de enlaces de video. No toca la base de datos ni el navegador:
   es lógica pura y es la que se rompe al añadir formatos nuevos. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { videoEmbedUrl } from '../public/js/comun/video.js';

const YOUTUBE = 'https://www.youtube-nocookie.com/embed/WDIpL0pjun0';

test('acepta las formas habituales de enlace de YouTube', () => {
  const equivalentes = [
    'https://www.youtube.com/watch?v=WDIpL0pjun0',
    'https://youtube.com/watch?v=WDIpL0pjun0',
    'https://m.youtube.com/watch?v=WDIpL0pjun0',
    /* Con lista de reproducción y marca de tiempo, como lo copia YouTube. */
    'https://www.youtube.com/watch?v=WDIpL0pjun0&list=PL123&t=42s',
    'https://youtu.be/WDIpL0pjun0',
    /* El botón Compartir añade este parámetro desde hace tiempo. */
    'https://youtu.be/WDIpL0pjun0?si=aBcDeFgH',
    /* Shorts: antes no se reconocía y el atleta no veía nada. */
    'https://www.youtube.com/shorts/WDIpL0pjun0',
    'https://www.youtube.com/live/WDIpL0pjun0',
    'https://www.youtube.com/embed/WDIpL0pjun0',
  ];

  for (const enlace of equivalentes) assert.equal(videoEmbedUrl(enlace), YOUTUBE, enlace);
});

test('acepta Vimeo y descarta sus rutas que no son un video', () => {
  assert.equal(
    videoEmbedUrl('https://vimeo.com/76979871'),
    'https://player.vimeo.com/video/76979871',
  );
  assert.equal(
    videoEmbedUrl('https://www.vimeo.com/76979871'),
    'https://player.vimeo.com/video/76979871',
  );
  assert.equal(videoEmbedUrl('https://vimeo.com/canales/personal'), null);
});

test('rechaza lo que no se puede incrustar', () => {
  const rechazados = [
    'https://ejemplo.com/video.mp4',
    'https://vimeo.com',
    'https://www.youtube.com',
    'https://www.youtube.com/watch',
    'https://www.youtube.com/results?search_query=lagartijas',
    'no es una direccion',
    '',
    /* Un identificador con caracteres imposibles no debe construir nada. */
    'https://www.youtube.com/watch?v=../../etc',
  ];

  for (const enlace of rechazados) assert.equal(videoEmbedUrl(enlace), null, enlace);
});

test('rechaza esquemas peligrosos aunque parezcan un enlace', () => {
  /* `javascript:` nunca debe acabar en el src de un marco. */
  assert.equal(videoEmbedUrl('javascript:alert(1)'), null);
  assert.equal(videoEmbedUrl('data:text/html,<script>alert(1)</script>'), null);
});
