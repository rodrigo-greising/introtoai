"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { 
  MessageCircleQuestion, 
  ListTodo,
  Bot,
  Bug,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// Interactive Mode Matcher
function UseCaseMatcher() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  const tasks = [
    {
      id: "debug",
      label: "Debug a function that's not working",
      icon: "🐛",
      bestMode: "debug",
      reasoning: "Debug mode is purpose-built for this. It analyzes the error, inspects relevant code, and suggests targeted fixes.",
    },
    {
      id: "new-component",
      label: "Create a new React component",
      icon: "🧩",
      bestMode: "agent",
      reasoning: "Agent mode can create files, add proper structure, imports, and even set up related test files in one go.",
    },
    {
      id: "refactor-multiple",
      label: "Refactor a pattern across many files",
      icon: "🔄",
      bestMode: "agent",
      reasoning: "Agent mode can search for all occurrences, make coordinated changes, and verify each file still works. It handles the iteration automatically.",
    },
    {
      id: "explain-code",
      label: "Understand how existing code works",
      icon: "📖",
      bestMode: "ask",
      reasoning: "Ask mode is perfect for exploration and explanation. Get context and understand behavior without making changes.",
    },
    {
      id: "quick-edit",
      label: "Change one line in a function",
      icon: "✏️",
      bestMode: "inline",
      reasoning: "Use Cmd+K inline edit. Select the code, describe the change, and apply. Fastest path for small, focused edits.",
    },
    {
      id: "implement-feature",
      label: "Implement a feature from a spec",
      icon: "🚀",
      bestMode: "agent",
      reasoning: "Agent mode can read the spec, create files, write tests, run them, and iterate until everything passes. Best for substantial work.",
    },
    {
      id: "plan-approach",
      label: "Plan how to approach a complex task",
      icon: "🗺️",
      bestMode: "plan",
      reasoning: "Plan mode helps you break down complex tasks into steps before executing. Great for understanding the full scope first.",
    },
    {
      id: "migrate-lib",
      label: "Migrate from one library to another",
      icon: "📦",
      bestMode: "agent",
      reasoning: "Agent can systematically find all usages, apply the new patterns, run tests to verify, and iterate on failures. Best for migrations.",
    },
  ];

  const modeInfo = {
    agent: {
      name: "Agent",
      icon: Bot,
      color: "amber",
      description: "Autonomous execution with terminal and file access",
    },
    plan: {
      name: "Plan",
      icon: ListTodo,
      color: "violet",
      description: "Break down complex tasks into reviewable steps first",
    },
    debug: {
      name: "Debug",
      icon: Bug,
      color: "rose",
      description: "Purpose-built for fixing errors and bugs",
    },
    ask: {
      name: "Ask",
      icon: MessageCircleQuestion,
      color: "cyan",
      description: "Questions and explanations without changes",
    },
    inline: {
      name: "Inline (Cmd+K)",
      icon: Sparkles,
      color: "emerald",
      description: "Quick in-place edits on selected code",
    },
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  };

  const selectedTaskData = tasks.find(t => t.id === selectedTask);
  const selectedModeData = selectedTaskData ? modeInfo[selectedTaskData.bestMode as keyof typeof modeInfo] : null;

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Mode Matcher</h4>
        <span className="text-xs text-muted-foreground">Select a task to see the best mode</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Task selection */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedTask === task.id
                  ? 'border-[var(--highlight)] bg-[var(--highlight)]/10'
                  : 'border-border bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{task.icon}</span>
                <span className="text-sm text-foreground flex-1">{task.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedTask === task.id ? 'rotate-90' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Recommendation */}
        <div className="flex flex-col">
          {selectedTaskData && selectedModeData ? (
            <div className={`flex-1 p-4 rounded-lg ${colorClasses[selectedModeData.color].bg} border ${colorClasses[selectedModeData.color].border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${colorClasses[selectedModeData.color].bg} flex items-center justify-center`}>
                  <selectedModeData.icon className={`w-5 h-5 ${colorClasses[selectedModeData.color].text}`} />
                </div>
                <div>
                  <div className={`font-medium ${colorClasses[selectedModeData.color].text}`}>
                    Best: {selectedModeData.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedModeData.description}
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded bg-background/50 border border-border/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Why this mode?</div>
                <p className="text-sm text-foreground m-0">
                  {selectedTaskData.reasoning}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 rounded-lg bg-muted/20 border border-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                Select a task to see the recommended mode
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CursorModesSection() {
  return (
    <section id="cursor-modes" className="scroll-mt-20">
      <SectionHeading
        id="cursor-modes-heading"
        title="Cursor Modes"
        subtitle="Choosing the right interaction mode for each task"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Cursor offers multiple interaction modes, each suited for different tasks. Choosing the 
          right mode <strong className="text-foreground">dramatically affects output quality</strong> and 
          your efficiency.
        </p>

        {/* Mode Overview */}
        <h3 id="mode-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Mode Overview
        </h3>

        <p className="text-muted-foreground">
          Cursor provides five main interaction modes. Each is optimized for different tasks—using 
          the right mode makes the AI significantly more effective.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Agent</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Full autonomous execution. Creates files, runs commands, iterates on errors automatically.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <ListTodo className="w-4 h-4 text-violet-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Plan</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Breaks down complex tasks into steps. Review the plan before execution begins.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Bug className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Debug</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Purpose-built for fixing errors. Analyzes errors, inspects code, suggests targeted fixes.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <MessageCircleQuestion className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Ask</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Questions and explanations only. Understand code without making changes.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Inline (Cmd+K)</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Quick edits on selected code. Fastest path for small, focused changes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agent Mode */}
        <h3 id="agent-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Agent Mode
        </h3>

        <p className="text-muted-foreground">
          Agent is the <strong className="text-foreground">most capable mode</strong>—it can read files, 
          create files, run terminal commands, observe outputs, and iterate until the task is complete. 
          Use it for substantial work that requires multiple steps or verification.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Agent Mode Capabilities</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Create and modify files</li>
                <li>Run terminal commands</li>
                <li>Read command output</li>
                <li>Search the codebase</li>
              </ul>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Run tests and see results</li>
                <li>Iterate on failures</li>
                <li>Install dependencies</li>
                <li>Verify changes work</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Plan Mode */}
        <h3 id="plan-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Plan Mode
        </h3>

        <p className="text-muted-foreground">
          Plan mode is for <strong className="text-foreground">complex tasks that benefit from 
          thinking first</strong>. The AI breaks down the task into steps, you review and approve 
          the plan, then it executes.
        </p>

        <Callout variant="tip" title="Plan → Agent Workflow">
          <p className="m-0">
            A powerful pattern: Start with Plan mode to understand the full scope, review the 
            proposed steps, then let it execute as an agent. Planning first reduces surprises.
          </p>
        </Callout>

        {/* Debug Mode */}
        <h3 id="debug-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Debug Mode
        </h3>

        <p className="text-muted-foreground">
          Debug mode is <strong className="text-foreground">purpose-built for fixing errors</strong>. 
          When you have an error, Debug mode analyzes the stack trace, inspects relevant code, and 
          suggests targeted fixes.
        </p>

        {/* Ask Mode */}
        <h3 id="ask-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Ask Mode
        </h3>

        <p className="text-muted-foreground">
          Ask is for <strong className="text-foreground">exploration and understanding</strong>. 
          Ask questions, get explanations, understand code—without making any changes.
        </p>

        {/* Inline Completion */}
        <h3 id="inline-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Inline Completion (Cmd+K)
        </h3>

        <p className="text-muted-foreground">
          The fastest path for small edits. Select code, press Cmd+K, describe the change, and 
          apply. Also provides <strong className="text-foreground">tab-completion suggestions</strong> as 
          you type—accept with Tab, reject by continuing to type.
        </p>

        <Callout variant="warning" title="Trust Levels">
          <p className="m-0">
            Agent mode can execute commands. Always review what it&apos;s about to run, especially 
            for commands that could affect your system beyond the project. Use sandboxing when available.
          </p>
        </Callout>

        {/* Interactive Mode Matcher */}
        <h3 id="mode-matcher" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Mode Matcher
        </h3>

        <p className="text-muted-foreground">
          Not sure which mode to use? Select your task type to see the recommended mode and reasoning:
        </p>

        <UseCaseMatcher />

        {/* Mode Switching Tips */}
        <h3 id="mode-switching" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Mode Switching Tips
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Start Narrow, Expand If Needed</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Begin with inline edit or Chat. Only escalate to Composer or Agent when the 
                    task genuinely requires it. More power = more potential for unintended changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Use @-Mentions Liberally</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    In any mode, @-mentioning files gives explicit context. Don&apos;t rely on 
                    auto-detection—be explicit about what the AI should see.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Review Before Apply</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    In Composer and Agent, always review diffs before accepting. The AI makes 
                    plausible-looking mistakes. Trust but verify.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
