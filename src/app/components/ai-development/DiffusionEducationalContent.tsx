export default function DiffusionEducationalContent() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AI in Graphic Design</h4>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Artificial intelligence is transforming graphic design by automating repetitive tasks, generating creative 
          assets, and providing new tools for visual expression. From logo design to marketing materials, AI tools 
          are becoming essential in modern design workflows.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The most significant advancement comes from <strong>diffusion models</strong> - AI systems that can create 
          high-quality images from text descriptions. These tools understand design concepts, styles, and visual 
          elements, making them powerful allies for designers.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          While AI doesn&apos;t replace human creativity, it enhances it by handling technical execution, 
          generating variations, and providing inspiration. The best results come from collaboration between 
          human designers and AI tools.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">How AI Enhances Design Workflows</h4>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">1. Concept Generation</h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>Rapid Prototyping:</strong> Generate multiple design concepts quickly</li>
              <li>• <strong>Style Exploration:</strong> Test different visual styles and aesthetics</li>
              <li>• <strong>Inspiration Source:</strong> Overcome creative blocks with AI-generated ideas</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
            <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">2. Asset Creation</h5>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• <strong>Stock Imagery:</strong> Create custom images without licensing fees</li>
              <li>• <strong>Icon Design:</strong> Generate unique icons and symbols</li>
              <li>• <strong>Background Elements:</strong> Create textures, patterns, and backgrounds</li>
              <li>• <strong>Mockups:</strong> Generate product mockups and presentations</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
            <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">3. Workflow Optimization</h5>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• <strong>Time Savings:</strong> Automate repetitive design tasks</li>
              <li>• <strong>Client Communication:</strong> Quickly visualize client ideas</li>
              <li>• <strong>Iteration Speed:</strong> Generate variations for A/B testing</li>
              <li>• <strong>Scalability:</strong> Handle multiple projects simultaneously</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
            <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Current Limitations</h5>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• <strong>Brand Consistency:</strong> Maintaining consistent visual identity</li>
              <li>• <strong>Copyright Issues:</strong> Legal considerations for commercial use</li>
              <li>• <strong>Quality Control:</strong> Need for human review and refinement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 