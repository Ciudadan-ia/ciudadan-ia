/**
 * POST /api/suscribir — alta de newsletter vía Buttondown (contracts/forms.md).
 * HTML puro: valida, aplica anti-spam (honeypot + tiempo mínimo) y redirige 303.
 * Requiere la variable BUTTONDOWN_API_KEY en Cloudflare Pages.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MS = 3000;

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = String(form.get('email') || '').trim();
  const segmento = form.get('segmento') === 'docentes' ? 'docentes' : 'general';
  const lengua = String(form.get('lengua') || 'es').slice(0, 5);
  const hp = String(form.get('_hp') || '');
  const t = Number(form.get('_t') || 0);

  // Spam: responder 200 silencioso sin revelar la detección.
  if (hp !== '' || (t > 0 && Date.now() - t < MIN_MS)) {
    return new Response('OK', { status: 200 });
  }

  if (!EMAIL_RE.test(email)) {
    return Response.redirect(new URL('/suscripcion-error/?motivo=email', request.url), 303);
  }

  if (!env.BUTTONDOWN_API_KEY) {
    // Sin clave configurada (preview local): confirmar el flujo sin alta real.
    return Response.redirect(new URL('/gracias-suscripcion/', request.url), 303);
  }

  const res = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      tags: [segmento, `lengua:${lengua}`],
      metadata: { lengua },
    }),
  });

  // 201 creado · 400 con "already exists" también cuenta como éxito para el usuario.
  if (res.ok || res.status === 400) {
    return Response.redirect(new URL('/gracias-suscripcion/', request.url), 303);
  }
  return Response.redirect(new URL('/suscripcion-error/?motivo=servicio', request.url), 303);
}
