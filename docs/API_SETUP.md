# API 配置指南

## 阿里云百炼（推荐）

### 1. 获取 API Key

1. 访问阿里云百炼控制台：https://bailian.console.aliyun.com/
2. 登录/注册阿里云账号
3. 进入"API-KEY 管理"页面
4. 创建新的 API Key
5. 复制 Key（格式：`sk-xxxxxxxxxxxxxxxx`）

### 2. 配置环境变量

编辑 `.env.local` 文件：

```env
DASHSCOPE_API_KEY=sk-你的真实 APIKey
```

### 3. 模型选择（单一配置源）

项目统一通过 `config/model.json` 管理模型与版本，当前默认配置为：

```json
{
  "generationModel": "qwen-flash",
  "promptVersion": "v2"
}
```

可选模型：
- `qwen-flash` - 推荐：低延迟、稳定性高
- `qwen-turbo` - 快速响应，成本最低
- `qwen-plus` - 性能和成本平衡（推荐）
- `qwen-max` - 最强能力，成本最高

### 4. 测试配置

启动开发服务器后：

```bash
npm run dev
```

访问 http://localhost:3000，输入测试语句如"我又不想投简历了"，查看是否能正常生成结果。

## 故障排查

### 问题 1：提示"DASHSCOPE_API_KEY 未配置"

**原因**: 环境变量未正确加载

**解决方法**:
1. 确认 `.env.local` 文件存在
2. 确认文件中没有多余的空格或引号
3. 重启开发服务器

### 问题 2：API 调用失败

**可能原因**:
- API Key 无效或过期
- 账户余额不足
- 网络连接问题

**解决方法**:
1. 检查 API Key 是否正确
2. 登录阿里云百炼控制台查看余额
3. 检查网络连接

### 问题 3：返回字段不完整

**原因**: AI 模型未按要求返回 JSON 格式

**解决方法**:
- 当前已配置 `response_format: { type: 'json_object' }`
- 如果仍然出现问题，可以查看服务器日志了解详细错误

## 成本说明

阿里云百炼 API 按 token 计费：

- **qwen-turbo**: 约 ¥0.002/1K tokens
- **qwen-plus**: 约 ¥0.005/1K tokens  
- **qwen-max**: 约 ¥0.02/1K tokens

每次生成约消耗 500-800 tokens，单次成本约 ¥0.003-¥0.016。

## 从 OpenAI 迁移

如果你之前使用的是 OpenAI，迁移到阿里云百炼非常简单：

### 原 OpenAI 配置：
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### 新百炼配置：
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});
```

主要变化：
1. 环境变量名从 `OPENAI_API_KEY` 改为 `DASHSCOPE_API_KEY`
2. 添加了 `baseURL` 指向阿里云百炼的兼容接口
3. 模型名从 `gpt-3.5-turbo` 改为 `qwen-plus`

## 安全提示

⚠️ **重要**: 
- 不要将 `.env.local` 文件提交到 Git
- 不要在前端代码中直接暴露 API Key
- 定期更换 API Key
- 监控 API 使用量，避免异常消耗

本项目已将 `.env.local` 添加到 `.gitignore`，确保不会被意外提交。
