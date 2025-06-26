export default function DevelopmentVideoTutorials() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Video Tutorials</h4>
        <p className="text-slate-600 dark:text-slate-400">Essential video content for AI software development</p>
      </div>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* First Video - How I use LLMs */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">How I use LLMs</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">By Andrej Karpathy</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Andrej Karpathy shares his practical insights on working with Large Language Models.
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
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Single video</span>
            <a 
              href="https://youtu.be/EWvNQjAaOHw?si=3tgLFT9PVGlfNPiK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Second Video - Neural Networks: Zero to Hero Playlist */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Neural Networks: Zero to Hero</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">By Andrej Karpathy</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Build neural networks from scratch, starting with micrograd and progressing to GPT models.
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
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>10 videos • ~2M views</span>
            <a 
              href="https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Third Video - 3Blue1Brown Neural Networks */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Neural Networks by 3Blue1Brown</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Mathematics of neural networks and deep learning with visual explanations.
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
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>8 videos • ~4 hours total</span>
            <a 
              href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Fourth Video - Practical Deep Learning for Coders */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Practical Deep Learning for Coders</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">By Jeremy Howard</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Apply deep learning to practical problems using PyTorch, fastai, and Hugging Face.
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
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>8 videos • ~336K views</span>
            <a 
              href="https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
} 