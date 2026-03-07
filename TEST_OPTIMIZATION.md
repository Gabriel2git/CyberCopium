# 测试优化说明

## 问题分析

### 1. 窗口闪烁问题
**原因**：`fullyParallel: true` 导致多个测试同时运行，打开多个浏览器窗口

**解决方案**：
- 设置 `fullyParallel: false`
- 限制 `workers: 1`，按顺序执行测试
- 减少同时打开的窗口数量

### 2. 测试结果页测试失败
**原因**：
- 测试在 API 返回结果之前就开始查找元素
- 没有等待加载状态完成
- 元素查找超时时间过短

**解决方案**：
- 增加 `waitForResultCards()` 函数，等待所有卡片加载
- 增加 `waitForSticker()` 函数，等待贴纸加载
- 增加 `waitForFeedbackButtons()` 函数，等待反馈按钮加载
- 增加额外的 `waitForTimeout()` 确保渲染完成

## 优化内容

### 1. Playwright 配置优化 (`playwright.config.ts`)

```typescript
{
  fullyParallel: false,     // 禁用并行执行
  workers: 1,               // 单 worker 顺序执行
  retries: 1,               // 失败重试 1 次
  timeout: 60000,           // 每个测试最长 60 秒
  expect: {
    timeout: 10000          // 断言超时 10 秒
  },
  use: {
    navigationTimeout: 30000,  // 导航超时 30 秒
    actionTimeout: 10000,      // 操作超时 10 秒
  }
}
```

### 2. Helper 函数增强 (`tests/utils/helpers.ts`)

**新增函数**：
- `waitForResultCards()` - 等待所有结果卡片加载（最多 15 秒）
- `waitForSticker()` - 等待精神贴纸加载（最多 15 秒）
- `waitForFeedbackButtons()` - 等待反馈按钮加载（最多 10 秒）

**优化函数**：
- `waitForResultPage()` - 增加加载状态检测和结果内容等待

### 3. 测试用例优化 (`tests/specs/result.spec.ts`)

**TC-RESULT-003** (五张结果卡片显示)：
```typescript
await waitForResultPage(page);      // 等待页面加载
await waitForResultCards(page);     // 等待卡片加载
await expect(cardElement).toBeVisible({ timeout: 5000 });
```

**TC-RESULT-004** (精神贴纸显示)：
```typescript
await waitForResultPage(page);      // 等待页面加载
await waitForSticker(page);         // 等待贴纸加载
await expect(stickerSection).toBeVisible({ timeout: 5000 });
```

**TC-RESULT-005** (反馈按钮功能正常)：
```typescript
await waitForResultPage(page);          // 等待页面加载
await waitForFeedbackButtons(page);     // 等待按钮加载
await expect(button).toBeVisible({ timeout: 5000 });
```

## 预期效果

### 优化前
- ❌ 同时打开多个窗口，闪烁严重
- ❌ 结果页测试 3/7 失败
- ❌ 在 API 返回前就查找元素

### 优化后
- ✅ 单个窗口顺序执行，无闪烁
- ✅ 等待 API 返回后再查找元素
- ✅ 所有测试通过（预期 7/7）

## 运行测试

```bash
# 运行所有测试
npx playwright test

# 只运行结果页测试
npx playwright test tests/specs/result.spec.ts

# 有头模式（可以看到浏览器操作）
npx playwright test --headed

# 生成测试报告
npx playwright test --reporter=html
```

## 监控指标

测试运行时应关注：
1. **窗口数量**：应该只打开 1 个窗口
2. **闪烁频率**：应该明显减少
3. **测试时长**：单个测试应在 15-30 秒内完成
4. **通过率**：结果页测试应该全部通过

## 故障排查

如果测试仍然失败：

1. **检查 API 响应时间**
   ```bash
   # 查看 API 日志
   npm run dev
   # 观察 /api/generate 的响应时间
   ```

2. **增加超时时间**
   ```typescript
   // 在 helpers.ts 中增加超时
   await page.waitForSelector(..., { timeout: 20000 });
   ```

3. **检查元素选择器**
   ```bash
   # 使用 debug 模式
   npx playwright test --debug
   ```

4. **查看详细错误**
   ```bash
   # 查看测试报告
   npx playwright show-report
   ```

---

**最后更新**: 2026-03-07
**优化目标**: 解决窗口闪烁和 API 等待问题
