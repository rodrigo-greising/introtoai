export default function DocumentsSection() {
  return (
    <section id="documents" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Learning Documents</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Comprehensive guides and reference materials</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for document cards */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI Roadmap</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">A complete learning path from beginner to advanced AI concepts</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-500">PDF • 45 pages</span>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Download</button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Python for AI</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Essential Python programming concepts for AI development</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-500">PDF • 32 pages</span>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Download</button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI Tools Guide</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Overview of popular AI tools and frameworks</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-500">PDF • 28 pages</span>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Download</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 