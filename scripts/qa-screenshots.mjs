/**
 * QA-Screenshots: Seiten bei 360, 390, 768, 1024, 1440 und 1920px, hell und
 * dunkel, ganze Seite, dazu der Lebenslauf als PDF. Ablage in qa-screenshots/
 * (nicht im Repo). Erwartet einen laufenden Server (QA_BASE, Standard
 * http://localhost:4330).
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.QA_BASE ?? 'http://localhost:4330';
const ziel = path.join(root, 'qa-screenshots');
await mkdir(ziel, { recursive: true });

const seiten = {
  start: '/',
  'start-en': '/en/',
  odera: '/arbeiten/odera/',
  musterprojekte: '/arbeiten/musterprojekte/',
  'geo-quiz': '/arbeiten/geo-quiz/',
  'morgen-check-in': '/arbeiten/morgen-check-in/',
  lebenslauf: '/lebenslauf/',
  '404': '/404.html',
};
const breiten = [360, 390, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
for (const schema of ['light', 'dark']) {
  for (const w of breiten) {
    const context = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: schema, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    for (const [name, pfad] of Object.entries(seiten)) {
      await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(ziel, `${name}-${w}-${schema}.png`), fullPage: true });
    }
    await context.close();
  }
}
const page = await browser.newPage();
await page.goto(BASE + '/lebenslauf/', { waitUntil: 'networkidle' });
await page.pdf({ path: path.join(ziel, 'lebenslauf.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`QA-Screenshots in ${path.relative(root, ziel)}/`);
