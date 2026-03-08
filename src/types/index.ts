// 场景类型
export type Scene = 
  | 'job_search'
  | 'study'
  | 'work'
  | 'relationship'
  | 'daily_life';

// 核心阻力机制
export type PrimaryBlock =
  | 'fear_of_self_evaluation'
  | 'low_energy'
  | 'task_overwhelm'
  | 'emotional_overload'
  | 'unclear_next_step'
  | 'avoidance_loop';

// 风险等级
export type RiskLevel = 'low' | 'medium' | 'high';

// 行动时间窗口
export type ActionWindow = '30s' | '3min' | '10min';

// 风格模式枚举（固定值，用于控制和埋点分析）
export type StyleMode =
  | '温和嘴替'
  | '体面发疯'
  | '高雅崩溃'
  | '荒诞自救'
  | '低电量维稳';

// 第一层：Analyzer 输出的战术板
export interface AnalysisResult {
  scene: Scene;
  status_tag: StatusTag;
  tone_level: 'L1' | 'L2' | 'L3';
  primary_block: PrimaryBlock;
  risk_level: RiskLevel;
  action_window: ActionWindow;
  style_mode: StyleMode; // 固定枚举值，用于控制生成
  style_hint?: string;   // 可选，用于前台展示的小标签
  analysis_summary: string; // 不超过24字
}

// 状态标签类型
export type StatusTag = 
  | '拖延/回避'
  | '羞耻/自我否定'
  | '疲惫/低启动'
  | '轻度发疯/情绪过载'
  | '想做但卡住';

// 第二层：Composer 输出的五件套
export interface GenerationResult {
  status_label: string;      // 状态命名 (≤20 字)
  voice_line: string;        // 抽象嘴替 (≤50 字)
  sticker_text: string;      // 贴纸文案 (≤15 字)
  absurd_motivation: string; // 荒诞动机 (≤40 字)
  micro_action: string;      // 最小行动 (≤30 字)
  tone_level: 'L1' | 'L2' | 'L3'; // 语气强度（透传）
  status_tag: StatusTag;     // 状态标签（透传）
}

// 用户反馈类型
export interface UserFeedback {
  liked: boolean | null;         // 像不像我想说的
  helpful: boolean | null;       // 有没有帮我动起来
  regenerated: boolean;          // 是否重新生成
  actionTaken: boolean;          // 是否去做了
}
