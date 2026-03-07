import { useState } from "react";
import { InputSection } from "./components/InputSection";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { FeedbackSection } from "./components/FeedbackSection";
import { generateMockResponse, type AIResponse } from "./lib/mockAI";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setCurrentInput(input);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = generateMockResponse(input);
    setResponse(aiResponse);
    setIsLoading(false);
  };

  const handleHit = () => {
    toast.success("✨ 太好了！这口氧气命中了！", {
      description: "继续保持，你可以的！",
      duration: 3000,
    });
  };

  const handleRetry = () => {
    if (currentInput) {
      const newResponse = generateMockResponse(currentInput);
      setResponse(newResponse);
      toast.info("🔄 已为你重新生成", {
        description: "换一种角度看看",
        duration: 2000,
      });
    }
  };

  const handleStartAction = () => {
    toast.success("🚀 出发！", {
      description: "迈出第一步就是胜利！",
      duration: 3000,
    });
    
    // Reset after action
    setTimeout(() => {
      setResponse(null);
      setInput("");
      setCurrentInput("");
    }, 3000);
  };

  const handleReset = () => {
    setResponse(null);
    setInput("");
    setCurrentInput("");
  };

  return (
    <div className="min-h-screen bg-[#fffef7] text-black overflow-hidden relative" style={{ fontFamily: "'Kalam', cursive" }}>
      {/* SVG filters for sketch effect */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="sketch-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="rough-paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="1">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      {/* Paper texture background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat'
           }} 
      />

      {/* Doodle elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-black rounded-full" style={{ transform: 'rotate(-15deg)', borderRadius: '47% 53% 44% 56% / 45% 47% 53% 55%' }} />
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-black" style={{ transform: 'rotate(20deg)', borderRadius: '5px' }} />
        <div className="absolute top-1/2 right-10 text-4xl">～</div>
        <div className="absolute bottom-1/4 left-20 text-2xl">✦</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-16 pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black relative inline-block" style={{ fontFamily: "'Caveat', cursive" }}>
              <span className="relative">
                赛博吸氧机
                <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 300 8">
                  <path d="M0,4 Q75,1 150,4 T300,4" stroke="black" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            <div className="text-2xl md:text-3xl text-black/70 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Cyber Copium
            </div>
            <p className="text-black/60 text-base md:text-lg max-w-2xl mx-auto">
              现实太窒息？来吸一口纯度 100% 的赛博盲目乐观
            </p>
          </motion.div>
        </header>

        {/* Main interaction area */}
        <main className="flex-1 px-4 pb-12">
          <AnimatePresence mode="wait">
            {!response ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <InputSection
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 py-8"
              >
                <ResponseDisplay response={response} />
                <FeedbackSection
                  onHit={handleHit}
                  onRetry={handleRetry}
                  onStartAction={handleStartAction}
                />
                
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleReset}
                    className="text-black/50 hover:text-black text-sm relative group"
                  >
                    <span className="relative">
                      重新开始
                      <svg className="absolute -bottom-1 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity" height="2" viewBox="0 0 100 2">
                        <path d="M0,1 L100,1" stroke="black" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="pb-8 px-4 text-center text-black/40 text-xs">
          <p>⚠️ 本产品仅供情绪急救，不能替代专业心理咨询</p>
          <p className="mt-1">当前数据为模拟生成，真实版本需要集成AI API</p>
        </footer>
      </div>

      <Toaster 
        theme="light" 
        position="top-center"
        toastOptions={{
          style: {
            background: "#fffef7",
            border: "2px solid black",
            color: "black",
            fontFamily: "'Kalam', cursive"
          }
        }}
      />
    </div>
  );
}