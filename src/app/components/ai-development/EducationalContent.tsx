export default function EducationalContent() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What is AI-Enabled Software Development?</h4>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          AI-enabled development tools come in various forms: dedicated IDEs built with AI capabilities, 
          extensions that add AI features to existing environments, and fully agentic platforms that 
          handle entire development workflows. These tools use large language models to understand context, 
          suggest completions, and generate code based on natural language descriptions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The concept emerged from the idea that programming could be more intuitive if developers could describe 
          what they want to build in plain English, rather than having to write every line of code manually.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          This approach has evolved into what&apos;s known as <a href="https://en.wikipedia.org/wiki/Vibe_coding" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">vibe coding</a> - a technique where developers describe problems in natural language and let AI generate the code. While this lowers the barrier to entry for software creation, it also shifts the programmer&apos;s role from manual coding to guiding, testing, and refining AI-generated code.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Understanding the Risks of Vibe Coding</h4>
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
            <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Security & Privacy Concerns</h5>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• <strong>Code vulnerabilities:</strong> AI-generated code may contain security flaws that aren&apos;t immediately obvious</li>
              <li>• <strong>Data exposure:</strong> Sensitive information in prompts could be stored or processed by AI services</li>
              <li>• <strong>Dependency risks:</strong> AI might suggest outdated or vulnerable third-party libraries</li>
              <li>• <strong>Injection attacks:</strong> Generated code may not properly sanitize user inputs</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
            <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Production Readiness Issues</h5>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• <strong>Unpredictable costs:</strong> AI services can have variable pricing based on usage</li>
              <li>• <strong>Performance problems:</strong> Generated code may not be optimized for scale</li>
              <li>• <strong>Maintenance challenges:</strong> Code you don&apos;t fully understand is harder to debug and update</li>
              <li>• <strong>Legal compliance:</strong> AI-generated code may not meet industry standards or regulations</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">When Vibe Coding Makes Sense</h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>Prototypes & demos:</strong> Quick proof-of-concept applications for internal use</li>
              <li>• <strong>Personal projects:</strong> Tools you&apos;ll run locally on your own machine</li>
              <li>• <strong>Simple websites:</strong> Static sites without user data or sensitive information</li>
              <li>• <strong>Learning exercises:</strong> Understanding new technologies or frameworks</li>
              <li>• <strong>Automation scripts:</strong> One-time or personal productivity tools</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Best Practices</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Always review, test, and understand AI-generated code before deploying it. Consider it a starting point 
              rather than a finished product, especially for applications that handle user data or run in production environments.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Remember: Vibe coding is great for exploration and rapid prototyping, but production software requires 
              careful consideration of security, performance, and maintainability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 