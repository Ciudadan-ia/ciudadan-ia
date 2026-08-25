// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  build: {
    inlineStylesheets: 'always',
  },
});
