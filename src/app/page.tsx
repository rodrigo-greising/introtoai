import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Intro to AI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Free Learning Resources</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#youtube" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Videos</a>
              <a href="#documents" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documents</a>
              <a href="#ai-development" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Development</a>
              <a href="#labs" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Labs</a>
              <a href="#resources" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resources</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Learn AI for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Free</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Discover the world of artificial intelligence through curated resources, tutorials, and guides. 
            No login required, no hidden costs - just pure knowledge sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#youtube" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Start Learning
            </a>
            <a 
              href="#resources" 
              className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Browse Resources
            </a>
          </div>
        </div>
      </section>

      {/* YouTube Playlists Section */}
      <section id="youtube" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Video Tutorials</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Curated YouTube playlists to guide your AI learning journey</p>
          </div>
          
          {/* Embedded YouTube Playlist */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Neural Networks by 3Blue1Brown</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                A comprehensive series on the mathematics of neural networks and deep learning. 
                Eight videos covering the fundamental concepts behind how neural networks work.
              </p>
              
              {/* YouTube Embed */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi"
                  title="3Blue1Brown Neural Networks Playlist"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>8 videos • ~4 hours total</span>
                <a 
                  href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" 
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

      {/* Documents Section */}
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

      {/* AI in Software Development Section */}
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
            {/* Left Column - Educational Content */}
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
                  This approach has evolved into what's known as <a href="https://en.wikipedia.org/wiki/Vibe_coding" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">vibe coding</a> - a technique where developers describe problems in natural language and let AI generate the code. While this lowers the barrier to entry for software creation, it also shifts the programmer's role from manual coding to guiding, testing, and refining AI-generated code.
                </p>
              </div>

              

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Understanding the Risks of Vibe Coding</h4>
                <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Security & Privacy Concerns</h5>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• <strong>Code vulnerabilities:</strong> AI-generated code may contain security flaws that aren't immediately obvious</li>
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
                      <li>• <strong>Maintenance challenges:</strong> Code you don't fully understand is harder to debug and update</li>
                      <li>• <strong>Legal compliance:</strong> AI-generated code may not meet industry standards or regulations</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">When Vibe Coding Makes Sense</h5>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• <strong>Prototypes & demos:</strong> Quick proof-of-concept applications for internal use</li>
                      <li>• <strong>Personal projects:</strong> Tools you'll run locally on your own machine</li>
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

            {/* Right Column - Tool Comparison */}
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
                        Microsoft's AI pair programmer that suggests code completions in real-time.
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
                      Google's AI-first coding solution with IDE extensions, CLI tools, and GitHub integration.
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
          </div>

          <div className="text-center mt-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">The Future of AI-Assisted Development</h4>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                AI coding assistants represent a significant shift in how software is developed. While they don't replace 
                the need for understanding programming fundamentals, they can dramatically reduce the time spent on 
                boilerplate code and repetitive tasks, allowing developers to focus on creative problem-solving and 
                architectural decisions.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                As these tools continue to evolve, they're becoming more sophisticated at understanding context, 
                following coding standards, and generating production-ready code. The key is learning to work 
                effectively with AI as a collaborative partner rather than viewing it as a replacement for human expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Labs Experiments Section */}
      <section id="labs" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Google Labs</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Cutting-Edge AI Experiments</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Experience the future of AI with Google's latest experimental tools</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Portraits */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Portraits</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Expert knowledge, delivered by AI coaches with personalized guidance</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">AI Coaching</span>
                  <a 
                    href="https://labs.google/portraits/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium group-hover:underline"
                  >
                    Try Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Flow */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Flow</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Create cinematic clips and stories with Google's advanced AI models</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">AI Filmmaking</span>
                  <a 
                    href="https://flow.google/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium group-hover:underline"
                  >
                    Create →
                  </a>
                </div>
              </div>
            </div>

            {/* Project Mariner */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Project Mariner</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Explore the future of human-agent interaction in browsers</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Browser AI</span>
                  <a 
                    href="https://labs.google.com/mariner/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium group-hover:underline"
                  >
                    Try Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Stitch */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Stitch</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Turn prompts into UI designs and frontend code with AI</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">UI Design</span>
                  <a 
                    href="https://stitch.withgoogle.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium group-hover:underline"
                  >
                    Try Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Jules */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Jules</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">AI coding agent that automates GitHub workflows and tasks</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Code AI</span>
                  <a 
                    href="https://jules.google/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 text-sm font-medium group-hover:underline"
                  >
                    Try Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Project Astra */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Project Astra</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Research prototype exploring future universal AI assistant capabilities</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">AI Assistant</span>
                  <a 
                    href="https://deepmind.google/technologies/gemini/project-astra/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium group-hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* SynthID Detector */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">SynthID Detector</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Detect AI-generated content in images, audio, and video files</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">AI Detection</span>
                  <a 
                    href="https://deepmind.google.com/frontiers/synthid" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium group-hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* Whisk */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Whisk</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Image generation tool with stories and creative AI capabilities</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Image AI</span>
                  <a 
                    href="https://labs.google/experiments" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium group-hover:underline"
                  >
                    Explore →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a 
              href="https://labs.google/experiments" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Explore All Experiments
            </a>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Additional Resources</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">Curated links to the best AI learning resources on the web</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for resource cards */}
            <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Online Courses</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Free and paid courses from top platforms</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span className="text-sm font-medium">Explore Courses</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Research Papers</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Important papers and research in AI</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span className="text-sm font-medium">Read Papers</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Community</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Join AI communities and forums</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span className="text-sm font-medium">Join Community</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                AI Development
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
