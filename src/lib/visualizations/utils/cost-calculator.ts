/**
 * Cost Calculator Utilities
 *
 * Unified cost calculation engine for analyzing LLM API costs
 * across different execution strategies.
 */

import type {
  PricingModel,
  TokenEstimationConfig,
  CostResult,
  CostComparison,
  ConversationConfig,
  ConversationTurnCost,
  CachingConfig,
  DAGTask,
} from "../types";
import {
  DEFAULT_PRICING,
  DEFAULT_TOKEN_CONFIG,
  DEFAULT_CONVERSATION_CONFIG,
  DEFAULT_CACHING_CONFIG,
} from "../types";
import { countWords, wordsToTokens, tokensToDuration } from "./token-counter";

// =============================================================================
// Basic Cost Calculations
// =============================================================================

/**
 * Calculate cost for a given number of tokens
 */
export function calculateTokenCost(
  inputTokens: number,
  outputTokens: number,
  pricing: PricingModel = DEFAULT_PRICING
): CostResult {
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePerMillion;

  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

/**
 * Calculate cost with caching applied
 */
export function calculateCachedCost(
  inputTokens: number,
  outputTokens: number,
  pricing: PricingModel = DEFAULT_PRICING,
  caching: CachingConfig = DEFAULT_CACHING_CONFIG
): CostResult {
  if (!caching.enabled) {
    return calculateTokenCost(inputTokens, outputTokens, pricing);
  }

  const cachedTokens = Math.round(inputTokens * caching.hitRate);
  const uncachedTokens = inputTokens - cachedTokens;

  const uncachedCost =
    (uncachedTokens / 1_000_000) * pricing.inputPricePerMillion;
  const cachedCost =
    (cachedTokens / 1_000_000) *
    pricing.inputPricePerMillion *
    (1 - caching.cacheDiscount);

  const inputCost = uncachedCost + cachedCost;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePerMillion;

  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

// =============================================================================
// Conversation Cost Calculations
// =============================================================================

/**
 * Calculate costs for a naive conversation with accumulating history
 * This is the "quadratic growth" pattern
 */
export function calculateNaiveConversationCost(
  turns: number,
  config: ConversationConfig = DEFAULT_CONVERSATION_CONFIG,
  pricing: PricingModel = DEFAULT_PRICING,
  tokenConfig: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): CostResult {
  let totalInputTokens = 0;

  // Each turn sends: system + all previous user messages + all previous assistant messages
  for (let turn = 1; turn <= turns; turn++) {
    const systemCost = config.systemPromptTokens;
    const userCost = turn * config.userMessageTokens;
    const assistantCost = (turn - 1) * config.assistantMessageTokens;
    totalInputTokens += systemCost + userCost + assistantCost;
  }

  const totalOutputTokens = turns * config.assistantMessageTokens;

  const result = calculateTokenCost(totalInputTokens, totalOutputTokens, pricing);
  result.estimatedTimeMs = tokensToDuration(
    totalInputTokens + totalOutputTokens,
    tokenConfig
  );

  return result;
}

/**
 * Generate per-turn cost data for visualization
 */
export function generateConversationCostData(
  maxTurns: number,
  config: ConversationConfig = DEFAULT_CONVERSATION_CONFIG,
  pricing: PricingModel = DEFAULT_PRICING
): ConversationTurnCost[] {
  const data: ConversationTurnCost[] = [];
  let cumulativeInputTokens = 0;
  let cumulativeTotalCost = 0;

  for (let turn = 1; turn <= maxTurns; turn++) {
    // Input tokens for this turn
    const inputTokensThisTurn =
      config.systemPromptTokens +
      turn * config.userMessageTokens +
      (turn - 1) * config.assistantMessageTokens;

    cumulativeInputTokens += inputTokensThisTurn;

    const outputTokensThisTurn = config.assistantMessageTokens;

    const inputCost =
      (inputTokensThisTurn / 1_000_000) * pricing.inputPricePerMillion;
    const outputCost =
      (outputTokensThisTurn / 1_000_000) * pricing.outputPricePerMillion;
    const totalCost = inputCost + outputCost;

    cumulativeTotalCost += totalCost;

    data.push({
      turn,
      inputTokens: inputTokensThisTurn,
      outputTokens: outputTokensThisTurn,
      inputCost,
      outputCost,
      totalCost,
      cumulativeInputTokens,
      cumulativeTotalCost,
    });
  }

  return data;
}

// =============================================================================
// DAG/Orchestration Cost Calculations
// =============================================================================

/**
 * Extract word count from a task's content
 */
function getTaskWordCount(task: DAGTask): number {
  let words = countWords(task.description);

  if (task.context) {
    for (const ctx of task.context) {
      words += countWords(ctx.value);
    }
  }

  if (task.internalChat) {
    for (const msg of task.internalChat) {
      words += countWords(msg.content);
    }
  }

  return words;
}

/**
 * Get word count for output messages only from a task
 */
function getTaskOutputWords(task: DAGTask): number {
  if (task.internalChat) {
    return task.internalChat
      .filter((msg) => msg.type === "output")
      .reduce((sum, msg) => sum + countWords(msg.content), 0);
  }

  if (task.context) {
    return task.context
      .filter((ctx) => ctx.type === "output")
      .reduce((sum, ctx) => sum + countWords(ctx.value), 0);
  }

  return 0;
}

/**
 * Calculate costs for parallel execution (isolated contexts)
 */
export function calculateParallelExecutionCost(
  tasks: DAGTask[],
  pricing: PricingModel = DEFAULT_PRICING,
  tokenConfig: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): CostResult {
  let totalWords = 0;
  let outputWords = 0;

  for (const task of tasks) {
    totalWords += getTaskWordCount(task);
    outputWords += getTaskOutputWords(task);
  }

  const inputTokens = wordsToTokens(totalWords, tokenConfig);
  const outputTokens = wordsToTokens(outputWords, tokenConfig);

  const result = calculateTokenCost(inputTokens, outputTokens, pricing);

  // Calculate parallel time: group by column, take max of each column
  const tasksByColumn = new Map<number, DAGTask[]>();
  for (const task of tasks) {
    if (!tasksByColumn.has(task.column)) {
      tasksByColumn.set(task.column, []);
    }
    tasksByColumn.get(task.column)!.push(task);
  }

  let timeMs = 0;
  for (const [, columnTasks] of Array.from(tasksByColumn.entries()).sort(
    (a, b) => a[0] - b[0]
  )) {
    if (columnTasks.length === 1) {
      timeMs += tokensToDuration(
        wordsToTokens(getTaskWordCount(columnTasks[0]), tokenConfig),
        tokenConfig
      );
    } else {
      const maxWords = Math.max(...columnTasks.map((t) => getTaskWordCount(t)));
      timeMs += tokensToDuration(
        wordsToTokens(maxWords, tokenConfig),
        tokenConfig
      );
    }
  }

  result.estimatedTimeMs = timeMs;

  return result;
}

/**
 * Calculate costs for linear/sequential execution (accumulating contexts)
 */
export function calculateLinearExecutionCost(
  tasks: DAGTask[],
  pricing: PricingModel = DEFAULT_PRICING,
  tokenConfig: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): CostResult {
  // Sort tasks by column (execution order)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.column !== b.column) return a.column - b.column;
    return a.row - b.row;
  });

  let totalWords = 0;
  let accumulatedContext = 0;
  let outputWords = 0;

  for (const task of sortedTasks) {
    const taskWords = getTaskWordCount(task);
    accumulatedContext += taskWords;
    totalWords += accumulatedContext;
    outputWords += getTaskOutputWords(task);
  }

  const inputTokens = wordsToTokens(totalWords, tokenConfig);
  const outputTokens = wordsToTokens(outputWords, tokenConfig);

  const result = calculateTokenCost(inputTokens, outputTokens, pricing);

  // Linear time: all tasks sequential
  const linearTimeMs = tasks.reduce(
    (sum, task) =>
      sum +
      tokensToDuration(
        wordsToTokens(getTaskWordCount(task), tokenConfig),
        tokenConfig
      ),
    0
  );

  result.estimatedTimeMs = linearTimeMs;

  return result;
}

