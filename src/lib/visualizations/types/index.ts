/**
 * Unified Visualization Types
 *
 * Central export point for all visualization type definitions.
 * Import from here for type-safe visualization development.
 */

// Chat types
export type {
  MessageRole,
  ChatMessageMetadata,
  ChatMessage,
  WorkerMessageType,
  WorkerMessage,
  ContextDetail,
  ChatSession,
  ChatPanelConfig,
} from "./chat";
export { normalizeMessageRole } from "./chat";

// DAG types
export type {
  TaskStatus,
  DAGTask,
  TaskState,
  DAGEdge,
  DAGLayoutConfig,
  DAGViewerConfig,
} from "./dag";
export {
  DEFAULT_DAG_LAYOUT,
  getNodePosition,
  getEdgePath,
  calculateDAGDimensions,
  getCompletedTasksAtPoint,
  canTaskStart,
} from "./dag";

// Cost types
export type {
  PricingModel,
  TokenEstimationConfig,
  CostResult,
  CostComparison,
  CostBreakdownConfig,
  ConversationTurnCost,
  ConversationConfig,
  CachingConfig,
} from "./cost";
export {
  DEFAULT_PRICING,
  DEFAULT_TOKEN_CONFIG,
  DEFAULT_CONVERSATION_CONFIG,
  DEFAULT_CACHING_CONFIG,
} from "./cost";

// Scenario types
export type {
  ScenarioStep,
  PatternType,
  VectorPoint,
  VisualizationConfig,
  Scenario,
  PlaybackState,
  PlaybackConfig,
  LegacyChatMessage,
} from "./scenario";
export {
  DEFAULT_PLAYBACK_CONFIG,
  createChatMessage,
  createScenarioStep,
  convertLegacyMessage,
} from "./scenario";

// Embedding types
export type {
  VectorCategory,
  EmbeddingPoint,
  EmbeddingSpaceConfig,
  EmbeddingExplorerState,
} from "./embedding";
export {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  DEFAULT_EMBEDDING_CONFIG,
  cosineSimilarity,
  getNearestNeighbors,
  getCategoryColor,
  getCategoryLabel,
  categorizeWord,
} from "./embedding";
