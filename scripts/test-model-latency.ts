const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');
const modelConfig = require('../config/model.json');

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 复制 ANALYZER_PROMPT 内容（避免模块导入问题）
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
}

## 字段说明

### scene (场景)
- job_search: 求职相关（投简历、面试、职业规划）
- study: 学习相关（考试、论文、技能提升）
- work: 工作相关（项目、职场关系、加班）
- relationship: 人际关系（恋爱、家庭、朋友）
- daily_life: 日常生活（作息、健康、琐事）

### status_tag (状态标签)
严格从以下五个中选择最匹配的一个：
- 拖延/回避：明明该做但一直拖着
- 羞耻/自我否定：觉得自己不行、很废物
- 疲惫/低启动：没能量、动不起来
- 轻度发疯/情绪过载：想发疯、情绪爆炸
- 想做但卡住：有意愿但不知道怎么做

### tone_level (语气强度)
- L1 稳定模式：低梗、低刺激、偏现实支持（适合高风险、低电量场景）
- L2 轻抽象模式：轻微自嘲、温和荒诞（默认模式）
- L3 高抽象模式：允许更明显的发疯文学与抽象嘴替（用户明确想发疯时）

### primary_block (核心阻力机制)
- fear_of_self_evaluation: 害怕被评价/失败
- low_energy: 能量耗尽/生理疲劳
- task_overwhelm: 任务太多/太复杂
- emotional_overload: 情绪过载/崩溃边缘
- unclear_next_step: 不知道下一步做什么
- avoidance_loop: 逃避循环/越拖越焦虑

### risk_level (风险等级)
- low: 正常情绪困扰
- medium: 有一定压力但可控
- high: 检测到自伤、严重抑郁等高危倾向

### action_window (行动时间窗口)
- 30s: 30秒内可完成的动作
- 3min: 3分钟内可完成的动作
- 10min: 10分钟内可完成的动作

### style_mode (风格模式 - 必须从以下5个枚举值中选择)
- 温和嘴替：适合需要被理解、被接纳的场景，语气柔软但有边界
- 体面发疯：适合想发泄但还要保持体面的场景，优雅地崩溃
- 高雅崩溃：适合情绪过载但不想太狼狈的场景，有格调地摆烂
- 荒诞自救：适合需要荒诞逻辑来破局的场景，用离谱但自洽的逻辑解套
- 低电量维稳：适合能量耗尽、只需要最低限度维持的场景，极简维稳

### style_hint (风格提示 - 可选)
用于前台展示的小标签，4-6字，可以比 style_mode 更有网感。
示例：赛博超度法则、薛定谔的努力、物理隔离防御、高雅摆烂战术、精神离职状态

### analysis_summary (分析总结)
一句内部总结，说明为何卡住，不超过24字。`;

function generateAnalyzerUserPrompt(input) {
  return `用户输入：${input}

