<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: n/a (adopción inicial — 7 principios definidos desde el template vacío)
- Added sections:
  - Core Principles (I–VII)
  - Restricciones técnicas
  - Flujo editorial y de publicación
  - Governance
- Removed sections: ninguna (los slots genéricos del template fueron reemplazados)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check genérico — compatible, evalúa contra estos principios)
  - ✅ .specify/templates/spec-template.md (sin referencias a principios específicos — compatible)
  - ✅ .specify/templates/tasks-template.md (sin referencias a principios específicos — compatible)
- Follow-up TODOs: ninguno
-->

# Constitución de CIUDADAN-IA

CIUDADAN-IA es un proyecto sin fines de lucro con dos partes: (1) un medio de divulgación
científica sobre inteligencia artificial — sus beneficios y peligros posibles — publicado en
español, inglés y lenguas indígenas de América Latina (piloto: náhuatl `nah` y maya yucateco
`yua`); (2) una tecnología comunitaria de recolección de voz para que la IA aprenda lenguas
que aún no están en ningún traductor. Esta constitución rige todas las decisiones de producto,
diseño, contenido y código.

## Core Principles

### I. Soberanía de datos indígenas (NO NEGOCIABLE)

El beneficio fluye de vuelta a la fuente. Toda contribución de una persona hablante (voz,
texto, traducción, validación) DEBE tener consentimiento visible y explicable en el punto de
captura — nunca enterrado en términos legales. Todo contenido DEBE llevar crédito nominal a
autor, traductor, narrador y validador. Los datos de voz y corpus NUNCA se licencian bajo
esquemas que permitan extracción sin retorno (anti-modelo: CC0 puro); se usa CC-BY para
divulgación y una licencia comunitaria (modelo Kaitiakitanga de Te Hiku Media) para datos de
voz. La analítica del sitio DEBE ser autoalojada o respetuosa de la jurisdicción de los datos.

**Racional**: los proyectos que extraen datos de comunidades indígenas sin retorno destruyen
la confianza que este proyecto necesita para existir; la gobernanza es el diferenciador.

### II. Ninguna lengua anunciada sin contenido

PROHIBIDO listar una lengua en el selector, la navegación o la comunicación pública sin flujo
editorial comprometido en esa lengua. Cuando una lengua tiene poco contenido, el fallback
OBLIGATORIO es la vista bilingüe en paralelo (lengua indígena + español), que además genera
corpus alineado. Una portada vacía en una lengua es un bug de nivel release-blocker.

**Racional**: el multilingüismo declarativo (selector con lenguas vacías) comunica que la
lengua es decorativa y destruye credibilidad con la audiencia núcleo.

### III. Low-bandwidth primero

Cero SPA: todo contenido DEBE llegar como HTML servido (SSG/SSR) y ser legible sin JavaScript.
El sitio DEBE ofrecer una ruta `/lite` de solo texto generada de la misma base de contenido, y
funcionar como PWA con cache offline de artículos leídos. Presupuesto de rendimiento: portada
< 300 KB en primera carga, imágenes en variantes responsive (webp/avif), fuentes subseteadas
en woff2, audio en Opus ~24 kbps descargable. Objetivo verificable: Lighthouse móvil
(throttling 3G) ≥ 90 en performance.

**Racional**: la audiencia núcleo incluye zonas rurales con conectividad 2G/3G y equipos de
gama baja; la ligereza técnica es inclusión, alcance y ventaja competitiva a la vez.

### IV. Accesibilidad WCAG 2.2 AA como requisito de publicación

Ninguna página se publica sin cumplir WCAG 2.2 AA: contraste, jerarquía de encabezados, skip
links, foco visible, alt-text obligatorio en el flujo editorial. Cada bloque de texto en otra
lengua DEBE llevar su atributo `lang` correcto (`lang="nah"`, `lang="yua"`, `lang="en"`) —
WCAG 3.1.2. La verificación DEBE automatizarse en CI (axe/pa11y) en cuanto exista repositorio
remoto; mientras tanto, se corre localmente antes de cada deploy.

