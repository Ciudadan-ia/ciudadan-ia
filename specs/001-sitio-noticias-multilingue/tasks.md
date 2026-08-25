# Tasks: Sitio de noticias multilingüe CIUDADAN-IA

**Input**: Design documents from `/specs/001-sitio-noticias-multilingue/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: no se solicitó TDD; la verificación es por gates de build (`astro check`, schemas
Zod), `npm run verify` (pa11y + presupuesto) y las pruebas de aceptación manuales de cada
historia.

**Organization**: tareas agrupadas por user story (US1 lector general P1, US2 hablante nativo
P2, US3 docente P3, US4 validador P4) para que cada historia sea un incremento entregable.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

**Purpose**: proyecto Astro inicializado con la estructura del plan

- [x] T001 Scaffold del proyecto Astro en `site/` (npm create astro@latest, TypeScript strict, sin integraciones extra) y limpieza del contenido demo
- [x] T002 Configurar `site/astro.config.mjs`: i18n (defaultLocale `es` sin prefijo; locales `en`, `nah`, `yua`), `site`, `astro:assets`, sitemap
- [x] T003 [P] Crear `site/src/i18n/languages.ts` con endónimos (Español, English, Nāhuatlahtōlli, Maaya t'aan), códigos y estado, y `site/src/i18n/ui.ts` con las cadenas de UI en las 4 lenguas
- [x] T004 [P] Descargar Gentium Plus y Noto Sans, generar woff2 subseteadas (rangos de `research.md` D5) en `site/public/fonts/` y documentar el comando en `site/scripts/subset-fonts.mjs`
- [x] T005 [P] Crear `site/src/styles/tokens.css` (paleta cálida contemporánea con modo claro/oscuro vía `prefers-color-scheme`, tipografía, espaciado, `@font-face`) y `site/src/styles/base.css` (reset ligero, foco visible, `tabular-nums`)

---

## Phase 2: Foundational (bloqueante para todas las historias)

**Purpose**: schemas de contenido (gates de la constitución), layout base y contenido semilla

- [x] T006 Crear `site/src/content.config.ts` con las collections `articles`, `pages`, `voices` y TODOS los refinamientos Zod de `contracts/content-schema.md` (crédito obligatorio en `validado`, alt obligatorio, `lang` = nombre de archivo, `consent: true` en voices)
- [x] T007 Crear `site/src/lib/content.ts` con helpers: `getArticleVersions(slug)`, `resolveArticleForLang(slug, lang)` (regla monolingüe/bilingüe/oculto), `getActiveLanguages()` (regla del selector), `getLanguageStats()` (contadores build-time)
- [x] T008 Crear `site/src/layouts/Base.astro`: `<html lang>`, skip link, header con slot de selector, footer con slot de gobernanza, metas SEO/hreflang entre ediciones
- [x] T009 [P] Escribir 6 artículos semilla en español en `site/src/content/articles/{slug}/es.md` (temas: qué-es-un-llm, deepfakes-y-elecciones, ia-y-tu-trabajo, ia-en-el-aula, vigilancia-y-derechos, la-ia-y-tu-lengua) con estructura respuesta corta + capa profunda, titulares de dos tiempos, postura «ni pánico ni humo»
- [x] T010 [P] Escribir las 5 páginas fundacionales en español en `site/src/content/pages/{slug}/es.md`: manifiesto, gobernanza-de-datos («¿quién es dueño de tu voz?» en lenguaje llano), politica-de-ia, transparencia, colabora
- [x] T011 [P] Traducir con IA 2 artículos (la-ia-y-tu-lengua, que-es-un-llm) a `nah.md` y `yua.md` con `status: traducido-ia` y translator "IA — pendiente de validación"; traducir los 6 a `en.md` (status `validado` con el equipo como translator)
- [x] T012 [P] Crear 1 entrada de voz de la semana en `site/src/content/voices/` (con `consent: true`) — puede ser una voz fundadora del proyecto mientras llegan hablantes aliados

**Checkpoint**: `npm run build` pasa; romper adrede un crédito de `validado` debe romper el build.

---

## Phase 3: User Story 1 — Lector general (P1) 🎯 MVP

**Goal**: portada + artículo en dos capas + newsletter, legible sin JS en 2G.

**Independent Test**: una persona sin contexto llega a `/`, lee una respuesta corta en < 2
min, encuentra la capa profunda y se suscribe — con JavaScript deshabilitado.

- [x] T013 [P] [US1] Componente `site/src/components/Hero.astro` (historia dominante: imagen responsive con `astro:assets`, titular dos tiempos, summary)
- [x] T014 [P] [US1] Componentes `site/src/components/FeaturedRail.astro` (2 destacadas + carriles por `topic`) y `site/src/components/AudienceDoors.astro` (3 puertas por audiencia)
- [x] T015 [P] [US1] Componente `site/src/components/NewsletterBlock.astro`: form POST a `/api/suscribir` con promesa explícita («la IA explicada en tu idioma, todos los martes, en 5 minutos»), honeypot `_hp` y timestamp `_t`
- [x] T016 [P] [US1] Componente `site/src/components/Credits.astro` (autor/traductor/narrador/validador con nombre) y `site/src/components/TranslationNotice.astro` (aviso por lengua)
- [x] T017 [US1] Página de artículo `site/src/pages/articulos/[slug].astro`: respuesta corta primero, capa profunda con tiempo de lectura, créditos, artículos relacionados por topic
- [x] T018 [US1] Portada `site/src/pages/index.astro` ensamblando Hero + FeaturedRail + AudienceDoors + NewsletterBlock (+ slots para componentes de US2)
- [x] T019 [US1] Pages Function `site/functions/api/suscribir.js` según `contracts/forms.md` (Buttondown API, anti-spam, redirects 303) + páginas `gracias-suscripcion` y `suscripcion-error`
- [x] T020 [US1] Página 404 `site/src/pages/404.astro` y `site/public/_redirects` base

**Checkpoint**: portada y artículos funcionan sin JS; US1 entregable como MVP.

---

## Phase 4: User Story 2 — Hablante nativo (P2)

**Goal**: ediciones nah/yua/en completas: selector con endónimos, vista bilingüe, audio,
contribución de fricción cero.

**Independent Test**: un hablante cambia a náhuatl en ≤ 3 interacciones, lee un artículo
validado en náhuatl y uno no traducido en vista bilingüe, descarga un audio y envía interés de
contribuir en < 30 s, desde un móvil de gama baja.

- [x] T021 [P] [US2] Componente `site/src/components/LanguageSelector.astro`: 3 capas con `<details>` accesible sin JS, endónimos, lenguas activas desde `getActiveLanguages()`, enlace hreflang a la versión equivalente de la página actual
- [x] T022 [P] [US2] Componente `site/src/components/BilingualView.astro`: párrafos en paralelo (grid 2 columnas / alternado en móvil), `lang` correcto por bloque
- [x] T023 [P] [US2] Componentes `site/src/components/AudioPlayer.astro` (`<audio preload="none">` + transcripción en `<details>` + descarga + licencia de retransmisión) y `site/src/components/PrestanosTuVoz.astro` (fallback sin audio)
- [x] T024 [P] [US2] Componentes `site/src/components/LanguageCounters.astro` (desde `getLanguageStats()`) y `site/src/components/VoiceOfTheWeek.astro` (última entrada de `voices`)
- [x] T025 [P] [US2] Componente `site/src/components/ContributeCTA.astro` (primer scroll, enlace a `/contribuye/`)
- [x] T026 [US2] Rutas de edición: `site/src/pages/[lang]/index.astro` (portada por lengua), `site/src/pages/[lang]/articulos/[slug].astro` (regla monolingüe/bilingüe de `data-model.md`), `site/src/pages/ediciones.astro` (índice de ediciones)
- [x] T027 [US2] Página `site/src/pages/contribuye.astro` (formulario 5 campos con consentimiento en lenguaje llano junto al checkbox) + Pages Function `site/functions/api/contribuir.js` (KV, anti-spam, 303) + página `gracias-contribucion`
- [x] T028 [US2] Detección de idioma: banner de corrección de un clic basado en `Accept-Language` (HTML estático por edición + JS de mejora progresiva mínimo con persistencia en localStorage) en `Base.astro`
- [x] T029 [US2] Integrar LanguageSelector, LanguageCounters, VoiceOfTheWeek, ContributeCTA y AudioPlayer en portada y artículo; grabar o conseguir 1 audio real de prueba en `site/public/audio/`
- [x] T030 [US2] QA tipográfico: página interna `site/src/pages/qa-tipografia.astro` (excluida del sitemap) con saltillo U+A78B/C, glotal ʔ, diacríticos apilados en Gentium/Noto; verificar renderizado

**Checkpoint**: las 4 ediciones navegables; ninguna lengua vacía; vista bilingüe operativa.

---

## Phase 5: User Story 3 — Docente (P3)

**Goal**: puerta docente con contenido por tema + ruta lite imprimible.

**Independent Test**: un docente llega por la puerta «para docentes», filtra por tema y
obtiene la versión de solo texto de un artículo apta para imprimir.

- [x] T031 [US3] Página `site/src/pages/docentes.astro` (y `[lang]/docentes.astro`): artículos con `audience: docentes` agrupados por topic con respuesta corta visible; segmento `docentes` preseleccionado en NewsletterBlock
- [x] T032 [P] [US3] Layout `site/src/layouts/Lite.astro` (una columna, system fonts, sin imágenes, CSS inline mínimo, estilos de impresión)
- [x] T033 [US3] Rutas lite: `site/src/pages/lite/index.astro`, `site/src/pages/lite/articulos/[slug].astro`, `site/src/pages/lite/[lang]/articulos/[slug].astro`; enlace «versión ligera» en el footer de cada artículo

**Checkpoint**: /lite/ < 50 KB por página; imprimible.

---

## Phase 6: User Story 4 — Validador institucional (P4)

**Goal**: estados y créditos de validación visibles de punta a punta.

**Independent Test**: un artículo `traducido-ia` muestra su aviso; al pasar a `validado` (con
créditos), el aviso desaparece y el crédito aparece — todo vía frontmatter, sin tocar código.

- [x] T034 [US4] Guía editorial `docs/flujo-validacion.md`: cómo un validador recibe el enlace, usa la vista bilingüe, y cómo el equipo aplica cambios y actualiza frontmatter (translator/validator/status)
- [x] T035 [US4] Promover 1 artículo de prueba a `validado` en nah (con validador ficticio marcado como ejemplo) para verificar el flujo completo y el gate Zod; revertir a `traducido-ia` antes del deploy real
- [x] T036 [US4] Sección «equipo validador» en la fundacional `colabora` enlazando el flujo y el contacto institucional

**Checkpoint**: ciclo borrador → traducido-ia → validado demostrable solo con frontmatter.

---

## Phase 7: Polish & Cross-Cutting

**Purpose**: PWA, gobernanza en footer, verificación y presupuesto.

- [x] T037 [P] Componente `site/src/components/GovernanceFooter.astro`: fundacionales, licencias (CC-BY contenido / comunitaria para voz), «versión ligera», integrado en `Base.astro`
- [x] T038 [P] PWA: `site/public/manifest.webmanifest` + íconos maskable + `site/src/sw.js` (network-first con fallback a caché para páginas, cache-first para assets, aviso de copia guardada) + registro con JS de mejora progresiva + página `site/src/pages/offline.astro`
- [x] T039 [P] Script `site/scripts/check-budget.mjs` (portada < 300 KB, lite < 50 KB, falla con exit 1) y configuración `site/.pa11yci` (portada, artículo es/nah bilingüe, /lite/, fundacionales)
- [x] T040 Añadir `npm run verify` (pa11y-ci + check-budget) a `site/package.json` y corregir todo hallazgo AA hasta cero errores
- [x] T041 Ejecutar `quickstart.md` completo: build, verify, preview sin JS, prueba 3G throttling, QA tipográfico — registrar resultados en `specs/001-sitio-noticias-multilingue/verification.md`
- [x] T042 Actualizar `docs/roadmap.md` con el post-MVP (plataforma de voz, alianzas, video corto, expansión Andes/Cono Sur/Brasil, dossier de grants)

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: setup antes de schemas/contenido.
- **Phase 2 bloquea todas las historias** (schemas + layout + contenido semilla).
- **US1 (Phase 3)**: solo depende de Phase 2 → **es el MVP**.
- **US2 (Phase 4)**: depende de Phase 2; se integra sobre la portada de US1 (T029 depende de T018).
- **US3 (Phase 5)**: depende de Phase 2; T031 reusa NewsletterBlock (T015).
- **US4 (Phase 6)**: solo depende de Phase 2 (los componentes de aviso/crédito se crean en US1-T016).
- **Phase 7**: al final; T038-T041 requieren el sitio completo.

```text
Setup (T001-T005)
  └─▶ Foundational (T006-T012)
        ├─▶ US1 (T013-T020) 🎯 MVP
        │     └─▶ US2 (T021-T030)
        │           └─▶ US3 (T031-T033)   # solo por reuso de layout; puede ir en paralelo a US2 salvo T031
        └─▶ US4 (T034-T036)               # documental, paralelo a US2/US3
              └─▶ Polish (T037-T042)
```

### Parallel opportunities

- Phase 1: T003, T004, T005 en paralelo tras T001-T002.
- Phase 2: T009, T010, T011, T012 en paralelo tras T006.
- US1: T013-T016 en paralelo; luego T017-T018.
- US2: T021-T025 en paralelo; luego T026-T030.
- Polish: T037-T039 en paralelo.

## Implementation Strategy

MVP = Phases 1-3 (US1): medio funcional en español con newsletter. Incremento 2 = US2 (el
diferenciador: ediciones indígenas + audio + contribución). Incremento 3 = US3 + US4 + Polish.
Total: **42 tareas** (US1: 8 · US2: 10 · US3: 3 · US4: 3 · setup/foundational: 12 · polish: 6).
