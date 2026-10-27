// Solo se incorporan al sitio con una compilación explícita de revisión.
export const BASE_DRAFT_ROUTES = Object.freeze([
  'v1', 'aprender', 'faq', 'noticias', 'biblioteca', 'editorial-demo', 'portada',
]);
export const DRAFT_ROUTES = Object.freeze(BASE_DRAFT_ROUTES.flatMap((slug) => [slug, `lite/${slug}`]));

export const draftPreviewEnabled = () => process.env.CIUDADANIA_DRAFT_PREVIEW === '1';

/** @returns {import('astro').AstroIntegration} */
export function executionDraftPreview() {
  return {
    name: 'ciudadania-execution-draft-preview',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        if (!draftPreviewEnabled()) return;
        for (const slug of DRAFT_ROUTES) {
          injectRoute({
            pattern: `/${slug}`,
            entrypoint: new URL(`./src/drafts/${slug === 'lite/editorial-demo'
              ? 'editorial-lite' : slug.replace(/^lite\//, '')}.astro`, import.meta.url),
            prerender: true,
          });
        }
      },
    },
  };
}
