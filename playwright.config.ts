import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // 启用完全并行执行测试
  fullyParallel: true,
  // 设置并发 worker 数量
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: false,
    // 增加导航超时时间，等待 API 返回
    navigationTimeout: 30000,
    // 增加操作超时时间
    actionTimeout: 10000,
    // 添加截图配置便于调试
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  outputDir: 'test-results/',
  
  // 超时设置
  timeout: 60000, // 每个测试最长运行时间
  expect: {
    timeout: 10000, // expect 断言的默认超时
  },
});
