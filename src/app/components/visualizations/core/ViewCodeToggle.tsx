"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Code, X, Copy, Check } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface ViewCodeToggleProps {
  /** The code to display when expanded */
  code: string;
  /** Programming language for syntax context */
  language?: string;
  /** Title shown in the code panel header */
  title?: string;
  /** Additional description of what the code does */
  description?: string;
  /** The visualization content to wrap */
  children: React.ReactNode;
  /** Custom className for the wrapper */
  className?: string;
  /** Position of the toggle button */
  buttonPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Default expanded state */
  defaultExpanded?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * ViewCodeToggle wraps a visualization and adds a "View Code" button
 * that reveals the core logic behind the visualization.
 * 
 * The code shown should be simplified, educational code - not the full
 * implementation, but the key algorithm or concept being demonstrated.
 */
export function ViewCodeToggle({
  code,
  language = "typescript",
  title = "Core Logic",
  description,
  children,
  className,
  buttonPosition = "top-right",
  defaultExpanded = false,
}: ViewCodeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonPositionClasses = {
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2",
  };

  const lines = code.split("\n");

  return (
    <div className={cn("relative", className)}>
      {/* The visualization content */}
      <div className={cn(isExpanded && "opacity-30 pointer-events-none transition-opacity")}>
        {children}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
          buttonPositionClasses[buttonPosition],
          isExpanded
            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
            : "bg-muted/80 text-muted-foreground border border-border hover:bg-muted hover:text-foreground backdrop-blur-sm"
        )}
      >
        {isExpanded ? (
          <>
            <X className="w-3.5 h-3.5" />
            Close
          </>
        ) : (
          <>
            <Code className="w-3.5 h-3.5" />
            View Code
          </>
        )}
      </button>

      {/* Code panel overlay */}
      {isExpanded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-full overflow-hidden rounded-xl border border-cyan-500/30 bg-[var(--code-bg)] shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20">
                  <Code className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{title}</h4>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                <span className="px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground">
                  {language}
                </span>
              </div>
            </div>

            {/* Code content */}
            <div className="overflow-auto max-h-[60vh]">
              <pre className="p-4 text-sm leading-relaxed">
                <code className="font-mono">
                  {lines.map((line, index) => (
                    <div key={index} className="flex hover:bg-cyan-500/5 -mx-4 px-4">
                      <span className="select-none pr-4 text-muted-foreground/40 text-right w-8 shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-foreground/90">{line || " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Footer hint */}
            <div className="border-t border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
              <p className="text-xs text-muted-foreground">
                This is simplified, educational code showing the core concept.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCodeToggle;
