/**
 * Messwerte dieser Website: baut die Seite, startet «astro preview», misst
 * mit Lighthouse (mobil) Startseite, eine Fallstudie und den Lebenslauf
 * (je Deutsch und Englisch) und schreibt src/data/messwerte.json.
 * Danach neu bauen, damit der Footer die Werte zeigt.
 *   npm run measure
 *   node scripts/measure.mjs --ohne-build --pruefen   nur prüfen (für npm run qa)
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

// Astro 7 startet preview bei erkannten Agenten im Hintergrund; hier im Vordergrund.
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], {
  cwd: root,
  stdio: 'ignore',
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '0' },
});
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
const nurPruefen = process.argv.includes('--pruefen');
const verstoesse = [];
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
      // Budgets aus dem Auftrag: Leistung mindestens 95, Rest 100, LCP 1,8 s, CLS 0,02, TBT 100 ms
      const m = ergebnis.seiten[key];
      if (m.leistung < 95) verstoesse.push(`${key}: Leistung ${m.leistung}`);
      for (const k of ['barrierefreiheit', 'bestPractices', 'seo']) if (m[k] < 100) verstoesse.push(`${key}: ${k} ${m[k]}`);
      if (a['largest-contentful-paint'].numericValue > 1800) verstoesse.push(`${key}: LCP ${a['largest-contentful-paint'].displayValue}`);
      if (a['cumulative-layout-shift'].numericValue > 0.02) verstoesse.push(`${key}: CLS ${a['cumulative-layout-shift'].displayValue}`);
      if (a['total-blocking-time'].numericValue > 100) verstoesse.push(`${key}: TBT ${a['total-blocking-time'].displayValue}`);
    }
  } finally {
    chrome.kill();
  }
} finally {
  server.kill();
}

if (verstoesse.length) {
  console.error(`Lighthouse-Budgets verfehlt:\n${verstoesse.join('\n')}`);
  process.exitCode = 1;
}
if (nurPruefen) {
  console.log(verstoesse.length ? 'Lighthouse: Budgets verfehlt.' : 'Lighthouse: alle Budgets eingehalten.');
} else {
  await writeFile(path.join(root, 'src/data/messwerte.json'), `${JSON.stringify(ergebnis, null, 2)}\n`);
  console.log('src/data/messwerte.json geschrieben. Jetzt neu bauen: npm run build');
}
