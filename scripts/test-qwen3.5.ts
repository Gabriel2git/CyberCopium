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

// 只测试 qwen3.5-flash
const MODELS = ['qwen3.5-flash'];

// 30 秒超时
const TIMEOUT = 30000;

// 测试输入
const TEST_INPUTS = [
  { name: '职场压力', text: '最近工作压力好大，每天都想辞职但又不敢，感觉自己快崩溃了' },
  { name: '学业拖延', text: '明天要交论文了，但我一直拖延，完全不想动怎么办' },
];

const ITERATIONS = 2;

function createClient() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('DASHSCOPE_API_KEY 未设置');
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
    return { success: true, latency, content: parsed };
  } catch (error) {
    const latency = Date.now() - startTime;
    return { success: false, latency, error: error.message };
  }
}

async function main() {
  const client = createClient();
  console.log(`🚀 测试 qwen3.5-flash，超时时间: ${TIMEOUT}ms\n`);
  
  for (const inputObj of TEST_INPUTS) {
    console.log(`输入: ${inputObj.name}`);
    for (let i = 1; i <= ITERATIONS; i++) {
      process.stdout.write(`  第 ${i}/${ITERATIONS} 次... `);
      const result = await testModelOnce(client, 'qwen3.5-flash', inputObj.text);
      if (result.success) {
        console.log(`✅ ${result.latency}ms`);
        console.log(`   输出: ${JSON.stringify(result.content).substring(0, 100)}...`);
      } else {
        console.log(`❌ ${result.error}`);
      }
      await new Promise(r => setTimeout(r, 500));
    }
    console.log();
  }
  
  console.log('测试完成！');
}

main();
