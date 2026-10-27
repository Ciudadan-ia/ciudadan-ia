# CIUDADAN-IA — sitio de noticias

Sitio estático (Astro 7) en 4 ediciones: español (default), English, Nāhuatlahtōlli (nah),
Maaya t'aan (yua). Ver el README raíz y `specs/001-sitio-noticias-multilingue/` para el
contexto completo.

## Comandos

Requiere Node **22.23.4 o superior**. `site/.nvmrc` fija la versión usada en CI;
con nvm, ejecutar `nvm use` desde esta carpeta antes de `npm ci`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (localhost:4321) |
| `npm run build` | `astro check` + build a `dist/` — los schemas Zod hacen cumplir la constitución |
| `npm run verify` | pa11y (WCAG2AA, 23 páginas de producción) + enlaces + presupuesto de peso |
| `npm run verify:drafts` | Comprueba presencia/ausencia de borradores y exclusión del sitemap/búsqueda |
| `CIUDADANIA_DRAFT_PREVIEW=1 npm run build:review` | Genera 128 páginas en `dist-review/`, incluidas doce rutas pendientes (completas y ligeras); no es el artefacto de producción |
| `npm run preview` | Sirve `dist/` local |

El build normal genera 116 páginas y excluye los módulos educativos pendientes.
Para verificar el artefacto de revisión, usar
`CIUDADANIA_DRAFT_PREVIEW=1 CIUDADANIA_BUILD_DIRECTORY=dist-review npm run verify:drafts`
y las mismas variables con `npm run verify`. CI conserva ese artefacto por separado y
solo permite desplegar `dist/` desde main. El estado simulado del taller editorial no
autoriza la publicación.

## Contenido

- Artículos: `src/content/articles/{slug}/{lang}.md` — ver `specs/.../contracts/content-schema.md`
- Fundacionales: `src/content/pages/{slug}/{lang}.md`
- Voz de la semana: `src/content/voices/{yyyy-ww}.md` (exige `consent: true`)
- Audio: `public/audio/{lang}/{slug}.ogg` — Opus 24 kbps mono:
  `ffmpeg -i in.wav -c:a libopus -b:a 24k -ac 1 out.ogg`
- Fuentes: `public/fonts/` (subseteadas; regenerar con `scripts/subset-fonts.mjs`)

## Deploy (Cloudflare Pages)

- Root: `site/` · Build: `npm run build` · Output: `dist`
- Variables: `BUTTONDOWN_API_KEY` · KV binding: `CONTRIB`
- Los formularios (`functions/api/`) funcionan como Pages Functions en el mismo deploy.

## Formularios cerrados por defecto

La interfaz solo muestra formularios con `PUBLIC_FORMS_ENABLED=true` al construir. Pages Functions exige `FORMS_ENABLED=true` y el proveedor/binding real antes de leer datos. La habilitación queda pendiente de responsables y privacidad; no basta disponer de claves. `npm run test:forms` usa datos ficticios y servicios simulados, sin envíos externos.
