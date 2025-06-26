export default function DiffusionCourses() {
  return (
    <div className="text-center mt-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Design Learning Resources & Courses</h4>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Free Resources */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Free Learning Resources</h5>
            
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Stable Diffusion WebUI Tutorial</h6>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Comprehensive guide to setting up and using Stable Diffusion for design projects
                </p>
                <a 
                  href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  GitHub Repository →
                </a>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h6 className="font-medium text-green-800 dark:text-green-200 mb-2">Prompt Engineering for Designers</h6>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Learn effective techniques for writing prompts that generate better design assets
                </p>
                <a 
                  href="https://prompthero.com/prompt-engineering-guide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
                >
                  Read Guide →
                </a>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h6 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Design Community Resources</h6>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                  Join design communities to learn from other professionals and share techniques
                </p>
                <a 
                  href="https://www.midjourney.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                >
                  Join Community →
                </a>
              </div>
            </div>
          </div>

          {/* Paid Courses */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Premium Design Courses</h5>
            
            <div className="space-y-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h6 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Udemy: AI Design Masterclass</h6>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                  Comprehensive course covering AI tools for graphic design and visual creation
                </p>
                <a 
                  href="https://www.udemy.com/course/ai-art-masterclass/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium"
                >
                  View Course →
                </a>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                <h6 className="font-medium text-pink-800 dark:text-pink-200 mb-2">Coursera: AI for Designers</h6>
                <p className="text-sm text-pink-700 dark:text-pink-300 mb-2">
                  University-level course on integrating AI tools into professional design workflows
                </p>
                <a 
                  href="https://www.coursera.org/learn/generative-ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-medium"
                >
                  View Course →
                </a>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <h6 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Skillshare: AI Design Fundamentals</h6>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Creative-focused course for designers wanting to integrate AI into their workflow
                </p>
                <a 
                  href="https://www.skillshare.com/classes/AI-Art-Fundamentals" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                >
                  View Course →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Getting Started in AI Design</h5>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left max-w-2xl mx-auto">
            <li>• Start with free tools like Stable Diffusion WebUI or Leonardo.ai&apos;s free tier</li>
            <li>• Practice prompt engineering with design-specific terminology</li>
            <li>• Join design communities to learn from other professionals</li>
            <li>• Experiment with different AI tools to understand their strengths</li>
            <li>• Consider ethical implications and copyright when using AI-generated content</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 