# CiudadanIA V1 — arranque de ejecución integral

Estado: propuesta de alcance técnico, 26/10/2026. Complementa la Constitución técnica 1.2.0; no la modifica ni acredita aprobación institucional.

## Evidencia y alcance

Se reutiliza este repositorio y Astro SSG. La nueva instrucción confirma español, maya y náhuatl; se preserva el inglés existente. Los códigos `yua`/`nah` y sus variantes requieren confirmación de hablantes. No se generaron traducciones indígenas nuevas. El contexto histórico recuperado solo permitió verificar las cinco decisiones de revisión científica descritas abajo.

La ejecución tiene cinco frentes coordinados: documentos y registros; UX móvil; web V1; piloto educativo; ruta jurídica y financiación. Dos responsables, tecnológico y educativo, reportan al fundador en una reunión semanal conjunta. La gestión institucional, el presupuesto detallado y el voluntariado se mantienen en Google Workspace; este repositorio público conserva código, especificaciones y plantillas técnicas sin expedientes personales.

## Producto y aceptación

| Área | Preparado en este incremento | Pendiente para V1 publicable |
|---|---|---|
| Portada | `/v1` como portada de módulos en revisión; portada anterior conservada | Decisión de integración de navegación y lanzamiento |
| Aprendizaje | 10 lecciones ES con actividad y comprobación | Revisión pedagógica/científica, ampliación y traducción validada |
| FAQ | 20 respuestas en borrador | Aprobación editorial, enlaces institucionales definitivos y traducción |
| Noticias | 10 encargos de agenda claramente rotulados | Investigar hechos, fechas y fuentes; redactar y revisar las 10 noticias |
| Biblioteca | 4 recursos institucionales primarios enlazados | Curaduría y accesibilidad de recursos por lengua |
| Editorial | Administración real propuesta por ramas/PR; demo local de estados/exportación | Nombramientos, permisos, validaciones y trazabilidad real; demo no es un CMS |
| Lenguas | Prototipo navegable ES/yua/nah con muestras heredadas y vista bilingüe | No equivale a 40 piezas trilingües ni validación comunitaria |
| Piloto | Instrumentos institucionales preparados en Workspace | 15–25 personas, 16h propuestas, práctica, evaluación e informe; sin reclutamiento ejecutado |
| Jurídico | Ruta y brief para dictamen en Workspace | Validación profesional; no entidad, autorización fiscal ni captación ejecutada |

## Revisión confirmada y flujo técnico propuesto

1. Red voluntaria de revisores científicos evaluados previamente.
2. Criterios públicos de competencia, independencia y diversidad de perspectivas.
3. Desacuerdos científicos relevantes resueltos por especialistas independientes sin conflictos.
4. Resúmenes públicos fundamentados de dictámenes: hallazgos, evidencia y resolución.
5. Separar borrador, revisión, cambios y autorización. La revisión individual propuesta para el lote inicial debe conciliarse con el muestreo de la constitución vigente antes de modificar la política.

Un cambio sustantivo de contenido invalida su aprobación anterior. Un estado `approved` de la demo no tiene autoridad editorial real. No hay API de publicación en este incremento. La demo solo admite datos ficticios en almacenamiento local y no transmite respuestas ni recoge personas, donativos o voz.

## Dependencias e hitos

| Ventana | Hito técnico | Dependencia |
|---|---|---|
| D1–7 | Auditoría, rama, prototipo y decisiones pendientes | Accesos y responsables nominales |
| D8–21 | Arquitectura acordada y prueba UX con 5–8 personas | Hablantes, criterios de revisión y variantes |
| D22–30 | Alfa con inventario 10/20/10 de borradores | Capacidad editorial confirmada |
| D31–45 | Beta, revisión y traducción | Revisores y autorización institucional |
| D46–75 | Soporte a formación y práctica; restauración | Privacidad, supervisión y selección piloto |
| D76–90 | Cierre de aceptación y lanzamiento aprobado o bloqueos explícitos | Seguridad, revisión científica/lingüística y criterios constitucionales |

Fecha base propuesta D1=26/10/2026, D90=23/01/2027; su aprobación y calendario institucional viven en Workspace.

## Puertas de publicación

HTML legible sin JavaScript; cobertura `/lite` de contenido nuevo; créditos y estado por lengua; fuentes y responsables requeridos por la Constitución; revisión independiente; accesibilidad automatizada y manual; pesos/enlaces; política de IA y gobernanza; privacidad y restauración. No declarar WCAG 2.2 AA, Lighthouse o validación lingüística por una compilación exitosa. Una herramienta automatizada no certifica conformidad completa.

Auditoría inicial: 22 avisos, incluido uno crítico en Astro. El 27/10/2026 se actualizó Astro 7.2.7→7.4.2 y se fijó Node mínimo 22.23.4. El lockfile corregido reporta cero críticas y cero vulnerabilidades en dependencias de producción. La actualización mayor posterior a pa11y 10.0.0/Puppeteer 25.16.0 deja cero avisos en el árbol completo, revalidada mediante build y pruebas. CI bloquea nuevas críticas y vulnerabilidades de producción. El dominio Cloudflare heredado no pudo verificarse operativo; las ejecuciones CI exitosas no prueban disponibilidad pública.

Los módulos pendientes y sus seis vistas ligeras están fuera del enrutamiento de producción: solo se incorporan con `CIUDADANIA_DRAFT_PREVIEW=1`. CI verifica tanto la ausencia de sus rutas y textos en producción como su disponibilidad no indexable en el artefacto de revisión. La preparación para revisión del PR no autoriza publicar sus contenidos.

## Gestión

GitHub: especificaciones, incidencias, PR y código. Workspace: Constitución Maestra propuesta, registros de decisiones/contradicciones/pendientes, RACI, plan de 90 días, caja, voluntariado y expediente jurídico. Las ediciones locales institucionales son copias de preparación; no deben publicarse automáticamente en el repositorio público. No hay sincronización automática entre ambas herramientas.

Pendientes de aprobación: responsables y horas; variantes y validadores; políticas definitivas; selección piloto; gastos/contratos; sede/estatutos/representación; captación y mensajes fiscales; lanzamiento público. El calendario semanal se propone, no se enviaron invitaciones.
