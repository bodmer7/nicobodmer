/**
 * OG-Bild (1200x630) und Apple-Touch-Icon rendern.
 * Die HTML-Vorlage entsteht nur temporär in scripts/.cache/ und wird nicht
 * ausgeliefert. Aufruf: npm run og
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'scripts/.cache');
await mkdir(cache, { recursive: true });

const schrift = pathToFileURL(path.join(root, 'public/fonts/schibsted-grotesk-latin.woff2')).href;
const foto = pathToFileURL(path.join(root, 'src/assets/fotos/contact-portrait.webp')).href;
const favicon = pathToFileURL(path.join(root, 'public/favicon.svg')).href;

const og = `<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${schrift}) format("woff2");font-weight:400 900}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#F2F2EF;color:#141619;font-family:S}
.name{position:absolute;left:64px;top:150px;margin:0;font-size:150px;font-weight:900;letter-spacing:-0.045em;line-height:0.85}
.rolle{position:absolute;left:64px;bottom:64px;width:620px;margin:0;font-size:27px;font-weight:450;line-height:1.35;color:#141619}
.signal{position:absolute;left:64px;bottom:178px;width:96px;height:10px;background:#C8261C}
img{position:absolute;right:0;top:0;width:420px;height:630px;object-fit:cover;object-position:50% 14%}
</style></head><body>
<h1 class="name">Nico<br>Bodmer</h1>
<div class="signal"></div>
<p class="rolle">Platform Developer EFZ. Technischer Vertrieb für Data &amp; AI. Websites mit ODERA Design.</p>
<img src="${foto}" alt="">
</body></html>`;

const icon = `<!doctype html><html><body style="margin:0;width:180px;height:180px">
<img src="${favicon}" width="180" height="180" style="display:block"></body></html>`;

await writeFile(path.join(cache, 'og.html'), og);
await writeFile(path.join(cache, 'icon.html'), icon);

const browser = await chromium.launch();
let page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(cache, 'og.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(cache, 'og.png') });
page = await browser.newPage({ viewport: { width: 180, height: 180 } });
await page.goto(pathToFileURL(path.join(cache, 'icon.html')).href);
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') });
await browser.close();

await sharp(path.join(cache, 'og.png')).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(root, 'public/og.jpg'));
console.log('og.jpg und apple-touch-icon.png geschrieben');
