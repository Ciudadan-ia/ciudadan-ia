// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ciudadan-ia.pages.dev',
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