请分析用户当前状态，返回 JSON 格式的战术板。`;
}

// 待测试的模型
const MODELS = [
  modelConfig.generationModel,
  'qwen3.5-flash',
  'qwen3.5-flash-2026-02-23',
];

// 测试配置
const TEST_CONFIG = {
  iterations: 5,           // 每个模型测试次数
  testInput: '最近工作压力好大，每天都想辞职但又不敢，感觉自己快崩溃了',  // 测试输入
  timeout: 30000,          // 超时时间 30 秒
};

// 创建 OpenAI 客户端
function createClient() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY 未设置，请在 .env.local 中配置');
  }

  return new OpenAI({
    apiKey,
    baseURL: modelConfig.dashscopeBaseUrl,
    timeout: TEST_CONFIG.timeout,
  });
}

// 测试单个模型的一次调用
async function testModelOnce(client, model, iteration) {
  const startTime = Date.now();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: ANALYZER_PROMPT },
        { role: 'user', content: generateAnalyzerUserPrompt(TEST_CONFIG.testInput) },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const latency = Date.now() - startTime;

    // 验证响应是否有效
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('响应内容为空');
    }

    // 尝试解析 JSON
    JSON.parse(content);

    return {
      model,
      iteration,
      latency,
      success: true,
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      model,
      iteration,
      latency,
      success: false,
      error: error.message || '未知错误',
    };
  }
}

// 计算统计数据
function calculateStats(results) {
  const latencies = results.filter(r => r.success).map(r => r.latency);

  if (latencies.length === 0) {
    return {
      avgLatency: 0,
      medianLatency: 0,
      minLatency: 0,
      maxLatency: 0,
      stdDev: 0,
      successRate: 0,
    };
  }

  // 平均值
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  // 中位数
  const sorted = [...latencies].sort((a, b) => a - b);
  const medianLatency = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // 最小/最大值
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);

  // 标准差
  const variance = latencies.reduce((sum, val) => sum + Math.pow(val - avgLatency, 2), 0) / latencies.length;
  const stdDev = Math.sqrt(variance);

  // 成功率
  const successRate = (results.filter(r => r.success).length / results.length) * 100;

  return {
    avgLatency,
    medianLatency,
    minLatency,
    maxLatency,
    stdDev,
    successRate,
  };
}

// 运行测试
async function runTests() {
  const client = createClient();
  const allStats = [];

  console.log('🚀 开始模型延迟测试...\n');
  console.log(`测试配置:`);
  console.log(`  - 测试输入: "${TEST_CONFIG.testInput}"`);
  console.log(`  - 每个模型测试次数: ${TEST_CONFIG.iterations}`);
  console.log(`  - 超时时间: ${TEST_CONFIG.timeout}ms\n`);

  for (const model of MODELS) {
    console.log(`\n📊 测试模型: ${model}`);
    console.log('-'.repeat(50));

    const results = [];

    for (let i = 1; i <= TEST_CONFIG.iterations; i++) {
      process.stdout.write(`  第 ${i}/${TEST_CONFIG.iterations} 次测试... `);

      const result = await testModelOnce(client, model, i);
      results.push(result);

      if (result.success) {
        console.log(`✅ ${result.latency}ms`);
      } else {
        console.log(`❌ 失败: ${result.error}`);
      }

      // 每次测试间隔 500ms，避免触发限流
      if (i < TEST_CONFIG.iterations) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const stats = calculateStats(results);
    allStats.push({
      model,
      results,
      ...stats,
    });
  }

  return allStats;
}

// 打印测试报告
function printReport(stats) {
  console.log('\n\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              模型延迟测试报告                            ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();

  // 按平均延迟排序
  const sortedStats = [...stats].sort((a, b) => a.avgLatency - b.avgLatency);

  for (const stat of sortedStats) {
    console.log(`\n📌 模型: ${stat.model}`);
    console.log('─'.repeat(50));
    console.log(`  平均延迟: ${stat.avgLatency.toFixed(2)} ms`);
    console.log(`  中位数延迟: ${stat.medianLatency.toFixed(2)} ms`);
    console.log(`  最小延迟: ${stat.minLatency.toFixed(2)} ms`);
    console.log(`  最大延迟: ${stat.maxLatency.toFixed(2)} ms`);
    console.log(`  标准差: ${stat.stdDev.toFixed(2)} ms`);
    console.log(`  成功率: ${stat.successRate.toFixed(1)}%`);

    // 显示失败详情
    const failures = stat.results.filter(r => !r.success);
    if (failures.length > 0) {
      console.log(`  ⚠️  失败次数: ${failures.length}`);
      failures.forEach(f => {
        console.log(`     - 第 ${f.iteration} 次: ${f.error}`);
      });
    }
  }

  console.log('\n\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                    测试结论                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const bestModel = sortedStats[0];
  console.log(`\n🏆 推荐模型: ${bestModel.model}`);
  console.log(`   平均延迟: ${bestModel.avgLatency.toFixed(2)} ms`);
  console.log(`   成功率: ${bestModel.successRate.toFixed(1)}%`);

  // 性能对比
  console.log('\n📈 性能对比 (相对于最快模型):');
  for (let i = 0; i < sortedStats.length; i++) {
    const stat = sortedStats[i];
    const ratio = stat.avgLatency / bestModel.avgLatency;
    const slower = ((ratio - 1) * 100).toFixed(1);
    console.log(`   ${i + 1}. ${stat.model}: ${stat.avgLatency.toFixed(2)}ms ${i === 0 ? '(最快)' : `(慢 ${slower}%)`}`);
  }

  console.log('\n');
}

// 主函数
async function main() {
  try {
    const stats = await runTests();
    printReport(stats);

    // 返回最佳模型名称（用于自动化脚本）
    const bestModel = stats.sort((a, b) => a.avgLatency - b.avgLatency)[0];
    console.log(`\n💡 建议更新模型配置为: "${bestModel.model}"`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
main();
