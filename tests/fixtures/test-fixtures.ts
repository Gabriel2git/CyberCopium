import { test as base, expect, chromium } from '@playwright/test';
import type { Page, BrowserContext } from 'playwright';
import { testExamples, validInputs, emptyInput, longInput } from '../data/test-data';
import * as helpers from '../utils/helpers';

// 定义测试夹具类型
interface Fixtures {
  page: Page;
  context: BrowserContext;
  baseUrl: string;
}

// 扩展 Playwright 的 test 对象
export const test = base.extend<Fixtures>({
  // 基础 URL
  baseUrl: ['http://localhost:3000', { option: true }],

  // 浏览器上下文
  context: async ({}, use) => {
    const browser = await chromium.launch({
      executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    await use(context);

    await context.close();
  },

  // 页面
  page: async ({ context, baseUrl }, use) => {
    const page = await context.newPage();
    await page.goto(baseUrl);
    await use(page);
  },
});

// 导出 expect
export { expect };

// 重新导出 helpers 和 test data
export { helpers, testExamples, validInputs, emptyInput, longInput };

// 重新导出常用的 helpers
export const {
  waitForPageLoad,
  getHeroText,
  fillInput,
  clickExampleButton,
  clickSubmit,
  isSubmitDisabled,
  waitForResultPage,
  verifyResultCards,
  goBackToHome,
} = helpers;
