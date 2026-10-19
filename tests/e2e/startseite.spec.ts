import { test, expect } from '@playwright/test';
import { beobachten } from './hilfen';

test.describe('Zielgruppen-Schalter', () => {
  test('?fuer=website wählt vor, ordnet Projekte und Composer', async ({ page }) => {
    await beobachten(page);
    await page.goto('/?fuer=website');
    await expect(page.locator('#fuer-website')).toBeChecked();
    await expect(page.locator('[data-variante="website"]')).toBeVisible();
    await expect(page.locator('[data-variante="neutral"]')).toBeHidden();
    const reihe = await page.locator('[data-projektliste] > [data-projekt]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.projekt));
    expect(reihe.slice(0, 2)).toEqual(['odera', 'musterprojekte']);
    await expect(page.locator('#thema-website')).toBeChecked();
  });

  test('?for=job auf Englisch, Lebenslauf als Signal-Button', async ({ page }) => {
    await beobachten(page);
    await page.goto('/en/?for=job');
    await expect(page.locator('#fuer-stelle')).toBeChecked();
    await expect(page.locator('[data-variante="stelle"] .btn--signal')).toHaveText('View my CV');
    await expect(page.locator('#thema-stelle')).toBeChecked();
  });

  test('Klick und Pfeiltasten wechseln, Ansage für Screenreader', async ({ page }) => {
    await beobachten(page);
    await page.goto('/');
    await expect(page.locator('[data-variante="neutral"]')).toBeVisible();
    await page.locator('label:has(#fuer-stelle)').click();
    await expect(page.locator('[data-variante="stelle"]')).toBeVisible();
    await expect(page.locator('[data-ansage]')).toContainText('Technisch ausgebildet');
    await page.locator('#fuer-stelle').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#fuer-website')).toBeChecked();
    await expect(page.locator('[data-variante="website"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('#fuer-website')).toBeChecked();
  });
});

test('Hell/Dunkel bleibt nach dem Neuladen und wird vor dem Zeichnen gesetzt', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await page.locator('.kopf [data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload({ waitUntil: 'commit' });
  await page.waitForSelector('body');
  const frueh = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor }));
  expect(frueh.theme).toBe('dark');
  expect(frueh.bg).toBe('rgb(17, 18, 20)');
});

test('Sprachumschalter führt auf die entsprechende Seite', async ({ page }) => {
  await beobachten(page);
  for (const [von, nach] of [
    ['/', '/en/'],
    ['/lebenslauf/', '/en/cv/'],
    ['/arbeiten/musterprojekte/', '/en/work/sample-projects/'],
    ['/en/work/morning-check-in/', '/arbeiten/morgen-check-in/'],
    ['/en/legal/', '/impressum-datenschutz/'],
  ]) {
    await page.goto(von);
    await expect(page.locator('.kopf [data-sprache]')).toHaveAttribute('href', nach);
  }
  await page.goto('/lebenslauf/');
  await page.locator('.kopf [data-sprache]').click();
  await expect(page).toHaveURL(/\/en\/cv\/$/);
});

test('Projektliste: Fokus wechselt die Vorschau', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await expect(page.locator('[data-vorschau="odera"]')).toHaveClass(/ist-aktiv/);
  await page.locator('[data-vorschau-fuer="geo-quiz"]').focus();
  await expect(page.locator('[data-vorschau="geo-quiz"]')).toHaveClass(/ist-aktiv/);
  await expect(page.locator('[data-vorschau="odera"]')).not.toHaveClass(/ist-aktiv/);
});

