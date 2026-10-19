/**
 * Vorschau-Screenshots für den Workflow «Vorschau»: wenige Seiten bei 390
 * und 1440px, hell und dunkel, als JPEG nach vorschau-bilder/.
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.QA_BASE ?? 'http://localhost:4330';
const ziel = 'vorschau-bilder';
await mkdir(ziel, { recursive: true });

const seiten = {
  start: '/',
  odera: '/arbeiten/odera/',
  geo: '/arbeiten/geo-quiz/',
  lebenslauf: '/lebenslauf/',
};
const browser = await chromium.launch();
for (const schema of ['light', 'dark']) {
  for (const w of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: schema, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    for (const [name, pfad] of Object.entries(seiten)) {
      await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${ziel}/${name}-${w}-${schema}.jpg`, fullPage: true, type: 'jpeg', quality: 72 });
      await page.screenshot({ path: `${ziel}/${name}-${w}-${schema}-oben.jpg`, type: 'jpeg', quality: 80 });
    }
    await context.close();
  }
}
await browser.close();
console.log('Vorschau-Screenshots fertig');
