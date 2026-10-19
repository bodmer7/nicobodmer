/**
 * Messwerte mit Lighthouse (mobil), geschrieben nach src/data/messwerte.json.
 *
 *   npm run measure
 *       Lokal: baut die Seite, startet «astro preview», misst Startseite,
 *       ODERA-Fallstudie und Lebenslauf (je Deutsch und Englisch).
 *       Schreibt den Teil «lokal».
 *   node scripts/measure.mjs --ohne-build --pruefen
 *       Lokal messen und nur die Budgets prüfen (für npm run qa).
 *   node scripts/measure.mjs --extern
 *       Live-Seiten, je drei Läufe, Median (computeMedianRun von Lighthouse).
 *       Schreibt «website» (nico-bodmer.ch) und «projekte» (odera.ch,
 *       Musterprojekte, Geo-Quiz). Läuft in .github/workflows/extern.yml,
 *       weil die Arbeitsumgebung von Claude kein Netz nach aussen hat.
 *
 * Ohne installiertes Chrome nutzt Lighthouse das Chromium von Playwright.
 */
import { spawn, execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { computeMedianRun } from 'lighthouse/core/lib/median-run.js';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const datei = path.join(root, 'src/data/messwerte.json');
const PORT = 4329;
const extern = process.argv.includes('--extern');
const nurPruefen = process.argv.includes('--pruefen');
const heute = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

const lokaleSeiten = {
  start: '/',
  'start-en': '/en/',
  'fall-odera': '/arbeiten/odera/',
  'fall-odera-en': '/en/work/odera/',
  cv: '/lebenslauf/',
  'cv-en': '/en/cv/',
};

const websiteSeiten = {
  start: 'https://nico-bodmer.ch/',
  'fall-odera': 'https://nico-bodmer.ch/arbeiten/odera/',
  cv: 'https://nico-bodmer.ch/lebenslauf/',
};

const projektSeiten = {
  odera: 'https://odera.ch/',
  doppelmeter: 'https://odera.ch/musterprojekte/doppelmeter/',
  firstlicht: 'https://odera.ch/musterprojekte/firstlicht/',
  'geo-quiz': 'https://bodmer7.github.io/segberike/',
};

/** Kennzahlen aus einem Lighthouse-Ergebnis */
function auswerten(lhr) {
  const c = lhr.categories;
  const s = (k) => Math.round((c[k].score ?? 0) * 100);
  const a = lhr.audits;
  return {
    url: lhr.finalDisplayedUrl ?? lhr.requestedUrl,
    leistung: s('performance'),
    barrierefreiheit: s('accessibility'),
    bestPractices: s('best-practices'),
    seo: s('seo'),
    kb: Math.round(a['total-byte-weight'].numericValue / 1024),
    lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
    cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    tbtMs: Math.round(a['total-blocking-time'].numericValue),
  };
}

async function messen(chrome, url, laeufe) {
  const ergebnisse = [];
  for (let i = 0; i < laeufe; i++) {
    const r = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', formFactor: 'mobile' });
    if (r?.lhr && !r.lhr.runtimeError) ergebnisse.push(r.lhr);
  }
  if (ergebnisse.length === 0) throw new Error(`Keine gültige Messung für ${url}`);
  return auswerten(laeufe > 1 ? computeMedianRun(ergebnisse) : ergebnisse[0]);
}

async function bisherige() {
  try {
    return JSON.parse(await readFile(datei, 'utf8'));
  } catch {
    return {};
  }
}

const chromePath = process.env.CHROME_PATH ?? chromium.executablePath();
const flags = ['--headless=new', '--no-sandbox'];

if (extern) {
  const daten = await bisherige();
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: flags });
  const fehler = [];
  try {
    const website = { datum: heute, methode: 'Lighthouse mobil, Median aus drei Läufen', seiten: {} };
    const projekte = { datum: heute, methode: 'Lighthouse mobil, Median aus drei Läufen', seiten: {} };
    for (const [key, url] of Object.entries(websiteSeiten)) {
      try {
        website.seiten[key] = await messen(chrome, url, 3);
        console.log('website', key, website.seiten[key]);
      } catch (e) {
        fehler.push(`${url}: ${e.message}`);
      }
    }
    for (const [key, url] of Object.entries(projektSeiten)) {
      try {
        projekte.seiten[key] = await messen(chrome, url, 3);
        console.log('projekt', key, projekte.seiten[key]);
      } catch (e) {
        fehler.push(`${url}: ${e.message}`);
      }
    }
    // Nur überschreiben, was gemessen wurde; alte Werte sonst behalten.
    if (Object.keys(website.seiten).length) daten.website = website;
    if (Object.keys(projekte.seiten).length) daten.projekte = projekte;
  } finally {
    chrome.kill();
  }
  await writeFile(datei, `${JSON.stringify(daten, null, 2)}\n`);
  console.log('src/data/messwerte.json geschrieben (website, projekte).');
  if (fehler.length) {
    console.error(`Nicht messbar:\n${fehler.join('\n')}`);
    process.exitCode = 1;
  }
} else {
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
        if ((await fetch(`http://localhost:${PORT}/`)).ok) return;
      } catch {
        /* Server startet noch */
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error('astro preview startet nicht');
  };

  const lokal = { datum: heute, methode: 'Lighthouse mobil, astro preview', seiten: {} };
  const verstoesse = [];
  try {
    await warten();
    const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: flags });
    try {
      for (const [key, pfad] of Object.entries(lokaleSeiten)) {
        const m = await messen(chrome, `http://localhost:${PORT}${pfad}`, 1);
        delete m.url;
        lokal.seiten[key] = m;
        console.log(key, m);
        // Budgets aus dem Auftrag: Leistung mindestens 95, Rest 100, LCP 1,8 s, CLS 0,02, TBT 100 ms
        if (m.leistung < 95) verstoesse.push(`${key}: Leistung ${m.leistung}`);
        for (const k of ['barrierefreiheit', 'bestPractices', 'seo']) if (m[k] < 100) verstoesse.push(`${key}: ${k} ${m[k]}`);
        if (m.lcpMs > 1800) verstoesse.push(`${key}: LCP ${m.lcpMs} ms`);
        if (m.cls > 0.02) verstoesse.push(`${key}: CLS ${m.cls}`);
        if (m.tbtMs > 100) verstoesse.push(`${key}: TBT ${m.tbtMs} ms`);
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
    const daten = await bisherige();
    daten.lokal = lokal;
    delete daten.datum;
    delete daten.seiten;
    await writeFile(datei, `${JSON.stringify(daten, null, 2)}\n`);
    console.log('src/data/messwerte.json geschrieben (lokal). Jetzt neu bauen: npm run build');
  }
}
