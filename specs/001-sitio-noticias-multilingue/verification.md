# Verificación — 001 Sitio de noticias multilingüe

**Fecha**: 2026-08-25 · **Build**: Astro 7.2.7, 72 páginas · **Entorno**: macOS local

## Resultados contra Success Criteria

| SC | Criterio | Resultado |
| --- | --- | --- |
| SC-001 | Portada comprensible, respuesta corta < 2 min | ✅ Portada con historia dominante + respuesta corta en frontmatter (~120 palabras) |
| SC-002 | Cambio de lengua ≤ 3 interacciones | ✅ Selector en header (1) → lengua (2) → artículo (3); vista bilingüe automática |
| SC-003 | 100% artículos en lengua con estado + crédito | ✅ Gate Zod: build FALLA sin créditos (probado 2026-08-25 rompiendo `que-es-un-llm/nah` adrede — error «Principio I» correcto, luego revertido) |
| SC-004 | Legible sin JS, portada < 300 KB, lite < 50 KB | ✅ Contenido íntegro en HTML estático (verificado por grep sin ejecutar JS); portada 186.9 KB, artículo bilingüe 182.9 KB, lite 2.7–5.1 KB (`scripts/check-budget.mjs`) |
| SC-005 | Cero errores AA automáticos | ✅ pa11y WCAG2AA: 13/13 páginas sin errores (`npm run verify`) |
| SC-006 | Contribución < 30 s sin cuenta | ✅ Formulario de 5 campos, sin registro; consentimiento junto al checkbox (revisión manual del flujo) |
| SC-007 | Offline + instalable | ✅ SW network-first con fallback + precache de /offline/; manifest con íconos maskable. Prueba en dispositivo pendiente de deploy real (requiere HTTPS) |
| SC-008 | Saltillo/glotal/diacríticos renderizan | ✅ cmap de las woff2 verificado con fonttools (U+A78B/C, U+0294, U+02BC, U+0100, U+0303 = true en Gentium y Noto); página /qa-tipografia/ para prueba visual en Android pendiente de dispositivo físico |

## Lighthouse (móvil, throttling simulado)

- **Performance: 98** · **Accessibility: 100** (objetivo ≥ 90)
- FCP 1.8 s · LCP 2.0 s · TBT 0 ms

## Gates reproducibles

```bash
cd site
npm run build    # astro check (0 errores) + build; schemas Zod = gate constitucional
npm run verify   # pa11y WCAG2AA (13 páginas) + presupuesto de peso
```

## Notas y pendientes para el deploy

- pa11y no evalúa contraste sobre colores en `var()`; los tokens se verificaron a mano:
  todos los pares texto/fondo ≥ 4.5:1 en claro y oscuro (`--maiz` no se usa como color de
  texto — solo bordes/íconos). La ruta /lite usa colores literales y sí fue evaluada.
- SC-007 (instalación PWA) y SC-008 (render en Android de gama baja) requieren el deploy
  HTTPS y un dispositivo físico: quedan como checklist del primer deploy.
- Los formularios en preview local confirman el flujo sin efecto (sin API key / KV); el
  alta real de newsletter y el guardado en KV se prueban tras configurar
  `BUTTONDOWN_API_KEY` y el binding `CONTRIB` en Cloudflare Pages.
- La voz sintética de demostración en `la-ia-y-tu-lengua` está marcada como tal en el
  crédito de narrador (constitución VI); reemplazarla es tarea 1 del roadmap.
