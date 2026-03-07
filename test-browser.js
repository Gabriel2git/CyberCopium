const { chromium } = require('playwright');

(async () => {
  console.log('正在启动本地 Chrome 浏览器...');
  console.log('路径：E:\\TraeFile\\chrome-win\\chrome.exe');
  
  const browser = await chromium.launch({
    executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  console.log('✅ 浏览器启动成功！');
  
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  console.log('✅ 页面加载成功！');
  console.log('当前页面标题:', await page.title());
  
  await browser.close();
  console.log('测试完成！');
})();
