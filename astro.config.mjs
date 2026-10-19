// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://nico-bodmer.ch',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7 entfernt Leerraum standardmässig nach JSX-Regeln. Für Fliesstext
  // mit Inline-Elementen gelten hier die HTML-Regeln.
  compressHTML: true,
  // Keine automatischen Gedankenstriche oder geschwungenen Anführungszeichen:
  // Anführungszeichen stehen als «so» im Text.
  markdown: {
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  image: {
    responsiveStyles: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/links/') && !page.endsWith('/404/'),
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-CH', en: 'en-GB' },
      },
    }),
  ],
});
