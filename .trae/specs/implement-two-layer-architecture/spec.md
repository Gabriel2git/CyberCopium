# 实现两层架构优化 Spec

## Why
当前 AI 生成链路使用单层 Prompt，存在以下问题：
1. 缺乏明确的状态识别和风险控制
2. 语气强度控制不够精准
3. 没有统一的风格策略标签
4. 安全过滤机制不完善

通过引入两层架构（生成控制层 + 表现生成层），可以实现更精准的情绪解构、风险控制和风格一致性。

## What Changes
- **第一层 (Generation Control Layer)**: 新增 Analyzer，负责状态判断、场景识别、风险降级、生成战术板
- **第二层 (Presentation Layer)**: 重构 Composer，接收战术板生成最终文案
- **API 路由**: 修改 `/api/generate` 支持两次 AI 调用
- **类型定义**: 扩展 GenerationResult 和新增 AnalysisResult 类型

## Impact
- Affected specs: AI 生成模块、API 接口层
- Affected code: 
  - `src/app/api/generate/route.ts`
  - `src/lib/prompt.ts`
  - `src/types/index.ts`

## ADDED Requirements

### Requirement: 第一层 - 生成控制层 (Analyzer)
The system SHALL provide an Analyzer that deconstructs user input and generates a tactical board.

#### Scenario: 状态识别
- **WHEN** user inputs their struggle
- **THEN** Analyzer identifies scene, status_tag, primary_block

#### Scenario: 风险控制
- **WHEN** input contains high-risk content (self-harm, severe depression)
- **THEN** risk_level = high, tone_level forced to L1

#### Scenario: 风格策略生成
- **WHEN** Analyzer processes input
- **THEN** generates style_mode (4-6字荒诞策略标签)

### Requirement: 第二层 - 表现生成层 (Composer)
The system SHALL provide a Composer that generates final copy based on tactical board.

#### Scenario: 文案生成
- **WHEN** Composer receives user input + tactical board
- **THEN** generates complete 五件套 with proper bridging

#### Scenario: 桥接约束
- **WHEN** generating absurd_motivation
- **THEN** must bridge emotion to micro_action logically

## MODIFIED Requirements

### Requirement: API 路由
**Current**: Single AI call in `/api/generate`
**Modified**: Sequential two-layer AI calls (Analyzer → Composer)

### Requirement: Prompt 模板
**Current**: Single SYSTEM_PROMPT
**Modified**: 
- ANALYZER_PROMPT (第一层)
- COMPOSER_PROMPT (第二层)

## REMOVED Requirements

### Requirement: 单层 Prompt 生成
**Reason**: Replaced by two-layer architecture for better control
**Migration**: Use new Analyzer + Composer pattern
