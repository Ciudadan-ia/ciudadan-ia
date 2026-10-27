import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as subscribe } from '../functions/api/suscribir.js';
import { onRequestPost as contribute } from '../functions/api/contribuir.js';

const origin = 'https://ciudadania.example';
const signup = { email: 'prueba@example.invalid', segmento: 'general', lengua: 'es' };
const collaboration = { nombre: 'Caso ficticio', contacto: 'prueba@example.invalid', lengua: 'es',
  aporte: 'correccion', consentimiento: 'si', pagina_lengua: 'es' };
const request = (fields) => new Request(`${origin}/api/prueba`, {
  method: 'POST', body: new URLSearchParams(fields),
});
const location = (response) => new URL(response.headers.get('location')).pathname;

for (const [name, handler] of [['suscripción', subscribe], ['colaboración', contribute]]) {
  test(`${name}: cerrado por defecto sin leer datos ni usar servicios`, async () => {
    let parsed = false;
    const response = await handler({ env: {}, request: { url: origin,
      formData() { parsed = true; throw new Error('No debe leer datos'); } } });
    assert.equal(response.status, 303);
    assert.equal(location(response), '/participacion-pendiente/');
    assert.equal(parsed, false);
  });
  test(`${name}: una bandera sin proveedor no confirma recepción`, async () => {
    const response = await handler({ env: { FORMS_ENABLED: 'true' }, request: request({}) });
    assert.equal(location(response), '/participacion-pendiente/');
  });
}

test('suscripción: solo una respuesta positiva del proveedor confirma alta', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(JSON.parse(options.body).email_address, signup.email);
    return new Response('{}', { status: 201 });
  });
  const response = await subscribe({ request: request(signup),
    env: { FORMS_ENABLED: 'true', BUTTONDOWN_API_KEY: 'clave-ficticia' } });
  assert.equal(location(response), '/gracias-suscripcion/');
  assert.equal(mock.mock.callCount(), 1);
});

test('suscripción: HTTP 400 no se interpreta como éxito', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 400 }));
  const response = await subscribe({ request: request(signup),
    env: { FORMS_ENABLED: 'true', BUTTONDOWN_API_KEY: 'clave-ficticia' } });
  assert.equal(location(response), '/suscripcion-error/');
});

test('suscripción: fallo de red no confirma el resultado', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Fallo simulado'); });
  const response = await subscribe({ request: request(signup),
    env: { FORMS_ENABLED: 'true', BUTTONDOWN_API_KEY: 'clave-ficticia' } });
  assert.equal(location(response), '/suscripcion-error/');
});

test('suscripción: correo inválido no se transmite', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => { throw new Error('No enviar'); });
  const response = await subscribe({ request: request({ ...signup, email: 'inválido' }),
    env: { FORMS_ENABLED: 'true', BUTTONDOWN_API_KEY: 'clave-ficticia' } });
  assert.equal(location(response), '/suscripcion-error/');
  assert.equal(mock.mock.callCount(), 0);
});

test('colaboración: confirma solo después de guardar el consentimiento', async () => {
  const saved = [];
  const response = await contribute({ request: request(collaboration), env: {
    FORMS_ENABLED: 'true', CONTRIB: { put: async (_key, value) => saved.push(JSON.parse(value)) },
  } });
  assert.equal(location(response), '/gracias-contribucion/');
  assert.equal(saved.length, 1);
  assert.equal(saved[0].consentimiento, true);
});

test('colaboración: sin consentimiento no guarda ni confirma', async () => {
  let saved = false;
  const response = await contribute({ request: request({ ...collaboration, consentimiento: 'no' }),
    env: { FORMS_ENABLED: 'true', CONTRIB: { put: async () => { saved = true; } } } });
  assert.equal(location(response), '/contribuye/');
  assert.equal(saved, false);
});

test('colaboración: fallo de almacenamiento no confirma recepción', async () => {
  const response = await contribute({ request: request(collaboration), env: {
    FORMS_ENABLED: 'true', CONTRIB: { put: async () => { throw new Error('KV simulado'); } },
  } });
  assert.equal(location(response), '/participacion-pendiente/');
});
