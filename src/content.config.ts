import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projekte: eine Markdown-Datei pro Projekt und Sprache
 * (src/content/projekte/de/*.md und src/content/projekte/en/*.md).
 * Die ID ist der Pfad inkl. Sprache, z. B. «de/odera»; der Pfad der
 * Seite steht in `slug`.
 */
const projekte = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projekte',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Schlüssel des Projekts, gleich in beiden Sprachen */
      projekt: z.enum(['odera', 'musterprojekte', 'geo-quiz', 'morgen-check-in', 'prognose-app']),
      slug: z.string(),
      kurz: z.string(),
      typ: z.string(),
      jahr: z.union([z.number(), z.string()]),
      rolle: z.string(),
      technik: z.array(z.string()).default([]),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      messwerte: z
        .array(
          z.object({
            wert: z.string(),
            einheit: z.string().optional(),
            label: z.string(),
            quelle: z.string(),
            datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          }),
        )
        .default([]),
      bilder: z
        .array(
          z.object({
            datei: image(),
            alt: z.string(),
            unterschrift: z.string(),
            geraet: z.enum(['desktop', 'tablet', 'handy']).default('desktop'),
          }),
        )
        .default([]),
      /** Vorschaubild in der Projektliste (4:3) */
      vorschau: z.number().int().min(0).default(0),
      reihenfolge: z.number(),
      featured: z.boolean().default(true),
      status: z.enum(['live', 'in-arbeit', 'entwurf']),
      /** Bildposition im Ausschnitt, z. B. «50% 0%» */
      position: z.string().default('50% 0%'),
      seo: z.string().max(155).optional(),
    }),
});

export const collections = { projekte };
