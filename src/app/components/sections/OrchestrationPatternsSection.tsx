"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  ArrowRight,
  GitBranch,
  Repeat,
  Shuffle,
  Shield,
  Users,
  Zap,
} from "lucide-react";

// =============================================================================
// Orchestration Pattern Library
// =============================================================================

type PatternId = "chain" | "router" | "parallel" | "fallback" | "orchestrator" | "evaluator";

interface Pattern {
  id: PatternId;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  whenToUse: string[];
  diagram: React.ReactNode;
  code: string;
}

function PatternLibrary() {
  const [activePattern, setActivePattern] = useState<PatternId>("chain");

  const patterns: Pattern[] = [
    {
      id: "chain",
      name: "Prompt Chain",
      icon: <ArrowRight className="w-4 h-4" />,
      color: "cyan",
      description: "Sequential pipeline where each step's output feeds the next",
      whenToUse: [
        "Tasks with natural stages",
        "When output format changes between steps",
        "Building complex outputs incrementally",
      ],
      diagram: (
        <div className="flex items-center justify-center gap-2 py-4">
          {["Input", "Step 1", "Step 2", "Step 3", "Output"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium",
                i === 0 || i === arr.length - 1
                  ? "bg-muted/50 text-muted-foreground"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              )}>
                {step}
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      ),
      code: `// Prompt Chain: Each step transforms the output
async function promptChain(input: string) {
  // Step 1: Extract key information
  const extracted = await llm.complete({
    prompt: \`Extract entities from: \${input}\`
  });
  
  // Step 2: Enrich with context
  const enriched = await llm.complete({
    prompt: \`Add context to these entities: \${extracted}\`
  });
  
  // Step 3: Generate final output
  const output = await llm.complete({
    prompt: \`Create a summary from: \${enriched}\`
  });
  
  return output;
}`,
    },
    {
      id: "router",
      name: "Router",
      icon: <GitBranch className="w-4 h-4" />,
      color: "violet",
      description: "Classify input and route to specialized handlers",
      whenToUse: [
        "Different input types need different processing",
        "Optimizing for cost (simple → cheap model)",
        "Domain-specific expertise required",
      ],
      diagram: (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Input</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-medium border border-violet-500/30">
            Classifier
          </div>
          <div className="flex items-center gap-4">
            {["Handler A", "Handler B", "Handler C"].map((h) => (
              <div key={h} className="flex flex-col items-center gap-1">
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                <div className="px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400/80 text-xs font-medium border border-violet-500/20">
                  {h}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      code: `// Router: Classify and delegate
async function router(input: string) {
  // Classify the input (can use small, cheap model)
  const category = await classifier.classify(input);
  
  // Route to specialized handler
  switch (category) {
    case "code_question":
      return await codeExpertAgent(input);
    case "factual_query":
      return await ragPipeline(input);
    case "creative_writing":
      return await creativeAgent(input);
    case "simple_qa":
      return await cheapModel.complete(input); // Cost optimization
    default:
      return await generalAgent(input);
  }
}`,
    },
    {
      id: "parallel",
      name: "Parallelization",
      icon: <Zap className="w-4 h-4" />,
      color: "amber",
      description: "Run independent tasks concurrently and merge results",
      whenToUse: [
        "Tasks have no dependencies on each other",
        "Latency is critical",
        "Processing multiple items uniformly",
      ],
      diagram: (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Input</div>
          <div className="flex items-center gap-8">
            {["Task 1", "Task 2", "Task 3"].map((t) => (
              <div key={t} className="flex flex-col items-center gap-1">
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                <div className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                  {t}
                </div>
              </div>
            ))}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
            Merge
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Output</div>
        </div>
      ),
      code: `// Parallelization: Concurrent execution
async function parallel(items: Item[]) {
  // Fan out: Execute all tasks concurrently
  const results = await Promise.all(
    items.map(item => processItem(item))
  );
  
  // Merge: Combine results
  return await mergeResults(results);
}

// Sectioning variant: Split input into parallel chunks
async function sectionedParallel(document: string) {
  const sections = splitIntoSections(document);
  
  // Process each section in parallel
  const summaries = await Promise.all(
    sections.map(s => summarize(s))
  );
  
  // Combine into final summary
  return await combineSummaries(summaries);
}`,
    },
    {
      id: "fallback",
      name: "Fallback",
      icon: <Shield className="w-4 h-4" />,
      color: "emerald",
      description: "Try primary approach, fall back on failure",
      whenToUse: [
        "Primary model may fail or be unavailable",
        "Handling rate limits gracefully",
        "Degrading gracefully under load",
      ],
      diagram: (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Input</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
            Primary (GPT-4)
          </div>
          <div className="text-xs text-muted-foreground">↓ on failure</div>
          <div className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400/80 text-xs font-medium border border-emerald-500/20">
            Fallback (Claude)
          </div>
          <div className="text-xs text-muted-foreground">↓ on failure</div>
          <div className="px-3 py-2 rounded-lg bg-emerald-500/5 text-emerald-400/60 text-xs font-medium border border-emerald-500/10">
            Fallback (Local)
          </div>
        </div>
      ),
      code: `// Fallback: Graceful degradation
async function withFallback(input: string) {
  const providers = [
    { name: "gpt-4", fn: () => openai.complete(input) },
    { name: "claude", fn: () => anthropic.complete(input) },
    { name: "local", fn: () => localModel.complete(input) },
  ];
  
  for (const provider of providers) {
    try {
      return await provider.fn();
    } catch (error) {
      console.warn(\`\${provider.name} failed, trying next...\`);
      continue;
    }
  }
  
  throw new Error("All providers failed");
}

// With retry logic
async function withRetry(fn: () => Promise<T>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}`,
    },
    {
      id: "orchestrator",
      name: "Orchestrator-Worker",
      icon: <Users className="w-4 h-4" />,
      color: "rose",
      description: "Central coordinator delegates to specialized workers",
      whenToUse: [
        "Complex multi-step tasks",
        "Dynamic task planning needed",
        "Workers have different capabilities",
      ],
      diagram: (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Task</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/30">
            Orchestrator (plans & coordinates)
          </div>
          <div className="flex items-center gap-4">
            {["Search", "Analyze", "Write"].map((w) => (
              <div key={w} className="flex flex-col items-center gap-1">
                <Repeat className="w-3 h-3 text-muted-foreground" />
                <div className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400/80 text-xs font-medium border border-rose-500/20">
                  {w}
                </div>
              </div>
            ))}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Result</div>
        </div>
      ),
      code: `// Orchestrator-Worker: Dynamic task delegation
async function orchestratorWorker(task: string) {
  const workers = {
    search: searchWorker,
    analyze: analysisWorker,
    write: writingWorker,
    code: codingWorker,
  };
  
  // Orchestrator plans the work
  const plan = await orchestrator.plan(task, Object.keys(workers));
  
  // Execute plan, potentially with iterations
  let context = { task };
  
  for (const step of plan.steps) {
    const worker = workers[step.worker];
    const result = await worker.execute(step.subtask, context);
    
    context = { ...context, [step.id]: result };
    
    // Orchestrator can replan based on results
    if (step.checkProgress) {
      const shouldContinue = await orchestrator.evaluate(context);
      if (!shouldContinue) break;
    }
  }
  
  return await orchestrator.synthesize(context);
}`,
    },
    {
      id: "evaluator",
      name: "Evaluator-Optimizer",
      icon: <Repeat className="w-4 h-4" />,
      color: "blue",
      description: "Generate, evaluate, refine loop until quality threshold",
      whenToUse: [
        "Quality is critical",
        "First attempt often needs refinement",
        "Clear evaluation criteria exist",
      ],
      diagram: (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Input</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border border-blue-500/30 bg-blue-500/5">
              <div className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                Generate
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
              <div className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                Evaluate
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Pass?</span>
                <Repeat className="w-3 h-3" />
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium">Output</div>
        </div>
      ),
      code: `// Evaluator-Optimizer: Iterative refinement
async function evaluatorOptimizer(input: string, maxIterations = 3) {
  let result = await generator.generate(input);
  
  for (let i = 0; i < maxIterations; i++) {
    // Evaluate current result
    const evaluation = await evaluator.evaluate(result, {
      criteria: ["accuracy", "completeness", "clarity"]
    });
    
    // Check if quality threshold met
    if (evaluation.score >= 0.9) {
      return { result, iterations: i + 1 };
    }
    
    // Refine based on feedback
    result = await generator.refine(result, {
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions
    });
  }
  
  return { result, iterations: maxIterations, warning: "Max iterations reached" };
}`,
    },
  ];

  const activePatternData = patterns.find(p => p.id === activePattern)!;

  return (
    <ViewCodeToggle
      code={activePatternData.code}
      title={activePatternData.name}
      description={activePatternData.description}
    >
      <div className="space-y-4">
        {/* Pattern tabs */}
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setActivePattern(pattern.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                activePattern === pattern.id
                  ? `bg-${pattern.color}-500/20 text-${pattern.color}-400 ring-1 ring-${pattern.color}-500/50`
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              )}
              style={{
                backgroundColor: activePattern === pattern.id ? `var(--${pattern.color}-500-20, rgba(100,150,200,0.2))` : undefined,
                color: activePattern === pattern.id ? `var(--${pattern.color}-400, rgb(100,180,220))` : undefined,
              }}
            >
              {pattern.icon}
              {pattern.name}
            </button>
          ))}
        </div>

        {/* Pattern description */}
        <p className="text-sm text-muted-foreground">
          {activePatternData.description}
        </p>

        {/* Pattern diagram */}
        <div className="rounded-lg bg-muted/20 border border-border">
          {activePatternData.diagram}
        </div>

        {/* When to use */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2">
            When to Use
          </h4>
          <ul className="text-xs text-muted-foreground m-0 pl-4 list-disc space-y-1">
            {activePatternData.whenToUse.map((use, i) => (
              <li key={i}>{use}</li>
            ))}
          </ul>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function OrchestrationPatternsSection() {
  return (
    <section id="orchestration-patterns" className="scroll-mt-20">
      <SectionHeading
        id="orchestration-patterns-heading"
        title="Orchestration Patterns"
        subtitle="Proven patterns for coordinating LLM workflows"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Orchestration patterns are reusable strategies for <strong className="text-foreground">coordinating 
          multiple LLM calls</strong>. Rather than inventing solutions from scratch, you can apply 
          battle-tested patterns that solve common problems.
        </p>

        <Callout variant="tip" title="Composable Patterns">
          <p className="m-0">
            These patterns aren&apos;t mutually exclusive. A real system might use a <strong>router</strong> to 
            classify input, then a <strong>chain</strong> for the happy path, with <strong>fallbacks</strong> for 
            error handling, and <strong>parallelization</strong> within certain steps.
          </p>
        </Callout>

        {/* Pattern Library */}
        <h3 id="pattern-library" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Pattern Library
        </h3>

        <InteractiveWrapper
          title="Interactive: Orchestration Patterns"
          description="Explore common patterns and their implementations"
          icon="🔧"
          colorTheme="violet"
          minHeight="auto"
        >
          <PatternLibrary />
        </InteractiveWrapper>

        {/* Pattern Selection Guide */}
        <h3 id="selection-guide" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Pattern Selection Guide
        </h3>

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Scenario</th>
                <th className="text-left p-3 font-medium text-foreground">Primary Pattern</th>
                <th className="text-left p-3 font-medium text-foreground">Often Combined With</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3">Multi-step document processing</td>
                <td className="p-3 text-cyan-400">Chain</td>
                <td className="p-3">Parallel (for batches)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">Customer support with multiple intents</td>
                <td className="p-3 text-violet-400">Router</td>
                <td className="p-3">Fallback, Chain</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">Batch processing many items</td>
                <td className="p-3 text-amber-400">Parallel</td>
                <td className="p-3">Fallback (per item)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">High-availability service</td>
                <td className="p-3 text-emerald-400">Fallback</td>
                <td className="p-3">Router (for degradation)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">Complex research task</td>
                <td className="p-3 text-rose-400">Orchestrator-Worker</td>
                <td className="p-3">Evaluator, Parallel</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">Content generation with quality bar</td>
                <td className="p-3 text-blue-400">Evaluator-Optimizer</td>
                <td className="p-3">Chain</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Combining Patterns */}
        <h3 id="combining-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Combining Patterns
        </h3>

        <CodeBlock
          language="typescript"
          filename="combined-patterns.ts"
          code={`// Real-world example: Customer support system
async function supportPipeline(message: string) {
  // Router: Classify intent
  const intent = await classifier.classify(message);
  
  switch (intent) {
    case "refund_request":
      // Chain: Multi-step refund process
      return await refundChain(message);
      
    case "technical_issue":
      // Orchestrator-Worker: Complex troubleshooting
      return await techSupportOrchestrator(message);
      
    case "simple_question":
      // Fallback: Try RAG, fall back to general model
      return await withFallback([
        () => ragPipeline(message),
        () => generalModel.complete(message),
      ]);
      
    default:
      // Evaluator-Optimizer: Ensure quality response
      return await evaluatorOptimizer(message);
  }
}

// Each handler can itself use multiple patterns:
async function techSupportOrchestrator(issue: string) {
  // Parallel: Search multiple sources simultaneously
  const [docs, logs, history] = await Promise.all([
    searchDocs(issue),
    fetchRecentLogs(userId),
    getTicketHistory(userId),
  ]);
  
  // Chain: Analyze → Diagnose → Respond
  const analysis = await analyzeContext({ docs, logs, history, issue });
  const diagnosis = await diagnoseIssue(analysis);
  const response = await generateResponse(diagnosis);
  
  // Evaluator: Ensure response quality
  return await evaluateAndRefine(response, { minScore: 0.85 });
}`}
        />

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Start with simple patterns (chain, router)</li>
                <li>Add complexity only when needed</li>
                <li>Make patterns observable (log transitions)</li>
                <li>Set timeouts and limits on iterations</li>
                <li>Test each pattern independently</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Over-engineering simple tasks</li>
                <li>Deeply nested pattern combinations</li>
                <li>Unbounded retry/evaluation loops</li>
                <li>Ignoring failure modes</li>
                <li>Silent failures in fallbacks</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Next: Parallelization" className="mt-8">
          <p className="m-0">
            The next section dives deeper into <strong>parallelization patterns</strong>—when to 
            parallelize, how to manage concurrency limits, and handling partial failures in batch operations.
          </p>
        </Callout>
      </div>
    </section>
  );
}
