"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
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
  complexityScore: number; // 0-100
  reasoning: string;
  estimatedCost: string;
  estimatedLatency: string;
  complexityFactors: string[];
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
    
    // Simulate routing logic with abstract model tiers and complexity measurement
    setTimeout(() => {
      const lower = input.toLowerCase();
      const length = input.length;
      
      // Calculate complexity score based on multiple factors
      let complexityScore = 0;
      const complexityFactors: string[] = [];
      
      // Length factor (longer = more complex)
      if (length > 200) { complexityScore += 25; complexityFactors.push("Long prompt (+25)"); }
      else if (length > 100) { complexityScore += 15; complexityFactors.push("Medium length (+15)"); }
      else if (length > 50) { complexityScore += 5; complexityFactors.push("Short prompt (+5)"); }
      
      // Reasoning indicators
      if (lower.includes("step by step")) { complexityScore += 30; complexityFactors.push("Step-by-step (+30)"); }
      if (lower.includes("explain") || lower.includes("why")) { complexityScore += 20; complexityFactors.push("Explanation request (+20)"); }
      if (lower.includes("compare") || lower.includes("difference")) { complexityScore += 15; complexityFactors.push("Comparison (+15)"); }
      if (lower.includes("solve") || lower.includes("calculate")) { complexityScore += 25; complexityFactors.push("Problem solving (+25)"); }
      
      // Domain indicators
      if (lower.includes("code") || lower.includes("function") || lower.includes("debug")) { complexityScore += 15; complexityFactors.push("Code task (+15)"); }
      if (lower.includes("legal") || lower.includes("medical") || lower.includes("financial")) { complexityScore += 20; complexityFactors.push("Specialized domain (+20)"); }
      
      // Simplicity indicators (reduce score)
      if (lower.includes("hi ") || lower.includes("hello") || lower.includes("thanks")) { complexityScore -= 30; complexityFactors.push("Simple greeting (-30)"); }
      if (length < 30 && !lower.includes("explain") && !lower.includes("why")) { complexityScore -= 15; complexityFactors.push("Very short query (-15)"); }
      
      // Clamp to 0-100
      complexityScore = Math.max(0, Math.min(100, complexityScore));
      
      let category = "general";
      let complexity = "medium";
      let model = "standard-tier";
      let reasoning = "";
      let estimatedCost = "$0.002";
      let estimatedLatency = "1-2s";

      // Route based on complexity score
      if (complexityScore >= 60) {
        complexity = "high";
        if (lower.includes("step by step") || lower.includes("solve") || lower.includes("calculate")) {
          category = "reasoning";
          model = "reasoning-tier";
          reasoning = "Multi-step reasoning detected";
          estimatedCost = "$0.015";
          estimatedLatency = "10-30s";
        } else {
          category = "complex_analysis";
          model = "premium-tier";
          reasoning = "High complexity requires premium model";
          estimatedCost = "$0.008";
          estimatedLatency = "3-8s";
        }
      } else if (complexityScore >= 30) {
        complexity = "medium";
        if (lower.includes("write") || lower.includes("poem") || lower.includes("story") || lower.includes("creative")) {
          category = "creative";
          model = "creative-tier";
          reasoning = "Creative generation task";
          estimatedCost = "$0.003";
          estimatedLatency = "2-4s";
        } else if (lower.includes("code") || lower.includes("function") || lower.includes("debug") || lower.includes("error")) {
          category = "code";
          model = "coding-tier";
          reasoning = "Programming/debugging task";
          estimatedCost = "$0.003";
          estimatedLatency = "1-3s";
        } else {
          model = "standard-tier";
          reasoning = "Standard task, balanced model";
        }
      } else {
        category = complexityScore < 15 ? "conversation" : "simple_qa";
        complexity = "low";
        model = "fast-tier";
        reasoning = complexityScore < 15 ? "Casual conversation, no complex task" : "Simple question, fast model sufficient";
        estimatedCost = "$0.0001";
        estimatedLatency = "0.2-0.5s";
      }

      setResult({
        model,
        category,
        complexity,
        complexityScore,
        complexityFactors,
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
    if (model.includes("fast")) return "cyan";
    if (model.includes("reasoning")) return "violet";
    if (model.includes("creative") || model.includes("coding")) return "amber";
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
        <div className="p-4 rounded-lg bg-muted/20 border border-border animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
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

          {/* Complexity Score Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Complexity Score</span>
              <span className={cn(
                "text-sm font-bold",
                result.complexityScore >= 60 ? "text-violet-400" :
                result.complexityScore >= 30 ? "text-amber-400" :
                "text-cyan-400"
              )}>
                {result.complexityScore}/100
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  result.complexityScore >= 60 ? "bg-violet-500" :
                  result.complexityScore >= 30 ? "bg-amber-500" :
                  "bg-cyan-500"
                )}
                style={{ width: `${result.complexityScore}%` }}
              />
            </div>
            {/* Complexity factors */}
            {result.complexityFactors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {result.complexityFactors.map((factor, i) => (
                  <span 
                    key={i}
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded",
                      factor.includes("+") ? "bg-violet-500/20 text-violet-400" : "bg-cyan-500/20 text-cyan-400"
                    )}
                  >
                    {factor}
                  </span>
                ))}
              </div>
            )}
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

          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">{result.reasoning}</div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>fast-tier: Quick & economical</span>
        </div>
        <div className="flex items-center gap-1">
          <Brain className="w-3 h-3 text-violet-400" />
          <span>reasoning-tier: Deep thinking</span>
        </div>
        <div className="flex items-center gap-1">
          <Code2 className="w-3 h-3 text-amber-400" />
          <span>creative/coding: Specialized</span>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground mt-2">
        Note: Map these tiers to actual models (e.g., GPT-4, Claude, Gemini) based on your provider and current pricing.
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

        <p className="text-muted-foreground">
          The routing pattern uses a tiny model to analyze prompts and decide which model to use. The router 
          returns a decision with the model name, confidence level, and optional reasoning. Based on task 
          complexity or type, it routes to appropriate models: simple tasks to fast/cheap models, reasoning 
          tasks to specialized models, creative tasks to creative models, with a balanced default option.
        </p>

        <h3 id="power-of-small-models" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Power of Small Models
        </h3>

        <p className="text-muted-foreground">
          Here&apos;s the key insight: <strong className="text-foreground">routing doesn&apos;t require intelligence, 
          it requires classification</strong>. A 1.5B or 2B parameter model can classify prompts into 
          categories with remarkable accuracy—and it can do so in milliseconds for fractions of a penny.
        </p>

        <Callout variant="tip" title="Small Models Are Underrated">
          <p>
            Specialized routing models with 1-4B parameters (like Arch-Router, Phi-series, or custom 
            fine-tuned models) can perform classification, routing, and labeling tasks with 90%+ 
            accuracy while being 100x cheaper and 10x faster than large models. The specific models 
            available evolve rapidly—focus on the pattern, not specific model names.
          </p>
        </Callout>

        <p className="text-muted-foreground mt-4">
          Small models excel at tasks that don&apos;t require deep reasoning or broad knowledge:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Intent Classification</h4>
              <p className="text-sm m-0">
                &quot;Is this a question, a command, a creative request, or something else?&quot; A small model 
                can answer this instantly, enabling you to route to specialized handlers.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Complexity Assessment</h4>
              <p className="text-sm m-0">
                &quot;Does this require multi-step reasoning or is it straightforward?&quot; Small models can 
                evaluate complexity and route simple tasks to cheap models, saving expensive calls 
                for when they&apos;re truly needed.
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
                categorization decisions. Small models provide the &quot;fuzzy logic&quot; layer your 
                deterministic code can&apos;t handle.
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

        <p className="text-muted-foreground">
          Keyword-based routing uses simple string matching to categorize prompts. It works for simple cases 
          but misses nuance—for example, &quot;Tell me a story about debugging&quot; could match either code-model 
          or creative-model keywords.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">2. Embedding-Based Routing</h4>

        <p className="text-muted-foreground mb-4">
          Use embeddings to compare incoming prompts against example prompts for each category. 
          More flexible than keywords, but requires curating good examples.
        </p>

        <p className="text-muted-foreground">
          Embedding-based routing pre-computes embeddings for example prompts in each category, then compares 
          incoming prompt embeddings using cosine similarity. It finds the category with the highest average 
          similarity and routes to the corresponding model. More flexible than keywords but requires curating 
          good examples.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">3. LLM-Based Routing (Small Model)</h4>

        <p className="text-muted-foreground mb-4">
          Use a small, fast language model to classify prompts. This is the most flexible approach—the 
          router can understand nuance, handle edge cases, and even explain its decisions.
        </p>

        <p className="text-muted-foreground">
          LLM-based routing uses a small, fast language model to classify prompts. Define a routing schema 
          with categories (simple_qa, reasoning, creative, code, conversation), complexity levels, and confidence. 
          The small model analyzes the prompt and returns structured output. Then map the decision to models: 
          high complexity gets powerful models, low complexity uses mini models, and medium complexity routes 
          by category. This is the most flexible approach and can handle nuance and edge cases.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">4. Preference-Aligned Routing</h4>

        <p className="text-muted-foreground mb-4">
          Define models by their strengths in natural language, then let the router match prompts 
          to the best-fitting description. This is the approach used by ArchGW.
        </p>

        <p className="text-muted-foreground">
          Preference-aligned routing defines models by their strengths in natural language descriptions. The router 
          automatically matches prompts to the best-fitting description. For example, define a reasoning-specialist 
          for complex reasoning tasks, a creative-writer for creative tasks, a fast-assistant for simple questions, 
          and a code-expert for programming tasks. This approach is used by tools like ArchGW.
        </p>

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
                OpenRouter&apos;s &quot;auto&quot; mode automatically selects models based on prompt analysis. 
                A hosted solution if you don&apos;t want to run your own router.
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

        <h3 id="model-aliases-fallbacks" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Model Aliases and Fallbacks
        </h3>

        <p className="text-muted-foreground">
          Two essential patterns for production AI systems: <strong className="text-foreground">model aliases</strong> and 
          <strong className="text-foreground"> fallback chains</strong>. Aliases decouple your code from specific models, 
          while fallbacks ensure reliability when providers fail.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Model Aliases</h4>

        <p className="text-muted-foreground mb-4">
          Instead of hardcoding &quot;gpt-4o&quot; or &quot;claude-3-sonnet&quot; throughout your codebase, define 
          semantic aliases that describe the <em>capability</em> you need:
        </p>

        <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm mb-4">
          <div className="text-muted-foreground">{/* config/models.ts */}</div>
          <div className="mt-2">
            <span className="text-violet-400">export const</span> <span className="text-cyan-400">MODEL_ALIASES</span> = {'{'}
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;fast&quot;</span>: <span className="text-emerald-400">&quot;gpt-4o-mini&quot;</span>,
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;balanced&quot;</span>: <span className="text-emerald-400">&quot;gpt-4o&quot;</span>,
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;reasoning&quot;</span>: <span className="text-emerald-400">&quot;o1&quot;</span>,
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;creative&quot;</span>: <span className="text-emerald-400">&quot;claude-3-5-sonnet&quot;</span>,
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;code&quot;</span>: <span className="text-emerald-400">&quot;claude-3-5-sonnet&quot;</span>,
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;cheap&quot;</span>: <span className="text-emerald-400">&quot;gemini-1.5-flash&quot;</span>,
          </div>
          {'}'};
        </div>

        <p className="text-muted-foreground">
          Benefits: swap models without code changes, A/B test easily, respond to pricing changes instantly, 
          and keep your codebase readable (&quot;use the fast model&quot; vs &quot;use gpt-4o-mini-2024-07-18&quot;).
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Fallback Chains</h4>

        <p className="text-muted-foreground mb-4">
          Never let a single provider outage break your system. Define fallback chains that try alternative 
          models when the primary fails:
        </p>

        <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm mb-4">
          <div className="text-muted-foreground">{/* Fallback chain for each alias */}</div>
          <div className="mt-2">
            <span className="text-violet-400">const</span> <span className="text-cyan-400">FALLBACK_CHAINS</span> = {'{'}
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;balanced&quot;</span>: [<span className="text-emerald-400">&quot;gpt-4o&quot;</span>, <span className="text-emerald-400">&quot;claude-3-5-sonnet&quot;</span>, <span className="text-emerald-400">&quot;gemini-1.5-pro&quot;</span>],
          </div>
          <div className="pl-4">
            <span className="text-amber-400">&quot;fast&quot;</span>: [<span className="text-emerald-400">&quot;gpt-4o-mini&quot;</span>, <span className="text-emerald-400">&quot;claude-3-haiku&quot;</span>, <span className="text-emerald-400">&quot;gemini-1.5-flash&quot;</span>],
          </div>
          {'}'};
          <div className="mt-4">
            <span className="text-violet-400">async function</span> <span className="text-cyan-400">callWithFallback</span>(alias, prompt) {'{'}
          </div>
          <div className="pl-4">
            <span className="text-violet-400">for</span> (<span className="text-violet-400">const</span> model <span className="text-violet-400">of</span> FALLBACK_CHAINS[alias]) {'{'}
          </div>
          <div className="pl-8">
            <span className="text-violet-400">try</span> {'{'} <span className="text-violet-400">return await</span> call(model, prompt); {'}'}
          </div>
          <div className="pl-8">
            <span className="text-violet-400">catch</span> (e) {'{'} log(<span className="text-emerald-400">`${'{'}</span>model{'}'} failed, trying next...`); {'}'}
          </div>
          <div className="pl-4">{'}'}</div>
          <div className="pl-4">
            <span className="text-violet-400">throw new</span> Error(<span className="text-emerald-400">&quot;All models failed&quot;</span>);
          </div>
          {'}'}
        </div>

        <Callout variant="tip" title="Combine Aliases + Fallbacks + Routing">
          <p>
            The most robust pattern: routing decides the <em>capability tier</em> (alias), the alias 
            maps to a <em>primary model</em>, and fallbacks provide <em>redundancy</em>. This gives 
            you cost optimization, reliability, and flexibility all in one.
          </p>
        </Callout>

        <h3 id="building-routing-proxies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building Routing Proxies
        </h3>

        <p className="text-muted-foreground">
          Here&apos;s a practical example of building your own routing proxy that combines multiple strategies:
        </p>

        <p className="text-muted-foreground">
          A practical routing proxy combines multiple strategies: define model configurations with cost/capability 
          tradeoffs, use quick heuristics for confident classifications (free, instant), fall back to a small model 
          for uncertain cases, and expose an API endpoint that routes requests to the appropriate model based on 
          the prompt and constraints. This hybrid approach balances speed, cost, and accuracy.
        </p>

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

        <p className="text-muted-foreground">
          Use small models for high-volume data labeling tasks like processing customer feedback. Define a schema 
          for the labels (sentiment, category, urgency, product area), then use a small model to classify each 
          item. This costs ~$0.01 per 1000 items vs $1+ with large models. After labeling, you can aggregate, 
          filter, and route to humans based on urgency or category.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Agent Selection</h4>

        <p className="text-muted-foreground">
          Route to specialized agents based on task type. Define agents for different domains (research, coding, 
          writing, analysis), then use a small model to classify the user request and select the appropriate agent. 
          For complex requests that span multiple domains, you might chain agents—for example, use an analyst first, 
          then a writer.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Smart Fallbacks</h4>

        <p className="text-muted-foreground">
          Smart fallback pattern: start with a fast, cheap model, then use a small model to evaluate the quality 
          of the response. If quality is sufficient (score {'>'} 0.8), return early and save costs. Otherwise, escalate 
          to a more powerful model. This pattern can reduce costs by 60-80% while maintaining quality.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-3">Unstructured → Structured Conversion</h4>

        <p className="text-muted-foreground">
          Use small models for unstructured-to-structured conversion. Define a schema for the data you want to extract, 
          then use a small model to parse messy text into clean, typed data. Small models provide the &quot;fuzzy logic&quot; 
          that regex can&apos;t handle—they can infer context, handle variations, and extract information even when the 
          format is inconsistent.
        </p>

        <Callout variant="important" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Not every task needs premium models</strong>—many tasks can be handled by 
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
            <li>
              <strong>Models change constantly</strong>—design for abstract tiers, not specific 
              model names, so you can swap providers easily
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
