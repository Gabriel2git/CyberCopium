# Tasks

- [x] Task 1: 修复主题切换功能 - 确保页面背景响应主题变化
  - [x] Subtask 1.1: 在 globals.css 中添加主题相关的 CSS 变量（渐变背景色）
  - [x] Subtask 1.2: 修改 page.tsx 使用 CSS 变量作为背景
  - [x] Subtask 1.3: 修改 result/page.tsx 使用 CSS 变量作为背景
  - [x] Subtask 1.4: 添加主题过渡动画到全局样式
  - [x] Subtask 1.5: 测试主题切换效果

- [x] Task 2: 优化 API 加载体验
  - [x] Subtask 2.1: 在 InputSection 组件中添加更友好的加载提示
  - [x] Subtask 2.2: 在 result/page.tsx 中添加加载动画
  - [x] Subtask 2.3: 添加"正在生成你的赛博氧气..."提示文案

- [x] Task 3: 添加 API 超时控制
  - [x] Subtask 3.1: 在 API route 中添加 30 秒超时控制
  - [x] Subtask 3.2: 在前端添加超时错误处理
  - [x] Subtask 3.3: 添加重试按钮和备用方案选项
  - [x] Subtask 3.4: 测试超时场景

- [x] Task 4: 整体测试和验证
  - [x] Subtask 4.1: 测试主题切换在所有页面的效果
  - [x] Subtask 4.2: 测试 API 正常调用流程
  - [x] Subtask 4.3: 测试 API 超时场景
  - [x] Subtask 4.4: 跨浏览器测试

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1, Task 2, Task 3]
