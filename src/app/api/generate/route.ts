import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT, generateUserPrompt, FALLBACK_RESULT } from '@/lib/prompt';
import { GenerationResult } from '@/types';

// 配置阿里云百炼客户端
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  timeout: 10000, // 10 秒超时
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: '请输入有效内容' },
        { status: 400 }
      );
    }

    if (!process.env.DASHSCOPE_API_KEY) {
      console.warn('DASHSCOPE_API_KEY 未配置，使用 fallback 数据');
      return NextResponse.json({ result: FALLBACK_RESULT });
    }

    const completion = await client.chat.completions.create({
      model: 'qwen-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: generateUserPrompt(input) },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('AI 未返回内容');
    }

    const result = JSON.parse(content) as GenerationResult;

    // 验证必要字段
    if (!result.status_label || !result.voice_line || !result.sticker_text || 
        !result.absurd_motivation || !result.micro_action || !result.tone_level) {
      throw new Error('AI 返回字段不完整');
    }

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('生成失败:', error);
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return NextResponse.json({ 
        error: '生成超时，请稍后重试',
        code: 'TIMEOUT',
        result: FALLBACK_RESULT
      });
    }
    
    // 返回 fallback 数据而不是直接报错
    return NextResponse.json({ 
      result: FALLBACK_RESULT,
      warning: '生成失败，已切换至备用方案'
    });
  }
}
