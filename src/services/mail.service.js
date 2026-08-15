/* Envío de correo.

   Todo el contacto con el proveedor vive aquí. El resto de la aplicación solo
   llama a `sendPasswordReset` y `sendEmailVerification`, así que cambiar de
   Brevo a Resend —o a cualquier otro— es reescribir un transporte de este
   archivo y no tocar nada más.

   Transportes:
   - `console`: escribe el correo en el registro en lugar de enviarlo. Es el
     predeterminado en desarrollo y en las pruebas, para no necesitar
     credenciales ni llenar bandejas reales.
   - `brevo`: envía de verdad por su API HTTP. Se eligió porque permite
     verificar una única dirección de remitente sin poseer un dominio, que es
     la situación actual del proyecto. */

import { env } from '../config/environment.js';

/* El nombre de la persona viaja dentro del HTML del correo, así que hay que
   escaparlo igual que en el navegador. */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

async function sendWithBrevo({ to, subject, text, html }) {
  if (!env.mailApiKey || !env.mailFrom)
    throw new Error('Faltan MAIL_API_KEY o MAIL_FROM para enviar con Brevo');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.mailApiKey,
    },
    body: JSON.stringify({
      sender: { email: env.mailFrom, name: env.mailFromName },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    /* El cuerpo del error del proveedor explica si falta verificar el
       remitente o si se agotó la cuota del día, que son los dos fallos
       habituales del plan gratuito. */
    throw new Error(`Brevo respondió ${response.status}: ${await response.text()}`);
  }
}

/* Transporte preparado de antemano para el día que exista un dominio propio.
   Resend exige verificar el dominio con registros DNS, así que no sirve
   mientras se envíe desde una dirección suelta; a cambio, con el dominio
   verificado la entregabilidad es muy superior a la de un remitente sin
   autenticar.

   No hace falta tocar nada más para migrar: basta con cambiar MAIL_TRANSPORT a
   `resend`, poner la clave de Resend en MAIL_API_KEY y usar una dirección del
   dominio verificado en MAIL_FROM. */
async function sendWithResend({ to, subject, text, html }) {
  if (!env.mailApiKey || !env.mailFrom)
    throw new Error('Faltan MAIL_API_KEY o MAIL_FROM para enviar con Resend');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.mailApiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: `${env.mailFromName} <${env.mailFrom}>`,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    /* El error suele decir que el dominio todavía no está verificado, que es
       el fallo habitual justo después de migrar. */
    throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
  }
}

/* Buzón en memoria del transporte de consola. Existe porque del token solo se
   guarda el hash: sin esto, ni las pruebas ni quien desarrolla podrían
   recuperar el enlace que se habría enviado. Se limita para no crecer sin fin
   durante una sesión larga de desarrollo. */
export const outbox = [];

function sendWithConsole(message) {
  outbox.push(message);
  if (outbox.length > 20) outbox.shift();

  console.info(
    [
      '',
      '─── CORREO (transporte de consola, no se envió) ───',
      `Para: ${message.to}`,
      `Asunto: ${message.subject}`,
      '',
      message.text,
      '───────────────────────────────────────────────',
      '',
    ].join('\n'),
  );
}

async function send(message) {
  if (env.mailTransport === 'brevo') return sendWithBrevo(message);
  if (env.mailTransport === 'resend') return sendWithResend(message);
  return sendWithConsole(message);
}

/* Plantilla común: un texto plano legible y un HTML mínimo. No se usan
   imágenes ni hojas de estilo externas porque muchos clientes de correo las
   bloquean y porque no aportan nada a un mensaje de dos frases. */
function layout({ heading, greeting, paragraph, buttonLabel, url, footer }) {
  const text = [greeting, '', paragraph, '', url, '', footer].join('\n');
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#12211a">
      <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 12px">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 20px">${escapeHtml(paragraph)}</p>
      <p style="margin:0 0 20px">
        <a href="${escapeHtml(url)}"
           style="background:#145c3d;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">
          ${escapeHtml(buttonLabel)}
        </a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#5a6b63">
        Si el botón no funciona, copia esta dirección en tu navegador:
      </p>
      <p style="margin:0 0 20px;font-size:13px;word-break:break-all">${escapeHtml(url)}</p>
      <p style="margin:0;font-size:13px;color:#5a6b63">${escapeHtml(footer)}</p>
    </div>`;

  return { text, html };
}

export async function sendPasswordReset({ to, firstName, url, hours }) {
  const { text, html } = layout({
    heading: 'Restablece tu contraseña',
    greeting: `Hola ${firstName}:`,
    paragraph: `Recibimos una solicitud para restablecer la contraseña de tu cuenta de GymTrack. Abre el siguiente enlace para elegir una nueva. El enlace vence en ${hours} hora(s) y solo se puede usar una vez.`,
    buttonLabel: 'Restablecer contraseña',
    url,
    footer:
      'Si no pediste este cambio, puedes ignorar este mensaje: tu contraseña seguirá siendo la misma.',
  });

  await send({ to, subject: 'Restablece tu contraseña de GymTrack', text, html });
}

export async function sendEmailVerification({ to, firstName, url, hours }) {
  const { text, html } = layout({
    heading: 'Confirma tu correo',
    greeting: `Hola ${firstName}:`,
    paragraph: `Gracias por crear tu cuenta en GymTrack. Confirma que esta dirección es tuya para poder entrar. El enlace vence en ${hours} hora(s).`,
    buttonLabel: 'Confirmar mi correo',
    url,
    footer: 'Si no creaste esta cuenta, puedes ignorar este mensaje.',
  });

  await send({ to, subject: 'Confirma tu correo de GymTrack', text, html });
}
