/**
 * Grössenprüfung: dist/ muss unter 9 MB bleiben (Infomaniak Starter hat
 * 10 MB Speicher). Bricht den Build mit Fehler ab, wenn es mehr ist.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GRENZE = 9 * 1024 * 1024;

async function groesse(dir) {
  let summe = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    summe += e.isDirectory() ? await groesse(p) : (await stat(p)).size;
  }
  return summe;
}

const bytes = await groesse(path.join(root, 'dist'));
const mb = (bytes / 1024 / 1024).toFixed(2);
if (bytes > GRENZE) {
  console.error(`Grössenprüfung: dist/ ist ${mb} MB, erlaubt sind höchstens 9 MB.`);
  process.exit(1);
}
console.log(`Grössenprüfung: dist/ ist ${mb} MB (Grenze 9 MB).`);
