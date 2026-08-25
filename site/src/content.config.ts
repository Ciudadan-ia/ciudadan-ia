import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LANGS = ['es', 'en', 'nah', 'yua'] as const;
const STATUSES = ['borrador', 'traducido-ia', 'validado'] as const;
const TOPICS = ['derechos', 'trabajo', 'educacion', 'lengua-cultura', 'tecnologia', 'seguridad'] as const;

/**
 * Gates de la constitución convertidos en schema (contracts/content-schema.md):
 *  - I  crédito nominal: 'validado' en lengua ≠ es exige translator y validator
 *  - IV alt obligatorio si hay imagen
 *  - VI audio con transcripción en el cuerpo
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
      audience: z.array(z.enum(['general', 'docentes', 'comunidades'])).default(['general']),
      image: z
        .object({
          src: z.string(),
          alt: z.string().min(1, 'Principio IV: toda imagen necesita alt'),
        })
        .optional(),
      readingTime: z.number().int().positive().optional(),
      publishDate: z.coerce.date(),
      author: z.string().min(1, 'Principio I: crédito nominal de autor obligatorio'),
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
    })
    .superRefine((data, ctx) => {
      if (data.status === 'validado' && data.lang !== 'es') {
        if (!data.translator) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Principio I (constitución): un artículo 'validado' en ${data.lang} exige el crédito nominal de 'translator'.`,
          });
        }
        if (!data.validator) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Principio I (constitución): un artículo 'validado' en ${data.lang} exige el crédito nominal de 'validator'.`,
          });
        }
      }
      if (data.audio && !data.narrator) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Principio I: un audio publicado exige el crédito nominal de narrator.',
        });
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
      message: 'Principio I (constitución): voices exige consent: true explícito de la persona hablante.',
    }),
  }),
});

export const collections = { articles, pages, voices };
