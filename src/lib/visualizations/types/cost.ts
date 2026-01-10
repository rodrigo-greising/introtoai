/**
 * Cost Calculation Types
 *
 * These types support cost analysis and comparison across
 * different execution strategies (linear vs parallel, cached vs uncached, etc.)
 */

/**
 * Pricing model for LLM API costs
 */
export interface PricingModel {
  /** Cost per million input tokens */
  inputPricePerMillion: number;
  /** Cost per million output tokens */
  outputPricePerMillion: number;
  /** Model name for display */
  modelName?: string;
}

/**
 * Default pricing (based on typical frontier model pricing)
 */
export const DEFAULT_PRICING: PricingModel = {
  inputPricePerMillion: 1.75,
  outputPricePerMillion: 14,
  modelName: "Default",
};

/**
 * Token estimation configuration
 */
export interface TokenEstimationConfig {
  /** Average tokens per word (typically 1.3 for English) */
  tokensPerWord: number;
  /** Model output speed in tokens per second */
  tokensPerSecond: number;
}

/**
 * Default token estimation config
 */
export const DEFAULT_TOKEN_CONFIG: TokenEstimationConfig = {
  tokensPerWord: 1.3,
  tokensPerSecond: 80,
};

/**
 * Result of a cost calculation
 */
export interface CostResult {
  /** Total input tokens */
  inputTokens: number;
  /** Total output tokens */
  outputTokens: number;
  /** Cost for input tokens */
  inputCost: number;
  /** Cost for output tokens */
  outputCost: number;
  /** Total cost */
  totalCost: number;
  /** Estimated execution time in milliseconds */
  estimatedTimeMs?: number;
}

/**
 * Comparison between two execution strategies
 */
export interface CostComparison {
  /** Baseline/naive approach costs */
  baseline: CostResult;
  /** Optimized approach costs */
  optimized: CostResult;
  /** Tokens saved */
  tokensSaved: number;
  /** Percentage of tokens saved */
  tokenSavingsPercent: number;
  /** Cost saved */
  costSaved: number;
  /** Percentage of cost saved */
  costSavingsPercent: number;
  /** Time saved in milliseconds */
  timeSavedMs?: number;
  /** Speedup factor (e.g., 2x faster) */
  speedupFactor?: number;
}

/**
 * Configuration for cost breakdown visualization
 */
export interface CostBreakdownConfig {
  /** Whether to show the comparison bars */
  showComparisonBars?: boolean;
  /** Whether to show per-task breakdown */
  showTaskBreakdown?: boolean;
  /** Whether to show the configuration panel */
  showConfiguration?: boolean;
  /** Labels for baseline vs optimized */
  labels?: {
    baseline: string;
    optimized: string;
  };
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
}

/**
 * Per-turn cost data for conversation cost visualization
 */
export interface ConversationTurnCost {
  turn: number;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  cumulativeInputTokens: number;
  cumulativeTotalCost: number;
}

/**
 * Configuration for conversation cost scenarios
 */
export interface ConversationConfig {
  /** System prompt token count */
  systemPromptTokens: number;
  /** Average user message token count */
  userMessageTokens: number;
  /** Average assistant message token count */
  assistantMessageTokens: number;
}

/**
 * Default conversation configuration
 */
export const DEFAULT_CONVERSATION_CONFIG: ConversationConfig = {
  systemPromptTokens: 500,
  userMessageTokens: 100,
  assistantMessageTokens: 200,
};

/**
 * Caching configuration for cost calculations
 */
export interface CachingConfig {
  /** Whether caching is enabled */
  enabled: boolean;
  /** Cache hit rate (0-1) */
  hitRate: number;
  /** Discount for cached tokens (e.g., 0.9 = 90% off) */
  cacheDiscount: number;
}

/**
 * Default caching configuration
 */
export const DEFAULT_CACHING_CONFIG: CachingConfig = {
  enabled: true,
  hitRate: 0.8,
  cacheDiscount: 0.9,
};
