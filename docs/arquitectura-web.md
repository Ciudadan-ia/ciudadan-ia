# Arquitectura V1 · propuesta de extensión

Fecha: 2026-10-26. Estado: implementada en archivos nuevos; revisión de integración pendiente. El repositorio existente `Ciudadan-ia/ciudadan-ia`, commit base `e8a1358`, es la fuente técnica. No se sustituye por el prototipo.

## Base verificada

El sitio usa Astro SSG, colecciones de Markdown, ediciones es/en/nah/yua, Pagefind y comprobaciones de contenido. Su constitución exige HTML legible sin JavaScript, `/lite`, accesibilidad WCAG 2.2 AA, ligereza, soberanía de datos indígenas, créditos y validación humana. La edición en inglés permanece; el alcance nuevo solicitado cubre español, maya y náhuatl.

## Incremento implementado

| Ruta nueva | Función | Estado del contenido |
| --- | --- | --- |
| `/v1` | Portada de módulos educativos, enlaces a ediciones existentes | Propuesta, no indexable |
| `/aprender` | 10 lecciones con actividad, comprobación y fuente contextual | Borrador en español |
| `/faq` | 20 preguntas y respuestas | Borrador en español |
| `/noticias` | 10 fichas de agenda editorial | No son noticias redactadas ni verificadas |
| `/biblioteca` | 4 recursos institucionales primarios | Enlaces consultados; sin aval institucional |
| `/editorial-demo` | Crear, editar, guardar y exportar borradores ficticios | Simulación local; no CMS de producción |

`site/src/data/ejecucion-v1.json` contiene el lote nuevo. Las páginas de `site/src/drafts/` renderizan HTML sin depender de JavaScript para la lectura. Solo el taller editorial usa JavaScript para persistir borradores ficticios. No hay cuentas, recepción de datos personales, API de publicación ni infraestructura nueva.

Desde el 27/10/2026, `site/draft-routes.mjs` incorpora estas rutas únicamente cuando `CIUDADANIA_DRAFT_PREVIEW=1`. La compilación normal no las genera y no incluye sus textos. Las compilaciones de revisión mantienen `noindex,nofollow` y excluyen estas rutas del sitemap y de la búsqueda. CI conserva `dist` de producción separado de `dist-review`; solo el primero puede enviarse al despliegue heredado. Incorporar una pieza aprobada requerirá un cambio editorial explícito; no basta modificar el estado local de la demo.

El prototipo separado `prototypes/ejecucion-90d/dist/` permite navegación móvil en tres ediciones de muestra y autoevaluación interactiva. Las muestras nah/yua proceden del artículo existente `que-es-un-llm`, conservan su estado `traducido-ia`, muestran español en paralelo y créditos originales. No se generaron traducciones indígenas nuevas. La interfaz nueva y las diez lecciones están en español, con pendiente visible de traducción y validación. Esto no constituye una V1 totalmente traducida ni una validación lingüística.

## Flujo de producción propuesto

1. Especificación y trabajo técnico en GitHub. Documento institucional y voluntariado en Google Workspace con acceso restringido.
2. Autoría propone contenido mediante rama/PR y adjunta fuentes, licencia, estado lingüístico y responsable editorial.
3. Revisión independiente por red voluntaria previamente evaluada. Desacuerdos relevantes pasan a especialistas sin conflictos.
4. Editor incorpora hallazgos y publica resumen fundamentado de dictamen. Cambio sustantivo invalida la aprobación anterior.
5. CI comprueba esquema, créditos, estados, accesibilidad, peso, enlaces y build Astro. La integración requiere aprobación humana y despliegue verificado.

El lote educativo requiere revisión científica y pedagógica, licencia aprobada y validación lingüística antes de considerarse publicable. Las fichas de noticias necesitan investigación de hechos reales y fuentes verificadas; no deben ascender automáticamente a noticias.

## Administración editorial real

La administración V1 de menor costo puede realizarse por PR en GitHub, sin construir autenticación propia. El taller permite ensayar estados `draft → review → approved → draft`; todos son simulados y nunca publican. Para un CMS multiusuario posterior se requieren autenticación del lado servidor, roles autor/revisor/editor, separación de funciones, registro inmutable de cambios, validación de entrada, protección contra solicitudes indebidas, copias de seguridad y restauración comprobada. `localStorage` no ofrece esos controles y no debe alojar datos de participantes ni dictámenes reales.

## Dependencias y aceptación

- Mantener la constitución existente y sus gates. Confirmar variantes maya/náhuatl con personas hablantes antes de ampliar contenido.
- No recolectar voz en este incremento. Exigir consentimiento comunitario, licencia y retorno de beneficios antes de cualquier captura.
- Aprobar nombres de editores/revisores y política de cambios. No fabricar identidades ni créditos.
- Antes de lanzamiento: build y controles constitucionales, teclado y lector de pantalla, móvil de baja gama, 3G y contenido bilingüe revisado.
- Costo incremental del prototipo estático: sin servicios pagados contratados. Costos operativos son estimaciones presupuestarias del plan maestro; no se acredita elegibilidad para planes gratuitos.

## Verificación y límites

`scripts/verify-web.mjs` verifica conteos, estados de borrador, preguntas con respuesta válida, enlaces internos del prototipo y uso de texto seguro en la simulación editorial. No sustituye auditoría WCAG, pruebas con personas, validación lingüística, revisión independiente ni pruebas de producción. La compilación y la revisión visual se registran por separado en el informe de ejecución.

Fuentes primarias consultadas 2026-10-26: [UNESCO](https://www.unesco.org/en/artificial-intelligence/recommendation-ethics), [NIST](https://www.nist.gov/itl/ai-risk-management-framework), [OECD](https://www.oecd.org/en/topics/artificial-intelligence.html), [W3C WAI](https://www.w3.org/WAI/fundamentals/accessibility-intro/). Son contexto formativo; las lecciones son propuestas originales y no implican aval de esas instituciones.

Actualización operativa 27/10/2026: hay seis rutas `/lite/` de revisión, con el mismo lote de datos y sin JavaScript. Las doce rutas siguen detrás de la bandera de revisión. La interfaz de captación y sus funciones se cierran por defecto hasta que privacidad y servicios estén validados. Ver `despliegue-pendiente.md` y la pestaña de pendientes del plan institucional.
