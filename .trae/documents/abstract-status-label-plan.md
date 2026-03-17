# 状态命名抽象化改造计划

## 问题分析

当前架构中，Analyzer层输出的字段类型定义如下：

### 当前枚举类型（Analyzer层严格控制）
1. **scene**: `job_search | study | work | relationship | daily_life` - 场景分类
2. **status_tag**: `拖延/回避 | 羞耻/自我否定 | 疲惫/低启动 | 轻度发疯/情绪过载 | 想做但卡住` - 状态标签
3. **tone_level**: `L1 | L2 | L3` - 语气强度
4. **primary_block**: `fear_of_self_evaluation | low_energy | task_overwhelm | emotional_overload | unclear_next_step | avoidance_loop` - 核心阻力机制
5. **risk_level**: `low | medium | high` - 风险等级
6. **action_window**: `30s | 3min | 10min` - 行动时间窗口
7. **style_mode**: `温和嘴替 | 体面发疯 | 高雅崩溃 | 荒诞自救 | 低电量维稳` - 风格模式

### 需要改造的类型
- **status_label**: 当前在Composer层生成，应该是抽象的string类型，而非枚举

## 改造计划

### [ ] 任务1: 确认Analyzer层的枚举类型
- **优先级**: P0
- **Depends On**: None
- **Description**:
  - 确认scene、status_tag、primary_block、risk_level、action_window、style_mode、tone_level都是枚举类型
  - 这些枚举用于控制Composer的生成策略
  - 确认status_label不是Analyzer的输出，而是Composer的生成内容
- **Success Criteria**:
  - 明确哪些字段是Analyzer的枚举控制参数
  - 明确status_label是Composer的自由生成字段
- **Test Requirements**:
  - `programmatic` TR-1.1: 检查types/index.ts中的类型定义
  - `programmatic` TR-1.2: 检查prompt.ts中的Analyzer输出格式

### [ ] 任务2: 修改status_label类型定义
- **优先级**: P0
- **Depends On**: 任务1
- **Description**:
  - 将GenerationResult中的status_label从隐式枚举改为明确的string类型
  - 添加注释说明这是Composer自由生成的抽象状态命名
  - 长度限制保持≤20字
- **Success Criteria**:
  - status_label类型为string，而非枚举
  - 类型定义中有清晰的注释说明
- **Test Requirements**:
  - `programmatic` TR-2.1: 检查types/index.ts中的status_label类型
  - `programmatic` TR-2.2: 确保不影响其他字段的类型定义

### [ ] 任务3: 优化Composer Prompt
- **优先级**: P1
- **Depends On**: 任务2
- **Description**:
  - 修改COMPOSER_PROMPT中status_label的说明
  - 强调status_label应该是抽象、有网感、个性化的状态命名
  - 提供示例：如"高优级拖延症发作中"、"精神离职状态"、"薛定谔的努力"等
  - 说明status_label基于status_tag但更加抽象和个性化
- **Success Criteria**:
  - Prompt中status_label的描述更加抽象和开放
  - 提供多样化的示例
- **Test Requirements**:
  - `human-judgement` TR-3.1: 检查Prompt描述是否清晰
  - `human-judgement` TR-3.2: 示例是否足够多样化

### [ ] 任务4: 验证改造效果
- **优先级**: P1
- **Depends On**: 任务3
- **Description**:
  - 测试API调用，检查返回的status_label是否更加抽象和个性化
  - 确保status_label不再是固定的几个枚举值
  - 确保其他枚举字段（如status_tag）仍然保持枚举约束
- **Success Criteria**:
  - status_label返回多样化的抽象状态命名
  - 其他枚举字段仍然严格受控
- **Test Requirements**:
  - `programmatic` TR-4.1: 多次调用API检查status_label的多样性
  - `human-judgement` TR-4.2: 评估status_label的抽象程度和个性化程度

## 架构说明

### Analyzer层（控制层）- 严格枚举
- scene: 场景枚举 - 用于确定大方向
- status_tag: 状态标签枚举 - 用于分类用户状态
- primary_block: 阻力机制枚举 - 用于理解核心问题
- risk_level: 风险等级枚举 - 用于安全控制
- action_window: 时间窗口枚举 - 用于控制行动粒度
- style_mode: 风格模式枚举 - 用于控制生成风格
- tone_level: 语气强度枚举 - 用于控制语气

### Composer层（表达层）- 自由生成
- status_label: **抽象字符串** - 基于status_tag但更加个性化和网感化
- voice_line: 自由生成 - 抽象嘴替
- sticker_text: 自由生成 - 精神贴纸
- absurd_motivation: 自由生成 - 荒诞动机
- micro_action: 自由生成 - 最小行动

## 关键区别

**status_tag vs status_label**:
- **status_tag**（Analyzer输出）: 枚举类型，用于分类和控制，如"疲惫/低启动"
- **status_label**（Composer生成）: 抽象字符串，用于展示和共鸣，如"电量只剩1%的赛博游魂"