test('Viewport-Labor: Tabs, Geräte, Live erst nach Klick, Ziehgriff per Tastatur', async ({ page }) => {
  const { extern } = await beobachten(page);
  await page.goto('/');
  const tab = page.locator('[data-tab="odera"]');
  await tab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-tab="doppelmeter"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#labor-panel-doppelmeter')).toBeVisible();
  await page.locator('label:has(#labor-tablet)').click();
  await expect(page.locator('#labor-panel-doppelmeter img[data-geraet="tablet"]')).toBeVisible();
  await page.waitForTimeout(500);
  expect(extern.filter((u) => u.includes('odera.ch'))).toEqual([]);
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.locator('[data-live-laden]').click();
  await expect(page.locator('#labor-panel-doppelmeter iframe')).toHaveAttribute('src', 'https://odera.ch/musterprojekte/doppelmeter/');
  const griff = page.locator('#labor-panel-doppelmeter [data-griff]');
  await expect(griff).toHaveAttribute('aria-valuenow', '768');
  await griff.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Shift+ArrowLeft');
  await expect(griff).toHaveAttribute('aria-valuenow', '708');
  await page.locator('[data-live-aus]').click();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('Viewport-Labor mobil: Live öffnen als Link statt Ziehgriff', async ({ page }) => {
  await beobachten(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-live-laden]')).toBeHidden();
  await expect(page.locator('[data-live-link]')).toBeVisible();
  await expect(page.locator('[data-live-link]')).toHaveAttribute('target', '_blank');
});

test('Laufbahn: Pfeiltasten, Detailfeld, vollständige Liste', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await page.locator('#lb-help-desk').focus();
  await expect(page.locator('[data-detail] h3')).toHaveText('IT Help Desk');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#lb-support-lenovo')).toBeFocused();
  await expect(page.locator('[data-detail] h3')).toHaveText('Technical Support Lenovo');
  await page.keyboard.press('End');
  await expect(page.locator('[data-detail] h3')).toHaveText('Diese Website');
  await expect(page.locator('#lb-projekt-website')).toHaveAttribute('tabindex', '0');
  await page.locator('label:has(#laufbahn-liste)').click();
  const liste = page.locator('[data-laufbahn-liste]');
  await expect(liste).toBeVisible();
  await expect(liste.locator('.eintrag')).toHaveCount(4 + 3 + 4);
  for (const rolle of ['Tech Seller Data & AI', 'Web Development & Deployment', 'Technical Support Lenovo', 'IT Help Desk']) {
    await expect(liste).toContainText(rolle);
  }
});

test('Laufbahn startet mobil als Liste', async ({ page }) => {
  await beobachten(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#laufbahn-liste')).toBeChecked();
  await expect(page.locator('[data-laufbahn-liste]')).toBeVisible();
});

test('Können: Nachweis öffnet, markiert und schliesst', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  const begriff = page.locator('[data-begriff="support"]').first();
  await begriff.click();
  await expect(begriff).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nachweis-support')).toBeVisible();
  await expect(page.locator('[data-balken="help-desk"]')).toHaveClass(/ist-markiert/);
  await expect(page.locator('[data-balken="support-lenovo"]')).toHaveClass(/ist-markiert/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#nachweis-support')).toBeHidden();
  await expect(begriff).toBeFocused();
  await expect(page.locator('.ist-markiert')).toHaveCount(0);
  await begriff.click();
  await page.mouse.click(5, 5);
  await expect(page.locator('#nachweis-support')).toBeHidden();
});

test('Composer: mailto korrekt kodiert, Website zeigt Projekt-Check', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await page.locator('label:has(#thema-website)').click();
  await expect(page.locator('.composer__odera')).toBeVisible();
  await expect(page.locator('.composer__odera a')).toHaveAttribute('href', 'https://odera.ch/projekt-check/');
  await expect(page.locator('#composer-nachricht')).toBeHidden();
  await page.locator('label:has(#thema-projekt)').click();
  await page.fill('#composer-name', 'Zoë Müller');
  await page.fill('#composer-nachricht', 'Grüezi\nZweite Zeile & mehr?');
  await page.locator('[data-composer] button[type="submit"]').click();
  const mailto = await page.locator('[data-composer]').getAttribute('data-mailto');
  expect(mailto).toBe(
    'mailto:nico.bodmer@gmx.ch?subject=' +
      encodeURIComponent('Ein gemeinsames Projekt: Anfrage über nico-bodmer.ch') +
      '&body=' +
      encodeURIComponent('Grüezi\r\nZweite Zeile & mehr?\r\n\r\nFreundliche Grüsse\r\nZoë Müller'),
  );
});

test('Kopieren zeigt den Toast, vCard ist erreichbar', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await beobachten(page);
  await page.goto('/');
  await page.locator('[data-kopieren]').click();
  await expect(page.locator('#toast')).toHaveText('Adresse kopiert');
  await expect(page.locator('#toast')).toHaveClass(/ist-sichtbar/);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('nico.bodmer@gmx.ch');
  const vcf = await page.request.get('/nico-bodmer.vcf');
  expect(vcf.status()).toBe(200);
  const text = await vcf.text();
  expect(text).toContain('VERSION:4.0');
  expect(text).not.toMatch(/TEL|ADR|ORG/);
});

test('Mobiles Menü: Fokus ins Panel, Esc schliesst', async ({ page }) => {
  await beobachten(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const btn = page.locator('[data-menu-btn]');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#hauptmenue a').first()).toBeFocused();
  await expect(page.locator('html')).toHaveClass(/menu-offen/);
  await page.keyboard.press('Escape');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(btn).toBeFocused();
});

test('Kopfzeile wird nach 80px kompakter', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await expect(page.locator('[data-kopf]')).not.toHaveClass(/ist-kompakt/);
  await page.mouse.wheel(0, 400);
  await expect(page.locator('[data-kopf]')).toHaveClass(/ist-kompakt/);
});

test('Reduzierte Bewegung: keine Animationen im Hero', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await beobachten(page);
  await page.goto('/');
  const anzahl = await page.evaluate(() => document.getAnimations().length);
  expect(anzahl).toBe(0);
  await context.close();
});

test('Hero-Auftritt nur einmal pro Sitzung, ohne Layoutverschiebung', async ({ page }) => {
  await beobachten(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-auftritt', '');
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let summe = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) summe += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(summe), 1200);
      }),
  );
  expect(cls).toBeLessThanOrEqual(0.02);
  await page.goto('/lebenslauf/');
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-auftritt', '');
});
