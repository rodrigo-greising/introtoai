"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { Sparkles, Trash2, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

// =============================================================================
// Signal to Noise Visualizer
// =============================================================================

interface ContextItem {
  id: string;
  content: string;
  tokens: number;
  relevance: "high" | "medium" | "low" | "noise";
  type: "system" | "instruction" | "context" | "user";
}

const sampleContext: ContextItem[] = [
  { id: "sys", content: "You are a helpful coding assistant.", tokens: 15, relevance: "high", type: "system" },
  { id: "inst1", content: "Always use TypeScript.", tokens: 10, relevance: "high", type: "instruction" },
  { id: "inst2", content: "Follow best practices.", tokens: 8, relevance: "medium", type: "instruction" },
  { id: "history1", content: "User asked about React hooks 2 days ago...", tokens: 150, relevance: "low", type: "context" },
  { id: "history2", content: "User mentioned they like coffee...", tokens: 50, relevance: "noise", type: "context" },
  { id: "doc1", content: "React useState documentation: useState is a Hook that...", tokens: 200, relevance: "high", type: "context" },
  { id: "doc2", content: "History of JavaScript: JavaScript was created in 1995...", tokens: 300, relevance: "noise", type: "context" },
  { id: "doc3", content: "useEffect cleanup patterns: When returning a function...", tokens: 180, relevance: "high", type: "context" },
  { id: "user", content: "How do I clean up a useEffect?", tokens: 15, relevance: "high", type: "user" },
];

