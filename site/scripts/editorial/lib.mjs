/** Utilerías compartidas del sistema editorial (docs/manual-de-estilo.md). */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const REGISTRO = new URL('../../../editorial/registro.json', import.meta.url).pathname;
export const CONTENT_DIR = new URL('../../src/content/articles/', import.meta.url).pathname;

export function loadRegistro() {
  return JSON.parse(readFileSync(REGISTRO, 'utf8'));
}
export function saveRegistro(data) {
  writeFileSync(REGISTRO, JSON.stringify(data, null, 2) + '\n');
}

/** Normaliza una keyword: minúsculas, sin acentos, sin plural simple, sinónimos controlados. */
const SYNONYMS = {
  chatbot: 'chatbot',
  asistente: 'chatbot',
  bot: 'chatbot',
  llm: 'modelo-lenguaje',
  'modelo de lenguaje': 'modelo-lenguaje',
  'inteligencia artificial': 'ia',
  ia: 'ia',
};
const STOP = new Set(['de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'o', 'en', 'con', 'para', 'por', 'que', 'del', 'al', 'su', 'sus']);

export function normKeyword(k) {
  let s = String(k)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '');
  if (SYNONYMS[s]) return SYNONYMS[s];
  s = s
    .split(/[\s-]+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => w.replace(/ciones$/, 'cion').replace(/(?<=..)es$/, '').replace(/(?<=..)s$/, ''))
    .join('-');
  return SYNONYMS[s] ?? s;
}

export function keywordSet(seed) {
  return new Set((seed.keywords ?? []).map(normKeyword).filter(Boolean));
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Coeficiente de Dice sobre trigramas de caracteres (títulos). */
export function diceTrigrams(s1, s2) {
  const tri = (s) => {
    const t = new Set();
    const clean = ' ' + String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ') + ' ';
    for (let i = 0; i < clean.length - 2; i++) t.add(clean.slice(i, i + 3));
    return t;
  };
  const a = tri(s1);
  const b = tri(s2);
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return (2 * inter) / (a.size + b.size);
}

/** Sílabas aproximadas del español (para INFLESZ). */
export function countSyllables(word) {
  const w = word.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiou]+/g);
  if (!groups) return 1;
  // Cada grupo vocálico cuenta 1 (los diptongos ya van juntos); hiatos fuertes suman.
  let n = groups.length;
  for (const g of groups) {
    if (g.length >= 3) n += 1;
  }
  return Math.max(1, n);
}

/**
 * Umbrales de legibilidad del manual §1. Dos objetivos: el general y el de las
 * piezas que se traducen a lenguas originarias, que necesitan oraciones más
 * cortas para que la traducción no se deforme.
 */
export const READABILITY_TARGETS = {
  general: { avgMin: 14, avgMax: 20, maxSentence: 35, maxParagraph: 100, inflesz: 60 },
  comunitaria: { avgMin: 0, avgMax: 16, maxSentence: 28, maxParagraph: 90, inflesz: 65 },
};

/**
 * Evalúa las métricas contra el umbral que corresponda.
 * @param {ReturnType<typeof readability>} m
 * @param {'general'|'comunitaria'} tier
 */
export function checkReadability(m, tier = 'general') {
  const t = READABILITY_TARGETS[tier] ?? READABILITY_TARGETS.general;
  const fails = [];
  if (m.avgSentence > t.avgMax) fails.push(`promedio ${m.avgSentence} > ${t.avgMax} palabras/oración`);
  if (t.avgMin && m.avgSentence < t.avgMin) fails.push(`promedio ${m.avgSentence} < ${t.avgMin} palabras/oración (prosa telegráfica)`);
  if (m.maxSentence > t.maxSentence) fails.push(`oración de ${m.maxSentence} palabras (máximo ${t.maxSentence})`);
  if (m.maxParagraph > t.maxParagraph) fails.push(`párrafo de ${m.maxParagraph} palabras (máximo ${t.maxParagraph})`);
  if (m.inflesz < t.inflesz) fails.push(`INFLESZ ${m.inflesz} < ${t.inflesz}`);
  return { tier, pass: fails.length === 0, fails, target: t };
}

