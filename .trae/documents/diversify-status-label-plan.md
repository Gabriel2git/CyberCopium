# 状态命名多样化改造计划

## 问题分析

当前问题：同一个输入"不想投简历"每次返回相同的状态命名"高优级拖延症发作中"

根本原因：
1. LLM（qwen-flash）temperature=0.7 但缺乏多样性引导
2. Prompt中没有明确要求每次生成不同的表达
3. 没有引入随机性或多样性机制

## 改造计划

### [ ] 任务1: 增加temperature参数提升多样性
- **优先级**: P0
- **Depends On**: None
- **Description**:
  - 检查当前Composer调用的temperature设置
  - 适当提高temperature（如从0.7提升到0.8-0.9）以增加创造性
  - 确保Analyzer层保持较低temperature（0.3）以保证控制策略的稳定性
- **Success Criteria**:
  - Composer temperature提升到0.8或更高
  - Analyzer temperature保持在0.3
- **Test Requirements**:
  - `programmatic` TR-1.1: 检查route.ts中两个阶段的temperature设置
  - `programmatic` TR-1.2: 确保修改后API调用正常

### [ ] 任务2: 优化Prompt增加多样性引导
- **优先级**: P0
- **Depends On**: 任务1
- **Description**:
  - 在COMPOSER_PROMPT的status_label说明中添加多样性要求
  - 明确要求："每次生成不同的、有创意的表达，避免重复使用相同的比喻"
  - 提供多个不同风格的示例，展示多样化的可能性
  - 可以引入随机元素提示，如"可以从以下角度切入：电量隐喻/进度条隐喻/系统状态隐喻/游戏状态隐喻"
- **Success Criteria**:
  - Prompt中包含明确的多样性要求
  - 提供多种不同风格的status_label示例
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查Prompt是否明确要求多样性
  - `human-judgement` TR-2.2: 示例是否覆盖多种风格

### [ ] 任务3: 添加随机性种子或角度提示
- **优先级**: P1
- **Depends On**: 任务2
- **Description**:
  - 在调用Composer时，可以传入一个随机角度提示
  - 例如：随机选择"电量隐喻"、"系统状态"、"游戏状态"、"物理状态"等不同角度
  - 或者在Prompt中列出多个可选角度，让LLM自由选择
- **Success Criteria**:
  - Composer Prompt中包含多角度切入的提示
  - 或者代码中实现了随机角度选择机制
- **Test Requirements**:
  - `programmatic` TR-3.1: 检查是否实现了角度多样化机制
  - `human-judgement` TR-3.2: 测试不同角度是否产生不同风格的status_label

### [ ] 任务4: 验证多样化效果
- **优先级**: P0
- **Depends On**: 任务2
- **Description**:
  - 使用相同输入"不想投简历"连续测试5-10次
  - 记录每次返回的status_label
  - 验证是否产生多样化的结果，而非每次都相同
  - 检查其他字段（voice_line, sticker_text等）是否也有多样性
- **Success Criteria**:
  - 相同输入产生不同的status_label（至少3-5种不同表达）
  - 结果仍然符合status_tag的分类
- **Test Requirements**:
  - `programmatic` TR-4.1: 连续调用10次API，记录所有status_label
  - `human-judgement` TR-4.2: 评估status_label的多样性和创意程度

## 关键改造点

### 1. Temperature调整
```typescript
// Composer层提高temperature
const composerCompletion = await client.chat.completions.create({
  model: GENERATION_MODEL,
  messages: [...],
  temperature: 0.85, // 从0.7提升到0.85
  max_tokens: 500,
  response_format: { type: 'json_object' },
});
```

### 2. Prompt多样性引导
在status_label说明中添加：
- "每次生成不同的、有创意的表达"
- "避免重复使用相同的比喻或隐喻"
- "可以从以下角度切入：电量隐喻/系统状态/游戏状态/物理状态/天气隐喻"

### 3. 多样化示例
提供不同风格的示例：
- 电量类："电量只剩1%的赛博游魂"、"CPU降频中"
- 系统类："系统休眠模式已启动"、"后台进程卡死"
- 游戏类："HP见底的红血状态"、"技能冷却中"
- 物理类："惯性滑行中无动力"、"摩擦力过大无法启动"

## 测试方法

使用以下命令连续测试：
```powershell
for ($i=1; $i -le 10; $i++) {
    Invoke-WebRequest -Uri http://localhost:3004/api/generate -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"input": "不想投简历"}' -UseBasicParsing
    Start-Sleep -Seconds 2
}
```

记录每次的status_label，检查多样性。
