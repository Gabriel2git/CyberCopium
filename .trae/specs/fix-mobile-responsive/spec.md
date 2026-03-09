# 修复手机端响应式布局 Spec

## Why
在手机屏幕上，结果卡片区域设置了 `max-w-[40%]`，导致卡片宽度只有屏幕的 40%，文字显示非常拥挤，用户体验很差。需要在手机上使用更大的宽度占比。

## What Changes
- 修改 ResultsSection 组件的容器宽度
- 从固定的 `max-w-[40%]` 改为响应式：
  - 手机端：使用 `max-w-[90%]` 或 `w-full px-4`
  - 平板端：使用 `max-w-[70%]`
  - 桌面端：保持 `max-w-[40%]`

## Impact
- Affected specs: 结果展示模块
- Affected code: src/components/ResultsSection.tsx

## MODIFIED Requirements
### Requirement: 响应式布局
The system SHALL provide responsive layout for result cards.

#### Scenario: Mobile view
- **WHEN** user views on mobile screen (< 640px)
- **THEN** result cards use 90% width with proper padding

#### Scenario: Tablet view
- **WHEN** user views on tablet screen (640px - 1024px)
- **THEN** result cards use 70% width

#### Scenario: Desktop view
- **WHEN** user views on desktop screen (> 1024px)
- **THEN** result cards use 40% width
