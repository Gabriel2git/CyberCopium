# 修复测试窗口最小化功能计划

## 问题分析

当前实现的问题：
1. PowerShell 脚本通过进程名称查找 Chrome 窗口，但在并行测试时，多个 Chrome 进程同时运行，可能无法正确识别需要最小化的窗口
2. `exec` 是异步执行的，可能在窗口还未创建完成时就尝试最小化
3. 每个测试创建新的浏览器上下文时都会执行一次最小化，但可能时机不对

## 解决方案

### 方案：使用 Playwright 的 CDP 协议直接控制窗口

通过 Chrome DevTools Protocol (CDP) 获取窗口 ID 并直接控制窗口状态，这是更可靠的方法。

## 实施步骤

### 步骤 1：修改 test-fixtures.ts
- 移除 PowerShell 脚本调用
- 使用 CDP 协议获取浏览器窗口列表
- 对每个窗口执行最小化操作
- 添加适当的延迟确保窗口已创建

### 步骤 2：优化最小化时机
- 在 page 创建后立即执行最小化
- 使用同步方式确保最小化完成后再继续测试

### 步骤 3：验证并行测试
- 确保每个 worker 的窗口都能正确最小化
- 测试不同 worker 数量下的表现

## 技术实现

使用 CDP 的 `Browser.getWindowBounds` 和 `Browser.setWindowBounds` 命令：

```typescript
// 获取所有窗口
const windows = await client.send('Browser.getWindowForTarget');
// 最小化窗口
await client.send('Browser.setWindowBounds', {
  windowId: windows.windowId,
  bounds: { windowState: 'minimized' }
});
```

## 预期结果

1. 每个测试窗口启动时自动最小化到任务栏
2. 并行测试时所有窗口都能正确最小化
3. 不影响测试执行和结果
