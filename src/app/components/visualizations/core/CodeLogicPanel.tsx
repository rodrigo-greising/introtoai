"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Code, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface CodeLogicPanelProps {
  /** The code to display */
  code: string;
  /** Programming language */
  language?: string;
  /** Title for the panel */
  title?: string;
  /** Brief description of what the code demonstrates */
  description?: string;
  /** Whether the panel is expanded by default */
  defaultExpanded?: boolean;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Custom className */
  className?: string;
  /** Highlight specific line numbers (1-indexed) */
  highlightLines?: number[];
  /** Maximum height before scrolling */
  maxHeight?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CodeLogicPanel displays simplified, educational code in a collapsible panel.
 * Used alongside visualizations to show the core algorithm or concept.
 */
export function CodeLogicPanel({
  code,
  language = "typescript",
  title = "Core Logic",
  description,
  defaultExpanded = false,
  colorTheme = "cyan",
  className,
  highlightLines = [],
  maxHeight = "400px",
}: CodeLogicPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeColors = {
    cyan: {
      border: "border-cyan-500/30",
      headerBg: "bg-cyan-500/10",
      headerBgHover: "hover:bg-cyan-500/15",
      iconBg: "bg-cyan-500/20",
      iconText: "text-cyan-400",
      highlight: "bg-cyan-500/10",
    },
    violet: {
      border: "border-violet-500/30",
      headerBg: "bg-violet-500/10",
      headerBgHover: "hover:bg-violet-500/15",
      iconBg: "bg-violet-500/20",
      iconText: "text-violet-400",
      highlight: "bg-violet-500/10",
    },
    amber: {
      border: "border-amber-500/30",
      headerBg: "bg-amber-500/10",
      headerBgHover: "hover:bg-amber-500/15",
      iconBg: "bg-amber-500/20",
      iconText: "text-amber-400",
      highlight: "bg-amber-500/10",
    },
    emerald: {
      border: "border-emerald-500/30",
      headerBg: "bg-emerald-500/10",
      headerBgHover: "hover:bg-emerald-500/15",
      iconBg: "bg-emerald-500/20",
      iconText: "text-emerald-400",
      highlight: "bg-emerald-500/10",
    },
  };

  const theme = themeColors[colorTheme];
  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden",
        theme.border,
        className
      )}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 transition-colors",
          theme.headerBg,
          theme.headerBgHover
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-md",
              theme.iconBg
            )}
          >
            <Code className={cn("w-4 h-4", theme.iconText)} />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-foreground">{title}</span>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted/50">
            {language}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="border-t border-border/50">
          {/* Copy Button */}
          <div className="flex justify-end px-4 py-2 bg-[var(--code-bg)] border-b border-border/30">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div
            className="overflow-auto bg-[var(--code-bg)]"
            style={{ maxHeight }}
          >
            <pre className="p-4 text-sm leading-relaxed">
              <code className="font-mono">
                {lines.map((line, index) => {
                  const lineNumber = index + 1;
                  const isHighlighted = highlightLines.includes(lineNumber);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex -mx-4 px-4",
                        isHighlighted && theme.highlight
                      )}
                    >
                      <span className="select-none pr-4 text-muted-foreground/40 text-right w-8 shrink-0">
                        {lineNumber}
                      </span>
                      <span className="text-foreground/90">{line || " "}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-muted/30 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Simplified educational code showing the core concept
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeLogicPanel;
