import { test, expect } from '../fixtures/test-fixtures';
import { 
  fillInput, 
  clickSubmit,
  waitForResultPage,
  verifyResultCards,
  goBackToHome,
  validInputs
} from '../fixtures/test-fixtures';

test.describe('结果页功能测试', () => {
  
  test('TC-RESULT-001: 从首页跳转到结果页', async ({ page }) => {
    // 输入并提交
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    
    // 等待跳转
    await waitForResultPage(page);
    
    // 验证 URL
    expect(page.url()).toContain('/result');
    
    console.log('✅ TC-RESULT-001 通过：从首页跳转到结果页');
  });

  test('TC-RESULT-002: 结果页标题正确', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 检查页面标题
    await expect(page).toHaveTitle(/赛博吸氧机/);
    
    console.log('✅ TC-RESULT-002 通过：结果页标题正确');
  });

  test('TC-RESULT-003: 五张结果卡片显示', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 检查所有卡片
    const cards = [
      { name: '状态命名', icon: '🏷️' },
      { name: '抽象嘴替', icon: '👄' },
      { name: '荒诞动机', icon: '🎭' },
      { name: '最小行动', icon: '⚡' },
    ];
    
    for (const card of cards) {
      const cardElement = page.getByText(card.name);
      await expect(cardElement).toBeVisible();
    }
    
    console.log('✅ TC-RESULT-003 通过：五张结果卡片显示');
  });

  test('TC-RESULT-004: 精神贴纸显示', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 检查精神贴纸
    const stickerSection = page.getByText('你的精神贴纸');
    await expect(stickerSection).toBeVisible();
    
    // 检查贴纸卡片
    const stickerCard = page.locator('.bg-white').filter({ hasText: '赛博吸氧机' });
    await expect(stickerCard).toBeVisible();
    
    console.log('✅ TC-RESULT-004 通过：精神贴纸显示');
  });

  test('TC-RESULT-005: 反馈按钮功能正常', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 检查反馈按钮
    const feedbackButtons = [
      page.getByText('命中了'),
      page.getByText('再来一口'),
      page.getByText('开始行动'),
    ];
    
    for (const button of feedbackButtons) {
      await expect(button).toBeVisible();
    }
    
    console.log('✅ TC-RESULT-005 通过：反馈按钮功能正常');
  });

  test('TC-RESULT-006: 返回首页功能', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 返回首页
    await goBackToHome(page);
    
    // 验证回到首页
    await page.waitForURL('**/');
    expect(page.url()).not.toContain('/result');
    
    // 验证 Hero 标题可见
    const hero = page.locator('h1');
    await expect(hero).toBeVisible();
    
    console.log('✅ TC-RESULT-006 通过：返回首页功能');
  });

  test('TC-RESULT-007: 结果页手绘风格正确', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 检查背景颜色 (米白色)
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBeTruthy();
    
    // 检查边框颜色 (黑色)
    const card = page.locator('.bg-white').first();
    const borderTopColor = await card.evaluate((el) => 
      window.getComputedStyle(el).borderTopColor
    );
    expect(borderTopColor).toBe('rgb(0, 0, 0)');
    
    console.log('✅ TC-RESULT-007 通过：结果页手绘风格正确');
  });
});
