"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import {
  MessageSquare,
  Code,
  GitPullRequest,
  CheckCircle,
  Rocket,
  BarChart2,
  Play,
  RotateCcw,
  ArrowDown,
  Bot,
  Shield,
  User,
} from "lucide-react";

// Full Orchestration Demo
function OrchestrationDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<Array<{ phase: string; message: string; icon: string }>>([]);

  const phases = useMemo(() => [
    {
      id: "input",
      name: "Input",
      icon: MessageSquare,
      color: "cyan",
      steps: [
        { message: "Customer ticket received: 'Search is slow'", icon: "📥", actor: "customer" },
        { message: "AI triaging: Bug → Performance → High Priority", icon: "🤖", actor: "ai" },
        { message: "PM reviews draft issue, adds acceptance criteria", icon: "👤", actor: "human" },
        { message: "Issue ENG-2901 created, assigned to cycle", icon: "✓", actor: "system" },
      ],
    },
    {
      id: "execute",
      name: "Execute",
      icon: Code,
      color: "violet",
      steps: [
        { message: "Background agent picks up ENG-2901", icon: "🤖", actor: "ai" },
        { message: "Analyzing codebase for search implementation", icon: "🔍", actor: "ai" },
        { message: "Implementing: Add query caching layer", icon: "💻", actor: "ai" },
        { message: "Running tests... 24/24 passing", icon: "✓", actor: "system" },
      ],
    },
    {
      id: "review",
      name: "Review",
      icon: GitPullRequest,
      color: "amber",
      steps: [
        { message: "PR #892 created with implementation", icon: "📝", actor: "ai" },
        { message: "CI checks: lint ✓, types ✓, tests ✓", icon: "✓", actor: "system" },
        { message: "AI review: No issues found", icon: "🤖", actor: "ai" },
        { message: "Human review: Approved with comment", icon: "👤", actor: "human" },
      ],
    },
    {
      id: "deploy",
      name: "Deploy",
      icon: Rocket,
      color: "emerald",
      steps: [
        { message: "PR merged to main", icon: "🔀", actor: "system" },
        { message: "Deployed to staging environment", icon: "🚀", actor: "system" },
        { message: "Staging validation: smoke tests pass", icon: "✓", actor: "system" },
        { message: "Promoted to production", icon: "🎉", actor: "system" },
      ],
    },
    {
      id: "monitor",
      name: "Monitor",
      icon: BarChart2,
      color: "pink",
      steps: [
        { message: "Monitoring: Search latency -47%", icon: "📊", actor: "system" },
        { message: "Issue ENG-2901 auto-closed", icon: "✓", actor: "system" },
        { message: "Customer notified: 'Your feedback was addressed'", icon: "📧", actor: "system" },
        { message: "Feedback loop complete", icon: "🔄", actor: "system" },
      ],
    },
  ], []);

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  };


  const runDemo = useCallback(() => {
    setIsRunning(true);
    setCurrentPhase(0);
    setCurrentStep(0);
    setLogs([]);
  }, []);

  useEffect(() => {
    if (!isRunning || currentPhase < 0) return;

    const timer = setTimeout(() => {
      const phase = phases[currentPhase];
      
      // Add log for current step
      if (currentStep < phase.steps.length) {
        const step = phase.steps[currentStep];
        setLogs(prev => [...prev, { phase: phase.name, message: step.message, icon: step.icon }]);
      }

      // Move to next step or phase
      if (currentStep < phase.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else if (currentPhase < phases.length - 1) {
        setCurrentPhase(prev => prev + 1);
        setCurrentStep(0);
      } else {
        setIsRunning(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isRunning, currentPhase, currentStep, phases]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase(-1);
    setCurrentStep(-1);
    setLogs([]);
  };

  const isComplete = currentPhase === phases.length - 1 && currentStep === phases[phases.length - 1].steps.length - 1 && !isRunning;

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">E2E Pipeline Demo</h4>
        <div className="flex items-center gap-2">
          {!isRunning && currentPhase < 0 && (
            <button
              onClick={runDemo}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              Run Demo
            </button>
          )}
          {(currentPhase >= 0 || isComplete) && (
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

      {/* Phase indicators */}
      <div className="flex items-center justify-between mb-6 px-2 overflow-x-auto">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const colors = colorClasses[phase.color];
          const isActive = currentPhase === index;
          const isPast = currentPhase > index;
          const isFuture = currentPhase < index;

          return (
            <div key={phase.id} className="flex items-center">
              <div className={`
                flex flex-col items-center transition-all duration-300
                ${isActive ? "scale-110" : ""}
                ${isFuture && currentPhase >= 0 ? "opacity-40" : ""}
              `}>
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${isPast ? "bg-emerald-500/20 border-emerald-500/30" : colors.bg}
                  ${isActive ? `${colors.border} border-2` : "border border-border"}
                `}>
                  {isPast ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? colors.text : "text-muted-foreground"}`} />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? colors.text : "text-muted-foreground"}`}>
                  {phase.name}
                </span>
              </div>
              {index < phases.length - 1 && (
                <ArrowDown className={`w-4 h-4 mx-2 rotate-[-90deg] ${isPast ? "text-emerald-400" : "text-muted-foreground/30"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Activity log */}
      <div className="rounded-lg bg-background border border-border overflow-hidden">
        <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Pipeline Activity</span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> AI</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> Human</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> System</span>
          </div>
        </div>
        <div className="h-[200px] overflow-y-auto p-3 space-y-2">
          {logs.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Click &quot;Run Demo&quot; to see the full pipeline in action
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-lg shrink-0">{log.icon}</span>
                <div>
                  <span className="text-muted-foreground">[{log.phase}]</span>{" "}
                  <span className="text-foreground">{log.message}</span>
                </div>
              </div>
            ))
          )}
          {isComplete && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Pipeline Complete!</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 m-0">
                Customer feedback → Production deployment in a single automated flow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function E2EPipelineSection() {
  return (
    <section id="e2e-pipeline" className="scroll-mt-20">
      <SectionHeading
        id="e2e-pipeline-heading"
        title="End-to-End Agentic Pipeline"
        subtitle="Full stack from customer feedback to production"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The end-to-end agentic pipeline connects <strong className="text-foreground">customer 
          feedback to production deployment</strong> with AI assistance at every stage. This is 
          the full vision: automated where beneficial, human-controlled where judgment is needed.
        </p>

        <Callout variant="important" title="Mix and Match">
          <p className="m-0">
            The tools shown here are <strong>examples</strong>. The pattern matters more than 
            specific vendors. Substitute any tool that fits your team&apos;s needs: the architecture 
            remains the same.
          </p>
        </Callout>

        {/* Full Orchestration Demo */}
        <h3 id="pipeline-demo" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Pipeline in Action
        </h3>

        <p className="text-muted-foreground">
          Watch the complete flow from customer feedback to production deployment:
        </p>

        <OrchestrationDemo />

        {/* The Full Stack Architecture */}
        <h3 id="full-stack" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Full Stack Architecture
        </h3>

        <p className="text-muted-foreground">
          The pipeline has five stages: <strong className="text-foreground">Input → Execute → 
          Review → Deploy → Monitor</strong>. AI assists at each stage, but humans control the 
          gates between stages.
        </p>

        <div className="grid gap-4 sm:grid-cols-5 mt-6">
          <Card variant="default">
            <CardContent className="text-center">
              <MessageSquare className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">Input</h4>
              <p className="text-xs text-muted-foreground m-0">Feedback → Tasks</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <Code className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">Execute</h4>
              <p className="text-xs text-muted-foreground m-0">Tasks → Code</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <GitPullRequest className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">Review</h4>
              <p className="text-xs text-muted-foreground m-0">AI + Human</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <Rocket className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">Deploy</h4>
              <p className="text-xs text-muted-foreground m-0">Stage → Prod</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <BarChart2 className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">Monitor</h4>
              <p className="text-xs text-muted-foreground m-0">Observe → Loop</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer to Task */}
        <h3 id="customer-to-task" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Customer to Task
        </h3>

        <p className="text-muted-foreground">
          Customer feedback arrives through support channels, user research, and analytics. AI 
          helps <strong className="text-foreground">triage, categorize, and draft tasks</strong>, 
          while PMs validate and prioritize.
        </p>

        {/* Task to Production */}
        <h3 id="task-to-production" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Task to Production
        </h3>

        <p className="text-muted-foreground">
          Well-defined tasks flow through <strong className="text-foreground">layered review</strong>: 
          automated checks, AI review, then human review. Each layer catches different issues.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Tool Categories</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Task Management:</strong> Linear, Jira, Notion, GitHub Issues</li>
              <li><strong className="text-foreground">AI IDE:</strong> Cursor, Windsurf, VS Code + Copilot</li>
              <li><strong className="text-foreground">Background Agents:</strong> Cursor Web, Devin, Copilot Workspace</li>
              <li><strong className="text-foreground">PR Management:</strong> Graphite, GitHub, GitLab</li>
              <li><strong className="text-foreground">CI/CD:</strong> GitHub Actions, CircleCI, Jenkins</li>
              <li><strong className="text-foreground">Monitoring:</strong> Datadog, Sentry, PagerDuty</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="important" title="Human in the Loop">
          <p className="m-0">
            The pipeline optimizes for <strong>automation with oversight</strong>. Every stage 
            has a human checkpoint. Full automation without review is risky; full manual work 
            doesn&apos;t scale. Find the balance that fits your risk tolerance.
          </p>
        </Callout>

        <Callout variant="tip" title="Start Small" className="mt-6">
          <p className="m-0">
            <strong>Week 1:</strong> Add AI code review to PRs • 
            <strong>Week 2:</strong> Set up project rules for your AI IDE • 
            <strong>Week 3:</strong> Try background agent on a small task • 
            <strong>Week 4:</strong> Connect task tracker to trigger agents
          </p>
        </Callout>
      </div>
    </section>
  );
}
