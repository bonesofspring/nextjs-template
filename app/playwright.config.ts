import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Playwright configuration for E2E tests.
 * - Starts Next.js dev server on port 3000 with MSW enabled
 * - Uses Chromium, Firefox and WebKit by default in CI; only Chromium locally
 */
export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: process.env.NEXT_PUBLIC_APP_ENV === 'dev',
  retries: process.env.NEXT_PUBLIC_APP_ENV === 'dev' ? 2 : 0,
  workers: process.env.NEXT_PUBLIC_APP_ENV === 'dev' ? 5 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${process.env.PLAYWRIGHT_PORT ?? '3000'}${process.env.NEXT_PUBLIC_APP_BASE_PATH ?? ''}`,
    trace: 'retain-on-first-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'yarn dev',
    url: `http://localhost:${process.env.PLAYWRIGHT_PORT ?? '3000'}${process.env.NEXT_PUBLIC_APP_BASE_PATH ?? ''}`,
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
