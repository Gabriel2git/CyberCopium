'use client';

import { AnalysisResult } from '@/types';
import { captureStickerSaveClick } from '@/lib/posthog';

interface StickerCardProps {
  text: string;
  analysis: AnalysisResult;
}

export default function StickerCard({ text, analysis }: StickerCardProps) {
  const handleSave = () => {
    // 埋点：保存贴纸
    captureStickerSaveClick(text, analysis);
    
    // 创建 canvas 来生成图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    canvas.width = 400;
    canvas.height = 300;

    // 绘制白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制黑色边框
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // 绘制角落标记
    ctx.lineWidth = 3;
    // 左上
    ctx.beginPath();
    ctx.moveTo(20, 40);
    ctx.lineTo(20, 20);
    ctx.lineTo(40, 20);
    ctx.stroke();
    // 右上
    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, 20);
    ctx.lineTo(canvas.width - 20, 20);
    ctx.lineTo(canvas.width - 20, 40);
    ctx.stroke();
    // 左下
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 40);
    ctx.lineTo(20, canvas.height - 20);
    ctx.lineTo(40, canvas.height - 20);
    ctx.stroke();
    // 右下
    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, canvas.height - 20);
    ctx.lineTo(canvas.width - 20, canvas.height - 20);
    ctx.lineTo(canvas.width - 20, canvas.height - 40);
    ctx.stroke();

    // 绘制文字
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 自动换行
    const maxWidth = 340;
    const lineHeight = 50;
    const words = text.split('');
    let line = '';
    let lines: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // 绘制每一行
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    // 绘制底部文字
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('赛博吸氧机 | Cyber Copium', canvas.width / 2, canvas.height - 40);

    // 下载图片
    const link = document.createElement('a');
    link.download = `赛博吸氧机-${text.slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div 
        className="bg-white rounded-none p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
        style={{ transform: 'rotate(2deg)' }}
        onClick={handleSave}
        title="点击保存贴纸"
      >
        {/* 角落标记 */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-black" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-black" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-black" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-black" />
        
        {/* 手绘装饰 */}
        <div className="absolute -top-3 -left-3 text-2xl opacity-40" style={{ transform: 'rotate(-15deg)' }}>✨</div>
        <div className="absolute -bottom-2 -right-2 text-xl opacity-40" style={{ transform: 'rotate(10deg)' }}>🌈</div>
        
        <div className="text-center space-y-3">
          <p className="text-4xl md:text-5xl font-body font-bold text-gray-800 leading-relaxed">
            {text}
          </p>
          <p className="text-xs text-gray-500 pt-3 border-t-2 border-black font-body">
            赛博吸氧机 | Cyber Copium
          </p>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4 font-body">
        点击卡片保存贴纸
      </p>
    </div>
  );
}
