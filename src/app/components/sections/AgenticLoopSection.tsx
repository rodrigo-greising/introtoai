"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  RotateCw, 
  Play, 
  Pause,
  RotateCcw,
  Eye,
  Brain,
  Zap,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

// =============================================================================
// Agentic Loop Visualizer
// =============================================================================

interface LoopStep {
  type: "observe" | "think" | "act" | "complete";
  content: string;
  toolCall?: string;
  toolResult?: string;
}

const sampleLoop: LoopStep[] = [
  { type: "observe", content: "User asked: 'What's the weather in Tokyo and should I bring an umbrella?'" },
  { type: "think", content: "I need weather data. I'll call get_weather for Tokyo." },
  { type: "act", content: "Calling get_weather...", toolCall: "get_weather({location: 'Tokyo'})", toolResult: '{"temp": 22, "condition": "rainy", "humidity": 85}' },
  { type: "observe", content: "Weather data received: 22°C, rainy, 85% humidity" },
  { type: "think", content: "It's rainy with high humidity. The user should bring an umbrella." },
  { type: "complete", content: "It's currently 22°C and rainy in Tokyo with 85% humidity. Yes, definitely bring an umbrella!" },
];

function AgenticLoopVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contextItems, setContextItems] = useState<string[]>([]);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= sampleLoop.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Update context as we progress
  useEffect(() => {
    const items: string[] = [];
    for (let i = 0; i <= currentStep; i++) {
      const step = sampleLoop[i];
      if (step.type === "observe") {
        items.push(`[Observation] ${step.content.slice(0, 50)}...`);
      } else if (step.type === "act" && step.toolResult) {
        items.push(`[Tool Result] ${step.toolResult.slice(0, 40)}...`);
      } else if (step.type === "complete") {
        items.push(`[Response] ${step.content.slice(0, 50)}...`);
      }
    }
    setContextItems(items);
  }, [currentStep]);

  const stepIcons = {
    observe: Eye,
    think: Brain,
    act: Zap,
    complete: CheckCircle,
  };

  const stepColors = {
    observe: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400" },
    think: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400" },
    act: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
    complete: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" },
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setContextItems([]);
  };

  const coreLogic = `// The Agentic Loop Pattern

async function agenticLoop(userMessage: string): Promise<string> {
  const context: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  while (true) {
    // 1. THINK: Model decides what to do
    const response = await llm.complete({ messages: context, tools });
    
    // 2. CHECK: Is the model done?
    if (response.finishReason === "stop") {
      return response.content;  // Final answer
    }
    
    // 3. ACT: Execute requested tool calls
    if (response.toolCalls) {
      for (const call of response.toolCalls) {
        const result = await executeTool(call);
        
        // 4. OBSERVE: Add result to context
        context.push({ role: "tool", content: result });
      }
    }
    
    // Loop continues: model sees results and decides next step
  }
}

// The loop repeats until the model decides it has enough
// information to answer the user's question.`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Agentic Loop Implementation"
      description="The core pattern for iterative tool-using agents"
    >
      <div className="space-y-6">
        {/* Main visualization */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Loop steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Loop Iterations</span>
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {sampleLoop.length}
              </span>
            </div>

            {sampleLoop.map((step, index) => {
              const Icon = stepIcons[step.type];
              const colors = stepColors[step.type];
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              const isFuture = index > currentStep;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                    isActive
                      ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-offset-background ${colors.border}`
                      : isPast
                      ? `${colors.bg} ${colors.border} opacity-70`
                      : "bg-muted/30 border-border/50 opacity-40"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    isActive || isPast ? colors.bg : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive || isPast ? colors.text : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-xs font-medium uppercase tracking-wider mb-1",
                      isActive || isPast ? colors.text : "text-muted-foreground"
                    )}>
                      {step.type}
                    </div>
                    <p className={cn(
                      "text-sm",
                      isFuture ? "text-muted-foreground/50" : "text-muted-foreground"
                    )}>
                      {step.content.slice(0, 60)}{step.content.length > 60 ? "..." : ""}
                    </p>
                    {step.toolCall && isActive && (
                      <code className="text-xs font-mono text-amber-400 mt-1 block">
                        {step.toolCall}
                      </code>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Context accumulation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Context Accumulation</span>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border min-h-[200px]">
              {contextItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Context will accumulate as the loop progresses...
                </p>
              ) : (
                <div className="space-y-2">
                  {contextItems.map((item, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono p-2 rounded bg-background/50 border border-border/50 animate-in fade-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCw className={cn("w-3.5 h-3.5", isPlaying && "animate-spin")} />
              <span>Each iteration adds to the context</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isPlaying
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <div className="flex-1" />
          <span className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium",
            currentStep === sampleLoop.length - 1
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-muted text-muted-foreground"
          )}>
            {currentStep === sampleLoop.length - 1 ? "Complete!" : "In Progress..."}
          </span>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function AgenticLoopSection() {
  return (
    <section id="agentic-loop" className="scroll-mt-20">
      <SectionHeading
        id="agentic-loop-heading"
        title="The Agentic Loop"
        subtitle="How agents iterate: observe, think, act, repeat"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The agentic loop is the core pattern behind autonomous AI systems. Instead of a single 
          prompt→response, the model <strong className="text-foreground">iterates</strong>: it 
          observes, thinks, acts (calls tools), observes the results, and repeats until the 
          task is complete.
        </p>

        <Callout variant="tip" title="The Pattern">
          <p>
            <strong>Observe</strong> → <strong>Think</strong> → <strong>Act</strong> → 
            <strong>Observe</strong> → ... → <strong>Complete</strong>
            <br /><br />
            The model decides when to stop. Each iteration adds information to the context.
          </p>
        </Callout>

        {/* Anatomy of the Loop */}
        <h3 id="loop-anatomy" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Anatomy of the Loop
        </h3>

        <p className="text-muted-foreground">
          Watch the loop in action. Notice how each step builds on the previous—the context 
          accumulates as the agent works toward its goal:
        </p>

        <InteractiveWrapper
          title="Interactive: Agentic Loop Visualization"
          description="Step through a complete agent loop and watch context accumulate"
          icon={<RotateCw className="w-4 h-4" />}
          colorTheme="violet"
          minHeight="auto"
        >
          <AgenticLoopVisualizer />
        </InteractiveWrapper>

        {/* Context Accumulation */}
        <h3 id="context-accumulation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Context Accumulation
        </h3>

        <p className="text-muted-foreground">
          Each loop iteration adds to the context:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <Eye className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Observations</h4>
              <p className="text-sm text-muted-foreground m-0">
                User messages, tool results, and any external data that enters the loop
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <Brain className="w-5 h-5 text-violet-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Reasoning</h4>
              <p className="text-sm text-muted-foreground m-0">
                The model&apos;s chain-of-thought—visible in assistant messages
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Tool Calls</h4>
              <p className="text-sm text-muted-foreground m-0">
                Records of which tools were called and with what arguments
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Tool Results</h4>
              <p className="text-sm text-muted-foreground m-0">
                The data returned from tool executions
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Context Limits">
          <p>
            Each iteration grows the context. A runaway loop can hit token limits or become 
            expensive. Always include <strong>stopping conditions</strong>: max iterations, 
            timeout, or explicit completion signals.
          </p>
        </Callout>

        {/* Stopping Conditions */}
        <h3 id="stopping-conditions" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Stop
        </h3>

        <CodeBlock
          language="typescript"
          filename="stopping-conditions.ts"
          code={`async function agenticLoop(input: string): Promise<string> {
  const MAX_ITERATIONS = 10;
  const TIMEOUT_MS = 30000;
  const startTime = Date.now();
  
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    // Check timeout
    if (Date.now() - startTime > TIMEOUT_MS) {
      return "Task timed out. Here's what I found so far...";
    }
    
    const response = await llm.complete({ messages: context, tools });
    
    // Model signals completion
    if (response.finishReason === "stop") {
      return response.content;
    }
    
    // No more tool calls - model is done
    if (!response.toolCalls || response.toolCalls.length === 0) {
      return response.content;
    }
    
    // Execute tools and continue
    await executeToolCalls(response.toolCalls);
  }
  
  return "Max iterations reached. Partial results: ...";
}

// Good stopping conditions:
// 1. Model's natural completion (finishReason: "stop")
// 2. Maximum iteration count
// 3. Timeout
// 4. Explicit "done" tool call
// 5. Error threshold exceeded`}
        />

        {/* Implementation Tips */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Implementation Tips</h3>

        <div className="space-y-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Stream Intermediate Steps</h4>
              <p className="text-sm text-muted-foreground m-0">
                Users get anxious waiting for long operations. Stream the model&apos;s thinking 
                and tool calls to show progress.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Log Everything</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agentic systems are hard to debug. Log every iteration: context, tool calls, 
                results, and decisions. You&apos;ll thank yourself later.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Consider ReAct Prompting</h4>
              <p className="text-sm text-muted-foreground m-0">
                The ReAct pattern makes the loop explicit in the prompt: &quot;Thought: ... 
                Action: ... Observation: ...&quot; This can improve reliability.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Coming Up: Workflows vs Agents">
          <p>
            Not every task needs a free-form loop. Sometimes a <strong>deterministic workflow</strong> is 
            better than an autonomous agent. In the next section, we&apos;ll compare these approaches 
            and when to use each.
          </p>
        </Callout>
      </div>
    </section>
  );
}
