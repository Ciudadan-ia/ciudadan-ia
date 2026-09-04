# Taxonomía editorial CIUDADAN-IA

**Versión 1.0** · 2026-09-04. Plan temático de las 1000 piezas originales en español
(feature 002). Define temas, subtemas, cuotas por formato y la lista cerrada del glosario.
El registro operativo con las 1000 semillas vive en `editorial/registro.json`.

## Formatos

| Clave | Formato | Palabras (cuerpo) | Total |
| --- | --- | --- | --- |
| `explicador` | Respuesta corta + capa profunda | 600-900 | 350 |
| `pregunta` | Pregunta corta encadenada | 300-500 | 300 |
| `glosario` | Entrada de término | 150-300 | 150 |
| `ficha` | Proyecto, herramienta o caso | 400-600 | 100 |
| `paper` | Resumen de estudio o informe | 500-700 | 100 |

## Temas y cuotas

Los 6 temas del MVP más 5 nuevos (`salud`, `gobierno-democracia`, `medio-ambiente`,
`arte-creatividad`, `ciencia`).

| Tema | Explicador | Pregunta | Glosario | Ficha | Paper | Total |
| --- | --- | --- | --- | --- | --- | --- |
| `tecnologia` | 45 | 40 | 40 | 15 | 10 | 150 |
| `derechos` | 40 | 35 | 12 | 10 | 13 | 110 |
| `lengua-cultura` | 38 | 30 | 14 | 18 | 10 | 110 |
| `trabajo` | 35 | 28 | 8 | 7 | 12 | 90 |
| `educacion` | 32 | 30 | 8 | 12 | 8 | 90 |
| `seguridad` | 32 | 30 | 14 | 6 | 8 | 90 |
| `gobierno-democracia` | 33 | 30 | 10 | 8 | 9 | 90 |
| `salud` | 30 | 25 | 10 | 6 | 9 | 80 |
| `ciencia` | 23 | 17 | 14 | 6 | 10 | 70 |
| `medio-ambiente` | 22 | 18 | 8 | 5 | 7 | 60 |
| `arte-creatividad` | 20 | 17 | 12 | 7 | 4 | 60 |
| **Total** | **350** | **300** | **150** | **100** | **100** | **1000** |

## Subtemas (65)

Notación: `slug` — total (explicador, pregunta, glosario, ficha, paper).

### tecnologia (150)
- `como-funciona-un-llm` — 30 (8,8,10,2,2)
- `aprendizaje-automatico` — 25 (7,6,9,1,2)
- `ia-generativa-imagen-voz-video` — 20 (6,6,5,3,0)
- `chips-computo-costos` — 18 (6,5,4,2,1)
- `modelos-abiertos-cerrados-regionales` — 20 (6,5,4,4,1)
- `agentes-y-automatizacion` — 17 (5,5,4,2,1)
- `evaluacion-limites-y-mitos` — 20 (7,5,4,1,3)

### derechos (110)
- `privacidad-y-datos-personales` — 25 (9,8,3,2,3)
- `vigilancia-y-reconocimiento-facial` — 22 (8,7,2,3,2)
- `discriminacion-algoritmica` — 22 (8,7,3,1,3)
- `pueblos-indigenas-datos-consentimiento` — 20 (7,6,2,3,2)
- `explicacion-impugnacion-reparacion` — 12 (4,4,1,1,2)
- `expresion-y-moderacion-automatica` — 9 (4,3,1,0,1)

### lengua-cultura (110)
- `por-que-tu-lengua-no-esta` — 18 (7,6,3,1,1)
- `proyectos-comunitarios` — 24 (5,4,1,12,2)
- `traduccion-automatica-y-limites` — 18 (7,6,4,0,1)
- `voz-y-radios-comunitarias` — 16 (6,5,3,2,0)
- `soberania-de-datos-linguisticos` — 14 (5,4,2,1,2)
- `cultura-memoria-y-saberes` — 12 (5,3,1,1,2)
- `espanol-latinoamericano-en-la-ia` — 8 (3,2,0,1,2)

