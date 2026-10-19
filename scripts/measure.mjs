/**
 * Messwerte dieser Website: baut die Seite, startet «astro preview», misst
 * mit Lighthouse (mobil) Startseite, eine Fallstudie und den Lebenslauf
 * (je Deutsch und Englisch) und schreibt src/data/messwerte.json.
 * Danach neu bauen, damit der Footer die Werte zeigt.
 *   npm run measure
 * Ohne installiertes Chrome nutzt Lighthouse das Chromium von Playwright.
 */
import { spawn, execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4329;
const seiten = {
  start: '/',
  'start-en': '/en/',
  'fall-odera': '/arbeiten/odera/',
  'fall-odera-en': '/en/work/odera/',
  cv: '/lebenslauf/',
  'cv-en': '/en/cv/',
};

if (!process.argv.includes('--ohne-build')) execSync('npx astro build', { cwd: root, stdio: 'inherit' });

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { cwd: root, stdio: 'ignore' });
const warten = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/`);
      if (r.ok) return;
    } catch {
      /* Server startet noch */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('astro preview startet nicht');
};

const chromePath = process.env.CHROME_PATH ?? chromium.executablePath();
const ergebnis = { datum: new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }), seiten: {} };

try {
  await warten();
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] });
  try {
    for (const [key, pfad] of Object.entries(seiten)) {
      const r = await lighthouse(`http://localhost:${PORT}${pfad}`, { port: chrome.port, output: 'json', logLevel: 'error', formFactor: 'mobile' });
      const c = r.lhr.categories;
      const s = (k) => Math.round((c[k].score ?? 0) * 100);
      ergebnis.seiten[key] = {
        leistung: s('performance'),
        barrierefreiheit: s('accessibility'),
        bestPractices: s('best-practices'),
        seo: s('seo'),
        kb: Math.round(r.lhr.audits['total-byte-weight'].numericValue / 1024),
      };
      const a = r.lhr.audits;
      console.log(key, ergebnis.seiten[key], 'LCP', a['largest-contentful-paint'].displayValue, 'CLS', a['cumulative-layout-shift'].displayValue, 'TBT', a['total-blocking-time'].displayValue);
    }
  } finally {
    await chrome.kill();
  }
} finally {
  server.kill();
}

await writeFile(path.join(root, 'src/data/messwerte.json'), `${JSON.stringify(ergebnis, null, 2)}\n`);
console.log('src/data/messwerte.json geschrieben. Jetzt neu bauen: npm run build');
