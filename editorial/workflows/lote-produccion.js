export const meta = {
  name: 'lote-produccion',
  description: 'Produce un lote de piezas CIUDADAN-IA: investigar fuentes reales, redactar según el manual y auditar con el checklist de 15 ítems',
  phases: [
    { title: 'Investigar', detail: 'fuentes verificadas con WebFetch' },
    { title: 'Redactar', detail: 'síntesis según el manual de estilo' },
    { title: 'Auditar', detail: 'checklist de 15 ítems' },
    { title: 'Traducir', detail: 'inglés y, si es comunitaria, náhuatl y maya' },
  ],
}

const BATCH = String(args.batch).padStart(2, '0')
const DIR = `/Users/felipesolarluksic/CIUDADAN-IA/editorial/lotes/lote-${BATCH}`
const MANUAL = '/Users/felipesolarluksic/CIUDADAN-IA/docs/manual-de-estilo.md'

const RESEARCH_SCHEMA = {
  type: 'object',
  required: ['slug', 'status', 'sourceCount'],
  properties: {
    slug: { type: 'string' },
    status: { type: 'string', enum: ['ok', 'insufficient'] },
    sourceCount: { type: 'number' },
    latamMet: { type: 'boolean' },
    note: { type: 'string', description: 'una línea: qué se encontró o por qué faltan fuentes' },
  },
}

const WRITE_SCHEMA = {
  type: 'object',
  required: ['slug', 'status', 'words'],
  properties: {
    slug: { type: 'string' },
    status: { type: 'string', enum: ['ok', 'failed'] },
    words: { type: 'number' },
    note: { type: 'string' },
  },
}

