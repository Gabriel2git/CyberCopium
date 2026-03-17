const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');
const modelConfig = require('../config/model.json');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ANALYZER_PROMPT = `# Role
你是赛博吸氧机的生成控制层。你的任务是把用户输入压缩成可用于生成的结构化策略。
不要安慰，不要解释，不要创作。

# Core Constraints
1. 保持绝对理性和克制，不要输出任何解释性文字。
2. 必须严格按照 JSON 格式输出，不得遗漏字段。
3. 风控第一：如检测到自残、严重抑郁等高危倾向，必须将 \`risk_level\` 设为 high，并强制把 \`tone_level\` 降为 L1（温和）。

# JSON Output Format & Rules
{
  "scene": "job_search | study | work | relationship | daily_life",
  "status_tag": "拖延/回避 | 羞耻/自我否定 | 疲惫/低启动 | 轻度发疯/情绪过载 | 想做但卡住",
  "tone_level": "L1 | L2 | L3",
  "primary_block": "fear_of_self_evaluation | low_energy | task_overwhelm | emotional_overload | unclear_next_step | avoidance_loop",
  "risk_level": "low | medium | high",
  "action_window": "30s | 3min | 10min",
  "style_mode": "温和嘴替 | 体面发疯 | 高雅崩溃 | 荒诞自救 | 低电量维稳",
  "style_hint": "...",
  "analysis_summary": "..."
}`;

function generateAnalyzerUserPrompt(input) {
  return `用户输入：${input}

请分析用户当前状态，返回 JSON 格式的战术板。`;
}

// 4 个测试模型
const MODELS = [
  ...modelConfig.availableModels,
];

// 5 秒超时
const TIMEOUT = 5000;

// 5 个测试输入
const TEST_INPUTS = [
  { name: '职场压力', text: '最近工作压力好大，每天都想辞职但又不敢，感觉自己快崩溃了' },
  { name: '学业拖延', text: '明天要交论文了，但我一直拖延，完全不想动怎么办' },
  { name: '人际关系', text: '和男朋友吵架了，感觉很委屈，不想说话' },
  { name: '日常焦虑', text: '每天晚上都睡不着觉，想太多，感觉生活没有意义' },
  { name: '情绪崩溃', text: '今天被老板骂了，觉得自己特别失败，什么都做不好' },
];

const ITERATIONS = 3;  // 每个输入测试 3 次

function createClient() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY 未设置');
  }
  return new OpenAI({
    apiKey,
    baseURL: modelConfig.dashscopeBaseUrl,
    timeout: TIMEOUT,
  });
}

async function testModelOnce(client, model, input) {
  const startTime = Date.now();
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: ANALYZER_PROMPT },
        { role: 'user', content: generateAnalyzerUserPrompt(input) },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });
    const latency = Date.now() - startTime;
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('响应为空');
    
    const parsed = JSON.parse(content);
    const quality = evaluateQuality(parsed);
    
    return { success: true, latency, quality, content: parsed };
  } catch (error) {
    const latency = Date.now() - startTime;
    return { success: false, latency, error: error.message, quality: 0 };
  }
}

function evaluateQuality(parsed) {
  let score = 0;
  
  // JSON 格式：10 分
  if (parsed && typeof parsed === 'object') score += 10;
  
  // 字段完整：20 分
  const required = ['scene', 'status_tag', 'tone_level', 'style_mode', 'risk_level', 'action_window'];
  const hasAll = required.every(f => parsed[f]);
  if (hasAll) score += 20;
  
  // 内容相关：30 分 - 简化判断
  if (parsed.analysis_summary && parsed.analysis_summary.length > 0) score += 30;
  
  // 风格一致：20 分 - 简化判断
  const validStyles = ['温和嘴替', '体面发疯', '高雅崩溃', '荒诞自救', '低电量维稳'];
  if (validStyles.includes(parsed.style_mode)) score += 20;
  
  // 字数合规：20 分 - 简化判断
  if (parsed.analysis_summary && parsed.analysis_summary.length <= 30) score += 20;
  
  return score;
}

function calculateStats(results) {
  const successes = results.filter(r => r.success);
  const latencies = successes.map(r => r.latency);
  const qualities = successes.map(r => r.quality);
  
  if (latencies.length === 0) {
    return { avgLatency: 0, timeoutRate: 100, successRate: 0, avgQuality: 0 };
  }
  
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const timeoutCount = results.filter(r => !r.success && r.error?.includes('timeout')).length;
  const timeoutRate = (timeoutCount / results.length) * 100;
  const successRate = (successes.length / results.length) * 100;
  const avgQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
  
  return { avgLatency, timeoutRate, successRate, avgQuality };
}

