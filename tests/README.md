# Playwright 测试指南

## 浏览器配置

已配置使用本地 Chromium 浏览器：
- **路径**: `E:\TraeFile\chrome-win\chrome.exe`
- **状态**: ✅ 已验证可正常使用
- **说明**: 此浏览器可供多个项目共享使用

## 运行测试

### 1. 确保开发服务器正在运行
```bash
npm run dev
```
服务器应该运行在 http://localhost:3000 或 http://localhost:3001

### 2. 快速测试（推荐）
使用 Node.js 脚本直接测试：
```bash
node test-browser.js
```

### 3. 完整流程测试
```bash
node test-full.js
```

### 4. Playwright 测试（需要额外配置）
```bash
npx playwright test tests/homepage.spec.ts
```

注意：Playwright 官方测试可能需要额外的配置才能使用本地浏览器。

## 测试文件

- `test-browser.js` - 简单浏览器启动测试
- `test-full.js` - 完整流程测试（首页 → 输入 → 提交 → 结果页）
- `tests/homepage.spec.ts` - Playwright 官方测试格式

## 验证结果

成功的测试应该显示：
- ✅ 浏览器启动成功
- ✅ 页面加载成功
- ✅ 页面标题正确
- ✅ Hero 标题可见
- ✅ 输入框可见
- ✅ 提交功能正常
- ✅ 结果页正常显示

## 故障排除

### 浏览器启动失败
检查 Chrome 路径是否正确：
```powershell
Test-Path "E:\TraeFile\chrome-win\chrome.exe"
```

### 端口被占用
如果 3000 端口被占用，服务器会自动使用 3001 端口。修改测试脚本中的 URL。

### 页面加载失败
确保开发服务器正在运行，并且可以访问 http://localhost:3000

## 配置说明

`playwright.config.ts` 已配置：
- 使用本地 Chromium 浏览器
- 有头模式（显示浏览器窗口）
- 1280x720 视口
- 标准 Chrome User Agent
