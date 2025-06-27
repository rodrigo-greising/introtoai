export default function GeneralAIVideoSection() {
  return (
    <section id="general-ai-videos" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">AI Fundamentals</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Learn AI Fundamentals</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Start your AI journey with these essential video tutorials covering the basics of artificial intelligence</p>
        </div>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* First Video - How I use LLMs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">How I use LLMs</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Andrej Karpathy</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Andrej Karpathy shares his practical insights on working with Large Language Models. 
              Learn how a leading AI researcher actually uses LLMs in his daily workflow.
            </p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/EWvNQjAaOHw"
                title="How I use LLMs - Andrej Karpathy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Single video</span>
              <a 
                href="https://youtu.be/EWvNQjAaOHw?si=3tgLFT9PVGlfNPiK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open in YouTube →
              </a>
            </div>
          </div>

         
          
        </div>
      </div>
    </section>
  );
} 