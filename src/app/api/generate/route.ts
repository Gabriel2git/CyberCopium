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
import {
  AnalysisResult,
  GenerateApiResponse,
  GenerateErrorCode,
  GenerationResult,
} from '@/types';
import {
  DASHSCOPE_BASE_URL,
  GENERATION_MODEL,
  PROMPT_VERSION,
} from '@/config/model';

// 配置阿里云百炼客户端
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: DASHSCOPE_BASE_URL,
  timeout: 15000, // 15 秒超时（两次调用）
});

// 简单的服务端埋点函数
const captureServerEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // 这里可以接入服务端埋点系统，如 PostHog 服务端 SDK
  // 目前先打印到控制台，后续可以接入正式埋点系统
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Server Event] ${eventName}`, properties);
  }
};

const ANALYSIS_REQUIRED_FIELDS = [
  'scene',
  'status_tag',
  'tone_level',
  'primary_block',
  'risk_level',
  'action_window',
  'style_mode',
  'analysis_summary',
] as const;

const RESULT_REQUIRED_FIELDS = [
  'status_label',
  'voice_line',
  'sticker_text',
  'absurd_motivation',
  'micro_action',
  'tone_level',
  'status_tag',
] as const;

const createResponse = (payload: GenerateApiResponse, status = 200) => {
  return NextResponse.json(payload, { status });
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const hasRequiredFields = <T extends readonly string[]>(
  value: unknown,
  fields: T
): value is Record<T[number], unknown> => {
  return isObjectRecord(value) && fields.every((field) => field in value);
};

const getFallbackResult = (analysis: AnalysisResult): GenerationResult => {
  return analysis.risk_level === 'high'
    ? HIGH_RISK_FALLBACK_RESULT
    : FALLBACK_RESULT;
};

const getErrorCodeFromException = (error: unknown): GenerateErrorCode => {
  if (
    isObjectRecord(error) &&
    ((error.code === 'ECONNABORTED') ||
      (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout')))
  ) {
    return 'TIMEOUT';
  }

  return 'UNKNOWN_ERROR';
};

const renderComposerPrompt = (analysis: AnalysisResult) => {
  const variables: Record<string, string> = {
    style_mode: analysis.style_mode,
    tone_level: analysis.tone_level,
    action_window: analysis.action_window,
    status_tag: analysis.status_tag,
    risk_level: analysis.risk_level,
  };

  return Object.entries(variables).reduce((prompt, [key, value]) => {
    return prompt.replaceAll(`{${key}}`, value);
  }, COMPOSER_PROMPT);
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let analysis: AnalysisResult = FALLBACK_ANALYSIS;
  let analyzerFallbackUsed = false;

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return createResponse(
        {
          ok: false,
          code: 'INVALID_INPUT',
          error: '请求体格式错误，请输入文本内容',
        },
        400
      );
    }

    const input = isObjectRecord(body) ? body.input : undefined;
    const normalizedInput = typeof input === 'string' ? input.trim() : '';

    if (!normalizedInput) {
      return createResponse(
        {
          ok: false,
          code: 'INVALID_INPUT',
          error: '请输入有效内容',
        },
        400
      );
    }

    if (normalizedInput.length > 200) {
      return createResponse(
        {
          ok: false,
          code: 'INVALID_INPUT',
          error: '输入内容过长，请控制在 200 字以内',
        },
        400
      );
    }

    if (!process.env.DASHSCOPE_API_KEY) {
      return createResponse(
        {
          ok: false,
          code: 'CONFIG_MISSING',
          error: '生成服务暂不可用',
          warning: '系统已切换为备用内容',
          result: FALLBACK_RESULT,
          analysis: FALLBACK_ANALYSIS,
        },
        503
      );
    }

    // ========== 第一层：Generation Control Layer (Analyzer) ==========
    try {
      const analysisCompletion = await client.chat.completions.create({
        model: GENERATION_MODEL,
        messages: [
          { role: 'system', content: ANALYZER_PROMPT },
          { role: 'user', content: generateAnalyzerUserPrompt(normalizedInput) },
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const analysisContent = analysisCompletion.choices[0]?.message?.content;

      if (!analysisContent) {
        throw new Error('Analyzer 未返回内容');
      }

      const parsedAnalysis = JSON.parse(analysisContent);

      if (!hasRequiredFields(parsedAnalysis, ANALYSIS_REQUIRED_FIELDS)) {
        throw new Error('Analyzer 返回字段不完整');
      }

      analysis = parsedAnalysis as AnalysisResult;

      const originalToneLevel = analysis.tone_level;
      if (analysis.risk_level === 'high' && analysis.tone_level !== 'L1') {
        analysis.tone_level = 'L1';
        captureServerEvent('safety_downgrade_triggered', {
          original_tone_level: originalToneLevel,
          final_tone_level: 'L1',
          risk_level: analysis.risk_level,
          trigger_reason: 'high_risk_content_detected',
        });
      }
    } catch (analysisError: any) {
      analyzerFallbackUsed = true;
      analysis = FALLBACK_ANALYSIS;

      const errorType = analysisError?.code === 'invalid_api_key' ? 'invalid_api_key' : 'analyzer_failed';
      const errorMessage = analysisError?.code === 'invalid_api_key' ? 'API密钥无效，请检查配置' : '分析器失败';

      captureServerEvent('generate_error', {
        error_type: errorType,
        latency_ms: Date.now() - startTime,
        prompt_version: PROMPT_VERSION,
        model_name: GENERATION_MODEL,
        fallback_used: true,
      });

      if (process.env.NODE_ENV === 'development') {
        console.error('Analyzer 失败:', analysisError);
      }
    }

    // ========== 第二层：Presentation Layer (Composer) ==========
    try {
      const composerCompletion = await client.chat.completions.create({
        model: GENERATION_MODEL,
        messages: [
          {
            role: 'system',
            content: renderComposerPrompt(analysis),
          },
          { role: 'user', content: generateComposerUserPrompt(normalizedInput, analysis) },
        ],
        temperature: 0.9,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const composerContent = composerCompletion.choices[0]?.message?.content;

      if (!composerContent) {
        throw new Error('Composer 未返回内容');
      }

      const parsedResult = JSON.parse(composerContent);

      if (!hasRequiredFields(parsedResult, RESULT_REQUIRED_FIELDS)) {
        throw new Error('Composer 返回字段不完整');
      }

      const result = parsedResult as GenerationResult;
      result.tone_level = analysis.tone_level;
      result.status_tag = analysis.status_tag;

      captureServerEvent('generate_success', {
        latency_ms: Date.now() - startTime,
        model_name: GENERATION_MODEL,
        prompt_version: PROMPT_VERSION,
        scene: analysis.scene,
        status_tag: analysis.status_tag,
        tone_level: analysis.tone_level,
        primary_block: analysis.primary_block,
        style_mode: analysis.style_mode,
        risk_level: analysis.risk_level,
        action_window: analysis.action_window,
      });

      const warning = analyzerFallbackUsed
        ? '分析器异常，已使用备用策略生成结果'
        : undefined;

      return createResponse({
        ok: true,
        code: 'SUCCESS',
        result,
        analysis,
        warning,
      });
    } catch (composerError: any) {
      const fallbackResult = getFallbackResult(analysis);
      const errorType = composerError?.code === 'invalid_api_key' ? 'invalid_api_key' : 'composer_failed';
      const errorMessage = composerError?.code === 'invalid_api_key' ? 'API密钥无效，请检查配置' : '生成阶段失败';

      captureServerEvent('generate_error', {
        error_type: errorType,
        latency_ms: Date.now() - startTime,
        prompt_version: PROMPT_VERSION,
        model_name: GENERATION_MODEL,
        fallback_used: true,
      });

      if (process.env.NODE_ENV === 'development') {
        console.error('Composer 失败:', composerError);
      }

      return createResponse(
        {
          ok: false,
          code: composerError?.code === 'invalid_api_key' ? 'INVALID_API_KEY' : 'COMPOSER_FAILED',
          error: errorMessage,
          warning: '已切换为备用内容',
          result: fallbackResult,
          analysis,
        },
        502
      );
    }
  } catch (error) {
    const code = getErrorCodeFromException(error);
    const isTimeout = code === 'TIMEOUT';
    const status = isTimeout ? 504 : 500;

    captureServerEvent('generate_error', {
      error_type: isTimeout ? 'timeout' : 'unknown',
      latency_ms: Date.now() - startTime,
      prompt_version: PROMPT_VERSION,
      model_name: GENERATION_MODEL,
      fallback_used: true,
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('生成失败:', error);
    }

    return createResponse(
      {
        ok: false,
        code,
        error: isTimeout ? '生成超时，请稍后重试' : '生成失败，请稍后重试',
        warning: '已切换为备用内容',
        result: getFallbackResult(analysis),
        analysis,
      },
      status
    );
  }
}
