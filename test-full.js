const { chromium } = require('playwright');

(async () => {
  console.log('🚀 开始 Playwright 测试...\n');
  
  // 启动浏览器
  const browser = await chromium.launch({
    executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  console.log('✅ 浏览器启动成功\n');
  
  const page = await browser.newPage();
  
  // 测试 1：首页加载
  console.log('📋 测试 1: 首页加载...');
  await page.goto('http://localhost:3000');
  const title = await page.title();
  console.log(`   页面标题：${title}`);
  
  const hero = page.locator('h1');
  await hero.waitFor();
  const heroText = await hero.textContent();
  console.log(`   Hero 标题：${heroText}`);
  
  const textarea = page.locator('textarea');
  await textarea.waitFor();
  console.log('   输入框：可见 ✅\n');
  console.log('✅ 测试 1 通过\n');
  
  // 测试 2：输入和提交
  console.log('📋 测试 2: 输入和提交...');
  await textarea.fill('今天心情不好，不想学习');
  console.log('   已输入：今天心情不好，不想学习');
  
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  console.log('   已点击提交按钮\n');
  
  // 等待跳转
  await page.waitForURL('**/result**');
  console.log('✅ 测试 2 通过 - 已跳转到结果页\n');
  
  // 测试 3：结果页检查
  console.log('📋 测试 3: 结果页检查...');
  const resultTitle = await page.title();
  console.log(`   页面标题：${resultTitle}`);
  
  // 检查结果卡片
  const cards = page.locator('.grid').locator('div').filter({ hasText: '状态命名' });
  await cards.waitFor();
  console.log('   结果卡片：可见 ✅\n');
  console.log('✅ 测试 3 通过\n');
  
  await browser.close();
  
  console.log('🎉 所有测试通过！');
})();
