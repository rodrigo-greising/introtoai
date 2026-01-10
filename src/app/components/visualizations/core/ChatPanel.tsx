"use client";

import { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type {
  ChatMessage,
  WorkerMessage,
  ChatPanelConfig,
  MessageRole,
} from "@/lib/visualizations/types";

// =============================================================================
// Style Mappings
// =============================================================================

interface MessageStyle {
  bg: string;
  icon: string;
  label: string;
  labelColor: string;
}

const getMessageStyles = (
  role: MessageRole,
  colorTheme: string = "cyan"
): MessageStyle => {
  const themeColor = colorTheme === "violet" ? "violet" : "cyan";

  const styles: Record<MessageRole, MessageStyle> = {
    user: {
      bg: "bg-slate-700/50 border border-slate-600/50",
      icon: "👤",
      label: "User",
      labelColor: "text-slate-400",
    },
    assistant: {
      bg: `bg-${themeColor}-500/10 border border-${themeColor}-500/30`,
      icon: "🤖",
      label: "Assistant",
      labelColor: `text-${themeColor}-400`,
    },
    system: {
      bg: "bg-slate-800/50 border border-slate-700/50",
      icon: "⚙️",
      label: "System",
      labelColor: "text-slate-500",
    },
    orchestrator: {
      bg: "bg-violet-500/10 border border-violet-500/30",
      icon: "🎭",
      label: "Orchestrator",
      labelColor: "text-violet-400",
    },
    worker: {
      bg: "bg-amber-500/10 border border-amber-500/30",
      icon: "⚡",
      label: "Worker",
      labelColor: "text-amber-400",
    },
    tool_call: {
      bg: "bg-cyan-500/10 border border-cyan-500/30",
      icon: "→",
      label: "Tool Call",
      labelColor: "text-cyan-400",
    },
    tool_result: {
      bg: "bg-emerald-500/10 border border-emerald-500/30",
      icon: "←",
      label: "Result",
      labelColor: "text-emerald-400",
    },
    context: {
      bg: "bg-violet-500/10 border border-violet-500/30",
      icon: "📋",
      label: "Context",
      labelColor: "text-violet-400",
    },
    complete: {
      bg: "bg-emerald-500/10 border border-emerald-500/30",
      icon: "✓",
      label: "Complete",
      labelColor: "text-emerald-400",
    },
  };

  return styles[role] || styles.assistant;
};

const getWorkerMessageStyles = (
  type: WorkerMessage["type"]
): MessageStyle => {
  const styles: Record<WorkerMessage["type"], MessageStyle> = {
    task_start: {
      bg: "bg-violet-500/10 border border-violet-500/30",
      icon: "📋",
      label: "Task",
      labelColor: "text-violet-400",
    },
    thought: {
      bg: "bg-blue-500/10 border border-blue-500/30",
      icon: "💭",
      label: "Thinking",
      labelColor: "text-blue-400",
    },
    tool_call: {
      bg: "bg-cyan-500/10 border border-cyan-500/30 font-mono",
      icon: "→",
      label: "Tool Call",
      labelColor: "text-cyan-400",
    },
    tool_result: {
      bg: "bg-slate-700/50 border border-slate-600/30 font-mono",
      icon: "←",
      label: "Result",
      labelColor: "text-slate-400",
    },
    output: {
      bg: "bg-emerald-500/10 border border-emerald-500/30",
      icon: "✓",
      label: "Output",
      labelColor: "text-emerald-400",
    },
  };

  return styles[type];
};

// =============================================================================
// Message Components
// =============================================================================

interface ChatMessageItemProps {
  message: ChatMessage;
  colorTheme?: string;
}

function ChatMessageItem({ message, colorTheme = "cyan" }: ChatMessageItemProps) {
  const style = getMessageStyles(message.role, colorTheme);

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg text-sm transition-all duration-200",
        style.bg,
        message.metadata?.highlight && "ring-2 ring-offset-1 ring-offset-slate-900",
        message.metadata?.highlight &&
          (colorTheme === "violet" ? "ring-violet-500/50" : "ring-cyan-500/50")
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs">{style.icon}</span>
        <span className={cn("text-[9px] font-medium uppercase tracking-wider", style.labelColor)}>
          {message.metadata?.sender || style.label}
        </span>
        {message.metadata?.tokens && (
          <span className="ml-auto text-[9px] text-muted-foreground font-mono">
            ~{message.metadata.tokens} tokens
          </span>
        )}
      </div>
      <p
        className={cn(
          "whitespace-pre-wrap leading-relaxed m-0 text-[13px] text-slate-200",
          (message.role === "tool_call" || message.role === "tool_result") &&
            "font-mono text-[11px]"
        )}
      >
        {message.content}
      </p>
    </div>
  );
}

