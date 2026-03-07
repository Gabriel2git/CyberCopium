# 修复失败测试计划

## 问题分析

从截图可以看出，失败的测试（TC-RESULT-005 和 TC-RESULT-006）发生时，页面还在**首页**，没有跳转到结果页。

**根本原因：**
1. 测试使用 `test.describe` 分组，测试之间共享同一个页面实例
2. 并行测试时，多个测试同时操作同一个页面，导致状态混乱
3. 测试依赖前一个测试的状态（如 TC-RESULT-002 假设页面已经在结果页）

**具体问题：**
- TC-RESULT-005: 等待反馈按钮时页面还在首页
- TC-RESULT-006: 点击"返回首页"按钮时页面已经在首页（或者找不到按钮）
- TC-RESULT-003: 不稳定，也是由于页面状态问题

## 解决方案

### 方案：每个测试独立初始化

让每个测试都在独立的状态下开始，不依赖其他测试的执行结果。

## 实施步骤

### 步骤 1：修改 result.spec.ts
- 移除测试之间的状态依赖
- 每个测试都从首页开始，先提交表单跳转到结果页
- 或者使用 `test.beforeEach` 确保每个测试前都跳转到结果页

### 步骤 2：修复 helpers.ts 中的选择器
- 检查反馈按钮和返回首页按钮的选择器是否正确
- 添加更健壮的选择器策略

### 步骤 3：验证测试
- 运行测试确保所有测试通过
- 验证并行执行时测试仍然稳定

## 技术实现

修改 `result.spec.ts`：

```typescript
test.describe('结果页功能测试', () => {
  // 每个测试前都跳转到结果页
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
  });
  
  // 测试用例...
});
```

或者让每个测试独立：

```typescript
test('TC-RESULT-005: 反馈按钮功能正常', async ({ page }) => {
  // 确保在结果页
  if (!page.url().includes('/result')) {
    await fillInput(page, validInputs[0]);
    await clickSubmit(page);
    await waitForResultPage(page);
  }
  // 继续测试...
});
```

## 预期结果

1. 所有测试独立执行，不依赖其他测试状态
2. 并行测试时不会出现状态冲突
3. 所有 15 个测试都能稳定通过