function SignalNoiseVisualizer() {
  const [items, setItems] = useState<ContextItem[]>(sampleContext);
  const [showOptimized, setShowOptimized] = useState(false);

  const relevanceColors = {
    high: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", label: "High Signal" },
    medium: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", label: "Medium" },
    low: { bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-400", label: "Low Value" },
    noise: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", label: "Noise" },
  };

  const totalTokens = items.reduce((sum, i) => sum + i.tokens, 0);
  const signalTokens = items.filter(i => i.relevance === "high").reduce((sum, i) => sum + i.tokens, 0);
  const noiseTokens = items.filter(i => i.relevance === "noise" || i.relevance === "low").reduce((sum, i) => sum + i.tokens, 0);
  const signalRatio = totalTokens > 0 ? (signalTokens / totalTokens * 100).toFixed(1) : 0;

  const optimizedItems = items.filter(i => i.relevance !== "noise" && i.relevance !== "low");
  const displayItems = showOptimized ? optimizedItems : items;
  const displayTotal = displayItems.reduce((sum, i) => sum + i.tokens, 0);

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const resetItems = () => {
    setItems(sampleContext);
    setShowOptimized(false);
  };

  const coreLogic = `// Context Engineering: Maximize Signal, Minimize Noise

interface ContextItem {
  content: string;
  relevance: 'high' | 'medium' | 'low' | 'noise';
  tokens: number;
}

function optimizeContext(items: ContextItem[], budget: number): ContextItem[] {
  // Step 1: Remove obvious noise
  const filtered = items.filter(i => i.relevance !== 'noise');
  
  // Step 2: Sort by relevance (high first)
  const sorted = filtered.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.relevance] - order[b.relevance];
  });
  
  // Step 3: Fit within budget, prioritizing high-relevance items
  const result: ContextItem[] = [];
  let used = 0;
  
  for (const item of sorted) {
    if (used + item.tokens <= budget) {
      result.push(item);
      used += item.tokens;
    }
  }
  
  return result;
}

// Key principle: Every token must earn its place
// Ask: "Does this information help the model complete the task?"`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Signal-to-Noise Optimization"
      description="How to prioritize and filter context for better results"
    >
      <div className="space-y-4">
        {/* Stats bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="font-medium text-foreground">{displayTotal} tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">Signal Ratio:</span>{" "}
              <span className={cn(
                "font-medium",
                Number(signalRatio) > 70 ? "text-emerald-400" : Number(signalRatio) > 40 ? "text-amber-400" : "text-rose-400"
              )}>
                {signalRatio}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOptimized(!showOptimized)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                showOptimized
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
              )}
            >
              {showOptimized ? "Show All" : "Show Optimized"}
            </button>
            <button
              onClick={resetItems}
              className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:bg-muted transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Context items */}
        <div className="space-y-2">
          {displayItems.map((item) => {
            const colors = relevanceColors[item.relevance];
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all",
                  colors.bg,
                  colors.border,
                  item.relevance === "noise" && "opacity-60"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-medium uppercase tracking-wider", colors.text)}>
                      {colors.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {item.type} • {item.tokens} tokens
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.content}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors ml-2"
                  title="Remove from context"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Signal ratio visualization */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-2">Token Distribution</div>
          <div className="h-4 rounded-full overflow-hidden flex bg-muted">
            {items.map((item) => {
              const width = (item.tokens / totalTokens) * 100;
              const colors = {
                high: "bg-emerald-500",
                medium: "bg-amber-500",
                low: "bg-orange-500",
                noise: "bg-rose-500",
              };
              return (
                <div
                  key={item.id}
                  className={cn(colors[item.relevance], "transition-all duration-300")}
                  style={{ width: `${width}%` }}
                  title={`${item.content.slice(0, 30)}... (${item.tokens} tokens)`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                High signal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Noise
              </span>
            </div>
          </div>
        </div>

        {/* Key insight */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-cyan-400">Insight:</strong> Removing {noiseTokens} tokens of noise 
            not only saves cost—it often <em>improves</em> output quality by reducing distraction.
          </p>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function ContextPrinciplesSection() {
  return (
    <section id="context-principles" className="scroll-mt-20">
      <SectionHeading
        id="context-principles-heading"
        title="Context Principles"
        subtitle="The theoretical foundations of effective context"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Context engineering is the art of providing LLMs with exactly the right information 
          to produce quality outputs. Too little context and the model lacks necessary information; 
          too much and you waste tokens, increase cost, and can actually <em>decrease</em> quality.
        </p>

        <Callout variant="tip" title="The Core Philosophy">
          <p>
            Every token in your context should <strong>earn its place</strong>. Ask: &quot;Does 
            this information help the model complete the task?&quot; If not, it&apos;s noise that 
            costs money and potentially harms output quality.
          </p>
        </Callout>

        {/* Principle 1: Signal Over Noise */}
        <h3 id="signal-over-noise" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Signal Over Noise
        </h3>

        <p className="text-muted-foreground">
          The most important principle: <strong className="text-foreground">maximize the signal-to-noise 
          ratio</strong> of your context. High-signal content directly helps the task; noise is 
          anything that doesn&apos;t contribute—or worse, distracts.
        </p>

        <InteractiveWrapper
          title="Interactive: Signal-to-Noise Analysis"
          description="Explore how noise affects your context and practice removing it"
          icon={<Sparkles className="w-4 h-4" />}
          colorTheme="cyan"
          minHeight="auto"
        >
          <SignalNoiseVisualizer />
        </InteractiveWrapper>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-medium text-foreground mb-2">High Signal Examples</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Relevant documentation for the task</li>
                <li>Error messages being debugged</li>
                <li>User preferences that affect output</li>
                <li>Code that needs modification</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <AlertTriangle className="w-5 h-5 text-rose-400 mb-2" />
              <h4 className="font-medium text-foreground mb-2">Common Noise</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Old conversation history (stale context)</li>
                <li>Unrelated files in codebase searches</li>
                <li>Verbose boilerplate in examples</li>
                <li>Redundant instructions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Principle 2: Explicit Over Implicit */}
        <h3 id="explicit-over-implicit" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Explicit Over Implicit
        </h3>

        <p className="text-muted-foreground">
          LLMs can&apos;t read your mind. Information you think is &quot;obvious&quot; may not be obvious 
          to the model. <strong className="text-foreground">State things explicitly</strong>—even 
          if it feels redundant.
        </p>

        <CodeBlock
          language="typescript"
          filename="explicit-context.ts"
          code={`// ❌ IMPLICIT: Assumes the model knows your conventions
const prompt = \`Fix the bug in the user service\`;

// ✅ EXPLICIT: States exactly what you need
const prompt = \`
  Fix the authentication bug in src/services/user.ts.
  
  The bug: Users get logged out after 5 minutes even with
  "remember me" checked. Expected behavior is 30-day sessions.
  
  Our stack:
  - Node.js 20 with Express
  - JWT tokens with refresh mechanism
  - Session stored in Redis
  
  Constraints:
  - Don't change the JWT library
  - Maintain backward compatibility with existing tokens
  - Add logging for debugging
\`;`}
        />

        <Callout variant="important">
          <p>
            The &quot;Lost in the Middle&quot; effect: research shows LLMs pay less attention to content 
            in the middle of long contexts. Put the most critical information at the <strong>beginning</strong> or 
            <strong>end</strong> of your prompt.
          </p>
        </Callout>

        {/* Principle 3: Separation of Concerns */}
        <h3 id="separation-of-concerns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Separation of Concerns
        </h3>

        <p className="text-muted-foreground">
          Don&apos;t try to do everything in one giant context. <strong className="text-foreground">Break 
          complex tasks into focused sub-tasks</strong>, each with its own minimal, targeted context.
        </p>

        <div className="my-6 p-5 rounded-xl bg-card border border-border">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-1 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <div className="text-sm text-rose-400 mb-2">❌ Monolithic</div>
              <div className="text-sm text-muted-foreground">
                One prompt with 50K tokens containing: all code, all docs, all history, all tools
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground shrink-0 rotate-90 sm:rotate-0" />
            <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-sm text-emerald-400 mb-2">✅ Decomposed</div>
              <div className="text-sm text-muted-foreground">
                Task 1: Analyze (5K tokens) → Task 2: Plan (3K) → Task 3: Implement (8K)
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          This principle connects to orchestration patterns we&apos;ll cover in Part 5. The key insight: 
          <strong className="text-foreground"> smaller, focused contexts often outperform larger, 
          all-inclusive ones</strong>—both in quality and cost.
        </p>

        {/* Principle 4: Attention Patterns */}
        <h3 id="attention-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Attention Patterns
        </h3>

        <p className="text-muted-foreground">
          Understanding how LLMs process context helps you structure it better. Key patterns:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Recency Bias</h4>
              <p className="text-sm text-muted-foreground m-0">
                Models tend to give more weight to recent tokens. Put your most important 
                instructions near the end, just before the user&apos;s message.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Primacy Effect</h4>
              <p className="text-sm text-muted-foreground m-0">
                The system prompt at the beginning sets the &quot;identity&quot; and often receives 
                strong attention. Use it to establish core behaviors and constraints.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Structure Helps</h4>
              <p className="text-sm text-muted-foreground m-0">
                Clear section headers, bullet points, and formatting help the model parse 
                and reference your context. XML-like tags work well for separating sections.
              </p>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          language="typescript"
          filename="structured-context.ts"
          code={`// Well-structured context with clear sections
const context = \`
<system>
You are a code review assistant. Be concise but thorough.
</system>

<code_to_review>
\${codeToReview}
</code_to_review>

<review_criteria>
- Check for security vulnerabilities
- Verify error handling
- Assess performance implications
</review_criteria>

<user_request>
\${userRequest}
</user_request>
\`;

// The model can now easily reference specific sections
// and the structure makes your intent clear`}
        />

        <Callout variant="tip" title="Coming Up: Layered Architecture">
          <p>
            In the next section, we&apos;ll apply these principles to build a <strong>layered 
            context architecture</strong>—a practical framework for organizing context 
            from static system prompts to dynamic user messages.
          </p>
        </Callout>
      </div>
    </section>
  );
}
