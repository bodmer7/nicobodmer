import { test, expect } from '@playwright/test';
import { ALLE, beobachten } from './hilfen';

for (const pfad of ALLE) {
  test(`lädt ohne Fehler: ${pfad}`, async ({ page }) => {
    const { fehler, extern } = await beobachten(page);
    const antwort = await page.goto(pfad, { waitUntil: 'networkidle' });
    expect(antwort?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.skip-link')).toHaveCount(1);
    expect(fehler).toEqual([]);
    expect(extern).toEqual([]);
  });
}

test('404 liefert die eigene Seite', async ({ page }) => {
  const antwort = await page.goto('/gibt-es-nicht/');
  expect(antwort?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Diese Seite liegt nicht auf der Karte.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

const breiten = [320, 360, 390, 768, 1024, 1440, 1920, 2560];
for (const pfad of ['/', '/en/', '/arbeiten/musterprojekte/', '/lebenslauf/']) {
  test(`kein seitliches Scrollen: ${pfad}`, async ({ page }) => {
    for (const w of breiten) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(pfad);
      const zuBreit = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(zuBreit, `Breite ${w}`).toBeLessThanOrEqual(0);
    }
  });
}

test('Metadaten: hreflang, canonical, Titel ohne Arbeitgeber', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Nico Bodmer | Websites, Apps und technischer Vertrieb');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://nico-bodmer.ch/');
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://nico-bodmer.ch/en/');
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://nico-bodmer.ch/');
  const beschreibung = await page.locator('meta[name="description"]').getAttribute('content');
  expect(beschreibung).not.toContain('IBM');
  expect((await page.title()).includes('IBM')).toBe(false);
  await expect(page.locator('.hero')).not.toContainText('IBM');
});
