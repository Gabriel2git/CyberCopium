# 明暗主题切换功能实现计划

## 功能描述

为赛博吸氧机添加明暗主题切换按钮，让用户可以自由选择明亮的浅色主题或深邃的深色主题。

**默认主题**: 浅色主题（明亮、积极、开心）

---

## 设计原则

### 为什么默认浅色主题？

1. **心理学角度**: 明亮的颜色更能激发积极、开心的情绪
2. **产品定位**: "赛博盲目乐观"——明亮更符合产品调性
3. **用户体验**: 大多数用户默认使用浅色模式（约 80%+）
4. **可访问性**: 浅色模式在日光环境下可读性更好

### 为什么提供切换功能？

1. **个性化需求**: 部分用户偏好深色模式
2. **使用场景**: 夜间使用深色模式更舒适
3. **可访问性**: 满足不同视觉需求

---

## 技术方案

### 方案选择：Tailwind CSS + next-themes（推荐）

**优点**:
- 与 Tailwind CSS 完美集成
- 自动处理 SSR/CSR 水合问题
- 支持系统偏好检测
- 支持 localStorage 持久化
- 轻量级（~2kb）

**安装**:
```bash
npm install next-themes
```

### 实现步骤

#### 1. 配置 Provider

**文件**: `src/app/layout.tsx`

```tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="cyber-copium-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**配置说明**:
- `attribute="class"`: 使用 class 切换主题（Tailwind 要求）
- `defaultTheme="light"`: 默认浅色主题
- `enableSystem={true}`: 检测系统偏好
- `storageKey`: localStorage 存储键名

#### 2. 创建主题切换按钮组件

**文件**: `src/components/ThemeToggle.tsx`

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 避免服务端渲染不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 
                 shadow-lg hover:shadow-xl transition-all transform hover:scale-110
                 border border-gray-200 dark:border-gray-700"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        // 太阳图标（切换到浅色）
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // 月亮图标（切换到深色）
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
```

#### 3. 在布局中添加切换按钮

**文件**: `src/app/layout.tsx`

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// 在 ThemeProvider 内添加
<ThemeProvider ...>
  <ThemeToggle />
  {children}
</ThemeProvider>
```

#### 4. 优化按钮位置（可选）

**方案 A**: 固定在右上角（推荐）
- `fixed top-4 right-4`
- 始终可见，易于访问

**方案 B**: 放在 Hero 区域
- 作为页面内容的一部分
- 更适合移动端

**方案 C**: 放在页脚
- 不占用主要内容空间
- 但可发现性较低

**推荐**: 方案 A（固定右上角）

---

## 视觉设计

### 按钮样式

**浅色模式下**:
- 背景：白色
- 边框：浅灰色
- 图标：深灰色（月亮）
- 阴影：柔和阴影

**深色模式下**:
- 背景：深灰色
- 边框：深灰色
- 图标：金黄色（太阳）
- 阴影：柔和阴影

### 交互效果

- **Hover**: 放大 10% + 阴影加深
- **Active**: 缩小 5%
- **过渡**: 所有效果 200ms ease

### 图标语义

- 🌙 月亮：当前是浅色模式，点击切换到深色
- ☀️ 太阳：当前是深色模式，点击切换到浅色

---

## 主题持久化

### localStorage 存储

**键名**: `cyber-copium-theme`

**存储值**: `'light'` | `'dark'`

**读取逻辑**:
1. 首次访问：检测系统偏好 → 无偏好则使用浅色
2. 切换主题：保存到 localStorage
3. 再次访问：读取 localStorage → 保持上次选择

### 代码示例

```tsx
// next-themes 自动处理
// 无需手动编写 localStorage 逻辑
```

---

## 文件变更清单

### 新增文件
1. `src/components/ThemeToggle.tsx` - 主题切换按钮组件

### 修改文件
1. `src/app/layout.tsx` - 添加 ThemeProvider 和 ThemeToggle
2. `package.json` - 添加 next-themes 依赖

---

## 验收标准

### 功能验收
- [ ] 页面右上角有主题切换按钮
- [ ] 点击按钮可以切换明暗主题
- [ ] 默认显示浅色主题
- [ ] 切换后主题在刷新页面后保持
- [ ] 按钮图标随主题正确变化

### 视觉验收
- [ ] 浅色模式下显示月亮图标（深灰色）
- [ ] 深色模式下显示太阳图标（金黄色）
- [ ] 按钮样式在两种主题下都清晰可见
- [ ] Hover 和点击效果流畅自然

### 技术验收
- [ ] 使用 next-themes 正确处理 SSR/CSR 水合
- [ ] 无控制台警告或错误
- [ ] localStorage 正确存储主题偏好
- [ ] 支持系统偏好检测

### 用户体验验收
- [ ] 按钮位置固定，随时可访问
- [ ] 切换动画流畅（200ms）
- [ ] 按钮大小适中（44x44px 可点击区域）
- [ ] 移动端和桌面端都易于操作

---

## 开发顺序

1. **第一步**: 安装 next-themes
   ```bash
   npm install next-themes
   ```

2. **第二步**: 创建 ThemeToggle 组件
   - 实现切换逻辑
   - 添加图标
   - 配置样式

3. **第三步**: 配置 layout.tsx
   - 添加 ThemeProvider
   - 集成 ThemeToggle 组件

4. **第四步**: 测试功能
   - 切换主题
   - 刷新页面验证持久化
   - 测试系统偏好检测

5. **第五步**: 优化样式
   - 调整按钮位置
   - 优化 Hover 效果
   - 确保移动端友好

6. **第六步**: 跨浏览器测试
   - Chrome
   - Firefox
   - Safari
   - 移动端浏览器

---

## 预估工作量

- **安装依赖**: 2 分钟
- **创建组件**: 15-20 分钟
- **配置布局**: 10 分钟
- **测试优化**: 15-20 分钟
- **总计**: 约 45-55 分钟

---

## 扩展功能（可选）

### 1. 主题切换动画

添加页面级别的过渡动画：

```css
/* globals.css */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 2. 更多主题选项

- 赛博朋克主题（紫色 + 粉色）
- 护眼模式（暖色调）
- 高对比度主题

### 3. 快捷键支持

```tsx
// 按 T 键快速切换主题
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [theme, setTheme]);
```

### 4. 主题切换提示

首次切换时显示 Toast 提示：
- "已切换到明亮模式 ☀️"
- "已切换到深色模式 🌙"

---

## 相关文件

- **组件**: `src/components/ThemeToggle.tsx`
- **布局**: `src/app/layout.tsx`
- **依赖**: `package.json`
- **样式**: `src/app/globals.css`

---

## 参考资源

- [next-themes 官方文档](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS 深色模式](https://tailwindcss.com/docs/dark-mode)
- [Web 无障碍色彩对比度](https://www.w3.org/WAI/GL/wiki/Contrast_(minimum))
