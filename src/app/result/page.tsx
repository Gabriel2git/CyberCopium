'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import { ResultsSection } from '@/components/ResultsSection';
import StickerCard from '@/components/StickerCard';
import FeedbackSection from '@/components/FeedbackSection';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import { GenerationResult, AnalysisResult } from '@/types';
import { captureResultImpression, captureRegenerateClick, captureGenerateSuccess, captureGenerateError } from '@/lib/posthog';

export default function ResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

        if (!response.ok) {
          throw new Error('生成失败');
        }

        const data = await response.json();
        setResult(data.result);
        setAnalysis(data.analysis);
        
        // 埋点：生成成功
        if (data.analysis) {
          captureGenerateSuccess(data.analysis, Date.now() - startTime);
          captureResultImpression(data.analysis);
        }
      } catch (err) {
        // 埋点：生成失败
        captureGenerateError('frontend_fetch_error', Date.now() - startTime);
        setError('生成失败，请稍后再试');
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

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: savedInput }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setResult(data.result);
      setAnalysis(data.analysis);
      
      // 埋点：新结果展示
      if (data.analysis) {
        captureResultImpression(data.analysis);
      }
    } catch (err) {
      setError('生成失败，请稍后再试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiked = () => {
    alert('很高兴这口氧气对你有帮助！💙');
  };

  const handleActionTaken = () => {
    alert('太棒了！你已经迈出了第一步！🎉');
  };

  const handleBackToHome = () => {
    localStorage.removeItem('copium_input');
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-paper relative overflow-hidden">
        {/* SVG 手绘滤镜 */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="sketch-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
        </svg>

        {/* 纸张纹理背景 */}
        <div className="fixed inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat'
             }} 
        />
        
        {/* 背景手绘装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-black rounded-full" style={{ transform: 'rotate(-15deg)', borderRadius: '47% 53% 44% 56% / 45% 47% 53% 55%' }} />
          <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-black" style={{ transform: 'rotate(20deg)', borderRadius: '5px' }} />
          <div className="absolute top-1/2 right-10 text-4xl">～</div>
          <div className="absolute bottom-1/4 left-20 text-2xl">✦</div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Hero />
          <LoadingState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper relative overflow-hidden">
      {/* SVG 手绘滤镜 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="sketch-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>

      {/* 纸张纹理背景 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat'
           }} 
      />
      
      {/* 背景手绘装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-black rounded-full" style={{ transform: 'rotate(-15deg)', borderRadius: '47% 53% 44% 56% / 45% 47% 53% 55%' }} />
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-black" style={{ transform: 'rotate(20deg)', borderRadius: '5px' }} />
        <div className="absolute top-1/2 right-10 text-4xl">～</div>
        <div className="absolute bottom-1/4 left-20 text-2xl">✦</div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Hero />
        
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
            </div>
          </div>
        )}
        
        {result && analysis && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ResultsSection result={result} />
            
            <div>
              <h2 className="text-2xl font-handwriting font-bold text-center mb-6 text-gray-800">
                ✨ 你的精神贴纸
              </h2>
              <StickerCard text={result.sticker_text} analysis={analysis} />
            </div>
            
            <FeedbackSection 
              onLiked={handleLiked}
              onRegenerate={handleRegenerate}
              onActionTaken={handleActionTaken}
              analysis={analysis}
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
