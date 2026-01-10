"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  orchestrationScenarios, 
  type Scenario, 
  type DAGTask, 
  type ChatMessage 
} from "./UnifiedOrchestrationVisualizer";

interface OrchestrationCostComparisonProps {
  className?: string;
}

// ============================================================================
// Word/Token Counting Utilities
// ============================================================================

/**
 * Count words in a string (simple whitespace split)
 */
function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Extract all text content from a task (context values + internal chat)
 */
function getTaskTextContent(task: DAGTask): string[] {
  const texts: string[] = [];
  
  // Task description
  texts.push(task.description);
  
  // Context values
  if (task.context) {
    for (const ctx of task.context) {
      texts.push(ctx.value);
    }
  }
  
  // Internal chat messages (worker sessions)
  if (task.internalChat) {
    for (const msg of task.internalChat) {
      texts.push(msg.content);
    }
  }
  
  return texts;
}

/**
 * Extract all text content from chat messages
 */
function getChatTextContent(messages: ChatMessage[]): string[] {
  const texts: string[] = [];
  
  for (const msg of messages) {
    texts.push(msg.content);
    if (msg.context) {
      for (const ctx of msg.context) {
        texts.push(ctx.value);
      }
    }
  }
  
  return texts;
}

/**
 * Calculate total words for a task
 */
function getTaskWordCount(task: DAGTask): number {
  return getTaskTextContent(task).reduce((sum, text) => sum + countWords(text), 0);
}

/**
 * Get word count for internal chat only (worker's isolated work)
 */
function getInternalChatWordCount(task: DAGTask): number {
  if (!task.internalChat) return 0;
  return task.internalChat.reduce((sum, msg) => sum + countWords(msg.content), 0);
}

/**
 * Get word count for output messages only
 */
function getOutputWordCount(task: DAGTask): number {
  if (!task.internalChat) {
    // No internal chat, check context for output
    if (task.context) {
      return task.context
        .filter(ctx => ctx.type === "output")
        .reduce((sum, ctx) => sum + countWords(ctx.value), 0);
    }
    return 0;
  }
  
  // From internal chat, only output messages
  return task.internalChat
    .filter(msg => msg.type === "output")
    .reduce((sum, msg) => sum + countWords(msg.content), 0);
}

// ============================================================================
// Main Component
// ============================================================================

