export default function YouTubeSection() {
  return (
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
  );
} 