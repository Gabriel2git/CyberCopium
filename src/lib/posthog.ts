import posthog from 'posthog-js';

// PostHog 配置
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// 初始化 PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      // 禁用 Session Replay 以避免被广告拦截器阻止
      disable_session_recording: true,
      // 开发环境启用调试模式
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        console.log('✅ PostHog 初始化成功', {
          key: POSTHOG_KEY,
          host: POSTHOG_HOST,
        });
      },
      capture_pageview: false, // 我们手动捕获
    });
  } else {
    console.warn('⚠️ PostHog 未初始化', { 
      hasKey: !!POSTHOG_KEY, 
      hasHost: !!POSTHOG_HOST,
      host: POSTHOG_HOST 
    });
  }
};

// 获取 PostHog 实例
export const getPostHog = () => posthog;

// 通用事件捕获函数
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    console.log('📤 准备发送事件:', eventName, properties);
    posthog.capture(eventName, properties);
    console.log('✅ 事件已发送:', eventName);
  } else {
    console.warn('⚠️ PostHog 未就绪，无法发送事件:', eventName);
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
    sample_text: sampleText,
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
