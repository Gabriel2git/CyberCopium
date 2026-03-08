import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  ANALYZER_PROMPT,
  COMPOSER_PROMPT,
  generateAnalyzerUserPrompt,
  generateComposerUserPrompt,
  FALLBACK_ANALYSIS,
  FALLBACK_RESULT,
  HIGH_RISK_FALLBACK_RESULT,
} from '@/lib/prompt';
import { AnalysisResult, GenerationResult } from '@/types';

// 配置阿里云百炼客户端
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  timeout: 15000, // 15 秒超时（两次调用）
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

    // ========== 第一层：Generation Control Layer (Analyzer) ==========
    let analysis: AnalysisResult;
    
    try {
      const analysisCompletion = await client.chat.completions.create({
        model: 'qwen-flash',
        messages: [
          { role: 'system', content: ANALYZER_PROMPT },
          { role: 'user', content: generateAnalyzerUserPrompt(input) },
        ],
        temperature: 0.3, // 低温度，更稳定的分析
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const analysisContent = analysisCompletion.choices[0]?.message?.content;
      
      if (!analysisContent) {
        throw new Error('Analyzer 未返回内容');
      }

      analysis = JSON.parse(analysisContent) as AnalysisResult;

      // 验证必要字段
      if (!analysis.scene || !analysis.status_tag || !analysis.tone_level ||
          !analysis.primary_block || !analysis.risk_level || !analysis.action_window ||
          !analysis.style_mode || !analysis.analysis_summary) {
        throw new Error('Analyzer 返回字段不完整');
      }

      // 风控：高风险强制降级为 L1
      if (analysis.risk_level === 'high' && analysis.tone_level !== 'L1') {
        console.log('检测到高风险内容，强制降级为 L1');
        analysis.tone_level = 'L1';
      }

    } catch (analysisError: any) {
      console.error('Analyzer 失败:', analysisError);
      // Analyzer 失败时使用 fallback 分析
      analysis = FALLBACK_ANALYSIS;
    }

    // ========== 第二层：Presentation Layer (Composer) ==========
    try {
      const composerCompletion = await client.chat.completions.create({
        model: 'qwen-flash',
        messages: [
          { 
            role: 'system', 
            content: COMPOSER_PROMPT
              .replace('{style_mode}', analysis.style_mode)
              .replace('{tone_level}', analysis.tone_level)
              .replace('{action_window}', analysis.action_window)
              .replace('{tone_level}', analysis.tone_level)
              .replace('{status_tag}', analysis.status_tag)
          },
          { role: 'user', content: generateComposerUserPrompt(input, analysis) },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const composerContent = composerCompletion.choices[0]?.message?.content;
      
      if (!composerContent) {
        throw new Error('Composer 未返回内容');
      }

      const result = JSON.parse(composerContent) as GenerationResult;

      // 验证必要字段
      if (!result.status_label || !result.voice_line || !result.sticker_text || 
          !result.absurd_motivation || !result.micro_action || !result.tone_level || !result.status_tag) {
        throw new Error('Composer 返回字段不完整');
      }

      // 确保透传字段正确
      result.tone_level = analysis.tone_level;
      result.status_tag = analysis.status_tag;

      return NextResponse.json({
        result,
        analysis, // 可选：返回战术板供调试
      });

    } catch (composerError: any) {
      console.error('Composer 失败:', composerError);
      
      // Composer 失败时，高危场景使用专用 fallback
      const fallbackResult = analysis.risk_level === 'high' 
        ? HIGH_RISK_FALLBACK_RESULT 
        : FALLBACK_RESULT;
      
      return NextResponse.json({
        result: fallbackResult,
        analysis,
        warning: '生成失败，已切换至备用方案',
      });
    }

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
    
    // 返回 fallback 数据
    return NextResponse.json({ 
      result: FALLBACK_RESULT,
      warning: '生成失败，已切换至备用方案'
    });
  }
}
