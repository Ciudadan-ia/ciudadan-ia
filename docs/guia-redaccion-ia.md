# Guía de producción editorial asistida por IA

**Versión 1.0** · 2026-09-04. Protocolo operativo de la feature 002 (1000 piezas originales).
Reglas de contenido: [manual de estilo](manual-de-estilo.md). Plan temático:
[taxonomía](taxonomia.md). Gobernanza: constitución v1.1.0 y política de IA del sitio.

---

## Principio operativo

> **Una fuente que no se abrió con WebFetch no existe.**

El redactor trabaja **sin acceso a la web** y solo puede afirmar lo que aparece en los
`keyFacts` de su ficha de fuentes, cada uno con cita literal del documento abierto. El auditor
reabre una fuente al azar y todos los DOI. Si el dato no está donde se dijo, la pieza se
rechaza — no se corrige a ojo.

## Estado de una pieza en el registro

`editorial/registro.json` es la única fuente de verdad del plan. Cada semilla avanza:

```text
planned → briefed → written → published
                 ↘ rejected (vuelve a planned con ángulo corregido)
```

## Ciclo de un lote

### 1. Briefs

```bash
cd site
node scripts/editorial/build-briefs.mjs --batch N --size 50
# piloto o lote temático:
node scripts/editorial/build-briefs.mjs --batch N --size 5 --mix "explicador:1,pregunta:1,glosario:1,ficha:1,paper:1"
```

Selección estratificada por tema, con las piezas de prioridad comunitaria primero. Rota el
tipo de apertura y de cierre para que 50 piezas no empiecen igual. Escribe
`editorial/lotes/lote-NN/briefs.json` y marca las semillas como `briefed`.

### 2. Producción (investigar → redactar → auditar)

Se ejecuta con el workflow `editorial/workflows/lote-produccion.js`, en pipeline: cada pieza
avanza sola, sin esperar al resto del lote.

| Etapa | Qué hace | Salida |
| --- | --- | --- |
| Investigar | WebSearch + **WebFetch obligatorio** por fuente; orden ES→PT→EN si el brief pide ancla latinoamericana; máximo 6 búsquedas y 8 fetch | `fuentes/{slug}.json` con `keyFacts` y `verified` |
| Redactar | Síntesis según el manual y la plantilla del formato; sin web; solo `sourceIds` de la ficha | `piezas/{slug}.json` |
| Auditar | Checklist de 15 ítems, métricas de legibilidad, verificación de una fuente al azar y de los DOI | `qa/{slug}.json` con veredicto |

Veredictos: **publish** (0 hard fails, ≥80) · **revise** (65-79 o un hard fail corregible:
titular, extensión, enlaces al glosario, fecha relativa) · **reject** (≥2 hard fails, o
cualquier fallo en fuentes, paráfrasis o respeto a pueblos).

### 3. Ensamblado

```bash
node scripts/editorial/assemble.mjs --batch N --editor "Nombre de la persona responsable"
```

Solo ensambla los veredictos `publish`, y **revalida por su cuenta** (no confía en el QA del
agente): frases prohibidas, fechas relativas y el mínimo de 3 fuentes https verificadas. El
frontmatter lo serializa el script — **ningún modelo escribe YAML**.

### 4. Calendario

```bash
node scripts/editorial/schedule.mjs --launch 2026-10-05 --dry-run   # revisar
node scripts/editorial/schedule.mjs --launch 2026-10-05
```

Las primeras 200 piezas comparten la fecha de lanzamiento con hora escalonada; el resto se
reparte a 30 por semana (lunes, miércoles y viernes), sin dos piezas del mismo subtema en la
misma semana. Es idempotente: solo toca fechas futuras.

### 5. Gates y revisión humana

```bash
npm run lint:content   # slugs, fuentes mínimas, calendario, rangos de palabras
npm run build          # astro check + Zod = gates constitucionales
npm run verify         # pa11y AA + enlaces internos + presupuesto de peso
npm run dedup          # duplicados en el registro
PUBLISH_AS_OF=2027-03-01 npm run build && npm run preview   # revisar la cola completa
```

**Revisión humana obligatoria antes de publicar el lote** (constitución V.d):

- el 10 % del lote elegido al azar, y
- el 100 % de las piezas con `reviewPriority: alta` (salud, dinero, acusaciones a personas o
  instituciones, consejos de seguridad).

Cuando una persona revisa una pieza individualmente, se añade a su frontmatter
`review: { by: "Nombre", date: YYYY-MM-DD }` y la etiqueta del sitio pasa de «revisión humana
por muestreo» a «revisado por Nombre el D».

### 6. Cierre

Commit en rama `contenido/lote-NN`, merge tras la revisión. Auditoría de deriva cada 5 lotes:
si menos del 80 % de un lote llega a `publish` en dos rondas, la producción se detiene y se
ajusta el manual o los briefs.

## Umbrales de calidad del lote

| Métrica | Umbral |
| --- | --- |
| Piezas con veredicto `publish` | ≥ 90 % (se detiene bajo 80 %) |
| Fuentes no abiertas con WebFetch | 0 |
| Piezas con caso latinoamericano | ≥ 30 % del lote |
| Aperturas iguales dentro del lote | ≤ 3 |
| Revisión humana | 10 % al azar + 100 % de `alta` |

## Qué hacer cuando algo falla

| Síntoma | Acción |
| --- | --- |
| `status: insufficient` en la investigación | El brief vuelve al planificador: el ángulo no tiene fuentes verificables o hay que cambiar el enfoque |
| `reject` por paráfrasis (ítem 6) | Se rechaza la redacción, no la pieza: se vuelve a redactar con el mismo material |
| `reject` por respeto a pueblos (ítem 13) | Se revisa el brief y se consulta el §9 del manual antes de reintentar |
| Error reportado por un lector | Corrección con nota visible en `corrections[]` o retiro, en ≤48 horas (política de IA) |