### trabajo (90)
- `que-tareas-cambian-por-oficio` — 25 (10,8,1,1,5)
- `plataformas-y-gestion-algoritmica` — 15 (6,5,2,1,1)
- `trabajadores-invisibles-de-la-ia` — 12 (5,3,1,1,2)
- `usar-ia-en-tu-oficio` — 20 (7,7,2,3,1)
- `sindicatos-y-transicion-justa` — 10 (4,3,1,0,2)
- `productividad-y-quien-captura-la-ganancia` — 8 (3,2,1,1,1)

### educacion (90)
- `aula-evaluacion-e-integridad` — 20 (8,7,1,2,2)
- `alfabetizacion-estudiantes-y-familias` — 18 (6,7,2,1,2)
- `recursos-para-docentes` — 18 (4,4,1,8,1)
- `educacion-intercultural-bilingue` — 14 (6,5,1,1,1)
- `educacion-superior-e-investigacion` — 10 (4,3,2,0,1)
- `politicas-brecha-y-equidad` — 10 (4,4,1,0,1)

### seguridad (90)
- `deepfakes-y-desinformacion` — 22 (8,8,3,1,2)
- `estafas-con-ia` — 18 (7,7,2,1,1)
- `seguridad-digital-cotidiana` — 16 (6,6,2,2,0)
- `violencia-digital-de-genero` — 10 (4,3,1,1,1)
- `ciberseguridad-e-infraestructura` — 12 (4,3,3,0,2)
- `seguridad-de-los-sistemas-de-ia` — 12 (3,3,3,1,2)

### gobierno-democracia (90)
- `leyes-de-ia` — 22 (8,7,3,2,2)
- `gobierno-digital-y-focalizacion` — 18 (7,6,2,2,1)
- `elecciones-y-propaganda` — 14 (5,5,1,1,2)
- `justicia` — 12 (4,4,1,2,1)
- `geopolitica-y-soberania-tecnologica` — 14 (5,5,2,1,1)
- `participacion-y-transparencia-algoritmica` — 10 (4,3,1,0,2)

### salud (80)
- `diagnostico-por-imagen` — 16 (6,5,2,1,2)
- `chatbots-de-salud` — 18 (7,6,2,1,2)
- `salud-mental-y-compania-artificial` — 12 (5,4,1,1,1)
- `salud-publica-y-sistemas-rurales` — 14 (5,4,2,2,1)
- `datos-medicos-y-sesgo` — 12 (4,4,2,0,2)
- `farmacos-y-biologia` — 8 (3,2,1,1,1)

### ciencia (70)
- `ia-como-herramienta-cientifica` — 18 (6,4,3,2,3)
- `historia-de-la-ia` — 14 (5,3,4,0,2)
- `como-se-investiga` — 12 (4,3,3,1,1)
- `cerebro-vs-maquina` — 10 (3,3,2,0,2)
- `ciencia-latinoamericana-con-ia` — 16 (5,4,2,3,2)

### medio-ambiente (60)
- `agua-energia-y-centros-de-datos` — 18 (7,6,3,1,1)
- `minerales-y-basura-electronica` — 10 (4,3,1,1,1)
- `clima-biodiversidad-y-territorio` — 16 (6,4,2,2,2)
- `agricultura-y-campo` — 10 (3,3,1,1,2)
- `greenwashing` — 6 (2,2,1,0,1)

### arte-creatividad (60)
- `derechos-de-autor-y-entrenamiento` — 16 (6,5,3,1,1)
- `voz-e-imagen-de-artistas` — 14 (5,4,3,1,1)
- `practica-artistica` — 12 (3,3,2,3,1)
- `periodismo-y-medios` — 10 (4,3,2,1,0)
- `textil-e-iconografia-indigena` — 8 (2,2,2,1,1)

## Glosario: lista cerrada de 150 términos

Ningún agente inventa términos: si un concepto falta, se añade aquí primero. Slug
`glosario-{termino}`.

**tecnologia (40)**: inteligencia artificial · LLM · token · parámetro · entrenamiento ·
datos de entrenamiento · inferencia · alucinación · ventana de contexto · prompt · ajuste
fino · RLHF · RAG · aprendizaje automático · aprendizaje profundo · red neuronal ·
sobreajuste · sesgo de datos · algoritmo · embeddings · transformer · atención · multimodal ·
modelo generativo · difusión · GAN · texto a voz (TTS) · reconocimiento de voz (ASR) · visión
por computadora · agente · pesos abiertos · modelo fundacional · GPU · nube · API · benchmark ·
AGI · temperatura · destilación · cuantización

