"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import {
  MessageSquare,
  FileText,
  Code,
  GitPullRequest,
  CheckCircle,
  Rocket,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";

// Interactive Issue-to-PR Flow Visualization
function IssueToPRFlow() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      id: "feedback",
      name: "Customer Feedback",
      icon: MessageSquare,
      color: "cyan",
      description: "User reports: 'Can't export data to CSV'",
      detail: "Support ticket received via Intercom",
    },
    {
      id: "triage",
      name: "AI Triage",
      icon: FileText,
      color: "violet",
      description: "AI categorizes as 'Feature Request' with High priority",
      detail: "Based on keyword analysis and user tier",
    },
    {
      id: "issue",
      name: "Issue Created",
      icon: FileText,
      color: "amber",
      description: "ENG-2847: Add CSV export to data table",
      detail: "With acceptance criteria and technical notes",
    },
    {
      id: "agent",
      name: "Agent Picks Up",
      icon: Code,
      color: "emerald",
      description: "Background agent starts implementation",
      detail: "Issue marked 'In Progress', branch created",
    },
    {
      id: "pr",
      name: "PR Created",
      icon: GitPullRequest,
      color: "pink",
      description: "Draft PR #456: Add CSV export functionality",
      detail: "Tests passing, linked to ENG-2847",
    },
    {
      id: "review",
      name: "Review & Merge",
      icon: CheckCircle,
      color: "cyan",
      description: "Human reviews, AI code review assists",
      detail: "PR approved and merged to main",
    },
    {
      id: "deploy",
      name: "Deployed",
      icon: Rocket,
      color: "emerald",
      description: "Feature live in production",
      detail: "Issue auto-closed, customer notified",
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  };

  const runFlow = useCallback(() => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompleted(false);
  }, []);

  useEffect(() => {
    if (!isRunning || currentStep < 0) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsRunning(false);
        setCompleted(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps.length]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setCompleted(false);
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Issue-to-PR Flow</h4>
        <div className="flex items-center gap-2">
          {!isRunning && !completed && (
            <button
              onClick={runFlow}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              Run Flow
            </button>
          )}
          {(currentStep >= 0 || completed) && (
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

      {/* Flow visualization - Grid layout for better visibility */}
      <div className="space-y-6">
        {/* Top row: visual flow */}
        <div className="relative overflow-x-auto pb-4">
          <div className="flex items-center gap-1 min-w-max px-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorClasses[step.color];
              const isActive = currentStep === index;
              const isPast = currentStep > index;
              const isFuture = currentStep < index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    relative flex flex-col items-center transition-all duration-300
                    ${isActive ? "scale-105" : ""}
                    ${isFuture && currentStep >= 0 ? "opacity-40" : "opacity-100"}
                  `}>
                    {/* Icon container */}
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center transition-all
                      ${isPast ? "bg-emerald-500/20 border-emerald-500/30" : colors.bg}
                      ${isActive ? `${colors.border} border-2 shadow-lg shadow-${step.color}-500/20` : "border border-border"}
                    `}>
                      {isPast ? (
                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <Icon className={`w-7 h-7 ${isActive ? colors.text : "text-muted-foreground"}`} />
                      )}
                    </div>
                    
                    {/* Label */}
                    <div className={`mt-2 text-center px-1 ${isActive ? colors.text : "text-muted-foreground"}`}>
                      <div className="text-[11px] font-medium whitespace-nowrap">{step.name}</div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <ArrowRight className={`w-5 h-5 mx-2 shrink-0 transition-colors ${
                      isPast ? "text-emerald-400" : 
                      isActive ? colors.text : 
                      "text-muted-foreground/30"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom section: detailed step info */}
        <div className="min-h-[120px]">
          {currentStep >= 0 && currentStep < steps.length && (
            <div className={`p-4 rounded-xl ${colorClasses[steps[currentStep].color].bg} border ${colorClasses[steps[currentStep].color].border} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[steps[currentStep].color].bg} border ${colorClasses[steps[currentStep].color].border} flex items-center justify-center shrink-0`}>
                  {(() => {
                    const Icon = steps[currentStep].icon;
                    return <Icon className={`w-6 h-6 ${colorClasses[steps[currentStep].color].text}`} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${colorClasses[steps[currentStep].color].text} mb-1`}>
                    Step {currentStep + 1}: {steps[currentStep].name}
                  </div>
                  <div className="text-sm text-foreground mb-2">{steps[currentStep].description}</div>
                  <div className="text-xs text-muted-foreground">{steps[currentStep].detail}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono shrink-0">
                  {currentStep + 1}/{steps.length}
                </div>
              </div>
            </div>
          )}
          {currentStep === -1 && !completed && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Click &quot;Run Flow&quot; to see the automated issue-to-PR pipeline
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status message */}
      {completed && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-emerald-400">Pipeline Complete!</div>
            <div className="text-xs text-muted-foreground">Customer feedback → Production in hours, not days</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LinearSection() {
  return (
    <section id="linear" className="scroll-mt-20">
      <SectionHeading
        id="linear-heading"
        title="Linear and Task Management"
        subtitle="From customer feedback to automated task execution"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Task management is the <strong className="text-foreground">bridge between intent and 
          execution</strong>. When integrated with AI workflows, your issue tracker becomes the 
          source of truth that drives automated development—from customer feedback to deployed code.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Linear is used as the primary example. These patterns apply to other tools: 
            <strong>Jira</strong>, <strong>Notion</strong>, <strong>Asana</strong>, 
            <strong>GitHub Issues/Projects</strong>, <strong>Shortcut</strong>, 
            <strong>Height</strong>, <strong>Plane</strong>.
          </p>
        </Callout>

        {/* Issue-to-PR Flow */}
        <h3 id="flow-diagram" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Full Flow
        </h3>

        <p className="text-muted-foreground">
          Watch how a customer request flows through the entire pipeline, from initial feedback 
          to deployed code:
        </p>

        <IssueToPRFlow />

        {/* Linear as the Source of Truth */}
        <h3 id="linear-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Linear as the Source of Truth
        </h3>

        <p className="text-muted-foreground">
          In an agentic workflow, the issue tracker is <strong className="text-foreground">where 
          work is defined and tracked</strong>. Every task, bug, and feature has a canonical 
          representation that both humans and AI systems reference.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">What Lives in Linear</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Task definitions and acceptance criteria</li>
                <li>Priority and status tracking</li>
                <li>Links to PRs and deployments</li>
                <li>Discussion and decisions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Why Single Source Matters</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>AI knows where to find task context</li>
                <li>Humans and AI see same state</li>
                <li>Automation has reliable triggers</li>
                <li>Progress is visible and auditable</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* From Customer Feedback to Tasks */}
        <h3 id="feedback-to-tasks" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Feedback to Tasks
        </h3>

        <p className="text-muted-foreground">
          The journey from &quot;customer says X&quot; to &quot;code is deployed&quot; can be <strong className="text-foreground">partially 
          automated</strong>. AI helps translate feedback into structured tasks, but humans validate 
          that the translation is correct.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Feedback to Task Pipeline</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li><strong className="text-foreground">Capture:</strong> Customer feedback arrives (support ticket, interview, survey)</li>
              <li><strong className="text-foreground">Triage:</strong> AI categorizes and suggests priority</li>
              <li><strong className="text-foreground">Draft:</strong> AI creates draft issue with proposed scope</li>
              <li><strong className="text-foreground">Refine:</strong> PM reviews, adjusts, adds acceptance criteria</li>
              <li><strong className="text-foreground">Commit:</strong> Issue enters backlog with clear definition</li>
            </ol>
          </CardContent>
        </Card>

        {/* Issue-to-PR Automation */}
        <h3 id="issue-to-pr" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Issue-to-PR Automation
        </h3>

        <p className="text-muted-foreground">
          The holy grail: <strong className="text-foreground">issues that automatically become 
          PRs</strong>. With sufficiently well-defined tasks and capable AI agents, this becomes 
          possible for certain classes of work.
        </p>

        <p className="text-muted-foreground">
          When an issue is marked &quot;Ready for AI&quot;, a webhook can trigger an automated workflow: extract 
          the task definition from the issue, validate it has required fields (acceptance criteria, scope), 
          submit to a background agent with the repo and branch info, and link the job to the issue. This 
          enables fully automated issue-to-PR workflows for well-scoped tasks.
        </p>

        {/* Example Chat Log */}
        <div className="my-6 p-4 rounded-xl bg-muted/30 border border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Example: Agent Chat Log
          </h4>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex gap-2">
              <span className="text-emerald-400 shrink-0">[System]:</span>
              <span className="text-muted-foreground">New task received: ENG-2847 &quot;Add CSV export to data table&quot;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Analyzing task requirements... Found acceptance criteria.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Creating branch: feat/eng-2847-csv-export</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Reading src/components/DataTable.tsx... Found export button location.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Implementing CSV export function using existing data structure...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Running tests... ✓ 12/12 passed</span>
            </div>
            <div className="flex gap-2">
              <span className="text-violet-400 shrink-0">[Agent]:</span>
              <span className="text-muted-foreground">Creating PR #456 with summary: &quot;Adds CSV export functionality with proper escaping&quot;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-400 shrink-0">[System]:</span>
              <span className="text-muted-foreground">Task complete. PR linked to ENG-2847. Awaiting human review.</span>
            </div>
          </div>
        </div>

        <Callout variant="warning" title="Scope Appropriately">
          <p className="m-0">
            Not every issue should be auto-implemented. Start with <strong>well-scoped, 
            low-risk tasks</strong>: bug fixes with clear repro steps, small features with 
            explicit specs. Build trust before expanding scope.
          </p>
        </Callout>

        {/* AI-Assisted PM Workflows */}
        <h3 id="pm-workflows" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          AI-Assisted PM Workflows
        </h3>

        <p className="text-muted-foreground">
          Product managers can use AI to <strong className="text-foreground">accelerate the 
          definition work</strong>—turning rough ideas into structured specs faster.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Research Synthesis</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI summarizes user interviews, identifies patterns, highlights key quotes
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Spec Drafting</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI generates first draft of PRD from rough notes and discussions
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Task Breakdown</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI suggests how to decompose feature into implementable tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Prototyping vs Curated Branches */}
        <h3 id="branch-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Prototyping vs Curated Branches
        </h3>

        <p className="text-muted-foreground">
          AI-generated code creates a new decision point: when should you <strong className="text-foreground">prototype 
          freely</strong> vs maintain <strong className="text-foreground">curated, production-ready branches</strong>?
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Prototype Branches</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Fast exploration, AI generates freely, iterate quickly
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>AI creates multiple implementation options</li>
                <li>Quick validation of feasibility</li>
                <li>Throwaway code—don&apos;t merge directly</li>
                <li>Use for: spikes, POCs, design exploration</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Curated Branches</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Careful iteration, human-guided, production-ready
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>AI follows established patterns</li>
                <li>Each commit reviewed before merging</li>
                <li>Maintains code quality standards</li>
                <li>Use for: features, bug fixes, refactors</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Mini-Product Pattern">
          <p className="mb-2">
            Treat AI-generated prototype branches as <strong>&quot;mini-products&quot;</strong>: self-contained 
            experiments you can demo, validate with users, then either promote to curated development 
            or discard entirely.
          </p>
          <p className="m-0">
            This prevents the common failure mode of merging half-baked AI code that becomes 
            unmaintainable tech debt.
          </p>
        </Callout>

        <Callout variant="tip" title="Alternative Tools" className="mt-6">
          <p className="m-0">
            <strong>Jira:</strong> Enterprise-grade with extensive integrations • 
            <strong>Notion:</strong> Flexible, database-driven task tracking • 
            <strong>GitHub Projects:</strong> Native integration with repos • 
            <strong>Shortcut:</strong> Linear-like UX for larger teams
          </p>
        </Callout>
      </div>
    </section>
  );
}
