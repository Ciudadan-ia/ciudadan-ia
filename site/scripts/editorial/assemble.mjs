#!/usr/bin/env node
/**
 * Ensambla las piezas aprobadas de un lote en archivos .md (plan 002, C.7).
 * Los modelos nunca escriben YAML: aquí se serializa el frontmatter validado.
 *
 *   node scripts/editorial/assemble.mjs --batch 1 --editor "Nombre" [--dry-run]
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadRegistro, saveRegistro, writePiece, readability, scanForbidden } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(k);
  return i === -1 ? d : argv[i + 1];
};
const BATCH = Number(arg('--batch', 1));
const EDITOR = arg('--editor', null);
const MODEL = arg('--model', 'claude-fable-5-1');
const MANUAL_VERSION = '1.0';
const DRY = argv.includes('--dry-run');

if (!EDITOR) {
  console.error('Falta --editor "Nombre de la persona responsable" (Principio V.b).');
  process.exit(1);
}

const dir = new URL(`../../../editorial/lotes/lote-${String(BATCH).padStart(2, '0')}/`, import.meta.url).pathname;
const piezasDir = join(dir, 'piezas');
const qaDir = join(dir, 'qa');
const fuentesDir = join(dir, 'fuentes');
const traduccionesDir = join(dir, 'traducciones');

if (!existsSync(piezasDir)) {
  console.error(`No existe ${piezasDir}`);
  process.exit(1);
}

const reg = loadRegistro();
const bySlug = new Map(reg.seeds.map((s) => [s.slug, s]));

let written = 0;
let translations = 0;
let skipped = 0;
const problems = [];

for (const file of readdirSync(piezasDir).filter((f) => f.endsWith('.json'))) {
  const slug = file.replace(/\.json$/, '');
  const piece = JSON.parse(readFileSync(join(piezasDir, file), 'utf8'));
  const qaFile = join(qaDir, file);
  const qa = existsSync(qaFile) ? JSON.parse(readFileSync(qaFile, 'utf8')) : null;

  if (!qa) {
    problems.push(`${slug}: sin informe de QA`);
    skipped++;
    continue;
  }
  if (qa.verdict !== 'publish') {
    problems.push(`${slug}: veredicto '${qa.verdict}' (${(qa.hardFails ?? []).join(', ') || 'puntaje ' + qa.score})`);
    skipped++;
    continue;
  }

  const sourcesFile = join(fuentesDir, file);
  const sources = existsSync(sourcesFile) ? JSON.parse(readFileSync(sourcesFile, 'utf8')).sources ?? [] : [];

  // Verificación final propia (no confiamos solo en el QA del agente)
  const forbidden = scanForbidden(`${piece.frontmatter.title}\n${piece.frontmatter.summary}\n${piece.body}`).filter((h) => !h.soft);
  if (forbidden.length) {
    problems.push(`${slug}: frases prohibidas → ${forbidden.map((h) => `"${h.match}" (${h.why})`).join('; ')}`);
    skipped++;
    continue;
  }
  const verified = sources.filter((s) => s.verified?.httpOk !== false && s.url?.startsWith('https://'));
  if (verified.length < 3 && piece.frontmatter.lang === 'es') {
    problems.push(`${slug}: ${verified.length} fuentes verificadas (mínimo 3 — Principio V)`);
    skipped++;
    continue;
  }

  const seed = bySlug.get(slug);
  const fm = {
    title: piece.frontmatter.title,
    lang: 'es',
    status: 'validado',
    summary: piece.frontmatter.summary,
    topic: piece.frontmatter.topic ?? seed?.topic,
    subtopic: piece.frontmatter.subtopic ?? seed?.subtopic,
    format: piece.frontmatter.format ?? seed?.format,
    audience: piece.frontmatter.audience ?? seed?.audience ?? ['general'],
    publishDate: seed?.publishDate ?? new Date().toISOString().slice(0, 10),
    author: 'Redacción CIUDADAN-IA',
    editor: EDITOR,
    aiAssisted: true,
    production: { model: MODEL, batch: BATCH, manualVersion: MANUAL_VERSION },
    keywords: piece.frontmatter.keywords ?? seed?.keywords ?? [],
    related: piece.frontmatter.related ?? [],
    sources: verified.slice(0, 8).map((s) => ({
      title: s.title,
      url: s.url,
      publisher: s.publisher,
      ...(s.date ? { date: String(s.date).slice(0, 10) } : {}),
      ...(s.type ? { type: s.type } : {}),
      ...(s.license ? { license: s.license } : {}),
      ...(s.isPrimary ? { isPrimary: true } : {}),
      ...(s.isLatam ? { isLatam: true } : {}),
    })),
  };
  if (fm.format === 'glosario') {
    fm.term = piece.frontmatter.term ?? seed?.term;
    fm.gloss = piece.frontmatter.gloss;
  }
  if (fm.format === 'paper' && piece.frontmatter.paper) fm.paper = piece.frontmatter.paper;
  if (fm.format === 'ficha' && piece.frontmatter.ficha) fm.ficha = piece.frontmatter.ficha;
  if (qa.reviewedBy) fm.review = { by: qa.reviewedBy, date: qa.reviewedAt };

  const metrics = readability(piece.body);

  if (!DRY) {
    writePiece(slug, 'es', fm, piece.body);
    if (seed) {
      seed.state = 'written';
      seed.qaScore = qa.score;
      seed.metrics = metrics;
      seed.langs = ['es'];
    }
  }
  written++;

  // Traducciones: heredan tema, formato y fecha del original; NUNCA las fuentes
  // (viven solo en es.md y el render las hereda — gate del schema).
  for (const lang of ['en', 'nah', 'yua']) {
    const tFile = join(traduccionesDir, `${slug}.${lang}.json`);
    if (!existsSync(tFile)) continue;
    let t;
    try {
      t = JSON.parse(readFileSync(tFile, 'utf8'));
    } catch (err) {
      problems.push(`${slug} (${lang}): JSON inválido — ${err.message}`);
      continue;
    }
    if (!t.frontmatter?.title || !t.frontmatter?.summary || !t.body) {
      problems.push(`${slug} (${lang}): traducción incompleta (falta title, summary o body)`);
      continue;
    }
    const tForbidden = scanForbidden(`${t.frontmatter.title}\n${t.frontmatter.summary}`).filter((h) => !h.soft);
    if (lang === 'en' ? false : tForbidden.length > 0) {
      problems.push(`${slug} (${lang}): frases prohibidas → ${tForbidden.map((h) => h.match).join('; ')}`);
      continue;
    }
    const tfm = {
      title: t.frontmatter.title,
      lang,
      status: 'traducido-ia',
      summary: t.frontmatter.summary,
      topic: fm.topic,
      subtopic: fm.subtopic,
      format: fm.format,
      audience: fm.audience,
      publishDate: fm.publishDate,
      author: fm.author,
      editor: fm.editor,
      translator: t.frontmatter.translator ?? 'IA (Claude) — pendiente de revisión humana',
      aiAssisted: true,
      production: fm.production,
      keywords: fm.keywords,
      related: fm.related,
    };
    if (fm.format === 'glosario') {
      tfm.term = t.frontmatter.term ?? fm.term;
      tfm.gloss = t.frontmatter.gloss ?? fm.gloss;
    }
    if (fm.paper) tfm.paper = fm.paper;
    if (fm.ficha) tfm.ficha = fm.ficha;
    writePiece(slug, lang, tfm, t.body);
    if (seed) seed.langs = [...new Set([...(seed.langs ?? ['es']), lang])];
    translations++;
  }
}

if (!DRY) saveRegistro(reg);

console.log(
  `Lote ${BATCH}: ${written} piezas escritas · ${translations} traducciones · ${skipped} omitidas${DRY ? ' (--dry-run)' : ''}`,
);
if (problems.length) {
  console.log('\nProblemas:');
  for (const p of problems) console.log(`  ✗ ${p}`);
}
