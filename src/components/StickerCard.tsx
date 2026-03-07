export default function StickerCard({ text }: { text: string }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="bg-white rounded-none p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative"
        style={{ transform: 'rotate(2deg)' }}
      >
        {/* 角落标记 */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-black" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-black" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-black" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-black" />
        
        {/* 手绘装饰 */}
        <div className="absolute -top-3 -left-3 text-3xl opacity-40" style={{ transform: 'rotate(-15deg)' }}>✨</div>
        <div className="absolute -bottom-2 -right-2 text-2xl opacity-40" style={{ transform: 'rotate(10deg)' }}>🌈</div>
        
        <div className="text-center space-y-4">
          <p className="text-5xl md:text-6xl font-body font-bold text-gray-800 leading-relaxed">
            {text}
          </p>
          <p className="text-sm text-gray-500 pt-4 border-t-2 border-black font-body">
            赛博吸氧机 | Cyber Copium
          </p>
        </div>
      </div>
    </div>
  );
}
