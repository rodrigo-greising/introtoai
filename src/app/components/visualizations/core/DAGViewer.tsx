"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type {
  DAGTask,
  TaskState,
  TaskStatus,
  DAGViewerConfig,
  DAGLayoutConfig,
} from "@/lib/visualizations/types";
import {
  DEFAULT_DAG_LAYOUT,
  getNodePosition,
  getEdgePath,
  calculateDAGDimensions,
  getCompletedTasksAtPoint,
} from "@/lib/visualizations/types";

// =============================================================================
// Status Colors
// =============================================================================

const statusColors: Record<
  TaskStatus,
  {
    bg: string;
    border: string;
    text: string;
    nodeBg: string;
    nodeStroke: string;
  }
> = {
  pending: {
    bg: "bg-slate-800/50",
    border: "border-slate-600/50",
    text: "text-slate-400",
    nodeBg: "rgba(51, 65, 85, 0.3)",
    nodeStroke: "rgba(100, 116, 139, 0.5)",
  },
  running: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/60",
    text: "text-amber-400",
    nodeBg: "rgba(245, 158, 11, 0.15)",
    nodeStroke: "rgba(245, 158, 11, 0.8)",
  },
  completed: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/60",
    text: "text-emerald-400",
    nodeBg: "rgba(16, 185, 129, 0.15)",
    nodeStroke: "rgba(16, 185, 129, 0.8)",
  },
};

// =============================================================================
// Component Props
// =============================================================================

