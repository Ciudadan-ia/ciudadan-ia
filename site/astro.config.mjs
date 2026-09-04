// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { pendingLinks } from './src/lib/satteri-pending-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ciudadan-ia.pages.dev',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/qa-tipografia') && !page.includes('/lite/'),
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
