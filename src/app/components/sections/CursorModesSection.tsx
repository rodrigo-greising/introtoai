"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { 
  MessageSquare, 
  Layers,
  Bot,
  Check,
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
      bestMode: "chat",
      reasoning: "Start in Chat to understand the issue through discussion. Once you identify the fix, you can apply it or switch to Composer for multi-file changes.",
    },
    {
      id: "new-component",
      label: "Create a new React component",
      icon: "🧩",
      bestMode: "composer",
      reasoning: "Composer excels at single or multi-file creation. Describe the component, and it will generate the file(s) with proper structure.",
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
      bestMode: "chat",
      reasoning: "Chat is perfect for exploration and explanation. Ask questions, get context, understand behavior without making changes.",
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
      id: "add-tests",
      label: "Add tests to existing code",
      icon: "🧪",
      bestMode: "composer",
      reasoning: "Composer can see the source file and generate corresponding test files. You review the complete set of tests before applying.",
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
    chat: {
      name: "Chat",
      icon: MessageSquare,
      color: "cyan",
      description: "Discussion and exploration without direct file changes",
    },
    composer: {
      name: "Composer",
      icon: Layers,
      color: "violet",
      description: "Multi-file edits with diff preview before applying",
    },
    agent: {
      name: "Agent",
      icon: Bot,
      color: "amber",
      description: "Autonomous execution with terminal and file access",
    },
    inline: {
      name: "Inline (Cmd+K)",
      icon: Check,
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Chat</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Questions, explanations, debugging discussion. Doesn&apos;t directly modify files.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-violet-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Composer</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Multi-file edits in one go. Best for coordinated changes across files.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Agent</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Autonomous execution. Can run commands, iterate on feedback, chain actions.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-medium text-foreground m-0">Inline</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Cmd+K for quick edits. Select code, describe change, apply. Fastest path.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Composer Mode */}
        <h3 id="composer-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Composer Mode
        </h3>

        <p className="text-muted-foreground">
          Composer is your workhorse for <strong className="text-foreground">planned changes</strong>. 
          It shows you diffs before applying, lets you @-mention context, and handles multi-file 
          changes gracefully.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Composer Excels At</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Creating new files with structure</li>
                <li>Coordinated changes across files</li>
                <li>Refactoring with review before apply</li>
                <li>Adding features with test files</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">✗ Less Suited For</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Exploratory debugging</li>
                <li>Tasks requiring command execution</li>
                <li>Iterative trial-and-error work</li>
                <li>Changes that need verification</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Chat Mode */}
        <h3 id="chat-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Chat Mode
        </h3>

        <p className="text-muted-foreground">
          Chat is for <strong className="text-foreground">exploration and understanding</strong>. 
          Ask questions, get explanations, discuss approaches—without committing to changes yet.
        </p>

        <Callout variant="tip" title="Chat → Composer Workflow">
          <p className="m-0">
            A powerful pattern: Start in Chat to understand a problem, discuss potential solutions, 
            then switch to Composer when you&apos;re ready to implement. Chat for thinking, Composer for doing.
          </p>
        </Callout>

        {/* Agent Mode */}
        <h3 id="agent-mode" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Agent Mode
        </h3>

        <p className="text-muted-foreground">
          Agent mode is <strong className="text-foreground">autonomous execution</strong>. The agent 
          can run terminal commands, observe outputs, make changes, and iterate until the task is complete.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Agent Mode Capabilities</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Run terminal commands</li>
                <li>Read command output</li>
                <li>Create and modify files</li>
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

        <Callout variant="warning" title="Agent Mode Trust">
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
