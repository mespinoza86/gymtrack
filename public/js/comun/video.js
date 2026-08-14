/* Conversión de enlaces de video a una dirección que se pueda incrustar.

   Solo se admiten YouTube y Vimeo, que son los únicos proveedores que
   autoriza la política de seguridad del servidor (`frameSrc` en `src/app.js`).
   Cualquier otro enlace devuelve null y la pantalla ofrecerá abrirlo aparte.

   Está en un módulo propio, sin nada del navegador, para poder comprobarlo
   con pruebas automatizadas: es lógica fácil de romper al añadir formatos. */

/* Un identificador de YouTube son letras, números, guion y guion bajo.
   Se comprueba para no construir una dirección con basura. */
const YOUTUBE_ID = /^[\w-]{6,20}$/;

/* Rutas con la forma /tipo/IDENTIFICADOR. `shorts` es la más común hoy y
   antes se quedaba fuera: el entrenador pegaba el enlace y no se veía nada. */
const YOUTUBE_PATHS = new Set(['shorts', 'embed', 'live', 'v']);

const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'youtube-nocookie.com']);

function youtubeId(url) {
  const host = url.hostname.replace(/^www\./, '');

  /* Enlace abreviado: el identificador va directamente en la ruta. */
  if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] ?? null;

  if (!YOUTUBE_HOSTS.has(host)) return null;
  if (url.pathname === '/watch') return url.searchParams.get('v');

  const [type, id] = url.pathname.split('/').filter(Boolean);
  return YOUTUBE_PATHS.has(type) ? (id ?? null) : null;
}

export function videoEmbedUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    /* Un enlace mal formado se trata igual que un proveedor no admitido. */
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const id = youtubeId(url);
  if (id && YOUTUBE_ID.test(id))
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;

  if (url.hostname.replace(/^www\./, '') === 'vimeo.com') {
    const first = url.pathname.split('/').filter(Boolean)[0];
    if (/^\d+$/.test(first || '')) return `https://player.vimeo.com/video/${first}`;
  }

  return null;
}
