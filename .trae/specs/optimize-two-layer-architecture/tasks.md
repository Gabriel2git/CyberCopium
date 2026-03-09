# 优化两层架构 - 任务列表

- [x] Task 1: 修改类型定义
  - [x] SubTask 1.1: 将 style_mode 改为枚举类型
  - [x] SubTask 1.2: 添加可选 style_hint 字段
  - [x] SubTask 1.3: 更新 AnalysisResult 接口

- [x] Task 2: 优化 Analyzer Prompt
  - [x] SubTask 2.1: 修改 Role 为更冷的控制层定义
  - [x] SubTask 2.2: 将 style_mode 改为枚举值（5 个固定选项）
  - [x] SubTask 2.3: 添加 style_hint 字段说明
  - [x] SubTask 2.4: 强化"不要安慰、不要解释、不要创作"约束

- [x] Task 3: 优化 Composer Prompt
  - [x] SubTask 3.1: 修改 Role 为更稳的表达层定义
  - [x] SubTask 3.2: 添加优先级规则（安全 > 字段 > 动作 > 桥接 > 趣味）
  - [x] SubTask 3.3: 重新定义 voice_line（精准命名 + 轻度外化）
  - [x] SubTask 3.4: 添加 micro_action 限制（不依赖外部条件）
  - [x] SubTask 3.5: 优化高风险场景文案（稳定过渡式）

- [x] Task 4: 修改 API 路由
  - [x] SubTask 4.1: 将 tacticalBoard 以 JSON 字符串传入 Composer
  - [x] SubTask 4.2: 更新 generateComposerUserPrompt 函数

- [x] Task 5: 更新高危 Fallback
  - [x] SubTask 5.1: 将 HIGH_RISK_FALLBACK_RESULT 改为更克制的文案
  - [x] SubTask 5.2: 从"我在这里陪着你"改为"先把自己放回现实里"

- [x] Task 6: 测试验证
  - [x] SubTask 6.1: 测试 style_mode 枚举是否正确输出
  - [x] SubTask 6.2: 验证 Composer 优先级规则是否生效
  - [x] SubTask 6.3: 测试高风险场景输出是否更克制
  - [x] SubTask 6.4: 验证 micro_action 是否优先选择低门槛动作

# Task Dependencies
- Task 2 依赖 Task 1（类型定义）
- Task 3 依赖 Task 2（Analyzer 输出作为 Composer 输入）
- Task 4 依赖 Task 3（Prompt 准备完成）
- Task 5 可并行于 Task 4
- Task 6 依赖 Task 4 和 Task 5
