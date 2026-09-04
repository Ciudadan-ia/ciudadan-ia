import { getCollection, type CollectionEntry } from 'astro:content';
import { ALL_LANGS, DEFAULT_LANG, LANGUAGES, type Lang } from '../i18n/languages';
import {
  FORMATS,
  RESERVED_SLUGS,
  SUBTOPICS,
  TOPICS,
  type Format,
  type Topic,
} from '../i18n/taxonomy';

export type Article = CollectionEntry<'articles'>;
export type FoundationalPage = CollectionEntry<'pages'>;
export type Voice = CollectionEntry<'voices'>;
export type Audience = 'general' | 'docentes' | 'comunidades';
export type Source = Article['data']['sources'][number];

/**
 * Fecha de corte de publicación (constitución — Restricciones técnicas).
 * Producción: ahora. Dev: futuro lejano para revisar la cola completa.
 * `PUBLISH_AS_OF=2027-03-01 npm run build` construye la cola para QA.
 */
export const BUILD_AS_OF: Date = (() => {
  const env = import.meta.env.PUBLISH_AS_OF ?? process.env.PUBLISH_AS_OF;
  if (env) return new Date(env);
  return import.meta.env.DEV ? new Date('2999-01-01') : new Date();
})();

/** slug de artículo = carpeta; lengua = nombre de archivo ({slug}/{lang}). */
export function articleSlug(entry: Article): string {
  return entry.id.split('/')[0];
}
function fileLang(entry: Article | FoundationalPage): string {
  return entry.id.split('/')[1];
}

/** Publicado = no borrador Y con fecha alcanzada. */
export function isPublished(e: Article): boolean {
  return e.data.status !== 'borrador' && e.data.publishDate.getTime() <= BUILD_AS_OF.getTime();
}

let _raw: Article[] | null = null;

/**
 * TODAS las entradas, incluidas borradores y las de fecha futura.
 * Solo para gates internos y lint — nunca para rutas ni listados.
 */
export async function allEntriesRaw(): Promise<Article[]> {
  if (_raw) return _raw;
  const entries = await getCollection('articles');
  for (const e of entries) {
    // Constitución II: la lengua declarada debe ser la del archivo.
    if (e.data.lang !== fileLang(e)) {
      throw new Error(
        `[constitución II] ${e.id}: frontmatter lang='${e.data.lang}' no coincide con el archivo '${fileLang(e)}.md'.`,
      );
    }
    const slug = articleSlug(e);
    if (RESERVED_SLUGS.includes(slug)) {
      throw new Error(`[rutas] ${e.id}: el slug '${slug}' está reservado por una ruta del sitio.`);
    }
    if (e.data.subtopic) {
      const belongs = Object.keys(SUBTOPICS[e.data.topic]).includes(e.data.subtopic);
      if (!belongs) {
        throw new Error(
          `[taxonomía] ${e.id}: subtopic '${e.data.subtopic}' no pertenece al tema '${e.data.topic}'.`,
        );
      }
    }
  }
  _raw = entries;
  return entries;
}

let _index: ArticleIndex | null = null;

export interface ArticleIndex {
  published: Article[];
  bySlug: Map<string, Map<Lang, Article>>;
  byLang: Map<Lang, Article[]>;
  byTopic: Map<Lang, Map<Topic, Article[]>>;
  bySubtopic: Map<Lang, Map<string, Article[]>>;
  byFormat: Map<Lang, Map<Format, Article[]>>;
  bySeries: Map<string, Article[]>;
  sourcesBySlug: Map<string, Source[]>;
}

