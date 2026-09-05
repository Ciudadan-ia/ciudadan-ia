export const meta = {
  name: 'traducir-lote',
  description: 'Traduce las piezas aprobadas de un lote al inglés y, si son comunitarias, a náhuatl y maya yucateco',
  phases: [{ title: 'Traducir', detail: 'un agente por pieza' }],
}

const BATCH = String(args.batch).padStart(2, '0')
const DIR = `/Users/felipesolarluksic/CIUDADAN-IA/editorial/lotes/lote-${BATCH}`
const TERM = '/Users/felipesolarluksic/CIUDADAN-IA/editorial'

const SCHEMA = {
  type: 'object',
  required: ['slug', 'langs', 'status'],
  properties: {
    slug: { type: 'string' },
    langs: { type: 'array', items: { type: 'string' } },
    status: { type: 'string', enum: ['ok', 'partial', 'failed'] },
    blocksMatch: { type: 'boolean', description: 'el número de H2 coincide con el original' },
    newTerms: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
}

phase('Traducir')
const results = await parallel(args.slugs.map((slug) => () =>
  agent(
    `Eres traductor de CIUDADAN-IA, un medio de divulgación sobre inteligencia artificial en español, inglés, náhuatl y maya yucateco.

TAREA: traducir la pieza **${slug}**, ya aprobada en español.

1. Lee la pieza \`${DIR}/piezas/${slug}.json\` y su brief en \`${DIR}/briefs.json\`
   (el objeto cuyo "slug" sea "${slug}"). Fíjate en su campo communityPriority.

2. **Siempre: inglés.** Escribe con Write \`${DIR}/traducciones/${slug}.en.json\`:
\`\`\`json
{ "frontmatter": { "title": "...", "summary": "...", "translator": "IA (Claude) — pending human review" },
  "body": "## First H2\\n\\n...\\n\\n## Sources\\n\\n1. ..." }
\`\`\`
   - **Mismo número de H2 y de párrafos que el original**: las versiones quedan alineadas, lo
     que sirve para la vista bilingüe y para el corpus.
   - El titular se **reescribe** con la regla de dos tiempos en inglés (situación. consecuencia
     humana), 60-110 caracteres; no es traducción literal.
   - La sección final pasa a llamarse \`## Sources\`, pero **cada entrada conserva el título
     original de la publicación y su URL**; solo se traduce la coletilla de tipo
     (peer-reviewed, report, law, feature, press release, official documentation, dataset) y
     el mes.
   - Cifras en formato inglés (punto decimal, coma de miles). Fechas absolutas.
   - No incluyas "sources" en el frontmatter: las hereda del original (es un gate del build).

3. **Solo si communityPriority es 1**, traduce también a náhuatl (\`nah\`) y maya yucateco
   (\`yua\`), en \`${DIR}/traducciones/${slug}.nah.json\` y \`${slug}.yua.json\`, con la misma
   forma. Antes de traducir:
   - Lee \`${TERM}/terminologia-nah.json\` y \`${TERM}/terminologia-yua.json\`. Son diccionarios
     \`{ "término en español": { "forma": "...", "nota": "...", "primeraPieza": "slug" } }\`.
     **Usa la forma ya acordada** si el término está; si introduces uno nuevo, **añádelo al
     archivo** con Edit para que las siguientes piezas lo reutilicen. La consistencia
     terminológica entre piezas es lo que hace revisable el corpus.
   - Ortografía: náhuatl según normas del INALI; maya yucateco según la Academia de la Lengua
     Maya. Respeta saltillo (ꞌ), oclusiva glotal y vocales largas con macrón.
   - translator: para nah \`"IA (Claude) — ayamo oquittaqueh tlahtohqueh"\`; para yua
     \`"IA (Claude) — ma' xoka'ak tumen máaxo'ob t'anik le t'aano'"\`.
   - Si un concepto no tiene forma establecida en la lengua, **no la inventes en silencio**:
     usa el préstamo del español y anótalo en el diccionario con la nota
     «préstamo, pendiente de acuerdo con hablantes».
   - Estas versiones se publican en vista bilingüe junto al español y llevan aviso de
     traducción pendiente de validación, así que prioriza la fidelidad sobre la elegancia.

4. Reglas comunes: no traduzcas nombres propios ni de instituciones; conserva los enlaces
   internos tal cual (\`/articulos/...\`); mantén el orden y el número de elementos de las
   listas; nunca escribas featured, publishDate, topic ni sources.

Devuelve el resumen estructurado: qué lenguas escribiste, si coincide el número de H2 y qué
términos nuevos añadiste al diccionario.`,
    { label: `traducir:${slug}`, phase: 'Traducir', schema: SCHEMA }
  )
))

const ok = results.filter(Boolean)
log(`${ok.length}/${args.slugs.length} piezas traducidas · ${ok.flatMap((r) => r.langs).length} archivos`)
return {
  batch: args.batch,
  translated: ok.map((r) => ({ slug: r.slug, langs: r.langs, status: r.status, blocksMatch: r.blocksMatch })),
  newTerms: ok.flatMap((r) => r.newTerms ?? []),
}
