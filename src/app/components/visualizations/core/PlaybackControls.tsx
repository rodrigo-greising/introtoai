"use client";

import { cn } from "@/lib/utils";
import type { PlaybackConfig } from "@/lib/visualizations/types";
import { DEFAULT_PLAYBACK_CONFIG } from "@/lib/visualizations/types";

// =============================================================================
// Types
// =============================================================================

export interface PlaybackControlsProps {
  /** Whether animation is currently playing */
  isPlaying: boolean;
  /** Whether animation has completed */
  isComplete: boolean;
  /** Current playback speed multiplier */
  speed: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Number of running items */
  runningCount?: number;
  /** Number of completed items */
  completedCount?: number;
  /** Total number of items */
  totalCount?: number;
  /** Configuration options */
  config?: PlaybackConfig;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Callback when play/pause is clicked */
  onPlayPause: () => void;
  /** Callback when reset is clicked */
  onReset: () => void;
  /** Callback when speed is changed */
  onSpeedChange: (speed: number) => void;
  /** Custom className */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function PlaybackControls({
  isPlaying,
  isComplete,
  speed,
  progress,
  runningCount,
  completedCount,
  totalCount,
  config = DEFAULT_PLAYBACK_CONFIG,
  colorTheme = "cyan",
  onPlayPause,
  onReset,
  onSpeedChange,
  className,
}: PlaybackControlsProps) {
  const { speeds = [0.5, 1, 2, 3] } = config;

  const gradientColors = {
    cyan: "from-cyan-500 to-emerald-400",
    violet: "from-violet-500 to-pink-400",
    amber: "from-amber-500 to-orange-400",
    emerald: "from-emerald-500 to-cyan-400",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause/Replay Button */}
          <button
            onClick={onPlayPause}
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

          {/* Reset Button */}
          <button
            onClick={onReset}
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

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="bg-muted/50 border border-border rounded px-2 py-1 text-sm text-foreground"
            >
              {speeds.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Indicators */}
        {totalCount !== undefined && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            {runningCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-muted-foreground">Running ({runningCount})</span>
              </div>
            )}
            {completedCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">
                  Done ({completedCount}/{totalCount})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-300",
            gradientColors[colorTheme]
          )}
          style={{ width: `${progress}%` }}
        />
        {runningCount !== undefined && runningCount > 0 && totalCount && (
          <div
            className="absolute inset-y-0 bg-amber-500/50 animate-pulse transition-all duration-300"
            style={{
              left: `${progress}%`,
              width: `${(runningCount / totalCount) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default PlaybackControls;