/** Índice memoizado: O(1) por página en vez de recorrer el catálogo completo. */
export async function getIndex(): Promise<ArticleIndex> {
  if (_index) return _index;
  const raw = await allEntriesRaw();
  const published = raw
    .filter(isPublished)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  const bySlug = new Map<string, Map<Lang, Article>>();
  const byLang = new Map<Lang, Article[]>();
  const byTopic = new Map<Lang, Map<Topic, Article[]>>();
  const bySubtopic = new Map<Lang, Map<string, Article[]>>();
  const byFormat = new Map<Lang, Map<Format, Article[]>>();
  const bySeries = new Map<string, Article[]>();
  const sourcesBySlug = new Map<string, Source[]>();

  for (const lang of ALL_LANGS) {
    byLang.set(lang, []);
    byTopic.set(lang, new Map());
    bySubtopic.set(lang, new Map());
    byFormat.set(lang, new Map());
  }

  for (const e of published) {
    const slug = articleSlug(e);
    const lang = e.data.lang;

    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    bySlug.get(slug)!.set(lang, e);

    byLang.get(lang)!.push(e);

    const topics = byTopic.get(lang)!;
    if (!topics.has(e.data.topic)) topics.set(e.data.topic, []);
    topics.get(e.data.topic)!.push(e);

    if (e.data.subtopic) {
      const subs = bySubtopic.get(lang)!;
      if (!subs.has(e.data.subtopic)) subs.set(e.data.subtopic, []);
      subs.get(e.data.subtopic)!.push(e);
    }

    const formats = byFormat.get(lang)!;
    if (!formats.has(e.data.format)) formats.set(e.data.format, []);
    formats.get(e.data.format)!.push(e);

    if (e.data.series) {
      if (!bySeries.has(e.data.series)) bySeries.set(e.data.series, []);
      bySeries.get(e.data.series)!.push(e);
    }

    if (lang === DEFAULT_LANG && e.data.sources.length) {
      sourcesBySlug.set(slug, e.data.sources);
    }
  }

  for (const list of bySeries.values()) {
    list.sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
  }

  // Gates cruzados sobre el catálogo publicado.
  const featuredEs = (byLang.get(DEFAULT_LANG) ?? []).filter((e) => e.data.featured);
  const dominantes = featuredEs.filter((e) => e.data.featured === 'dominante').length;
  const destacadas = featuredEs.filter((e) => e.data.featured === 'destacada').length;
  if (dominantes > 1) throw new Error(`[portada] Hay ${dominantes} artículos 'dominante'; máximo 1.`);
  if (destacadas > 2) throw new Error(`[portada] Hay ${destacadas} artículos 'destacada'; máximo 2.`);

  const knownSlugs = new Set(raw.map(articleSlug));
  for (const e of published) {
    for (const rel of e.data.related) {
      if (!knownSlugs.has(rel)) {
        throw new Error(`[relacionadas] ${e.id}: 'related' apunta a '${rel}', que no existe.`);
      }
    }
  }

  _index = { published, bySlug, byLang, byTopic, bySubtopic, byFormat, bySeries, sourcesBySlug };
  return _index;
}

/** Compat: artículos publicados (usado por rutas y componentes). */
export async function allArticles(): Promise<Article[]> {
  return (await getIndex()).published;
}

/** Piezas con fecha futura — solo para avisos de dev y lint. */
export async function queuedCount(): Promise<number> {
  const raw = await allEntriesRaw();
  const now = new Date();
  return raw.filter((e) => e.data.status !== 'borrador' && e.data.publishDate > now).length;
}

/** Todas las versiones publicadas de un slug, por lengua. */
export async function getArticleVersions(slug: string): Promise<Map<Lang, Article>> {
  const { bySlug } = await getIndex();
  return bySlug.get(slug) ?? new Map();
}

export type ResolvedArticle =
  | { mode: 'mono'; entry: Article; pendingValidation: boolean }
  | { mode: 'bilingual'; entry: Article; original: Article }
  | { mode: 'missing' };

/**
 * Regla de presentación (data-model.md):
 *  - validado, o cualquier estado en es → monolingüe
 *  - traducido-ia en lengua INDÍGENA → bilingüe junto al español (constitución II)
 *  - traducido-ia en otra lengua (en) → monolingüe con aviso de validación pendiente
 */
export async function resolveArticleForLang(slug: string, lang: Lang): Promise<ResolvedArticle> {
  const versions = await getArticleVersions(slug);
  const entry = versions.get(lang);
  if (!entry) return { mode: 'missing' };
  if (lang === DEFAULT_LANG || entry.data.status === 'validado') {
    return { mode: 'mono', entry, pendingValidation: false };
  }
  if (!LANGUAGES[lang].indigenous) {
    return { mode: 'mono', entry, pendingValidation: true };
  }
  const original = versions.get(DEFAULT_LANG);
  if (!original) {
    throw new Error(
      `[constitución II] ${slug}: existe ${lang}.md pero no es.md — la vista bilingüe necesita el original.`,
    );
  }
  return { mode: 'bilingual', entry, original };
}

export interface ListOptions {
  format?: Format;
  topic?: Topic;
  subtopic?: string;
  audience?: Audience;
  limit?: number;
  excludeSlugs?: Set<string>;
}

