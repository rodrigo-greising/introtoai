/**
 * Scenario Types
 *
 * These types define the structure of interactive scenarios
 * that can be visualized with different combinations of components.
 */

import type { ChatMessage, ContextDetail, WorkerMessage } from "./chat";
import type { DAGTask } from "./dag";

/**
 * A step in a scenario's progression
 */
export interface ScenarioStep {
  id: string;
  name: string;
  /** Duration in milliseconds before moving to next step */
  duration: number;
  /** Messages to show when this step is reached */
  messages?: ChatMessage[];
  /** Vector/embedding state at this step */
  vectorState?: {
    activeQuery?: string;
    matches?: string[];
    showConnections?: boolean;
  };
  /** Task state changes at this step */
  taskState?: {
    running?: string[];
    completed?: string[];
  };
}

/**
 * Pattern type for categorizing scenarios
 */
export type PatternType = "static" | "dynamic" | "hybrid";

/**
 * A vector point for embedding space visualization
 */
export interface VectorPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  category: string;
  content?: string;
  similarity?: number;
  linkedTo?: string[];
}

/**
 * Configuration for which visualizations to show
 */
export interface VisualizationConfig {
  chat?: {
    enabled: boolean;
    showInternalChats?: boolean;
    showTokenCounts?: boolean;
  };
  dag?: {
    enabled: boolean;
    tasks: DAGTask[];
  };
  embedding?: {
    enabled: boolean;
    vectors: VectorPoint[];
  };
  cost?: {
    enabled: boolean;
    mode: "comparison" | "explorer" | "breakdown";
  };
}

/**
 * A complete scenario definition
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  patternType: PatternType;
  patternDescription: string;
  /** Icon for display (emoji or icon name) */
  icon?: string;
  /** Color theme for this scenario */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Steps in the scenario progression (optional for DAG-only scenarios) */
  steps?: ScenarioStep[];
  /** Chat messages for the main conversation flow */
  chatMessages: ChatMessage[];
  /** DAG tasks if this scenario includes a task graph */
  tasks?: DAGTask[];
  /** Vector points if this scenario includes embedding visualization */
  vectors?: VectorPoint[];
  /** Key insight to display about this scenario */
  insight?: string;
  /** Additional context for cost calculations */
  costContext?: {
    parallelWorkerCount?: number;
    internalWorkTokens?: number;
    summaryTokens?: number;
  };
}

/**
 * Playback state for scenario animation
 */
export interface PlaybackState {
  isPlaying: boolean;
  currentStepIndex: number;
  speed: number;
  executionTime: number;
}

/**
 * Playback controls configuration
 */
export interface PlaybackConfig {
  /** Available speed options */
  speeds?: number[];
  /** Default speed */
  defaultSpeed?: number;
  /** Whether to auto-play on mount */
  autoPlay?: boolean;
  /** Whether to loop at the end */
  loop?: boolean;
}

/**
 * Default playback configuration
 */
export const DEFAULT_PLAYBACK_CONFIG: PlaybackConfig = {
  speeds: [0.5, 1, 2, 3],
  defaultSpeed: 1,
  autoPlay: false,
  loop: false,
};

/**
 * Helper to create a chat message with defaults
 */
export function createChatMessage(
  partial: Partial<ChatMessage> & { id: string; role: ChatMessage["role"]; content: string }
): ChatMessage {
  return {
    id: partial.id,
    role: partial.role,
    content: partial.content,
    metadata: partial.metadata,
  };
}

/**
 * Helper to create a scenario step with defaults
 */
export function createScenarioStep(
  partial: Partial<ScenarioStep> & { id: string; name: string; duration: number }
): ScenarioStep {
  return {
    id: partial.id,
    name: partial.name,
    duration: partial.duration,
    messages: partial.messages ?? [],
    vectorState: partial.vectorState,
    taskState: partial.taskState,
  };
}

/**
 * Legacy type compatibility - maps old ChatMessage format to new
 */
export interface LegacyChatMessage {
  id: string;
  type: "user" | "orchestrator" | "tool_call" | "tool_result" | "worker" | "complete";
  sender?: string;
  content: string;
  context?: ContextDetail[];
  triggeredByTaskId?: string;
  triggeredAtStart?: string;
}

/**
 * Convert legacy chat message to unified format
 */
export function convertLegacyMessage(legacy: LegacyChatMessage): ChatMessage {
  const roleMap: Record<LegacyChatMessage["type"], ChatMessage["role"]> = {
    user: "user",
    orchestrator: "orchestrator",
    tool_call: "tool_call",
    tool_result: "tool_result",
    worker: "worker",
    complete: "complete",
  };

  return {
    id: legacy.id,
    role: roleMap[legacy.type],
    content: legacy.content,
    metadata: {
      sender: legacy.sender,
      triggeredBy: legacy.triggeredByTaskId,
      triggeredAtStart: legacy.triggeredAtStart,
    },
  };
}
