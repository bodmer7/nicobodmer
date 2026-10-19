// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { seiten } from './src/i18n/routes.ts';

const SITE = 'https://nico-bodmer.ch';

/** Übersetzte Seiten in der Sitemap gegenseitig verknüpfen (hreflang). */
const paare = Object.values(seiten).map((p) => ({ de: SITE + p.de, en: SITE + p.en }));

export default defineConfig({
  site: SITE,
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
  // Responsive Bilder auch im Markdown, mit wenigen Breiten (dist/ bleibt
  // unter 9 MB). Komponenten setzen ihre Breiten selbst (src/components/Bild.astro).
  image: {
    layout: 'constrained',
    breakpoints: [480, 720, 1080, 1600],
    responsiveStyles: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/links/') && !page.endsWith('/404/'),
      serialize(item) {
        const paar = paare.find((p) => p.de === item.url || p.en === item.url);
        if (paar) {
          item.links = [
            { url: paar.de, lang: 'de-CH' },
            { url: paar.en, lang: 'en-GB' },
            { url: paar.de, lang: 'x-default' },
          ];
        }
        return item;
      },
    }),
  ],
});
