/**
 * AI 生成链路完整性测试脚本
 * 验证 /api/generate 是否返回完整的五件套输出
 */

const testCases = [
  {
    name: '求职拖延场景',
    input: '我又不想投简历了',
  },
  {
    name: '学习摆住场景',
    input: '今天一天都没学进去',
  },
  {
    name: '轻度发疯场景',
    input: '我现在只想发疯',
  },
];

const requiredFields = [
  'status_label',      // 状态命名
  'voice_line',        // 抽象嘴替
  'sticker_text',      // 贴纸文案
  'absurd_motivation', // 荒诞动机
  'micro_action',      // 最小行动
  'tone_level',        // 语气强度
];

async function testGeneration() {
  console.log('🧪 开始 AI 生成链路完整性测试\n');
  console.log('需要验证的字段:', requiredFields.join(', '));
  console.log('='.repeat(60));

  for (const testCase of testCases) {
    console.log(`\n测试用例：${testCase.name}`);
    console.log(`输入："${testCase.input}"`);
    console.log('-'.repeat(60));

    try {
      const response = await fetch('http://localhost:3002/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: testCase.input }),
      });

      const data = await response.json();

      if (data.error) {
        console.log('❌ 错误:', data.error);
        if (data.result) {
          console.log('⚠️  返回了 fallback 数据');
          console.log('Fallback 结果:', JSON.stringify(data.result, null, 2));
        }
        continue;
      }

      if (!data.result) {
        console.log('❌ 未返回 result 字段');
        continue;
      }

      const result = data.result;
      
      // 验证必填字段
      const missingFields = requiredFields.filter(field => !result[field]);
      
      if (missingFields.length > 0) {
        console.log('❌ 字段不完整！缺失:', missingFields.join(', '));
      } else {
        console.log('✅ 所有必填字段都存在');
      }

      // 显示结果
      console.log('\n生成结果:');
      console.log(`  状态命名：${result.status_label}`);
      console.log(`  抽象嘴替：${result.voice_line}`);
      console.log(`  贴纸文案：${result.sticker_text} (${result.sticker_text.length}字符)`);
      console.log(`  荒诞动机：${result.absurd_motivation}`);
      console.log(`  最小行动：${result.micro_action}`);
      console.log(`  语气强度：${result.tone_level}`);

      // 验证贴纸文案长度
      if (result.sticker_text && result.sticker_text.length > 15) {
        console.log(`⚠️  警告：贴纸文案超过 15 个汉字 (${result.sticker_text.length}字符)`);
      } else {
        console.log('✅ 贴纸文案长度符合要求 (≤15 字符)');
      }

    } catch (error) {
      console.log('❌ 请求失败:', error.message);
    }

    console.log('='.repeat(60));
  }

  console.log('\n测试完成！');
}

// 执行测试
testGeneration().catch(console.error);
