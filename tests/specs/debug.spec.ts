import { test, expect } from '../fixtures/test-fixtures';
import { fillInput, clickSubmit, waitForResultPage } from '../fixtures/test-fixtures';

test.describe('结果页调试测试', () => {
  
  test('调试：查看结果页结构', async ({ page }) => {
    // 跳转到结果页
    await fillInput(page, '测试');
    await clickSubmit(page);
    await waitForResultPage(page);
    
    // 截图
    await page.screenshot({ path: 'test-results/result-page.png', fullPage: true });
    
    // 获取页面 HTML
    const html = await page.content();
    console.log('页面长度:', html.length);
    
    // 查找所有 h2 标签
    const h2Tags = await page.locator('h2').allTextContents();
    console.log('H2 标签:', h2Tags);
    
    // 查找所有包含"贴纸"的文本
    const stickerTexts = await page.getByText('贴纸').allTextContents();
    console.log('贴纸相关文本:', stickerTexts);
    
    // 查找所有卡片
    const cards = page.locator('.border-2');
    const cardCount = await cards.count();
    console.log('卡片数量:', cardCount);
    
    // 获取所有卡片的文本
    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      const cardText = await cards.nth(i).textContent();
      console.log(`卡片 ${i}:`, cardText?.substring(0, 50));
    }
  });
});
