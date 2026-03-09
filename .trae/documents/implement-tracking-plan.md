# 数据埋点与效果评估实施计划

## 目标
为赛博吸氧机建立最小可用的数据观察能力，回答三个核心问题：
1. 用户有没有被看懂
2. 用户有没有觉得内容值得保存
3. 用户有没有被推动去做一个最小行动

## 技术方案选择

**推荐方案**: PostHog (MVP 最快落地)
- 优点: 快速集成、免费额度充足、内置分析看板
- 适合: 求职演示、快速验证、无需自建基础设施

**备选方案**: 自定义 /api/track (强调可控性)
- 优点: 完全可控、可展示自定义设计能力
- 缺点: 需要自建存储和分析

**本计划采用**: PostHog 方案 (最快形成可演示的数据体系)

## 实施步骤

### 阶段一: 安装和配置 PostHog (1 步)

**Step 1: 安装 PostHog SDK**
- 安装 `@posthog/posthog-js` 包
- 在 layout.tsx 中初始化 PostHog
- 配置项目 API Key 和 Host
- 环境变量配置 (POSTHOG_KEY, POSTHOG_HOST)

### 阶段二: 前端埋点实施 (8 条核心事件)

**Step 2: 页面与输入事件**
- `page_view`: 页面首次加载时触发
  - 属性: session_id, referrer, device_type, build_version
  
- `sample_prompt_click`: 点击示例输入时触发
  - 属性: sample_text, sample_type
  
- `generate_submit`: 点击生成按钮时触发
  - 属性: input_length, input_source (manual/sample), build_version

**Step 3: 结果消费事件**
- `result_impression`: 结果卡片成功渲染时触发
  - 属性: scene, status_tag, tone_level, style_mode, risk_level
  
- `regenerate_click`: 用户点击重新生成时触发
  - 属性: previous_scene, previous_status_tag, previous_tone_level, previous_style_mode

**Step 4: 反馈与行动事件**
- `feedback_understood`: 点击"像我想说的"时触发
  - 属性: scene, status_tag, tone_level, style_mode
  
- `feedback_helpful`: 点击"有帮我动起来"时触发
  - 属性: scene, tone_level, style_mode, action_window
  
- `sticker_save_click`: 用户保存贴纸时触发
  - 属性: sticker_text_length, scene, tone_level, style_mode
  
- `micro_action_click`: 点击最小行动时触发
  - 属性: scene, status_tag, primary_block, tone_level, action_window

### 阶段三: 后端埋点实施 (4 条质量事件)

**Step 5: 生成链路事件**
- `generate_success`: API 成功返回时触发 (服务端)
  - 属性: latency_ms, model_name, prompt_version, scene, status_tag, tone_level, primary_block, style_mode, risk_level, action_window
  
- `generate_error`: API 失败时触发 (服务端)
  - 属性: error_type, latency_ms, prompt_version, model_name, fallback_used

**Step 6: 安全与完成事件**
- `safety_downgrade_triggered`: 触发高风险降级时触发
  - 属性: original_tone_level, final_tone_level, risk_level, trigger_reason
  
- `micro_action_done`: 点击"我去做了"或"已完成"时触发
  - 属性: scene, tone_level, style_mode, action_window

### 阶段四: 数据验证与看板 (1 步)

**Step 7: 验证与指标看板**
- 验证 12 条核心事件可稳定触发
- 在 PostHog 中配置核心指标看板:
  - 生成成功率 = generate_success / generate_submit
  - 命中感 = feedback_understood / result_impression
  - 再生成率 = regenerate_click / result_impression
  - 贴纸保存率 = sticker_save_click / result_impression
  - 行动点击率 = micro_action_click / result_impression
  - 行动完成自报率 = micro_action_done / micro_action_click

## 文件修改清单

1. **package.json** - 添加 @posthog/posthog-js 依赖
2. **.env.local** - 添加 POSTHOG_KEY 和 POSTHOG_HOST
3. **src/app/layout.tsx** - 初始化 PostHog
4. **src/lib/posthog.ts** - 封装 PostHog 事件发送函数
5. **src/app/page.tsx** - 添加 page_view, sample_prompt_click, generate_submit
6. **src/components/InputSection.tsx** - 添加 sample_prompt_click
7. **src/app/result/page.tsx** - 添加 result_impression, regenerate_click
8. **src/components/ResultsSection.tsx** - 添加 feedback_understood, feedback_helpful, sticker_save_click
9. **src/components/StickerCard.tsx** - 添加 sticker_save_click
10. **src/components/FeedbackSection.tsx** - 添加 micro_action_click, micro_action_done
11. **src/app/api/generate/route.ts** - 添加 generate_success, generate_error, safety_downgrade_triggered

## 验收标准

- [ ] 12 条核心事件可稳定触发
- [ ] 关键指标可以在 PostHog 看板中被统计
- [ ] 事件属性能关联到控制层字段 (scene, status_tag, tone_level 等)
- [ ] 可以支持一次 Prompt 版本前后对比分析
- [ ] 可在面试中明确讲出"如何验证产品是否真的命中和推动了用户"

## 风险评估

- **低风险**: PostHog 是成熟产品，集成简单
- **预期结果**: 建立完整的数据验证体系，支持 AI PM 求职演示

## 下一步

完成埋点后，可以:
1. 在 PostHog 中查看实时事件流
2. 配置漏斗分析 (Funnel Analysis)
3. 进行 A/B 测试对比不同 Prompt 版本效果
4. 生成数据报告用于求职展示
