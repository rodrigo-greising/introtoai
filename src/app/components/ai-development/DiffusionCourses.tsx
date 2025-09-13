export default function DiffusionCourses() {
  return (
    <div className="text-center mt-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">AI Image Generation Learning Resources</h4>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Free Resources */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Free Learning Resources</h5>
            
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Image Generation for Complete Newbies</h6>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Comprehensive guide to getting started with Stable Diffusion, FLUX, and other AI image generation tools. Covers installation, UI options, and essential concepts for beginners.
                </p>
                <a 
                  href="https://civitai.com/articles/7492" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Read Guide →
                </a>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <h6 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">Stable Diffusion 3 Quickstart</h6>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                  Official docs and examples to get started with Stable Diffusion 3 for high-quality image generation.
                </p>
                <a 
                  href="https://platform.stability.ai/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
                >
                  Read Docs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 