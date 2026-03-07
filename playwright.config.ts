import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
        viewport: { width: 1280, height: 720 },
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
      },
    },
  ],

  outputDir: 'test-results/',
});
