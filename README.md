# 赛博吸氧机 / Cyber Copium

> 现实太窒息？来吸一口纯度 100% 的赛博盲目乐观。

## 项目状态

✅ **阶段一：假数据闭环** - 已完成  
✅ **阶段二：真实生成闭环** - 已完成  
✅ **阶段三：视觉风格优化** - 已完成  
⏳ **阶段四：语料与风格控制** - 待开发  
⏳ **阶段五：反馈与演示准备** - 待开发  

## 快速开始

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.local.example .env.local
```

2. 在 `.env.local` 中配置阿里云百炼 API Key：
```env
# 阿里云百炼 API Key（推荐）
DASHSCOPE_API_KEY=sk-xxx

# OpenAI API Key（备用）
# OPENAI_API_KEY=sk-your-api-key-here
```

### 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 测试

```bash
# 运行前端自动化测试
npx playwright test

# 测试 AI 生成链路
node test-ai-generation.js
```

## 当前功能

### ✅ 已实现

- **输入模块**
  - 文本输入框（支持 200 字以内）
  - 示例语句快速填充
  - 输入验证和加载状态
  - 手绘风格输入框（带轻微旋转）

- **AI 生成模块**
  - 阿里云百炼 API 集成（兼容 OpenAI 格式）
  - Prompt v1 模板（五件套输出）
  - 状态识别（5 种状态标签）
  - 语气强度控制（L1/L2/L3）
  - 错误兜底机制
  - **贴纸文案长度约束（≤15 汉字）**

- **结果展示**
  - 五件套卡片展示：
    - 🏷️ 状态命名
    - 👄 抽象嘴替
    - 🎭 荒诞动机
    - ⚡ 最小行动
  - 精神贴纸预览（带角落标记）
  - 反馈按钮（重新生成/我去做了）

- **手绘风格设计**
  - SVG 手绘滤镜效果
  - 纸张纹理背景
  - 硬阴影卡片（无模糊）
  - 轻微旋转动画
  - 手绘装饰元素（✦ ～ ✎）
  - 手写字体（Caveat 标题 + Kalam 正文）

### 📋 数据结构

```typescript
interface GenerationResult {
  status_label: string;      // 状态命名 (≤20 字)
  voice_line: string;        // 抽象嘴替 (≤50 字)
  sticker_text: string;      // 贴纸文案 (≤15 字) ⚠️ 硬性约束
  absurd_motivation: string; // 荒诞动机 (≤40 字)
  micro_action: string;      // 最小行动 (≤30 字)
  tone_level: 'L1' | 'L2' | 'L3';
}
```

### 🎯 状态标签

- 拖延/回避
- 羞耻/自我否定
- 疲惫/低启动
- 轻度发疯/情绪过载
- 想做但卡住

### 🎚️ 语气强度

- **L1 稳定模式**：低梗、低刺激、偏现实支持（适合高风险场景）
- **L2 轻抽象模式**：轻微自嘲、温和荒诞（默认模式）
- **L3 高抽象模式**：允许更明显的发疯文学（用户明确想发疯时）

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **UI 组件**: shadcn/ui (基础样式)
- **动画**: Framer Motion（待接入）
- **后端**: Next.js Route Handlers
- **AI**: 阿里云百炼 (qwen-plus) / OpenAI API (备用)
- **测试**: Playwright（前端自动化测试）
- **部署**: Vercel (待部署)

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API 路由
│   ├── result/
│   │   └── page.tsx              # 结果展示页
│   ├── globals.css               # 全局样式（手绘风格）
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页（输入）
├── components/
│   ├── Hero.tsx                  # Hero 区域（SVG 下划线）
│   ├── InputSection.tsx          # 输入模块（手绘装饰）
│   ├── ResultsSection.tsx        # 结果卡片（旋转效果）
│   ├── StickerCard.tsx           # 贴纸卡片（角落标记）
│   ├── FeedbackSection.tsx       # 反馈按钮
│   ├── LoadingState.tsx          # 加载状态
│   └── Footer.tsx                # 页脚免责声明
├── lib/
│   └── prompt.ts                 # Prompt 模板（含长度约束）
└── types/
    └── index.ts                  # TypeScript 类型定义

tests/
├── specs/
│   ├── homepage.spec.ts          # 首页测试（7/7 通过）
│   └── result.spec.ts            # 结果页测试（待修复）
├── fixtures/
│   └── test-fixtures.ts          # 测试夹具
└── utils/
    └── helpers.ts                # 测试辅助函数
```

