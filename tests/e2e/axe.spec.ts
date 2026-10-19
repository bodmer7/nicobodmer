import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ALLE, beobachten } from './hilfen';

for (const schema of ['light', 'dark'] as const) {
  for (const pfad of [...ALLE, '/404.html']) {
    test(`axe ${schema}: ${pfad}`, async ({ browser }) => {
      const context = await browser.newContext({ colorScheme: schema, reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await beobachten(page);
      await page.goto(pfad, { waitUntil: 'networkidle' });
      const ergebnis = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      const verstoesse = ergebnis.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(verstoesse).toEqual([]);
      await context.close();
    });
  }
}
