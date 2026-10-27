// Solo se incorporan al sitio con una compilación explícita de revisión.
export const DRAFT_ROUTES = Object.freeze([
  'v1', 'aprender', 'faq', 'noticias', 'biblioteca', 'editorial-demo',
]);

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
            entrypoint: new URL(`./src/drafts/${slug}.astro`, import.meta.url),
            prerender: true,
          });
        }
      },
    },
  };
}
