import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TOPICS, FORMATS, ALL_SUBTOPIC_SLUGS } from './i18n/taxonomy';

const LANGS = ['es', 'en', 'nah', 'yua'] as const;
const STATUSES = ['borrador', 'traducido-ia', 'validado'] as const;
const AUDIENCES = ['general', 'docentes', 'comunidades'] as const;
const SOURCE_TYPES = [
  'paper',
  'preprint',
  'informe',
  'ley',
  'reportaje',
  'comunicado',
  'documentacion',
  'dataset',
] as const;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const source = z.object({
  title: z.string().min(1),
  url: z.string().url().startsWith('https://', 'Las fuentes deben ser https'),
  publisher: z.string().min(1),
  date: z.string().optional(),
  license: z.string().optional(),
  type: z.enum(SOURCE_TYPES).optional(),
  isPrimary: z.boolean().default(false),
  isLatam: z.boolean().default(false),
});

/**
 * Gates de la constitución convertidos en schema (contracts/content-schema.md):
 *  - I   crédito nominal: 'validado' en lengua ≠ es exige translator y validator;
 *        toda pieza aiAssisted exige editor (persona responsable) y autor no-IA
 *  - II  lang debe coincidir con el nombre del archivo (verificado en lib/content.ts)
 *  - IV  alt obligatorio si hay imagen
 *  - V   aiAssisted en es exige ≥3 fuentes https únicas; fuentes solo en el original
 *  - VI  audio exige narrator
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(1),
      lang: z.enum(LANGS),
      status: z.enum(STATUSES),
      summary: z.string().min(1),
      topic: z.enum(TOPICS),
      subtopic: z
        .string()
        .refine((s) => ALL_SUBTOPIC_SLUGS.includes(s), {
          message: 'subtopic desconocido: debe existir en src/i18n/taxonomy.ts (docs/taxonomia.md)',
        })
        .optional(),
      format: z.enum(FORMATS).default('explicador'),
      audience: z.array(z.enum(AUDIENCES)).default(['general']),
      image: z
        .object({
          src: z.string(),
          alt: z.string().min(1, 'Principio IV: toda imagen necesita alt'),
        })
        .optional(),
      readingTime: z.number().int().positive().optional(),
      publishDate: z.coerce.date(),
      author: z.string().min(1, 'Principio I: crédito nominal de autor obligatorio'),
      /** Persona editora responsable del lote (Principio V.b). */
      editor: z.string().min(1).optional(),
      translator: z.string().optional(),
      validator: z.string().optional(),
      narrator: z.string().optional(),
      audio: z
        .object({
          src: z.string().startsWith('/audio/'),
          durationSec: z.number().int().positive(),
        })
        .optional(),
      featured: z.enum(['dominante', 'destacada']).optional(),
      /** Método de redacción — eje ortogonal a `status`. Etiqueta permanente. */
      aiAssisted: z.boolean().default(false),
      /** Revisión humana individual (el muestreo no se registra por pieza). */
      review: z.object({ by: z.string().min(1), date: z.coerce.date() }).optional(),
      /** Trazabilidad de producción. */
      production: z
        .object({
          model: z.string().optional(),
          batch: z.number().int().nonnegative().optional(),
          manualVersion: z.string().optional(),
        })
        .optional(),
      /** Fuentes: viven SOLO en el original es; las traducciones las heredan. */
      sources: z.array(source).max(12).default([]),
      series: z.string().regex(SLUG_RE).optional(),
      seriesOrder: z.number().int().positive().optional(),
      related: z.array(z.string().regex(SLUG_RE)).max(8).default([]),
      keywords: z.array(z.string().min(2)).max(12).default([]),
      /** Glosario. */
      term: z.string().min(1).max(60).optional(),
      gloss: z.string().min(1).max(160).optional(),
      /** Resumen de estudio. */
      paper: z
        .object({
          title: z.string().min(1),
          authors: z.array(z.string().min(1)).min(1),
          year: z.number().int(),
          venue: z.string().optional(),
          doi: z.string().optional(),
          url: z.string().url(),
        })
        .optional(),
      /** Ficha de proyecto, herramienta o caso. */
      ficha: z
        .object({
          kind: z.enum(['proyecto', 'herramienta', 'caso']),
          org: z.string().optional(),
          country: z.string().optional(),
          url: z.string().url().optional(),
          year: z.number().int().optional(),
        })
        .optional(),
      corrections: z
        .array(z.object({ date: z.coerce.date(), note: z.string().min(1) }))
        .default([]),
    })
    .superRefine((data, ctx) => {
      const fail = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });

      // Principio I — crédito nominal de traducción validada
      if (data.status === 'validado' && data.lang !== 'es') {
        if (!data.translator) {
          fail(`Principio I: un artículo 'validado' en ${data.lang} exige el crédito nominal de 'translator'.`);
        }
        if (!data.validator) {
          fail(`Principio I: un artículo 'validado' en ${data.lang} exige el crédito nominal de 'validator'.`);
        }
      }
      if (data.audio && !data.narrator) {
        fail('Principio I: un audio publicado exige el crédito nominal de narrator.');
      }

      // Principio V — redacción asistida por IA
      if (data.aiAssisted) {
        if (!data.editor) {
          fail("Principio V.b: una pieza 'aiAssisted' exige 'editor' (persona responsable del lote).");
        }
        if (/^ia\b|^inteligencia artificial\b|^claude\b|^gpt\b/i.test(data.author.trim())) {
          fail("Principio V.b: 'author' debe ser la persona o equipo responsable, nunca la IA.");
        }
        if (data.lang === 'es') {
          if (data.sources.length < 3) {
            fail(
              `Principio V.a: una pieza 'aiAssisted' exige al menos 3 fuentes citadas (tiene ${data.sources.length}).`,
            );
          }
          const urls = new Set(data.sources.map((s) => s.url));
          if (urls.size !== data.sources.length) {
            fail('Principio V.a: hay fuentes con URL repetida.');
          }
        }
      }

      // Las fuentes viven solo en el original: la traducción las hereda en render.
      if (data.lang !== 'es' && data.sources.length > 0) {
        fail('Las fuentes viven solo en es.md; la traducción las hereda automáticamente.');
      }

      // Completitud por formato
      if (data.format === 'glosario' && (!data.term || !data.gloss)) {
        fail("El formato 'glosario' exige 'term' y 'gloss' (alimentan el índice A-Z).");
      }
      if (data.format === 'paper' && !data.paper) {
        fail("El formato 'paper' exige el objeto 'paper' con la publicación original.");
      }
      if (data.format === 'ficha' && !data.ficha) {
        fail("El formato 'ficha' exige el objeto 'ficha'.");
      }
      if ((data.series && !data.seriesOrder) || (data.seriesOrder && !data.series)) {
        fail("'series' y 'seriesOrder' van juntos.");
      }
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    lang: z.enum(LANGS),
    status: z.enum(STATUSES),
    updated: z.coerce.date(),
  }),
});

const voices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/voices' }),
  schema: z.object({
    name: z.string().min(1),
    territory: z.string().min(1),
    lang: z.string().min(2),
    quote: z.string().min(1),
    quoteEs: z.string().min(1),
    week: z.string().regex(/^\d{4}-\d{2}$/, 'Formato yyyy-ww'),
    audio: z
      .object({ src: z.string().startsWith('/audio/'), durationSec: z.number().int().positive() })
      .optional(),
    // Principio I: sin consentimiento explícito, el build falla.
    consent: z.literal(true, {
      message: 'Principio I: voices exige consent: true explícito de la persona hablante.',
    }),
  }),
});

export const collections = { articles, pages, voices };
