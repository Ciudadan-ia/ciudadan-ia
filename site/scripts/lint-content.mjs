#!/usr/bin/env node
/**
 * Lint de contenido previo al build (plan 002, A8). Ve lo que Zod no puede ver:
 * duplicados entre archivos, el calendario completo y los rangos de palabras.
 * Falla (exit 1) con errores; solo avisa con las advertencias.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../src/content/articles/', import.meta.url).pathname;
const TAXONOMY = new URL('../src/i18n/taxonomy.ts', import.meta.url).pathname;

const FORMAT_WORDS = {
  explicador: [600, 900],
  pregunta: [300, 500],
  glosario: [150, 300],
  ficha: [400, 600],
  paper: [500, 700],
};
const TOLERANCE = 0.1;

const taxSrc = readFileSync(TAXONOMY, 'utf8');
const RESERVED = [...taxSrc.matchAll(/^\s+'([a-z0-9-]+)',$/gm)]
  .map((m) => m[1])
  .filter((s) => taxSrc.indexOf(`'${s}'`) > taxSrc.indexOf('RESERVED_SLUGS'));

const errors = [];
const warnings = [];

/** Parser mínimo de frontmatter: solo lo que el lint necesita. */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const fm = {};
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (rest === '>' || rest === '|') {
      const buf = [];
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1])) buf.push(lines[++i].trim());
      fm[key] = buf.join(' ');
    } else if (rest === '') {
      // bloque anidado (sources, audio, paper…): contar sus entradas de lista
      const buf = [];
      while (i + 1 < lines.length && /^\s{2,}/.test(lines[i + 1])) buf.push(lines[++i]);
      fm[key] = buf;
    } else {
      fm[key] = rest.replace(/^["']|["']$/g, '');
    }
  }
  return { fm, body: raw.slice(m[0].length) };
}

const slugs = new Set();
const langsBySlug = new Map();
const pieces = [];

for (const slug of readdirSync(ROOT)) {
  const dir = join(ROOT, slug);
  if (!statSync(dir).isDirectory()) continue;
  const norm = slug.normalize('NFC').toLowerCase();
  if (slugs.has(norm)) errors.push(`slug duplicado: ${slug}`);
  slugs.add(norm);
  if (RESERVED.includes(norm)) errors.push(`slug reservado por una ruta: ${slug}`);

  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  langsBySlug.set(slug, files.map((f) => f.replace(/\.md$/, '')));

  for (const file of files) {
    const lang = file.replace(/\.md$/, '');
    const raw = readFileSync(join(dir, file), 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      errors.push(`${slug}/${file}: sin frontmatter`);
      continue;
    }
    const { fm, body } = parsed;
    pieces.push({ slug, lang, fm, body });

    // publishDate válida y en ventana razonable
    const pd = String(fm.publishDate ?? '');
    if (!/^\d{4}-\d{2}-\d{2}/.test(pd)) {
      errors.push(`${slug}/${file}: publishDate inválida ('${pd}')`);
    } else {
      const d = new Date(pd);
      const max = new Date();
      max.setMonth(max.getMonth() + 12);
      if (d < new Date('2026-08-01')) errors.push(`${slug}/${file}: publishDate anterior a 2026-08-01`);
      if (d > max) errors.push(`${slug}/${file}: publishDate más de 12 meses en el futuro (${pd})`);
    }

    // fuentes: solo en es, ≥3 si aiAssisted
    const isAi = String(fm.aiAssisted) === 'true';
    const sourceEntries = Array.isArray(fm.sources) ? fm.sources.filter((l) => /^\s+-\s/.test(l)).length : 0;
    if (lang !== 'es' && sourceEntries > 0) {
      errors.push(`${slug}/${file}: las fuentes viven solo en es.md`);
    }
    if (lang === 'es' && isAi && sourceEntries < 3) {
      errors.push(`${slug}/${file}: pieza aiAssisted con ${sourceEntries} fuentes (mínimo 3 — Principio V)`);
    }
    if (lang === 'es' && isAi && !fm.editor) {
      errors.push(`${slug}/${file}: pieza aiAssisted sin 'editor' (Principio V.b)`);
    }

    // URLs https y sin repetir
    const urls = [...raw.matchAll(/url:\s*"?(https?:\/\/[^"\s]+)"?/g)].map((m) => m[1]);
    for (const u of urls) if (!u.startsWith('https://')) errors.push(`${slug}/${file}: fuente no https (${u})`);
    if (new Set(urls).size !== urls.length) errors.push(`${slug}/${file}: fuentes con URL repetida`);

    // rango de palabras por formato (aviso) — solo para piezas escritas bajo el
    // manual de estilo; las 6 del MVP son anteriores y tienen su propia longitud.
    const fmt = fm.format ?? 'explicador';
    const range = FORMAT_WORDS[fmt];
    const underManual = raw.includes('manualVersion:');
    if (range && underManual) {
      const clean = body.replace(/^##\s+Fuentes[\s\S]*$/m, '');
      const words = clean.split(/\s+/).filter(Boolean).length;
      const [lo, hi] = [Math.floor(range[0] * (1 - TOLERANCE)), Math.ceil(range[1] * (1 + TOLERANCE))];
      if (words < lo || words > hi) {
        warnings.push(`${slug}/${file}: ${words} palabras, fuera del rango de '${fmt}' (${lo}-${hi})`);
      }
    }
  }
}

// toda traducción necesita su original en español
for (const [slug, langs] of langsBySlug) {
  if (!langs.includes('es')) errors.push(`${slug}: hay traducciones (${langs.join(', ')}) sin es.md`);
}

// histograma del calendario
const byDate = new Map();
for (const p of pieces) {
  if (p.lang !== 'es') continue;
  const d = String(p.fm.publishDate ?? '').slice(0, 10);
  byDate.set(d, (byDate.get(d) ?? 0) + 1);
}
const now = new Date().toISOString().slice(0, 10);
const future = [...byDate.entries()].filter(([d]) => d > now).sort();
const published = [...byDate.entries()].filter(([d]) => d <= now);

console.log(`— lint de contenido —`);
console.log(`${slugs.size} slugs · ${pieces.length} archivos · ${published.reduce((n, [, c]) => n + c, 0)} publicadas · ${future.reduce((n, [, c]) => n + c, 0)} en cola`);
if (future.length) {
  console.log(`Cola editorial (primeras fechas):`);
  for (const [d, n] of future.slice(0, 10)) console.log(`  ${d}: ${n}`);
  if (future.length > 10) console.log(`  … ${future.length - 10} fechas más`);
}

for (const w of warnings.slice(0, 25)) console.log(`  (aviso) ${w}`);
if (warnings.length > 25) console.log(`  (aviso) … ${warnings.length - 25} avisos más`);

if (errors.length) {
  console.log(`\n✗ ${errors.length} error(es):`);
  for (const e of errors.slice(0, 30)) console.log(`   ${e}`);
  if (errors.length > 30) console.log(`   … ${errors.length - 30} más`);
  process.exit(1);
}
console.log(`\n✓ sin errores`);
