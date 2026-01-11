"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  GitBranch, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Eye,
  Brain,
  Zap,
} from "lucide-react";

// =============================================================================
// Comparison Visualizer - Interactive with Animation
// =============================================================================

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  output?: string;
  duration: number;
}

interface AgentStep {
  id: string;
  type: "observe" | "think" | "act" | "complete";
  content: string;
  toolCall?: string;
  toolResult?: string;
  duration: number;
}

const workflowSteps: WorkflowStep[] = [
  { id: "parse", label: "Parse Query", description: "Extract structured filters", output: '{ category: "electronics", maxPrice: 500 }', duration: 300 },
  { id: "validate", label: "Validate", description: "Check against schema", output: "✓ Valid query structure", duration: 200 },
  { id: "query", label: "Query DB", description: "Execute SQL query", output: "SELECT * FROM products WHERE category = 'electronics' AND price <= 500", duration: 500 },
  { id: "transform", label: "Transform", description: "Format results", output: "[{ name: 'Headphones', price: 299 }, ...]", duration: 300 },
  { id: "respond", label: "Respond", description: "Return to user", output: "Found 12 products matching your criteria", duration: 200 },
];

const agentSteps: AgentStep[] = [
  { id: "obs1", type: "observe", content: "User asks: 'Find me good headphones under $500'", duration: 400 },
  { id: "think1", type: "think", content: "User wants headphones. I should search the product database. Let me try a broad search first.", duration: 600 },
  { id: "act1", type: "act", content: "Calling search tool...", toolCall: "search_products({ query: 'headphones', maxPrice: 500 })", toolResult: "Found 47 results - too many to show", duration: 800 },
  { id: "obs2", type: "observe", content: "Got 47 results. That's a lot - user said 'good' headphones, they probably want quality items.", duration: 400 },
  { id: "think2", type: "think", content: "I should filter for highly-rated items. Let me refine the search.", duration: 500 },
  { id: "act2", type: "act", content: "Calling search with rating filter...", toolCall: "search_products({ query: 'headphones', maxPrice: 500, minRating: 4.5 })", toolResult: "Found 8 premium headphones", duration: 700 },
  { id: "complete", type: "complete", content: "Here are 8 highly-rated headphones under $500: Sony WH-1000XM5 ($349), Bose QC45 ($279)...", duration: 500 },
];

