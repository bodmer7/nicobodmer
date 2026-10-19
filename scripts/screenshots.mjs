/**
 * Screenshots der Projekte neu erstellen (Abschnitt 8 des Auftrags).
 *
 *   npm run screenshots                 alle Seiten live
 *   npm run screenshots -- odera-start  nur bestimmte Namen
 *
 * Quellen umleiten (z. B. wenn die Live-Seite nicht erreichbar ist):
 *   ODERA_BASE=http://localhost:8801 npm run screenshots
 *   GEO_BASE=http://localhost:5173/segberike/ npm run screenshots
 *
 * Ablauf: Rohdateien als PNG nach scripts/.cache/, danach mit sharp als
 * WebP nach src/assets/screens/<name>-<ansicht>.webp. Astro erzeugt daraus
 * die Varianten für die Seite.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'scripts/.cache');
const ziel = path.join(root, 'src/assets/screens');

const ODERA = (process.env.ODERA_BASE ?? 'https://odera.ch').replace(/\/$/, '');
const GEO = process.env.GEO_BASE ?? 'https://bodmer7.github.io/segberike/';

const ansichten = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, maxBreite: 2400 },
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, maxBreite: 1640 },
  handy: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, maxBreite: 1170 },
};

/** name, url, Ansichten. «desktop-ganz» ist die ganze Seite auf Desktop. */
const liste = [
  { name: 'odera-start', url: `${ODERA}/`, ansichten: ['desktop', 'tablet', 'handy', 'desktop-ganz'] },
  { name: 'odera-projekt-check', url: `${ODERA}/projekt-check/`, ansichten: ['desktop', 'handy'] },
  { name: 'odera-angebot', url: `${ODERA}/angebot/`, ansichten: ['desktop'] },
  { name: 'doppelmeter', url: `${ODERA}/musterprojekte/doppelmeter/`, ansichten: ['desktop', 'tablet', 'handy'] },
  { name: 'firstlicht', url: `${ODERA}/musterprojekte/firstlicht/`, ansichten: ['desktop', 'tablet', 'handy'] },
  { name: 'firstlicht-erklaert', url: `${ODERA}/musterprojekte/firstlicht/?erklaeren=1`, ansichten: ['desktop'] },
  { name: 'geo-quiz', url: GEO, ansichten: ['desktop', 'handy'] },
];

/*
 * Schwebende Elemente, die Inhalt verdecken, werden nur für den Screenshot
 * ausgeblendet: der Chat-Knopf von odera.ch (.chat-btn) und der Hinweis zur
 * Statistik (.st-banner), der mobil unten Inhalt verdeckt. Ausserdem keine
 * Scrollbalken.
 */
const CSS = `
  .chat-btn, .chat-btn-l, .st-banner { display: none !important; }
  html { scrollbar-width: none !important; }
  ::-webkit-scrollbar { display: none !important; }
`;

const filter = process.argv.slice(2);
const auswahl = filter.length ? liste.filter((e) => filter.includes(e.name)) : liste;

await mkdir(cache, { recursive: true });
await mkdir(ziel, { recursive: true });

const browser = await chromium.launch();
const fehler = [];

for (const eintrag of auswahl) {
  for (const ansicht of eintrag.ansichten) {
    const ganz = ansicht === 'desktop-ganz';
    const basis = ansichten[ganz ? 'desktop' : ansicht];
    const { maxBreite, ...optionen } = basis;
    const context = await browser.newContext({
      ...optionen,
      locale: 'de-CH',
      reducedMotion: 'reduce',
      colorScheme: 'light',
      // Firstlicht setzt eine strenge CSP per meta; sonst greift das Ausblende-CSS nicht.
      bypassCSP: true,
    });
    const page = await context.newPage();
    const datei = `${eintrag.name}-${ansicht}`;
    try {
      const antwort = await page.goto(eintrag.url, { waitUntil: 'networkidle', timeout: 60_000 });
      if (!antwort || !antwort.ok()) throw new Error(`HTTP ${antwort?.status()}`);
      await page.addStyleTag({ content: CSS });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const roh = path.join(cache, `${datei}.png`);
      await page.screenshot({ path: roh, fullPage: ganz });
      await sharp(roh)
        .resize({ width: maxBreite, withoutEnlargement: true })
        .webp({ quality: 90, effort: 6 })
        .toFile(path.join(ziel, `${datei}.webp`));
      console.log(`ok   ${datei}`);
    } catch (e) {
      fehler.push(`${datei}: ${e instanceof Error ? e.message : e}`);
      console.log(`FEHL ${datei}: ${e instanceof Error ? e.message : e}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();
if (fehler.length) {
  console.log(`\n${fehler.length} Screenshot(s) fehlgeschlagen.`);
  process.exitCode = 1;
}
