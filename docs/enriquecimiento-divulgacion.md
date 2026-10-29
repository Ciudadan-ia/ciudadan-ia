# Artículos de divulgación · ampliación del 28 de octubre de 2026

La portada privada enlaza ahora seis explicadores completos, un índice de lecturas
y una biblioteca agrupada por historia. Su objetivo es llevar de una pregunta
cercana a la comprensión y a una actividad con docentes y divulgadores.

| Artículo | Ruta de revisión | Actividad propuesta |
| --- | --- | --- |
| Una voz conocida ya no es una prueba. ¿Cómo recuperamos la confianza? | `/historias/voz-clonada/` | Separar una afirmación de su verificación; 7 minutos |
| Una IA puede anticipar el tiempo. El reto es saber cuándo confiar. | `/historias/ia-pronostico-tiempo/` | Distinguir pronóstico, observación y decisión; 8 minutos |
| ¿La IA hará tu trabajo? Primero hay que abrirlo por dentro. | `/historias/ia-tareas-trabajo/` | Descomponer una actividad en tres tareas y condiciones de revisión; 10 minutos |
| Te dio la respuesta. ¿También te ayudó a aprender? | `/historias/ia-educacion-aprender/` | Comparar una solución con una pista; 10 minutos |
| Lo escribió una IA. ¿Por qué suena tan convincente? | `/historias/ia-desinformacion-convincente/` | Separar afirmación, fuente y contexto; 8 minutos |
| La IA dice hablar tu lengua. ¿Quién revisa lo que realmente dice? | `/historias/ia-lenguas-indigenas-traduccion/` | Acordar propósito, variedad, revisión y permisos antes de traducir; 10 minutos |

Cada lectura incluye fuentes por sección, tres ideas principales, un esquema
conceptual, dos términos, una pregunta con respuesta desplegable y enlaces a las
otras lecturas. El contenido procede de un único archivo de datos para ambas
versiones. Las versiones `/lite/` no cargan imágenes, scripts ni estilos externos.
Las actividades no requieren cuentas, conexión ni datos de personas. Sus tiempos
son orientativos y no resultados de pruebas con participantes.

## Evidencia y límites

Las once fuentes de la portada fueron consultadas de nuevo el 28/10/2026. Se
conserva la distinción entre alertas de FTC/FBI, informe NIST, documentación del
desarrollador ECMWF, investigación australiana de Trotta y colaboradores, marco OMM,
resumen OIT, informe OCDE y ficha/resumen de un documento de trabajo JRC. No se
afirma lectura del texto completo JRC ni de la versión editorial de Trotta.

La cifra OIT de una de cada cuatro personas en ocupaciones con algún grado de
exposición tiene alcance global: no es una cifra de despidos ni una predicción
individual o mexicana. Queda registrada como TRA04. Los ejemplos de llamada,
clase y trabajo se identifican como inventados o propuestos.

El expediente `editorial/revision-portada/articulos-afirmaciones.json` identifica
la versión de cada artículo y de su plantilla. El comprobador rechaza desajustes
de huellas, referencias inexistentes y secciones factuales sin fuentes. Conserva
vacíos todos los dictámenes humanos.

## Verificaciones locales

- Compilación pública: 82 páginas; compilación de revisión: 144 páginas.
- 28 rutas de borradores excluidas de producción y fuera de sitemap/búsqueda.
  También se comprueba que los textos ampliados no estén en HTML, JS o JSON públicos.
- Accesibilidad automática: 51 páginas de revisión sin incidencias pa11y WCAG2AA;
  144 páginas sin enlaces internos rotos. No acredita conformidad WCAG completa.
- Artículos visuales: aproximadamente 22–25 KB; ligeros: 14–15 KB. Los límites
  son 300 KB y 50 KB respectivamente. Ningún HTML supera el límite global.
- Navegador: sin desbordamiento horizontal a 320 px en los tres artículos y sus
  versiones ligeras, índice, biblioteca y portada. Apertura por teclado de una
  respuesta y llegada al ancla de una fuente comprobadas.
- Verificador previo de 10 lecciones, 20 FAQ y 10 fichas de planificación correcto.
- Compilación local con Node 24.19.0. CI mantiene su Node 22.23.4 fijado.

## Pendientes de publicación

No hay aprobaciones científicas, pedagógicas ni lingüísticas nuevas. Los artículos
continúan como borradores; el contenido técnico de una PR no autoriza su salida
pública. Falta revisar las tres versiones lingüísticas conjuntamente, con variedades
acordadas, responsables identificados y autorización final. La historia de voz exige
revisión especializada de seguridad y contexto local. Las diez fichas de agenda no
se presentan como diez noticias terminadas.

La entrega visible se hace en la revisión privada existente. No se habilitan
formularios, inscripciones, donativos, membresías, recepción de voz ni gastos.

## Ampliación: educación, desinformación y lenguas indígenas

Se añaden dos ensayos educativos (Bastani y colaboradores; Kestin y colaboradores),
una guía UNESCO y la corrección editorial de afiliación del artículo PNAS. Se
conservan las diferencias de diseño, población y evaluación, sin prometer efectos
en escuelas mexicanas. La nota de corrección se abrió y no modifica resultados.

Desinformación contrasta un experimento con GPT-3, una intervención mediática de
2020 y el informe NIST. El resumen de los autores del experimento se consultó en
arXiv; el editor Science respondió 403. La intervención de 2020 no estudia modelos
actuales y no tuvo resultados uniformes entre muestras.

Lenguas indígenas incorpora AmericasNLP 2025 (PDF y declaración ética), el resumen
de 2024 con evaluación humana en bribri y CARE, con copia del artículo en GIDA.
La ficha de 2025 y su PDF difieren en el número de equipos: no se usa esa cifra.
La evaluación bribri no acredita calidad en maya o náhuatl. No se generaron nuevas
traducciones ni se recopilaron palabras, grabaciones o materiales comunitarios.

Tres ilustraciones vectoriales originales, registradas con huellas en
`editorial/revision-portada/articulos-medios.json`, se muestran solo en las vistas
visuales de revisión. Tienen título, descripción y pie que identifica el carácter
conceptual. No se reproducen figuras de artículos, personas reales ni motivos
culturales de una comunidad. El comprobador exige integridad y procedencia y
confirma que las versiones ligeras no contienen SVG, imágenes o scripts.

Comprobación móvil a 320 px: tres artículos, sus tres versiones ligeras, portada,
índice y biblioteca sin desbordamiento horizontal. Los originales en español y
las imágenes siguen pendientes de dictamen; las traducciones y aprobación conjunta
de las tres lenguas continúan sin resolver. Las 10 lecciones, 20 FAQ y 10 fichas
de agenda conservan sus estados anteriores.
