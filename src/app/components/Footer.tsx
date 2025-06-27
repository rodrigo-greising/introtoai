export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Intro to AI</h3>
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Sharing knowledge about artificial intelligence for free. No login required, no hidden costs - 
            just pure learning resources to help you understand and work with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#youtube" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Video Tutorials
            </a>
            <span className="hidden sm:block text-slate-600">•</span>
            <a 
              href="#documents" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Documents
            </a>
            <span className="hidden sm:block text-slate-600">•</span>
            <a 
              href="#ai-development" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              AI in Professional Settings
            </a>
            <span className="hidden sm:block text-slate-600">•</span>
            <a 
              href="#labs" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Labs
            </a>
            <span className="hidden sm:block text-slate-600">•</span>
            <a 
              href="#resources" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Resources
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-500">
              © 2024 Intro to AI. Made with ❤️ for the AI community.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Created by{' '}
              <a 
                href="https://github.com/rodrigo-greising" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Rodrigo Greising
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 