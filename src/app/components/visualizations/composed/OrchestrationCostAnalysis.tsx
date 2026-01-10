"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { PricingModel, TokenEstimationConfig, DAGTask } from "@/lib/visualizations/types";
import { DEFAULT_PRICING, DEFAULT_TOKEN_CONFIG } from "@/lib/visualizations/types";
import { orchestrationScenarios } from "@/lib/visualizations/data";
import { compareExecutionStrategies, countWords } from "@/lib/visualizations/utils";
import { CostBreakdown } from "../core";

// =============================================================================
// Component Props
// =============================================================================

export interface OrchestrationCostAnalysisProps {
  /** Custom className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function OrchestrationCostAnalysis({ className }: OrchestrationCostAnalysisProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(orchestrationScenarios[0]?.id || "");
  const [pricing, setPricing] = useState<PricingModel>(DEFAULT_PRICING);
  const [tokenConfig, setTokenConfig] = useState<TokenEstimationConfig>(DEFAULT_TOKEN_CONFIG);

  const scenario = useMemo(
    () => orchestrationScenarios.find((s) => s.id === selectedScenarioId) || orchestrationScenarios[0],
    [selectedScenarioId]
  );

  const tasks = useMemo(() => scenario?.tasks || [], [scenario?.tasks]);

  // Calculate cost comparison
  const comparison = useMemo(() => {
    if (tasks.length === 0) return null;
    return compareExecutionStrategies(tasks as DAGTask[], pricing, tokenConfig);
  }, [tasks, pricing, tokenConfig]);

  // Build task breakdown data
  const taskBreakdown = useMemo(() => {
    return tasks.map((task) => {
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
      return {
        id: task.id,
        label: task.shortLabel,
        words,
        isParallel: task.dependencies.length > 0 && task.column > 1,
      };
    });
  }, [tasks]);

  if (!comparison) {
    return null;
  }

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
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="p-4 rounded-lg border border-border bg-muted/20">
        <p className="text-sm text-muted-foreground m-0">
          <strong className="text-foreground">{scenario.name}:</strong> {scenario.description}
        </p>
      </div>

      {/* Cost Breakdown Component */}
      <CostBreakdown
        comparison={comparison}
        taskBreakdown={taskBreakdown}
        pricing={pricing}
        tokenConfig={tokenConfig}
        showConfigPanel={true}
        onPricingChange={setPricing}
        onTokenConfigChange={setTokenConfig}
        config={{
          showComparisonBars: true,
          showTaskBreakdown: true,
          labels: {
            baseline: "Linear Execution",
            optimized: "Parallel Orchestration",
          },
        }}
      />

      {/* Key insight */}
      <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-emerald-500/20">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium mb-1 text-emerald-400">Context Isolation Matters</h4>
            <p className="text-sm text-muted-foreground m-0">
              In parallel orchestration, each worker operates with <strong className="text-foreground">isolated context</strong>. 
              The orchestrator only receives summaries (~50 tokens each), not the full internal work 
              (often 500-800 tokens per worker). This is why parallel patterns can process the same 
              work with significantly fewer total tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrchestrationCostAnalysis;
