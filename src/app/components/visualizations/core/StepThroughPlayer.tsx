"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface Step {
  /** Unique identifier for the step */
  id: string;
  /** Display label for the step */
  label: string;
  /** Optional description shown when step is active */
  description?: string;
}

export interface StepThroughPlayerProps {
  /** Array of steps to navigate through */
  steps: Step[];
  /** Current step index (0-based) */
  currentStep: number;
  /** Whether auto-play is active */
  isPlaying?: boolean;
  /** Callback when step changes */
  onStepChange: (stepIndex: number) => void;
  /** Callback when play/pause is toggled */
  onPlayPause?: () => void;
  /** Callback when reset is clicked */
  onReset?: () => void;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Show step indicators (dots) */
  showStepIndicators?: boolean;
  /** Show step labels */
  showStepLabels?: boolean;
  /** Custom className */
  className?: string;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * StepThroughPlayer provides step-by-step navigation through a sequence.
 * Unlike PlaybackControls which runs continuously, this allows users to
 * manually step through states one at a time.
 */
export function StepThroughPlayer({
  steps,
  currentStep,
  isPlaying = false,
  onStepChange,
  onPlayPause,
  onReset,
  colorTheme = "cyan",
  showStepIndicators = true,
  showStepLabels = true,
  className,
  compact = false,
}: StepThroughPlayerProps) {
  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < steps.length - 1;
  const isComplete = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const themeColors = {
    cyan: {
      active: "bg-cyan-500",
      activeBorder: "border-cyan-500",
      activeText: "text-cyan-400",
      button: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30",
    },
    violet: {
      active: "bg-violet-500",
      activeBorder: "border-violet-500",
      activeText: "text-violet-400",
      button: "bg-violet-500/20 text-violet-400 border-violet-500/40 hover:bg-violet-500/30",
    },
    amber: {
      active: "bg-amber-500",
      activeBorder: "border-amber-500",
      activeText: "text-amber-400",
      button: "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30",
    },
    emerald: {
      active: "bg-emerald-500",
      activeBorder: "border-emerald-500",
      activeText: "text-emerald-400",
      button: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30",
    },
  };

  const theme = themeColors[colorTheme];

  const handlePrev = () => {
    if (canGoBack) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      onStepChange(currentStep + 1);
    }
  };

  const handleStepClick = (index: number) => {
    onStepChange(index);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={!canGoBack}
            className={cn(
              "flex items-center justify-center rounded-lg border transition-all duration-200",
              compact ? "w-8 h-8" : "w-9 h-9",
              canGoBack
                ? "bg-muted/50 border-border hover:bg-muted text-foreground"
                : "bg-muted/20 border-border/50 text-muted-foreground/50 cursor-not-allowed"
            )}
            aria-label="Previous step"
          >
            <ChevronLeft className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </button>

          {/* Play/Pause Button (if auto-play is supported) */}
          {onPlayPause && (
            <button
              onClick={onPlayPause}
              className={cn(
                "flex items-center justify-center rounded-lg border transition-all duration-200",
                compact ? "w-8 h-8" : "w-9 h-9",
                isPlaying
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : theme.button
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
              ) : (
                <Play className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
              )}
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className={cn(
              "flex items-center justify-center rounded-lg border transition-all duration-200",
              compact ? "w-8 h-8" : "w-9 h-9",
              canGoForward
                ? "bg-muted/50 border-border hover:bg-muted text-foreground"
                : "bg-muted/20 border-border/50 text-muted-foreground/50 cursor-not-allowed"
            )}
            aria-label="Next step"
          >
            <ChevronRight className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </button>

          {/* Reset Button */}
          {onReset && (
            <button
              onClick={onReset}
              className={cn(
                "flex items-center justify-center rounded-lg border transition-all duration-200 ml-1",
                compact ? "w-8 h-8" : "w-9 h-9",
                "bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              aria-label="Reset"
            >
              <RotateCcw className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </button>
          )}
        </div>

        {/* Step Counter */}
        <div className="text-sm text-muted-foreground">
          Step{" "}
          <span className={cn("font-medium", theme.activeText)}>
            {currentStep + 1}
          </span>{" "}
          of {steps.length}
          {isComplete && (
            <span className="ml-2 text-emerald-400 text-xs">(Complete)</span>
          )}
        </div>
      </div>

      {/* Step Indicators */}
      {showStepIndicators && (
        <div className="flex items-center gap-1.5">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "transition-all duration-200 rounded-full",
                  compact ? "w-2 h-2" : "w-2.5 h-2.5",
                  isActive
                    ? cn(theme.active, "scale-125")
                    : isPast
                    ? "bg-emerald-500/70"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to step ${index + 1}: ${step.label}`}
                title={step.label}
              />
            );
          })}
        </div>
      )}

      {/* Current Step Label & Description */}
      {showStepLabels && currentStepData && (
        <div className="pt-1">
          <p className={cn("text-sm font-medium", theme.activeText)}>
            {currentStepData.label}
          </p>
          {currentStepData.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentStepData.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default StepThroughPlayer;
