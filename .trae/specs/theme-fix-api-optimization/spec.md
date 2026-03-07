# 主题切换修复和 API 性能优化 Spec

## Why

1. **主题切换失效**: 当前页面使用自定义渐变背景色，没有响应 `dark:` 类名变化，导致切换按钮只有滚动条颜色变化，页面主体内容颜色不变
2. **API 调用过慢**: 用户反馈需要等待很久才能看到生成结果，影响用户体验

## What Changes

### 主题切换修复
- 修改页面组件的背景色配置，使用 CSS 变量配合 `dark:` 前缀
- 确保所有组件都响应主题切换
- 添加平滑过渡动画

### API 性能优化
- 添加加载状态提示，让用户知道正在处理
- 考虑添加超时控制和重试机制
- 优化用户等待体验

## Impact

- **Affected specs**: 主题切换功能、API 调用体验
- **Affected code**: 
  - `src/app/page.tsx`
  - `src/app/result/page.tsx`
  - `src/components/Hero.tsx`
  - `src/app/globals.css`
  - `src/app/api/generate/route.ts`

## ADDED Requirements

### Requirement: 主题响应式变化
页面所有元素 SHALL 响应主题切换，包括:
- 背景渐变
- 文字颜色
- 卡片背景
- 边框颜色

#### Scenario: 用户点击主题切换按钮
- **WHEN** 用户点击右上角主题切换按钮
- **THEN** 整个页面的背景、文字、卡片颜色立即平滑切换
- **AND** 浅色模式下使用明亮背景
- **AND** 深色模式下使用深色背景

### Requirement: API 加载体验优化
系统 SHALL 提供清晰的加载状态提示:
- 显示加载动画
- 显示友好的提示文案
- 超时后显示重试选项

#### Scenario: API 调用中
- **WHEN** 用户提交输入后
- **THEN** 立即显示加载状态
- **AND** 显示"正在生成你的赛博氧气..."提示
- **AND** 禁用提交按钮防止重复提交

#### Scenario: API 调用超时
- **WHEN** API 调用超过 30 秒未响应
- **THEN** 显示超时提示
- **AND** 提供"重试"按钮
- **AND** 提供"使用备用方案"选项

## MODIFIED Requirements

### Requirement: 页面背景样式
**原样式**: 固定的渐变背景 `bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800`

**新样式**: 使用 CSS 变量，支持主题切换
```css
/* 浅色模式 */
background: linear-gradient(to bottom, #eff6ff, #f5f3ff);

/* 深色模式 */  
background: linear-gradient(to bottom, #0f172a, #1e1b4b);
```

### Requirement: API 超时时间
**原配置**: 无超时控制

**新配置**: 
- 设置 30 秒超时
- 超时后返回友好错误信息
- 提供 fallback 数据

## REMOVED Requirements

无

---

## 技术方案

### 主题切换修复

**问题根源**: 
- 页面使用了硬编码的渐变背景色
- 组件使用了固定的背景色，没有使用 `dark:` 前缀
- 缺少主题过渡动画

**解决方案**:

1. **修改 globals.css**: 添加主题相关的 CSS 变量
```css
:root {
  --gradient-from: #eff6ff;  /* blue-50 */
  --gradient-to: #f5f3ff;    /* purple-50 */
}

.dark {
  --gradient-from: #0f172a;  /* slate-900 */
  --gradient-to: #1e1b4b;    /* indigo-950 */
}
```

2. **修改页面组件**: 使用 CSS 变量
```tsx
<main className="min-h-screen bg-gradient-to-b from-[var(--gradient-from)] to-[var(--gradient-to)] transition-colors duration-300">
```

3. **添加过渡动画**: 
```css
.transition-colors {
  transition: background-color, color, border-color;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}
```

### API 性能优化

**问题根源**:
- API 调用无超时控制
- 加载状态提示不够友好
- 用户不知道进度

**解决方案**:

1. **添加超时控制**:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

const response = await fetch('/api/generate', {
  signal: controller.signal,
  ...
});
```

2. **优化加载提示**:
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

3. **添加超时提示**:
```tsx
if (error.code === 'TIMEOUT') {
  return (
    <div>
      <p>生成超时，请稍后重试</p>
      <button onClick={retry}>重试</button>
      <button onClick={useFallback}>使用备用方案</button>
    </div>
  );
}
```

---

## 验收标准

### 主题切换验收
- [ ] 点击切换按钮后，页面背景立即平滑变化
- [ ] 浅色模式：明亮渐变（蓝紫色系）
- [ ] 深色模式：深色渐变（深蓝/深紫色系）
- [ ] 所有卡片、文字、边框颜色都响应变化
- [ ] 过渡动画流畅（300ms）
- [ ] 滚动条颜色也响应变化

### API 性能验收
- [ ] 提交后立即显示加载状态
- [ ] 加载提示清晰友好
- [ ] 30 秒超时后显示错误提示
- [ ] 提供重试按钮
- [ ] 禁用重复提交

### 用户体验验收
- [ ] 主题切换无闪烁
- [ ] 加载过程不焦虑
- [ ] 超时后有明确操作指引