/** Métricas de legibilidad (manual §1 y §12 ítem 12). */
export function readability(body) {
  const text = body.replace(/^##\s+Fuentes[\s\S]*$/m, '').replace(/^#+\s.*$/gm, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2);
  const words = text.split(/\s+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const sylls = words.reduce((n, w) => n + countSyllables(w), 0);
  const perSentence = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const avgSentence = perSentence.length ? perSentence.reduce((a, b) => a + b, 0) / perSentence.length : 0;
  const inflesz = words.length && sentences.length
    ? 206.835 - 62.3 * (sylls / words.length) - words.length / sentences.length
    : 0;
  return {
    words: words.length,
    sentences: sentences.length,
    avgSentence: Number(avgSentence.toFixed(1)),
    maxSentence: perSentence.length ? Math.max(...perSentence) : 0,
    maxParagraph: paragraphs.length ? Math.max(...paragraphs.map((p) => p.split(/\s+/).filter(Boolean).length)) : 0,
    inflesz: Number(inflesz.toFixed(1)),
  };
}

/** Listas negras del manual §11 (hard fail 10 y 14). */
export const FORBIDDEN = [
  { re: /\bla ia (piensa|siente|quiere|entiende|sabe|decide|cree|miente)/i, why: 'antropomorfismo literal (§11)' },
  { re: /\b(revoluci[oó]n|disrupci[oó]n|sin precedentes|era digital)\b/i, why: 'humo (§11)' },
  { re: /\bno es ciencia ficci[oó]n\b/i, why: 'humo (§11)' },
  { re: /\b(los expertos dicen|estudios demuestran|es bien sabido|se sabe que)\b/i, why: 'autoridad vacía (§11)' },
  { re: /\b(es inevitable|tarde o temprano)\b/i, why: 'predicción absoluta (§11)' },
  { re: /\b(haz clic aqu[ií]|en este enlace)\b/i, why: 'enlace sin título (§11)' },
  { re: /\bdialecto\b/i, why: 'falta de respeto a lenguas (§9)' },
  { re: /\btribu\b/i, why: 'término inadecuado para pueblos (§9)' },
  { re: /\b(rescatar|salvar) (la |las )?lenguas?\b/i, why: 'paternalismo lingüístico (§9)' },
  { re: /\b(milenari[oa]s?|ancestral(es)?)\b/i, why: 'folklorización decorativa (§9)' },
  { re: /\bimagina que\b/i, why: 'apertura gastada (§11)', soft: true },
  { re: /\ben los [uú]ltimos a[nñ]os\b/i, why: 'apertura gastada (§11)', soft: true },
];

export const RELATIVE_DATES = [
  /\brecientemente\b/i,
  /\beste a[nñ]o\b/i,
  /\bactualmente\b/i,
  /\bhoy en d[ií]a\b/i,
  /\bel mes pasado\b/i,
  /\bla semana pasada\b/i,
  /\bhace poco\b/i,
  /\b[uú]ltimamente\b/i,
];

export function scanForbidden(text) {
  const hits = [];
  for (const { re, why, soft } of FORBIDDEN) {
    const m = text.match(re);
    if (m) hits.push({ match: m[0], why, soft: !!soft });
  }
  for (const re of RELATIVE_DATES) {
    const m = text.match(re);
    if (m) hits.push({ match: m[0], why: 'fecha relativa (§8, hard fail 14)' });
  }
  return hits;
}

/** Escribe el frontmatter YAML de forma segura: los modelos nunca escriben YAML. */
function yamlScalar(v) {
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  const s = String(v);
  if (/^[\w./-]+$/.test(s) && !/^\d/.test(s)) return s;
  return JSON.stringify(s);
}

/**
 * Serializa un valor a YAML en bloque. `indent` es la columna donde empiezan
 * las claves de este nivel. Devuelve las líneas ya indentadas, precedidas de
 * salto cuando son un bloque (para pegarlas tras `clave:`).
 */
function yamlValue(v, indent) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (v.every((x) => x === null || typeof x !== 'object')) {
      return `[${v.map(yamlScalar).join(', ')}]`;
    }
    // Lista de objetos: «- » y las claves del objeto alineadas dos columnas más.
    return (
      '\n' +
      v
        .map((item) => {
          const entries = Object.entries(item).filter(([, x]) => x !== undefined && x !== null);
          return entries
            .map(([k, x], i) => `${pad}${i === 0 ? '- ' : '  '}${k}: ${yamlValue(x, indent + 4)}`)
            .join('\n');
        })
        .join('\n')
    );
  }
  if (v && typeof v === 'object') {
    const entries = Object.entries(v).filter(([, x]) => x !== undefined && x !== null);
    if (!entries.length) return '{}';
    return '\n' + entries.map(([k, x]) => `${pad}${k}: ${yamlValue(x, indent + 2)}`).join('\n');
  }
  return yamlScalar(v);
}

export function serializeFrontmatter(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (k === 'summary') {
      const wrapped = String(v).replace(/\s+/g, ' ').trim();
      lines.push('summary: >');
      let line = '';
      for (const word of wrapped.split(' ')) {
        if ((line + ' ' + word).trim().length > 88) {
          lines.push('  ' + line.trim());
          line = word;
        } else line += ' ' + word;
      }
      if (line.trim()) lines.push('  ' + line.trim());
      continue;
    }
    const rendered = yamlValue(v, 2);
    lines.push(rendered.startsWith('\n') ? `${k}:${rendered}` : `${k}: ${rendered}`);
  }
  lines.push('---');
  return lines.join('\n');
}

export function writePiece(slug, lang, frontmatter, body) {
  const dir = join(CONTENT_DIR, slug);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${lang}.md`);
  writeFileSync(file, serializeFrontmatter(frontmatter) + '\n\n' + body.trim() + '\n');
  return file;
}
