# Research — Sitio de noticias multilingüe CIUDADAN-IA

**Fecha**: 2026-08-25. Las decisiones de producto vienen de 4 rondas de preguntas con el
usuario y del benchmark global (`docs/benchmark-global.md`, 50+ sitios verificados). Aquí se
resuelven las decisiones técnicas abiertas del Technical Context.

## D1 — Framework de sitio

- **Decision**: Astro 5, modo SSG puro, i18n por rutas nativo, content collections con Zod.
- **Rationale**: HTML sin JS por defecto (constitución III); el benchmark identificó las SPA
  como el error transversal de la categoría. Collections + Zod permiten forzar en build las
  reglas de la constitución (crédito nominal, estados de traducción). i18n nativo cubre
  `defaultLocale: 'es'` sin prefijo y `/en`, `/nah`, `/yua` con prefijo.
- **Alternatives considered**: Next.js SSG (más JS base, i18n de app router más complejo para
  contenido estático); Eleventy (más ligero aún, pero sin type-safety de contenido ni
  ecosistema de imágenes integrado); Simorgh de BBC (referencia de principios, no reutilizable
  como framework).

## D2 — Códigos de lengua y endónimos

- **Decision**: rutas y atributos `lang` con códigos ISO 639: `es`, `en`, `nah` (náhuatl,
  macrolengua ISO 639-2/3), `yua` (maya yucateco, ISO 639-3). Endónimos en el selector:
  **Español, English, Nāhuatlahtōlli, Maaya t'aan**.
- **Rationale**: `nah` como macrolengua es la etiqueta honesta mientras la redacción siga la
  norma INALI sin comprometerse a una variante; si el piloto se ancla a una variante (p. ej.
  náhuatl de la Huasteca `nhe`), el código se refina en una enmienda. `lang="nah"`/`lang="yua"`
  son válidos para HTML (BCP 47 acepta códigos ISO 639-2/3).
- **Alternatives considered**: `nhi`/`nhe` (variantes específicas — prematuro sin validadores
  confirmados); nombres en español en el selector (viola el patrón endónimos del benchmark).

## D3 — Estructura de contenido multilingüe

- **Decision**: una carpeta por artículo, un archivo por lengua: `articles/{slug}/{lang}.md`,
  unidos por el nombre de la carpeta (= `translationOf` implícito). Schema Zod único con
  `status: 'borrador' | 'traducido-ia' | 'validado'` y refinamiento: si `status === 'validado'`
  y `lang !== 'es'`, `translator` y `validator` son obligatorios (falla el build si faltan).
- **Rationale**: agrupar por artículo hace trivial la vista bilingüe y el cálculo de
  contadores; el refinamiento Zod convierte el principio I de la constitución en un gate
  mecánico.
- **Alternatives considered**: carpeta por lengua (`content/es/...`) — dificulta detectar
  traducciones hermanas; frontmatter con arrays de traducciones — duplica estado.

## D4 — Newsletter y formularios

- **Decision**: MVP con **Buttondown** (free tier) embebido como formulario HTML puro que hace
  POST directo a Buttondown (funciona sin JS); el formulario de contribución como **Cloudflare
  Pages Function** (`functions/api/contribuir.js`) que guarda en KV y responde con página de
  confirmación server-rendered. Anti-spam: honeypot + tiempo mínimo de envío (sin captcha
  visual).
- **Rationale**: cero JS requerido en cliente; Buttondown soporta double opt-in y segmentos
  (etiqueta `docentes`); Pages Functions viven en el mismo deploy (una sola jurisdicción de
  datos, principio I). Captchas visuales dañan accesibilidad (principio IV).
- **Alternatives considered**: Mailchimp (más pesado, marca intrusiva); Worker propio para
  correo (más control pero requiere servicio SMTP — post-MVP); Turnstile de Cloudflare
  (requiere JS; se puede añadir después como capa opcional).

## D5 — Tipografía y subseteo

- **Decision**: **Gentium Plus** (cuerpo, 400/700/itálica) + **Noto Sans** (UI/titulares,
  400/500/700), autoalojadas en woff2, subseteadas con `pyftsubset` (script
  `scripts/subset-fonts.mjs` documenta el comando) a: Latin básico + Latin-1 + Latin Extended
  A/B + saltillo U+A78B–A78C + glotal U+0294 + combining diacritics U+0300–036F + comillas y
  rayas tipográficas. `font-display: swap` y fallback stack declarado.
