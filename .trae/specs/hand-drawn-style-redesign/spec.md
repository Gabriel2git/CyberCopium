# 手绘涂鸦风格改造 Spec

## Why

将现有的赛博朋克渐变风格改造为手绘涂鸦风格，营造更轻松、有趣、直接的视觉体验，符合产品"赛博盲目乐观"的调性，减少距离感，增加亲和力。

## What Changes

### 核心风格变化
- **背景**: 从渐变蓝紫色 → 米白色纸张背景 (#fffef7)
- **字体**: 从系统字体 → 手写字体 (Caveat + Kalam)
- **边框**: 从细圆角边框 → 粗黑色边框 (2px border-black)
- **圆角**: 从 rounded-lg → rounded-none (无圆角)
- **阴影**: 从柔和阴影 → 硬阴影 (shadow-[Xpx_Ypx_0px_0px_rgba(0,0,0,1)])
- **装饰**: 添加手绘元素 (✦ ～ → 等符号、SVG 线条)
- **交互**: 悬停时阴影增强 + 位置偏移，模拟手绘按压效果

### 颜色方案
- **背景**: #fffef7 (米白色纸张)
- **主色**: #000000 (黑色边框/文字)
- **强调色**: #6b7280 (灰色辅助文字)
- **按钮**: 黑白灰三色

### 字体方案
- **标题**: Kalam (粗体手写)
- **正文**: Caveat (手写体)
- **中文**: 保持现有中文字体

## Impact

- **Affected specs**: 主题切换功能 (需适配手绘风格)
- **Affected code**: 
  - `src/app/globals.css` (核心样式)
  - `src/app/page.tsx` (首页)
  - `src/app/result/page.tsx` (结果页)
  - `src/components/*` (所有组件)

## ADDED Requirements

### Requirement: 手绘风格基础
系统 SHALL 提供手绘涂鸦风格的视觉体验:
- 米白色纸张背景 (#fffef7)
- 粗黑色边框 (2px solid black)
- 无圆角设计 (rounded-none)
- 硬阴影效果 (无模糊)

#### Scenario: 页面加载
- **WHEN** 用户打开页面
- **THEN** 看到米白色纸张背景
- **AND** 所有卡片和按钮有粗黑色边框
- **AND** 元素有手绘感的硬阴影

### Requirement: 手写字体
系统 SHALL 使用手写字体营造涂鸦感:
- 标题使用 Kalam 字体
- 正文使用 Caveat 字体
- 中文字体保持清晰可读

#### Scenario: 文字渲染
- **WHEN** 页面加载
- **THEN** 英文标题显示为 Kalam 手写体
- **AND** 英文正文显示为 Caveat 手写体

### Requirement: 手绘装饰元素
系统 SHALL 添加手绘装饰增强涂鸦感:
- 使用符号装饰 (✦ ～ → ★ 等)
- SVG 手绘线条和曲线
- 不规则倾斜角度 (rotate-1, -rotate-1 等)

#### Scenario: 装饰显示
- **WHEN** 页面渲染
- **THEN** 背景有手绘装饰元素
- **AND** 卡片有手绘符号点缀

### Requirement: 手绘交互效果
系统 SHALL 提供手绘感的交互反馈:
- 悬停时阴影增强
- 悬停时位置偏移 (模拟按压)
- 点击时有明显反馈

#### Scenario: 按钮悬停
- **WHEN** 鼠标悬停在按钮上
- **THEN** 阴影从 2px 增加到 4px
- **AND** 元素向下/向右偏移 2px
- **AND** 保持粗黑色边框

## MODIFIED Requirements

### Requirement: 主题切换
**原配置**: 蓝紫色渐变背景配合 dark 模式

**新配置**: 
- 浅色模式：米白色纸张背景 + 黑色边框
- 深色模式：深灰色背景 + 白色边框 (保持可读性)

### Requirement: 卡片样式
**原样式**: 彩色背景 + 圆角 + 柔和阴影

**新样式**:
- 白色背景 + 无圆角 + 粗黑边框 + 硬阴影
- 标签使用小方框装饰
- 添加手绘符号点缀

### Requirement: 按钮样式
**原样式**: 渐变背景 + 圆角

**新样式**:
- 纯色背景 (黑/白/灰)
- 无圆角
- 粗黑边框
- 硬阴影
- 悬停时有按压效果

## REMOVED Requirements

### Requirement: 渐变背景
**Reason**: 与手绘风格不符
**Migration**: 替换为米白色纸张背景

### Requirement: 圆角设计
**Reason**: 手绘风格需要直率的边角
**Migration**: 全部改为 rounded-none

### Requirement: 柔和阴影
**Reason**: 手绘风格需要硬阴影模拟深度
**Migration**: 替换为无模糊的硬阴影

---

## 技术方案

### 1. 字体引入
```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@300;400;700&display=swap');

.font-handwriting {
  font-family: 'Kalam', cursive;
}

.font-body {
  font-family: 'Caveat', cursive;
}
```

### 2. 基础样式
```css
.bg-paper {
  background-color: #fffef7;
}

.border-hand-drawn {
  border: 2px solid black;
}

.shadow-hard {
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
}

.shadow-hard-hover:hover {
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
  transform: translate(2px, 2px);
}
```

### 3. 组件样式规范

**卡片**:
```tsx
className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
```

**按钮**:
```tsx
className="bg-black text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
```

**输入框**:
```tsx
className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
```

### 4. 装饰元素

**手绘符号**:
- ✦ (四角星)
- ★ (实心星)
- ～ (波浪线)
- → (箭头)
- ↓ (向下箭头)
- ✓ (对勾)

**SVG 装饰**:
- 手绘曲线
- 手绘方框
- 手绘线条

---

## 验收标准

### 视觉验收
- [ ] 米白色纸张背景 (#fffef7)
- [ ] 所有卡片和按钮有粗黑色边框 (2px)
- [ ] 无圆角设计 (rounded-none)
- [ ] 硬阴影效果 (无模糊)
- [ ] 英文使用手写字体 (Kalam + Caveat)
- [ ] 有手绘装饰元素 (符号、线条)
- [ ] 不规则倾斜角度

### 交互验收
- [ ] 悬停时阴影增强
- [ ] 悬停时位置偏移 (2px)
- [ ] 点击有明显反馈
- [ ] 过渡动画流畅

### 功能验收
- [ ] 主题切换功能正常
- [ ] 所有按钮可点击
- [ ] 输入框可正常使用
- [ ] 响应式设计正常

### 一致性验收
- [ ] 所有卡片风格统一
- [ ] 所有按钮风格统一
- [ ] 整体视觉协调
- [ ] 手绘感一致
