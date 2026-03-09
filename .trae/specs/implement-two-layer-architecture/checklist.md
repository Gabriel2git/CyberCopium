# 实现两层架构优化 - 检查清单

## 类型定义
- [x] AnalysisResult 接口定义完整
- [x] Scene 类型枚举定义
- [x] PrimaryBlock 类型枚举定义
- [x] RiskLevel 类型枚举定义
- [x] ActionWindow 类型枚举定义
- [x] GenerationResult 接口更新（透传字段）

## Prompt 模板
- [x] ANALYZER_PROMPT 符合 two-layer.txt 规范
- [x] ANALYZER_PROMPT 包含所有约束规则
- [x] COMPOSER_PROMPT 符合 two-layer.txt 规范
- [x] COMPOSER_PROMPT 集成 style_mode 透传
- [x] COMPOSER_PROMPT 强化桥接约束

## API 实现
- [x] /api/generate 支持两次 AI 调用
- [x] 先调用 Analyzer 获取战术板
- [x] 再调用 Composer 生成文案
- [x] 错误处理和降级机制完善
- [x] 风险控制逻辑正确（高风险降级 L1）

## 测试验证
- [x] 求职场景测试通过
- [x] 学习场景测试通过
- [x] 发疯场景测试通过
- [x] 战术板字段完整
- [x] 五件套输出质量达标
- [x] 高风险输入正确降级

## 代码质量
- [x] TypeScript 类型检查通过
- [x] 本地构建成功
- [x] 代码提交并推送
