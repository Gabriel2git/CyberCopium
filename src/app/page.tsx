'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import InputSection from '@/components/InputSection';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import SketchBackground from '@/components/SketchBackground';
import { captureEvent } from '@/lib/posthog';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    setIsLoading(true);
    
    // 保存输入到 localStorage
    localStorage.setItem('copium_input', input);
    
    // 跳转到结果页面
    router.push('/result');
  };

  // 测试 PostHog 事件
  const handleTestPostHog = () => {
    const testEvent = 'test_event_manual';
    captureEvent(testEvent, {
      test: true,
      timestamp: new Date().toISOString(),
      message: '这是手动测试事件',
    });
    alert(`✅ 已发送测试事件到 PostHog: ${testEvent}\n\n请查看浏览器控制台确认`);
    console.log('📤 测试事件已发送:', testEvent);
  };

  return (
    <main className="min-h-screen bg-paper relative overflow-hidden">
      <SketchBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col min-h-[calc(100vh-48px)]">
        <Hero />
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
        )}
        
        <div className="flex-grow" />
        
        {/* 测试按钮 - 仅开发环境 */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleTestPostHog}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            🧪 测试 PostHog 事件
          </button>
        )}
      </div>
      
      {/* 固定在底部的 Footer */}
      <Footer />
    </main>
  );
}
