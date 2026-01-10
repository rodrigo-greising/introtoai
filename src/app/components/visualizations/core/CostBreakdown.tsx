"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  CostComparison,
  CostBreakdownConfig,
  PricingModel,
  TokenEstimationConfig,
} from "@/lib/visualizations/types";
import {
  DEFAULT_PRICING,
  DEFAULT_TOKEN_CONFIG,
} from "@/lib/visualizations/types";
import {
  formatCost,
  formatPercentage,
  formatSpeedup,
  formatTokenCount,
  formatDuration,
} from "@/lib/visualizations/utils";

// =============================================================================
// Component Props
// =============================================================================

export interface CostBreakdownProps {
  /** Cost comparison data */
  comparison: CostComparison;
  /** Task-level breakdown data */
  taskBreakdown?: Array<{
    id: string;
    label: string;
    words: number;
    isParallel?: boolean;
  }>;
  /** Configuration options */
  config?: CostBreakdownConfig;
  /** Whether to show the configuration panel */
  showConfigPanel?: boolean;
  /** Pricing model */
  pricing?: PricingModel;
  /** Token estimation config */
  tokenConfig?: TokenEstimationConfig;
  /** Callback when pricing changes */
  onPricingChange?: (pricing: PricingModel) => void;
  /** Callback when token config changes */
  onTokenConfigChange?: (config: TokenEstimationConfig) => void;
  /** Custom className */
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
}

