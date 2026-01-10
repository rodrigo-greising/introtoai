"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

// =============================================================================
// Boundary Demo
// =============================================================================

interface BoundaryState {
  budget: number;
  maxBudget: number;
  iterations: number;
  maxIterations: number;
  status: "running" | "paused" | "stopped" | "complete";
  lastAction: string;
}

function BoundaryDemo() {
  const [state, setState] = useState<BoundaryState>({
    budget: 0,
    maxBudget: 5,
    iterations: 0,
    maxIterations: 10,
    status: "paused",
    lastAction: "Waiting to start...",
  });

  const actions = [
    { name: "Read file", cost: 0.01 },
    { name: "Generate code", cost: 0.15 },
    { name: "Run tests", cost: 0.02 },
    { name: "Search codebase", cost: 0.05 },
    { name: "Write file", cost: 0.03 },
  ];

  const runStep = () => {
    if (state.status !== "running") return;
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const newBudget = state.budget + action.cost;
    const newIterations = state.iterations + 1;
    
    // Check boundaries
    if (newBudget >= state.maxBudget) {
      setState(prev => ({
        ...prev,
        budget: newBudget,
        iterations: newIterations,
        status: "stopped",
        lastAction: `⛔ Budget exceeded! Stopped after: ${action.name}`,
      }));
      return;
    }
    
    if (newIterations >= state.maxIterations) {
      setState(prev => ({
        ...prev,
        budget: newBudget,
        iterations: newIterations,
        status: "complete",
        lastAction: `✅ Max iterations reached. Last: ${action.name}`,
      }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      budget: newBudget,
      iterations: newIterations,
      lastAction: `${action.name} ($${action.cost.toFixed(2)})`,
    }));
    
    // Continue running
    setTimeout(runStep, 500);
  };

  const start = () => {
    setState(prev => ({ ...prev, status: "running" }));
    setTimeout(runStep, 500);
  };

  const pause = () => {
    setState(prev => ({ ...prev, status: "paused" }));
  };

  const reset = () => {
    setState({
      budget: 0,
      maxBudget: 5,
      iterations: 0,
      maxIterations: 10,
      status: "paused",
      lastAction: "Waiting to start...",
    });
  };

  const budgetPercent = (state.budget / state.maxBudget) * 100;
  const iterationPercent = (state.iterations / state.maxIterations) * 100;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        {state.status === "paused" && (
          <button
            onClick={start}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Start Agent
          </button>
        )}
        {state.status === "running" && (
          <button
            onClick={pause}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <span className={cn(
          "ml-auto px-3 py-1 rounded-full text-xs font-medium",
          state.status === "running" && "bg-emerald-500/20 text-emerald-400",
          state.status === "paused" && "bg-muted text-muted-foreground",
          state.status === "stopped" && "bg-rose-500/20 text-rose-400",
          state.status === "complete" && "bg-cyan-500/20 text-cyan-400"
        )}>
          {state.status}
        </span>
      </div>

      {/* Boundaries */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Budget Limit</span>
            <span className="text-sm text-muted-foreground">
              ${state.budget.toFixed(2)} / ${state.maxBudget.toFixed(2)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                budgetPercent >= 100 ? "bg-rose-500" : budgetPercent >= 80 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Iteration Limit</span>
            <span className="text-sm text-muted-foreground">
              {state.iterations} / {state.maxIterations}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all bg-cyan-500"
              )}
              style={{ width: `${Math.min(iterationPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Last action */}
      <div className="p-3 rounded-lg bg-muted/30 text-sm">
        <span className="text-muted-foreground">Last action: </span>
        <span className="text-foreground">{state.lastAction}</span>
      </div>

      {/* Explanation */}
      <div className="text-xs text-muted-foreground">
        The agent runs until it hits a boundary (budget or iterations). External controls stop the agent 
        automatically—no agent cooperation required.
      </div>
    </div>
  );
}

export function ExternalControlSection() {
  return (
    <section id="external-control" className="scroll-mt-20">
      <SectionHeading
        id="external-control-heading"
        title="External Control Patterns"
        subtitle="Human and AI orchestration of coding pipelines"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          External control patterns separate the <strong className="text-foreground">orchestration 
          layer</strong> from the <strong className="text-foreground">execution layer</strong>. 
          A human or outer AI system controls the pipeline, while inner agents handle implementation. 
          This enables sophisticated workflows with appropriate oversight.
        </p>

        <Callout variant="info" title="The Separation">
          <p className="m-0">
            <strong>Inner loop:</strong> AI executing tasks (writing code, fixing tests)
            <br />
            <strong>Outer loop:</strong> Human or orchestrator AI controlling what gets executed, 
            when, and with what constraints
          </p>
        </Callout>

        {/* Boundary Demo */}
        <h3 id="boundary-controls" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Boundary Controls
        </h3>

        <p className="text-muted-foreground">
          External controls enforce boundaries that agents cannot exceed. Unlike guardrails (which 
          agents can choose to respect), boundaries are enforced by the runtime environment.
        </p>

        <InteractiveWrapper
          title="Interactive: Boundary Enforcement"
          description="Watch an agent hit budget and iteration limits"
          icon="🛑"
          colorTheme="rose"
          minHeight="auto"
        >
          <BoundaryDemo />
        </InteractiveWrapper>

        {/* Human-Controlled AI Pipelines */}
        <h3 id="human-controlled-pipelines" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Human-Controlled AI Pipelines
        </h3>

        <p className="text-muted-foreground">
          In human-controlled pipelines, a developer <strong className="text-foreground">orchestrates 
          AI agents</strong> like instruments in an orchestra. The human sets the tempo, decides 
          which instruments play when, and can stop the music at any point.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Human Responsibilities</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Define tasks and acceptance criteria</li>
                <li>Review and approve AI outputs</li>
                <li>Handle edge cases and judgment calls</li>
                <li>Decide when to stop iteration</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">AI Responsibilities</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Execute well-defined implementation tasks</li>
                <li>Iterate against test harnesses</li>
                <li>Propose multiple solutions</li>
                <li>Surface issues for human decision</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          language="typescript"
          filename="human-orchestrator.ts"
          code={`// Human orchestrates, AI executes
async function humanControlledWorkflow(task: Task) {
  // Human defines the spec
  const spec = await human.writeSpec(task);
  
  // Human writes tests
  const tests = await human.writeTests(spec);
  
  // AI implements
  const implementation = await ai.implement(spec, tests);
  
  // Human reviews
  const approved = await human.review(implementation);
  
  if (!approved) {
    // Human provides feedback, AI iterates
    return humanControlledWorkflow(task.withFeedback(human.feedback));
  }
  
  return implementation;
}`}
        />

        {/* AI-to-AI Orchestration */}
        <h3 id="ai-to-ai-orchestration" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          AI-to-AI Orchestration
        </h3>

        <p className="text-muted-foreground">
          In multi-agent systems, an <strong className="text-foreground">orchestrator AI</strong> 
          manages specialized worker AIs. The orchestrator breaks down tasks, assigns work, and 
          synthesizes results—while workers focus on their specific domain.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Multi-Agent Architecture</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Planner Agent:</strong> Breaks down high-level goals into tasks</li>
              <li><strong className="text-foreground">Coder Agent:</strong> Implements code changes</li>
              <li><strong className="text-foreground">Tester Agent:</strong> Writes and validates tests</li>
              <li><strong className="text-foreground">Reviewer Agent:</strong> Checks code quality and patterns</li>
              <li><strong className="text-foreground">Orchestrator:</strong> Coordinates all agents, manages flow</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="warning" title="Complexity vs Control">
          <p className="m-0">
            Multi-agent systems are powerful but complex. Each agent is another point of failure. 
            <strong> Start simple</strong>—often a single well-prompted agent outperforms a 
            complex multi-agent setup. Add agents only when you hit clear limitations.
          </p>
        </Callout>

        {/* The Outer Loop Pattern */}
        <h3 id="outer-loop-pattern" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Outer Loop Pattern
        </h3>

        <p className="text-muted-foreground">
          The outer loop pattern is a <strong className="text-foreground">meta-level control 
          structure</strong>. While inner loops iterate on implementation, the outer loop manages 
          the overall workflow—task sequencing, resource allocation, and strategic decisions.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Inner Loop</h4>
              <p className="text-sm text-muted-foreground m-0">
                Code → Test → Fix → Repeat<br />
                Fast iterations, narrow scope, automated
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Outer Loop</h4>
              <p className="text-sm text-muted-foreground m-0">
                Plan → Execute → Evaluate → Adjust<br />
                Strategic decisions, broad scope, oversight
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Safety and Guardrails */}
        <h3 id="safety-guardrails" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Safety and Guardrails
        </h3>

        <p className="text-muted-foreground">
          External control enables <strong className="text-foreground">guardrails</strong>—constraints 
          that bound what AI can do. Without guardrails, autonomous systems can cause harm. With 
          them, you get automation <em>with</em> safety.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Scope Guards</h4>
              <p className="text-sm text-muted-foreground m-0">
                Limit which files/directories AI can modify
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Action Guards</h4>
              <p className="text-sm text-muted-foreground m-0">
                Restrict dangerous operations (delete, deploy, etc.)
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Review Gates</h4>
              <p className="text-sm text-muted-foreground m-0">
                Require human approval for certain changes
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="Learn from Incidents">
          <p className="m-0">
            Real incidents (like AI agents accidentally deleting data) underscore the need for 
            guardrails. <strong>Defense in depth:</strong> sandbox execution, limit permissions, 
            require approval for destructive actions, and always have rollback capability.
          </p>
        </Callout>

        <Callout variant="tip" title="Key References" className="mt-6">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li><strong>Agint</strong> (arxiv.org/abs/2511.19635) — Compiles natural language to executable code graphs</li>
            <li><strong>AgentMesh</strong> — Multi-agent orchestration with specialized cooperating agents</li>
            <li><strong>AutoGuard</strong> (arxiv.org/abs/2512.04368) — RL-powered proactive DevSecOps protection</li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
