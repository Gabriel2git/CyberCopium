import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ThumbsUp, RotateCcw, Rocket } from "lucide-react";

interface FeedbackSectionProps {
  onHit: () => void;
  onRetry: () => void;
  onStartAction: () => void;
}

export function FeedbackSection({ onHit, onRetry, onStartAction }: FeedbackSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="w-full max-w-2xl mx-auto space-y-6"
      style={{ fontFamily: "'Kalam', cursive" }}
    >
      <div className="text-center text-black/60 text-lg mb-6 relative">
        <span className="relative inline-block">
          这口氧气对你有用吗？
          <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
            <path d="M0,2 Q50,0 100,2 T200,2" stroke="black" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={onHit}
          variant="outline"
          className="border-2 border-black bg-white hover:bg-black hover:text-white text-black py-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] group"
          style={{ 
            fontFamily: "'Caveat', cursive",
            transform: 'rotate(-0.5deg)'
          }}
        >
          <ThumbsUp className="w-5 h-5 mr-2" />
          命中了 ✓
        </Button>
        
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-2 border-black bg-white hover:bg-black hover:text-white text-black py-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] group"
          style={{ 
            fontFamily: "'Caveat', cursive",
            transform: 'rotate(0.3deg)'
          }}
        >
          <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
          再来一口 ↻
        </Button>
        
        <Button
          onClick={onStartAction}
          className="bg-black hover:bg-black/90 text-white border-2 border-black py-6 rounded-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] font-bold group"
          style={{ 
            fontFamily: "'Caveat', cursive",
            transform: 'rotate(-0.3deg)'
          }}
        >
          <Rocket className="w-5 h-5 mr-2" />
          开始行动 →
        </Button>
      </div>
    </motion.div>
  );
}