const QA_SCHEMA = {
  type: 'object',
  required: ['slug', 'verdict', 'score'],
  properties: {
    slug: { type: 'string' },
    verdict: { type: 'string', enum: ['publish', 'revise', 'reject'] },
    score: { type: 'number' },
    hardFails: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
}

const TRANSLATE_SCHEMA = {
  type: 'object',
  required: ['slug', 'lang', 'status'],
  properties: {
    slug: { type: 'string' },
    lang: { type: 'string', enum: ['en', 'nah', 'yua'] },
    status: { type: 'string', enum: ['ok', 'skipped', 'failed'] },
    blocks: { type: 'number', description: 'número de H2, debe coincidir con el original' },
    newTerms: { type: 'array', items: { type: 'string' }, description: 'términos añadidos al glosario de la lengua' },
    note: { type: 'string' },
  },
}

const SLUGS = args.slugs

phase('Investigar')
const results = await pipeline(
  SLUGS,

  // --- ETAPA 1: investigación con fuentes verificadas ---
  (slug) => agent(
    `Eres investigador documental de CIUDADAN-IA, un medio de divulgación científica sobre inteligencia artificial para público general latinoamericano.

TAREA: reunir las fuentes verificadas de la pieza cuyo slug es **${slug}**.

1. Lee su brief: en \`${DIR}/briefs.json\` busca el objeto cuyo campo "slug" sea "${slug}".
   Usa: \`python3 -c "import json;d=json.load(open('${DIR}/briefs.json'));print(json.dumps([b for b in d if b['slug']=='${slug}'][0],ensure_ascii=False,indent=2))"\`

2. Investiga con WebSearch y **abre cada fuente con WebFetch**. Regla absoluta del proyecto:
   **una fuente que no abriste con WebFetch no existe** y no puede citarse. Si un dominio
   devuelve 403 o no carga (pasa con wired.com, elpais.com, restofworld.org, dw.com),
   descártalo y busca otro.

3. Orden de búsqueda: si el brief dice latamAnchor "required", empieza en español y portugués
   y consigue al menos una fuente latinoamericana; si no, empieza en inglés y añade español.
   Fuentes preferidas: papers y preprints (arXiv, Nature, Science, PubMed, DOI), informes de
   organismos (Stanford AI Index, UNESCO, OCDE, CEPAL, BID, OIT, FMI, ONU), leyes y documentos
   oficiales, laboratorios (Anthropic, OpenAI, DeepMind, Meta AI, Hugging Face), universidades,
   organizaciones regionales de derechos digitales (Derechos Digitales, R3D, Karisma, ITS Rio,
   InternetLab, Data Privacy Brasil, Hiperderecho, TEDIC, Vía Libre, Access Now, Article 19,
   CELE), verificadores (Chequeado, Lupa, Verificado), medios de calidad (MIT Technology
   Review, Nature News, Rest of World, Núcleo) e instituciones como CENIA, INALI, CIESAS.
   Wikipedia NO se cita (sirve para llegar a la fuente primaria).

4. Límites: máximo 6 búsquedas y 8 fetch. Consigue entre el mínimo y el máximo de fuentes que
   pide el brief en sourceTargets, con al menos una primaria.

5. Escribe el resultado con Write en \`${DIR}/fuentes/${slug}.json\`:
\`\`\`json
{
  "slug": "${slug}",
  "status": "ok",
  "sources": [
    {
      "id": "S1",
      "url": "https://…",
      "publisher": "Institución o medio",
      "title": "Título exacto de la página",
      "authors": ["…"],
      "date": "2025-04",
      "language": "es",
      "type": "paper|preprint|informe|ley|reportaje|comunicado|documentacion|dataset",
      "isPrimary": true,
      "isLatam": false,
      "license": "CC BY | dominio público | n/c",
      "verified": { "httpOk": true, "titleMatch": true, "method": "WebFetch" },
      "keyFacts": [
        { "fact": "afirmación concreta y citable", "quote": "cita literal breve del documento", "location": "sección o párrafo" }
      ],
      "caveats": "qué NO dice esta fuente o su limitación"
    }
  ],
  "latamCoverage": { "required": false, "met": true, "via": ["S3"] },
  "gaps": ["dato que no encontramos y no debe afirmarse"],
  "suggestedAnalogy": "una analogía cotidiana latinoamericana que sirva para explicarlo"
}
\`\`\`
Cada fuente necesita 3-5 keyFacts con cita literal: son el único material con el que se
redactará la pieza. Si no alcanzas el mínimo de fuentes, escribe el archivo con
"status": "insufficient" explicando en "gaps" qué falta.

Devuelve solo el resumen estructurado.`,
    { label: `fuentes:${slug}`, phase: 'Investigar', schema: RESEARCH_SCHEMA }
  ),

  // --- ETAPA 2: redacción según el manual ---
  (research, slug) => {
    if (!research || research.status !== 'ok') {
      log(`⚠ ${slug}: sin fuentes suficientes, no se redacta`)
      return null
    }
    return agent(
      `Eres redactor de CIUDADAN-IA, un medio de divulgación científica sobre inteligencia artificial para público general latinoamericano.

TAREA: redactar la pieza **${slug}** como síntesis original de las fuentes ya verificadas.

1. Lee su brief en \`${DIR}/briefs.json\` (objeto con "slug" = "${slug}") y su ficha de fuentes
   en \`${DIR}/fuentes/${slug}.json\`.
2. Lee el manual de estilo \`${MANUAL}\` — al menos las secciones 1 (voz y nivel), 2
   (titulares), 3 (respuesta corta), 4 (estructura de TU formato), 5 (riesgos e
   incertidumbre), 6 (analogías), 7 (tecnicismos), 8 (cifras y fechas), 9 (pueblos
   indígenas), 10 (citación) y 11 (lo que nunca se escribe).

REGLAS INNEGOCIABLES:
- **Solo puedes afirmar lo que está en los keyFacts de tu ficha de fuentes.** Nada de memoria
  propia. Cada cifra, ley, fecha o estudio va con atribución en el texto (institución y año)
  y con su entrada en «Fuentes».
- **Ningún H2 puede apoyarse en una sola fuente**: cruza al menos dos en cada sección de
  contenido.
- **No copies oraciones**: ninguna frase de más de 12 palabras puede coincidir con una cita
  de la ficha. Es síntesis, no paráfrasis.
- **Fechas absolutas** («en marzo de 2025»); prohibido «recientemente», «este año», «hoy»,
  «actualmente», «hace poco».
- **La IA genera, calcula, predice, clasifica** — nunca piensa, siente, sabe, quiere, decide,
  miente.
- **Pueblos y lenguas**: «lengua», nunca «dialecto»; pueblo o comunidad, no tribu; las
  comunidades hacen, no reciben; sin «rescatar lenguas», «ancestral», «milenario».
- Respeta el rango de palabras del brief (wordRange) y su plantilla de secciones del manual.
- Abre con el openingType del brief y cierra con el closingType; el penúltimo H2 es accionable
  con al menos dos verbos dirigidos al lector.
- Si el brief trae differsFrom, tu ángulo debe distinguirse claramente de esas piezas.
- **Legibilidad**: si el brief trae communityPriority 1, oraciones de 16 palabras de promedio
  como máximo, ninguna de más de 28, y máximo 2 tecnicismos (esta pieza se traducirá a náhuatl
  y maya). En cualquier otro caso, oraciones de **14 a 20 palabras de promedio** y ninguna de
  más de 35: no escribas en frases telegráficas, la prosa debe fluir.
- Termina el cuerpo con la sección \`## Fuentes\`: lista numerada, título como texto del
  enlace, institución, publicación, mes y año, y tipo.
- NO escribas featured, publishDate, author, editor ni aiAssisted: eso lo pone el sistema.

3. Escribe el resultado con Write en \`${DIR}/piezas/${slug}.json\`:
\`\`\`json
{
  "slug": "${slug}",
  "frontmatter": {
    "title": "titular de dos tiempos, 60-110 caracteres",
    "summary": "la respuesta corta, completa y autosuficiente",
    "topic": "…", "subtopic": "…", "format": "…",
    "audience": ["general"],
    "keywords": ["…"],
    "related": [],
    "term": "solo glosario", "gloss": "solo glosario, ≤160 caracteres",
    "paper": { "title": "…", "authors": ["…"], "year": 2024, "venue": "…", "doi": "…", "url": "https://…" },
    "ficha": { "kind": "proyecto|herramienta|caso", "org": "…", "country": "…", "url": "https://…", "year": 2024 }
  },
  "body": "## Primer H2\\n\\ntexto…\\n\\n## Fuentes\\n\\n1. Institución, [Título](https://…), mes y año. Tipo.",
  "claims": [{ "text": "afirmación con cifra", "sourceIds": ["S1","S3"], "certainty": "documentado|sugerido|desconocido" }],
  "glossaryTermsUsed": ["alucinacion"],
  "wordCount": 742,
  "selfCheck": { "forbiddenPhrases": 0, "relativeDates": 0, "anthropomorphism": 0, "everyH2HasTwoSources": true }
}
\`\`\`
(incluye "paper" solo si el formato es paper, "ficha" solo si es ficha, "term"/"gloss" solo si
es glosario). Devuelve solo el resumen estructurado.`,
      { label: `redactar:${slug}`, phase: 'Redactar', schema: WRITE_SCHEMA }
    )
  },

  // --- ETAPA 3: auditoría con el checklist ---
  (write, slug) => {
    if (!write || write.status !== 'ok') return null
    return agent(
      `Eres editor de calidad de CIUDADAN-IA. Audita la pieza **${slug}** con el checklist de 15 ítems del manual de estilo.

1. Lee la pieza \`${DIR}/piezas/${slug}.json\`, su ficha de fuentes \`${DIR}/fuentes/${slug}.json\`,
   su brief \`${DIR}/briefs.json\` y la sección 12 del manual \`${MANUAL}\`.
2. Corre las verificaciones mecánicas disponibles:
   \`node -e "import('./scripts/editorial/lib.mjs').then(async m=>{const fs=await import('node:fs');const p=JSON.parse(fs.readFileSync('${DIR}/piezas/${slug}.json','utf8'));const b=JSON.parse(fs.readFileSync('${DIR}/briefs.json','utf8')).find(x=>x.slug==='${slug}');const tier=b&&b.communityPriority===1?'comunitaria':'general';const met=m.readability(p.body);console.log(JSON.stringify(met));console.log(JSON.stringify(m.checkReadability(met,tier)));console.log(JSON.stringify(m.scanForbidden(p.frontmatter.title+' '+p.frontmatter.summary+' '+p.body)))})"\`
   El ítem 12 se juzga con el resultado de checkReadability: si \`pass\` es false, falla.
3. **Verifica una fuente al azar y todos los DOI**: ábrela con WebFetch y comprueba que el
   título coincide y que el keyFact citado está realmente ahí. Si una fuente no abre o el dato
   no está, es fallo del ítem 5.
4. Juzga los 15 ítems. Los hard fails son 1 (titular), 3 (extensión), 4 (cifras sin fuente),
   5 (fuentes), 6 (paráfrasis: algún H2 con una sola fuente, u oración de más de 12 palabras
   copiada), 10 (frases prohibidas o antropomorfismo), 13 (respeto a pueblos), 14 (fechas
   relativas), 15 (frontmatter y slug). Los 7 ítems restantes valen 14.3 puntos cada uno.
   Veredicto: **publish** con 0 hard fails y puntaje ≥80; **revise** con 65-79 o un solo hard
   fail corregible (ítems 1, 3, 7, 14); **reject** con dos o más hard fails, cualquier fallo en
   5, 6 o 13, o puntaje menor a 65.
5. Si el veredicto es **revise** y puedes corregirlo sin volver a investigar (titular,
   extensión, enlaces al glosario, una fecha relativa), aplica la corrección directamente al
   archivo de la pieza con Edit, anótala y sube el veredicto a publish.

6. Escribe el informe con Write en \`${DIR}/qa/${slug}.json\`:
\`\`\`json
{
  "slug": "${slug}",
  "verdict": "publish|revise|reject",
  "score": 87.5,
  "hardFails": [],
  "items": { "1": "pass", "2": "pass", "…": "…", "15": "pass" },
  "notes": [{ "item": 7, "quote": "…", "fix": "…" }],
  "spotCheck": { "sourceId": "S3", "refetched": true, "stillMatches": true },
  "editsApplied": ["…"],
  "reviewPriority": "normal|alta",
  "flags": [],
  "metrics": { "words": 742, "avgSentence": 17.8, "maxSentence": 31, "inflesz": 64 }
}
\`\`\`
Sé estricto: es preferible rechazar una pieza que publicar una con una fuente inventada.
Devuelve solo el resumen estructurado.`,
      { label: `qa:${slug}`, phase: 'Auditar', schema: QA_SCHEMA }
    )
  },

  // --- ETAPA 4: traducción al inglés y, si es comunitaria, a náhuatl y maya ---
  async (qa, slug) => {
    if (!qa) return null
    if (qa.verdict !== 'publish') return { qa, translation: null }
    const translation = await agent(
      `Eres traductor de CIUDADAN-IA. Traduce la pieza **${slug}**, ya aprobada en español.

1. Lee la pieza \`${DIR}/piezas/${slug}.json\` y su brief en \`${DIR}/briefs.json\`
   (objeto con "slug" = "${slug}").

2. **Siempre: inglés.** Escribe \`${DIR}/traducciones/${slug}.en.json\` con la misma forma
   que la pieza original (frontmatter + body).
   - **Mismo número de H2 y de párrafos que el original**: las versiones quedan alineadas
     párrafo a párrafo, lo que sirve para la vista bilingüe y para el corpus.
   - **No traduzcas los títulos de las fuentes ni las URLs**: en el cuerpo, la sección final
     pasa a llamarse \`## Sources\` pero cada entrada conserva el título original de la
     publicación; solo se traduce la coletilla de tipo (peer-reviewed, report, law, feature,
     press release, official documentation, dataset) y el mes.
   - El titular se **reescribe** con la regla de dos tiempos en inglés (situación. consecuencia
     humana), 60-110 caracteres — no es una traducción literal.
   - Cifras en formato inglés (punto decimal, coma de miles). Fechas absolutas.
   - En el frontmatter pon solo: title, lang "en", status "traducido-ia", summary, translator
     "IA (Claude) — pending human review". **No incluyas sources** (las hereda del original).

3. **Solo si el brief trae communityPriority 1**: traduce también a náhuatl (\`nah\`) y maya
   yucateco (\`yua\`), en \`${DIR}/traducciones/${slug}.nah.json\` y \`${slug}.yua.json\`.
   - Antes de traducir, lee \`/Users/felipesolarluksic/CIUDADAN-IA/editorial/terminologia-nah.json\`
     y \`terminologia-yua.json\` (si no existen, créalos con \`{}\`). Son un diccionario
     \`{ "término en español": { "forma": "...", "nota": "...", "primeraPieza": "slug" } }\`.
     **Usa la forma ya acordada** cuando el término esté ahí; cuando introduzcas un término
     nuevo, añádelo al archivo con Edit o Write para que las siguientes piezas lo reutilicen.
     La consistencia terminológica entre piezas es lo que hace revisable el corpus.
   - Ortografía: náhuatl según normas del INALI; maya yucateco según la Academia de la Lengua
     Maya. Respeta saltillo (ꞌ), glotal y vocales largas.
   - status "traducido-ia"; translator "IA (Claude) — ayamo oquittaqueh tlahtohqueh" para nah
     y "IA (Claude) — ma' xoka'ak tumen máaxo'ob t'anik le t'aano'" para yua.
   - Si un concepto no tiene forma establecida en la lengua, **no lo inventes en silencio**:
     usa el préstamo del español y anótalo en el archivo de terminología con la nota
     «préstamo, pendiente de acuerdo con hablantes».

4. Reglas comunes: no traduzcas nombres propios ni de instituciones; mantén los enlaces
   internos tal cual (\`/articulos/...\`); conserva el orden y el número de elementos de las
   listas.

Devuelve el resumen estructurado de la traducción al inglés (las demás van en \`note\`).`,
      { label: `traducir:${slug}`, phase: 'Traducir', schema: TRANSLATE_SCHEMA }
    )
    return { qa, translation }
  }
)

const done = results.filter(Boolean)
const translated = done.map((r) => r.translation).filter(Boolean)
log(`Traducidas: ${translated.filter((t) => t.status === 'ok').length} al inglés`)

const qa = done.map((r) => r.qa).filter(Boolean)
const publish = qa.filter((r) => r.verdict === 'publish')
const revise = qa.filter((r) => r.verdict === 'revise')
const reject = qa.filter((r) => r.verdict === 'reject')
log(`QA: ${publish.length} publish · ${revise.length} revise · ${reject.length} reject (de ${SLUGS.length} piezas)`)

return {
  batch: args.batch,
  total: SLUGS.length,
  completed: qa.length,
  publish: publish.map((r) => r.slug),
  revise: revise.map((r) => ({ slug: r.slug, score: r.score, note: r.note })),
  reject: reject.map((r) => ({ slug: r.slug, hardFails: r.hardFails, note: r.note })),
  translated: translated.filter((t) => t.status === 'ok').map((t) => t.slug),
  avgScore: qa.length ? Number((qa.reduce((n, r) => n + (r.score ?? 0), 0) / qa.length).toFixed(1)) : 0,
}
