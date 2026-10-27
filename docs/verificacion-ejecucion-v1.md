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

La actualización posterior a pa11y 10.0.0 y Puppeteer 25.16.0 eliminó las 11 altas de las herramientas de prueba: la auditoría actual reporta cero vulnerabilidades en todo el árbol. La tabla anterior conserva el corte inicial de la corrección de Astro. Se mantuvo Node 22.23.4 y se reejecutaron los controles tras la actualización mayor. CI ahora exige también `npm audit` completo. Los resultados son una fotografía de la auditoría, no una garantía futura.

## Contenidos pendientes fuera de producción

Los seis módulos y sus seis versiones ligeras se mantienen fuera de `src/pages/`, en `src/drafts/`. La integración
`site/draft-routes.mjs` solo los registra con `CIUDADANIA_DRAFT_PREVIEW=1`.
`noindex` se conserva como señal adicional: la barrera de publicación es que sus
rutas y textos no se generan en el build normal.

| Comprobación | Resultado local |
|---|---|
| Compilación normal con Astro actualizado | 116 páginas, sin errores |
| Compilación explícita de revisión | 128 páginas, sin errores, en `dist-review/` |
| `verify:drafts` en producción | Doce rutas ausentes; textos educativos pendientes ausentes |
| `verify:drafts` en revisión | Doce rutas presentes, con noindex, fuera del sitemap y de Pagefind |
| Accesibilidad automatizada del artefacto de revisión | 35 páginas sin incidencias pa11y WCAG2AA; 128 páginas sin enlaces rotos; presupuesto de peso aprobado |
| `npm run lint:content` | Sin errores en los 10 slugs y 20 archivos heredados |
| `node scripts/verify-web.mjs` desde raíz | Conteos 10/20/10, enlaces, estados simulados, texto seguro y coherencia entre datos del prototipo/Astro |

CI prueba ambos artefactos por separado. El artefacto `dist` mantiene exclusivamente
la salida de producción; `draft-review` conserva la revisión sin ejecutar despliegue.
La rama de PR no puede activar el trabajo de despliegue Cloudflare.

El prototipo privado anterior conserva sus muestras heredadas maya/náhuatl pendientes
de validación. No se cambiaron estados editoriales, fechas, traducciones o créditos.
Las correcciones técnicas de #7 y #9 se integraron en main; eso no aprueba el contenido. Faltan revisión científica/pedagógica, validación por hablantes,
noticias verificadas, prueba manual de accesibilidad y
autorización editorial. Las comprobaciones automatizadas no certifican conformidad
WCAG 2.2 AA completa.

## Operación segura añadida

Las seis vistas ligeras comparten datos con las completas, no incluyen scripts ni fuentes externas y pesan entre 3.5 y 11.3 KB HTML. Las funciones de suscripción y colaboración no leen datos si falta habilitación o proveedor. Once pruebas con datos ficticios cubren cierres por defecto, consentimiento, error HTTP 400, fallo de red y fallo de almacenamiento. Los formularios no aparecen en la compilación normal. No se activó captación.

Se corrigió el directorio del despliegue Wrangler para incluir `site/functions/` y se añadió al resumen de Actions la distinción entre credenciales ausentes y despliegue realmente ejecutado. No se pudo probar el envío real: faltan las credenciales Cloudflare. El paso de despliegue de main tras #7 fue omitido, aunque el trabajo finalizó exitosamente.

## Cierre de integración

#7 y #9 están integradas. La ejecución de main 40533219665 terminó con sus comprobaciones correctas y omitió los pasos reales de publicación por falta de acceso Cloudflare. La incidencia #6 se cerró tras verificar cero vulnerabilidades; #8 conserva el bloqueo de despliegue. El respaldo Git se restauró en una carpeta aislada, con instalación desde lockfile, once pruebas de formularios y reconstrucción de producción sin las doce rutas pendientes. La revisión con hablantes y las decisiones institucionales continúan abiertas.
