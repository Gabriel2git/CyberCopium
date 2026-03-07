import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function InputSection({ value, onChange, onSubmit, isLoading }: InputSectionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="说说你的困境吧...（比如：又加班到凌晨了 / 论文被拒了 / 存款清零了）"
          className="min-h-[140px] bg-white border-2 border-black text-black placeholder:text-black/40 resize-none rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ 
            fontFamily: "'Kalam', cursive",
            transform: 'rotate(-0.5deg)'
          }}
          disabled={isLoading}
        />
        {/* Hand-drawn corner decoration */}
        <div className="absolute -top-3 -right-3 text-2xl rotate-12">✎</div>
      </div>
      
      <Button 
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="w-full bg-black hover:bg-black/90 text-white border-2 border-black py-7 text-lg relative overflow-hidden group rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        <span className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          {isLoading ? "正在生成赛博氧气..." : "吸一口纯度100%的赛博盲目乐观 →"}
        </span>
      </Button>
    </div>
  );
}