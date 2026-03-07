# 修复结果卡片布局计划

## 问题分析

当前结果页的四张卡片（状态命名、抽象嘴替、荒诞动机、最小行动）使用横向网格布局（`grid-cols-2`），用户反馈横向跨度太大，不符合人体工学，需要改为竖向排列。

## 解决方案

将四张卡片从横向 2x2 网格布局改为竖向单列排列。

## 实施步骤

### 步骤 1：修改 ResultsSection.tsx
- 将 `grid grid-cols-1 md:grid-cols-2 gap-4` 改为 `flex flex-col gap-4`
- 或者改为 `grid grid-cols-1 gap-4`
- 这样四张卡片会竖向排列，每张卡片占满整行宽度

### 步骤 2：验证效果
- 刷新页面查看卡片是否竖向排列
- 确认间距合适

## 技术实现

修改 `src/components/ResultsSection.tsx`：

```tsx
// 修改前
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

// 修改后
<div className="flex flex-col gap-4 mb-8">
```

## 预期结果

1. 四张卡片竖向排列，每张卡片占满整行
2. 用户阅读时不需要大范围左右移动视线
3. 更符合人体工学
