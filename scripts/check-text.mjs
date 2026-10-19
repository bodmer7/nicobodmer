/**
 * Textprüfung: Keine Gedankenstriche, Mittelpunkte, Pfeile und kein Eszett
 * in Quelltexten mit sichtbarem Text, im gebauten HTML und in der Doku.
 *   U+2014 Geviertstrich, U+2013 Halbgeviertstrich, U+00B7 Mittelpunkt,
 *   U+2192, U+2197, U+2193 Pfeile, U+00DF Eszett
 * Aufruf: npm run check:text (nach dem Build, sonst nur Quellen)
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERBOTEN = /[—–·→↗↓ß]/;
const NAMEN = { '—': 'Geviertstrich', '–': 'Halbgeviertstrich', '·': 'Mittelpunkt', '→': 'Pfeil', '↗': 'Pfeil', '↓': 'Pfeil', 'ß': 'Eszett' };

const ordner = ['src/content', 'src/data', 'src/i18n', 'src/pages', 'src/components', 'src/layouts', 'dist'];
const einzeln = ['README.md', 'CONTENT.md', 'CLAUDE.md'];
const endungen = new Set(['.astro', '.ts', '.md', '.json', '.html', '.xml', '.txt', '.vcf']);

async function* dateien(dir) {
  let eintraege;
  try {
    eintraege = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of eintraege) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* dateien(p);
    else if (endungen.has(path.extname(e.name))) yield p;
  }
}

const funde = [];
const pruefen = async (datei) => {
  const text = await readFile(datei, 'utf8');
  text.split('\n').forEach((zeile, i) => {
    const m = zeile.match(VERBOTEN);
    if (m) funde.push(`${path.relative(root, datei)}:${i + 1}: ${NAMEN[m[0]]} in «${zeile.trim().slice(0, 100)}»`);
  });
};

for (const o of ordner) for await (const d of dateien(path.join(root, o))) await pruefen(d);
for (const e of einzeln) {
  const d = path.join(root, e);
  if (await stat(d).catch(() => null)) await pruefen(d);
}

if (funde.length) {
  console.error(`Textprüfung: ${funde.length} Fund(e)\n${funde.join('\n')}`);
  process.exit(1);
}
console.log('Textprüfung: keine verbotenen Zeichen.');
