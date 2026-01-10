"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Send,
  Zap,
  Brain,
  Sparkles,
  Code2,
  DollarSign,
  Clock,
} from "lucide-react";

// =============================================================================
// Router Simulator
// =============================================================================

interface RoutingResult {
  model: string;
  category: string;
  complexity: string;
  reasoning: string;
  estimatedCost: string;
  estimatedLatency: string;
}

function RouterSimulator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const examplePrompts = [
    "What's 2 + 2?",
    "Write a poem about the ocean",
    "Debug this Python function that's throwing an IndexError",
    "Explain step by step how to solve: If 3x + 7 = 22, what is x?",
    "Hi! How are you today?",
  ];

  const simulateRouting = useCallback((input: string) => {
    setIsRouting(true);
    
    // Simulate routing logic
    setTimeout(() => {
      const lower = input.toLowerCase();
      const length = input.length;
      
      let category = "general";
      let complexity = "medium";
      let model = "gpt-4o";
      let reasoning = "";
      let estimatedCost = "$0.002";
      let estimatedLatency = "1-2s";

      // Simple questions
      if (length < 30 && !lower.includes("explain") && !lower.includes("why")) {
        category = "simple_qa";
        complexity = "low";
        model = "gpt-4o-mini";
        reasoning = "Short prompt, likely a simple question";
        estimatedCost = "$0.0001";
        estimatedLatency = "0.3-0.5s";
      }
      // Reasoning tasks
      else if (lower.includes("step by step") || lower.includes("solve") || lower.includes("calculate")) {
        category = "reasoning";
        complexity = "high";
        model = "o1";
        reasoning = "Multi-step reasoning detected";
        estimatedCost = "$0.015";
        estimatedLatency = "10-30s";
      }
      // Creative tasks
      else if (lower.includes("write") || lower.includes("poem") || lower.includes("story") || lower.includes("creative")) {
        category = "creative";
        complexity = "medium";
        model = "claude-3-5-sonnet";
        reasoning = "Creative generation task";
        estimatedCost = "$0.003";
        estimatedLatency = "2-4s";
      }
      // Code tasks
      else if (lower.includes("code") || lower.includes("function") || lower.includes("debug") || lower.includes("error")) {
        category = "code";
        complexity = "medium";
        model = "claude-3-5-sonnet";
        reasoning = "Programming/debugging task";
        estimatedCost = "$0.003";
        estimatedLatency = "1-3s";
      }
      // Casual conversation
      else if (lower.includes("hi") || lower.includes("hello") || lower.includes("how are") || lower.includes("thanks")) {
        category = "conversation";
        complexity = "low";
        model = "gpt-4o-mini";
        reasoning = "Casual conversation, no complex task";
        estimatedCost = "$0.0001";
        estimatedLatency = "0.2-0.4s";
      }

      setResult({
        model,
        category,
        complexity,
        reasoning,
        estimatedCost,
        estimatedLatency,
      });
      setIsRouting(false);
    }, 500);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      simulateRouting(prompt);
    }
  }, [prompt, simulateRouting]);

  const getModelColor = (model: string) => {
    if (model.includes("mini")) return "cyan";
    if (model.includes("o1")) return "violet";
    if (model.includes("claude")) return "amber";
    return "emerald";
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to see how it would be routed..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isRouting}
            className={cn(
              "absolute bottom-3 right-3 p-2 rounded-lg transition-all",
              prompt.trim() && !isRouting
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {examplePrompts.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPrompt(ex);
                simulateRouting(ex);
              }}
              className="px-2 py-1 text-xs rounded bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {ex.slice(0, 30)}{ex.length > 30 ? "..." : ""}
            </button>
          ))}
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className="p-4 rounded-lg bg-muted/20 border border-border animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">Routing Decision</h4>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              `bg-${getModelColor(result.model)}-500/20 text-${getModelColor(result.model)}-400`
            )} style={{
              backgroundColor: `var(--${getModelColor(result.model)}-500-20, rgba(100,150,200,0.2))`,
              color: `var(--${getModelColor(result.model)}-400, rgb(100,180,220))`,
            }}>
              {result.model}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="text-sm font-medium">{result.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Complexity</div>
                <div className="text-sm font-medium">{result.complexity}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
                <div className="text-sm font-medium">{result.estimatedCost}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Est. Latency</div>
                <div className="text-sm font-medium">{result.estimatedLatency}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">{result.reasoning}</div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>gpt-4o-mini: Fast & cheap</span>
        </div>
        <div className="flex items-center gap-1">
          <Brain className="w-3 h-3 text-violet-400" />
          <span>o1: Deep reasoning</span>
        </div>
        <div className="flex items-center gap-1">
          <Code2 className="w-3 h-3 text-amber-400" />
          <span>claude: Code & creative</span>
        </div>
      </div>
    </div>
  );
}

