/**
 * Unified Chat Message Types
 *
 * These types represent messages in any chat-based visualization,
 * whether it's an orchestration scenario, RAG pattern, or simple conversation.
 */

/**
 * Core message roles that appear across all chat visualizations
 */
export type MessageRole =
  | "user"
  | "assistant"
  | "system"
  | "orchestrator"
  | "worker"
  | "tool_call"
  | "tool_result"
  | "context"
  | "complete";

/**
 * Metadata that can be attached to any chat message
 */
export interface ChatMessageMetadata {
  /** Approximate token count for this message */
  tokens?: number;
  /** Display name for the sender (e.g., "Schema Worker", "Analyzer 1") */
  sender?: string;
  /** ID of the task/step that triggered this message */
  triggeredBy?: string;
  /** ID of the task/step that this message starts */
  triggeredAtStart?: string;
  /** Whether this message should be visually highlighted */
  highlight?: boolean;
}

/**
 * A single message in a chat visualization
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  metadata?: ChatMessageMetadata;
}

/**
 * Internal worker message types for showing isolated worker sessions
 */
export type WorkerMessageType =
  | "task_start"
  | "thought"
  | "tool_call"
  | "tool_result"
  | "output";

/**
 * A message within an isolated worker session
 */
export interface WorkerMessage {
  id: string;
  type: WorkerMessageType;
  content: string;
  tokens?: number;
}

/**
 * Context detail that can be shown alongside messages
 * Used to show what's in the context window at any point
 */
export interface ContextDetail {
  label: string;
  value: string;
  tokens?: number;
  type: "system" | "tools" | "input" | "state" | "output" | "result" | "dynamic";
}

/**
 * A complete chat session containing messages and optional context
 */
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  /** Internal worker chat that stays isolated */
  internalChat?: WorkerMessage[];
  /** Context visible at this point */
  context?: ContextDetail[];
}

/**
 * Configuration for how to render a chat panel
 */
export interface ChatPanelConfig {
  /** Title to show in the panel header */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Whether to show token counts on messages */
  showTokenCounts?: boolean;
  /** Whether to enable tabbed view for multiple sessions */
  enableTabs?: boolean;
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Color theme for the panel */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
}

/**
 * Helper to convert legacy message types to unified format
 */
export function normalizeMessageRole(
  legacyType: string
): MessageRole {
  const mapping: Record<string, MessageRole> = {
    user: "user",
    assistant: "assistant",
    system: "system",
    orchestrator: "orchestrator",
    worker: "worker",
    tool_call: "tool_call",
    tool_result: "tool_result",
    context: "context",
    complete: "complete",
    response: "assistant",
    agent: "orchestrator",
  };
  return mapping[legacyType] || "assistant";
}
