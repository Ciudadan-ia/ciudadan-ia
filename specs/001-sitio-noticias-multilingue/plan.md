# Implementation Plan: Sitio de noticias multilingüe CIUDADAN-IA

**Branch**: `001-sitio-noticias-multilingue` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-sitio-noticias-multilingue/spec.md`

## Summary

Medio de divulgación científica sobre IA en cuatro ediciones (es/en/nah/yua) construido como
sitio estático Astro con content collections en Markdown: portada de 9 componentes, artículos
en dos capas (respuesta corta + profundidad), estados de traducción con crédito nominal, vista
bilingüe en paralelo, audio con transcripción y descarga, ruta `/lite`, PWA offline, páginas
fundacionales de gobernanza. Deploy en Cloudflare Pages. Cero JavaScript requerido para leer;
JS solo como mejora progresiva (selector con buscador, player enriquecido, service worker).

## Technical Context

**Language/Version**: Node.js 20+ / TypeScript 5 (solo build-time); HTML/CSS servidos, JS
mínimo de mejora progresiva

**Primary Dependencies**: Astro 5 (SSG + i18n por rutas + content collections con Zod),
`@fontsource` no — fuentes subseteadas manualmente (Gentium Plus, Noto Sans) en woff2

**Storage**: Contenido en Markdown/frontmatter dentro del repo (content collections); sin base
de datos. Suscripciones e interés de contribución → servicio externo (Buttondown) o Cloudflare
Worker + KV (decisión en research.md)

**Testing**: `astro check` + `astro build` como gate; validación de esquema de frontmatter con
Zod (falla el build si falta crédito en contenido `validado`); pa11y-ci/axe sobre el build
para WCAG 2.2 AA; presupuesto de peso verificado con script sobre `dist/`

**Target Platform**: Web estática (Cloudflare Pages); navegadores móviles Android de gama baja
como dispositivo de referencia; funcional en 2G y sin JavaScript

**Project Type**: Sitio web estático multilingüe (aplicación de contenido)

**Performance Goals**: Portada < 300 KB primera carga; `/lite` < 50 KB; Lighthouse móvil
(3G throttling) ≥ 90 en performance y accesibilidad

**Constraints**: Legible sin JS (constitución III); WCAG 2.2 AA (constitución IV); `lang` por
bloque; ninguna lengua vacía en el selector (constitución II); crédito nominal obligatorio
(constitución I); audio Opus ~24 kbps con transcripción (constitución VI)

**Scale/Scope**: 4 ediciones de idioma, 5-8 artículos semilla (2+ traducidos a nah/yua), 5
páginas fundacionales, ~12 componentes de UI, 1 service worker, 1 ruta lite por página de
contenido

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principio | Cumplimiento en este plan | Estado |
| --- | --- | --- | --- |
| I | Soberanía de datos indígenas | Crédito nominal en schema Zod (build falla si falta en `validado`); consentimiento en lenguaje llano en el formulario de contribución; sin analítica de terceros en MVP (Cloudflare Web Analytics —sin cookies— o nada hasta decidir Matomo) | ✅ |
| II | Ninguna lengua sin contenido | El selector se genera desde las collections: una lengua solo aparece si tiene ≥1 pieza; vista bilingüe como fallback implementada en la ruta de artículo | ✅ |
| III | Low-bandwidth primero | Astro SSG (HTML puro por defecto); `/lite`; PWA; presupuesto de peso verificado en build; fuentes subseteadas; imágenes responsive con `astro:assets` | ✅ |
| IV | WCAG 2.2 AA | pa11y-ci sobre `dist/` como gate local pre-deploy; `lang` por bloque en componentes bilingües; skip links y foco visible en el layout base | ✅ |
| V | «Ni pánico ni humo» | Estructura de artículo en dos capas forzada por el schema (campos `respuestaCorta` y `cuerpo`); aviso de traducción IA renderizado desde `status` | ✅ |
| VI | Audio primario | Componente `AudioPlayer` (HTML5 `<audio>` + transcripción `<details>` + descarga); fallback `PrestanosTuVoz` cuando no hay audio | ✅ |
| VII | Gobernanza pública | 5 páginas fundacionales como contenido de primera clase, enlazadas en el footer global | ✅ |

**Post-diseño (re-check tras Phase 1)**: sin violaciones; no se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-sitio-noticias-multilingue/
├── plan.md              # Este archivo
├── research.md          # Phase 0 — decisiones técnicas investigadas
├── data-model.md        # Phase 1 — entidades y esquemas de contenido
├── quickstart.md        # Phase 1 — cómo correr y publicar
├── contracts/           # Phase 1 — contratos de contenido y formularios
│   ├── content-schema.md
│   └── forms.md
└── tasks.md             # Phase 2 — /speckit-tasks (no lo crea /speckit-plan)
```

