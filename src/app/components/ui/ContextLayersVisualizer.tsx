"use client";

import { cn } from "@/lib/utils";

interface Layer {
  id: number;
  name: string;
  volatility: string;
  description: string;
  cacheStatus: "highest" | "stable" | "session" | "fresh";
  cacheLabel: string;
}

const layers: Layer[] = [
  {
    id: 1,
    name: "System Identity",
    volatility: "static",
    description: '"You are a code review assistant..."',
    cacheStatus: "highest",
    cacheLabel: "Cache-eligible (highest reuse)",
  },
  {
    id: 2,
    name: "Capabilities & Tools",
    volatility: "static",
    description: "Tool schemas, available functions",
    cacheStatus: "highest",
    cacheLabel: "Cache-eligible (highest reuse)",
  },
  {
    id: 3,
    name: "Domain Knowledge",
    volatility: "semi-static",
    description: "Reference docs, coding standards, examples",
    cacheStatus: "stable",
    cacheLabel: "Cache-eligible when stable",
  },
  {
    id: 4,
    name: "Session State",
    volatility: "per-session",
    description: "Conversation summary, active task context",
    cacheStatus: "session",
    cacheLabel: "Cache-eligible within session",
  },
  {
    id: 5,
    name: "Current Request",
    volatility: "per-turn",
    description: "Latest user message, immediate context",
    cacheStatus: "fresh",
    cacheLabel: "Always fresh",
  },
];

const cacheStatusColors: Record<Layer["cacheStatus"], { bg: string; border: string; badge: string; text: string }> = {
  highest: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-400",
    text: "text-emerald-400",
  },
  stable: {
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-400/80",
    text: "text-emerald-400/80",
  },
  session: {
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400",
    text: "text-amber-400",
  },
  fresh: {
    bg: "bg-cyan-500/8",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-400",
    text: "text-cyan-400",
  },
};

interface ContextLayersVisualizerProps {
  className?: string;
}

export function ContextLayersVisualizer({ className }: ContextLayersVisualizerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Main visualization */}
      <div className="relative rounded-xl border border-border bg-card/50 overflow-hidden">
        {/* Gradient overlay showing stability spectrum */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(52, 211, 153, 0.04) 0%, rgba(52, 211, 153, 0.02) 40%, rgba(34, 211, 238, 0.04) 100%)",
          }}
        />
        
        {/* Layers */}
        <div className="relative">
          {layers.map((layer, index) => {
            const colors = cacheStatusColors[layer.cacheStatus];
            const isFirst = index === 0;
            const isLast = index === layers.length - 1;
            
            return (
              <div
                key={layer.id}
                className={cn(
                  "group relative flex items-stretch border-border transition-all duration-200",
                  !isLast && "border-b",
                  "hover:bg-white/[0.02]"
                )}
              >
                {/* Layer number indicator */}
                <div className={cn(
                  "flex-shrink-0 w-12 flex items-center justify-center border-r border-border/50",
                  colors.bg
                )}>
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    colors.text
                  )}>
                    {layer.id}
                  </span>
                </div>
                
                {/* Layer content */}
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground text-sm">
                          {layer.name}
                        </h4>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                          layer.volatility === "static" && "bg-emerald-500/15 text-emerald-400",
                          layer.volatility === "semi-static" && "bg-emerald-500/10 text-emerald-400/70",
                          layer.volatility === "per-session" && "bg-amber-500/15 text-amber-400",
                          layer.volatility === "per-turn" && "bg-cyan-500/15 text-cyan-400"
                        )}>
                          {layer.volatility}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {layer.description}
                      </p>
                    </div>
                    
                    {/* Cache status badge - shown on larger screens */}
                    <div className={cn(
                      "hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap flex-shrink-0",
                      colors.badge
                    )}>
                      {layer.cacheStatus !== "fresh" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {layer.cacheStatus === "fresh" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {layer.cacheLabel}
                    </div>
                  </div>
                </div>
                
                {/* Connection line between layers */}
                {!isLast && (
                  <div className="absolute -bottom-px left-6 w-px h-2 bg-border/50 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stability spectrum arrow */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 relative h-6">
          {/* Arrow line with gradient */}
          <div className="absolute inset-y-0 left-0 right-8 flex items-center">
            <div 
              className="h-1 w-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #34d399 0%, #34d399 30%, #fbbf24 60%, #22d3ee 100%)",
              }}
            />
          </div>
          {/* Arrowhead */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Labels */}
          <div className="absolute -bottom-5 left-0 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
            Stable prefix
          </div>
          <div className="absolute -bottom-5 right-0 text-[10px] text-cyan-400 font-medium uppercase tracking-wider">
            Volatile suffix
          </div>
        </div>
      </div>
      
      {/* Mobile cache status legend */}
      <div className="sm:hidden mt-6 pt-4 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Cache Eligibility</p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {layers.map((layer) => {
            const colors = cacheStatusColors[layer.cacheStatus];
            return (
              <div key={layer.id} className="flex items-center gap-1.5">
                <span className={cn("w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono font-bold", colors.bg, colors.text)}>
                  {layer.id}
                </span>
                <span className="text-muted-foreground truncate">{layer.cacheLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
