# 修复结果页布局和按钮功能 Spec

## Why
结果页存在两个 UX 问题：
1. "返回首页"按钮和 Footer 横线之间间距太小，视觉拥挤
2. "再来一口"按钮功能不符合用户预期，应该重新生成内容而不是返回首页

## What Changes
- 增加"返回首页"和 Footer 之间的间距
- 修改"再来一口"按钮功能：点击后重新调用 API 生成新内容
- 修改"返回首页"按钮：保持返回首页功能

## Impact
- Affected code: `src/app/result/page.tsx`, `src/components/FeedbackSection.tsx`
- Affected functionality: 结果页按钮交互

## ADDED Requirements
### Requirement: 重新生成功能
The system SHALL provide a "换个味道" button that regenerates content by calling the API again.

#### Scenario: User clicks regenerate
- **WHEN** user clicks the regenerate button
- **THEN** the system calls `/api/generate` with the same input
- **AND** displays new generated content
- **AND** shows loading state during API call

## MODIFIED Requirements
### Requirement: Button Layout Spacing
The spacing between "返回首页" button and Footer SHALL be increased for better visual breathing room.

### Requirement: Button Function Mapping
- "换个味道" button SHALL trigger content regeneration
- "返回首页" button SHALL navigate back to home page
