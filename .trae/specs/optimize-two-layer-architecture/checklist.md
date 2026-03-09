# 优化两层架构 - 检查清单

## 类型定义
- [x] style_mode 改为枚举类型（5 个固定值）
- [x] style_hint 字段已添加（可选）
- [x] AnalysisResult 接口已更新

## Analyzer Prompt
- [x] Role 改为冷的控制层定义
- [x] style_mode 输出改为枚举值
- [x] style_hint 字段说明已添加
- [x] "不要安慰、不要解释、不要创作"约束已强化

## Composer Prompt
- [x] Role 改为稳的表达层定义
- [x] 优先级规则已添加（5 级优先级）
- [x] voice_line 重新定义（精准命名 + 轻度外化）
- [x] micro_action 限制已添加（不依赖外部条件）
- [x] 高风险场景文案优化（稳定过渡式）

## API 路由
- [x] tacticalBoard 以 JSON 字符串传入
- [x] generateComposerUserPrompt 函数已更新

## 高危 Fallback
- [x] HIGH_RISK_FALLBACK_RESULT 文案更克制
- [x] 从"我在这里陪着你"改为"先把自己放回现实里"

## 测试验证
- [x] style_mode 枚举输出正确
- [x] Composer 优先级规则生效
- [x] 高风险场景输出更克制
- [x] micro_action 优先选择低门槛动作
- [x] 本地构建成功
- [x] 代码提交并推送