**Racional**: `lang` correcto sirve simultáneamente a lectores de pantalla, SEO y la calidad
del corpus; la accesibilidad no es una capa posterior sino condición de publicación.

### V. Postura editorial «ni pánico ni humo»

La cobertura de IA DEBE ser científicamente rigurosa y sin sensacionalismo: ni catastrofismo
ni promoción acrítica. Titulares nombran la consecuencia humana, no la técnica. Los riesgos se
explican con analogías cotidianas, no con alarmas. El contenido se estructura en unidades
cortas y traducibles (pregunta corta + capa profunda opcional, con tiempo de lectura
indicado). Todo contenido generado o traducido por IA DEBE estar marcado como tal hasta ser
validado por una persona hablante, con el estado visible (`borrador → traducido-IA →
validado`).

**Racional**: la credibilidad es el activo central de un medio de divulgación; las unidades
cortas son lo que hace viable la traducción a lenguas con pocos validadores.

### VI. Audio como formato primario

Todo artículo DEBE contemplar versión en audio (narrada por hablantes; TTS provisional
claramente marcado o CTA «préstanos tu voz» mientras no haya narrador). Todo audio DEBE
publicarse con transcripción (accesibilidad + SEO + corpus), botón de descarga en formato
comprimido, indexación por lengua y licencia de retransmisión para radios comunitarias. El
player DEBE ser accesible por teclado y lector de pantalla.

**Racional**: para las audiencias indígenas el audio es el formato primario (tradición oral,
alfabetización desigual en la lengua escrita) y WhatsApp/radio son la última milla.

### VII. Gobernanza como contenido público

Las páginas fundacionales — manifiesto, «¿quién es dueño de tu voz?» (gobernanza de datos en
lenguaje llano), política propia de uso de IA y transparencia de financiamiento — son parte
del producto desde el primer release, enlazadas desde el footer de toda página. Se escriben en
lenguaje llano, no legal, y se traducen con la misma prioridad que el contenido editorial.

**Racional**: en los referentes estudiados (Papa Reo, Amazônia Real, Masakhane) la gobernanza
publicada es el principal argumento de confianza y captación de aliados y financiadores.

## Restricciones técnicas

- **Stack**: Astro (SSG) con i18n nativo y content collections en Markdown; hosting en
  Cloudflare Pages. Cualquier excepción DEBE justificarse contra el Principio III.
- **Rutas de idioma**: `/` (español, default), `/en`, `/nah`, `/yua`, con página índice de
  ediciones. Selector de lenguas prominente en header, con endónimos y nunca banderas.
- **Tipografía**: Gentium Plus o Charis SIL (cuerpo) + Noto Sans (UI), autoalojadas y
  subseteadas. QA obligatorio de saltillo (U+A78B/U+A78C), oclusiva glotal (ʔ) y diacríticos
  apilados en dispositivos Android de gama baja.
- **Contenido**: frontmatter con `lang`, `translationOf`, `status`, `author`, `translator`,
  `narrator`, `validator`, `audio`. El build DEBE fallar si falta crédito nominal en contenido
  con estado `validado`.

## Flujo editorial y de publicación

1. El equipo editorial escribe en español (unidad corta + capa profunda).
2. La IA traduce a las lenguas del piloto; el estado queda `traducido-IA` y se muestra el
   aviso «traducción pendiente de validación».
3. Personas validadoras nativas (vía alianzas institucionales) aprueban; el estado pasa a
   `validado` y su crédito nominal aparece en la pieza.
4. Audio: narración por hablante cuando exista; mientras tanto aplica el Principio VI.
5. Antes de publicar: checklist WCAG 2.2 AA + presupuesto de rendimiento + `lang` por bloque.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Toda spec, plan y PR
DEBE verificarse contra los siete principios; una violación al Principio I o II bloquea el
release sin excepción. Las enmiendas se proponen por escrito (issue o cambio en este archivo),
documentan su justificación y actualizan la versión según semver: MAJOR para remociones o
redefiniciones incompatibles de principios, MINOR para principios o secciones nuevas, PATCH
para clarificaciones. La revisión de cumplimiento ocurre en cada `/speckit-plan` (Constitution
Check) y antes de cada deploy.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
