# Data Model — Sitio de noticias multilingüe CIUDADAN-IA

Todo el contenido vive en content collections de Astro (Markdown + frontmatter validado con
Zod en `site/src/content.config.ts`). No hay base de datos; los formularios escriben en
Cloudflare KV / Buttondown (ver `contracts/forms.md`).

## Collection: `articles`

Ruta: `src/content/articles/{slug}/{lang}.md` — la carpeta agrupa las versiones de un mismo
artículo; el nombre de archivo es el código de lengua.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `title` | string | Titular de dos tiempos; requerido |
| `lang` | `'es' \| 'en' \| 'nah' \| 'yua'` | Debe coincidir con el nombre del archivo |
| `status` | `'borrador' \| 'traducido-ia' \| 'validado'` | `es` siempre nace `validado` (es el original) |
| `summary` | string | Respuesta corta (< 2 min de lectura); requerido |
| `topic` | enum: `derechos`, `trabajo`, `educacion`, `lengua-cultura`, `tecnologia`, `seguridad` | Carriles temáticos de portada |
| `audience` | array de `general`, `docentes`, `comunidades` | Puertas de entrada; default `['general']` |
| `image` | objeto `{ src, alt }` opcional | `alt` obligatorio si hay `src` |
| `readingTime` | number (min, capa profunda) | Calculable en build; frontmatter lo puede fijar |
| `publishDate` | date | Requerido |
| `author` | string | Requerido siempre (crédito nominal) |
| `translator` | string | **Obligatorio si `status='validado'` y `lang≠'es'`** |
| `validator` | string | **Obligatorio si `status='validado'` y `lang≠'es'`** |
| `narrator` | string opcional | Presente si hay audio narrado |
| `audio` | objeto opcional `{ src, durationSec, transcriptInBody }` | `src` bajo `/audio/{lang}/`; si falta → CTA «préstanos tu voz» |
| `featured` | `'dominante' \| 'destacada'` opcional | Máx. 1 dominante y 2 destacadas por build (validado en portada) |

**Cuerpo del Markdown**: la capa profunda. Un separador `<!--more-->` no es necesario porque
`summary` vive en frontmatter.

**Regla de vista bilingüe (FR-005/FR-009)**: al pedir `/{lang}/articulos/{slug}`:

1. Existe `{lang}.md` con `status='validado'` → render monolingüe con créditos.
2. Existe `{lang}.md` con `status='traducido-ia'` → render bilingüe en paralelo ({lang} + es) con `TranslationNotice`.
3. No existe `{lang}.md` → la pieza no se lista en la edición {lang} (no hay 404 desde listados).

**Regla del selector (FR-005)**: una lengua aparece en el selector si tiene ≥ 1 artículo con
`status ≠ 'borrador'`.

## Collection: `pages` (fundacionales)

Ruta: `src/content/pages/{slug}/{lang}.md` con `slug ∈ {manifiesto, gobernanza-de-datos,
politica-de-ia, transparencia, colabora}`.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `title` | string | Requerido |
| `lang` | enum de lenguas | Requerido |
| `status` | mismo enum que articles | Aviso si `traducido-ia` |
| `updated` | date | Mostrada en página (transparencia) |

Las 5 fundacionales DEBEN existir al menos en `es` (verificado en build).

## Collection: `voices` (voz de la semana)

Ruta: `src/content/voices/{yyyy-ww}.md`.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `name` | string | Nombre público de la persona hablante |
| `territory` | string | Pueblo/región (autodescrito) |
| `lang` | código de su lengua | Para `lang` del bloque de cita |
| `quote` | string | Cita en su lengua |
| `quoteEs` | string | Traducción al español |
| `audio` | objeto opcional | Igual que articles |
| `week` | string `yyyy-ww` | La portada toma la más reciente |
| `consent` | literal `true` | **El build falla si falta** (principio I) |

## Datos derivados (build-time)

- **`languageStats`**: por lengua — nº artículos publicados, nº audios, nº colaboradores
  únicos (unión de author/translator/narrator/validator). Alimenta `LanguageCounters`.
- **`editions`**: lenguas activas (regla del selector) con endónimo desde `i18n/languages.ts`.

## Datos capturados fuera del repo

| Entidad | Dónde vive | Campos | Retención |
| --- | --- | --- | --- |
| Suscripción | Buttondown | email, segmento (`general`/`docentes`), lengua preferida | Gestionada por el suscriptor (double opt-in, baja en 1 clic) |
| Interés de contribución | Cloudflare KV | nombre/seudónimo, contacto, lengua, tipo de aporte, texto libre, timestamp, consentimiento (bool) | Revisión manual; se elimina al procesar |

## Estados y transiciones (Traducción)

```text
borrador ──(IA traduce)──▶ traducido-ia ──(validador aprueba, se añaden créditos)──▶ validado
   ▲                            │
   └────(rechazo/retrabajo)◀────┘
```

- `borrador`: no se publica ni cuenta para el selector.
- `traducido-ia`: se publica SOLO en vista bilingüe con aviso.
- `validado`: monolingüe, créditos completos obligatorios (gate Zod).
