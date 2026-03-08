'use client';

import { AnalysisResult } from '@/types';
import { captureFeedbackUnderstood, captureFeedbackHelpful, captureMicroActionClick, captureMicroActionDone } from '@/lib/posthog';
import { useState } from 'react';

interface FeedbackSectionProps {
  onLiked: () => void;
  onRegenerate: () => void;
  onActionTaken: () => void;
  analysis: AnalysisResult;
}

export default function FeedbackSection({ onLiked, onRegenerate, onActionTaken, analysis }: FeedbackSectionProps) {
  const [actionClicked, setActionClicked] = useState(false);

  const handleLiked = () => {
    // 埋点：像我想说的
    captureFeedbackUnderstood(analysis);
    onLiked();
  };

  const handleActionClick = () => {
    // 埋点：点击最小行动
    captureMicroActionClick(analysis);
    setActionClicked(true);
    onActionTaken();
  };

  const handleActionDone = () => {
    // 埋点：完成最小行动
    captureMicroActionDone(analysis);
    alert('太棒了！你已经迈出了第一步！🎉');
  };

  const handleHelpful = () => {
    // 埋点：有帮我动起来
    captureFeedbackHelpful(analysis);
    alert('很高兴这口氧气对你有帮助！💙');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pt-8">
      <p className="text-center text-gray-700 mb-6 font-body text-xl">
        这口氧气对你有用吗？
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleLiked}
          className="px-8 py-3 bg-white text-green-600 font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          👍 像我想说的
        </button>
        <button
          onClick={onRegenerate}
          className="px-8 py-3 bg-white text-blue-600 font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          ⟳ 换个味道
        </button>
        <button
          onClick={handleHelpful}
          className="px-8 py-3 bg-white text-purple-600 font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          ✨ 有帮我动起来
        </button>
      </div>

      {/* 最小行动区域 */}
      <div className="mt-8 pt-6 border-t-2 border-black/10">
        <p className="text-center text-gray-600 mb-4 font-body">
          准备好开始行动了吗？
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {!actionClicked ? (
            <button
              onClick={handleActionClick}
              className="px-8 py-3 bg-black text-white font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              🚀 点击开始行动
            </button>
          ) : (
            <button
              onClick={handleActionDone}
              className="px-8 py-3 bg-green-600 text-white font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              ✅ 我已完成
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