export function OrchestrationCostComparison({ className }: OrchestrationCostComparisonProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("search-mapreduce");
  
  // Model parameters (configurable)
  const [inputPrice, setInputPrice] = useState(1.75); // $/M tokens
  const [outputPrice, setOutputPrice] = useState(14); // $/M tokens
  const [tokensPerWord, setTokensPerWord] = useState(1.3); // Average tokens per word
  const [tokensPerSecond, setTokensPerSecond] = useState(80); // Model output speed
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const scenario = useMemo(() => 
    orchestrationScenarios.find(s => s.id === selectedScenarioId) || orchestrationScenarios[0],
    [selectedScenarioId]
  );

  // ============================================================================
  // Derived Calculations from Actual Content
  // ============================================================================

  const calculations = useMemo(() => {
    const tasks = scenario.tasks;
    const messages = scenario.chatMessages;
    
    // Identify parallel tasks (tasks that share the same dependencies)
    const tasksByDeps = new Map<string, DAGTask[]>();
    for (const task of tasks) {
      const depKey = task.dependencies.sort().join(",");
      if (!tasksByDeps.has(depKey)) {
        tasksByDeps.set(depKey, []);
      }
      tasksByDeps.get(depKey)!.push(task);
    }
    
    // Find the parallel worker/analyzer group
    const parallelGroups = Array.from(tasksByDeps.values()).filter(group => group.length > 1);
    const parallelTasks = parallelGroups.flat();
    const serialTasks = tasks.filter(t => !parallelTasks.includes(t));
    
    // ================================================================
    // PARALLEL EXECUTION (actual orchestration pattern)
    // Each task has isolated context - we sum their individual word counts
    // ================================================================
    
    let parallelTotalWords = 0;
    let parallelOutputWords = 0;
    const taskWordCounts: { task: DAGTask; words: number; outputWords: number }[] = [];
    
    for (const task of tasks) {
      const words = getTaskWordCount(task);
      const outputWords = getOutputWordCount(task);
      parallelTotalWords += words;
      parallelOutputWords += outputWords;
      taskWordCounts.push({ task, words, outputWords });
    }
    
    // ================================================================
    // LINEAR EXECUTION (naive approach)
    // Context accumulates - each step sees all previous context
    // ================================================================
    
    // Sort tasks by column (execution order)
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.column !== b.column) return a.column - b.column;
      return a.row - b.row;
    });
    
    let linearTotalWords = 0;
    let accumulatedContext = 0;
    const linearSteps: { task: DAGTask; contextAtStep: number }[] = [];
    
    for (const task of sortedTasks) {
      const taskWords = getTaskWordCount(task);
      // In linear mode, each step processes accumulated context + its own work
      accumulatedContext += taskWords;
      linearTotalWords += accumulatedContext;
      linearSteps.push({ task, contextAtStep: accumulatedContext });
    }
    
    // ================================================================
    // TIME CALCULATIONS
    // ================================================================
    
    // For parallel: serial tasks run sequentially, parallel tasks run concurrently
    // Duration derived from word count: duration_ms = (words × tokensPerWord) / tokensPerSecond × 1000
    const wordsToDurationMs = (words: number) => (words * tokensPerWord / tokensPerSecond) * 1000;
    
    // Parallel time: sum of serial stages + max of each parallel group
    let parallelTimeMs = 0;
    
    // Group tasks by column (execution phase)
    const tasksByColumn = new Map<number, DAGTask[]>();
    for (const task of tasks) {
      if (!tasksByColumn.has(task.column)) {
        tasksByColumn.set(task.column, []);
      }
      tasksByColumn.get(task.column)!.push(task);
    }
    
    // For each column, if multiple tasks exist, take the max (parallel)
    // If single task, take its duration
    for (const [, columnTasks] of Array.from(tasksByColumn.entries()).sort((a, b) => a[0] - b[0])) {
      if (columnTasks.length === 1) {
        parallelTimeMs += wordsToDurationMs(getTaskWordCount(columnTasks[0]));
      } else {
        // Parallel execution - take the longest one
        const maxWords = Math.max(...columnTasks.map(t => getTaskWordCount(t)));
        parallelTimeMs += wordsToDurationMs(maxWords);
      }
    }
    
    // Linear time: all tasks run sequentially
    const linearTimeMs = tasks.reduce((sum, task) => sum + wordsToDurationMs(getTaskWordCount(task)), 0);
    
    // ================================================================
    // Summary stats
    // ================================================================
    
    // Count of parallel workers
    const parallelWorkerCount = parallelTasks.length;
    
    // Total words in parallel worker internal chats (isolated work)
    const internalWorkWords = parallelTasks.reduce((sum, t) => sum + getInternalChatWordCount(t), 0);
    
    // Summary words that flow back to orchestrator
    const summaryWords = parallelTasks.reduce((sum, t) => sum + getOutputWordCount(t), 0);
    
    return {
      // Word counts
      parallelTotalWords,
      linearTotalWords,
      parallelOutputWords,
      
      // Time in ms
      parallelTimeMs,
      linearTimeMs,
      
      // Per-task breakdown
      taskWordCounts,
      linearSteps,
      
      // Parallel group info  
      parallelWorkerCount,
      internalWorkWords,
      summaryWords,
      
      // Task grouping
      parallelTasks,
      serialTasks,
    };
  }, [scenario, tokensPerWord, tokensPerSecond]);

  // Convert to tokens and costs
  const costs = useMemo(() => {
    const parallelInputTokens = Math.round(calculations.parallelTotalWords * tokensPerWord);
    const linearInputTokens = Math.round(calculations.linearTotalWords * tokensPerWord);
    const outputTokens = Math.round(calculations.parallelOutputWords * tokensPerWord);
    
    const parallelInputCost = (parallelInputTokens / 1_000_000) * inputPrice;
    const linearInputCost = (linearInputTokens / 1_000_000) * inputPrice;
    const outputCost = (outputTokens / 1_000_000) * outputPrice;
    
    return {
      parallelInputTokens,
      linearInputTokens,
      outputTokens,
      parallelTotal: parallelInputCost + outputCost,
      linearTotal: linearInputCost + outputCost,
      parallelInputCost,
      linearInputCost,
      outputCost,
      tokenSavingsPercent: linearInputTokens > 0 
        ? ((linearInputTokens - parallelInputTokens) / linearInputTokens) * 100 
        : 0,
      costSavingsPercent: linearInputCost > 0
        ? ((linearInputCost - parallelInputCost) / linearInputCost) * 100
        : 0,
    };
  }, [calculations, tokensPerWord, inputPrice, outputPrice]);

  const timeSavings = useMemo(() => {
    const { parallelTimeMs, linearTimeMs } = calculations;
    return {
      savedMs: linearTimeMs - parallelTimeMs,
      savedPercent: linearTimeMs > 0 ? ((linearTimeMs - parallelTimeMs) / linearTimeMs) * 100 : 0,
      speedupFactor: parallelTimeMs > 0 ? linearTimeMs / parallelTimeMs : 1,
    };
  }, [calculations]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Scenario Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {orchestrationScenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenarioId(s.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedScenarioId === s.id
                ? s.patternType === "static"
                  ? "bg-violet-500/20 text-violet-400 border-violet-500/50"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Data Source Note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          All values derived from actual content above: <strong className="text-foreground">{calculations.parallelTotalWords.toLocaleString()} words</strong> counted 
          → <strong className="text-foreground">{costs.parallelInputTokens.toLocaleString()} tokens</strong> (×{tokensPerWord})
        </span>
      </div>

      {/* Big Numbers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Token Savings */}
        <div className="bg-card border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Token Reduction</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              {costs.tokenSavingsPercent.toFixed(0)}% fewer
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 tabular-nums">
              {(costs.linearInputTokens - costs.parallelInputTokens).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">tokens saved</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Parallel: {costs.parallelInputTokens.toLocaleString()} vs Linear: {costs.linearInputTokens.toLocaleString()}
          </p>
        </div>

        {/* Cost Savings */}
        <div className="bg-card border border-cyan-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cost Reduction</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
              {costs.costSavingsPercent.toFixed(0)}% cheaper
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-cyan-400 tabular-nums">
              ${(costs.linearTotal - costs.parallelTotal).toFixed(4)}
            </span>
            <span className="text-sm text-muted-foreground">saved</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Parallel: ${costs.parallelTotal.toFixed(4)} vs Linear: ${costs.linearTotal.toFixed(4)}
          </p>
        </div>

        {/* Time Savings */}
        <div className="bg-card border border-pink-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Time Advantage</span>
            <span className="text-xs px-2 py-0.5 rounded bg-pink-500/10 text-pink-400">
              {timeSavings.speedupFactor.toFixed(1)}x faster
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-pink-400 tabular-nums">
              {(timeSavings.savedMs / 1000).toFixed(1)}s
            </span>
            <span className="text-sm text-muted-foreground">faster</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Parallel: {(calculations.parallelTimeMs / 1000).toFixed(1)}s vs Linear: {(calculations.linearTimeMs / 1000).toFixed(1)}s
          </p>
        </div>
      </div>

      {/* Visual Comparison Bars */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-6">
        <h4 className="font-medium text-foreground">Visual Comparison</h4>
        
        {/* Token Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Input Tokens</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                <span className="text-rose-400">{costs.linearInputTokens.toLocaleString()}</span> linear
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="text-emerald-400">{costs.parallelInputTokens.toLocaleString()}</span> parallel
              </span>
            </div>
          </div>
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            {/* Linear bar (full width = 100%) */}
            <div 
              className="absolute inset-y-0 left-0 bg-rose-500/30 border-r-2 border-rose-500 transition-all duration-500"
              style={{ width: '100%' }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-rose-400 font-medium">
                Linear (100%)
              </span>
            </div>
            {/* Parallel bar (proportional) */}
            <div 
              className="absolute inset-y-0 left-0 bg-emerald-500/40 border-r-2 border-emerald-500 transition-all duration-500"
              style={{ width: `${(costs.parallelInputTokens / costs.linearInputTokens) * 100}%` }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                Parallel ({(100 - costs.tokenSavingsPercent).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Time Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Execution Time</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                <span className="text-rose-400">{(calculations.linearTimeMs / 1000).toFixed(1)}s</span> linear
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="text-pink-400">{(calculations.parallelTimeMs / 1000).toFixed(1)}s</span> parallel
              </span>
            </div>
          </div>
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-rose-500/30 border-r-2 border-rose-500 transition-all duration-500"
              style={{ width: '100%' }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-rose-400 font-medium">
                Linear (100%)
              </span>
            </div>
            <div 
              className="absolute inset-y-0 left-0 bg-pink-500/40 border-r-2 border-pink-500 transition-all duration-500"
              style={{ width: `${(calculations.parallelTimeMs / calculations.linearTimeMs) * 100}%` }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-pink-400 font-medium whitespace-nowrap">
                Parallel ({((calculations.parallelTimeMs / calculations.linearTimeMs) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                <span className="text-rose-400">${costs.linearTotal.toFixed(4)}</span> linear
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="text-cyan-400">${costs.parallelTotal.toFixed(4)}</span> parallel
              </span>
            </div>
          </div>
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-rose-500/30 border-r-2 border-rose-500 transition-all duration-500"
              style={{ width: '100%' }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-rose-400 font-medium">
                Linear (100%)
              </span>
            </div>
            <div 
              className="absolute inset-y-0 left-0 bg-cyan-500/40 border-r-2 border-cyan-500 transition-all duration-500"
              style={{ width: `${(costs.parallelTotal / costs.linearTotal) * 100}%` }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400 font-medium whitespace-nowrap">
                Parallel ({((costs.parallelTotal / costs.linearTotal) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Task Word Count Breakdown */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h4 className="font-medium text-foreground mb-4">Word Count by Task (from content above)</h4>
        <div className="space-y-2">
          {calculations.taskWordCounts.map(({ task, words }, i) => {
            const isParallel = calculations.parallelTasks.includes(task);
            const maxWords = Math.max(...calculations.taskWordCounts.map(t => t.words));
            return (
              <div key={task.id} className="flex items-center gap-3">
                <span className={cn(
                  "text-xs font-mono w-20 truncate",
                  isParallel ? "text-amber-400" : "text-muted-foreground"
                )}>
                  {task.shortLabel}
                </span>
                <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded transition-all duration-300",
                      isParallel ? "bg-amber-500/40" : "bg-slate-500/40"
                    )}
                    style={{ width: `${(words / maxWords) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">
                  {words.toLocaleString()} words
                </span>
                {isParallel && (
                  <span className="text-[10px] text-amber-400 font-medium">║</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <span className="text-amber-400">║</span> = parallel execution (isolated context)
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-muted/30 rounded-lg p-4">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <svg 
            className={cn("w-4 h-4 transition-transform", isConfigOpen && "rotate-90")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="uppercase tracking-wider">Configure Model Parameters</span>
        </button>
        
        {isConfigOpen && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Input ($/M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputPrice}
                onChange={(e) => setInputPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Output ($/M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={outputPrice}
                onChange={(e) => setOutputPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Tokens per Word</label>
              <input
                type="number"
                min="0.5"
                max="3"
                step="0.1"
                value={tokensPerWord}
                onChange={(e) => setTokensPerWord(parseFloat(e.target.value) || 1.3)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Tokens/sec (speed)</label>
              <input
                type="number"
                min="10"
                max="200"
                step="10"
                value={tokensPerSecond}
                onChange={(e) => setTokensPerSecond(parseFloat(e.target.value) || 80)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Takeaway */}
      <div className={cn(
        "rounded-lg p-4 border",
        scenario.patternType === "static" 
          ? "bg-violet-500/5 border-violet-500/20" 
          : "bg-amber-500/5 border-amber-500/20"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            scenario.patternType === "static" ? "bg-violet-500/20" : "bg-amber-500/20"
          )}>
            <svg className={cn("w-4 h-4", scenario.patternType === "static" ? "text-violet-400" : "text-amber-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className={cn(
              "font-medium mb-1",
              scenario.patternType === "static" ? "text-violet-400" : "text-amber-400"
            )}>
              Why Parallel Orchestration Wins
            </h4>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Context isolation</strong> is the key. 
              The {calculations.parallelWorkerCount} parallel workers process{" "}
              <strong className={scenario.patternType === "static" ? "text-violet-400" : "text-amber-400"}>
                {calculations.internalWorkWords.toLocaleString()} words
              </strong>{" "}
              of internal work, but only{" "}
              <strong className="text-emerald-400">{calculations.summaryWords.toLocaleString()} words</strong>{" "}
              of summaries flow back. Linear execution would accumulate all that context, 
              reaching{" "}
              <strong className="text-rose-400">{calculations.linearSteps[calculations.linearSteps.length - 1]?.contextAtStep.toLocaleString()} words</strong>{" "}
              by the final step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
