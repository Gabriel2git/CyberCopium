# Chrome 浏览器路径变更通知

## 变更说明

Chrome for Testing 浏览器已从项目本地目录移动到共享位置，以便多个项目共享使用。

## 路径变更

### 旧路径
```
e:\TraeFile\CyberCopium\chrome-win\chrome.exe
```

### 新路径 (✅ 当前)
```
E:\TraeFile\chrome-win\chrome.exe
```

## 优势

1. **资源共享**: 多个项目可以共用同一个 Chrome 浏览器，节省磁盘空间
2. **统一管理**: 浏览器更新和维护更加方便
3. **项目解耦**: 项目代码不再包含浏览器文件，更加轻量

## 已更新的文件

以下文件已更新为使用新的浏览器路径：

### 配置文件
- ✅ `playwright.config.ts`
- ✅ `tests/fixtures/test-fixtures.ts`

### 测试脚本
- ✅ `test-browser.js`
- ✅ `test-full.js`

### 文档文件
- ✅ `tests/README.md`
- ✅ `PLAYWRIGHT_SETUP.md`

## 验证结果

已通过以下测试验证新路径正常工作：

```bash
# 路径检查
Test-Path "E:\TraeFile\chrome-win\chrome.exe"
# 结果：True ✅

# 浏览器启动测试
node test-browser.js
# 结果：✅ 浏览器启动成功！
#       ✅ 页面加载成功！
#       当前页面标题：赛博吸氧机 | Cyber Copium
```

## 其他项目使用指南

如果你想在其他项目中使用这个共享的 Chrome 浏览器，可以在 Playwright 配置中指定路径：

### playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
```

### 或者在测试代码中
```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: 'E:\\TraeFile\\chrome-win\\chrome.exe',
  headless: false,
});
```

## 注意事项

1. **路径存在性**: 确保 `E:\TraeFile\chrome-win\chrome.exe` 文件存在
2. **权限问题**: 确保所有项目都有访问该路径的权限
3. **版本管理**: 如果需要特定版本的 Chrome，请单独管理

## 验证命令

可以使用以下命令验证浏览器是否可用：

```powershell
# 检查文件是否存在
Test-Path "E:\TraeFile\chrome-win\chrome.exe"

# 运行测试脚本
node test-browser.js

# 运行 Playwright 测试
npx playwright test
```

## 日期

- 变更日期：2026-03-07
- 影响范围：所有使用 Playwright 测试的项目
