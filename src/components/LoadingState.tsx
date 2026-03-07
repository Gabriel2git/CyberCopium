export default function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16">
      <div className="text-center">
        <div className="inline-block animate-spin h-12 w-12 mb-4 relative">
          <div className="absolute inset-0 border-2 border-black"></div>
          <div className="absolute inset-0 border-t-2 border-transparent animate-spin" style={{ borderTopColor: 'black' }}></div>
        </div>
        <p className="text-gray-700 text-lg font-handwriting font-bold">
          正在生成你的赛博氧气...
        </p>
        <p className="text-gray-600 text-sm mt-2 font-body">
          深呼吸，马上就好 ✨
        </p>
      </div>
    </div>
  );
}
