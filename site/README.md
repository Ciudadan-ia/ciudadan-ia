# CIUDADAN-IA — sitio de noticias

Sitio estático (Astro 7) en 4 ediciones: español (default), English, Nāhuatlahtōlli (nah),
Maaya t'aan (yua). Ver el README raíz y `specs/001-sitio-noticias-multilingue/` para el
contexto completo.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (localhost:4321) |
| `npm run build` | `astro check` + build a `dist/` — los schemas Zod hacen cumplir la constitución |
| `npm run verify` | pa11y (WCAG 2.2 AA, 13 páginas) + presupuesto de peso (portada <300 KB, lite <50 KB) |
| `npm run preview` | Sirve `dist/` local |

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
