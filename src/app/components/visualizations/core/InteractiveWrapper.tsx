"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// =============================================================================
// Types
// =============================================================================

export interface InteractiveWrapperProps {
  /** Title of the interactive element */
  title: string;
  /** Brief description of what this visualization shows */
  description?: string;
  /** The main interactive content */
  children: ReactNode;
  /** Optional controls to display in the header (e.g., PlaybackControls) */
  controls?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Color theme for the wrapper */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald" | "rose";
  /** Custom className */
  className?: string;
  /** Whether to show a subtle gradient background */
  showGradient?: boolean;
  /** Icon to display in header (emoji or component) */
  icon?: ReactNode;
  /** Minimum height for the content area */
  minHeight?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * InteractiveWrapper provides a standard frame for interactive visualizations.
 * It includes a header with title/description, an optional controls area,
 * and consistent styling across all interactive elements.
 */
export function InteractiveWrapper({
  title,
  description,
  children,
  controls,
  footer,
  colorTheme = "cyan",
  className,
  showGradient = true,
  icon,
  minHeight = "300px",
}: InteractiveWrapperProps) {
  const themeColors = {
    cyan: {
      border: "border-cyan-500/20",
      headerBg: "bg-cyan-500/5",
      iconBg: "bg-cyan-500/20",
      iconText: "text-cyan-400",
      gradient: "from-cyan-500/5 via-transparent to-transparent",
    },
    violet: {
      border: "border-violet-500/20",
      headerBg: "bg-violet-500/5",
      iconBg: "bg-violet-500/20",
      iconText: "text-violet-400",
      gradient: "from-violet-500/5 via-transparent to-transparent",
    },
    amber: {
      border: "border-amber-500/20",
      headerBg: "bg-amber-500/5",
      iconBg: "bg-amber-500/20",
      iconText: "text-amber-400",
      gradient: "from-amber-500/5 via-transparent to-transparent",
    },
    emerald: {
      border: "border-emerald-500/20",
      headerBg: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/20",
      iconText: "text-emerald-400",
      gradient: "from-emerald-500/5 via-transparent to-transparent",
    },
    rose: {
      border: "border-rose-500/20",
      headerBg: "bg-rose-500/5",
      iconBg: "bg-rose-500/20",
      iconText: "text-rose-400",
      gradient: "from-rose-500/5 via-transparent to-transparent",
    },
  };

  const theme = themeColors[colorTheme];

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        theme.border,
        className
      )}
    >
      {/* Header */}
      <div className={cn("px-4 py-3 border-b", theme.border, theme.headerBg)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon && (
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                  theme.iconBg
                )}
              >
                {typeof icon === "string" ? (
                  <span className="text-lg">{icon}</span>
                ) : (
                  <span className={theme.iconText}>{icon}</span>
                )}
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Controls area */}
        {controls && (
          <div className="mt-3 pt-3 border-t border-border/50">
            {controls}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div
        className={cn(
          "relative p-4",
          showGradient && `bg-gradient-to-b ${theme.gradient}`
        )}
        style={{ minHeight }}
      >
        {children}
      </div>

      {/* Optional footer */}
      {footer && (
        <div className={cn("px-4 py-3 border-t", theme.border, "bg-muted/30")}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default InteractiveWrapper;
