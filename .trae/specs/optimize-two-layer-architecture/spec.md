# 优化两层架构 Spec

## Why
当前两层架构（Analyzer + Composer）虽然方向正确，但存在五个关键问题需要优化：
1. Analyzer 和 Composer 职责边界不够清晰
2. Composer 角色扮演味过重，输出风格容易飘
3. style_mode 太开放，不利于稳定和埋点分析
4. 高风险逻辑写得过深，容易把模型拉偏
5. Composer 缺少"自检目标"和优先级规则

## What Changes
- **Analyzer 优化**: style_mode 改为枚举值，职责更冷更专注
- **Composer 优化**: 角色收束，添加优先级规则和自检目标
- **高风险场景**: 从"情绪陪伴式"改为"稳定过渡式"
- **micro_action**: 添加"不依赖外部条件"限制
- **Prompt 格式**: tacticalBoard 以 JSON 字符串传入

## Impact
- Affected specs: AI 生成模块、两层架构
- Affected code:
  - `src/types/index.ts` - style_mode 类型改为枚举
  - `src/lib/prompt.ts` - ANALYZER_PROMPT 和 COMPOSER_PROMPT 重构
  - `src/app/api/generate/route.ts` - 传入格式改为 JSON

## MODIFIED Requirements

### Requirement: Analyzer 职责收束
**Current**: style_mode 自由生成，Analyzer 带文风创意倾向
**Modified**: 
- style_mode 改为枚举: '温和嘴替' | '体面发疯' | '高雅崩溃' | '荒诞自救' | '低电量维稳'
- 添加可选 style_hint 用于前台展示
- Analyzer 语气更冷："不要安慰，不要解释，不要创作"

### Requirement: Composer 角色收束
**Current**: "极度护短的互联网野生嘴替兼存在主义大师"
**Modified**: "赛博吸氧机的表达层。基于控制策略，输出统一人格、可截图、可执行的五件套内容"

### Requirement: Composer 添加优先级规则
**Added**:
当多个目标冲突时，按以下优先级决策：
1. 安全边界
2. 字段完整与长度合规
3. 微行动的具体可执行性
4. 荒诞动机的桥接自然度
5. 抽象表达的趣味性

### Requirement: voice_line 重新定义
**Current**: "一击致命的抽象嘴替（替用户骂出心里的不爽或开脱责任）"
**Modified**: "一句有网感的抽象嘴替，作用是把用户的卡点说出来，并适度把压力外化，避免纯自责"

### Requirement: micro_action 添加限制
**Added**: "默认优先选择'当下环境内即可完成'的动作，避免依赖他人、依赖特定工具或明显改变场景"
动作优先级：身体动作 > 桌面动作 > 环境切换动作 > 社交动作

### Requirement: 高风险场景文案收束
**Current**: "我在这里陪着你 / 你值得被温柔对待 / 有人默默关心你"
**Modified**: "这种时刻先别逼自己解决一切，先把今天安全地过完。先做一个最小动作，让身体回到现实里。"

### Requirement: Prompt 传入格式
**Current**: tacticalBoard 以 bullet list 自然语言传入
**Modified**: tacticalBoard 以 JSON 字符串传入，更稳定、更少歧义

## REMOVED Requirements

### Requirement: style_mode 自由生成
**Reason**: 不利于风格稳定和埋点分析
**Migration**: 使用枚举值 + 可选 style_hint

### Requirement: Composer 强人格化角色
**Reason**: 容易让模型把力气花在演人格上，而不是遵守约束
**Migration**: 使用更稳的产品化角色定义
