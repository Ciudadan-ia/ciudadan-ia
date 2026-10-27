# Arranque CiudadanIA V1

Trabajo preparado el 26 de octubre de 2026 en cinco frentes. La especificación técnica está en [specs/003-ejecucion-integral-90d/spec.md](../specs/003-ejecucion-integral-90d/spec.md); el plan, Constitución Maestra y documentos institucionales editables viven en Google Workspace bajo custodia del fundador.

Seis páginas de revisión, sin sustituir la portada: `/v1`, `/aprender`, `/faq`, `/noticias`, `/biblioteca` y `/editorial-demo`. Están en `site/src/drafts/` y quedan excluidas del build de producción. Solo se generan con `CIUDADANIA_DRAFT_PREVIEW=1`; siguen no indexables, fuera del sitemap y de la búsqueda. El lote tiene 10 lecciones ES, 20 FAQ y 10 fichas de agenda pendientes: no hay 10 noticias nuevas publicadas ni traducción completa aprobada. El prototipo ES/maya/náhuatl conserva muestras heredadas pendientes de validación y no recoge datos personales ni voz.

La administración propuesta para V1 es mediante PR y permisos de GitHub. El taller local ensaya estados y exporta JSON; no autentica personas ni publica. La Constitución técnica 1.2.0 y las ediciones existentes se conservan.

Ver arquitectura y UX en [arquitectura-web.md](arquitectura-web.md) y [ux-ui.md](ux-ui.md). La validación del incremento, sus límites y la auditoría inicial de dependencias están en [verificacion-ejecucion-v1.md](verificacion-ejecucion-v1.md).

Los datos personales y expedientes institucionales no se cargan en este repositorio público. La incorporación de borradores a una rama no autoriza su lanzamiento editorial.

Actualización de seguridad del 27/10/2026: Astro 7.4.2, Node mínimo 22.23.4 y lockfile actualizado sin forzar cambios mayores. La auditoría reporta cero críticas y cero vulnerabilidades en dependencias de producción. Siguen 11 avisos altos en las herramientas de pruebas de accesibilidad, con seguimiento separado en #6.
