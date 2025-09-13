export default function DiffusionTools() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Popular AI Design Tools</h4>
        
        <div className="space-y-6">
          {/* DALL-E */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">DALL-E (OpenAI)</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Advanced image generation with exceptional prompt understanding. Ideal for creating marketing visuals, 
              concept art, and design mockups with high-quality output.
            </p>
            <a 
              href="https://openai.com/dall-e-3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Midjourney */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Midjourney</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Discord-based AI art generator known for artistic and creative outputs. Popular among designers 
              for creating unique visual styles and artistic concepts.
            </p>
            <a 
              href="https://www.midjourney.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Stable Diffusion */}
          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Stable Diffusion</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Open-source diffusion model that can run locally. Highly customizable with extensive community 
              support and specialized models for different design styles.
            </p>
            <a 
              href="https://stability.ai/stable-diffusion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* FLUX.1 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">FLUX.1 (Black Forest Labs)</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              High-quality open image generation model family with photorealistic and artistic variants, strong composition control.
            </p>
            <a 
              href="https://blackforestlabs.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* ComfyUI */}
          <div className="border-l-4 border-cyan-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">ComfyUI</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Open-source node-based interface for generative AI workflows. Provides visual workflow building 
              for Stable Diffusion and other AI models, allowing users to create complex image generation pipelines.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <a 
                href="https://www.comfy.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
              >
                Website →
              </a>
              <a 
                href="https://docs.comfy.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
              >
                Documentation →
              </a>
            </div>
          </div>

          {/* Adobe Firefly */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Adobe Firefly</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Adobe&apos;s AI image generation tool integrated into Creative Suite. Focuses on commercial-safe 
              content and seamless integration with existing design workflows.
            </p>
            <a 
              href="https://www.adobe.com/products/firefly.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Runway ML */}
          <div className="border-l-4 border-pink-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Runway ML</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Creative AI platform offering video generation, image editing, and motion tools. Popular 
              among designers for creating dynamic content and animations.
            </p>
            <a 
              href="https://runwayml.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>

          {/* Leonardo.ai */}
          <div className="border-l-4 border-indigo-500 pl-4">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Leonardo.ai</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              AI art platform with specialized models for game assets, character design, and concept art. 
              Excellent for creating consistent design elements and brand assets.
            </p>
            <a 
              href="https://leonardo.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
            >
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 