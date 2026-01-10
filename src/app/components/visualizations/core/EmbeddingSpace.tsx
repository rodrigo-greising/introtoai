"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type {
  EmbeddingPoint,
  EmbeddingSpaceConfig,
  VectorCategory,
} from "@/lib/visualizations/types";
import {
  DEFAULT_EMBEDDING_CONFIG,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/visualizations/types";

// =============================================================================
// Component Props
// =============================================================================

export interface EmbeddingSpaceProps {
  /** Points to display in the embedding space */
  points: EmbeddingPoint[];
  /** ID of the currently active query point */
  activeQueryId?: string;
  /** IDs of points that match the query */
  matchIds?: string[];
  /** Whether to show connection lines */
  showConnections?: boolean;
  /** ID of the selected point */
  selectedPointId?: string | null;
  /** ID of the hovered point */
  hoveredPointId?: string | null;
  /** Callback when a point is selected */
  onSelectPoint?: (pointId: string | null) => void;
  /** Callback when a point is hovered */
  onHoverPoint?: (pointId: string | null) => void;
  /** Configuration options */
  config?: EmbeddingSpaceConfig;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Custom className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function EmbeddingSpace({
  points,
  activeQueryId,
  matchIds = [],
  showConnections = false,
  selectedPointId,
  hoveredPointId,
  onSelectPoint,
  onHoverPoint,
  config = DEFAULT_EMBEDDING_CONFIG,
  colorTheme = "cyan",
  className,
}: EmbeddingSpaceProps) {
  const {
    showGrid = true,
    showSimilarityScores = true,
    showLegend = true,
    enableSelection = true,
    enableHover = true,
    minHeight = 280,
  } = config;

  const matchSet = useMemo(() => new Set(matchIds), [matchIds]);

  // Calculate simulated similarity scores for display
  const pointsWithSimilarity = useMemo(() => {
    const queryPoint = points.find((p) => p.id === activeQueryId);

    return points.map((p) => {
      if (p.id === activeQueryId || !queryPoint) return p;

      // If point already has similarity, use it
      if (p.similarity !== undefined) return p;

      // Simulate similarity based on whether it's a match
      const simulatedSimilarity = matchSet.has(p.id)
        ? 0.8 + Math.random() * 0.18
        : 0.3 + Math.random() * 0.25;

      return { ...p, similarity: simulatedSimilarity };
    });
  }, [points, activeQueryId, matchSet]);

  // Find linked SOPs from matched hypotheticals
  const linkedIds = useMemo(() => {
    const ids = new Set<string>();
    points.forEach((p) => {
      if (matchSet.has(p.id) && p.linkedTo) {
        p.linkedTo.forEach((id) => ids.add(id));
      }
    });
    return ids;
  }, [points, matchSet]);

  // Get unique categories for legend
  const categories = useMemo(() => {
    const cats = new Set<VectorCategory>();
    points.forEach((p) => cats.add(p.category as VectorCategory));
    return Array.from(cats);
  }, [points]);

  const themeColors = {
    cyan: { badge: "bg-cyan-500/20 text-cyan-400" },
    violet: { badge: "bg-violet-500/20 text-violet-400" },
    amber: { badge: "bg-amber-500/20 text-amber-400" },
    emerald: { badge: "bg-emerald-500/20 text-emerald-400" },
  };

  const theme = themeColors[colorTheme] || themeColors.cyan;

  return (
    <div
      className={cn(
        "relative w-full bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden",
        className
      )}
      style={{ minHeight }}
    >
      {/* Grid background */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="embedding-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-600"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#embedding-grid)" />
        </svg>
      )}

      {/* Connection lines */}
      {showConnections && activeQueryId && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {pointsWithSimilarity.map((p) => {
            if (p.id === activeQueryId) return null;
            const isMatch = matchSet.has(p.id);
            const isLinked = linkedIds.has(p.id);
            if (!isMatch && !isLinked) return null;

            const query = pointsWithSimilarity.find((q) => q.id === activeQueryId);
            if (!query) return null;

            // For hypotheticals with links to SOPs
            if (p.category === "hypothetical" && p.linkedTo && showConnections) {
              return (
                <g key={`link-group-${p.id}`}>
                  {/* Query to hypothetical */}
                  <line
                    x1={`${query.x * 100}%`}
                    y1={`${query.y * 100}%`}
                    x2={`${p.x * 100}%`}
                    y2={`${p.y * 100}%`}
                    stroke={getCategoryColor("query")}
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    strokeDasharray={isMatch ? "none" : "4 4"}
                    className="transition-all duration-500"
                  />
                  {/* Hypothetical to SOPs */}
                  {p.linkedTo.map((sopId) => {
                    const sop = points.find((s) => s.id === sopId);
                    if (!sop) return null;
                    return (
                      <line
                        key={`link-${p.id}-${sopId}`}
                        x1={`${p.x * 100}%`}
                        y1={`${p.y * 100}%`}
                        x2={`${sop.x * 100}%`}
                        y2={`${sop.y * 100}%`}
                        stroke={getCategoryColor("sop")}
                        strokeWidth="2"
                        strokeOpacity={isMatch ? "0.8" : "0.3"}
                        strokeDasharray="6 3"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </g>
              );
            }

            return (
              <line
                key={`line-${p.id}`}
                x1={`${query.x * 100}%`}
                y1={`${query.y * 100}%`}
                x2={`${p.x * 100}%`}
                y2={`${p.y * 100}%`}
                stroke={isMatch ? getCategoryColor("query") : "rgba(148, 163, 184, 0.3)"}
                strokeWidth={isMatch ? "2" : "1"}
                strokeOpacity={isMatch ? "0.6" : "0.3"}
                strokeDasharray={isMatch ? "none" : "4 4"}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
      )}

      {/* Points */}
      {pointsWithSimilarity.map((point) => {
        const isActive = point.id === activeQueryId;
        const isMatch = matchSet.has(point.id);
        const isLinked = linkedIds.has(point.id);
        const isHighlighted = isActive || isMatch || isLinked;
        const isSelected = point.id === selectedPointId;
        const isHovered = point.id === hoveredPointId;
        const pointColor = getCategoryColor(point.category as VectorCategory);

        return (
          <div
            key={point.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group",
              isHighlighted || isSelected ? "z-20" : "z-10",
              enableSelection && "cursor-pointer"
            )}
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
            }}
            onClick={() => enableSelection && onSelectPoint?.(isSelected ? null : point.id)}
            onMouseEnter={() => enableHover && onHoverPoint?.(point.id)}
            onMouseLeave={() => enableHover && onHoverPoint?.(null)}
          >
            {/* Glow effect */}
            {isHighlighted && (
              <div
                className="absolute inset-0 -m-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: pointColor,
                  opacity: 0.2,
                  filter: "blur(8px)",
                }}
              />
            )}

            {/* Point dot */}
            <div
              className={cn(
                "rounded-full transition-all duration-300",
                isActive ? "w-5 h-5" : isHighlighted ? "w-4 h-4" : "w-3 h-3"
              )}
              style={{
                backgroundColor: pointColor,
                boxShadow: isHighlighted ? `0 0 12px ${pointColor}` : "none",
              }}
            />

            {/* Label */}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
                isHighlighted || isHovered
                  ? "-top-8 opacity-100 bg-slate-800 border border-slate-600 px-2 py-1 rounded text-[11px]"
                  : "-top-6 opacity-60 text-[10px]"
              )}
              style={{ color: isHighlighted || isHovered ? pointColor : "#94a3b8" }}
            >
              {point.label}
              {isMatch && showSimilarityScores && point.similarity && (
                <span className="ml-1 text-emerald-400">
                  ({(point.similarity * 100).toFixed(0)}%)
                </span>
              )}
            </div>

            {/* Tooltip on hover */}
            {point.content && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-48 p-2 rounded bg-slate-800 border border-slate-600 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                <div
                  className="text-[9px] uppercase tracking-wider mb-1"
                  style={{ color: pointColor }}
                >
                  {getCategoryLabel(point.category as VectorCategory)}
                </div>
                <p className="m-0 line-clamp-3">{point.content}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              <span className="text-slate-400">{getCategoryLabel(cat)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Embedding space label */}
      <div className={cn("absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-medium", theme.badge)}>
        Embedding Space
      </div>
    </div>
  );
}

export default EmbeddingSpace;
