# 实现两层架构优化 - 任务列表

- [x] Task 1: 扩展类型定义
  - [ ] SubTask 1.1: 在 types/index.ts 中添加 AnalysisResult 接口
  - [ ] SubTask 1.2: 定义 Scene, PrimaryBlock, RiskLevel, ActionWindow 类型
  - [ ] SubTask 1.3: 更新 GenerationResult 接口（透传 tone_level, status_tag）

- [x] Task 2: 创建第一层 Prompt (Analyzer)
  - [x] SubTask 2.1: 在 lib/prompt.ts 中添加 ANALYZER_PROMPT
  - [x] SubTask 2.2: 定义 Analyzer 的 JSON Output Format
  - [x] SubTask 2.3: 添加场景、状态标签、阻力机制枚举

- [x] Task 3: 创建第二层 Prompt (Composer)
  - [x] SubTask 3.1: 在 lib/prompt.ts 中添加 COMPOSER_PROMPT
  - [x] SubTask 3.2: 集成 style_mode 和 tone_level 透传
  - [x] SubTask 3.3: 强化桥接约束和动作约束

- [x] Task 4: 重构 API 路由
  - [x] SubTask 4.1: 修改 /api/generate 支持两次 AI 调用
  - [x] SubTask 4.2: 先调用 Analyzer 生成战术板
  - [x] SubTask 4.3: 再调用 Composer 生成最终文案
  - [x] SubTask 4.4: 添加错误处理和降级机制

- [x] Task 5: 测试验证
  - [x] SubTask 5.1: 测试 3 个典型场景（求职、学习、发疯）
  - [x] SubTask 5.2: 验证战术板字段完整性
  - [x] SubTask 5.3: 验证五件套输出质量
  - [x] SubTask 5.4: 测试风险控制（高风险输入降级）

# Task Dependencies
- Task 2 依赖 Task 1（类型定义）
- Task 3 依赖 Task 2（Analyzer 输出作为 Composer 输入）
- Task 4 依赖 Task 2 和 Task 3（Prompt 准备完成）
- Task 5 依赖 Task 4（API 实现完成）
