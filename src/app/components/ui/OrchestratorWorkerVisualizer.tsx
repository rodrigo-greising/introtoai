"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ContextItem {
  label: string;
  value: string;
  tokens?: number;
  type: "system" | "tools" | "history" | "task" | "result" | "dynamic";
}

interface MessageNode {
  id: string;
  role: "orchestrator" | "worker" | "tool" | "user";
  content: string;
  timestamp: number;
  context: ContextItem[];
  isHighlighted?: boolean;
}

interface WorkerSession {
  id: string;
  taskName: string;
  messages: MessageNode[];
  status: "idle" | "running" | "completed";
  result?: string;
}

// ============================================================================
// Context Data
// ============================================================================

const orchestratorContext: ContextItem[] = [
  {
    label: "System Prompt",
    value: "You are a senior software architect orchestrating complex tasks. Decompose work into focused subtasks, delegate to workers, synthesize results. Never execute tasks directly—only coordinate.",
    tokens: 180,
    type: "system",
  },
  {
    label: "Tool Definitions",
    value: "spawn_worker(task, context, tools) → Creates isolated worker session\nget_worker_status(id) → Check progress\nsynthesizer(results[]) → Combine worker outputs",
    tokens: 120,
    type: "tools",
  },
  {
    label: "Conversation History",
    value: "User: \"Add dark mode to the dashboard\"\nOrchestrator: \"I'll break this into schema, API, and UI tasks...\"",
    tokens: 85,
    type: "history",
  },
];

const workerContext: ContextItem[] = [
  {
    label: "Worker System Prompt",
    value: "You are a focused code implementation worker. Execute the assigned task using available tools. Report results concisely. You have no memory of prior tasks.",
    tokens: 95,
    type: "system",
  },
  {
    label: "Assigned Task",
    value: "Create TypeScript interfaces for dark mode theme configuration including color tokens, component overrides, and persistence settings.",
    tokens: 45,
    type: "task",
  },
  {
    label: "Allowed Tools",
    value: "read_file, write_file, grep_codebase, run_typescript",
    tokens: 25,
    type: "tools",
  },
];

const workerToolContext: ContextItem[] = [
  {
    label: "Tool Call",
    value: "grep_codebase({ pattern: \"theme|color\", glob: \"**/*.ts\" })",
    tokens: 35,
    type: "dynamic",
  },
  {
    label: "Tool Result",
    value: "Found 12 matches in 4 files:\n• src/styles/colors.ts (4 matches)\n• src/hooks/useTheme.ts (3 matches)\n• ...",
    tokens: 85,
    type: "result",
  },
];

// ============================================================================
// Animation Timeline
// ============================================================================

interface TimelineStep {
  orchestratorMessage?: Partial<MessageNode>;
  workerMessage?: Partial<MessageNode>;
  workerStatus?: "idle" | "running" | "completed";
  description: string;
}

