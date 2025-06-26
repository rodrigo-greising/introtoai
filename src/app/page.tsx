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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 3Blue1Brown Neural Networks Playlist */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Neural Networks</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">3Blue1Brown's comprehensive series on the mathematics of neural networks and deep learning</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-500">8 videos • ~4 hours</span>
                <a 
                  href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Watch Playlist
                </a>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Machine Learning Basics</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Introduction to machine learning concepts and algorithms</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-500">Coming Soon</span>
                <button className="text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed">Watch Playlist</button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI Applications</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Real-world applications and use cases of artificial intelligence</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-500">Coming Soon</span>
                <button className="text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed">Watch Playlist</button>
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
