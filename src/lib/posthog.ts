import posthog from 'posthog-js';
import { GENERATION_MODEL, PROMPT_VERSION } from '@/config/model';

// PostHog 配置
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const ENABLE_REPLAY = process.env.NEXT_PUBLIC_POSTHOG_ENABLE_REPLAY === 'true';

// 初始化 PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-01-30',
      // 默认只在识别用户后创建画像，减少匿名隐私负担
      person_profiles: 'identified_only',
      // 启用 Session Replay 录制用户会话
      disable_session_recording: !ENABLE_REPLAY,
      session_recording: {
        maskAllInputs: true,   // 默认屏蔽输入框内容
        maskInputOptions: {
          password: true,      // 但密码仍然屏蔽
        },
      },
      // 开发环境启用调试模式
      debug: process.env.NODE_ENV === 'development',
      loaded: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ PostHog 初始化成功');
        }
      },
      capture_pageview: false, // 我们手动捕获
    });
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ PostHog 未初始化', {
        hasKey: !!POSTHOG_KEY,
        hasHost: !!POSTHOG_HOST,
      });
    }
  }
};

// 获取 PostHog 实例
export const getPostHog = () => posthog;

// 通用事件捕获函数
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 准备发送事件:', eventName);
    }
    posthog.capture(eventName, properties);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ 事件已发送:', eventName);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ PostHog 未就绪，无法发送事件:', eventName);
    }
  }
};

// ========== 页面与输入事件 ==========

export const capturePageView = (properties?: Record<string, any>) => {
  captureEvent('page_view', {
    session_id: posthog.get_session_id?.(),
    device_type: getDeviceType(),
    build_version: process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
    ...properties,
  });
};

export const captureSamplePromptClick = (sampleText: string, sampleType?: string) => {
  captureEvent('sample_prompt_click', {
    sample_length: sampleText.length,
    sample_type: sampleType || 'default',
  });
};

export const captureGenerateSubmit = (inputLength: number, inputSource: 'manual' | 'sample') => {
  captureEvent('generate_submit', {
    input_length: inputLength,
    input_source: inputSource,
    build_version: process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
  });
};

// ========== 生成链路事件 ==========

export const captureGenerateSuccess = (analysis: {
  scene: string;
  status_tag: string;
  tone_level: string;
  style_mode: string;
  risk_level: string;
  primary_block: string;
  action_window: string;
}, latencyMs: number) => {
  captureEvent('generate_success', {
    latency_ms: latencyMs,
    model_name: GENERATION_MODEL,
    prompt_version: PROMPT_VERSION,
    scene: analysis.scene,
    status_tag: analysis.status_tag,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
    risk_level: analysis.risk_level,
    primary_block: analysis.primary_block,
    action_window: analysis.action_window,
  });
};

export const captureGenerateError = (errorType: string, latencyMs: number) => {
  captureEvent('generate_error', {
    error_type: errorType,
    latency_ms: latencyMs,
    prompt_version: PROMPT_VERSION,
    model_name: GENERATION_MODEL,
    fallback_used: true,
  });
};

// ========== 结果消费事件 ==========

export const captureResultImpression = (analysis: {
  scene: string;
  status_tag: string;
  tone_level: string;
  style_mode: string;
  risk_level: string;
}) => {
  captureEvent('result_impression', {
    scene: analysis.scene,
    status_tag: analysis.status_tag,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
    risk_level: analysis.risk_level,
  });
};

export const captureRegenerateClick = (previousAnalysis: {
  scene: string;
  status_tag: string;
  tone_level: string;
  style_mode: string;
}) => {
  captureEvent('regenerate_click', {
    previous_scene: previousAnalysis.scene,
    previous_status_tag: previousAnalysis.status_tag,
    previous_tone_level: previousAnalysis.tone_level,
    previous_style_mode: previousAnalysis.style_mode,
  });
};

// ========== 反馈与行动事件 ==========

export const captureFeedbackUnderstood = (analysis: {
  scene: string;
  status_tag: string;
  tone_level: string;
  style_mode: string;
}) => {
  captureEvent('feedback_understood', {
    scene: analysis.scene,
    status_tag: analysis.status_tag,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
  });
};

export const captureFeedbackHelpful = (analysis: {
  scene: string;
  tone_level: string;
  style_mode: string;
  action_window: string;
}) => {
  captureEvent('feedback_helpful', {
    scene: analysis.scene,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
    action_window: analysis.action_window,
  });
};

export const captureStickerSaveClick = (stickerText: string, analysis: {
  scene: string;
  tone_level: string;
  style_mode: string;
}) => {
  captureEvent('sticker_save_click', {
    sticker_text_length: stickerText.length,
    scene: analysis.scene,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
  });
};

export const captureMicroActionClick = (analysis: {
  scene: string;
  status_tag: string;
  primary_block: string;
  tone_level: string;
  action_window: string;
}) => {
  captureEvent('micro_action_click', {
    scene: analysis.scene,
    status_tag: analysis.status_tag,
    primary_block: analysis.primary_block,
    tone_level: analysis.tone_level,
    action_window: analysis.action_window,
  });
};

export const captureMicroActionDone = (analysis: {
  scene: string;
  tone_level: string;
  style_mode: string;
  action_window: string;
}) => {
  captureEvent('micro_action_done', {
    scene: analysis.scene,
    tone_level: analysis.tone_level,
    style_mode: analysis.style_mode,
    action_window: analysis.action_window,
  });
};

// ========== 辅助函数 ==========

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
