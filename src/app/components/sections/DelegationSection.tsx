"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Users, 
  ArrowRight,
  MessageSquare,
  Shield,
  Sparkles,
  GitBranch,
} from "lucide-react";

// =============================================================================
// Delegation Visualizer
// =============================================================================

interface AgentNode {
  id: string;
  name: string;
  role: "orchestrator" | "subagent";
  status: "idle" | "thinking" | "delegating" | "working" | "complete";
  message?: string;
}

function DelegationVisualizer() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      agents: [
        { id: "main", name: "Main Agent", role: "orchestrator" as const, status: "thinking" as const, message: "User wants to build a feature..." },
        { id: "code", name: "Code Agent", role: "subagent" as const, status: "idle" as const },
        { id: "test", name: "Test Agent", role: "subagent" as const, status: "idle" as const },
        { id: "review", name: "Review Agent", role: "subagent" as const, status: "idle" as const },
      ],
      description: "Main agent analyzes the task and plans delegation",
    },
    {
      agents: [
        { id: "main", name: "Main Agent", role: "orchestrator" as const, status: "delegating" as const, message: "Delegating to Code Agent..." },
        { id: "code", name: "Code Agent", role: "subagent" as const, status: "working" as const, message: "Implementing feature..." },
        { id: "test", name: "Test Agent", role: "subagent" as const, status: "idle" as const },
        { id: "review", name: "Review Agent", role: "subagent" as const, status: "idle" as const },
      ],
      description: "Code Agent works on implementation with its own context",
    },
    {
      agents: [
        { id: "main", name: "Main Agent", role: "orchestrator" as const, status: "delegating" as const, message: "Delegating to Test Agent..." },
        { id: "code", name: "Code Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Code complete" },
        { id: "test", name: "Test Agent", role: "subagent" as const, status: "working" as const, message: "Writing tests..." },
        { id: "review", name: "Review Agent", role: "subagent" as const, status: "idle" as const },
      ],
      description: "Test Agent receives code output and writes tests",
    },
    {
      agents: [
        { id: "main", name: "Main Agent", role: "orchestrator" as const, status: "delegating" as const, message: "Delegating to Review Agent..." },
        { id: "code", name: "Code Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Code complete" },
        { id: "test", name: "Test Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Tests pass" },
        { id: "review", name: "Review Agent", role: "subagent" as const, status: "working" as const, message: "Reviewing quality..." },
      ],
      description: "Review Agent checks the combined output",
    },
    {
      agents: [
        { id: "main", name: "Main Agent", role: "orchestrator" as const, status: "complete" as const, message: "Task complete! Synthesizing results..." },
        { id: "code", name: "Code Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Code complete" },
        { id: "test", name: "Test Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Tests pass" },
        { id: "review", name: "Review Agent", role: "subagent" as const, status: "complete" as const, message: "✓ Approved" },
      ],
      description: "Main agent synthesizes results and responds to user",
    },
  ];

  const currentStep = steps[step];

  const getStatusColor = (status: AgentNode["status"]) => {
    switch (status) {
      case "complete": return "border-emerald-500/50 bg-emerald-500/10";
      case "working": return "border-amber-500/50 bg-amber-500/10";
      case "thinking": return "border-cyan-500/50 bg-cyan-500/10";
      case "delegating": return "border-violet-500/50 bg-violet-500/10";
      default: return "border-border bg-muted/30";
    }
  };

  const coreLogic = `// Delegation: Orchestrator + Specialized Subagents
interface Subagent {
  name: string;
  systemPrompt: string;
  tools: Tool[];
  execute: (task: string, context?: Context) => Promise<Result>;
}

class Orchestrator {
  private subagents: Map<string, Subagent>;
  
  async delegate(task: string, agentName: string, context?: Context) {
    const agent = this.subagents.get(agentName);
    
    // Each subagent has its OWN context window
    // This is key: main agent context doesn't bloat
    return await agent.execute(task, context);
  }
  
  async orchestrate(userRequest: string) {
    // Step 1: Plan the work
    const plan = await this.planDelegation(userRequest);
    
    // Step 2: Execute each delegation
    const results: Record<string, Result> = {};
    
    for (const step of plan.steps) {
      // Pass only RELEVANT context to subagent
      const relevantContext = this.extractRelevantContext(step, results);
      
      results[step.id] = await this.delegate(
        step.task,
        step.agent,
        relevantContext
      );
    }
    
    // Step 3: Synthesize results
    return await this.synthesize(results, userRequest);
  }
}

// Key benefits:
// 1. Each subagent has focused context (not bloated)
// 2. Subagents can have specialized tools
// 3. Main agent stays high-level, subagents do details
// 4. Easier to test and improve individual agents`;

  return (
    <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                i === step
                  ? "bg-cyan-500 text-white"
                  : i < step
                  ? "bg-emerald-500/50 text-emerald-400"
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              {i + 1}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            {currentStep.description}
          </span>
        </div>

        {/* Agent visualization */}
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="flex flex-col items-center gap-4">
            {/* Orchestrator */}
            <div
              className={cn(
                "w-full max-w-xs p-4 rounded-lg border transition-all",
                getStatusColor(currentStep.agents[0].status)
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="font-medium text-sm">{currentStep.agents[0].name}</span>
              </div>
              {currentStep.agents[0].message && (
                <div className="text-xs text-muted-foreground p-2 bg-background/50 rounded">
                  {currentStep.agents[0].message}
                </div>
              )}
            </div>

            {/* Delegation arrows */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <ArrowRight className={cn(
                    "w-4 h-4 rotate-90",
                    step > 0 ? "text-violet-400" : "text-muted-foreground/30"
                  )} />
                </div>
              ))}
            </div>

            {/* Subagents */}
            <div className="flex gap-3">
              {currentStep.agents.slice(1).map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all min-w-[100px]",
                    getStatusColor(agent.status)
                  )}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span className="font-medium text-xs">{agent.name}</span>
                  </div>
                  {agent.message && (
                    <div className="text-[10px] text-muted-foreground">
                      {agent.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-3 py-1.5 text-sm rounded bg-muted/50 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className="px-3 py-1.5 text-sm rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function DelegationSection() {
  return (
    <section id="delegation" className="scroll-mt-20">
      <SectionHeading
        id="delegation-heading"
        title="Delegation & Subagents"
        subtitle="Coordinating specialized agents for complex tasks"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Delegation</strong> is when an orchestrating agent assigns 
          subtasks to specialized <strong className="text-foreground">subagents</strong>. Each subagent 
          has its own context, tools, and expertise—enabling complex tasks without bloating any single 
          agent&apos;s context window.
        </p>

        <Callout variant="important" title="Context Isolation">
          <p className="m-0">
            The key insight: each subagent operates with its <strong>own context window</strong>. The 
            orchestrator passes only relevant information, keeping each agent focused and within token limits.
          </p>
        </Callout>

        {/* Delegation Flow */}
        <h3 id="delegation-flow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Delegation Flow
        </h3>

        <InteractiveWrapper
          title="Interactive: Multi-Agent Delegation"
          description="Step through an orchestrator delegating to subagents"
          icon="👥"
          colorTheme="violet"
          minHeight="auto"
        >
          <DelegationVisualizer />
        </InteractiveWrapper>

        {/* When to Use Subagents */}
        <h3 id="when-to-delegate" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Use Subagents
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Delegate When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Subtasks need specialized tools</li>
                <li>Context would exceed single agent limits</li>
                <li>Different personas/expertise needed</li>
                <li>Parallel execution is beneficial</li>
                <li>Clear separation of concerns</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">✗ Keep Single Agent When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Task is simple and focused</li>
                <li>Context fits comfortably in window</li>
                <li>Tight coupling between steps</li>
                <li>Overhead exceeds benefit</li>
                <li>Debugging simplicity is priority</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Subagent Patterns */}
        <h3 id="subagent-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Subagent Patterns
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Specialist Pool</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Orchestrator routes to specialized agents based on task type. Each specialist 
                    has domain-specific tools and prompts. Great for customer support, research, coding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Critic/Generator Pair</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    One agent generates, another critiques and requests improvements. 
                    Iterate until quality threshold met. Used for writing, code review, research.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Gatekeeper Pattern</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Validation agent checks outputs before they&apos;re returned. Can enforce 
                    safety, compliance, or quality constraints. Acts as a final filter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation */}
        <h3 id="implementation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Implementation
        </h3>

        <p className="text-muted-foreground">
          Define specialized subagents with focused capabilities: a code agent for implementation, a test 
          agent for writing tests, and a review agent for quality checks. The orchestrator coordinates them 
          sequentially: code agent implements, test agent writes tests, review agent checks everything. 
          Only pass relevant context to each agent—summaries, not full code or entire conversations.
        </p>

        {/* Context Management */}
        <h3 id="context-management" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Context Management
        </h3>

        <Callout variant="tip" title="Pass Summaries, Not Raw Data">
          <p className="m-0">
            When delegating, extract and pass only what the subagent needs. A code agent doesn&apos;t need 
            the full user conversation—just the spec. A test agent needs the interface, not the implementation details.
          </p>
        </Callout>

        <p className="text-muted-foreground">
          Avoid passing everything to subagents—full conversations, all files, entire databases. Instead, 
          extract and pass only what&apos;s needed: relevant files, task summaries, and specific context. 
          This keeps context focused and costs down.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Extract task summaries</li>
                <li>Pass only relevant files</li>
                <li>Use focused context per agent</li>
                <li>Clear delegation boundaries</li>
                <li>Error handling and timeouts</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Overly complex delegation hierarchies</li>
                <li>Passing full context to every subagent</li>
                <li>Unclear ownership between agents</li>
                <li>Infinite delegation loops</li>
                <li>Silent failures in subagent calls</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Give each subagent a clear, focused role</li>
                <li>Pass minimal, relevant context</li>
                <li>Use structured outputs for handoffs</li>
                <li>Log delegation decisions for debugging</li>
                <li>Set timeouts and iteration limits</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Overly complex delegation hierarchies</li>
                <li>Passing full context to every subagent</li>
                <li>Unclear ownership between agents</li>
                <li>Infinite delegation loops</li>
                <li>Silent failures in subagent calls</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Next: Skills" className="mt-8">
          <p className="m-0">
            Subagents often share common capabilities. <strong>Skills</strong> are reusable, composable 
            units of agent capability that can be mixed and matched across different agents.
          </p>
        </Callout>
      </div>
    </section>
  );
}
