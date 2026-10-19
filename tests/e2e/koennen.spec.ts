import { test, expect } from '@playwright/test';
import { beobachten } from './hilfen';

const THEMEN = ['Software Engineering (mit Python-Grundlagen)', 'Introduction to AI', 'Math for Business', 'Strategic Management', 'Finance', 'Study Skills'];

test.describe('Können ab 1024px: Tabs', () => {
  test('Pfeiltasten, Home und End wechseln Tab und Panel', async ({ page }) => {
    const { fehler } = await beobachten(page);
    await page.goto('/');
    const tabs = page.locator('[data-koennen] [role="tab"]');
    await expect(tabs).toHaveCount(8);
    await expect(page.locator('[data-koennen] [role="tablist"]')).toHaveAttribute('aria-orientation', 'vertical');

    const erster = tabs.first();
    await expect(erster).toHaveAttribute('aria-selected', 'true');
    await expect(erster).toContainText('Web und Umsetzung');
    await expect(page.locator('#koennen-web')).toBeVisible();
    await expect(page.locator('#koennen-betrieb')).toBeHidden();

    await erster.focus();
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#koennen-betrieb')).toBeVisible();
    await expect(page.locator('#koennen-web')).toBeHidden();

    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await expect(page.locator('#koennen-sprachen')).toBeVisible();
    await expect(page.locator('#koennen-sprachen')).toContainText('Muttersprache');

    await page.keyboard.press('ArrowDown');
    await expect(erster).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(tabs.last()).toBeFocused();

    await page.keyboard.press('Home');
    await expect(erster).toBeFocused();
    await expect(page.locator('#koennen-web')).toBeVisible();
    await expect(page.locator('#koennen-web')).toHaveAttribute('role', 'tabpanel');
    expect(fehler).toEqual([]);
  });

  test('Tabelle zeigt Niveau als Text, sortiert nach Sicher, Erfahrung, Grundlagen', async ({ page }) => {
    await beobachten(page);
    await page.goto('/');
    await page.locator('[data-tab="vertrieb"]').click();
    const zeilen = page.locator('#koennen-vertrieb tbody tr');
    await expect(zeilen.first().locator('th')).toHaveText('Präsentieren');
    await expect(zeilen.first().locator('.koennen__niveau')).toContainText('Sicher');
    const niveaus = await page.locator('#koennen-vertrieb .koennen__niveau').allInnerTexts();
    expect(niveaus.map((n) => n.replace('Niveau:', '').trim())).toEqual(['Sicher', 'Erfahrung', 'Erfahrung', 'Erfahrung', 'Erfahrung']);
    await expect(page.locator('#koennen-vertrieb thead th')).toHaveText(['Fähigkeit', 'Niveau', 'Eingesetzt in']);

    await page.locator('[data-tab="web"]').click();
    await expect(page.locator('#koennen-web')).toContainText('In meinen Projekten eingesetzt: Astro, Vite, Leaflet, Playwright, Tailwind, Supabase');

    // Arbeitsweise ohne Niveau-Spalte, Nachweise mit Zusatz
    await page.locator('[data-tab="arbeitsweise"]').click();
    await expect(page.locator('#koennen-arbeitsweise thead th')).toHaveText(['Fähigkeit', 'Eingesetzt in']);
    await expect(page.locator('#koennen-arbeitsweise')).toContainText('(wöchentliche Kurzpräsentationen)');
  });

  test('Nachweis-Link zur Laufbahn öffnet den richtigen Balken', async ({ page }) => {
    await beobachten(page);
    await page.goto('/');
    await page.locator('[data-tab="support"]').click();
    await page.locator('#koennen-support a[href="#lb-support-lenovo"]').click();
    await expect(page.locator('[data-balken="support-lenovo"]')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-detail]')).toContainText('Technical Support Lenovo');
  });

  test('Link aus der Laufbahn wählt die Gruppe', async ({ page }) => {
    await beobachten(page);
    await page.goto('/#koennen-studium');
    await expect(page.locator('[data-tab="studium"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#koennen-studium')).toBeVisible();
  });

  test('Gruppe «Im Studium» mit den Themen des 1. Semesters', async ({ page }) => {
    await beobachten(page);
    await page.goto('/');
    await page.locator('[data-tab="studium"]').click();
    const panel = page.locator('#koennen-studium');
    await expect(panel.locator('h3 svg.icon')).toHaveCount(1);
    await expect(panel).toContainText('seit 09/2026');
    await expect(panel.locator('tbody th')).toHaveText(THEMEN);
    await expect(panel.locator('.koennen__niveau').first()).toContainText('1. Semester');
    await expect(panel).toContainText('Der Studiengang verbindet Software Engineering');
    await expect(panel.locator('a[href="#lb-bsc-hwz"]').first()).toBeVisible();
  });
});

test.describe('Können unter 1024px: Akkordeons', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('details statt Tabs, erste Gruppe offen, gestapelte Zeilen', async ({ page }) => {
    await beobachten(page);
    await page.goto('/');
    await expect(page.locator('[data-koennen] [role="tablist"]')).toBeHidden();
    const details = page.locator('[data-koennen] details');
    await expect(details).toHaveCount(8);
    await expect(details.first()).toHaveAttribute('open', '');
    await expect(details.nth(1)).not.toHaveAttribute('open', '');
    await expect(page.locator('#koennen-web .koennen__zelllabel').first()).toBeVisible();
    await page.locator('#koennen-studium summary').click();
    await expect(page.locator('#koennen-studium tbody')).toBeVisible();
    const breite = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(breite).toBeLessThanOrEqual(390);
  });

  test('kein seitliches Scrollen bei 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/');
    for (const d of await page.locator('[data-koennen] details').all()) await d.evaluate((el) => ((el as HTMLDetailsElement).open = true));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});

test.describe('Können ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('alle Gruppen stehen mit ihren Tabellen untereinander', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-koennen] [role="tablist"]')).toBeHidden();
    const gruppen = page.locator('[data-koennen] [data-gruppe]');
    await expect(gruppen).toHaveCount(8);
    for (const g of await gruppen.all()) {
      await expect(g.locator('table')).toBeVisible();
    }
    await expect(page.locator('#koennen-studium')).toContainText('Study Skills');
  });
});