**derechos (12)**: datos personales · consentimiento informado · hábeas data · autoridad de
protección de datos · decisión automatizada · derecho a explicación · discriminación
algorítmica · perfilamiento · anonimización · reconocimiento facial · biometría · principios
CARE

**trabajo (8)**: automatización · gestión algorítmica · trabajo de plataforma · etiquetado de
datos · productividad · recualificación · aumento vs. sustitución · trabajo de cuidados

**educacion (8)**: alfabetización en IA · detector de texto generado · integridad académica ·
tutoría con IA · aprendizaje adaptativo · pensamiento crítico digital · brecha digital ·
evaluación auténtica

**lengua-cultura (14)**: lengua de bajos recursos · corpus · corpus paralelo · traducción
neuronal · variante lingüística · ortografía normalizada · endónimo · revitalización
lingüística · documentación lingüística · licencia comunitaria de datos · consentimiento libre,
previo e informado · apropiación digital · vitalidad lingüística (UNESCO) · tokenización de
lenguas aglutinantes

**seguridad (14)**: deepfake · clonación de voz · desinformación · phishing · ingeniería
social · bots · marca de agua digital · credenciales de contenido (C2PA) · verificación de
hechos · prebunking · inyección de instrucciones · jailbreak · alineación · red teaming

**salud (10)**: diagnóstico asistido por computadora · telemedicina · triaje · falso positivo
y falso negativo · sensibilidad y especificidad · historia clínica electrónica · sesgo médico
algorítmico · chatbot de salud · compañero virtual · descubrimiento de fármacos

**gobierno-democracia (10)**: regulación basada en riesgo · AI Act · evaluación de impacto
algorítmico · registro público de algoritmos · transparencia algorítmica · auditoría
algorítmica · focalización de programas sociales · gobierno digital · soberanía tecnológica ·
sandbox regulatorio

**medio-ambiente (8)**: centro de datos · huella hídrica · huella de carbono · consumo
energético de la IA · minerales críticos · basura electrónica · teledetección · sistema de
alerta temprana

**arte-creatividad (12)**: derechos de autor · uso legítimo · opt-out de entrenamiento ·
dominio público · obra derivada · estilo artístico · Creative Commons · extracción masiva de
datos · clonación de voz artística · arte generativo · arte con instrucciones · etiquetado de
contenido sintético

**ciencia (14)**: revisión por pares · preprint · reproducibilidad · conjunto de datos ·
validación cruzada · correlación y causalidad · plegamiento de proteínas · simulación ·
ciencia ciudadana · leyes de escalado · invierno de la IA · prueba de Turing · capacidades
emergentes · interpretabilidad

## Piezas ya publicadas (no duplicar)

`que-es-un-llm` · `deepfakes-y-elecciones` · `ia-y-tu-trabajo` · `ia-en-el-aula` ·
`vigilancia-y-derechos` · `la-ia-y-tu-lengua`. Las semillas pueden profundizar en aspectos no
cubiertos por ellas, declarándolo en su ángulo.

## Subconjunto comunitario (náhuatl y maya yucateco, ~150)

Puntaje de selección (`communityPriority: 1` si suma ≥70):

| Criterio | Peso |
| --- | --- |
| Relevancia comunitaria (subtemas de lengua, derechos indígenas, vigilancia, educación bilingüe, salud rural, trabajo en el campo, estafas por WhatsApp, agua y territorio, trámites y subsidios) | 40 |
| Brevedad y forma (pregunta o glosario 25; explicador ≤700 palabras 15; ficha 10; paper 5) | 25 |
| Pocos tecnicismos (≤2) y sin marcos legales urbanos | 20 |
| Accionable sin internet estable ni trámite digital | 15 |

Composición meta: ~60 preguntas · 45 glosarios · 30 explicadores · 10 fichas · 5 papers. Al
menos 40 en el lanzamiento; 3-4 por semana después. Todas quedan en estado `traducido-ia` con
vista bilingüe hasta que una persona hablante las valide.
