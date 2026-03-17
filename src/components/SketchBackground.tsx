export default function SketchBackground() {
  return (
    <>
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
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
        }}
      />

      {/* 背景手绘装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className="absolute top-20 left-10 w-32 h-32 border-2 border-black rounded-full"
          style={{ transform: 'rotate(-15deg)', borderRadius: '47% 53% 44% 56% / 45% 47% 53% 55%' }}
        />
        <div
          className="absolute bottom-32 right-20 w-24 h-24 border-2 border-black"
          style={{ transform: 'rotate(20deg)', borderRadius: '5px' }}
        />
        <div className="absolute top-1/2 right-10 text-4xl">～</div>
        <div className="absolute bottom-1/4 left-20 text-2xl">✦</div>
      </div>
    </>
  );
}
