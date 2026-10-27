# Verificación del arranque V1

Actualización: 27/10/2026. Base inicial `e8a135883fa82681ef325844673f7fff5b6835f0`.
La preparación técnica para revisión no acredita revisión científica ni autoriza publicación editorial.

## Corrección de seguridad

Se actualizó **Astro 7.2.7 → 7.4.2**, con Node mínimo **22.23.4** fijado en
`site/.nvmrc`, `engines` y CI. Se regeneró el lockfile y se aplicaron las correcciones
transitivas compatibles sin usar `--force` ni actualizar versiones mayores de herramientas.

La alerta crítica [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)
afecta al procesamiento de AVIF no confiable por el servicio de imagen Sharp; Astro
7.2.8 introdujo su corrección. La versión elegida también supera las correcciones de
[XSS en JSX/MDX](https://github.com/advisories/GHSA-98hj-9722-w3j8) e
[inyección CSS en transiciones](https://github.com/advisories/GHSA-mpr7-6m5w-76rw).
La [publicación oficial 7.4.2](https://github.com/withastro/astro/releases/tag/astro%407.4.2)
requiere el Node actualizado. No se afirma que el sitio haya sido explotado; se corrigió
la dependencia vulnerable.

| Auditoría npm | Antes | Después |
|---|---:|---:|
| Críticas, árbol completo | 1 | 0 |
| Altas, árbol completo | 19 | 11 |
| Moderadas, árbol completo | 2 | 0 |
| Vulnerabilidades en dependencias de producción (`--omit=dev`) | No se midió por separado | 0 |

Las 11 altas restantes pertenecen a pa11y/Puppeteer y dependencias de herramientas de
prueba. Su actualización mayor se mantiene como seguimiento en #6; no se describen
como resueltas. CI bloquea nuevas críticas en todo el árbol y cualquier vulnerabilidad
en las dependencias de producción. Esto es una fotografía de la auditoría, no una garantía futura.

## Contenidos pendientes fuera de producción

Los seis módulos se trasladaron de `src/pages/` a `src/drafts/`. La integración
`site/draft-routes.mjs` solo los registra con `CIUDADANIA_DRAFT_PREVIEW=1`.
`noindex` se conserva como señal adicional: la barrera de publicación es que sus
rutas y textos no se generan en el build normal.

| Comprobación | Resultado local |
|---|---|
| Compilación normal con Astro actualizado | 115 páginas, sin errores |
| Compilación explícita de revisión | 121 páginas, sin errores, en `dist-review/` |
| `verify:drafts` en producción | Seis rutas ausentes; textos educativos pendientes ausentes |
| `verify:drafts` en revisión | Seis rutas presentes, con noindex, fuera del sitemap y de Pagefind |
| Accesibilidad automatizada del artefacto de revisión | 28 páginas sin incidencias pa11y WCAG2AA; 121 páginas sin enlaces rotos; presupuesto de peso aprobado |
| `npm run lint:content` | Sin errores en los 10 slugs y 20 archivos heredados |
| `node scripts/verify-web.mjs` desde raíz | Conteos 10/20/10, enlaces, estados simulados, texto seguro y coherencia entre datos del prototipo/Astro |

CI prueba ambos artefactos por separado. El artefacto `dist` mantiene exclusivamente
la salida de producción; `draft-review` conserva la revisión sin ejecutar despliegue.
La rama de PR no puede activar el trabajo de despliegue Cloudflare.

El prototipo privado anterior conserva sus muestras heredadas maya/náhuatl pendientes
de validación. No se cambiaron estados editoriales, fechas, traducciones o créditos,
ni se fusionó main. Faltan revisión científica/pedagógica, validación por hablantes,
noticias verificadas, `/lite` de los nuevos módulos, prueba manual de accesibilidad y
autorización editorial. Las comprobaciones automatizadas no certifican conformidad
WCAG 2.2 AA completa.
