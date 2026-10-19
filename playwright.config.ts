import { defineConfig, devices } from '@playwright/test';

const PORT = 4330;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    // Astro 7 startet preview bei erkannten Agenten im Hintergrund; hier im Vordergrund.
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    env: { ASTRO_PREVIEW_BACKGROUND: '0' },
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
