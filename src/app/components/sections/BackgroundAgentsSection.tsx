"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Terminal,
  FileCode,
  GitCommit,
} from "lucide-react";

// Task Monitor Simulation
function TaskMonitor() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<Array<{ type: string; message: string; timestamp: string }>>([]);

  const steps = [
    { 
      id: "clone", 
      name: "Cloning Repository", 
      status: "pending",
      icon: GitCommit,
      logs: [
        "Cloning repository from main branch...",
        "Setting up workspace environment...",
        "Repository cloned successfully.",
      ]
    },
    { 
      id: "analyze", 
      name: "Analyzing Task", 
      status: "pending",
      icon: FileCode,
      logs: [
        "Reading task specification...",
        "Analyzing codebase structure...",
        "Identifying affected files: UserCard.tsx, userService.ts",
        "Planning implementation approach...",
      ]
    },
    { 
      id: "implement", 
      name: "Implementing Changes", 
      status: "pending",
      icon: FileCode,
      logs: [
        "Editing src/components/UserCard.tsx...",
        "Adding loading state to component...",
        "Editing src/services/userService.ts...",
        "Adding caching layer to API calls...",
        "Creating src/components/UserCardSkeleton.tsx...",
      ]
    },
    { 
      id: "test", 
      name: "Running Tests", 
      status: "pending",
      icon: Terminal,
      logs: [
        "$ npm test",
        "Running test suite...",
        "PASS src/components/UserCard.test.tsx",
        "PASS src/services/userService.test.ts",
        "All 12 tests passed.",
      ]
    },
    { 
      id: "lint", 
      name: "Linting & Type Check", 
      status: "pending",
      icon: Terminal,
      logs: [
        "$ npm run lint",
        "No ESLint warnings or errors.",
        "$ npx tsc --noEmit",
        "TypeScript compilation successful.",
      ]
    },
    { 
      id: "commit", 
      name: "Creating Commit", 
      status: "pending",
      icon: GitCommit,
      logs: [
        "Staging changes...",
        "Creating commit: 'Add loading state and caching to UserCard'",
        "Commit created: abc123f",
        "Ready for review.",
      ]
    },
  ];

  const getStepStatus = useCallback((index: number) => {
    if (index < currentStep) return "complete";
    if (index === currentStep && isRunning) return "running";
    return "pending";
  }, [currentStep, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length) {
          setIsRunning(false);
          return prev;
        }
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, steps.length]);

  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const newLogs = step.logs.map((log, i) => ({
        type: log.startsWith("$") ? "command" : log.includes("PASS") ? "success" : "info",
        message: log,
        timestamp: new Date().toLocaleTimeString(),
      }));
      setLogs((prev) => [...prev, ...newLogs]);
    }
  }, [currentStep]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
  };

  const statusColors = {
    pending: "text-muted-foreground",
    running: "text-amber-400",
    complete: "text-emerald-400",
  };

  const statusIcons = {
    pending: Clock,
    running: Loader2,
    complete: CheckCircle,
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Task Monitor Simulation</h4>
        <div className="flex items-center gap-2">
          {!isRunning && currentStep === 0 && (
            <button
              onClick={handleStart}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Task
            </button>
          )}
          {isRunning && (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          {(currentStep > 0 || !isRunning) && currentStep !== 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Task Info */}
      <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Task</div>
        <p className="text-sm text-foreground m-0">Add loading state and caching to UserCard component</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Steps Progress */}
        <div className="space-y-2">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const StatusIcon = statusIcons[status as keyof typeof statusIcons];
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  status === "running"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : status === "complete"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-muted/20 border-border"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  status === "running" ? "bg-amber-500/20" : status === "complete" ? "bg-emerald-500/20" : "bg-muted/40"
                }`}>
                  <step.icon className={`w-4 h-4 ${statusColors[status as keyof typeof statusColors]}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                    {step.name}
                  </div>
                </div>
                <StatusIcon className={`w-4 h-4 ${statusColors[status as keyof typeof statusColors]} ${status === "running" ? "animate-spin" : ""}`} />
              </div>
            );
          })}
        </div>

        {/* Log Output */}
        <div className="rounded-lg bg-background border border-border overflow-hidden">
          <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Agent Logs</span>
          </div>
          <div className="h-[280px] overflow-y-auto p-3 font-mono text-xs space-y-1">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">Waiting to start...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
                  <span className={
                    log.type === "command" ? "text-cyan-400" : 
                    log.type === "success" ? "text-emerald-400" : 
                    "text-muted-foreground"
                  }>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            {currentStep >= steps.length && !isRunning && (
              <div className="mt-2 pt-2 border-t border-border text-emerald-400">
                ✓ Task completed successfully. Ready for review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BackgroundAgentsSection() {
  return (
    <section id="background-agents" className="scroll-mt-20">
      <SectionHeading
        id="background-agents-heading"
        title="Background Agents"
        subtitle="Autonomous coding agents running in the cloud"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Background agents execute coding tasks <strong className="text-foreground">autonomously 
          in cloud environments</strong>. You define the task, submit it, and review results when 
          complete—freeing you to work on other things while AI handles implementation.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Cursor&apos;s background agent is the primary example. Alternatives include: 
            <strong>OpenAI Codex</strong>, <strong>Claude with computer use</strong>, 
            <strong>Devin</strong>, <strong>GitHub Copilot Workspace</strong>, 
            <strong>Replit Agent</strong>, <strong>Codeium Windsurf</strong>.
          </p>
        </Callout>

        {/* What are Background Coding Agents */}
        <h3 id="background-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What are Background Coding Agents
        </h3>

        <p className="text-muted-foreground">
          A background agent is an AI system that <strong className="text-foreground">works 
          independently</strong> on a coding task. Unlike interactive chat where you guide each 
          step, background agents take a task and execute it end-to-end.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Interactive Mode</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Human guides each step</li>
                <li>Immediate feedback loop</li>
                <li>Human sees work in progress</li>
                <li>Good for exploration</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Background Mode</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Agent works autonomously</li>
                <li>Async—review when ready</li>
                <li>Human sees final result</li>
                <li>Good for defined tasks</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Task Monitor */}
        <h3 id="task-monitor" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Task Monitor
        </h3>

        <p className="text-muted-foreground">
          Watch how a background agent progresses through a task. Each step runs autonomously, 
          logging progress for later review.
        </p>

        <TaskMonitor />

        {/* Sandboxing and Security */}
        <h3 id="sandboxing" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Sandboxing and Security
        </h3>

        <p className="text-muted-foreground">
          Background agents need <strong className="text-foreground">isolation</strong> to prevent 
          unintended effects. Sandboxing limits what agents can access and do, providing safety 
          boundaries for autonomous execution.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">File System</h4>
              <p className="text-sm text-muted-foreground m-0">
                Limited to project directory. No access to system files or other projects.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Network</h4>
              <p className="text-sm text-muted-foreground m-0">
                Restricted to necessary endpoints. No arbitrary external connections.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Credentials</h4>
              <p className="text-sm text-muted-foreground m-0">
                Minimal secrets exposure. Production credentials never accessible.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Trust but Verify">
          <p className="m-0">
            Even sandboxed agents can make mistakes within their allowed scope. <strong>Always 
            review agent output</strong> before merging. The sandbox prevents catastrophic failures; 
            human review prevents subtle bugs.
          </p>
        </Callout>

        {/* Agent Capabilities and Limitations */}
        <h3 id="capabilities-limits" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Capabilities and Limitations
        </h3>

        <p className="text-muted-foreground">
          Understanding what agents can and can&apos;t do helps you <strong className="text-foreground">scope 
          tasks appropriately</strong>. Overly ambitious tasks lead to poor results; well-scoped 
          tasks enable success.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Agents Excel At</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Implementing well-specified features</li>
                <li>Fixing bugs with clear repro steps</li>
                <li>Adding tests for existing code</li>
                <li>Refactoring with defined patterns</li>
                <li>Updating code to new API versions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Agents Struggle With</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Vague or ambiguous requirements</li>
                <li>Novel architectural decisions</li>
                <li>Cross-cutting concerns</li>
                <li>Tasks requiring human judgment</li>
                <li>Large-scale refactoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* When to Use Background vs Interactive */}
        <h3 id="when-to-use" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          When to Use Background vs Interactive
        </h3>

        <p className="text-muted-foreground">
          Neither mode is universally better—each fits different situations. The choice depends 
          on <strong className="text-foreground">task clarity</strong>, <strong className="text-foreground">risk 
          level</strong>, and <strong className="text-foreground">your availability</strong>.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Decision Guide</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Background:</strong> Clear spec, good test coverage, low risk, you&apos;re busy</li>
              <li><strong className="text-foreground">Interactive:</strong> Exploration, high risk, complex decisions, learning</li>
              <li><strong className="text-foreground">Hybrid:</strong> Start interactive to define approach, then background for implementation</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Alternative Agents">
          <p className="m-0">
            <strong>Devin:</strong> Full autonomous software engineer • 
            <strong>GitHub Copilot Workspace:</strong> Issue-to-PR automation • 
            <strong>Replit Agent:</strong> Full-stack app generation • 
            <strong>Claude computer use:</strong> General-purpose autonomous agent
          </p>
        </Callout>
      </div>
    </section>
  );
}
