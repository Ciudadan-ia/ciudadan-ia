#!/usr/bin/env node
/**
 * Detector de duplicados del registro editorial (docs/manual-de-estilo.md, y
 * el mecanismo anti-duplicados del plan de la feature 002).
 *
 *   node scripts/editorial/dedup.mjs            # audita todo el registro
 *   node scripts/editorial/dedup.mjs --json     # salida JSON para agentes
 *
 * Umbrales: Jaccard de keywords ≥0.5 en el mismo tema = duplicado probable;
 * 0.35-0.5 = revisar; ≥0.6 entre temas = revisar; Dice de trigramas del
 * título ≥0.6 = revisar.
 */
import { loadRegistro, keywordSet, jaccard, diceTrigrams } from './lib.mjs';

const asJson = process.argv.includes('--json');
const reg = loadRegistro();
const seeds = reg.seeds;

const sets = new Map(seeds.map((s) => [s.slug, keywordSet(s)]));
const findings = [];

for (let i = 0; i < seeds.length; i++) {
  for (let j = i + 1; j < seeds.length; j++) {
    const a = seeds[i];
    const b = seeds[j];
    const jk = jaccard(sets.get(a.slug), sets.get(b.slug));
    const dt = diceTrigrams(a.workingTitle, b.workingTitle);
    const sameTopic = a.topic === b.topic;
    let level = null;
    if (sameTopic && jk >= 0.5) level = 'duplicado-probable';
    else if (sameTopic && jk >= 0.35) level = 'revisar';
    else if (!sameTopic && jk >= 0.6) level = 'revisar';
    if (dt >= 0.6) level = 'revisar';
    if (level) findings.push({ level, slugA: a.slug, slugB: b.slug, jaccard: +jk.toFixed(2), dice: +dt.toFixed(2), sameTopic, formatA: a.format, formatB: b.format });
  }
}

// Colisiones de slug (rompen el build)
const seen = new Map();
const collisions = [];
for (const s of seeds) {
  if (seen.has(s.slug)) collisions.push(s.slug);
  seen.set(s.slug, true);
}

const dupProbable = findings.filter((f) => f.level === 'duplicado-probable');
const review = findings.filter((f) => f.level === 'revisar');

if (asJson) {
  console.log(JSON.stringify({ collisions, dupProbable, review }, null, 2));
} else {
  console.log(`Registro: ${seeds.length} semillas`);
  console.log(`Colisiones de slug: ${collisions.length}${collisions.length ? ' → ' + collisions.join(', ') : ''}`);
  console.log(`Duplicados probables (mismo tema, Jaccard ≥0.5): ${dupProbable.length}`);
  for (const f of dupProbable.slice(0, 20)) {
    console.log(`  [${f.formatA}/${f.formatB}] ${f.slugA} ⟷ ${f.slugB}  (J=${f.jaccard} D=${f.dice})`);
  }
  console.log(`A revisar: ${review.length}`);
  for (const f of review.slice(0, 15)) {
    console.log(`  · ${f.slugA} ⟷ ${f.slugB}  (J=${f.jaccard} D=${f.dice}${f.sameTopic ? '' : ', temas distintos'})`);
  }
}

process.exit(collisions.length ? 1 : 0);
