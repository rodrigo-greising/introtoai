import LabCard from './LabCard';

const labExperiments = [
  {
    name: "Portraits",
    description: "Expert knowledge, delivered by AI coaches with personalized guidance",
    category: "AI Coaching",
    url: "https://labs.google/portraits/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: "from-purple-400 to-pink-500",
    hoverGradient: "from-purple-500/10 to-pink-500/10",
    linkColor: "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300",
    actionText: "Try Now →"
  },
  {
    name: "Flow",
    description: "Create cinematic clips and stories with Google's advanced AI models",
    category: "AI Filmmaking",
    url: "https://flow.google/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-blue-400 to-cyan-500",
    hoverGradient: "from-blue-500/10 to-cyan-500/10",
    linkColor: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
    actionText: "Create →"
  },
  {
    name: "Project Mariner",
    description: "Explore the future of human-agent interaction in browsers",
    category: "Browser AI",
    url: "https://labs.google.com/mariner/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
      </svg>
    ),
    gradient: "from-green-400 to-emerald-500",
    hoverGradient: "from-green-500/10 to-emerald-500/10",
    linkColor: "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300",
    actionText: "Try Now →"
  },
  {
    name: "Stitch",
    description: "Turn prompts into UI designs and frontend code with AI",
    category: "UI Design",
    url: "https://stitch.withgoogle.com/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-indigo-400 to-purple-500",
    hoverGradient: "from-indigo-500/10 to-purple-500/10",
    linkColor: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
    actionText: "Try Now →"
  },
  {
    name: "Jules",
    description: "AI coding agent that automates GitHub workflows and tasks",
    category: "Code AI",
    url: "https://jules.google/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    gradient: "from-yellow-400 to-amber-500",
    hoverGradient: "from-yellow-500/10 to-amber-500/10",
    linkColor: "text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300",
    actionText: "Try Now →"
  },
  {
    name: "Project Astra",
    description: "Research prototype exploring future universal AI assistant capabilities",
    category: "AI Assistant",
    url: "https://deepmind.google/technologies/gemini/project-astra/",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-teal-400 to-cyan-500",
    hoverGradient: "from-teal-500/10 to-cyan-500/10",
    linkColor: "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300",
    actionText: "Learn More →"
  },
  {
    name: "SynthID Detector",
    description: "Detect AI-generated content in images, audio, and video files",
    category: "AI Detection",
    url: "https://deepmind.google.com/frontiers/synthid",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-orange-400 to-red-500",
    hoverGradient: "from-orange-500/10 to-red-500/10",
    linkColor: "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300",
    actionText: "Learn More →"
  },
  {
    name: "Whisk",
    description: "Image generation tool with stories and creative AI capabilities",
    category: "Image AI",
    url: "https://labs.google/experiments",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-pink-400 to-rose-500",
    hoverGradient: "from-pink-500/10 to-rose-500/10",
    linkColor: "text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300",
    actionText: "Explore →"
  }
];

export default function GoogleLabsSection() {
  return (
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
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI Experiments</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Experience the future of AI with Google&apos;s latest experimental tools</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labExperiments.map((lab, index) => (
            <LabCard key={index} {...lab} />
          ))}
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
  );
} 