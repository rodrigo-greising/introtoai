export default function DesignVideoTutorials() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Video Tutorials</h4>
        <p className="text-slate-600 dark:text-slate-400">Essential video content for AI-powered graphic design</p>
      </div>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* First Video - ComfyUI by Scott Detweiler */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">ComfyUI</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">By Scott Detweiler</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            A better method to use stable diffusion models on your local PC to create AI art.
          </p>
          
          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/videoseries?list=PLIF38owJLhR1EGDY4kOnsEnMyolZgza1x"
              title="ComfyUI by Scott Detweiler"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>34 videos • 275,129 views</span>
            <a 
              href="https://www.youtube.com/playlist?list=PLIF38owJLhR1EGDY4kOnsEnMyolZgza1x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>

        {/* Second Video - Learn ComfyUI by Olivio Sarikas */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Learn ComfyUI</h5>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">By Olivio Sarikas</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Comprehensive tutorials for learning ComfyUI from basics to advanced techniques.
          </p>
          
          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/videoseries?list=PLH1tkjphTlWUTApzX-Hmw_WykUpG13eza"
              title="Learn ComfyUI by Olivio Sarikas"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Playlist • Multiple videos</span>
            <a 
              href="https://www.youtube.com/playlist?list=PLH1tkjphTlWUTApzX-Hmw_WykUpG13eza" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Open in YouTube →
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
} 