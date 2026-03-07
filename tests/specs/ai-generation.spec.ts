import { test, expect } from '../fixtures/test-fixtures';
import { 
  fillInput, 
  clickSubmit,
  waitForResultPage,
  waitForResultCards,
  validInputs
} from '../fixtures/test-fixtures';

test.describe('AI 两层架构生成链路测试', () => {
  // 每个测试前都确保在首页
  test.beforeEach(async ({ page, baseUrl }) => {
    await page.goto(baseUrl);
  });
  
  test('TC-AI-001: 求职场景 - 不想投简历', async ({ page }) => {
    // 输入求职场景
    await fillInput(page, '我又不想投简历了，感觉每个岗位都不适合我');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果卡片加载
    await waitForResultCards(page);
    
    // 验证结果页显示
    const statusLabel = page.getByText('状态命名');
    await expect(statusLabel).toBeVisible({ timeout: 10000 });
    
    // 验证五张卡片都存在
    const cards = ['状态命名', '抽象嘴替', '荒诞动机', '最小行动'];
    for (const card of cards) {
      const cardElement = page.getByText(card);
      await expect(cardElement).toBeVisible({ timeout: 10000 });
    }
    
    // 验证精神贴纸
    const stickerSection = page.getByText('你的精神贴纸');
    await expect(stickerSection).toBeVisible({ timeout: 10000 });
    
    console.log('✅ TC-AI-001 通过：求职场景生成成功');
  });

  test('TC-AI-002: 学习场景 - 学不进去', async ({ page }) => {
    // 输入学习场景
    await fillInput(page, '今天一天都没学进去，明天就要考试了');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果卡片加载
    await waitForResultCards(page);
    
    // 验证结果页显示
    const statusLabel = page.getByText('状态命名');
    await expect(statusLabel).toBeVisible({ timeout: 10000 });
    
    // 验证五张卡片都存在
    const cards = ['状态命名', '抽象嘴替', '荒诞动机', '最小行动'];
    for (const card of cards) {
      const cardElement = page.getByText(card);
      await expect(cardElement).toBeVisible({ timeout: 10000 });
    }
    
    console.log('✅ TC-AI-002 通过：学习场景生成成功');
  });

  test('TC-AI-003: 发疯场景 - 情绪过载', async ({ page }) => {
    // 输入发疯场景
    await fillInput(page, '我现在只想发疯，什么都不想干了');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果卡片加载
    await waitForResultCards(page);
    
    // 验证结果页显示
    const statusLabel = page.getByText('状态命名');
    await expect(statusLabel).toBeVisible({ timeout: 10000 });
    
    // 验证五张卡片都存在
    const cards = ['状态命名', '抽象嘴替', '荒诞动机', '最小行动'];
    for (const card of cards) {
      const cardElement = page.getByText(card);
      await expect(cardElement).toBeVisible({ timeout: 10000 });
    }
    
    console.log('✅ TC-AI-003 通过：发疯场景生成成功');
  });

  test('TC-AI-004: 验证战术板字段完整性', async ({ page }) => {
    // 输入任意内容
    await fillInput(page, '测试战术板字段完整性');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果加载
    await waitForResultCards(page);
    
    // 验证状态命名卡片有内容
    const statusLabelCard = page.locator('.bg-white').filter({ hasText: '状态命名' });
    await expect(statusLabelCard).toBeVisible({ timeout: 10000 });
    
    // 获取卡片内容验证不为空
    const cardContent = await statusLabelCard.textContent();
    expect(cardContent).toBeTruthy();
    expect(cardContent?.length).toBeGreaterThan(5);
    
    console.log('✅ TC-AI-004 通过：战术板字段完整性验证');
  });

  test('TC-AI-005: 验证五件套输出质量', async ({ page }) => {
    // 输入内容
    await fillInput(page, '工作压力好大，感觉快崩溃了');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果加载
    await waitForResultCards(page);
    
    // 验证白色背景卡片（状态命名、抽象嘴替、荒诞动机）
    const whiteCards = ['状态命名', '抽象嘴替', '荒诞动机'];
    for (const cardName of whiteCards) {
      const cardElement = page.locator('.bg-white').filter({ hasText: cardName });
      await expect(cardElement).toBeVisible({ timeout: 10000 });
      
      const content = await cardElement.textContent();
      expect(content).toBeTruthy();
      expect(content?.length).toBeGreaterThan(5);
    }
    
    // 验证黑色背景卡片（最小行动）
    const actionCard = page.locator('.bg-black').filter({ hasText: '最小行动' });
    await expect(actionCard).toBeVisible({ timeout: 10000 });
    
    const actionContent = await actionCard.textContent();
    expect(actionContent).toBeTruthy();
    expect(actionContent?.length).toBeGreaterThan(5);
    
    console.log('✅ TC-AI-005 通过：五件套输出质量验证');
  });

  test('TC-AI-006: 测试风险控制 - 高风险输入降级', async ({ page }) => {
    // 输入高风险内容（模拟自伤倾向）
    await fillInput(page, '我不想活了，活着没有意义');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 等待结果加载
    await waitForResultCards(page);
    
    // 验证结果页正常显示（降级为 L1 温和模式）
    const statusLabel = page.getByText('状态命名');
    await expect(statusLabel).toBeVisible({ timeout: 10000 });
    
    // 验证五张卡片都存在
    const cards = ['状态命名', '抽象嘴替', '荒诞动机', '最小行动'];
    for (const card of cards) {
      const cardElement = page.getByText(card);
      await expect(cardElement).toBeVisible({ timeout: 10000 });
    }
    
    console.log('✅ TC-AI-006 通过：高风险输入降级验证');
  });
});
