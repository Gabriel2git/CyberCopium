import { Page } from 'playwright';

/**
 * 等待页面加载完成
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * 获取 Hero 标题文本
 */
export async function getHeroText(page: Page): Promise<string> {
  const hero = page.locator('h1');
  await hero.waitFor();
  return await hero.textContent() || '';
}

/**
 * 在输入框中输入文本
 */
export async function fillInput(page: Page, text: string): Promise<void> {
  const textarea = page.locator('textarea');
  await textarea.waitFor();
  await textarea.fill(text);
}

/**
 * 点击示例按钮
 */
export async function clickExampleButton(page: Page, exampleText: string): Promise<void> {
  const button = page.getByText(exampleText);
  await button.click();
}

/**
 * 点击提交按钮
 */
export async function clickSubmit(page: Page): Promise<void> {
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.waitFor();
  await submitButton.click();
}

/**
 * 检查提交按钮是否禁用
 */
export async function isSubmitDisabled(page: Page): Promise<boolean> {
  const submitButton = page.locator('button[type="submit"]');
  return await submitButton.isDisabled();
}

/**
 * 等待跳转到结果页并等待结果加载完成
 */
export async function waitForResultPage(page: Page): Promise<void> {
  // 等待 URL 跳转
  await page.waitForURL('**/result**');
  
  // 等待加载状态消失（如果有 LoadingState 组件）
  try {
    await page.waitForSelector('.loading, .animate-pulse, [class*="loading"]', { 
      state: 'detached',
      timeout: 10000 
    });
  } catch {
    // 如果没有加载状态，继续执行
  }
  
  // 等待结果内容出现（等待任意一个结果卡片）
  try {
    await page.waitForSelector('[class*="border-black"]:has-text("状态命名"), [class*="bg-white"]:has-text("状态命名")', {
      timeout: 15000
    });
  } catch {
    // 备用方案：等待网格布局出现
    await page.waitForSelector('.grid', { timeout: 15000 });
  }
}

/**
 * 等待结果卡片加载完成
 */
export async function waitForResultCards(page: Page): Promise<void> {
  // 直接等待包含卡片标题的元素出现
  const requiredCards = ['状态命名', '抽象嘴替', '荒诞动机', '最小行动'];
  
  for (const cardName of requiredCards) {
    await page.waitForSelector(`text=${cardName}`, {
      timeout: 20000
    });
  }
}

/**
 * 等待精神贴纸加载完成
 */
export async function waitForSticker(page: Page): Promise<void> {
  // 等待包含"精神贴纸"文本的元素
  await page.waitForSelector('text=精神贴纸', {
    timeout: 20000
  });
}

/**
 * 等待反馈按钮加载完成
 */
export async function waitForFeedbackButtons(page: Page): Promise<void> {
  // 等待包含按钮文本的元素出现
  const requiredButtons = ['命中了', '再来一口', '开始行动'];
  
  for (const buttonText of requiredButtons) {
    await page.waitForSelector(`text=${buttonText}`, {
      timeout: 20000
    });
  }
}

/**
 * 检查结果卡片是否存在
 */
export async function verifyResultCards(page: Page): Promise<boolean> {
  const cards = page.locator('.grid').locator('div').filter({ hasText: '状态命名' });
  try {
    await cards.waitFor({ timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * 返回首页
 */
export async function goBackToHome(page: Page): Promise<void> {
  const backButton = page.getByText('返回首页');
  await backButton.click();
}
