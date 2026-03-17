# 修复 Vercel 编译错误计划

## 问题描述

Vercel 构建失败，报错：
```
./scripts/test-model-latency.ts:85:37
Type error: Parameter 'input' implicitly has an 'any' type.
```

## 问题原因

`scripts/test-model-latency.ts` 文件中的函数缺少 TypeScript 类型声明：
```typescript
function generateAnalyzerUserPrompt(input) {  // ❌ 缺少类型
```

Vercel 的 TypeScript 配置更严格，不允许隐式 any 类型。

## 解决方案

### 方案 1: 添加类型声明（推荐）

在函数参数上添加类型：
```typescript
function generateAnalyzerUserPrompt(input: string) {
```

### 方案 2: 从 tsconfig 排除 scripts 目录

修改 `tsconfig.json`，将 `scripts` 目录从编译中排除：
```json
{
  "exclude": ["node_modules", "scripts"]
}
```

### 方案 3: 将脚本改为纯 JS

将 `test-model-latency.ts` 重命名为 `test-model-latency.js`，并移除 TypeScript 语法。

## 推荐实施方案

采用**方案 2**，因为：
1. `scripts` 目录下的文件是开发工具，不需要参与生产构建
2. 最简单，不需要修改脚本代码
3. 避免未来类似问题

## 实施步骤

1. 修改 `tsconfig.json`，添加 `scripts` 到 exclude
2. 提交并推送代码
3. 重新部署 Vercel

## 预期结果

Vercel 构建成功，不再报错。
