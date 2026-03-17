'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import { ResultsSection } from '@/components/ResultsSection';
import StickerCard from '@/components/StickerCard';
import FeedbackSection from '@/components/FeedbackSection';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import SketchBackground from '@/components/SketchBackground';
import { GenerationResult, AnalysisResult, GenerateApiResponse } from '@/types';
import { captureResultImpression, captureRegenerateClick, captureGenerateSuccess, captureGenerateError } from '@/lib/posthog';

const DEFAULT_ANALYSIS: AnalysisResult = {
  scene: 'daily_life',
  status_tag: '疲惫/低启动',
  tone_level: 'L1',
  primary_block: 'low_energy',
  risk_level: 'low',
  action_window: '3min',
  style_mode: '低电量维稳',
  style_hint: '备用模式',
  analysis_summary: '系统使用了备用分析策略',
};

export default function ResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const applyApiPayload = (
    payload: GenerateApiResponse,
    latencyMs: number,
    treatAsInitialLoad = false
  ) => {
    const resolvedResult = payload.result;
    const resolvedAnalysis = payload.analysis ?? DEFAULT_ANALYSIS;

    if (!resolvedResult) {
      throw new Error(payload.error || '生成失败');
    }

    setResult(resolvedResult);
    setAnalysis(resolvedAnalysis);
    setWarning(payload.warning || null);

    if (payload.ok) {
      captureGenerateSuccess(resolvedAnalysis, latencyMs);
    } else {
      captureGenerateError(payload.code, latencyMs);
    }

    if (treatAsInitialLoad || !payload.ok) {
      captureResultImpression(resolvedAnalysis);
    }
  };

  useEffect(() => {
    const savedInput = localStorage.getItem('copium_input');
    
    if (!savedInput) {
      router.push('/');
      return;
    }

    const generateResult = async () => {
      const startTime = Date.now(); // 添加开始时间
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: savedInput }),
        });

        const data = (await response.json()) as GenerateApiResponse;
        applyApiPayload(data, Date.now() - startTime, true);
      } catch (err: unknown) {
        // 埋点：生成失败
        captureGenerateError('frontend_fetch_error', Date.now() - startTime);
        setError(err instanceof Error ? err.message : '生成失败，请稍后再试');
        setWarning(null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    generateResult();

    // 清理 localStorage（可选）
    return () => {
      // localStorage.removeItem('copium_input');
    };
  }, [router]);

  const handleRegenerate = async () => {
    const savedInput = localStorage.getItem('copium_input');
    if (!savedInput) {
      router.push('/');
      return;
    }

    // 埋点：重新生成
    if (analysis) {
      captureRegenerateClick(analysis);
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: savedInput }),
      });

      const data = (await response.json()) as GenerateApiResponse;
      applyApiPayload(data, Date.now() - startTime, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后再试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiked = () => {
    alert('很高兴这口氧气对你有帮助！💙');
  };

  const handleActionTaken = () => {
    // 点击“开始行动”仅记录状态，不弹完成提示。
  };

  const handleBackToHome = () => {
    localStorage.removeItem('copium_input');
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-paper relative overflow-hidden">
        <SketchBackground />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Hero />
          <LoadingState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper relative overflow-hidden">
      <SketchBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Hero />

        {warning && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-yellow-50 border-2 border-black rounded-none shadow-hard text-center card-rotate-slight-inverse">
            <p className="text-yellow-800 font-body text-base">{warning}</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border-2 border-black rounded-none shadow-hard text-center card-rotate-slight">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-handwriting font-bold mb-2">{error}</p>
              <p className="text-sm opacity-80 font-body">别担心，我们已经准备了备用方案</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {error.includes('API密钥') ? (
                <>
                  <button
                    onClick={handleBackToHome}
                    className="px-6 py-2.5 bg-red-600 text-white font-handwriting font-bold border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    返回首页
                  </button>
                  <button
                    onClick={() => alert('请联系管理员检查API密钥配置')}
                    className="px-6 py-2.5 bg-white text-gray-700 font-handwriting font-bold border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    联系支持
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-red-600 text-white font-handwriting font-bold border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    🔄 重试一次
                  </button>
                  <button
                    onClick={handleBackToHome}
                    className="px-6 py-2.5 bg-white text-gray-700 font-handwriting font-bold border-2 border-black rounded-none shadow-hard hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    返回首页
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ResultsSection result={result} />
            
            <div>
              <h2 className="text-2xl font-handwriting font-bold text-center mb-6 text-gray-800">
                ✨ 你的精神贴纸
              </h2>
              <StickerCard text={result.sticker_text} analysis={analysis ?? DEFAULT_ANALYSIS} />
            </div>
            
            <FeedbackSection 
              onLiked={handleLiked}
              onRegenerate={handleRegenerate}
              onActionTaken={handleActionTaken}
              analysis={analysis ?? DEFAULT_ANALYSIS}
            />

            <div className="text-center mt-8 mb-12">
              <button
                onClick={handleBackToHome}
                className="text-gray-700 font-body hover:text-black underline underline-offset-4 text-lg relative group"
              >
                <span className="relative">
                  ← 再来一口
                  <svg className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity" height="2" viewBox="0 0 100 2">
                    <path d="M0,1 L100,1" stroke="black" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </main>
  );
}
