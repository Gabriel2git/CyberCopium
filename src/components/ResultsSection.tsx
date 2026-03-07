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

interface ActionCardProps {
  content: string;
}

function ActionCard({ content }: ActionCardProps) {
  return (
    <div 
      className="bg-black border-2 border-black rounded-none p-6 shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative cursor-pointer group"
      style={{ transform: 'rotate(0.4deg)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/80 text-sm">☆</span>
        <h3 className="text-sm font-title font-bold text-white/80">最小行动 ↓</h3>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-white leading-relaxed font-body text-lg flex-1">{content}</p>
        <span className="text-white text-2xl ml-4 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  );
}

interface ResultsSectionProps {
  result: GenerationResult;
}

export function ResultsSection({ result }: ResultsSectionProps) {
  return (
    <div className="flex flex-col gap-4 mb-8 w-full max-w-[40%] mx-auto">
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
      <ActionCard
        content={result.micro_action}
      />
    </div>
  );
}
