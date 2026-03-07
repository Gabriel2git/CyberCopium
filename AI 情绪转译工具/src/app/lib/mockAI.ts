// Mock AI response generator
export interface AIResponse {
  status: string;
  intensity: number;
  mouthpiece: string;
  sticker: string;
  absurdMotivation: string;
  microAction: string;
}

const statusTemplates = [
  { status: "社畜疲惫", intensity: 7, keywords: ["加班", "累", "疲", "班", "工作"] },
  { status: "学术焦虑", intensity: 8, keywords: ["论文", "考试", "学", "研究", "答辩"] },
  { status: "财务崩溃", intensity: 9, keywords: ["钱", "穷", "存款", "工资", "账单"] },
  { status: "情感迷茫", intensity: 6, keywords: ["分手", "喜欢", "恋爱", "感情", "孤独"] },
  { status: "存在危机", intensity: 8, keywords: ["意义", "迷茫", "不知道", "为什么", "价值"] },
];

const mouthpieceTemplates = [
  "宇宙热寂还有几十亿年，你这点破事连个量子涨落都算不上。",
  "平行宇宙里有无数个你已经躺平了，你现在站着就已经赢了。",
  "从信息熵的角度看，你的混乱程度还不如一杯洒了的奶茶。",
  "恭喜你！你正在经历的痛苦会在7个工作日后自动转化为段子素材。",
  "根据墨菲定律，最坏的情况已经发生了，接下来只会变好（可能）。",
  "你的大脑CPU占用率已达95%，建议重启。重启方式：睡一觉。",
  "在概率学上，你遇到的问题只是全人类痛苦的0.00001%样本。",
  "别慌，这只是你人生剧本的第二幕危机，第三幕会有转机（编剧保证）。"
];

const stickerTemplates = [
  "🫠", "💊", "🌀", "🎭", "🔮", "🌈", "⚡", "🎪", "🎲", "🌙", "✨", "🎯", "🎨", "🔥"
];

const motivationTemplates = [
  "因为只有足够荒诞的人生，才配得上写进赛博朋克小说。",
  "痛苦是宇宙送给你的成年礼，拒签可惜了。",
  "你不努力，怎么有资格吐槽这个世界？",
  "反正都要崩溃，不如崩得有仪式感一点。",
  "如果人生是场游戏，你现在正在打BOSS，死了可以重来。",
  "接受现实的第一步是：承认现实很扯淡。",
  "你的痛苦很独特，值得被记录成NFT（误）。",
  "宇宙给你发了张烂牌，但你可以选择怎么打出去。"
];

const actionTemplates = [
  "去便利店买一罐最贵的饮料，慢慢喝完。",
  "打开手机相册，删掉5张最丑的照片。",
  "给自己发一条长消息，内容是'你做得够好了'。",
  "站起来，原地蹦跳10次，让内啡肽骗一下大脑。",
  "打开笔记本，写下今天唯一做对的一件事。",
  "去阳台/窗边，对着天空深呼吸3次。",
  "给一个很久没联系的朋友发个表情包。",
  "换一首从来没听过的歌，循环播放。",
  "洗个澡，换身干净衣服，假装重启人生。",
  "点一份外卖，选你平时舍不得点的那个。"
];

export function generateMockResponse(input: string): AIResponse {
  // Simple keyword matching for status
  let matchedStatus = statusTemplates[0];
  let maxMatches = 0;
  
  for (const template of statusTemplates) {
    const matches = template.keywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedStatus = template;
    }
  }

  // Add some randomness if no matches
  if (maxMatches === 0) {
    matchedStatus = statusTemplates[Math.floor(Math.random() * statusTemplates.length)];
  }

  // Calculate intensity based on input length and punctuation
  const baseIntensity = matchedStatus.intensity;
  const punctuationCount = (input.match(/[!！。.…]/g) || []).length;
  const intensity = Math.min(10, baseIntensity + Math.floor(punctuationCount / 2));

  return {
    status: matchedStatus.status,
    intensity,
    mouthpiece: mouthpieceTemplates[Math.floor(Math.random() * mouthpieceTemplates.length)],
    sticker: stickerTemplates[Math.floor(Math.random() * stickerTemplates.length)],
    absurdMotivation: motivationTemplates[Math.floor(Math.random() * motivationTemplates.length)],
    microAction: actionTemplates[Math.floor(Math.random() * actionTemplates.length)]
  };
}
