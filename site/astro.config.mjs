// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { pendingLinks } from './src/lib/satteri-pending-links.mjs';
import { DRAFT_ROUTES, executionDraftPreview } from './draft-routes.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ciudadan-ia.pages.dev',
  integrations: [
    executionDraftPreview(),
    sitemap({
      filter: (page) => !page.includes('/qa-tipografia') && !page.includes('/lite/')
        && !DRAFT_ROUTES.includes(new URL(page).pathname.replace(/^\/|\/$/g, '')),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'nah', 'yua'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: satteri({ hastPlugins: [pendingLinks] }),
  },
  build: {
    inlineStylesheets: 'always',
  },
});
