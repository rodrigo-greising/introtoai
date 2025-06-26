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
              and now runs Eureka Labs. He's known for creating Stanford's first deep learning course and his popular 
              "Zero to Hero" series on LLM fundamentals. In this video, he shares his practical insights on working with Large Language Models.
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

          {/* Second Video - Neural Networks: Zero to Hero Playlist */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Neural Networks: Zero to Hero</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">By Andrej Karpathy</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              A comprehensive series that builds neural networks from scratch, starting with micrograd for backpropagation 
              and progressing to building GPT models. Learn the fundamentals of deep learning through hands-on coding 
              and mathematical intuition.
            </p>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/videoseries?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ"
                title="Neural Networks: Zero to Hero Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>10 videos • ~2M views</span>
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

          {/* Third Video - Existing 3Blue1Brown Playlist */}
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
  );
} 