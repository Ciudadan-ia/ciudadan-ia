/**
 * POST /api/contribuir — interés de contribución (contracts/forms.md).
 * Guarda en KV (binding CONTRIB) para revisión manual del equipo.
 * Consentimiento explícito obligatorio (constitución I).
 */

const MIN_MS = 3000;
const MAX = { nombre: 120, contacto: 160, lengua: 80, mensaje: 2000 };

export async function onRequestPost({ request, env }) {
  if (env.FORMS_ENABLED !== 'true' || !env.CONTRIB) {
    return Response.redirect(new URL('/participacion-pendiente/', request.url), 303);
  }
  const form = await request.formData();
  const hp = String(form.get('_hp') || '');
  const t = Number(form.get('_t') || 0);

  if (hp !== '' || (t > 0 && Date.now() - t < MIN_MS)) {
    return new Response('OK', { status: 200 });
  }

  const nombre = String(form.get('nombre') || '').trim().slice(0, MAX.nombre);
  const contacto = String(form.get('contacto') || '').trim().slice(0, MAX.contacto);
  const lengua = String(form.get('lengua') || '').trim().slice(0, MAX.lengua);
  const aporte = String(form.get('aporte') || '');
  const mensaje = String(form.get('mensaje') || '').trim().slice(0, MAX.mensaje);
  const consentimiento = form.get('consentimiento') === 'si';
  const paginaLenguaInput = String(form.get('pagina_lengua') || 'es');
  const paginaLengua = ['es', 'en', 'nah', 'yua'].includes(paginaLenguaInput) ? paginaLenguaInput : 'es';

  const valido =
    nombre.length > 0 &&
    contacto.length > 2 &&
    lengua.length > 0 &&
    ['voz', 'correccion', 'historia'].includes(aporte) &&
    consentimiento;

  if (!valido) {
    return Response.redirect(new URL(`/${paginaLengua === 'es' ? '' : paginaLengua + '/'}contribuye/?error=1`, request.url), 303);
  }

  try {
    const key = `contrib:${new Date().toISOString()}:${crypto.randomUUID()}`;
    await env.CONTRIB.put(
      key,
      JSON.stringify({ nombre, contacto, lengua, aporte, mensaje, paginaLengua, consentimiento, ts: Date.now() }),
    );
  } catch {
    return Response.redirect(new URL('/participacion-pendiente/', request.url), 303);
  }

  return Response.redirect(new URL('/gracias-contribucion/', request.url), 303);
}
