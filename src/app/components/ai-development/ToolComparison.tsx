export default function ToolComparison() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Popular AI Development Tools</h4>
        
        <div className="space-y-6">
          {/* Cursor */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Cursor</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              AI-powered code editor built on VS Code with advanced chat and code generation capabilities.
            </p>
            <a 
              href="https://www.cursor.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Replit */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Replit</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Fully agentic cloud development platform that turns natural language descriptions into complete applications. 
              Unlike traditional IDEs, Replit handles the entire development workflow from idea to deployment.
            </p>
            <a 
              href="https://replit.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* GitHub Copilot */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">GitHub Copilot</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Microsoft&apos;s AI pair programmer that suggests code completions in real-time.
              </p>
              <a 
                href="https://github.com/features/copilot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Learn More →
              </a>
          </div>

          {/* Claude Code */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Claude Code</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Command-line AI tool that embeds Claude Opus 4 directly in your terminal for deep codebase understanding.
            </p>
            <a 
              href="https://www.anthropic.com/claude-code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Gemini Code Assist */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Gemini Code Assist</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Google&apos;s AI-first coding solution with IDE extensions, CLI tools, and GitHub integration.
            </p>
            <a 
              href="https://codeassist.google/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>
            
          {/* Cline */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Cline</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Open-source collaborative AI coder that works across multiple IDEs and platforms.
            </p>
            <a 
              href="https://cline.bot/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 