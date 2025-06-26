export default function DesignVideoTutorials() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Video Tutorials</h4>
        <p className="text-slate-600 dark:text-slate-400">Essential video content for AI-powered graphic design</p>
      </div>
      
      {/* Placeholder for future video content */}
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Coming Soon</h5>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Video tutorials for AI-powered graphic design tools and techniques will be added here.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Topics will include: Midjourney, DALL-E, Stable Diffusion, and other AI design tools
        </p>
      </div>
    </div>
  );
} 