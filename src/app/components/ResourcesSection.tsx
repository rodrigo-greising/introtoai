export default function ResourcesSection() {
  return (
    <section id="resources" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Additional Resources</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Curated links to the best AI learning resources on the web</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Machine Learning Visualized */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Machine Learning Visualized</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Gavin Hung</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Interactive visualizations of ML algorithms from first principles. See gradient descent, neural networks, 
              clustering, and more in action with beautiful animations.
            </p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>4 chapters • Interactive</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Free</span>
            </div>
            <a 
              href="https://ml-visualized.com/index.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Explore Visualizations</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Coursera AI For Everyone Course */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI For Everyone</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Andrew Ng (Coursera)</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              A comprehensive non-technical course covering AI fundamentals, business applications, and societal impact. 
              Perfect for beginners and business professionals.
            </p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>4 modules • 4.8★ (47K+ reviews)</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Free</span>
            </div>
            <a 
              href="https://www.coursera.org/learn/ai-for-everyone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Enroll Now</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Fast.ai Course */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Practical Deep Learning</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By fast.ai</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Learn practical deep learning with PyTorch. This course focuses on real-world applications 
              and getting you building AI models quickly.
            </p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>Free course • Self-paced</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Free</span>
            </div>
            <a 
              href="https://course.fast.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Start Learning</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Papers With Code */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Papers With Code</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Discover the latest research papers in AI and machine learning, 
              complete with open-source implementations and code.
            </p>
            <a 
              href="https://paperswithcode.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Browse Papers</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Hugging Face */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Hugging Face</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The leading platform for machine learning models, datasets, and tools. 
              Access thousands of pre-trained models and datasets.
            </p>
            <a 
              href="https://huggingface.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Explore Models</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* AI Community */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI Communities</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Join vibrant AI communities on Reddit, Discord, and other platforms 
              to connect with fellow learners and practitioners.
            </p>
            <a 
              href="https://www.reddit.com/r/MachineLearning/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Join Community</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* GitHub AI Projects */}
          <div className="group bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Open Source AI</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Explore trending AI projects on GitHub. Find open-source implementations, 
              tutorials, and tools to accelerate your learning.
            </p>
            <a 
              href="https://github.com/topics/artificial-intelligence" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            >
              <span className="text-sm font-medium">Browse Projects</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 