async function runTests() {
  const client = createClient();
  const allResults = {};
  
  for (const model of MODELS) {
    console.log(`\n📊 测试模型: ${model}`);
    console.log('='.repeat(50));
    allResults[model] = [];
    
    for (const inputObj of TEST_INPUTS) {
      console.log(`\n  输入: ${inputObj.name}`);
      for (let i = 1; i <= ITERATIONS; i++) {
        process.stdout.write(`    第 ${i}/${ITERATIONS} 次... `);
        const result = await testModelOnce(client, model, inputObj.text);
        allResults[model].push(result);
        
        if (result.success) {
          console.log(`✅ ${result.latency}ms, 质量 ${result.quality}/100`);
        } else {
          console.log(`❌ ${result.error || '失败'}`);
        }
        
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }
  
  return allResults;
}

function printReport(allResults) {
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                    模型对比测试报告                                ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log(`测试配置: 超时 ${TIMEOUT}ms, 每个输入测试 ${ITERATIONS} 次\n`);
  
  const summary = [];
  
  for (const model of MODELS) {
    const stats = calculateStats(allResults[model]);
    const speedScore = stats.successRate;  // 速度得分 = 成功率
    const qualityScore = stats.avgQuality || 0;
    const totalScore = (speedScore * 0.5) + (qualityScore * 0.5);
    
    summary.push({
      model,
      ...stats,
      speedScore,
      qualityScore,
      totalScore,
    });
  }
  
  // 按综合得分排序
  summary.sort((a, b) => b.totalScore - a.totalScore);
  
  // 打印表格
  console.log('┌─────────────────┬───────────┬───────────┬───────────┬───────────┐');
  console.log('│     指标        │qwen-flash │qwen-plus  │qwen3.5-  │qwen3.5-  │');
  console.log('│                 │           │           │ plus     │  flash   │');
  console.log('├─────────────────┼───────────┼───────────┼───────────┼───────────┤');
  
  const row = (name, key, unit = '') => {
    const vals = MODELS.map(m => {
      const s = summary.find(s => s.model === m);
      const v = s[key];
      return typeof v === 'number' ? v.toFixed(1) + unit : v;
    });
    console.log(`│ ${name.padEnd(15)} │ ${vals[0].padEnd(9)} │ ${vals[1].padEnd(9)} │ ${vals[2].padEnd(9)} │ ${vals[3].padEnd(9)} │`);
  };
  
  row('平均延迟(ms)', 'avgLatency');
  row('超时率(%)', 'timeoutRate');
  row('成功率(%)', 'successRate');
  row('质量得分', 'avgQuality', '/100');
  console.log('├─────────────────┼───────────┼───────────┼───────────┼───────────┤');
  row('综合得分', 'totalScore');
  console.log('└─────────────────┴───────────┴───────────┴───────────┴───────────┘');
  
  // 排名
  console.log('\n📊 综合排名:');
  summary.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.model}: ${s.totalScore.toFixed(1)} 分`);
  });
  
  // 推荐
  const best = summary[0];
  console.log(`\n🏆 推荐模型: ${best.model}`);
  console.log(`   - 延迟: ${best.avgLatency.toFixed(0)}ms`);
  console.log(`   - 成功率: ${best.successRate.toFixed(1)}%`);
  console.log(`   - 质量: ${best.avgQuality.toFixed(1)}/100`);
  console.log(`   - 综合: ${best.totalScore.toFixed(1)}`);
  
  // 不推荐的模型
  const notRecommended = summary.filter(s => s.timeoutRate > 50 || s.successRate < 50);
  if (notRecommended.length > 0) {
    console.log('\n⚠️ 不推荐的模型:');
    notRecommended.forEach(s => {
      console.log(`  - ${s.model}: 超时率 ${s.timeoutRate.toFixed(1)}%, 成功率 ${s.successRate.toFixed(1)}%`);
    });
  }
}

async function main() {
  try {
    const results = await runTests();
    printReport(results);
    
    // 找出最佳模型
    const summary = MODELS.map(model => {
      const stats = calculateStats(results[model]);
      return { model, ...stats };
    });
    summary.sort((a, b) => b.successRate - a.successRate);
    
    const best = summary[0];
    console.log(`\n💡 建议配置: "${best.model}"`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

main();