- **Rationale**: Gentium Plus es la recomendación explícita del benchmark (SIL, OFL, cobertura
  total de lenguas americanas); el subseteo mantiene el presupuesto de peso (~30-45 KB por
  peso vs >300 KB sin subsetear).
- **Alternatives considered**: Charis SIL (equivalente; Gentium gana por textura editorial);
  Google Fonts CDN (viola autoalojamiento/jurisdicción y añade DNS extra en 2G).

## D6 — Audio

- **Decision**: archivos **Opus en contenedor `.ogg` (~24 kbps mono)** en `public/audio/{lang}/`,
  servidos con `<audio controls preload="none">` + transcripción en `<details>` + enlace de
  descarga con atributo `download` + nota de licencia de retransmisión. En el MVP los
  artículos sin narración muestran `PrestanosTuVoz`.
- **Rationale**: Opus a 24 kbps hace ~1 MB por 5 minutos (viable en 2G y por WhatsApp);
  `preload="none"` no gasta datos hasta que el usuario decide; `<audio>` nativo es accesible
  sin JS.
- **Alternatives considered**: MP3 128 kbps (5× el peso); players JS (Plyr etc. — violan
  mejora progresiva); TTS sintético al lanzamiento (descartado: constitución VI exige marcarlo
  y el CTA de voz genera comunidad).

## D7 — PWA / offline

- **Decision**: service worker propio (~60 líneas, sin Workbox): precache del shell mínimo
  (offline.html, CSS, fuentes), estrategia **network-first con fallback a caché** para páginas
  visitadas, cache-first para fuentes/CSS. Banner "estás viendo una copia guardada" inyectado
  por el SW vía header simulado → en la práctica: página servida desde caché incluye aviso
  mediante JS mínimo del SW scope. `manifest.webmanifest` con íconos maskable.
- **Rationale**: Workbox añade ~7 KB+ y complejidad innecesaria para 2 estrategias; el SW es
  mejora progresiva pura (constitución III y edge case de la spec).
- **Alternatives considered**: `@vite-pwa/astro` (conveniente pero arrastra Workbox); sin PWA
  (incumple FR-024).

## D8 — Ruta /lite

- **Decision**: rutas espejo `site/src/pages/lite/...` que reutilizan las mismas collections
  con `Lite.astro`: una columna, sin imágenes (solo alt), sin webfonts (system stack), enlaces
  de navegación mínimos. Objetivo < 50 KB por página.
- **Rationale**: patrón text.npr.org del benchmark; misma fuente de contenido = cero deriva
  editorial.
- **Alternatives considered**: query param `?lite=1` (rompe cacheabilidad estática); subdominio
  (complica el MVP).

## D9 — Verificación de accesibilidad y presupuesto

- **Decision**: `pa11y-ci` (WCAG2AA) corriendo contra `dist/` servido localmente
  (portada, 1 artículo por lengua, /lite, fundacionales) + `scripts/check-budget.mjs` que suma
  bytes de HTML+CSS+fuentes+JS inicial de la portada (< 300 KB) y de /lite (< 50 KB). Ambos en
  `npm run verify`, gate manual pre-deploy; se mueven a CI al crear repo remoto.
- **Rationale**: convierte los principios III/IV y SC-004/SC-005 en comandos reproducibles.
- **Alternatives considered**: solo Lighthouse manual (no reproducible como gate).

## D10 — Contadores vivos por lengua

- **Decision**: calculados en **build-time** desde las collections (artículos, audios,
  colaboradores únicos por lengua). "Vivos" = se actualizan con cada publicación (cada build).
- **Rationale**: el sitio es estático y publica por build; contadores en runtime requerirían
  backend sin beneficio real en el MVP.
- **Alternatives considered**: API + JS en cliente (viola cero-JS para contenido informativo).

## D11 — Analítica

- **Decision**: **sin analítica en el MVP** (o Cloudflare Web Analytics server-side si el
  usuario la activa desde el dashboard — sin cookies, sin script). Matomo autoalojado queda
  para post-MVP.
- **Rationale**: coherencia de soberanía de datos (principio I); el benchmark señaló la
  contradicción de medios indígenas usando Google Analytics.
- **Alternatives considered**: GA4 (descartado por principio I); Plausible cloud (jurisdicción
  UE aceptable pero costo innecesario en MVP).
