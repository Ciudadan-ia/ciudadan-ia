import { getCollection, type CollectionEntry } from 'astro:content';
import { ALL_LANGS, DEFAULT_LANG, type Lang } from '../i18n/languages';

export type Article = CollectionEntry<'articles'>;
export type FoundationalPage = CollectionEntry<'pages'>;
export type Voice = CollectionEntry<'voices'>;

/** slug de artículo = carpeta; lengua = nombre de archivo ({slug}/{lang}). */
export function articleSlug(entry: Article): string {
  return entry.id.split('/')[0];
}
function fileLang(entry: Article | FoundationalPage): string {
  return entry.id.split('/')[1];
}

let _articles: Article[] | null = null;

/**
 * Carga y valida coherencia estructural. Lanzar aquí rompe `astro build`:
 * es el gate mecánico de la constitución (II: lang = nombre de archivo).
 */
export async function allArticles(): Promise<Article[]> {
  if (_articles) return _articles;
  const entries = await getCollection('articles');
  for (const e of entries) {
    if (e.data.lang !== fileLang(e)) {
      throw new Error(
        `[constitución II] ${e.id}: frontmatter lang='${e.data.lang}' no coincide con el nombre del archivo '${fileLang(e)}.md'.`,
      );
    }
  }
  // Featured acotado: máx 1 dominante y 2 destacadas entre artículos es publicados.
  const featured = entries.filter((e) => e.data.lang === 'es' && e.data.status !== 'borrador');
  const dominantes = featured.filter((e) => e.data.featured === 'dominante').length;
  const destacadas = featured.filter((e) => e.data.featured === 'destacada').length;
  if (dominantes > 1) throw new Error(`[portada] Hay ${dominantes} artículos 'dominante'; máximo 1.`);
  if (destacadas > 2) throw new Error(`[portada] Hay ${destacadas} artículos 'destacada'; máximo 2.`);
  _articles = entries;
  return entries;
}

/** Publicado = no borrador. */
export function isPublished(e: Article): boolean {
  return e.data.status !== 'borrador';
}

/** Todas las versiones publicadas de un slug, por lengua. */
export async function getArticleVersions(slug: string): Promise<Map<Lang, Article>> {
  const entries = await allArticles();
  const map = new Map<Lang, Article>();
  for (const e of entries) {
    if (articleSlug(e) === slug && isPublished(e)) map.set(e.data.lang, e);
  }
  return map;
}

export type ResolvedArticle =
  | { mode: 'mono'; entry: Article }
  | { mode: 'bilingual'; entry: Article; original: Article }
  | { mode: 'missing' };

/**
 * Regla de vista bilingüe (data-model.md):
 *  validado → monolingüe · traducido-ia → bilingüe junto al es · ausente → no se lista.
 */
export async function resolveArticleForLang(slug: string, lang: Lang): Promise<ResolvedArticle> {
  const versions = await getArticleVersions(slug);
  const entry = versions.get(lang);
  if (!entry) return { mode: 'missing' };
  if (lang === DEFAULT_LANG || entry.data.status === 'validado') return { mode: 'mono', entry };
  const original = versions.get(DEFAULT_LANG);
  if (!original) throw new Error(`[constitución II] ${slug}: existe ${lang}.md pero no es.md — la vista bilingüe necesita el original.`);
  return { mode: 'bilingual', entry, original };
}

/** Artículos listables en una edición (tienen versión publicada en esa lengua). */
export async function listArticlesForLang(lang: Lang): Promise<Article[]> {
  const entries = await allArticles();
  return entries
    .filter((e) => e.data.lang === lang && isPublished(e))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

/** Regla del selector (constitución II): lengua activa = ≥1 pieza publicada. */
export async function getActiveLanguages(): Promise<Lang[]> {
  const entries = await allArticles();
  return ALL_LANGS.filter((lang) => entries.some((e) => e.data.lang === lang && isPublished(e)));
}

export interface LanguageStats {
  lang: Lang;
  articles: number;
  audios: number;
  people: number;
}

/** Contadores vivos por lengua — build-time (research.md D10). */
export async function getLanguageStats(): Promise<LanguageStats[]> {
  const entries = await allArticles();
  const active = await getActiveLanguages();
  return active.map((lang) => {
    const inLang = entries.filter((e) => e.data.lang === lang && isPublished(e));
    const people = new Set<string>();
    for (const e of inLang) {
      for (const p of [e.data.author, e.data.translator, e.data.narrator, e.data.validator]) {
        if (p && !p.toLowerCase().startsWith('ia')) people.add(p);
      }
    }
    return {
      lang,
      articles: inLang.length,
      audios: inLang.filter((e) => e.data.audio).length,
      people: people.size,
    };
  });
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
  const words = (entry.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
