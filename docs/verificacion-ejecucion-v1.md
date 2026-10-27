# Verificación del arranque V1

Preparación iniciada el 26/10/2026. Base: `e8a135883fa82681ef325844673f7fff5b6835f0`. Los resultados corresponden a los archivos de esta propuesta, no a una V1 publicada ni a aprobación científica.

| Comprobación | Resultado |
|---|---|
| `npm ci --ignore-scripts` | Instalación del lockfile existente; sin añadir dependencias |
| `npm run lint:content` | 10 slugs, 20 archivos heredados; sin errores |
| `npm run build` | Comprobación Astro sin errores y generación de 121 páginas; avisos de deprecación heredados |
| `node site/scripts/verify.mjs` desde su directorio | 28 páginas representativas sin incidencias pa11y WCAG2AA, incluidas seis nuevas; 121 páginas sin enlaces internos rotos; presupuesto de peso aprobado |
| `node scripts/verify-web.mjs` desde raíz | 10 lecciones, 20 FAQ, 10 fichas de agenda; enlaces del prototipo, estados simulados y renderizado de texto seguro |
| Revisión visual del prototipo | Navegación ES→maya→náhuatl, lectura bilingüe y avisos presentes; a 390px sin desbordamiento horizontal |
| Interacción de prueba | Una respuesta correcta devuelve feedback; guardar y pasar a revisión muestra estado simulado, sin publicación |
| Prototipo de revisión | Publicación privada verificada por Sites; separado del sitio Astro de producción |

La instalación reportó 22 avisos de seguridad preexistentes: 2 moderados, 19 altos y 1 crítico. Astro es dependencia directa con corrección disponible según la auditoría. Se abre seguimiento; no se ejecutó actualización automática que pudiera cambiar el stack. Revisar antes de producción y documentar aplicabilidad al despliegue estático y a las herramientas de construcción.

Estas comprobaciones no certifican conformidad WCAG 2.2 AA completa. Faltan prueba manual con lector de pantalla y usuarios, prueba 3G/gama baja, Lighthouse móvil, validación por hablantes, revisión científica y pedagógica, `/lite` para módulos nuevos, responsables editoriales nominales, noticias verificadas y aprobación de lanzamiento. No hay despliegue de la aplicación Astro ni merge a main como parte de esta preparación.

La cuenta/organización y el repositorio GitHub se reutilizaron después de auditar sus permisos. Workspace se usa para el expediente institucional; no se creó una nueva organización jurídica, tenant ni dominio. El prototipo no contiene inscripciones reales, datos de voluntarios, donativos ni captura de voz.