/** Artículos listables en una edición, con filtros. Orden: publishDate desc. */
export async function listArticlesForLang(lang: Lang, opts: ListOptions = {}): Promise<Article[]> {
  const idx = await getIndex();
  let list: Article[];
  if (opts.subtopic) list = idx.bySubtopic.get(lang)?.get(opts.subtopic) ?? [];
  else if (opts.topic) list = idx.byTopic.get(lang)?.get(opts.topic) ?? [];
  else if (opts.format) list = idx.byFormat.get(lang)?.get(opts.format) ?? [];
  else list = idx.byLang.get(lang) ?? [];

  if (opts.format && (opts.topic || opts.subtopic)) {
    list = list.filter((e) => e.data.format === opts.format);
  }
  if (opts.audience) list = list.filter((e) => e.data.audience.includes(opts.audience!));
  if (opts.excludeSlugs) list = list.filter((e) => !opts.excludeSlugs!.has(articleSlug(e)));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

/** Regla del selector (constitución II): lengua activa = ≥1 pieza publicada. */
export async function getActiveLanguages(): Promise<Lang[]> {
  const { byLang } = await getIndex();
  return ALL_LANGS.filter((lang) => (byLang.get(lang) ?? []).length > 0);
}

/** Qué índices existen realmente en una lengua — ninguna página vacía (constitución II). */
export async function getIndexAvailability(lang: Lang): Promise<{
  topics: Topic[];
  subtopics: Map<Topic, string[]>;
  formats: Format[];
  total: number;
}> {
  const idx = await getIndex();
  const topicMap = idx.byTopic.get(lang) ?? new Map();
  const subMap = idx.bySubtopic.get(lang) ?? new Map();
  const fmtMap = idx.byFormat.get(lang) ?? new Map();
  const topics = TOPICS.filter((t) => (topicMap.get(t) ?? []).length > 0);
  const subtopics = new Map<Topic, string[]>();
  for (const t of topics) {
    const subs = Object.keys(SUBTOPICS[t]).filter((s) => (subMap.get(s) ?? []).length > 0);
    if (subs.length) subtopics.set(t, subs);
  }
  return {
    topics,
    subtopics,
    formats: FORMATS.filter((f) => (fmtMap.get(f) ?? []).length > 0),
    total: (idx.byLang.get(lang) ?? []).length,
  };
}

export interface LanguageStats {
  lang: Lang;
  articles: number;
  audios: number;
  people: number;
  byFormat: Record<Format, number>;
}

/** Contadores vivos por lengua — build-time. */
export async function getLanguageStats(): Promise<LanguageStats[]> {
  const idx = await getIndex();
  const active = await getActiveLanguages();
  return active.map((lang) => {
    const inLang = idx.byLang.get(lang) ?? [];
    const people = new Set<string>();
    for (const e of inLang) {
      for (const p of [e.data.author, e.data.editor, e.data.translator, e.data.narrator, e.data.validator]) {
        if (p && !/^ia\b|^inteligencia artificial\b|voz sintética/i.test(p)) people.add(p);
      }
    }
    const byFormat = {} as Record<Format, number>;
    for (const f of FORMATS) byFormat[f] = (idx.byFormat.get(lang)?.get(f) ?? []).length;
    return {
      lang,
      articles: inLang.length,
      audios: inLang.filter((e) => e.data.audio).length,
      people: people.size,
      byFormat,
    };
  });
}

/** Cuentas editoriales públicas (política de IA / transparencia). */
export async function getEditorialStats(): Promise<{
  total: number;
  aiAssisted: number;
  reviewed: number;
  corrections: number;
  byFormat: Record<Format, number>;
  asOf: Date;
}> {
  const idx = await getIndex();
  const es = idx.byLang.get(DEFAULT_LANG) ?? [];
  const byFormat = {} as Record<Format, number>;
  for (const f of FORMATS) byFormat[f] = es.filter((e) => e.data.format === f).length;
  return {
    total: es.length,
    aiAssisted: es.filter((e) => e.data.aiAssisted).length,
    reviewed: es.filter((e) => e.data.review).length,
    corrections: es.reduce((n, e) => n + e.data.corrections.length, 0),
    byFormat,
    asOf: BUILD_AS_OF,
  };
}

/** Fuentes del original en español; las traducciones las heredan. */
export async function getSources(slug: string): Promise<Source[]> {
  return (await getIndex()).sourcesBySlug.get(slug) ?? [];
}

/** Preguntas relacionadas: `related` explícitos + relleno por subtema y tema. */
export async function getRelated(
  entry: Article,
  lang: Lang,
  max = 5,
): Promise<{ sameLang: Article[]; fallbackEs: Article[] }> {
  const idx = await getIndex();
  const slug = articleSlug(entry);
  const seen = new Set<string>([slug]);
  const sameLang: Article[] = [];

  const push = (list: Article[]) => {
    for (const e of list) {
      const s = articleSlug(e);
      if (seen.has(s) || sameLang.length >= max) continue;
      seen.add(s);
      sameLang.push(e);
    }
  };

  push(entry.data.related.map((s) => idx.bySlug.get(s)?.get(lang)).filter(Boolean) as Article[]);
  if (entry.data.subtopic) push(idx.bySubtopic.get(lang)?.get(entry.data.subtopic) ?? []);
  push(idx.byTopic.get(lang)?.get(entry.data.topic) ?? []);

  // En lenguas indígenas con poco contenido, hasta 3 piezas en español (con lang correcto).
  const fallbackEs: Article[] = [];
  if (LANGUAGES[lang].indigenous && sameLang.length < 3) {
    const esList = [
      ...(entry.data.subtopic ? idx.bySubtopic.get(DEFAULT_LANG)?.get(entry.data.subtopic) ?? [] : []),
      ...(idx.byTopic.get(DEFAULT_LANG)?.get(entry.data.topic) ?? []),
    ];
    for (const e of esList) {
      const s = articleSlug(e);
      if (seen.has(s) || fallbackEs.length >= 3) continue;
      seen.add(s);
      fallbackEs.push(e);
    }
  }
  return { sameLang, fallbackEs };
}

/** Navegación dentro de una serie de preguntas encadenadas. */
export async function getSeriesNav(
  entry: Article,
  lang: Lang,
): Promise<{ prev?: Article; next?: Article; index: number; total: number } | null> {
  if (!entry.data.series) return null;
  const idx = await getIndex();
  const list = (idx.bySeries.get(entry.data.series) ?? []).filter((e) => e.data.lang === lang);
  const i = list.findIndex((e) => e.id === entry.id);
  if (i === -1) return null;
  return { prev: list[i - 1], next: list[i + 1], index: i + 1, total: list.length };
}

/** Normaliza un término para ordenar el glosario (sin diacríticos, minúsculas). */
export function normalizeTerm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Glosario agrupado por letra inicial. */
export async function getGlossary(lang: Lang): Promise<Array<{ letter: string; items: Article[] }>> {
  const items = (await listArticlesForLang(lang, { format: 'glosario' })).slice();
  items.sort((a, b) => normalizeTerm(a.data.term ?? a.data.title).localeCompare(normalizeTerm(b.data.term ?? b.data.title), 'es'));
  const groups = new Map<string, Article[]>();
  for (const e of items) {
    const letter = (normalizeTerm(e.data.term ?? e.data.title)[0] ?? '#').toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(e);
  }
  return [...groups.entries()].map(([letter, items]) => ({ letter, items }));
}

export const FOUNDATIONAL_SLUGS = [
  'manifiesto',
  'gobernanza-de-datos',
  'politica-de-ia',
  'transparencia',
  'colabora',
] as const;
export type FoundationalSlug = (typeof FOUNDATIONAL_SLUGS)[number];

let _pages: FoundationalPage[] | null = null;

async function allPages(): Promise<FoundationalPage[]> {
  if (_pages) return _pages;
  const entries = await getCollection('pages');
  // Constitución VII: las 5 fundacionales deben existir al menos en es.
  for (const slug of FOUNDATIONAL_SLUGS) {
    if (!entries.some((e) => e.id === `${slug}/es`)) {
      throw new Error(`[constitución VII] Falta la página fundacional obligatoria pages/${slug}/es.md.`);
    }
  }
  _pages = entries;
  return entries;
}

/** Fundacional en la lengua pedida, con fallback al español (nunca 404). */
export async function getFoundationalPage(
  slug: FoundationalSlug,
  lang: Lang,
): Promise<{ page: FoundationalPage; fallback: boolean }> {
  const entries = await allPages();
  const exact = entries.find((e) => e.id === `${slug}/${lang}` && e.data.status !== 'borrador');
  if (exact) return { page: exact, fallback: false };
  const es = entries.find((e) => e.id === `${slug}/es`);
  return { page: es!, fallback: lang !== DEFAULT_LANG };
}

/** Voz de la semana más reciente. */
export async function getLatestVoice(): Promise<Voice | undefined> {
  const entries = await getCollection('voices');
  return entries.sort((a, b) => b.data.week.localeCompare(a.data.week))[0];
}

/** Tiempo de lectura de la capa profunda (~180 palabras/min si no viene fijado). */
export function readingTimeMin(entry: Article): number {
  if (entry.data.readingTime) return entry.data.readingTime;
  const body = (entry.body ?? '').split(/^##\s+Fuentes/m)[0];
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

/** URL canónica de una pieza. */
export function articleHref(slugOrEntry: string | Article, lang: Lang, lite = false): string {
  const slug = typeof slugOrEntry === 'string' ? slugOrEntry : articleSlug(slugOrEntry);
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  return lite ? `/lite${prefix}/articulos/${slug}/` : `${prefix}/articulos/${slug}/`;
}
