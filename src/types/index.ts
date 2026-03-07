// 五件套数据结构定义
export interface GenerationResult {
  status_label: string;      // 状态命名 (≤20 字)
  voice_line: string;        // 抽象嘴替 (≤50 字)
  sticker_text: string;      // 贴纸文案 (≤30 字)
  absurd_motivation: string; // 荒诞动机 (≤40 字)
  micro_action: string;      // 最小行动 (≤30 字)
  tone_level: 'L1' | 'L2' | 'L3'; // 语气强度
}

// 状态标签类型
export type StatusTag = 
  | '拖延/回避'
  | '羞耻/自我否定'
  | '疲惫/低启动'
  | '轻度发疯/情绪过载'
  | '想做但卡住';

// 用户反馈类型
export interface UserFeedback {
  liked: boolean | null;         // 像不像我想说的
  helpful: boolean | null;       // 有没有帮我动起来
  regenerated: boolean;          // 是否重新生成
  actionTaken: boolean;          // 是否去做了
}