function ComparisonVisualizer() {
  const [mode, setMode] = useState<"side-by-side" | "workflow" | "agent">("side-by-side");
  const [workflowIndex, setWorkflowIndex] = useState(-1);
  const [agentIndex, setAgentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workflowTime, setWorkflowTime] = useState(0);
  const [agentTime, setAgentTime] = useState(0);

  const reset = useCallback(() => {
    setWorkflowIndex(-1);
    setAgentIndex(-1);
    setIsPlaying(false);
    setWorkflowTime(0);
    setAgentTime(0);
  }, []);

  // Run both simulations
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Advance workflow
      setWorkflowIndex((prev) => {
        if (prev < workflowSteps.length - 1) {
          const nextStep = workflowSteps[prev + 1];
          setWorkflowTime((t) => t + nextStep.duration);
          return prev + 1;
        }
        return prev;
      });

      // Advance agent (starts same time but takes longer)
      setAgentIndex((prev) => {
        if (prev < agentSteps.length - 1) {
          const nextStep = agentSteps[prev + 1];
          setAgentTime((t) => t + nextStep.duration);
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    // Stop when both complete
    if (workflowIndex >= workflowSteps.length - 1 && agentIndex >= agentSteps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, workflowIndex, agentIndex]);

  const workflowComplete = workflowIndex >= workflowSteps.length - 1;
  const agentComplete = agentIndex >= agentSteps.length - 1;

  const stepTypeColors = {
    observe: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: Eye },
    think: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", icon: Brain },
    act: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: Zap },
    complete: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: CheckCircle },
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg bg-muted/30 p-1">
          <button
            onClick={() => setMode("side-by-side")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "side-by-side" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Side by Side
          </button>
          <button
            onClick={() => setMode("workflow")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "workflow" ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Workflow Only
          </button>
          <button
            onClick={() => setMode("agent")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "agent" ? "bg-violet-500/20 text-violet-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Agent Only
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (workflowComplete && agentComplete) reset();
              setIsPlaying(!isPlaying);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              isPlaying
                ? "bg-amber-500/20 text-amber-400"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            )}
          >
            <Play className={cn("w-3 h-3", isPlaying && "animate-pulse")} />
            {workflowComplete && agentComplete ? "Replay" : isPlaying ? "Running..." : "Run Both"}
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Query Banner */}
      <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600/50">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>👤</span>
          <span className="uppercase tracking-wider font-medium">User Query</span>
        </div>
        <p className="text-sm text-slate-200 m-0">&quot;Find me good headphones under $500&quot;</p>
      </div>

      {/* Side by Side Comparison */}
      <div className={cn("grid gap-4", mode === "side-by-side" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {/* Workflow Panel */}
        {(mode === "side-by-side" || mode === "workflow") && (
          <div className="rounded-xl border border-cyan-500/30 bg-card/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-cyan-400">Workflow</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Deterministic</span>
                </div>
                {workflowComplete && (
                  <span className="text-xs text-cyan-400 font-mono">{workflowTime}ms</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 m-0">Fixed path: 5 steps, predictable execution</p>
            </div>

            <div className="p-4 space-y-2 min-h-[280px]">
              {workflowSteps.map((step, idx) => {
                const isActive = idx === workflowIndex;
                const isComplete = idx < workflowIndex;
                const isPending = idx > workflowIndex;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-300",
                      isComplete && "bg-emerald-500/10 border-emerald-500/30",
                      isActive && "bg-cyan-500/10 border-cyan-500/40 ring-2 ring-cyan-500/30",
                      isPending && "bg-muted/20 border-border/50 opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                        isComplete && "bg-emerald-500 text-white",
                        isActive && "bg-cyan-500 text-white",
                        isPending && "bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        isComplete && "text-emerald-400",
                        isActive && "text-cyan-400",
                        isPending && "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">{step.description}</span>
                    </div>
                    {(isActive || isComplete) && step.output && (
                      <div className="mt-2 p-2 rounded bg-background/50 font-mono text-xs text-muted-foreground overflow-x-auto">
                        {step.output}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agent Panel */}
        {(mode === "side-by-side" || mode === "agent") && (
          <div className="rounded-xl border border-violet-500/30 bg-card/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-violet-500/20 bg-violet-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="font-medium text-violet-400">Agent</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400">Adaptive</span>
                </div>
                {agentComplete && (
                  <span className="text-xs text-violet-400 font-mono">{agentTime}ms</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 m-0">Dynamic path: LLM decides, adapts to results</p>
            </div>

            <div className="p-4 space-y-2 min-h-[280px] max-h-[400px] overflow-y-auto">
              {agentSteps.map((step, idx) => {
                const isActive = idx === agentIndex;
                const isComplete = idx < agentIndex;
                const isPending = idx > agentIndex;
                const colors = stepTypeColors[step.type];
                const Icon = colors.icon;

                if (isPending) return null;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-300",
                      colors.bg, colors.border,
                      isActive && "ring-2 ring-offset-1 ring-offset-background",
                      isActive && step.type === "observe" && "ring-cyan-500/50",
                      isActive && step.type === "think" && "ring-violet-500/50",
                      isActive && step.type === "act" && "ring-amber-500/50",
                      isActive && step.type === "complete" && "ring-emerald-500/50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colors.text)} />
                      <div className="flex-1 min-w-0">
                        <span className={cn("text-xs font-medium uppercase tracking-wider", colors.text)}>
                          {step.type}
                        </span>
                        <p className="text-sm text-foreground/80 mt-1 m-0">{step.content}</p>
                        {step.toolCall && (
                          <div className="mt-2 p-2 rounded bg-background/50 font-mono text-xs text-amber-400 overflow-x-auto">
                            → {step.toolCall}
                          </div>
                        )}
                        {step.toolResult && (isActive || isComplete) && (
                          <div className="mt-1 p-2 rounded bg-background/50 font-mono text-xs text-slate-400 overflow-x-auto">
                            ← {step.toolResult}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {agentIndex < 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Press &quot;Run Both&quot; to see the agent in action
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Summary */}
      {workflowComplete && agentComplete && (
        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border border-border animate-in fade-in slide-in-from-bottom-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{workflowTime}ms</div>
            <div className="text-xs text-muted-foreground">Workflow: 5 steps</div>
            <div className="text-xs text-cyan-400 mt-1">Predictable, fast</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">{agentTime}ms</div>
            <div className="text-xs text-muted-foreground">Agent: 7 steps (adapted)</div>
            <div className="text-xs text-violet-400 mt-1">Flexible, refined results</div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function WorkflowsVsAgentsSection() {
  return (
    <section id="workflows-vs-agents" className="scroll-mt-20">
      <SectionHeading
        id="workflows-vs-agents-heading"
        title="Workflows vs Agents"
        subtitle="Deterministic paths vs autonomous decisions"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Not every AI system needs to be an autonomous agent. <strong className="text-foreground">Workflows</strong> provide 
          predictable, testable execution paths. <strong className="text-foreground">Agents</strong> offer 
          flexibility for open-ended tasks. Understanding when to use each is crucial.
        </p>

        <Callout variant="tip" title="The Core Trade-off">
          <p>
            <strong>Workflows</strong>: You control the path → predictable, testable, efficient
            <br />
            <strong>Agents</strong>: LLM controls the path → flexible, adaptive, less predictable
          </p>
        </Callout>

        {/* Comparison */}
        <h3 id="workflows-defined" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Workflows?
        </h3>

        <p className="text-muted-foreground">
          A workflow is a <strong className="text-foreground">predefined sequence of steps</strong>. 
          You define the path at development time. The sequence of steps is fixed: 
          extract → chunk → summarize → combine. LLM calls might happen at specific steps, but 
          the overall structure is deterministic and predictable.
        </p>

        {/* What are Agents */}
        <h3 id="agents-defined" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Agents?
        </h3>

        <p className="text-muted-foreground">
          An agent has <strong className="text-foreground">autonomy over its execution path</strong>. 
          The LLM decides which tools to call, how many iterations to run, and when to stop. 
          The same input can take different paths on different runs.
        </p>

        <p className="text-muted-foreground">
          An agent has autonomy over its execution path. The LLM decides which tools to call, 
          how many iterations to run, and when to stop. The same input can take different paths 
          on different runs. The path emerges at runtime based on what the LLM finds and decides.
        </p>

        {/* Interactive Comparison */}
        <h3 id="comparison" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Use Each
        </h3>

        <InteractiveWrapper
          title="Interactive: Workflow vs Agent Comparison"
          description="Toggle between patterns to see the difference"
          icon="⚖️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <ComparisonVisualizer />
        </InteractiveWrapper>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">✓ Use Workflows When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>The task has a known, fixed structure</li>
                <li>You need predictable costs and latency</li>
                <li>Reliability and testability are critical</li>
                <li>Compliance requires audit trails</li>
                <li>The problem is well-understood</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">✓ Use Agents When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>The task is open-ended or exploratory</li>
                <li>You can&apos;t anticipate all paths</li>
                <li>Adaptability matters more than predictability</li>
                <li>The user expects conversational interaction</li>
                <li>Self-correction is valuable</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Hybrid Patterns */}
        <h3 id="hybrid-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Hybrid Patterns
        </h3>

        <p className="text-muted-foreground">
          The best systems often combine both. Use workflows for the outer structure, 
          with agents handling specific steps that need flexibility:
        </p>

        <p className="text-muted-foreground">
          The best systems often combine both. Use workflows for the outer structure with agents 
          handling specific steps that need flexibility. The outer structure is predictable (workflow), 
          while inner steps can use agents where adaptability is valuable.
        </p>

        <Callout variant="tip" title="The Pragmatic Approach">
          <p>
            Start with workflows. Add agent capabilities only where you need them. A workflow 
            with one agent step is often better than a pure agent that&apos;s hard to control.
          </p>
        </Callout>

        {/* Decision Framework */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Decision Framework</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Consideration</th>
                <th className="text-left p-3 font-medium text-cyan-400">Workflow</th>
                <th className="text-left p-3 font-medium text-violet-400">Agent</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Predictability</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> High</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Variable</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Cost control</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Easy to estimate</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Depends on run</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Testability</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Unit testable</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Eval-based</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Flexibility</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Fixed paths</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Adaptive</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Error handling</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Explicit</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Self-healing</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="info" title="Coming Up: RAG">
          <p>
            With the foundations of structured outputs, tools, agentic loops, and workflow patterns 
            established, we&apos;re ready to tackle <strong>RAG (Retrieval-Augmented Generation)</strong>—the 
            technique that grounds LLM responses in your own data.
          </p>
        </Callout>
      </div>
    </section>
  );
}
