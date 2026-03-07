interface FeedbackSectionProps {
  onLiked: () => void;
  onRegenerate: () => void;
  onActionTaken: () => void;
}

export default function FeedbackSection({ onLiked, onRegenerate, onActionTaken }: FeedbackSectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pt-8">
      <p className="text-center text-gray-700 mb-6 font-body text-xl">
        这口氧气对你有用吗？
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={onLiked}
          className="px-8 py-3 bg-white text-green-600 font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          👍 命中了
        </button>
        <button
          onClick={onRegenerate}
          className="px-8 py-3 bg-white text-blue-600 font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          🔄 再来一口
        </button>
        <button
          onClick={onActionTaken}
          className="px-8 py-3 bg-black text-white font-handwriting font-bold text-lg border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          🚀 开始行动
        </button>
      </div>
    </div>
  );
}
