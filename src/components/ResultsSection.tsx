import { GenerationResult } from '@/types';

interface ResultCardProps {
  title: string;
  content: string;
  icon: string;
  rotate?: string;
}

export default function ResultCard({ title, content, icon, rotate = 'rotate(-0.3deg)' }: ResultCardProps) {
  return (
    <div 
      className="bg-white border-2 border-black rounded-none p-6 shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative"
      style={{ transform: rotate }}
    >
      {/* 手绘装饰角标 */}
      <div className="absolute -top-2 -right-2 text-xl opacity-30" style={{ transform: 'rotate(15deg)' }}>✦</div>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-title font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-700 leading-relaxed font-body text-lg">{content}</p>
    </div>
  );
}

interface ResultsSectionProps {
  result: GenerationResult;
}

export function ResultsSection({ result }: ResultsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <ResultCard
        title="状态命名"
        content={result.status_label}
        icon="🏷️"
        rotate="rotate(-0.5deg)"
      />
      <ResultCard
        title="抽象嘴替"
        content={result.voice_line}
        icon="👄"
        rotate="rotate(0.3deg)"
      />
      <ResultCard
        title="荒诞动机"
        content={result.absurd_motivation}
        icon="🎭"
        rotate="rotate(-0.2deg)"
      />
      <ResultCard
        title="最小行动"
        content={result.micro_action}
        icon="⚡"
        rotate="rotate(0.4deg)"
      />
    </div>
  );
}
