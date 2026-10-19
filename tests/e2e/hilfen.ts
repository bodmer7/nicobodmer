import type { Page } from '@playwright/test';

export const SEITEN_DE = ['/', '/arbeiten/odera/', '/arbeiten/musterprojekte/', '/arbeiten/geo-quiz/', '/arbeiten/morgen-check-in/', '/lebenslauf/', '/impressum-datenschutz/', '/links/'];
export const SEITEN_EN = ['/en/', '/en/work/odera/', '/en/work/sample-projects/', '/en/work/geo-quiz/', '/en/work/morning-check-in/', '/en/cv/', '/en/legal/'];
export const ALLE = [...SEITEN_DE, ...SEITEN_EN];

/** Sammelt Konsolenfehler und Anfragen an fremde Server; fremde Anfragen werden abgebrochen. */
export async function beobachten(page: Page) {
  const fehler: string[] = [];
  const extern: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') fehler.push(m.text());
  });
  page.on('pageerror', (e) => fehler.push(String(e)));
  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    extern.push(route.request().url());
    return route.abort();
  });
  return { fehler, extern };
}
