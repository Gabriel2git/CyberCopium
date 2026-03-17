import { test, expect } from '@playwright/test';

const successPayload = {
  ok: true,
  code: 'SUCCESS',
  result: {
    status_label: '状态命名测试',
    voice_line: '抽象嘴替测试文案',
    sticker_text: '贴纸梗测试',
    absurd_motivation: '荒诞动机测试文案',
    micro_action: '打开文档写一句话',
    tone_level: 'L2',
    status_tag: '想做但卡住',
  },
  analysis: {
    scene: 'work',
    status_tag: '想做但卡住',
    tone_level: 'L2',
    primary_block: 'unclear_next_step',
    risk_level: 'low',
    action_window: '3min',
    style_mode: '荒诞自救',
    style_hint: '测试风格',
    analysis_summary: '目标清晰但起步困难',
  },
};

const fallbackPayload = {
  ok: false,
  code: 'CONFIG_MISSING',
  error: '生成服务暂不可用',
  warning: '系统已切换为备用内容',
  result: {
    status_label: '暂时卡住状态',
    voice_line: '有时候，卡住也是一种前进的方式',
    sticker_text: '禁止蕉绿',
    absurd_motivation: '先做一个最小动作，节奏会慢慢回来。',
    micro_action: '深呼吸三次，然后喝一杯水',
    tone_level: 'L1',
    status_tag: '疲惫/低启动',
  },
  analysis: {
    scene: 'daily_life',
    status_tag: '疲惫/低启动',
    tone_level: 'L1',
    primary_block: 'low_energy',
    risk_level: 'low',
    action_window: '3min',
    style_mode: '低电量维稳',
    style_hint: '备用模式',
    analysis_summary: '系统使用了备用分析策略',
  },
};

test('输入后可以展示生成结果', async ({ page }) => {
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(successPayload),
    });
  });

  await page.goto('/');
  await page.getByPlaceholder('说说你的困境吧...（比如：又加班到凌晨了 / 论文被拒了 / 存款清零了）').fill('我今天完全不想开工');
  await page.getByRole('button', { name: /赛博盲目乐观/ }).click();

  await expect(page).toHaveURL(/\/result/);
  await expect(page.getByText('状态命名测试')).toBeVisible();
  await expect(page.getByText('贴纸梗测试')).toBeVisible();
});

test('fallback 响应可见且有提示', async ({ page }) => {
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify(fallbackPayload),
    });
  });

  await page.goto('/');
  await page.getByPlaceholder('说说你的困境吧...（比如：又加班到凌晨了 / 论文被拒了 / 存款清零了）').fill('我现在只想躺平');
  await page.getByRole('button', { name: /赛博盲目乐观/ }).click();

  await expect(page).toHaveURL(/\/result/);
  await expect(page.getByText('系统已切换为备用内容')).toBeVisible();
  await expect(page.getByText('暂时卡住状态')).toBeVisible();
});
