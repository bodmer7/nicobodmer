import { test, expect } from '@playwright/test';
import { beobachten } from './hilfen';

test('Geo-Quiz: iframe erst nach Klick', async ({ page }) => {
  const { extern } = await beobachten(page);
  await page.goto('/arbeiten/geo-quiz/', { waitUntil: 'networkidle' });
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(extern.filter((u) => u.includes('github.io'))).toEqual([]);
  await page.locator('[data-demo-start]').click();
  await expect(page.locator('iframe.demo__iframe')).toHaveAttribute('src', 'https://bodmer7.github.io/segberike/');
});

test('Lightbox: öffnen, Pfeiltasten, Esc, Fokus zurück', async ({ page }) => {
  await beobachten(page);
  await page.goto('/arbeiten/odera/');
  const ausloeser = page.locator('[data-lightbox]').first();
  await ausloeser.click();
  const dialog = page.locator('dialog[data-lightbox-dialog]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('[data-lightbox-zaehler]')).toHaveText('1 von 4');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-lightbox-zaehler]')).toHaveText('2 von 4');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('[data-lightbox-zaehler]')).toHaveText('4 von 4');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(ausloeser).toBeFocused();
});

test('Inhaltsverzeichnis, Messwerte mit Quelle, nächstes Projekt', async ({ page }) => {
  await beobachten(page);
  await page.goto('/arbeiten/musterprojekte/');
  await expect(page.locator('[data-toc-link="messwerte"]')).toBeVisible();
  await expect(page.locator('.messwerte__fussnoten li')).toHaveCount(4);
  await expect(page.locator('.messwerte__fussnoten')).toContainText('1. Oktober 2026');
  await expect(page.locator('.fall__naechstes')).toContainText('Geo-Quiz');
  await expect(page.locator('main')).toContainText('frei erfunden');
});

test('Mini-Dashboard: Pfeiltasten zeigen Tag und Wert', async ({ page }) => {
  await beobachten(page);
  await page.goto('/arbeiten/morgen-check-in/');
  await expect(page.locator('.dash')).toContainText('Beispieldaten');
  const verlauf = page.locator('[data-verlauf]').first();
  await verlauf.focus();
  await expect(verlauf.locator('[data-tooltip]')).toHaveText('So: 64');
  await page.keyboard.press('ArrowLeft');
  await expect(verlauf.locator('[data-tooltip]')).toHaveText('Sa: 79');
});

test('Lebenslauf: Daten aus profil.ts, PDF-Knopf', async ({ page }) => {
  await beobachten(page);
  await page.goto('/lebenslauf/');
  await expect(page.locator('.cv__eintrag')).toHaveCount(8);
  await expect(page.locator('[data-drucken]')).toBeVisible();
  await expect(page.locator('main')).toContainText('Informatiker EFZ, Fachrichtung Plattformentwicklung');
  await expect(page.locator('main')).toContainText('Bezirksschule Mutschellen');
  await expect(page.locator('.cv__profil')).toContainText('Mein Ziel:');
  await expect(page.locator('.cv__referenzen')).toHaveText('Referenzen auf Anfrage.');
  await expect(page.locator('main')).not.toContainText(/Platform Developer/i);
});

test('Was ich gelernt habe erscheint auf allen Fallstudien', async ({ page }) => {
  await beobachten(page);
  for (const pfad of ['/arbeiten/odera/', '/arbeiten/musterprojekte/', '/arbeiten/geo-quiz/', '/arbeiten/morgen-check-in/']) {
    await page.goto(pfad);
    await expect(page.locator('#gelernt')).toHaveText(/Was ich gelernt habe/);
    await expect(page.locator('[data-toc-link="gelernt"]')).toHaveCount(1);
  }
  await page.goto('/en/work/geo-quiz/');
  await expect(page.locator('#gelernt')).toHaveText(/What I learned/);
});
