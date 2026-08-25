/**
 * Lenguas del sitio. Regla constitucional II: una lengua solo se muestra en el
 * selector si tiene contenido publicado (ver getActiveLanguages en lib/content.ts).
 */
export type Lang = 'es' | 'en' | 'nah' | 'yua';

export interface Language {
  code: Lang;
  /** Endónimo — nunca banderas, nunca exónimos en el selector (benchmark: Wikipedia/Common Voice). */
  endonym: string;
  /** Nombre en español, solo para textos descriptivos. */
  nameEs: string;
  /** Lenguas del piloto destacadas en la capa 1 del selector. */
  featured: boolean;
  /** Es lengua indígena (activa vista bilingüe y avisos de traducción). */
  indigenous: boolean;
}

export const LANGUAGES: Record<Lang, Language> = {
  es: { code: 'es', endonym: 'Español', nameEs: 'español', featured: true, indigenous: false },
  en: { code: 'en', endonym: 'English', nameEs: 'inglés', featured: false, indigenous: false },
  nah: { code: 'nah', endonym: 'Nāhuatlahtōlli', nameEs: 'náhuatl', featured: true, indigenous: true },
  yua: { code: 'yua', endonym: "Maaya t'aan", nameEs: 'maya yucateco', featured: true, indigenous: true },
};

export const DEFAULT_LANG: Lang = 'es';
export const ALL_LANGS = Object.keys(LANGUAGES) as Lang[];

/** Prefijo de ruta para una lengua ('' para la default). */
export function langPath(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`;
}
