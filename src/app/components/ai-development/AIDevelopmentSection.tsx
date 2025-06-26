import EducationalContent from './EducationalContent';
import ToolComparison from './ToolComparison';
import FutureOutlook from './FutureOutlook';

export default function AIDevelopmentSection() {
  return (
    <section id="ai-development" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">AI-Powered Development</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI in Software Development</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Understanding how artificial intelligence enhances development through dedicated IDEs and extensions</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <EducationalContent />
          <ToolComparison />
        </div>

        <FutureOutlook />
      </div>
    </section>
  );
} 