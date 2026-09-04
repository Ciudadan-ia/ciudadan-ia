#!/usr/bin/env node
/**
 * Selecciona las semillas de un lote y construye sus briefs (plan 002, C.1).
 * Determinista: misma entrada → mismos briefs. La rotación de aperturas y
 * cierres evita la monotonía de estilo entre piezas del mismo lote.
 *
 *   node scripts/editorial/build-briefs.mjs --batch 1 --size 50 [--only formato]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadRegistro, saveRegistro } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(k);
  return i === -1 ? d : argv[i + 1];
};
const BATCH = Number(arg('--batch', 1));
const SIZE = Number(arg('--size', 50));
const ONLY = arg('--only', null);
const MIX_ARG = arg('--mix', null); // ej: "explicador:1,pregunta:1,glosario:1,ficha:1,paper:1"

/** Composición de los lotes de lanzamiento (plan 002, C.0). */
const MIX = { explicador: 15, pregunta: 15, glosario: 10, ficha: 5, paper: 5 };
const OPENINGS = ['escena', 'dato', 'pregunta', 'contraste', 'caso-local', 'objeto-cotidiano', 'cita'];
const CLOSINGS = ['protocolo', 'exigencia', 'pregunta-siguiente', 'matiz'];

const reg = loadRegistro();
const available = reg.seeds.filter((s) => s.state === 'planned');

/** Selección estratificada: respeta la mezcla y reparte entre temas. */
function pick() {
  const chosen = [];
  const target = MIX_ARG
    ? Object.fromEntries(MIX_ARG.split(',').map((p) => {
        const [f, n] = p.split(':');
        return [f.trim(), Number(n)];
      }))
    : ONLY
      ? { [ONLY]: SIZE }
      : MIX;
  for (const [format, count] of Object.entries(target)) {
    const pool = available.filter((s) => s.format === format && !chosen.includes(s));
    // ordenar por tema rotando, y priorizar piezas comunitarias y "puerta"
    const byTopic = new Map();
    for (const s of pool) {
      if (!byTopic.has(s.topic)) byTopic.set(s.topic, []);
      byTopic.get(s.topic).push(s);
    }
    for (const list of byTopic.values()) {
      list.sort((a, b) => (a.communityPriority ?? 3) - (b.communityPriority ?? 3));
    }
    const topics = [...byTopic.keys()].sort();
    let i = 0;
    while (chosen.filter((s) => s.format === format).length < count) {
      const topic = topics[i % topics.length];
      const list = byTopic.get(topic);
      if (list?.length) chosen.push(list.shift());
      i++;
      if (i > pool.length + topics.length) break;
    }
  }
  return chosen.slice(0, SIZE);
}

const batch = pick();
const byFormat = {};
for (const s of batch) byFormat[s.format] = (byFormat[s.format] ?? 0) + 1;

const WORDS = {
  explicador: [600, 900],
  pregunta: [300, 500],
  glosario: [150, 300],
  ficha: [400, 600],
  paper: [500, 700],
};

const briefs = batch.map((s, i) => ({
  slug: s.slug,
  format: s.format,
  topic: s.topic,
  subtopic: s.subtopic,
  workingTitle: s.workingTitle,
  angle: s.angle,
  term: s.term,
  audience: s.audience,
  communityPriority: s.communityPriority ?? 3,
  reviewPriority: s.reviewPriority ?? 'normal',
  latamAnchor: s.latamAnchor ?? 'preferred',
  wordRange: WORDS[s.format],
  keywords: s.keywords,
  openingType: OPENINGS[i % OPENINGS.length],
  closingType: CLOSINGS[i % CLOSINGS.length],
  differsFrom: (reg.overlaps?.[s.slug] ?? []).slice(0, 2),
  sourceTargets: {
    min: s.format === 'glosario' ? 3 : s.format === 'pregunta' ? 3 : 4,
    max: s.format === 'glosario' ? 4 : s.format === 'pregunta' ? 5 : 7,
    latam: s.latamAnchor === 'required' ? 1 : 0,
  },
  batch: BATCH,
}));

const dir = new URL(`../../../editorial/lotes/lote-${String(BATCH).padStart(2, '0')}/`, import.meta.url).pathname;
mkdirSync(join(dir, 'fuentes'), { recursive: true });
mkdirSync(join(dir, 'piezas'), { recursive: true });
mkdirSync(join(dir, 'qa'), { recursive: true });
writeFileSync(join(dir, 'briefs.json'), JSON.stringify(briefs, null, 2) + '\n');

// Marcar en el registro
for (const s of batch) {
  s.state = 'briefed';
  s.batch = BATCH;
}
saveRegistro(reg);

console.log(`Lote ${BATCH}: ${briefs.length} briefs → ${join(dir, 'briefs.json')}`);
console.log('Por formato:', JSON.stringify(byFormat));
const topics = {};
for (const s of batch) topics[s.topic] = (topics[s.topic] ?? 0) + 1;
console.log('Por tema:', JSON.stringify(topics));
console.log('Comunitarias (prioridad 1):', batch.filter((s) => s.communityPriority === 1).length);
console.log('Revisión alta:', batch.filter((s) => s.reviewPriority === 'alta').length);