export interface DAGViewerProps {
  /** Tasks to display (with their current state) */
  tasks: TaskState[];
  /** Currently selected task ID */
  selectedTaskId?: string | null;
  /** Callback when a task is selected */
  onSelectTask?: (taskId: string | null) => void;
  /** Configuration options */
  config?: DAGViewerConfig;
  /** Panel title */
  title?: string;
  /** Panel subtitle */
  subtitle?: string;
  /** Custom className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function DAGViewer({
  tasks,
  selectedTaskId,
  onSelectTask,
  config = {},
  title = "DAG Visualization",
  subtitle = "Click a node to filter the chat view",
  className,
}: DAGViewerProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const {
    layout: layoutOverrides,
    showGrid = true,
    enableSelection = true,
    animateTransitions = true,
    colorTheme = "cyan",
  } = config;

  const layout: DAGLayoutConfig = {
    ...DEFAULT_DAG_LAYOUT,
    ...layoutOverrides,
  };

  const { width: svgWidth, height: svgHeight } = useMemo(
    () => calculateDAGDimensions(tasks, layout),
    [tasks, layout]
  );

  // Compute which tasks would be complete when selectedTaskId completes
  const completedAtSelection = useMemo(() => {
    if (!selectedTaskId) return new Set<string>();
    return getCompletedTasksAtPoint(selectedTaskId, tasks);
  }, [selectedTaskId, tasks]);

  const activeTaskId = selectedTaskId || hoveredTaskId;

  const themeColors = {
    cyan: { dot: "bg-cyan-500" },
    violet: { dot: "bg-violet-500" },
    amber: { dot: "bg-amber-500" },
    emerald: { dot: "bg-emerald-500" },
  };

  const theme = themeColors[colorTheme] || themeColors.cyan;

  const handleNodeClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (enableSelection && onSelectTask) {
      onSelectTask(selectedTaskId === taskId ? null : taskId);
    }
  };

  const handleBackgroundClick = () => {
    if (enableSelection && onSelectTask) {
      onSelectTask(null);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl border border-border bg-card/30 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", theme.dot)} />
            <h5 className="font-semibold text-foreground text-sm">{title}</h5>
          </div>
          {selectedTaskId && onSelectTask && (
            <button
              onClick={() => onSelectTask(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear
            </button>
          )}
        </div>
        {subtitle && <p className="text-[10px] text-muted-foreground m-0 mt-1">{subtitle}</p>}
      </div>

      {/* DAG Content */}
      <div className="flex-1 relative overflow-auto min-h-[300px]">
        {/* Grid Background */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        )}

        <svg
          width={svgWidth}
          height={svgHeight}
          className="min-w-full relative z-10"
          style={{ minHeight: svgHeight }}
          onClick={handleBackgroundClick}
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(148, 163, 184, 0.5)" />
            </marker>
            <marker
              id="arrow-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(16, 185, 129, 0.8)" />
            </marker>
            <marker
              id="arrow-selected"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(34, 211, 238, 0.8)" />
            </marker>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          <g className="edges" style={{ pointerEvents: "none" }}>
            {tasks.map((task) =>
              task.dependencies.map((depId) => {
                const depTask = tasks.find((t) => t.id === depId);
                if (!depTask) return null;

                const isInSelectionPath =
                  selectedTaskId &&
                  completedAtSelection.has(depId) &&
                  completedAtSelection.has(task.id);
                const isActive = depTask.status === "completed";
                const isHighlighted = activeTaskId === task.id || activeTaskId === depId;

                return (
                  <path
                    key={`${depId}-${task.id}`}
                    d={getEdgePath(depTask, task, layout)}
                    fill="none"
                    stroke={
                      isInSelectionPath
                        ? "rgba(34, 211, 238, 0.7)"
                        : isActive
                          ? "rgba(16, 185, 129, 0.6)"
                          : "rgba(148, 163, 184, 0.3)"
                    }
                    strokeWidth={isHighlighted || isInSelectionPath ? 2.5 : 1.5}
                    strokeDasharray={isActive || isInSelectionPath ? "none" : "5 3"}
                    markerEnd={
                      isInSelectionPath
                        ? "url(#arrow-selected)"
                        : isActive
                          ? "url(#arrow-active)"
                          : "url(#arrow)"
                    }
                    className={animateTransitions ? "transition-all duration-300" : ""}
                  />
                );
              })
            )}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {tasks.map((task) => {
              const pos = getNodePosition(task, layout);
              const isHovered = hoveredTaskId === task.id;
              const isSelected = selectedTaskId === task.id;
              const isInSelectionPath = selectedTaskId && completedAtSelection.has(task.id);
              const isActive = isHovered || isSelected;

              // Determine visual state
              let nodeBg: string;
              let nodeStroke: string;
              let statusIndicator: string;

              if (isSelected) {
                nodeBg = "rgba(34, 211, 238, 0.2)";
                nodeStroke = "rgba(34, 211, 238, 1)";
                statusIndicator = "#22D3EE";
              } else if (isInSelectionPath) {
                nodeBg = "rgba(34, 211, 238, 0.1)";
                nodeStroke = "rgba(34, 211, 238, 0.6)";
                statusIndicator = "#22D3EE";
              } else {
                const colors = statusColors[task.status];
                nodeBg = colors.nodeBg;
                nodeStroke = isHovered ? "rgba(34, 211, 238, 0.8)" : colors.nodeStroke;
                statusIndicator =
                  task.status === "completed"
                    ? "#10B981"
                    : task.status === "running"
                      ? "#F59E0B"
                      : "#64748B";
              }

              return (
                <g
                  key={task.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                  onClick={(e) => handleNodeClick(task.id, e)}
                  className={enableSelection ? "cursor-pointer" : ""}
                  style={{
                    filter: task.status !== "pending" || isInSelectionPath ? "url(#glow)" : "none",
                  }}
                >
                  {/* Invisible larger hit area */}
                  <rect
                    x="-5"
                    y="-5"
                    width={layout.nodeWidth + 10}
                    height={layout.nodeHeight + 10}
                    fill="transparent"
                  />

                  {/* Node background */}
                  <rect
                    x="0"
                    y="0"
                    width={layout.nodeWidth}
                    height={layout.nodeHeight}
                    rx="8"
                    fill={nodeBg}
                    stroke={nodeStroke}
                    strokeWidth={isActive || isSelected ? 2 : 1.5}
                    className={animateTransitions ? "transition-all duration-300" : ""}
                  />

                  {/* Selection ring */}
                  {isSelected && (
                    <rect
                      x="-3"
                      y="-3"
                      width={layout.nodeWidth + 6}
                      height={layout.nodeHeight + 6}
                      rx="11"
                      fill="none"
                      stroke="rgba(34, 211, 238, 0.5)"
                      strokeWidth="2"
                    />
                  )}

                  {/* Running pulse ring */}
                  {task.status === "running" && !isInSelectionPath && (
                    <rect
                      x="-2"
                      y="-2"
                      width={layout.nodeWidth + 4}
                      height={layout.nodeHeight + 4}
                      rx="10"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.4)"
                      strokeWidth="2"
                      className="animate-pulse"
                      style={{ pointerEvents: "none" }}
                    />
                  )}

                  {/* Status indicator */}
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill={statusIndicator}
                    className={task.status === "running" && !isInSelectionPath ? "animate-pulse" : ""}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Checkmark for completed */}
                  {(task.status === "completed" || isInSelectionPath) && (
                    <path
                      d="M9.5 12 L11.5 14 L15 10"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ pointerEvents: "none" }}
                    />
                  )}

                  {/* Task label */}
                  <text
                    x={layout.nodeWidth / 2}
                    y={layout.nodeHeight / 2 + 4}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-current"
                    style={{
                      fill: isActive || isInSelectionPath ? "#22D3EE" : "#E2E8F0",
                      pointerEvents: "none",
                    }}
                  >
                    {task.shortLabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default DAGViewer;
