export default function YouTubeSection() {
  return (
    <section id="youtube" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Video Tutorials</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">Curated YouTube videos and playlists to guide your AI learning journey</p>
        </div>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* First Video - How I use LLMs */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">How I use LLMs</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Andrej Karpathy</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Andrej Karpathy is a renowned AI researcher and educator who co-founded OpenAI, led AI development at Tesla, 
              and now runs Eureka Labs. He&apos;s known for creating Stanford&apos;s first deep learning course and his popular 
              &ldquo;Zero to Hero&rdquo; series on LLM fundamentals. In this video, he shares his practical insights on working with Large Language Models.
            </p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/EWvNQjAaOHw"
                title="How I use LLMs - Andrej Karpathy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Single video</span>
              <a 
                href="https://youtu.be/EWvNQjAaOHw?si=3tgLFT9PVGlfNPiK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open in YouTube →
              </a>
            </div>
          </div>

          {/* Second Video - Practical Deep Learning 2024-25 (fast.ai) */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Practical Deep Learning for Coders (2024-25)</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Jeremy Howard</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The latest fast.ai course focused on modern deep learning with PyTorch, covering vision, NLP, deployment, and practical tricks.
            </p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/videoseries?list=PLfYUBJiXbdtSm3bVudQfWKOQh3GVaAQyF"
                title="Practical Deep Learning for Coders (2024-25)"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>New series • fast.ai</span>
              <a 
                href="https://www.youtube.com/playlist?list=PLfYUBJiXbdtSm3bVudQfWKOQh3GVaAQyF" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open in YouTube →
              </a>
            </div>
          </div>

          {/* Third Video - Neural Networks: Zero to Hero (classic) */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Neural Networks: Zero to Hero</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-6">A popular series that builds from micrograd to GPT.</p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/videoseries?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ"
                title="Neural Networks: Zero to Hero"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>10 videos • foundational</span>
              <a 
                href="https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open in YouTube →
              </a>
            </div>
          </div>

          {/* Fourth Video - Practical Deep Learning for Coders */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Practical Deep Learning for Coders</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Jeremy Howard</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              A comprehensive course designed for coders who want to apply deep learning to practical problems. 
              Learn to build models for computer vision, NLP, tabular analysis, and collaborative filtering using 
              PyTorch, fastai, and Hugging Face. No special hardware required.
            </p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/videoseries?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU"
                title="Practical Deep Learning for Coders Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>8 videos • ~336K views</span>
              <a 
                href="https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU" 
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
  );
} 