## API 配置说明

### 阿里云百炼（推荐）

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  timeout: 30000,
});

const completion = await client.chat.completions.create({
  model: 'qwen-plus',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: generateUserPrompt(input) },
  ],
  response_format: { type: 'json_object' },
});
```

### 可用模型

- `qwen-plus` - 推荐，性能和成本平衡
- `qwen-turbo` - 快速响应
- `qwen-max` - 最强能力

## 测试结果

### AI 生成链路测试

运行 `node test-ai-generation.js` 验证 AI 生成质量：

**测试用例**：
1. ✅ 求职拖延场景："我又不想投简历了"
   - 贴纸文案："简历在加载，我在离线" (10 字符)
   
2. ✅ 学习摆住场景："今天一天都没学进去"
   - 贴纸文案："本机正在省电模式" (8 字符)
   
3. ✅ 轻度发疯场景："我现在只想发疯"
   - 贴纸文案："先疯后理" (4 字符)

**所有测试通过**：
- ✅ 五件套输出完整
- ✅ tone_level 字段存在
- ✅ 贴纸文案≤15 汉字

### 前端自动化测试

**首页测试**：7/7 通过 (100%)
- ✅ TC-HOME-001: 页面正常加载
- ✅ TC-HOME-002: 输入框工作正常
- ✅ TC-HOME-003: 示例按钮填充输入
- ✅ TC-HOME-004: 所有示例按钮可点击
- ✅ TC-HOME-005: 提交按钮工作正常
- ✅ TC-HOME-006: 空输入时禁用提交
- ✅ TC-HOME-007: 输入后启用提交

**结果页测试**：4/7 通过 (待修复)
- ✅ TC-RESULT-001: 从首页跳转到结果页
- ✅ TC-RESULT-002: 结果页标题正确
- ❌ TC-RESULT-003: 五张结果卡片显示（元素定位问题）
- ❌ TC-RESULT-004: 精神贴纸显示（元素定位问题）
- ❌ TC-RESULT-005: 反馈按钮功能正常（元素定位问题）
- ✅ TC-RESULT-006: 返回首页功能
- ✅ TC-RESULT-007: 结果页手绘风格正确

## 设计特色

### 手绘风格实现

1. **SVG 滤镜**
   ```tsx
   <filter id="sketch-filter">
     <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
     <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
   </filter>
   ```

2. **纸张纹理**
   - 米白色背景 (#fffef7)
   - SVG noise 图案叠加

3. **硬阴影**
   - `box-shadow: 4px 4px 0px 0px rgba(0,0,0,1)`
   - 无模糊效果

4. **手写字体**
   - 标题：Caveat（Google Fonts）
   - 正文：Kalam（Google Fonts）

5. **手绘装饰**
   - ✦ 星星符号
   - ～ 波浪线
   - ✎ 铅笔符号
   - 不规则圆形和方形

## 下一步计划

### 阶段四：语料与风格控制
- [ ] Seed Samples 整理（20-30 条）
- [ ] 语料扩量与标注（200-500 条）
- [ ] 检索链路实现
- [ ] 风格控制优化
- [ ] 安全过滤机制

### 阶段五：反馈与演示准备
- [ ] 修复失败的测试用例
- [ ] 用户反馈模块完善
- [ ] PostHog 埋点接入
- [ ] Demo 场景准备（3-5 个）
- [ ] 录屏脚本编写

## 开发原则

- 先做单链路闭环，再补边角功能
- 先保证结果可用，再追求风格惊艳
- 先做静态模板和规则兜底，再接 AI 动态生成
- 先做主路径，不在历史记录、账号、分享链路上分心

## 参考资料

本项目设计参考了 Figma AI 情绪转译工具的手绘风格设计，并在此基础上进行了优化和本地化改进。

## 许可证

MIT

---

**赛博吸氧机** - 给你的困境一口赛博氧气 🌈

**最后更新**: 2026-03-07
