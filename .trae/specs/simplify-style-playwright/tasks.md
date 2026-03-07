# Tasks

- [ ] Task 1: 使用镜像源安装 Playwright Chromium
  - [ ] Subtask 1.1: 设置环境变量 PLAYWRIGHT_DOWNLOAD_HOST
  - [ ] Subtask 1.2: 使用镜像源安装 chromium
  - [ ] Subtask 1.3: 验证安装成功

- [x] Task 2: 移除主题切换功能
  - [x] Subtask 2.1: 从首页移除 ThemeToggle 组件
  - [x] Subtask 2.2: 从结果页移除 ThemeToggle 组件
  - [x] Subtask 2.3: 删除或忽略 ThemeToggle.tsx 文件
  - [x] Subtask 2.4: 移除 next-themes 相关配置

- [x] Task 3: 简化全局样式
  - [x] Subtask 3.1: 移除 globals.css 中的深色模式定义
  - [x] Subtask 3.2: 移除 .dark 选择器相关样式
  - [x] Subtask 3.3: 保留手绘风格基础样式

- [x] Task 4: 简化首页样式
  - [x] Subtask 4.1: 移除首页所有 dark: 前缀样式
  - [x] Subtask 4.2: 统一为黑白配色
  - [x] Subtask 4.3: 验证手绘装饰元素为黑色

- [x] Task 5: 简化结果页样式
  - [x] Subtask 5.1: 移除结果页所有 dark: 前缀样式
  - [x] Subtask 5.2: 卡片背景统一为白色
  - [x] Subtask 5.3: 文字颜色统一为黑色
  - [x] Subtask 5.4: 验证手绘装饰元素

- [x] Task 6: 简化所有组件样式
  - [x] Subtask 6.1: Hero 组件 - 移除 dark 样式
  - [x] Subtask 6.2: InputSection - 移除 dark 样式
  - [x] Subtask 6.3: ResultsSection - 移除彩色背景和 dark 样式
  - [x] Subtask 6.4: StickerCard - 移除彩色渐变，改为白色背景
  - [x] Subtask 6.5: FeedbackSection - 移除 dark 样式
  - [x] Subtask 6.6: LoadingState - 移除 dark 样式
  - [x] Subtask 6.7: Footer - 移除 dark 样式

- [ ] Task 7: 测试和验证
  - [ ] Subtask 7.1: 验证首页正常显示
  - [ ] Subtask 7.2: 验证结果页正常显示
  - [ ] Subtask 7.3: 验证所有功能正常
  - [ ] Subtask 7.4: 使用 Playwright 测试页面

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 3]
- [Task 7] depends on [Task 2, Task 4, Task 5, Task 6]
