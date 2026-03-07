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
 * 等待跳转到结果页
 */
export async function waitForResultPage(page: Page): Promise<void> {
  await page.waitForURL('**/result**');
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
