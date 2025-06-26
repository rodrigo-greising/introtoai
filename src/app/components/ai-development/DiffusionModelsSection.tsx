import DiffusionEducationalContent from './DiffusionEducationalContent';
import DiffusionTools from './DiffusionTools';
import DiffusionCourses from './DiffusionCourses';

export default function DiffusionModelsSection() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">Creative AI</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI in Graphic Design</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400">Exploring how AI tools and diffusion models are revolutionizing graphic design workflows</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <DiffusionEducationalContent />
        <DiffusionTools />
      </div>

      <DiffusionCourses />
    </div>
  );
} 