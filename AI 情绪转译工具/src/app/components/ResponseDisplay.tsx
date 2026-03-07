import { motion } from "motion/react";
import { Zap, Heart, Flame, Star, Sparkles } from "lucide-react";

interface ResponseDisplayProps {
  response: {
    status: string;
    intensity: number;
    mouthpiece: string;
    sticker: string;
    absurdMotivation: string;
    microAction: string;
  };
}

const intensityColors = [
  "from-blue-400 to-cyan-400",
  "from-cyan-400 to-green-400", 
  "from-yellow-400 to-orange-400",
  "from-orange-400 to-red-400",
  "from-red-400 to-pink-400"
];

const statusIcons = [
  { icon: Heart, label: "疲惫", color: "text-blue-400" },
  { icon: Zap, label: "焦虑", color: "text-yellow-400" },
  { icon: Flame, label: "愤怒", color: "text-red-400" },
  { icon: Star, label: "迷茫", color: "text-purple-400" },
  { icon: Sparkles, label: "崩溃", color: "text-pink-400" }
];

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Status & Intensity */}
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between p-6 bg-white border-2 border-black rounded-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
        style={{ 
          transform: 'rotate(0.5deg)',
          fontFamily: "'Kalam', cursive"
        }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 border-2 border-black bg-white relative">
            <Zap className="w-6 h-6 text-black" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full" />
          </div>
          <div>
            <div className="text-xs text-black/50 uppercase tracking-wider">当前状态</div>
            <div className="text-xl text-black font-bold">{response.status}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-black/50 uppercase tracking-wider mb-2">窒息指数</div>
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-8 border border-black ${
                  i < response.intensity ? "bg-black" : "bg-white"
                }`}
                style={{ transform: `rotate(${(i - 5) * 2}deg)` }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mouthpiece */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 bg-white border-2 border-black rounded-none relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        style={{ 
          transform: 'rotate(-0.5deg)',
          fontFamily: "'Kalam', cursive"
        }}
      >
        {/* Doodle decoration */}
        <div className="absolute -top-4 -left-4 text-3xl">✦</div>
        <div className="absolute -bottom-3 -right-3 text-2xl rotate-12">～</div>
        
        <div className="text-black/60 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          抽象嘴替
        </div>
        <div className="text-black text-2xl leading-relaxed">{response.mouthpiece}</div>
      </motion.div>

      {/* Sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center py-6"
      >
        <div className="inline-block p-12 bg-white border-4 border-black rounded-none relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
             style={{ transform: 'rotate(2deg)' }}
        >
          <div className="text-8xl">{response.sticker}</div>
          {/* Corner marks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-black" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-black" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-black" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-black" />
        </div>
      </motion.div>

      {/* Absurd Motivation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="p-8 bg-white border-2 border-black rounded-none relative shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
        style={{ 
          transform: 'rotate(0.3deg)',
          fontFamily: "'Kalam', cursive"
        }}
      >
        <div className="absolute -top-2 left-8 bg-[#fffef7] px-3 py-1 border-2 border-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Flame className="w-3 h-3" />
          荒诞动机
        </div>
        <div className="text-black text-xl leading-relaxed italic pt-4">"{response.absurdMotivation}"</div>
        
        {/* Quote decoration */}
        <div className="absolute bottom-4 right-6 text-6xl text-black/10 leading-none">"</div>
      </motion.div>

      {/* Micro Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-8 bg-black text-white border-2 border-black rounded-none shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        style={{ 
          transform: 'rotate(-0.3deg)',
          fontFamily: "'Kalam', cursive"
        }}
      >
        {/* Highlight effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="text-white/70 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            最小行动 ↓
          </div>
          <div className="text-white text-2xl leading-relaxed">{response.microAction}</div>
        </div>
        
        {/* Arrow decoration */}
        <div className="absolute bottom-4 right-6 text-4xl">→</div>
      </motion.div>
    </motion.div>
  );
}