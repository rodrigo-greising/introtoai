"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Scenario, ChatMessage, EmbeddingPoint, ScenarioStep } from "@/lib/visualizations/types";
import { ragPatterns } from "@/lib/visualizations/data";
import { ChatPanel, EmbeddingSpace, PlaybackControls } from "../core";

// =============================================================================
// Component Props
// =============================================================================

export interface RAGVisualizerProps {
  /** Patterns to display (defaults to all RAG patterns) */
  patterns?: Scenario[];
  /** Initially selected pattern ID */
  defaultPatternId?: string;
  /** Custom className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function RAGVisualizer({
  patterns = ragPatterns,
  defaultPatternId,
  className,
}: RAGVisualizerProps) {
  // Pattern selection
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    defaultPatternId || patterns[0]?.id || ""
  );

  const pattern = useMemo(
    () => patterns.find((p) => p.id === selectedPatternId) || patterns[0],
    [selectedPatternId, patterns]
  );

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);

  // Reset when pattern changes
  useEffect(() => {
    setCurrentStepIndex(-1);
    setVisibleMessages([]);
    setIsPlaying(false);
  }, [selectedPatternId]);

  // Reset function
  const reset = useCallback(() => {
    setCurrentStepIndex(-1);
    setVisibleMessages([]);
    setIsPlaying(false);
  }, []);

  // Get current step
  const currentStep = useMemo<ScenarioStep | undefined>(() => {
    if (currentStepIndex < 0 || !pattern?.steps) return undefined;
    return pattern.steps[currentStepIndex];
  }, [pattern, currentStepIndex]);

  // Playback logic
  useEffect(() => {
    if (!isPlaying || !pattern?.steps) return;

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex >= pattern.steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = pattern.steps[nextStepIndex];
    const timer = setTimeout(
      () => {
        setCurrentStepIndex(nextStepIndex);
        if (step.messages) {
          setVisibleMessages((prev) => [...prev, ...step.messages!]);
        }

        // Check if this is the last step
        if (pattern.steps && nextStepIndex >= pattern.steps.length - 1) {
          setIsPlaying(false);
        }
      },
      nextStepIndex === 0 ? 300 : step.duration
    );

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, pattern]);

  // Computed values
  const progress =
    pattern?.steps?.length && pattern.steps.length > 0
      ? ((currentStepIndex + 1) / pattern.steps.length) * 100
      : 0;
  const isComplete = pattern?.steps && currentStepIndex >= pattern.steps.length - 1;

  // Convert vectors to embedding points
  const embeddingPoints = useMemo<EmbeddingPoint[]>(() => {
    if (!pattern?.vectors) return [];
    return pattern.vectors.map((v) => ({
      id: v.id,
      label: v.label,
      x: v.x,
      y: v.y,
      category: v.category as EmbeddingPoint["category"],
      content: v.content,
      linkedTo: v.linkedTo,
    }));
  }, [pattern?.vectors]);

  if (!pattern) {
    return <div className={cn("text-muted-foreground", className)}>No patterns available</div>;
  }

  const colorTheme = pattern.colorTheme || "cyan";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pattern Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPatternId(p.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedPatternId === p.id
                ? p.colorTheme === "cyan"
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                  : "bg-violet-500/20 text-violet-400 border-violet-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span>{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>

      {/* Pattern Description */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg border",
          colorTheme === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" : "bg-violet-500/5 border-violet-500/20"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl",
            colorTheme === "cyan" ? "bg-cyan-500/20" : "bg-violet-500/20"
          )}
        >
          {pattern.icon}
        </div>
        <div>
          <p className="text-sm text-foreground font-medium mb-1 m-0">{pattern.name}</p>
          <p className="text-xs text-muted-foreground m-0">{pattern.description}</p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isComplete) {
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
            ) : isComplete ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Step {Math.max(0, currentStepIndex + 1)} of {pattern.steps?.length || 0}
          {currentStep && (
            <span
              className={cn(
                "ml-2 px-2 py-0.5 rounded text-[10px] font-medium",
                colorTheme === "cyan" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"
              )}
            >
              {currentStep.name}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-500",
            colorTheme === "cyan"
              ? "bg-gradient-to-r from-cyan-500 to-emerald-400"
              : "bg-gradient-to-r from-violet-500 to-pink-400"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat Panel */}
        <ChatPanel
          messages={visibleMessages}
          config={{
            title: "Conversation Flow",
            subtitle:
              pattern.id === "rag-as-tool"
                ? "Agent decides to use search tool"
                : "System matches query to hypothetical questions",
            showTokenCounts: true,
            colorTheme,
          }}
        />

        {/* Embedding Space Panel */}
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  colorTheme === "cyan" ? "bg-cyan-500" : "bg-violet-500"
                )}
              />
              <h5 className="font-semibold text-foreground text-sm">Vector Space</h5>
            </div>
            <p className="text-[10px] text-muted-foreground m-0 mt-1">
              Semantic similarity in embedding space
            </p>
          </div>
          <div className="p-3">
            <EmbeddingSpace
              points={embeddingPoints}
              activeQueryId={currentStep?.vectorState?.activeQuery}
              matchIds={currentStep?.vectorState?.matches}
              showConnections={currentStep?.vectorState?.showConnections}
              colorTheme={colorTheme}
              config={{
                showGrid: true,
                showLegend: true,
                showSimilarityScores: true,
                minHeight: 280,
              }}
            />
          </div>
        </div>
      </div>

      {/* Insight Callout */}
      {pattern.insight && (
        <div
          className={cn(
            "rounded-lg p-4 border",
            colorTheme === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" : "bg-violet-500/5 border-violet-500/20"
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                colorTheme === "cyan" ? "bg-cyan-500/20" : "bg-violet-500/20"
              )}
            >
              <svg
                className={cn("w-4 h-4", colorTheme === "cyan" ? "text-cyan-400" : "text-violet-400")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h4 className={cn("font-medium mb-1", colorTheme === "cyan" ? "text-cyan-400" : "text-violet-400")}>
                Key Insight
              </h4>
              <p className="text-sm text-muted-foreground m-0">{pattern.insight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison callout for context engineering pattern */}
      {pattern.id === "rag-context-eng" && (
        <div className="rounded-lg p-4 border bg-amber-500/5 border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-amber-500/20">
              <span className="text-base">🔀</span>
            </div>
            <div>
              <h4 className="font-medium mb-1 text-amber-400">vs. RAG as Tool</h4>
              <p className="text-sm text-muted-foreground m-0">
                The key difference: <strong className="text-foreground">RAG as Tool</strong> lets
                the agent decide when to search.{" "}
                <strong className="text-foreground">RAG for Context Engineering</strong> happens
                automatically—the system pre-fetches relevant SOPs before the agent even sees the
                query. Both approaches have their place depending on whether you want agent
                autonomy or guaranteed context injection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RAGVisualizer;