/**
 * Compare parallel vs linear execution costs
 */
export function compareExecutionStrategies(
  tasks: DAGTask[],
  pricing: PricingModel = DEFAULT_PRICING,
  tokenConfig: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): CostComparison {
  const baseline = calculateLinearExecutionCost(tasks, pricing, tokenConfig);
  const optimized = calculateParallelExecutionCost(tasks, pricing, tokenConfig);

  const tokensSaved = baseline.inputTokens - optimized.inputTokens;
  const costSaved = baseline.totalCost - optimized.totalCost;
  const timeSavedMs =
    (baseline.estimatedTimeMs || 0) - (optimized.estimatedTimeMs || 0);

  return {
    baseline,
    optimized,
    tokensSaved,
    tokenSavingsPercent:
      baseline.inputTokens > 0
        ? (tokensSaved / baseline.inputTokens) * 100
        : 0,
    costSaved,
    costSavingsPercent:
      baseline.totalCost > 0 ? (costSaved / baseline.totalCost) * 100 : 0,
    timeSavedMs,
    speedupFactor:
      optimized.estimatedTimeMs && optimized.estimatedTimeMs > 0
        ? (baseline.estimatedTimeMs || 0) / optimized.estimatedTimeMs
        : 1,
  };
}

// =============================================================================
// Formatting Utilities
// =============================================================================

/**
 * Format cost for display
 */
export function formatCost(cost: number, decimals: number = 4): string {
  if (cost >= 1) {
    return `$${cost.toFixed(2)}`;
  }
  return `$${cost.toFixed(decimals)}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format speedup factor for display
 */
export function formatSpeedup(factor: number): string {
  return `${factor.toFixed(1)}x`;
}
