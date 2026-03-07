import { test, expect } from '../fixtures/test-fixtures';
import { 
  waitForPageLoad, 
  getHeroText, 
  fillInput, 
  clickExampleButton, 
  clickSubmit,
  isSubmitDisabled,
  testExamples,
  validInputs
} from '../fixtures/test-fixtures';

test.describe('首页功能测试', () => {
  
  test('TC-HOME-001: 页面正常加载', async ({ page, baseUrl }) => {
    // 访问首页
    await page.goto(baseUrl);
    await waitForPageLoad(page);
    
    // 检查页面标题
    await expect(page).toHaveTitle(/赛博吸氧机/);
    
    // 检查 Hero 标题
    const heroText = await getHeroText(page);
    expect(heroText).toContain('赛博吸氧机');
    
    // 检查输入框可见
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    console.log('✅ TC-HOME-001 通过：页面正常加载');
  });

  test('TC-HOME-002: 输入框可正常输入', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.waitFor();
    
    // 输入文本
    const testText = '今天心情不好';
    await textarea.fill(testText);
    
    // 验证输入内容
    const inputValue = await textarea.inputValue();
    expect(inputValue).toBe(testText);
    
    console.log('✅ TC-HOME-002 通过：输入框可正常输入');
  });

  test('TC-HOME-003: 示例按钮点击填充', async ({ page }) => {
    // 点击第一个示例按钮
    await clickExampleButton(page, testExamples[0]);
    
    // 验证输入框已填充
    const textarea = page.locator('textarea');
    const inputValue = await textarea.inputValue();
    expect(inputValue).toBe(testExamples[0]);
    
    console.log('✅ TC-HOME-003 通过：示例按钮点击填充');
  });

  test('TC-HOME-004: 所有示例按钮都可点击', async ({ page }) => {
    // 测试前两个示例按钮
    for (let i = 0; i < Math.min(2, testExamples.length); i++) {
      // 刷新页面清空输入
      await page.reload();
      await waitForPageLoad(page);
      
      // 点击示例按钮
      await clickExampleButton(page, testExamples[i]);
      
      // 验证输入框内容
      const textarea = page.locator('textarea');
      const inputValue = await textarea.inputValue();
      expect(inputValue).toBe(testExamples[i]);
    }
    
    console.log('✅ TC-HOME-004 通过：所有示例按钮都可点击');
  });

  test('TC-HOME-005: 提交按钮功能正常', async ({ page }) => {
    // 输入有效文本
    await fillInput(page, validInputs[0]);
    
    // 点击提交
    await clickSubmit(page);
    
    // 等待跳转到结果页
    await page.waitForURL('**/result**');
    
    // 验证 URL
    expect(page.url()).toContain('/result');
    
    console.log('✅ TC-HOME-005 通过：提交按钮功能正常');
  });

  test('TC-HOME-006: 空输入时提交按钮禁用', async ({ page }) => {
    // 刷新页面确保输入框为空
    await page.reload();
    await waitForPageLoad(page);
    
    // 验证提交按钮禁用
    const disabled = await isSubmitDisabled(page);
    expect(disabled).toBe(true);
    
    console.log('✅ TC-HOME-006 通过：空输入时提交按钮禁用');
  });

  test('TC-HOME-007: 输入后提交按钮启用', async ({ page }) => {
    // 刷新页面
    await page.reload();
    await waitForPageLoad(page);
    
    // 初始状态：禁用
    expect(await isSubmitDisabled(page)).toBe(true);
    
    // 输入文本
    await fillInput(page, validInputs[0]);
    
    // 验证提交按钮启用
    expect(await isSubmitDisabled(page)).toBe(false);
    
    console.log('✅ TC-HOME-007 通过：输入后提交按钮启用');
  });
});