const timeline: TimelineStep[] = [
  {
    orchestratorMessage: {
      id: "o1",
      role: "user",
      content: "Add dark mode support to the dashboard",
      context: [
        {
          label: "User Request",
          value: "Natural language task request. The orchestrator will decompose this into subtasks.",
          tokens: 15,
          type: "task",
        },
      ],
    },
    description: "User submits task to orchestrator",
  },
  {
    orchestratorMessage: {
      id: "o2",
      role: "orchestrator",
      content: "I'll break this into 3 parallel subtasks:\n1. Schema: Define theme interfaces\n2. API: Add theme endpoints\n3. UI: Implement toggle component\n\nSpawning worker for Schema task...",
      context: orchestratorContext,
    },
    workerStatus: "running",
    description: "Orchestrator decomposes and spawns worker",
  },
  {
    workerMessage: {
      id: "w1",
      role: "worker",
      content: "Starting task: Define theme interfaces. Let me examine the existing codebase...",
      context: workerContext,
    },
    description: "Worker receives focused context",
  },
  {
    workerMessage: {
      id: "w2",
      role: "tool",
      content: "→ grep_codebase({ pattern: \"theme\" })\n\n← Found: src/styles/colors.ts, src/hooks/useTheme.ts",
      context: workerToolContext,
    },
    description: "Worker explores with tools (hidden from orchestrator)",
  },
  {
    workerMessage: {
      id: "w3",
      role: "tool",
      content: "→ read_file(\"src/styles/colors.ts\")\n\n← export const colors = { primary: '#3b82f6', ... }",
      context: [
        {
          label: "File Contents",
          value: "Full file contents loaded into worker context. ~200 tokens of code examined.",
          tokens: 200,
          type: "dynamic",
        },
      ],
    },
    description: "Worker reads files, context grows",
  },
  {
    workerMessage: {
      id: "w4",
      role: "worker",
      content: "Created interfaces in src/types/theme.ts:\n• ThemeConfig\n• ColorTokens\n• ThemePreference",
      context: [
        {
          label: "Implementation Complete",
          value: "Worker has examined 4 files, made 15 tool calls, written 3 new interfaces. Total worker context: ~1,200 tokens.",
          tokens: 1200,
          type: "result",
        },
      ],
    },
    workerStatus: "completed",
    description: "Worker completes task",
  },
  {
    orchestratorMessage: {
      id: "o3",
      role: "orchestrator",
      content: "✓ Schema task complete: Created ThemeConfig, ColorTokens, ThemePreference interfaces in src/types/theme.ts\n\nProceeding to spawn API and UI workers...",
      context: [
        ...orchestratorContext,
        {
          label: "Worker Result (summarized)",
          value: "Task: Define theme interfaces\nStatus: Complete\nOutput: Created 3 interfaces in src/types/theme.ts\n\nNote: 15 tool calls, 1,200 tokens of exploration—none in orchestrator context",
          tokens: 45,
          type: "result",
        },
      ],
    },
    description: "Orchestrator sees clean result only",
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

interface ContextTooltipProps {
  context: ContextItem[];
  title: string;
  position: "left" | "right";
}

function ContextTooltip({ context, title, position }: ContextTooltipProps) {
  const totalTokens = context.reduce((sum, item) => sum + (item.tokens || 0), 0);
  
  return (
    <div
      className={cn(
        "absolute z-50 w-80 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        position === "left" ? "right-full mr-3" : "left-full ml-3",
        "top-1/2 -translate-y-1/2"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
          ~{totalTokens} tokens
        </span>
      </div>
      
      <div className="space-y-3">
        {context.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  item.type === "system" && "bg-violet-500",
                  item.type === "tools" && "bg-cyan-500",
                  item.type === "history" && "bg-amber-500",
                  item.type === "task" && "bg-emerald-500",
                  item.type === "result" && "bg-rose-500",
                  item.type === "dynamic" && "bg-blue-500"
                )}
              />
              <span className="text-xs font-medium text-foreground">{item.label}</span>
              {item.tokens && (
                <span className="text-[9px] text-muted-foreground ml-auto">{item.tokens}t</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed pl-4 font-mono whitespace-pre-wrap">
              {item.value.length > 150 ? item.value.slice(0, 150) + "..." : item.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Token breakdown legend */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex flex-wrap gap-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> System
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tools
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> History
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Task
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Result
          </span>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: MessageNode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  side: "left" | "right";
}

function MessageBubble({ message, isHovered, onHover, side }: MessageBubbleProps) {
  const isOrchestrator = message.role === "orchestrator" || message.role === "user";
  const isToolCall = message.role === "tool";
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(message.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={cn(
          "px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer",
          message.role === "user" && "bg-muted/50 border border-border text-muted-foreground",
          message.role === "orchestrator" && "bg-violet-500/10 border border-violet-500/30 text-foreground",
          message.role === "worker" && "bg-cyan-500/10 border border-cyan-500/30 text-foreground",
          message.role === "tool" && "bg-slate-800/50 border border-slate-600/30 font-mono text-xs text-slate-300",
          isHovered && "ring-2 ring-[var(--highlight)] ring-offset-2 ring-offset-background"
        )}
      >
        {/* Role indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
              message.role === "user" && "bg-muted text-muted-foreground",
              message.role === "orchestrator" && "bg-violet-500/30 text-violet-400",
              message.role === "worker" && "bg-cyan-500/30 text-cyan-400",
              message.role === "tool" && "bg-slate-600/50 text-slate-400"
            )}
          >
            {message.role === "user" && "U"}
            {message.role === "orchestrator" && "O"}
            {message.role === "worker" && "W"}
            {message.role === "tool" && "⚡"}
          </div>
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              message.role === "user" && "text-muted-foreground",
              message.role === "orchestrator" && "text-violet-400",
              message.role === "worker" && "text-cyan-400",
              message.role === "tool" && "text-slate-500"
            )}
          >
            {message.role === "tool" ? "Tool Call" : message.role}
          </span>
        </div>
        
        <p className={cn(
          "whitespace-pre-wrap leading-relaxed m-0",
          isToolCall && "text-[11px]"
        )}>
          {message.content}
        </p>
      </div>
      
      {/* Context tooltip on hover */}
      {isHovered && message.context.length > 0 && (
        <ContextTooltip
          context={message.context}
          title={`${message.role === "orchestrator" || message.role === "user" ? "Orchestrator" : "Worker"} Context`}
          position={side}
        />
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface OrchestratorWorkerVisualizerProps {
  className?: string;
}

export function OrchestratorWorkerVisualizer({ className }: OrchestratorWorkerVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [orchestratorMessages, setOrchestratorMessages] = useState<MessageNode[]>([]);
  const [workerMessages, setWorkerMessages] = useState<MessageNode[]>([]);
  const [workerStatus, setWorkerStatus] = useState<"idle" | "running" | "completed">("idle");

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setOrchestratorMessages([]);
    setWorkerMessages([]);
    setWorkerStatus("idle");
  }, []);

  // Playback logic
  useEffect(() => {
    if (!isPlaying || currentStep >= timeline.length) {
      if (currentStep >= timeline.length) {
        setIsPlaying(false);
      }
      return;
    }

    const timeout = setTimeout(() => {
      const step = timeline[currentStep];
      
      if (step.orchestratorMessage) {
        setOrchestratorMessages(prev => [
          ...prev,
          { ...step.orchestratorMessage, timestamp: Date.now() } as MessageNode,
        ]);
      }
      
      if (step.workerMessage) {
        setWorkerMessages(prev => [
          ...prev,
          { ...step.workerMessage, timestamp: Date.now() } as MessageNode,
        ]);
      }
      
      if (step.workerStatus) {
        setWorkerStatus(step.workerStatus);
      }
      
      setCurrentStep(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep]);

  const progress = (currentStep / timeline.length) * 100;
  const currentDescription = currentStep > 0 && currentStep <= timeline.length 
    ? timeline[currentStep - 1].description 
    : "Press Play to start the demonstration";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="font-semibold text-foreground">Context Isolation Pattern</h4>
          <p className="text-sm text-muted-foreground m-0">
            Hover over messages to see their context scope
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentStep >= timeline.length) {
                reset();
                setTimeout(() => setIsPlaying(true), 50);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              isPlaying
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
            )}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </>
            ) : currentStep >= timeline.length ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Replay
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Play
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current step description */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border">
        <div className="w-6 h-6 rounded-full bg-[var(--highlight)]/20 flex items-center justify-center">
          <span className="text-xs font-bold text-[var(--highlight)]">{currentStep}</span>
        </div>
        <p className="text-sm text-muted-foreground m-0">{currentDescription}</p>
      </div>

      {/* Main visualization: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orchestrator Column */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-violet-500/20 bg-violet-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <h5 className="font-semibold text-violet-400 text-sm">Orchestrator</h5>
              </div>
              <span className="text-[10px] font-mono text-violet-400/70 bg-violet-500/20 px-2 py-0.5 rounded">
                Global Scope
              </span>
            </div>
            <p className="text-xs text-violet-300/60 m-0 mt-1">
              Clean conversation • Delegates work • Sees results only
            </p>
          </div>
          
          <div className="p-4 min-h-[320px] max-h-[400px] overflow-y-auto space-y-3">
            {orchestratorMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-violet-400/40 text-sm">
                Waiting for task...
              </div>
            ) : (
              orchestratorMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isHovered={hoveredMessage === msg.id}
                  onHover={setHoveredMessage}
                  side="right"
                />
              ))
            )}
          </div>
          
          {/* Context summary footer */}
          <div className="px-4 py-2 border-t border-violet-500/20 bg-violet-500/5">
            <div className="flex items-center justify-between text-[10px] text-violet-400/60">
              <span>Context: ~{orchestratorMessages.length > 0 ? 385 + orchestratorMessages.length * 50 : 0} tokens</span>
              <span>{orchestratorMessages.length} messages</span>
            </div>
          </div>
        </div>

        {/* Worker Column */}
        <div className={cn(
          "rounded-xl border overflow-hidden transition-all duration-500",
          workerStatus === "idle" && "border-slate-600/30 bg-slate-800/20",
          workerStatus === "running" && "border-cyan-500/50 bg-cyan-500/5",
          workerStatus === "completed" && "border-emerald-500/30 bg-emerald-500/5"
        )}>
          <div className={cn(
            "px-4 py-3 border-b transition-colors duration-500",
            workerStatus === "idle" && "border-slate-600/20 bg-slate-800/30",
            workerStatus === "running" && "border-cyan-500/30 bg-cyan-500/10",
            workerStatus === "completed" && "border-emerald-500/20 bg-emerald-500/10"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full transition-colors duration-500",
                  workerStatus === "idle" && "bg-slate-500",
                  workerStatus === "running" && "bg-cyan-500 animate-pulse",
                  workerStatus === "completed" && "bg-emerald-500"
                )} />
                <h5 className={cn(
                  "font-semibold text-sm transition-colors duration-500",
                  workerStatus === "idle" && "text-slate-400",
                  workerStatus === "running" && "text-cyan-400",
                  workerStatus === "completed" && "text-emerald-400"
                )}>
                  Worker Session
                </h5>
              </div>
              <span className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded uppercase transition-colors duration-500",
                workerStatus === "idle" && "text-slate-500 bg-slate-600/30",
                workerStatus === "running" && "text-cyan-400 bg-cyan-500/20",
                workerStatus === "completed" && "text-emerald-400 bg-emerald-500/20"
              )}>
                {workerStatus === "idle" ? "Isolated Scope" : workerStatus}
              </span>
            </div>
            <p className={cn(
              "text-xs m-0 mt-1 transition-colors duration-500",
              workerStatus === "idle" && "text-slate-500",
              workerStatus === "running" && "text-cyan-300/60",
              workerStatus === "completed" && "text-emerald-300/60"
            )}>
              Fresh context • Uses tools • Returns summary only
            </p>
          </div>
          
          <div className="p-4 min-h-[320px] max-h-[400px] overflow-y-auto space-y-3">
            {workerMessages.length === 0 ? (
              <div className={cn(
                "flex flex-col items-center justify-center h-full text-sm",
                workerStatus === "idle" && "text-slate-500"
              )}>
                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Worker not spawned yet
              </div>
            ) : (
              workerMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isHovered={hoveredMessage === msg.id}
                  onHover={setHoveredMessage}
                  side="left"
                />
              ))
            )}
          </div>
          
          {/* Context summary footer */}
          <div className={cn(
            "px-4 py-2 border-t transition-colors duration-500",
            workerStatus === "idle" && "border-slate-600/20 bg-slate-800/20",
            workerStatus === "running" && "border-cyan-500/20 bg-cyan-500/5",
            workerStatus === "completed" && "border-emerald-500/20 bg-emerald-500/5"
          )}>
            <div className={cn(
              "flex items-center justify-between text-[10px] transition-colors duration-500",
              workerStatus === "idle" && "text-slate-500",
              workerStatus === "running" && "text-cyan-400/60",
              workerStatus === "completed" && "text-emerald-400/60"
            )}>
              <span>Context: ~{workerMessages.length > 0 ? 165 + workerMessages.length * 120 : 0} tokens</span>
              <span>{workerMessages.filter(m => m.role === "tool").length} tool calls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key insight callout */}
      <div className="rounded-lg p-4 border bg-gradient-to-r from-violet-500/5 to-cyan-500/5 border-violet-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-[var(--highlight)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">The Context Isolation Win</h4>
            <p className="text-sm text-muted-foreground m-0">
              The orchestrator's context stays <strong className="text-foreground">~400 tokens</strong> while the worker explored with{" "}
              <strong className="text-foreground">~1,200 tokens</strong> of tool calls and file contents. 
              When the worker completes, only a <strong className="text-foreground">~50 token summary</strong> flows back. 
              This is how you scale complexity without scaling context—each worker is disposable, focused, 
              and invisible to the orchestrator's clean conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
