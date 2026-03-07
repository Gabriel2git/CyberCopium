# 测试并行化与窗口最小化计划

## 问题分析

当前测试代码存在以下问题：

1. **无法并行执行**：`playwright.config.ts` 中配置了 `fullyParallel: false` 和 `workers: 1`，导致测试只能顺序执行
2. **窗口没有最小化**：浏览器窗口以正常大小（1280x720）打开，占用大量屏幕空间
3. **测试文件分散**：存在 `tests/homepage.spec.ts` 和 `tests/specs/homepage.spec.ts` 等重复的测试文件

## 解决方案

### 1. 启用并行测试
- 修改 `playwright.config.ts`，设置 `fullyParallel: true`
- 增加 `workers` 数量（建议设置为 CPU 核心数或 2-4 个）

### 2. 实现窗口最小化
- 在 `test-fixtures.ts` 的 `context` 创建后，对每个 `page` 进行窗口最小化
- 使用 Playwright 的 `page.evaluate()` 调用浏览器 API 实现最小化
- 或者在启动参数中添加窗口最小化选项

### 3. 清理重复测试文件
- 保留 `tests/specs/` 目录下的结构化测试文件
- 删除或归档旧的 `tests/homepage.spec.ts` 文件

## 实施步骤

### 步骤 1：修改 Playwright 配置
- 将 `fullyParallel` 改为 `true`
- 将 `workers` 设置为 2（可根据需要调整）
- 添加 `video` 和 `screenshot` 配置以便调试

### 步骤 2：修改测试 Fixtures
- 在 `test-fixtures.ts` 中添加窗口最小化逻辑
- 由于 Playwright 没有直接的最小化 API，需要通过以下方式实现：
  - 方法 A：使用 `page.setExtraHTTPHeaders()` 配合浏览器扩展（复杂）
  - 方法 B：使用 `chromium.launch()` 的 `--start-minimized` 参数（推荐）
  - 方法 C：设置极小的 viewport 来模拟最小化效果

### 步骤 3：清理测试文件
- 删除 `tests/homepage.spec.ts`（内容已迁移到 specs 目录）

### 步骤 4：验证测试
- 运行测试确保并行执行正常工作
- 验证窗口最小化效果

## 技术细节

### 窗口最小化实现
Playwright 本身不直接支持窗口最小化，但可以通过以下方式：

```typescript
// 方法 1：使用浏览器启动参数
await chromium.launch({
  args: ['--start-minimized', '--window-size=1280,720']
});

// 方法 2：创建页面后最小化（需要 CDP 协议）
const context = await browser.newContext();
const page = await context.newPage();
await page.evaluate(() => window.document.blur());
```

## 预期结果

1. 测试并行执行，提高测试速度
2. 每个测试窗口自动最小化，不干扰用户工作
3. 测试结果准确可靠
