import { test, expect } from '@playwright/test';

test('首页加载测试', async ({ page }) => {
  // 访问首页
  await page.goto('http://localhost:3000');
  
  // 检查标题
  await expect(page).toHaveTitle(/赛博吸氧机/);
  
  // 检查 Hero 标题存在
  const hero = page.locator('h1');
  await expect(hero).toBeVisible();
  await expect(hero).toContainText('赛博吸氧机');
  
  // 检查输入框存在
  const textarea = page.locator('textarea');
  await expect(textarea).toBeVisible();
  
  console.log('✅ 首页加载测试通过！');
});

test('结果页样式测试', async ({ page }) => {
  // 访问首页
  await page.goto('http://localhost:3000');
  
  // 输入测试内容
  const textarea = page.locator('textarea');
  await textarea.fill('今天心情不好');
  
  // 点击提交按钮
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  
  // 等待跳转到结果页
  await page.waitForURL('**/result**');
  
  // 检查结果页标题
  await expect(page).toHaveTitle(/赛博吸氧机/);
  
  console.log('✅ 结果页样式测试通过！');
});