interface WorkerMessageItemProps {
  message: WorkerMessage;
}

function WorkerMessageItem({ message }: WorkerMessageItemProps) {
  const style = getWorkerMessageStyles(message.type);

  return (
    <div className={cn("px-3 py-2 rounded-lg text-sm transition-all duration-200", style.bg)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs">{style.icon}</span>
        <span className={cn("text-[9px] font-medium uppercase tracking-wider", style.labelColor)}>
          {style.label}
        </span>
        {message.tokens && (
          <span className="ml-auto text-[8px] text-muted-foreground font-mono">
            ~{message.tokens} tokens
          </span>
        )}
      </div>
      <p
        className={cn(
          "whitespace-pre-wrap leading-relaxed m-0",
          message.type === "tool_call" || message.type === "tool_result"
            ? "text-[11px]"
            : "text-[13px]"
        )}
      >
        {message.content}
      </p>
    </div>
  );
}

// =============================================================================
// Empty State
// =============================================================================

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "Press Play to start simulation" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2 min-h-[280px]">
      <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      {message}
    </div>
  );
}

// =============================================================================
// Worker Session View
// =============================================================================

interface WorkerSessionViewProps {
  messages: WorkerMessage[];
  outputTokens?: number;
}

function WorkerSessionView({ messages, outputTokens }: WorkerSessionViewProps) {
  const totalTokens = useMemo(
    () => messages.reduce((sum, m) => sum + (m.tokens || 0), 0),
    [messages]
  );

  return (
    <>
      {/* Context isolation banner */}
      <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-3">
        <p className="text-[11px] text-amber-400 m-0 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Isolated session — this context stays inside the worker (~{totalTokens} tokens)
        </p>
      </div>

      {messages.map((msg) => (
        <WorkerMessageItem key={msg.id} message={msg} />
      ))}

      {/* Summary note */}
      <div className="mt-4 pt-3 border-t border-amber-500/20">
        <p className="text-[10px] text-amber-400/80 m-0 mb-2 font-medium">
          ↑ All above stays isolated
        </p>
        <p className="text-[10px] text-muted-foreground m-0">
          Only the final <strong className="text-emerald-400">Output</strong> message returns to
          the orchestrator (~{outputTokens || messages.find((m) => m.type === "output")?.tokens || 50}{" "}
          tokens).
        </p>
      </div>
    </>
  );
}

// =============================================================================
// Main ChatPanel Component
// =============================================================================

export interface ChatPanelProps {
  /** Messages to display */
  messages: ChatMessage[];
  /** Configuration options */
  config?: ChatPanelConfig;
  /** Optional worker internal chat to display instead of main messages */
  workerChat?: WorkerMessage[];
  /** Whether this is showing a worker session */
  isWorkerView?: boolean;
  /** Custom className */
  className?: string;
}

export function ChatPanel({
  messages,
  config = {},
  workerChat,
  isWorkerView = false,
  className,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    title = "Conversation",
    subtitle,
    showTokenCounts = true,
    colorTheme = "cyan",
    maxHeight = 380,
  } = config;

  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, workerChat?.length]);

  // Calculate total tokens for worker view
  const workerTokens = useMemo(
    () => workerChat?.reduce((sum, m) => sum + (m.tokens || 0), 0) || 0,
    [workerChat]
  );

  const themeColors = {
    cyan: { dot: "bg-cyan-500", border: "border-cyan-500/20" },
    violet: { dot: "bg-violet-500", border: "border-violet-500/20" },
    amber: { dot: "bg-amber-500", border: "border-amber-500/20" },
    emerald: { dot: "bg-emerald-500", border: "border-emerald-500/20" },
  };

  const theme = themeColors[colorTheme] || themeColors.cyan;

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl border border-border bg-card/30 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-2 border-b bg-muted/20",
          isWorkerView ? theme.border : "border-border"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", theme.dot)} />
            <h5 className="font-semibold text-foreground text-sm">{title}</h5>
          </div>
          {isWorkerView && workerTokens > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
              ~{workerTokens} tokens isolated
            </span>
          )}
        </div>
        {subtitle && <p className="text-[10px] text-muted-foreground m-0 mt-0.5">{subtitle}</p>}
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        style={{ minHeight: "280px", maxHeight: `${maxHeight}px` }}
      >
        {isWorkerView && workerChat ? (
          <WorkerSessionView
            messages={workerChat}
            outputTokens={workerChat.find((m) => m.type === "output")?.tokens}
          />
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={{
                ...msg,
                metadata: {
                  ...msg.metadata,
                  tokens: showTokenCounts ? msg.metadata?.tokens : undefined,
                },
              }}
              colorTheme={colorTheme}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ChatPanel;