export function ModelRoutingSection() {
  return (
    <section id="model-routing" className="scroll-mt-20">
      <SectionHeading
        id="model-routing-heading"
        title="Model Routing"
        subtitle="Intelligent routing with small models and proxy patterns"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Not every task needs a 100B+ parameter model. <strong className="text-foreground">Model routing</strong> is 
          the practice of intelligently directing requests to the most appropriate model based on task complexity, 
          type, or other criteria. By leveraging small, efficient models as routers, you can dramatically reduce 
          costs while maintaining—or even improving—quality.
        </p>

        <h3 id="what-is-model-routing" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What is Model Routing
        </h3>

        <p className="text-muted-foreground">
          Model routing is a meta-layer that sits between your application and your LLM providers. Instead of 
          sending every request to a single model, a router analyzes the incoming task and decides which model 
          should handle it. This decision can be based on:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Task Complexity</h4>
              <p className="text-sm m-0">
                Simple questions → fast, cheap model. Complex reasoning → powerful model.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Task Type</h4>
              <p className="text-sm m-0">
                Creative writing → one model. Code generation → another. Math → specialized model.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Cost Constraints</h4>
              <p className="text-sm m-0">
                Route based on user tier, request budget, or overall cost optimization goals.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Latency Requirements</h4>
              <p className="text-sm m-0">
                Real-time features → smaller, faster models. Batch processing → larger, more capable ones.
              </p>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          language="typescript"
          filename="router-concept.ts"
          code={`// The routing pattern
type RouterDecision = {
  model: string;          // Which model to use
  confidence: number;     // How certain the router is
  reasoning?: string;     // Why this model was chosen
};

async function routeRequest(prompt: string): Promise<RouterDecision> {
  // A tiny model analyzes the prompt and decides
  const analysis = await tinyRouter.analyze(prompt);
  
  if (analysis.complexity === "simple") {
    return { model: "gpt-4o-mini", confidence: 0.95 };
  }
  if (analysis.taskType === "reasoning") {
    return { model: "o1", confidence: 0.88 };
  }
  if (analysis.taskType === "creative") {
    return { model: "claude-3-5-sonnet", confidence: 0.91 };
  }
  
  // Default to a balanced option
  return { model: "gpt-4o", confidence: 0.75 };
}`}
        />

        <h3 id="power-of-small-models" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Power of Small Models
        </h3>

        <p className="text-muted-foreground">
          Here's the key insight: <strong className="text-foreground">routing doesn't require intelligence, 
          it requires classification</strong>. A 1.5B or 2B parameter model can classify prompts into 
          categories with remarkable accuracy—and it can do so in milliseconds for fractions of a penny.
        </p>

        <Callout variant="tip" title="Small Models Are Underrated">
          <p>
            Models like Arch-Router (1.5B params), Phi-3 Mini (3.8B), or custom fine-tuned models on 
            Hugging Face can perform classification, routing, and labeling tasks with 90%+ accuracy 
            while being 100x cheaper and 10x faster than large models.
          </p>
        </Callout>

        <p className="text-muted-foreground mt-4">
          Small models excel at tasks that don't require deep reasoning or broad knowledge:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Intent Classification</h4>
              <p className="text-sm m-0">
                "Is this a question, a command, a creative request, or something else?" A small model 
                can answer this instantly, enabling you to route to specialized handlers.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Complexity Assessment</h4>
              <p className="text-sm m-0">
                "Does this require multi-step reasoning or is it straightforward?" Small models can 
                evaluate complexity and route simple tasks to cheap models, saving expensive calls 
                for when they're truly needed.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Data Labeling & Categorization</h4>
              <p className="text-sm m-0">
                Processing thousands of items? A small model can label, tag, and sort data into 
                buckets at scale. Turn unstructured data into structured enums for downstream processing.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Fuzzy Logic & Extraction</h4>
              <p className="text-sm m-0">
                Extract specific fields from messy text, normalize data formats, or make soft 
                categorization decisions. Small models provide the "fuzzy logic" layer your 
                deterministic code can't handle.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Router */}
        <h3 id="try-router" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Try the Router
        </h3>

        <p className="text-muted-foreground">
          See how a router would classify and route different prompts. This simplified demo uses 
          heuristics—a real router might use a small ML model for more nuanced classification.
        </p>

        <InteractiveWrapper
          title="Interactive: Router Simulator"
          description="Enter prompts to see routing decisions"
          icon="🔀"
          colorTheme="cyan"
          minHeight="auto"
        >
          <RouterSimulator />
        </InteractiveWrapper>

        <h3 id="routing-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Routing Strategies
        </h3>

        <p className="text-muted-foreground">
          There are several approaches to implementing model routing, each with different tradeoffs:
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">1. Keyword/Rule-Based Routing</h4>

        <p className="text-muted-foreground mb-4">
          The simplest approach: use pattern matching or keyword detection to route requests. 
          Fast and predictable, but brittle and limited.
        </p>

        <CodeBlock
          language="typescript"
          filename="rule-based-router.ts"
          code={`// Simple but limited
function routeByKeywords(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("code") || lower.includes("function") || lower.includes("debug")) {
    return "code-model";
  }
  if (lower.includes("write") || lower.includes("story") || lower.includes("creative")) {
    return "creative-model";
  }
  if (lower.includes("calculate") || lower.includes("math") || lower.includes("solve")) {
    return "reasoning-model";
  }
  
  return "general-model";
}

// Works for simple cases, but misses nuance:
// "Tell me a story about debugging" → code-model? creative-model?`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">2. Embedding-Based Routing</h4>

        <p className="text-muted-foreground mb-4">
          Use embeddings to compare incoming prompts against example prompts for each category. 
          More flexible than keywords, but requires curating good examples.
        </p>

        <CodeBlock
          language="typescript"
          filename="embedding-router.ts"
          code={`// Pre-compute embeddings for example prompts in each category
const categoryExamples = {
  reasoning: [
    "Solve this math problem step by step",
    "What's the logical flaw in this argument?",
    "Help me think through this decision",
  ],
  creative: [
    "Write a poem about autumn",
    "Generate a story idea for a sci-fi novel",
    "Come up with a catchy tagline",
  ],
  factual: [
    "What year did World War II end?",
    "Who invented the telephone?",
    "What's the capital of France?",
  ],
};

async function routeByEmbedding(prompt: string): Promise<string> {
  const promptEmbedding = await embed(prompt);
  
  let bestCategory = "general";
  let bestSimilarity = 0;
  
  for (const [category, examples] of Object.entries(categoryExamples)) {
    const similarities = await Promise.all(
      examples.map(ex => cosineSimilarity(promptEmbedding, await embed(ex)))
    );
    const avgSimilarity = average(similarities);
    
    if (avgSimilarity > bestSimilarity) {
      bestSimilarity = avgSimilarity;
      bestCategory = category;
    }
  }
  
  return categoryToModel[bestCategory];
}`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">3. LLM-Based Routing (Small Model)</h4>

        <p className="text-muted-foreground mb-4">
          Use a small, fast language model to classify prompts. This is the most flexible approach—the 
          router can understand nuance, handle edge cases, and even explain its decisions.
        </p>

        <CodeBlock
          language="typescript"
          filename="llm-router.ts"
          showLineNumbers
          code={`import { z } from "zod";

// Define the routing schema
const RoutingDecision = z.object({
  category: z.enum([
    "simple_qa",      // Factual questions, quick lookups
    "reasoning",      // Math, logic, multi-step problems
    "creative",       // Writing, brainstorming, generation
    "code",           // Programming tasks
    "conversation",   // Casual chat, follow-ups
  ]),
  complexity: z.enum(["low", "medium", "high"]),
  confidence: z.number().min(0).max(1),
});

async function routeWithSmallModel(prompt: string) {
  // Use a tiny, fast model for classification
  const response = await smallModel.generate({
    model: "arch-router-1.5b", // or any small classifier model
    messages: [{
      role: "system",
      content: \`Analyze the user's prompt and classify it.
        - category: the type of task
        - complexity: how difficult the task is
        - confidence: how certain you are (0-1)
        
        Respond only with valid JSON.\`
    }, {
      role: "user", 
      content: prompt
    }],
    response_format: { type: "json_object" }
  });
  
  const decision = RoutingDecision.parse(JSON.parse(response));
  
  // Map decision to model
  return selectModel(decision);
}

function selectModel(decision: z.infer<typeof RoutingDecision>): string {
  // High complexity always gets powerful models
  if (decision.complexity === "high") {
    return decision.category === "reasoning" ? "o1" : "claude-3-5-sonnet";
  }
  
  // Low complexity can use mini models
  if (decision.complexity === "low") {
    return "gpt-4o-mini";
  }
  
  // Medium complexity - route by category
  const categoryModels = {
    simple_qa: "gpt-4o-mini",
    reasoning: "gpt-4o",
    creative: "claude-3-5-sonnet",
    code: "claude-3-5-sonnet",
    conversation: "gpt-4o-mini",
  };
  
  return categoryModels[decision.category];
}`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">4. Preference-Aligned Routing</h4>

        <p className="text-muted-foreground mb-4">
          Define models by their strengths in natural language, then let the router match prompts 
          to the best-fitting description. This is the approach used by ArchGW.
        </p>

        <CodeBlock
          language="yaml"
          filename="archgw-config.yaml"
          code={`# Define model preferences in natural language
llm_providers:
  - name: reasoning-specialist
    provider: openai
    model: o1
    description: |
      Best for complex reasoning, math problems, logic puzzles,
      multi-step problem solving, and tasks requiring careful thought.
      
  - name: creative-writer
    provider: anthropic
    model: claude-3-5-sonnet
    description: |
      Excels at creative writing, storytelling, brainstorming,
      nuanced communication, and tasks requiring empathy or style.
      
  - name: fast-assistant
    provider: openai
    model: gpt-4o-mini
    description: |
      Quick responses for simple questions, factual lookups,
      summarization, and straightforward tasks. Very cost-effective.
      
  - name: code-expert
    provider: anthropic
    model: claude-3-5-sonnet
    description: |
      Specialized in code generation, debugging, code review,
      and technical explanations. Strong at following conventions.

# The router automatically matches prompts to the best description`}
        />

        <h3 id="routing-tools" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Tools: ArchGW and Alternatives
        </h3>

        <p className="text-muted-foreground">
          Several tools make model routing easier to implement:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">
                <a 
                  href="https://github.com/katanemo/archgw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  ArchGW
                </a>
              </h4>
              <p className="text-sm m-0 mb-2">
                A model-native proxy server that handles routing, guardrails, and unified LLM access. 
                Includes Arch-Router, a 1.5B parameter model fine-tuned for prompt classification.
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Alias-based routing (semantic model names)</li>
                <li>Preference-aligned routing (natural language descriptions)</li>
                <li>Built-in guardrails and logging</li>
                <li>Supports OpenAI, Anthropic, Ollama, and more</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">
                <a 
                  href="https://openrouter.ai/models" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  OpenRouter Auto
                </a>
              </h4>
              <p className="text-sm m-0 mb-2">
                OpenRouter's "auto" mode automatically selects models based on prompt analysis. 
                A hosted solution if you don't want to run your own router.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">
                <a 
                  href="https://github.com/lm-sys/RouteLLM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  RouteLLM
                </a>
              </h4>
              <p className="text-sm m-0 mb-2">
                From LMSYS (creators of Chatbot Arena). Framework for serving LLMs with 
                cost-quality routing. Includes pre-trained routers and supports custom training.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Custom Small Models on Hugging Face</h4>
              <p className="text-sm m-0 mb-2">
                Fine-tune a small model (Phi-3 Mini, Qwen 2.5, etc.) for your specific routing needs. 
                Offers maximum control and can be tailored to your exact categories.
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 id="building-routing-proxies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building Routing Proxies
        </h3>

        <p className="text-muted-foreground">
          Here's a practical example of building your own routing proxy that combines multiple strategies:
        </p>

        <CodeBlock
          language="typescript"
          filename="routing-proxy.ts"
          showLineNumbers
          code={`import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

// Model configurations with cost/capability tradeoffs
const models = {
  "fast": { 
    provider: "openai", 
    model: "gpt-4o-mini",
    costPer1kTokens: 0.00015,
    maxComplexity: "low"
  },
  "balanced": { 
    provider: "openai", 
    model: "gpt-4o",
    costPer1kTokens: 0.0025,
    maxComplexity: "medium"
  },
  "powerful": { 
    provider: "anthropic", 
    model: "claude-3-5-sonnet",
    costPer1kTokens: 0.003,
    maxComplexity: "high"
  },
  "reasoning": { 
    provider: "openai", 
    model: "o1",
    costPer1kTokens: 0.015,
    maxComplexity: "high"
  },
};

// The routing logic
async function route(prompt: string, options?: { 
  maxCost?: number;
  preferLatency?: boolean;
}) {
  // Step 1: Quick heuristics (free, instant)
  const quickCategory = quickClassify(prompt);
  
  // Step 2: If heuristics are confident, use them
  if (quickCategory.confidence > 0.9) {
    return selectModelForCategory(quickCategory.category, options);
  }
  
  // Step 3: Use small model for uncertain cases
  const routerDecision = await classifyWithSmallModel(prompt);
  return selectModelForCategory(routerDecision.category, options);
}

function quickClassify(prompt: string) {
  const lower = prompt.toLowerCase();
  const length = prompt.length;
  
  // Very short prompts are usually simple
  if (length < 50 && !lower.includes("explain") && !lower.includes("why")) {
    return { category: "simple", confidence: 0.85 };
  }
  
  // Explicit reasoning requests
  if (lower.includes("step by step") || lower.includes("think through")) {
    return { category: "reasoning", confidence: 0.92 };
  }
  
  // Code patterns
  if (lower.includes("function") || lower.includes("class ") || lower.includes("error:")) {
    return { category: "code", confidence: 0.88 };
  }
  
  // Default: uncertain
  return { category: "unknown", confidence: 0.3 };
}

async function classifyWithSmallModel(prompt: string) {
  // Call a tiny model running locally or on a cheap endpoint
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "phi3:mini",  // 3.8B params, runs fast locally
      prompt: \`Classify this prompt into exactly one category:
        - simple: basic questions, greetings, quick tasks
        - reasoning: math, logic, multi-step problems
        - creative: writing, brainstorming, generation
        - code: programming, debugging, technical
        
        Prompt: "\${prompt}"
        
        Category:\`,
      stream: false,
    }),
  });
  
  const result = await response.json();
  const category = result.response.trim().toLowerCase();
  
  return { 
    category: ["simple", "reasoning", "creative", "code"].includes(category) 
      ? category 
      : "simple",
    confidence: 0.8 
  };
}

// API endpoint
app.post("/v1/chat/completions", async (c) => {
  const body = await c.req.json();
  const prompt = body.messages.map((m: any) => m.content).join("\\n");
  
  // Route to appropriate model
  const selectedModel = await route(prompt, {
    maxCost: body.max_cost,
    preferLatency: body.prefer_latency,
  });
  
  // Forward to actual provider
  return forwardToProvider(selectedModel, body);
});

export default app;`}
        />

        <Callout variant="info" title="The Routing Overhead">
          <p>
            Routing adds latency (the router call) and cost (router tokens). For this to be 
            worthwhile, the savings from using cheaper models must exceed the routing overhead. 
            In practice, routing pays off when you have high volume and diverse query types.
          </p>
        </Callout>

        <h3 id="routing-use-cases" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Practical Use Cases
        </h3>

        <p className="text-muted-foreground">
          Beyond just picking which LLM to use, small models enable powerful patterns:
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Data Labeling at Scale</h4>

        <CodeBlock
          language="typescript"
          filename="data-labeling.ts"
          code={`// Process thousands of customer feedback items
const feedbackSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  category: z.enum(["bug", "feature_request", "praise", "question", "complaint"]),
  urgency: z.enum(["low", "medium", "high"]),
  product_area: z.string().optional(),
});

async function labelFeedback(items: string[]) {
  // Use a small model for high-volume labeling
  // Cost: ~$0.01 per 1000 items vs $1+ with large models
  
  const results = await Promise.all(
    items.map(async (item) => {
      const response = await smallModel.generate({
        model: "phi3:mini",
        messages: [{
          role: "system",
          content: \`Label the feedback. Return JSON with: 
            sentiment, category, urgency, product_area\`
        }, {
          role: "user",
          content: item
        }],
      });
      
      return feedbackSchema.parse(JSON.parse(response));
    })
  );
  
  return results;
}

// Now you can aggregate, filter, and route to humans
const urgent = results.filter(r => r.urgency === "high");
const bugs = results.filter(r => r.category === "bug");`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">Agent Selection</h4>

        <CodeBlock
          language="typescript"
          filename="agent-router.ts"
          code={`// Route to specialized agents based on task type
const agents = {
  researcher: new ResearchAgent(),   // Web search, fact-finding
  coder: new CodingAgent(),          // Code generation, debugging
  writer: new WritingAgent(),        // Content creation
  analyst: new AnalysisAgent(),      // Data analysis, insights
};

async function routeToAgent(userRequest: string) {
  // Small model picks the right agent
  const agentChoice = await smallModel.classify(userRequest, {
    options: Object.keys(agents),
    prompt: "Which specialist should handle this request?"
  });
  
  const selectedAgent = agents[agentChoice];
  return selectedAgent.handle(userRequest);
}

// Example: "Can you analyze our Q4 sales data and write a report?"
// Router sees: analysis + writing → might use analyst first, then writer`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">Smart Fallbacks</h4>

        <CodeBlock
          language="typescript"
          filename="smart-fallback.ts"
          code={`// Start cheap, escalate only when needed
async function smartComplete(prompt: string) {
  // Try the fast model first
  const quickResponse = await models.fast.complete(prompt);
  
  // Use small model to evaluate quality
  const qualityCheck = await smallModel.evaluate({
    prompt,
    response: quickResponse,
    criteria: ["completeness", "accuracy", "helpfulness"]
  });
  
  // If quality is sufficient, return early (saved $$$)
  if (qualityCheck.score > 0.8) {
    return quickResponse;
  }
  
  // Otherwise, escalate to more powerful model
  console.log("Escalating due to low quality score:", qualityCheck.score);
  return models.powerful.complete(prompt);
}

// This pattern can reduce costs by 60-80% while maintaining quality`}
        />

        <h4 className="text-lg font-medium mt-6 mb-3">Unstructured → Structured Conversion</h4>

        <CodeBlock
          language="typescript"
          filename="fuzzy-extraction.ts"
          code={`// Turn messy text into clean, typed data
const ContactSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(["decision_maker", "influencer", "user", "unknown"]),
});

async function extractContact(messyText: string) {
  // Small model provides the "fuzzy logic" your regex can't
  const extracted = await smallModel.generate({
    model: "qwen2.5:1.5b",
    messages: [{
      role: "system",
      content: \`Extract contact info from text. Return JSON with:
        name, email (if present), phone (if present), 
        company (if mentioned), role (infer from context)\`
    }, {
      role: "user",
      content: messyText
    }],
  });
  
  return ContactSchema.parse(JSON.parse(extracted));
}

// Input: "Hey, this is Mike from Acme Corp. Ring me at 555-1234 
//         when you get a chance. I make the final call on vendors."
// Output: { name: "Mike", phone: "555-1234", company: "Acme Corp", 
//           role: "decision_maker" }`}
        />

        <Callout variant="important" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Not every task needs GPT-4/Claude</strong>—many tasks can be handled by 
              models 100x smaller and cheaper
            </li>
            <li>
              <strong>Small models excel at classification</strong>—routing, labeling, and 
              categorization are their sweet spot
            </li>
            <li>
              <strong>Routing pays off at scale</strong>—the overhead is worth it when you 
              have high volume and diverse queries
            </li>
            <li>
              <strong>Start simple</strong>—keyword rules first, then add ML routing as 
              you gather data on what works
            </li>
            <li>
              <strong>Measure everything</strong>—track which routes are taken and their 
              outcomes to optimize over time
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
