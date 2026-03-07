'use client';

import { useState } from 'react';

interface InputSectionProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

const EXAMPLES = [
  "我又不想投简历了",
  "今天一天都没学进去",
  "我现在只想发疯",
];

export default function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 relative">
      {/* 手绘装饰 */}
      <div className="absolute -top-3 -right-3 text-2xl rotate-12 opacity-40">✎</div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="说说你的困境吧...（比如：又加班到凌晨了 / 论文被拒了 / 存款清零了）"
            className="w-full px-6 py-4 text-lg border-2 border-black rounded-none shadow-hard focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none resize-none bg-white text-gray-900 transition-all font-body text-xl min-h-[140px] card-rotate-slight"
            rows={3}
            maxLength={200}
            disabled={isLoading}
            style={{ transform: 'rotate(-0.5deg)' }}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-600 font-body">
            {input.length}/200
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full sm:w-auto px-12 py-4 bg-black text-white font-title font-bold text-xl border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? '正在生成赛博氧气...' : '✨ 吸一口纯度 100% 的赛博盲目乐观 →'}
            </span>
          </button>

          <div className="flex flex-wrap gap-3 justify-center items-center">
            <span className="text-lg text-gray-600 font-body font-bold py-1">
              试试这些：
            </span>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="text-lg px-6 py-3 bg-white text-gray-700 font-body font-bold border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
