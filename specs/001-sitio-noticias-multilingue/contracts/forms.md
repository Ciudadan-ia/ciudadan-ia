# Contrato: formularios (Pages Functions)

Ambos formularios funcionan como `<form method="post">` HTML puro — sin JS requerido. Las
respuestas son páginas HTML server-rendered (no JSON) para el flujo sin JS; si el header
`Accept: application/json` está presente, responden JSON (mejora progresiva futura).

## POST `/api/suscribir`

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `email` | string | Requerido, formato email |
| `segmento` | `general` \| `docentes` | Default `general` |
| `lengua` | `es` \| `en` \| `nah` \| `yua` | Default: lengua de la página origen |
| `_hp` | string honeypot | DEBE llegar vacío |
| `_t` | timestamp render del form | Rechazar si < 3 s al enviar |

**Efecto**: alta en Buttondown vía API (tag = segmento, metadato = lengua). Double opt-in lo
gestiona Buttondown.

**Respuestas**: `303 → /gracias-suscripcion/` (ok) · `303 → /suscripcion-error/?motivo=…`
(email inválido) · `200` silencioso sin efecto (spam detectado — no revelar detección).

## POST `/api/contribuir`

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `nombre` | string | Requerido (nombre o seudónimo) |
| `contacto` | string | Requerido (email o teléfono) |
| `lengua` | string | Requerido (código o texto libre — puede ser una lengua que no cubrimos aún) |
| `aporte` | `voz` \| `correccion` \| `historia` | Requerido |
| `mensaje` | string ≤ 2000 | Opcional |
| `consentimiento` | checkbox | **Requerido**; el texto llano del consentimiento vive junto al checkbox (FR-018) |
| `_hp`, `_t` | anti-spam | Igual que arriba |

**Efecto**: `KV.put("contrib:{ts}:{uuid}", json)` para revisión manual del equipo.

**Respuestas**: `303 → /gracias-contribucion/` (página con qué sigue y cuándo) · `303` de
vuelta al form con errores nombrados en lenguaje llano · `200` silencioso (spam).

**SC-006**: el flujo completo (clic en CTA → formulario → confirmación) debe ser completable
en < 30 s: el formulario pide solo los 5 campos de arriba, sin cuenta.
