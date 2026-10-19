import { test, expect } from '@playwright/test';
import { beobachten } from './hilfen';

test('Kopfzeile: LinkedIn als Icon-Link mit aria-label', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  const link = page.locator('[data-kopf-linkedin]');
  await expect(link).toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\/in\//);
  await expect(link).toHaveAttribute('aria-label', 'LinkedIn-Profil von Nico Bodmer (externe Seite)');
  await expect(link.locator('svg[data-marke="linkedin"]')).toHaveCount(1);
  const box = await link.boundingBox();
  expect(box?.width).toBe(44);
  expect(box?.height).toBe(44);

  await page.goto('/en/');
  await expect(page.locator('[data-kopf-linkedin]')).toHaveAttribute('aria-label', 'Nico Bodmer on LinkedIn (external site)');
});

test('Externe Links der Fallstudien haben das Icon «extern»', async ({ page }) => {
  await beobachten(page);
  for (const pfad of ['/arbeiten/odera/', '/arbeiten/musterprojekte/', '/arbeiten/geo-quiz/']) {
    await page.goto(pfad);
    const links = page.locator('.fall__links a[href^="http"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const l of await links.all()) await expect(l.locator('svg.icon')).toHaveCount(1);
  }
});

test('Alle Icons und Marken sind dekorativ (aria-hidden)', async ({ page }) => {
  for (const pfad of ['/', '/lebenslauf/', '/arbeiten/odera/', '/en/']) {
    await page.goto(pfad);
    const ohne = await page.locator('svg.icon:not([aria-hidden="true"]), svg.marke-icon:not([aria-hidden="true"])').count();
    expect(ohne, pfad).toBe(0);
    expect(await page.locator('svg.marke-icon').count(), pfad).toBeGreaterThan(0);
  }
});

test('Kontakt, Fusszeile und Lebenslauf zeigen die Icons', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await expect(page.locator('.kontakt__mailzeile svg.icon')).toHaveCount(1);
  await expect(page.locator('.kontakt__aktionen svg[data-marke]')).toHaveCount(2);
  await expect(page.locator('.fuss svg[data-marke]')).toHaveCount(2);
  await page.goto('/lebenslauf/');
  await expect(page.locator('.cv__kontakt li svg')).toHaveCount(6);
});
