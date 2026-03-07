export default function Hero() {
  return (
    <div className="text-center mb-12 relative">
      {/* 手绘装饰元素 */}
      <div className="absolute top-0 left-10 text-4xl opacity-30">✦</div>
      <div className="absolute top-4 right-16 text-3xl opacity-30">～</div>
      
      <h1 className="text-6xl md:text-7xl font-bold mb-3 text-black relative inline-block font-title">
        <span className="relative">
          赛博吸氧机
          {/* SVG 手绘下划线 */}
          <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 300 8">
            <path d="M0,4 Q75,1 150,4 T300,4" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </span>
      </h1>
      <p className="text-3xl md:text-4xl text-black/70 mb-4 font-title">
        Cyber Copium
      </p>
      <p className="text-xl text-black/60 max-w-2xl mx-auto font-body">
        现实太窒息？来吸一口纯度 100% 的赛博盲目乐观。
      </p>
    </div>
  );
}
