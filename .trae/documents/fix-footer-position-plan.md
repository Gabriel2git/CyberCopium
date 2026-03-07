# 修复 Footer 位置问题计划

## 问题分析

用户反馈 Footer（横线和提示文字）离页面底部有很大空间，需要将其紧贴底部。

## 解决方案

使用 Playwright 浏览器查看实际页面效果，然后调整 CSS 样式。

## 实施步骤

### 步骤 1：使用 Playwright 查看页面
- 启动浏览器访问页面
- 截图查看当前 Footer 位置
- 分析间距问题

### 步骤 2：调整 Footer 样式
- 修改 App.tsx 中的 Footer 样式
- 可能需要调整：
  - 移除或减小 mt-auto
  - 调整父容器的 min-height
  - 使用 absolute 定位将 Footer 固定在底部

### 步骤 3：验证修复效果
- 再次截图确认 Footer 位置正确

## 技术实现

可能的修复方案：

```tsx
// 方案 1：使用 absolute 定位
<footer className="absolute bottom-0 left-0 right-0 ...">

// 方案 2：调整 flex 布局
<div className="min-h-screen flex flex-col justify-between">

// 方案 3：调整主内容区域
<main className="flex-1 flex flex-col justify-center">
```
