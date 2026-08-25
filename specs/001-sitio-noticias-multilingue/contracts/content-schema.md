# Contrato: esquema de contenido (frontmatter)

El contrato entre el equipo editorial y el sitio. Cualquier archivo que lo viole **rompe el
build** — es el mecanismo que convierte la constitución en verificación mecánica.

## Artículo — ejemplo completo (`src/content/articles/ia-y-tu-trabajo/nah.md`)

```yaml
---
title: "In tepoztlahtolmatiliztli huan motequiuh"
lang: nah
status: traducido-ia          # borrador | traducido-ia | validado
summary: >
  Respuesta corta en náhuatl (< 2 min de lectura).
topic: trabajo                # derechos | trabajo | educacion | lengua-cultura | tecnologia | seguridad
audience: [general]
publishDate: 2026-08-25
author: "Nombre Autor"        # SIEMPRE requerido
translator: "IA (Claude) — pendiente de validación"
# validator: se añade al pasar a 'validado' — Zod lo exige entonces
# narrator:  se añade cuando exista narración
# audio: { src: "/audio/nah/ia-y-tu-trabajo.ogg", durationSec: 240 }
image:
  src: "./portada.webp"
  alt: "Descripción accesible de la imagen"   # obligatorio si hay src
---
Cuerpo en Markdown = capa profunda.
```

## Refinamientos Zod (gates de la constitución)

| Regla | Falla el build si… | Principio |
| --- | --- | --- |
| Crédito de validación | `status='validado'` ∧ `lang≠'es'` ∧ (falta `translator` o `validator`) | I |
| Alt obligatorio | `image.src` presente sin `image.alt` | IV |
| Lengua coherente | `lang` ≠ nombre del archivo | II |
| Consentimiento de voz | `voices/*` sin `consent: true` | I |
| Fundacionales completas | falta alguna de las 5 `pages/*/es.md` | VII |
| Featured acotado | >1 `dominante` o >2 `destacada` en artículos publicados | — (portada) |

## Contrato de rutas públicas

| Ruta | Contenido |
| --- | --- |
| `/` | Portada es |
| `/en/`, `/nah/`, `/yua/` | Portadas por edición |
| `/articulos/{slug}/` | Artículo es |
| `/{lang}/articulos/{slug}/` | Artículo en lengua (mono si validado, bilingüe si traducido-ia) |
| `/{slug-fundacional}/` y `/{lang}/{slug}/` | Fundacionales |
| `/ediciones/` | Índice de ediciones |
| `/contribuye/` | Formulario de interés |
| `/lite/` + espejo de artículos | Ruta ligera |
| `/offline/` | Fallback PWA |

Las URLs son estables y enlazables (FR-001); cambiar un slug publicado requiere redirect en
`_redirects` de Cloudflare Pages.