function MetricCard({ title, value, subtitle, badge, badgeColor, borderColor }: MetricCardProps) {
  return (
    <div className={cn("bg-card border rounded-xl p-5", borderColor)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <span className={cn("text-xs px-2 py-0.5 rounded", badgeColor)}>{badge}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-bold tabular-nums", borderColor.replace("border-", "text-").replace("/30", ""))}>
          {value}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}

interface ComparisonBarProps {
  label: string;
  baselineValue: string;
  optimizedValue: string;
  optimizedPercent: number;
  baselineColor: string;
  optimizedColor: string;
}

function ComparisonBar({
  label,
  baselineValue,
  optimizedValue,
  optimizedPercent,
  baselineColor,
  optimizedColor,
}: ComparisonBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            <span className={baselineColor}>{baselineValue}</span> linear
          </span>
          <span className="text-xs text-muted-foreground">
            <span className={optimizedColor}>{optimizedValue}</span> parallel
          </span>
        </div>
      </div>
      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
        {/* Baseline bar (full width = 100%) */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 border-r-2 transition-all duration-500",
            baselineColor.replace("text-", "bg-").replace("400", "500/30"),
            baselineColor.replace("text-", "border-").replace("400", "500")
          )}
          style={{ width: "100%" }}
        >
          <span
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium",
              baselineColor
            )}
          >
            Linear (100%)
          </span>
        </div>
        {/* Optimized bar (proportional) */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 border-r-2 transition-all duration-500",
            optimizedColor.replace("text-", "bg-").replace("400", "500/40"),
            optimizedColor.replace("text-", "border-").replace("400", "500")
          )}
          style={{ width: `${optimizedPercent}%` }}
        >
          <span
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium whitespace-nowrap",
              optimizedColor
            )}
          >
            Parallel ({optimizedPercent.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function CostBreakdown({
  comparison,
  taskBreakdown,
  config = {},
  showConfigPanel = false,
  pricing = DEFAULT_PRICING,
  tokenConfig = DEFAULT_TOKEN_CONFIG,
  onPricingChange,
  onTokenConfigChange,
  className,
}: CostBreakdownProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const {
    showComparisonBars = true,
    showTaskBreakdown = true,
    labels = { baseline: "Linear", optimized: "Parallel" },
    colorTheme = "cyan",
  } = config;

  // Derived values
  const tokenSavingsDisplay = formatTokenCount(comparison.tokensSaved);
  const costSavingsDisplay = formatCost(comparison.costSaved);
  const timeSavingsDisplay = comparison.timeSavedMs
    ? formatDuration(comparison.timeSavedMs)
    : "N/A";

  const maxTaskWords = taskBreakdown
    ? Math.max(...taskBreakdown.map((t) => t.words))
    : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Big Numbers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Token Reduction"
          value={tokenSavingsDisplay}
          subtitle={`${labels.optimized}: ${formatTokenCount(comparison.optimized.inputTokens)} vs ${labels.baseline}: ${formatTokenCount(comparison.baseline.inputTokens)}`}
          badge={`${formatPercentage(comparison.tokenSavingsPercent)} fewer`}
          badgeColor="bg-emerald-500/10 text-emerald-400"
          borderColor="border-emerald-500/30"
        />

        <MetricCard
          title="Cost Reduction"
          value={costSavingsDisplay}
          subtitle={`${labels.optimized}: ${formatCost(comparison.optimized.totalCost)} vs ${labels.baseline}: ${formatCost(comparison.baseline.totalCost)}`}
          badge={`${formatPercentage(comparison.costSavingsPercent)} cheaper`}
          badgeColor="bg-cyan-500/10 text-cyan-400"
          borderColor="border-cyan-500/30"
        />

        <MetricCard
          title="Time Advantage"
          value={timeSavingsDisplay}
          subtitle={`${labels.optimized}: ${formatDuration(comparison.optimized.estimatedTimeMs || 0)} vs ${labels.baseline}: ${formatDuration(comparison.baseline.estimatedTimeMs || 0)}`}
          badge={comparison.speedupFactor ? `${formatSpeedup(comparison.speedupFactor)} faster` : "N/A"}
          badgeColor="bg-pink-500/10 text-pink-400"
          borderColor="border-pink-500/30"
        />
      </div>

      {/* Visual Comparison Bars */}
      {showComparisonBars && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-6">
          <h4 className="font-medium text-foreground">Visual Comparison</h4>

          <ComparisonBar
            label="Input Tokens"
            baselineValue={formatTokenCount(comparison.baseline.inputTokens)}
            optimizedValue={formatTokenCount(comparison.optimized.inputTokens)}
            optimizedPercent={
              (comparison.optimized.inputTokens / comparison.baseline.inputTokens) * 100
            }
            baselineColor="text-rose-400"
            optimizedColor="text-emerald-400"
          />

          {comparison.baseline.estimatedTimeMs && comparison.optimized.estimatedTimeMs && (
            <ComparisonBar
              label="Execution Time"
              baselineValue={formatDuration(comparison.baseline.estimatedTimeMs)}
              optimizedValue={formatDuration(comparison.optimized.estimatedTimeMs)}
              optimizedPercent={
                (comparison.optimized.estimatedTimeMs / comparison.baseline.estimatedTimeMs) * 100
              }
              baselineColor="text-rose-400"
              optimizedColor="text-pink-400"
            />
          )}

          <ComparisonBar
            label="Total Cost"
            baselineValue={formatCost(comparison.baseline.totalCost)}
            optimizedValue={formatCost(comparison.optimized.totalCost)}
            optimizedPercent={
              (comparison.optimized.totalCost / comparison.baseline.totalCost) * 100
            }
            baselineColor="text-rose-400"
            optimizedColor="text-cyan-400"
          />
        </div>
      )}

      {/* Per-Task Breakdown */}
      {showTaskBreakdown && taskBreakdown && taskBreakdown.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="font-medium text-foreground mb-4">Word Count by Task</h4>
          <div className="space-y-2">
            {taskBreakdown.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-xs font-mono w-20 truncate",
                    task.isParallel ? "text-amber-400" : "text-muted-foreground"
                  )}
                >
                  {task.label}
                </span>
                <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded transition-all duration-300",
                      task.isParallel ? "bg-amber-500/40" : "bg-slate-500/40"
                    )}
                    style={{ width: `${(task.words / maxTaskWords) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">
                  {task.words.toLocaleString()} words
                </span>
                {task.isParallel && (
                  <span className="text-[10px] text-amber-400 font-medium">║</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <span className="text-amber-400">║</span> = parallel execution (isolated context)
          </p>
        </div>
      )}

      {/* Configuration Panel */}
      {showConfigPanel && (
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="uppercase tracking-wider">Configure Model Parameters</span>
          </button>

          {isConfigOpen && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Input ($/M tokens)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={pricing.inputPricePerMillion}
                  onChange={(e) =>
                    onPricingChange?.({
                      ...pricing,
                      inputPricePerMillion: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Output ($/M tokens)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={pricing.outputPricePerMillion}
                  onChange={(e) =>
                    onPricingChange?.({
                      ...pricing,
                      outputPricePerMillion: parseFloat(e.target.value) || 0,
                    })
                  }
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
                  value={tokenConfig.tokensPerWord}
                  onChange={(e) =>
                    onTokenConfigChange?.({
                      ...tokenConfig,
                      tokensPerWord: parseFloat(e.target.value) || 1.3,
                    })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Tokens/sec (speed)
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  step="10"
                  value={tokenConfig.tokensPerSecond}
                  onChange={(e) =>
                    onTokenConfigChange?.({
                      ...tokenConfig,
                      tokensPerSecond: parseFloat(e.target.value) || 80,
                    })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 tabular-nums"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CostBreakdown;
