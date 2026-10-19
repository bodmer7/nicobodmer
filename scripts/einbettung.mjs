/**
 * Prüft, ob odera.ch, die Musterprojekte und das Geo-Quiz in ein iframe
 * geladen werden dürfen, und schreibt src/data/einbettung.json.
 *   1. Antwort-Header: X-Frame-Options und frame-ancestors in der CSP.
 *   2. Klicktest auf der Live-Seite nico-bodmer.ch: «Live laden» bzw.
 *      «Quiz hier spielen» klicken und prüfen, dass im iframe Inhalt steht.
 * Läuft in .github/workflows/extern.yml (braucht Netz nach aussen).
 *   node scripts/einbettung.mjs
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIVE = process.env.LIVE_BASE ?? 'https://nico-bodmer.ch';
const heute = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

const ziele = {
  odera: { url: 'https://odera.ch/', seite: '/', tab: 'odera' },
  doppelmeter: { url: 'https://odera.ch/musterprojekte/doppelmeter/', seite: '/', tab: 'doppelmeter' },
  firstlicht: { url: 'https://odera.ch/musterprojekte/firstlicht/', seite: '/', tab: 'firstlicht' },
  'geo-quiz': { url: 'https://bodmer7.github.io/segberike/', seite: '/arbeiten/geo-quiz/', tab: null },
};

/** Header prüfen: erlaubt die Seite das Einbetten auf nico-bodmer.ch? */
async function header(url) {
  const r = await fetch(url, { redirect: 'follow' });
  const xfo = r.headers.get('x-frame-options');
  const csp = r.headers.get('content-security-policy');
  const fa = csp?.split(';').map((t) => t.trim()).find((t) => t.toLowerCase().startsWith('frame-ancestors')) ?? null;
  let erlaubt = true;
  if (xfo && /deny|sameorigin/i.test(xfo)) erlaubt = false;
  if (fa) {
    const quellen = fa.split(/\s+/).slice(1);
    erlaubt = quellen.some((q) => q === '*' || q === 'https:' || /nico-bodmer\.ch/.test(q));
  }
  return { xFrameOptions: xfo, frameAncestors: fa, erlaubt };
}

/** Klicktest auf der Live-Seite; null, wenn die Live-Seite die Funktion noch nicht hat. */
async function klicktest(page, ziel) {
  await page.goto(LIVE + ziel.seite, { waitUntil: 'networkidle' });
  if (ziel.tab) {
    const tab = page.locator(`[data-tab="${ziel.tab}"]`);
    if ((await tab.count()) === 0) return null;
    await tab.click();
    const knopf = page.locator('[data-live-laden]');
    if ((await knopf.count()) === 0 || !(await knopf.isVisible())) return null;
    await knopf.click();
  } else {
    const knopf = page.locator('[data-demo-start]');
    if ((await knopf.count()) === 0 || !(await knopf.isVisible())) return null;
    await knopf.click();
  }
  const iframe = page.locator('iframe').first();
  await iframe.waitFor({ timeout: 15_000 });
  const frame = await (await iframe.elementHandle())?.contentFrame();
  if (!frame) return false;
  try {
    await frame.waitForLoadState('load', { timeout: 20_000 });
    const text = await frame.locator('body').innerText({ timeout: 10_000 });
    return text.trim().length > 20;
  } catch {
    return false;
  }
}

const ergebnis = { datum: heute, seiten: {} };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [id, ziel] of Object.entries(ziele)) {
  const h = await header(ziel.url);
  let live = null;
  try {
    live = await klicktest(page, ziel);
  } catch (e) {
    console.warn(`Klicktest ${id}: ${e.message}`);
  }
  ergebnis.seiten[id] = {
    url: ziel.url,
    xFrameOptions: h.xFrameOptions,
    frameAncestors: h.frameAncestors,
    live,
    einbettbar: h.erlaubt && live !== false,
  };
  console.log(id, ergebnis.seiten[id]);
}
await browser.close();
await writeFile(path.join(root, 'src/data/einbettung.json'), `${JSON.stringify(ergebnis, null, 2)}\n`);
console.log('src/data/einbettung.json geschrieben.');
