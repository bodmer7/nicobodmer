/**
 * Alle Prüfungen nacheinander: npm run qa
 * Bricht beim ersten Fehler ab. Externe Links werden geprüft, aber nur als
 * Warnung gemeldet (Netz kann fehlen).
 */
import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lauf = (befehl, optional = false) => {
  console.log(`\n=== ${befehl}`);
  try {
    execSync(befehl, { cwd: root, stdio: 'inherit' });
  } catch (e) {
    if (optional) console.warn(`Warnung: ${befehl} meldet Probleme (siehe oben).`);
    else throw e;
  }
};

lauf('npx astro check');
lauf('npx astro build');
lauf('node scripts/check-text.mjs');
lauf('node scripts/check-size.mjs');
lauf('npx html-validate "dist/**/*.html"');
lauf('npx linkinator dist --recurse --skip "^https?://(?!localhost|127\\.0\\.0\\.1)"');
lauf('npx linkinator dist --recurse --retry --timeout 15000', true);
lauf('npx playwright test');
lauf('node scripts/measure.mjs --ohne-build --pruefen');

// QA-Screenshots gegen einen eigenen Vorschau-Server
const server = spawn('npx', ['astro', 'preview', '--port', '4331', '--ignore-lock'], {
  cwd: root,
  stdio: 'ignore',
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '0' },
});
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch('http://localhost:4331/')).ok) break;
    } catch {
      /* startet noch */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  process.env.QA_BASE = 'http://localhost:4331';
  lauf('node scripts/qa-screenshots.mjs');
} finally {
  server.kill();
}
console.log('\nQA abgeschlossen. Screenshots in qa-screenshots/ ansehen.');
