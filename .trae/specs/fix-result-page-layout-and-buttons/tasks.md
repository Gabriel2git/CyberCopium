# Tasks

- [x] Task 1: 增加"返回首页"和 Footer 之间的间距
  - [x] Subtask 1.1: 修改 result/page.tsx 中返回首页按钮的 margin-bottom
  - [x] Subtask 1.2: 验证间距增加到合适距离（约 2-3rem）

- [x] Task 2: 修改"再来一口"按钮为"换个味道"并添加重新生成功能
  - [x] Subtask 2.1: 修改按钮文字从"再来一口"改为"换个味道"
  - [x] Subtask 2.2: 在 result/page.tsx 中添加 regenerate 函数
  - [x] Subtask 2.3: regenerate 函数调用 /api/generate API
  - [x] Subtask 2.4: 添加加载状态处理
  - [x] Subtask 2.5: 更新 FeedbackSection 组件传递 regenerate 回调

- [x] Task 3: 测试验证
  - [x] Subtask 3.1: 验证"返回首页"和 Footer 间距合适
  - [x] Subtask 3.2: 验证"换个味道"按钮能重新生成内容
  - [x] Subtask 3.3: 验证"返回首页"按钮功能正常

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
