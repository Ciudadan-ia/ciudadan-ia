# Quickstart — Sitio CIUDADAN-IA

## Requisitos

- Node.js 20+
- (Opcional, para formularios en local) `wrangler` de Cloudflare

## Desarrollo

```bash
cd site
npm install
npm run dev        # http://localhost:4321
```

## Verificación (gate pre-deploy)

```bash
npm run build      # astro check + astro build (los schemas Zod son el primer gate)
npm run verify     # pa11y-ci (WCAG 2.2 AA) + check-budget (portada <300KB, lite <50KB)
npm run preview    # revisar manualmente: /, /nah/, /yua/, /en/, un artículo, /lite/, /ediciones/
```

Prueba manual sin JS: DevTools → Settings → Debugger → Disable JavaScript → recargar portada
y un artículo: todo el contenido debe ser legible.

## Contenido

- Nuevo artículo: crear `site/src/content/articles/{slug}/es.md` (ver
  `contracts/content-schema.md`). Traducciones: `nah.md`, `yua.md`, `en.md` en la misma
  carpeta con su `status` correcto.
- Pasar a `validado`: añadir `translator` y `validator` con nombre — sin ellos el build falla.
- Audio: colocar `public/audio/{lang}/{slug}.ogg` (Opus ~24 kbps mono:
  `ffmpeg -i in.wav -c:a libopus -b:a 24k -ac 1 out.ogg`) y declarar `audio:` en frontmatter.

## Deploy (Cloudflare Pages)

- Build command: `npm run build` · Output: `site/dist` · Root: `site/`
- Variables: `BUTTONDOWN_API_KEY` (newsletter); KV binding `CONTRIB` (contribuciones).
- Los redirects viven en `site/public/_redirects`.
