"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CachingCostVisualizerProps {
  className?: string;
}

const MAX_TURNS = 40;

export function CachingCostVisualizer({ className }: CachingCostVisualizerProps) {
  const [chatLength, setChatLength] = useState(10);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCombined, setIsDraggingCombined] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);
  const combinedGraphRef = useRef<SVGSVGElement>(null);
  const comparisonGraphRef = useRef<SVGSVGElement>(null);
  const [configHeight, setConfigHeight] = useState(0);
  
  // Pricing (same defaults as CostVisualizer)
  const [inputPrice, setInputPrice] = useState(1.75); // $/M tokens
  const [outputPrice, setOutputPrice] = useState(14); // $/M tokens
  
  // Caching economics (generic, not provider-specific)
  const [cacheReadDiscount, setCacheReadDiscount] = useState(10); // Default: 10% of normal price (90% discount)
  const [hasWritePremium, setHasWritePremium] = useState(true); // Some providers charge a write premium
  const writePremium = hasWritePremium ? 1.25 : 1.0; // 25% premium when writing
  
  // Token configuration (static context is more detailed for caching scenarios)
  const [systemPromptTokens, setSystemPromptTokens] = useState(2000);
  const [toolsTokens, setToolsTokens] = useState(1500);
  const [documentsTokens, setDocumentsTokens] = useState(3000);
  const [userMessageTokens, setUserMessageTokens] = useState(100);
  const [assistantMessageTokens, setAssistantMessageTokens] = useState(200);
  
  // Cache hit rate (simulating real-world scenarios)
  const [cacheHitRate, setCacheHitRate] = useState(95);

  // Total static tokens
  const totalStaticTokens = systemPromptTokens + toolsTokens + documentsTokens;

  // Measure config panel height for animation
  useEffect(() => {
    if (configRef.current) {
      setConfigHeight(configRef.current.scrollHeight);
    }
  }, [inputPrice, outputPrice, systemPromptTokens, toolsTokens, documentsTokens, userMessageTokens, assistantMessageTokens, hasWritePremium, cacheHitRate, cacheReadDiscount]);

  // Global drag handlers for comparison graph
  useEffect(() => {
    if (!isDraggingCombined) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!combinedGraphRef.current && !comparisonGraphRef.current) return;
      const activeRef = combinedGraphRef.current || comparisonGraphRef.current;
      if (!activeRef) return;
      const rect = activeRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
      setChatLength(newTurn);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!combinedGraphRef.current && !comparisonGraphRef.current) return;
      const activeRef = combinedGraphRef.current || comparisonGraphRef.current;
      if (!activeRef) return;
      const rect = activeRef.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = x / rect.width;
      const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
      setChatLength(newTurn);
    };

    const handleEnd = () => {
      setIsDraggingCombined(false);
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingCombined]);

  // Calculate costs with and without caching
  const costs = useMemo(() => {
    const hitRate = cacheHitRate / 100;
    const readRate = cacheReadDiscount / 100;
    
    // Track totals
    let totalWithoutCaching = 0;
    let totalWithCaching = 0;
    let totalCachedTokens = 0;
    let totalNewTokens = 0;
    
    for (let turn = 1; turn <= chatLength; turn++) {
      // Conversation history for this turn
      const userHistoryTokens = turn * userMessageTokens;
      const assistantHistoryTokens = (turn - 1) * assistantMessageTokens;
      const conversationTokens = userHistoryTokens + assistantHistoryTokens;
      
      // Total input for this turn
      const turnInputTokens = totalStaticTokens + conversationTokens;
      
      // WITHOUT CACHING: Full price for everything, every turn (quadratic)
      totalWithoutCaching += turnInputTokens;
      
      // WITH CACHING: The entire PREFIX from previous turn is cached
      if (turn === 1) {
        const newTokens = totalStaticTokens + userMessageTokens;
        totalWithCaching += newTokens * writePremium;
        totalNewTokens += newTokens;
      } else {
        const previousUserTokens = (turn - 1) * userMessageTokens;
        const previousAssistantTokens = (turn - 2) * assistantMessageTokens;
        const cacheablePrefix = totalStaticTokens + previousUserTokens + previousAssistantTokens;
        
        const newTokensThisTurn = userMessageTokens + assistantMessageTokens;
        
        if (hitRate > 0) {
          const cachedPortion = cacheablePrefix * hitRate;
          const missedPortion = cacheablePrefix * (1 - hitRate);
          
          totalWithCaching += cachedPortion * readRate;
          totalWithCaching += missedPortion;
          totalWithCaching += newTokensThisTurn;
          
          totalCachedTokens += cachedPortion;
          totalNewTokens += newTokensThisTurn + missedPortion;
        } else {
          totalWithCaching += turnInputTokens;
          totalNewTokens += turnInputTokens;
        }
      }
    }
    
    // Output tokens (same for both)
    const outputTokens = chatLength * assistantMessageTokens;
    
    // Calculate the cacheable prefix at current turn for display
    const currentCacheablePrefix = chatLength > 1 
      ? totalStaticTokens + ((chatLength - 1) * userMessageTokens) + ((chatLength - 2) * assistantMessageTokens)
      : 0;
    
    // New tokens at current turn
    const currentNewTokens = chatLength === 1 
      ? totalStaticTokens + userMessageTokens
      : userMessageTokens + assistantMessageTokens;
    
    // Calculate costs in dollars
    const inputCostWithoutCaching = (totalWithoutCaching / 1_000_000) * inputPrice;
    const inputCostWithCaching = (totalWithCaching / 1_000_000) * inputPrice;
    const outputCost = (outputTokens / 1_000_000) * outputPrice;
    
    return {
      withoutCaching: {
        inputTokens: totalWithoutCaching,
        inputCost: inputCostWithoutCaching,
        totalCost: inputCostWithoutCaching + outputCost,
      },
      withCaching: {
        inputTokens: Math.round(totalWithCaching),
        inputCost: inputCostWithCaching,
        totalCost: inputCostWithCaching + outputCost,
        cachedTokens: Math.round(totalCachedTokens),
        newTokens: Math.round(totalNewTokens),
      },
      outputTokens,
      outputCost,
      savingsPercent: totalWithoutCaching > 0 ? ((totalWithoutCaching - totalWithCaching) / totalWithoutCaching) * 100 : 0,
      totalCostSavingsPercent: inputCostWithoutCaching + outputCost > 0 
        ? (((inputCostWithoutCaching + outputCost) - (inputCostWithCaching + outputCost)) / (inputCostWithoutCaching + outputCost)) * 100 
        : 0,
      currentCacheablePrefix,
      currentNewTokens,
      totalStaticTokens,
    };
  }, [chatLength, writePremium, cacheHitRate, cacheReadDiscount, totalStaticTokens, userMessageTokens, assistantMessageTokens, inputPrice, outputPrice]);

  // Generate graph data points
  const graphData = useMemo(() => {
    const points = [];
    const hitRate = cacheHitRate / 100;
    const readRate = cacheReadDiscount / 100;
    
    for (let n = 1; n <= MAX_TURNS; n++) {
      let withoutCaching = 0;
      let withCaching = 0;
      
      for (let turn = 1; turn <= n; turn++) {
        const conversationTokens = turn * userMessageTokens + (turn - 1) * assistantMessageTokens;
        const turnInputTokens = totalStaticTokens + conversationTokens;
        
        withoutCaching += turnInputTokens;
        
        if (turn === 1) {
          const newTokens = totalStaticTokens + userMessageTokens;
          withCaching += newTokens * writePremium;
        } else {
          const previousUserTokens = (turn - 1) * userMessageTokens;
          const previousAssistantTokens = (turn - 2) * assistantMessageTokens;
          const cacheablePrefix = totalStaticTokens + previousUserTokens + previousAssistantTokens;
          
          const newTokensThisTurn = userMessageTokens + assistantMessageTokens;
          
          if (hitRate > 0) {
            const cachedPortion = cacheablePrefix * hitRate;
            const missedPortion = cacheablePrefix * (1 - hitRate);
            
            withCaching += cachedPortion * readRate;
            withCaching += missedPortion + newTokensThisTurn;
          } else {
            withCaching += turnInputTokens;
          }
        }
      }
      
      const outputTokens = n * assistantMessageTokens;
      const inputCostWithout = (withoutCaching / 1_000_000) * inputPrice;
      const inputCostWith = (withCaching / 1_000_000) * inputPrice;
      const outputCost = (outputTokens / 1_000_000) * outputPrice;
      
      points.push({
        n,
        withoutCaching,
        withCaching,
        outputTokens,
        inputCostWithout,
        inputCostWith,
        outputCost,
        totalCostWithout: inputCostWithout + outputCost,
        totalCostWith: inputCostWith + outputCost,
      });
    }
    return points;
  }, [writePremium, cacheHitRate, cacheReadDiscount, totalStaticTokens, userMessageTokens, assistantMessageTokens, inputPrice, outputPrice]);

  const maxInputTokens = graphData[graphData.length - 1].withoutCaching;
  const maxOutputTokens = graphData[graphData.length - 1].outputTokens;
  const maxTotalCost = graphData[graphData.length - 1].totalCostWithout;

  const currentPoint = graphData[chatLength - 1];

  // Drag handling for graph markers
  const handleDrag = useCallback((e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>, svgElement: SVGSVGElement | null) => {
    if (!svgElement) return;
    
    const rect = svgElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = x / rect.width;
    const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
    setChatLength(newTurn);
  }, []);

  // Create draggable SVG graph component
  const DraggableGraph = ({ 
    data, 
    maxValue, 
    getValueWithout,
    getValueWith,
    color,
    cachedColor,
    title,
    valueWithoutLabel,
    valueWithLabel,
    subtitle,
  }: {
    data: typeof graphData;
    maxValue: number;
    getValueWithout: (point: typeof graphData[0]) => number;
    getValueWith: (point: typeof graphData[0]) => number;
    color: string;
    cachedColor: string;
    title: string;
    valueWithoutLabel: string;
    valueWithLabel: string;
    subtitle?: string;
  }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
      e.preventDefault();
      setIsDragging(true);
      handleDrag(e, svgRef.current);
    };
    
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging) {
        handleDrag(e, svgRef.current);
      }
    };
    
    const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
      setIsDragging(true);
      handleDrag(e, svgRef.current);
    };
    
    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
      if (isDragging) {
        handleDrag(e, svgRef.current);
      }
    };
    
    useEffect(() => {
      const handleMouseUp = () => setIsDragging(false);
      const handleTouchEnd = () => setIsDragging(false);
      
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }, []);

    const currentYWithout = 100 - (getValueWithout(currentPoint) / maxValue) * 100;
    const currentYWith = 100 - (getValueWith(currentPoint) / maxValue) * 100;

    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">
          {title}
        </h4>
        <div className="relative h-40">
          <svg 
            ref={svgRef}
            viewBox="0 0 200 100" 
            className={cn(
              "w-full h-full overflow-visible select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="200"
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Fill area between curves (savings) */}
            <path
              d={`${data
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValueWith(point) / maxValue) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")} ${data
                .slice()
                .reverse()
                .map((point) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValueWithout(point) / maxValue) * 100;
                  return `L ${x} ${y}`;
                })
                .join(" ")} Z`}
              fill={cachedColor}
              fillOpacity="0.15"
              className="pointer-events-none"
            />
            
            {/* Without caching curve (dashed) */}
            <path
              d={data
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValueWithout(point) / maxValue) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="4,4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* With caching curve (solid) */}
            <path
              d={data
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValueWith(point) / maxValue) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              stroke={cachedColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Vertical line at current position */}
            <line
              x1={(chatLength / MAX_TURNS) * 200}
              y1={Math.min(currentYWithout, currentYWith)}
              x2={(chatLength / MAX_TURNS) * 200}
              y2={100}
              stroke={cachedColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="2,2"
              className="pointer-events-none"
            />
            
            {/* Current position markers */}
            <circle
              cx={(chatLength / MAX_TURNS) * 200}
              cy={currentYWithout}
              r={4}
              fill={color}
              className="pointer-events-none"
            />
            <circle
              cx={(chatLength / MAX_TURNS) * 200}
              cy={currentYWith}
              r={isDragging ? 7 : 5}
              fill={cachedColor}
              className={cn(
                "drop-shadow-lg",
                isDragging ? "duration-0" : "duration-150"
              )}
              style={{ filter: isDragging ? `drop-shadow(0 0 8px ${cachedColor})` : undefined }}
            />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` }} />
            <span>No cache</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: cachedColor }} />
            <span>Cached</span>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">No cache:</span>
            <span className="text-sm font-medium tabular-nums" style={{ color }}>{valueWithoutLabel}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Cached:</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: cachedColor }}>{valueWithLabel}</span>
          </div>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Slider Control with Config Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">
              Conversation Length
            </label>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-200",
                isConfigOpen 
                  ? "bg-[var(--highlight)]/20 text-[var(--highlight)]" 
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <svg 
                className={cn("w-3.5 h-3.5 transition-transform duration-300", isConfigOpen && "rotate-90")} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure
            </button>
          </div>
          <span className="text-2xl font-bold text-[var(--highlight)] tabular-nums">
            {chatLength} turns
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={MAX_TURNS}
          value={chatLength}
          onChange={(e) => setChatLength(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--highlight)]
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[var(--highlight)]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-grab"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>{MAX_TURNS}</span>
        </div>
      </div>

      {/* Animated Config Panel */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ 
          maxHeight: isConfigOpen ? configHeight : 0,
          opacity: isConfigOpen ? 1 : 0,
          transform: isConfigOpen ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        <div ref={configRef} className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pricing */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pricing</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Input price ($/M tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={inputPrice}
                    onChange={(e) => setInputPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Output price ($/M tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={outputPrice}
                    onChange={(e) => setOutputPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
              </div>
            </div>
            
            {/* Caching Economics */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Caching <span className="text-emerald-500">(Economics)</span>
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Cache read rate (% of input price)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cacheReadDiscount}
                    onChange={(e) => setCacheReadDiscount(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:cursor-grab"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="text-emerald-500 font-medium">{cacheReadDiscount}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Cache write premium
                  </label>
                  <button
                    onClick={() => setHasWritePremium(!hasWritePremium)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-xs transition-all duration-200 border text-left",
                      hasWritePremium
                        ? "bg-amber-500/10 border-amber-500/30 text-foreground"
                        : "bg-muted border-border text-muted-foreground hover:border-[var(--highlight)]/50"
                    )}
                  >
                    <span className="font-medium">{hasWritePremium ? "25% premium" : "No premium"}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Static Context (Cacheable) */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Static Context <span className="text-emerald-500">(Cacheable)</span>
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    System prompt (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={systemPromptTokens}
                    onChange={(e) => setSystemPromptTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Tools/schemas (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={toolsTokens}
                    onChange={(e) => setToolsTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Reference docs (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={documentsTokens}
                    onChange={(e) => setDocumentsTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
              </div>
            </div>
            
            {/* Conversation (Per-turn additions) */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Per-Turn Messages <span className="text-[var(--highlight)]">(New Each Turn)</span>
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Avg user message (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={userMessageTokens}
                    onChange={(e) => setUserMessageTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Avg assistant message (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={assistantMessageTokens}
                    onChange={(e) => setAssistantMessageTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Cache hit rate (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cacheHitRate}
                    onChange={(e) => setCacheHitRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:cursor-grab"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="text-emerald-500 font-medium">{cacheHitRate}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Graphs Row (matching CostVisualizer but with caching comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DraggableGraph
          data={graphData}
          maxValue={maxInputTokens}
          getValueWithout={(p) => p.withoutCaching}
          getValueWith={(p) => p.withCaching}
          color="#f87171"
          cachedColor="#34d399"
          title="Input Tokens"
          valueWithoutLabel={costs.withoutCaching.inputTokens.toLocaleString()}
          valueWithLabel={costs.withCaching.inputTokens.toLocaleString()}
          subtitle={costs.savingsPercent > 0 ? `${costs.savingsPercent.toFixed(0)}% fewer effective tokens` : undefined}
        />
        
        {/* Output Tokens (same for both) */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Output Tokens (Linear)
          </h4>
          <div className="relative h-40">
            <svg 
              viewBox="0 0 200 100" 
              className="w-full h-full overflow-visible"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="200"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Fill area under curve */}
              <path
                d={`${graphData
                  .map((point, i) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.outputTokens / maxOutputTokens) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")} L 200 100 L ${1/MAX_TURNS * 200} 100 Z`}
                fill="#a78bfa"
                fillOpacity="0.15"
                className="pointer-events-none"
              />
              
              {/* Output curve */}
              <path
                d={graphData
                  .map((point, i) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.outputTokens / maxOutputTokens) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              
              {/* Vertical line */}
              <line
                x1={(chatLength / MAX_TURNS) * 200}
                y1={100 - (currentPoint.outputTokens / maxOutputTokens) * 100}
                x2={(chatLength / MAX_TURNS) * 200}
                y2={100}
                stroke="#a78bfa"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="2,2"
                className="pointer-events-none"
              />
              
              {/* Current position marker */}
              <circle
                cx={(chatLength / MAX_TURNS) * 200}
                cy={100 - (currentPoint.outputTokens / maxOutputTokens) * 100}
                r={5}
                fill="#a78bfa"
                className="drop-shadow-lg pointer-events-none"
              />
            </svg>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-violet-400 tabular-nums">
              {costs.outputTokens.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">tokens</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ~${costs.outputCost.toFixed(4)} at ${outputPrice}/M (same with or without cache)
          </p>
        </div>

        {/* Combined Cost Graph */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Total Cost
          </h4>
          <div className="relative h-40">
            <svg 
              ref={combinedGraphRef}
              viewBox="0 0 200 100" 
              className={cn(
                "w-full h-full overflow-visible select-none",
                isDraggingCombined ? "cursor-grabbing" : "cursor-grab"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setIsDraggingCombined(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
                setChatLength(newTurn);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                setIsDraggingCombined(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const percentage = x / rect.width;
                const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
                setChatLength(newTurn);
              }}
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="200"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Fill area between curves (savings) */}
              <path
                d={`${graphData
                  .map((point, i) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.totalCostWith / maxTotalCost) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")} ${graphData
                  .slice()
                  .reverse()
                  .map((point) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.totalCostWithout / maxTotalCost) * 100;
                    return `L ${x} ${y}`;
                  })
                  .join(" ")} Z`}
                fill="#34d399"
                fillOpacity="0.15"
                className="pointer-events-none"
              />
              
              {/* Without caching curve (dashed) */}
              <path
                d={graphData
                  .map((point, i) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.totalCostWithout / maxTotalCost) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#f472b6"
                strokeWidth="2"
                strokeDasharray="4,4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              
              {/* With caching curve (solid) */}
              <path
                d={graphData
                  .map((point, i) => {
                    const x = (point.n / MAX_TURNS) * 200;
                    const y = 100 - (point.totalCostWith / maxTotalCost) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              
              {/* Vertical line at current position */}
              <line
                x1={(chatLength / MAX_TURNS) * 200}
                y1={100 - (currentPoint.totalCostWith / maxTotalCost) * 100}
                x2={(chatLength / MAX_TURNS) * 200}
                y2={100}
                stroke="#34d399"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeDasharray="3,3"
                className="pointer-events-none"
              />
              
              {/* Current position markers */}
              <circle
                cx={(chatLength / MAX_TURNS) * 200}
                cy={100 - (currentPoint.totalCostWithout / maxTotalCost) * 100}
                r={4}
                fill="#f472b6"
                className="pointer-events-none"
              />
              <circle
                cx={(chatLength / MAX_TURNS) * 200}
                cy={100 - (currentPoint.totalCostWith / maxTotalCost) * 100}
                r={isDraggingCombined ? 7 : 5}
                fill="#34d399"
                className="drop-shadow-lg"
                style={{ 
                  filter: isDraggingCombined ? 'drop-shadow(0 0 8px #34d399)' : undefined,
                  transition: isDraggingCombined ? 'none' : 'all 150ms',
                }}
              />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f472b6 0, #f472b6 4px, transparent 4px, transparent 8px)' }} />
              <span>No cache</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-emerald-400" />
              <span>Cached</span>
            </div>
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">No cache:</span>
              <span className="text-sm font-medium text-pink-400 tabular-nums">${costs.withoutCaching.totalCost.toFixed(4)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Cached:</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">${costs.withCaching.totalCost.toFixed(4)}</span>
            </div>
          </div>
          {costs.totalCostSavingsPercent > 0 && (
            <p className="text-xs text-emerald-500 mt-2 font-medium">
              {costs.totalCostSavingsPercent.toFixed(0)}% total cost savings
            </p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Without Caching */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground">Without Caching</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">Baseline</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-400 tabular-nums">
                ${costs.withoutCaching.totalCost.toFixed(4)}
              </span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {costs.withoutCaching.inputTokens.toLocaleString()} input tokens · {costs.outputTokens.toLocaleString()} output
            </p>
          </div>
        </div>

        {/* With Caching */}
        <div className="bg-card border border-[var(--highlight)]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground">With Caching</h4>
            {costs.totalCostSavingsPercent > 0 && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                {costs.totalCostSavingsPercent.toFixed(0)}% cheaper
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                ${costs.withCaching.totalCost.toFixed(4)}
              </span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">{costs.withCaching.cachedTokens.toLocaleString()} cached</span>
              {" · "}
              <span className="text-[var(--highlight)]">{costs.withCaching.newTokens.toLocaleString()} at full price</span>
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 space-y-3">
        <p className="font-medium text-foreground">Key Insights</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">✓</span>
            <p>
              <strong className="text-foreground">Caching dramatically reduces input cost for long conversations.</strong> With caching, 
              your entire message prefix (including conversation history) is cached. Only the{" "}
              <strong className="text-[var(--highlight)]">new tokens each turn</strong> (~{(userMessageTokens + assistantMessageTokens).toLocaleString()} tokens) 
              are charged at full price, extending the viable conversation horizon.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">✓</span>
            <p>
              <strong className="text-foreground">At {chatLength} turns, caching saves {costs.savingsPercent.toFixed(0)}% on input.</strong> The 
              cacheable prefix grows to ~{costs.currentCacheablePrefix.toLocaleString()} tokens, all charged at just{" "}
              {cacheReadDiscount}% of the normal rate.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">!</span>
            <p>
              <strong className="text-foreground">Cache hits require session continuity.</strong> Caches expire after 5-10 minutes 
              of inactivity. Long pauses between messages lose the cache, falling back to quadratic costs.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-[var(--highlight)] mt-0.5">→</span>
            <p>
              <strong className="text-foreground">Drag the slider or graphs</strong> to see the dramatic difference between the dashed line 
              (no caching) and the solid line (with caching). The shaded area shows your savings.
            </p>
          </div>
        </div>
      </div>

      {/* Token Breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Turn {chatLength} Breakdown</h4>
        
        <div className="space-y-3">
          {/* Cacheable prefix bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Cacheable Prefix (static + previous messages)</span>
              <span className="text-emerald-500 tabular-nums">
                {costs.currentCacheablePrefix.toLocaleString()} tokens @ {cacheReadDiscount}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500/60 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, costs.currentCacheablePrefix / (costs.currentCacheablePrefix + costs.currentNewTokens) * 100)}%` 
                }}
              />
            </div>
          </div>
          
          {/* New tokens bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">New Tokens This Turn (user + assistant)</span>
              <span className="text-[var(--highlight)] tabular-nums">
                {costs.currentNewTokens.toLocaleString()} tokens @ 100%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--highlight)]/60 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, costs.currentNewTokens / (costs.currentCacheablePrefix + costs.currentNewTokens) * 100)}%` 
                }}
              />
            </div>
          </div>
          
          {/* Output bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Output Tokens</span>
              <span className="text-violet-400 tabular-nums">
                {assistantMessageTokens.toLocaleString()} tokens
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500/60 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, assistantMessageTokens / (costs.currentCacheablePrefix + costs.currentNewTokens + assistantMessageTokens) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          With caching, the <span className="text-emerald-500">growing prefix</span> ({costs.currentCacheablePrefix.toLocaleString()} tokens) 
          costs only {cacheReadDiscount}% per token. Only ~{costs.currentNewTokens.toLocaleString()} new tokens per turn are charged at full price—this is why 
          the cached line grows much slower than the uncached line.
        </p>
      </div>
    </div>
  );
}
