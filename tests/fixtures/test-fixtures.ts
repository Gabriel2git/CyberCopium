import { test as base, expect, chromium, Browser } from '@playwright/test';
import type { Page, BrowserContext } from 'playwright';
import { testExamples, validInputs, emptyInput, longInput } from '../data/test-data';
import * as helpers from '../utils/helpers';

// 定义 fixtures 类型
type Fixtures = {
  baseUrl: string;
  context: BrowserContext;
  page: Page;
};

// 最小化浏览器窗口的辅助函数
async function minimizeBrowserWindow(browser: Browser) {
  try {
    // 获取所有上下文
    const contexts = browser.contexts();
    for (const context of contexts) {
      // 获取 CDP session
      const pages = context.pages();
      if (pages.length > 0) {
        const client = await context.newCDPSession(pages[0]);
        // 获取窗口信息
        const windowInfo = await client.send('Browser.getWindowForTarget');
        // 最小化窗口
        await client.send('Browser.setWindowBounds', {
          windowId: windowInfo.windowId,
          bounds: { windowState: 'minimized' }
        });
      }
    }
  } catch (err) {
    console.log('最小化窗口失败:', err);
  }
}

// 扩展 Playwright 的 test 对象
export const test = base.extend<Fixtures>({
  // 基础 URL
  baseUrl: ['http://localhost:3000', { option: true }],

  // 浏览器上下文 - 每个测试使用独立的浏览器实例
  context: async ({}, use) => {
    const browser = await chromium.launch({
      executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1280,720'
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    // 创建一个临时页面来获取 CDP session 并最小化窗口
    const tempPage = await context.newPage();
    await minimizeBrowserWindow(browser);
    await tempPage.close();

    await use(context);

    await context.close();
  },

  // 页面 - 每个测试创建新的 page
  page: async ({ context, baseUrl }, use) => {
    const page = await context.newPage();
    await page.goto(baseUrl);
    await use(page);
    // 关闭当前 page，但不关闭浏览器
    await page.close();
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
  waitForResultCards,
  waitForSticker,
  waitForFeedbackButtons,
  verifyResultCards,
  goBackToHome,
} = helpers;
