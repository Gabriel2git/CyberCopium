# 简化手绘风格 & Playwright 安装 Spec

## Why

1. **Playwright 安装需求**: 需要安装 Playwright 浏览器以便进行前端界面测试和截图验证，但官方源下载速度极慢，需要使用国内镜像源加速安装。

2. **风格简化需求**: 当前手绘风格仍保留了明暗主题切换功能和部分彩色元素，需要进一步简化为纯黑白风格，去除所有彩色，只保留黑白两色，营造更纯粹的手绘涂鸦感。

## What Changes

### Playwright 镜像源安装
- 使用 npmmirror 镜像源下载 Chromium
- 设置环境变量 `PLAYWRIGHT_DOWNLOAD_HOST`
- 快速安装 Chromium 浏览器

### 风格简化
- **删除主题切换**: 移除明暗主题切换按钮和功能
- **纯黑白配色**: 所有元素只使用黑白两色
- **移除彩色背景**: 卡片背景从彩色改为白色
- **统一视觉**: 所有边框、文字、阴影统一为黑色

## Impact

- **Affected specs**: 手绘涂鸦风格改造 spec (修改颜色方案和主题切换)
- **Affected code**:
  - `src/app/globals.css` (移除深色模式样式)
  - `src/app/page.tsx` (移除主题切换)
  - `src/app/result/page.tsx` (移除主题切换)
  - `src/components/ThemeToggle.tsx` (删除或移除使用)
  - `src/components/*` (所有组件移除彩色背景和深色模式)
  - `tailwind.config.ts` (可能简化配置)

## ADDED Requirements

### Requirement: Playwright 镜像源安装
系统 SHALL 使用国内镜像源快速安装 Playwright Chromium:
- 使用 npmmirror 镜像 (https://npmmirror.com/mirrors/playwright)
- 设置环境变量加速下载
- 完成 Chromium 浏览器安装

### Requirement: 纯黑白配色
系统 SHALL 只使用黑白两色:
- 背景：白色 (#ffffff 或 #fffef7)
- 文字：黑色 (#000000) 或深灰 (#374151)
- 边框：黑色 (#000000)
- 阴影：黑色 (rgba(0, 0, 0, 1))
- 无其他彩色

## MODIFIED Requirements

### Requirement: 颜色方案
**原配置**: 米白色背景 + 黑色边框 + 部分彩色卡片背景

**新配置**:
- 背景：#ffffff (纯白) 或 #fffef7 (米白)
- 所有卡片：白色背景
- 所有文字：黑色或深灰色
- 所有边框：2px solid black
- 所有阴影：硬阴影，黑色

### Requirement: 主题切换
**原配置**: 支持明暗主题切换，深色模式使用白色边框

**新配置**:
- **移除主题切换功能**
- 只保留明亮模式
- 所有元素固定为黑白配色

## REMOVED Requirements

### Requirement: 深色模式
**Reason**: 简化风格，只保留明亮的黑白手绘风格
**Migration**: 移除所有 dark: 前缀的样式，移除主题切换按钮

### Requirement: 彩色卡片背景
**Reason**: 纯黑白风格不需要彩色
**Migration**: 所有卡片背景改为白色

### Requirement: ThemeToggle 组件
**Reason**: 不再需要主题切换
**Migration**: 从所有页面中移除 ThemeToggle 组件的使用

---

## 技术方案

### 1. Playwright 镜像源安装

**方法一：环境变量**
```bash
export PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright
npx playwright install chromium
```

**方法二：直接使用镜像**
```bash
# Windows PowerShell
$env:PLAYWRIGHT_DOWNLOAD_HOST="https://npmmirror.com/mirrors/playwright"
npx playwright install chromium
```

### 2. 移除主题切换

**删除文件**:
- `src/components/ThemeToggle.tsx` (可选，或删除使用)

**修改页面**:
```tsx
// 移除 ThemeToggle 导入和使用
// 移除 next-themes 相关配置
```

### 3. 纯黑白样式

**卡片样式**:
```tsx
className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
```

**移除所有 dark: 前缀**:
```tsx
// 之前
className="bg-white dark:bg-gray-800 border-black dark:border-white"

// 之后
className="bg-white border-black"
```

### 4. 全局样式简化

**globals.css**:
```css
/* 移除深色模式定义 */
/* 只保留浅色模式样式 */

.bg-paper {
  background-color: #fffef7;
}

/* 移除 .dark 选择器相关样式 */
```

---

## 验收标准

### Playwright 安装
- [ ] 使用镜像源成功安装 Chromium
- [ ] 安装时间显著缩短 (< 5 分钟)
- [ ] 浏览器可正常使用

### 风格简化
- [ ] 移除主题切换按钮
- [ ] 所有页面只有一种明亮风格
- [ ] 所有卡片背景为白色
- [ ] 所有文字为黑色或深灰色
- [ ] 所有边框为黑色
- [ ] 无彩色元素

### 代码清理
- [ ] 移除所有 dark: 前缀样式
- [ ] 移除 ThemeToggle 组件使用
- [ ] 移除 next-themes 配置
- [ ] 简化 globals.css

### 视觉一致性
- [ ] 首页纯黑白
- [ ] 结果页纯黑白
- [ ] 所有组件纯黑白
- [ ] 整体视觉协调统一