### Source Code (repository root)

```text
site/                          # App Astro (raíz del sitio)
├── astro.config.mjs           # i18n (es default, en/nah/yua), sitemap, assets
├── package.json
├── tsconfig.json
├── public/
│   ├── fonts/                 # GentiumPlus-*.woff2, NotoSans-*.woff2 (subseteadas)
│   ├── audio/                 # narraciones .opus (por lengua: nah/, yua/, es/)
│   ├── manifest.webmanifest
│   └── icons/                 # íconos PWA
├── src/
│   ├── content.config.ts      # collections: articles, pages, voices — schemas Zod
│   ├── content/
│   │   ├── articles/          # {slug}/{lang}.md  (es.md, en.md, nah.md, yua.md)
│   │   ├── pages/             # fundacionales {slug}/{lang}.md
│   │   └── voices/            # voz de la semana {fecha}.md
│   ├── i18n/
│   │   ├── languages.ts       # endónimos, códigos, dirección, estado
│   │   └── ui.ts              # cadenas de UI por lengua
│   ├── layouts/
│   │   ├── Base.astro         # <html lang>, skip link, header, footer, metas
│   │   └── Lite.astro         # layout mínimo para /lite
│   ├── components/
│   │   ├── LanguageSelector.astro   # 3 capas, endónimos; <details> sin JS
│   │   ├── Hero.astro               # historia dominante
│   │   ├── FeaturedRail.astro       # destacadas + carriles
│   │   ├── AudienceDoors.astro      # 3 puertas por audiencia
│   │   ├── LanguageCounters.astro   # contadores vivos (build-time)
│   │   ├── ContributeCTA.astro      # fricción cero
│   │   ├── NewsletterBlock.astro    # promesa + día fijo
│   │   ├── VoiceOfTheWeek.astro
│   │   ├── AudioPlayer.astro        # <audio> + transcripción + descarga
│   │   ├── TranslationNotice.astro  # aviso traducido-IA
│   │   ├── Credits.astro            # crédito nominal
│   │   ├── BilingualView.astro      # vista en paralelo con lang por bloque
│   │   └── GovernanceFooter.astro
│   ├── pages/
│   │   ├── index.astro              # portada es (default)
│   │   ├── [lang]/index.astro       # portadas en/nah/yua
│   │   ├── [lang]/articulos/[slug].astro
│   │   ├── articulos/[slug].astro   # es sin prefijo
│   │   ├── [lang]/[pagina].astro    # fundacionales por lengua
│   │   ├── lite/                    # ruta lite espejo (portada + artículos)
│   │   ├── ediciones.astro          # índice de ediciones
│   │   ├── contribuye.astro         # formulario de interés
│   │   ├── offline.astro            # página offline PWA
│   │   └── 404.astro
│   ├── styles/
│   │   ├── tokens.css               # paleta, tipografía, espaciado, dark mode
│   │   └── base.css
│   └── sw.js                        # service worker (cache-first artículos visitados)
├── scripts/
│   ├── subset-fonts.mjs             # genera woff2 subseteadas (una vez)
│   └── check-budget.mjs             # falla si portada > 300 KB / lite > 50 KB
└── functions/
    └── api/
        ├── suscribir.js             # Pages Function → Buttondown/KV
        └── contribuir.js            # Pages Function → KV + notificación

docs/                         # benchmark-global.md, roadmap.md
```

**Structure Decision**: proyecto único `site/` (Astro) en el repo raíz junto a `docs/` y
`specs/`. No hay backend propio: los dos formularios usan Cloudflare Pages Functions (mismo
deploy), manteniendo un solo proyecto y jurisdicción de datos única. El contenido vive en el
repo (soberanía + versionado + PRs de validadores en el futuro).

## Complexity Tracking

Sin violaciones a la constitución — tabla no requerida.
