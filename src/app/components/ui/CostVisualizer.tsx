"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CostVisualizerProps {
  className?: string;
}

const MAX_TURNS = 40;

export function CostVisualizer({ className }: CostVisualizerProps) {
  const [chatLength, setChatLength] = useState(10);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCombined, setIsDraggingCombined] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);
  const combinedGraphRef = useRef<SVGSVGElement>(null);
  const [configHeight, setConfigHeight] = useState(0);
  
  // Settings (always active now)
  const [inputPrice, setInputPrice] = useState(1.75); // $/M tokens
  const [outputPrice, setOutputPrice] = useState(14); // $/M tokens
  const [systemPromptTokens, setSystemPromptTokens] = useState(500);
  const [userMessageTokens, setUserMessageTokens] = useState(100);
  const [assistantMessageTokens, setAssistantMessageTokens] = useState(200);

  // Measure config panel height for animation
  useEffect(() => {
    if (configRef.current) {
      setConfigHeight(configRef.current.scrollHeight);
    }
  }, [inputPrice, outputPrice, systemPromptTokens, userMessageTokens, assistantMessageTokens]);

  // Global drag handlers specifically for the combined graph
  useEffect(() => {
    if (!isDraggingCombined) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!combinedGraphRef.current) return;
      const rect = combinedGraphRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTurn = Math.max(1, Math.min(MAX_TURNS, Math.round(percentage * MAX_TURNS)));
      setChatLength(newTurn);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!combinedGraphRef.current) return;
      const rect = combinedGraphRef.current.getBoundingClientRect();
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

  // Calculate costs based on the chat length and settings
  const costs = useMemo(() => {
    // For naive chat: each turn sends system prompt + all previous messages + new user message
    let totalInputTokens = 0;
    for (let turn = 1; turn <= chatLength; turn++) {
      const systemCost = systemPromptTokens;
      const userCost = turn * userMessageTokens;
      const assistantCost = (turn - 1) * assistantMessageTokens;
      totalInputTokens += systemCost + userCost + assistantCost;
    }
    
    const totalOutputTokens = chatLength * assistantMessageTokens;
    
    const inputCost = (totalInputTokens / 1_000_000) * inputPrice;
    const outputCost = (totalOutputTokens / 1_000_000) * outputPrice;
    
    return {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
    };
  }, [chatLength, inputPrice, outputPrice, systemPromptTokens, userMessageTokens, assistantMessageTokens]);

  // Generate data points for the graphs
  const graphData = useMemo(() => {
    const points = [];
    for (let n = 1; n <= MAX_TURNS; n++) {
      let inputTokens = 0;
      for (let turn = 1; turn <= n; turn++) {
        inputTokens += systemPromptTokens + (turn * userMessageTokens) + ((turn - 1) * assistantMessageTokens);
      }
      const outputTokens = n * assistantMessageTokens;
      const inputCost = (inputTokens / 1_000_000) * inputPrice;
      const outputCost = (outputTokens / 1_000_000) * outputPrice;
      
      points.push({
        n,
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
      });
    }
    return points;
  }, [inputPrice, outputPrice, systemPromptTokens, userMessageTokens, assistantMessageTokens]);

  const maxInputTokens = graphData[graphData.length - 1].inputTokens;
  const maxOutputTokens = graphData[graphData.length - 1].outputTokens;
  const maxTotalCost = graphData[graphData.length - 1].totalCost;

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
    getValue,
    color,
    title,
    valueLabel,
    costLabel,
  }: {
    data: typeof graphData;
    maxValue: number;
    getValue: (point: typeof graphData[0]) => number;
    color: string;
    title: string;
    valueLabel: string;
    costLabel: string;
    currentValue: number;
    currentCost: number;
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

    const currentY = 100 - (getValue(currentPoint) / maxValue) * 100;

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
              "w-full h-full overflow-visible",
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
            
            {/* Curve */}
            <path
              d={data
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValue(point) / maxValue) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Fill area under curve */}
            <path
              d={`${data
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (getValue(point) / maxValue) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")} L 200 100 L ${1/MAX_TURNS * 200} 100 Z`}
              fill={color}
              fillOpacity="0.15"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Vertical line at current position */}
            <line
              x1={(chatLength / MAX_TURNS) * 200}
              y1={currentY}
              x2={(chatLength / MAX_TURNS) * 200}
              y2={100}
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="2,2"
              className="pointer-events-none"
            />
            
            {/* Current position marker */}
            <circle
              cx={(chatLength / MAX_TURNS) * 200}
              cy={currentY}
              r={isDragging ? 8 : 6}
              fill={color}
              className={cn(
                "drop-shadow-lg transition-all",
                isDragging ? "duration-0" : "duration-150"
              )}
              style={{ filter: isDragging ? `drop-shadow(0 0 8px ${color})` : undefined }}
            />
          </svg>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span 
            className="text-2xl font-bold tabular-nums transition-all duration-200"
            style={{ color }}
          >
            {valueLabel}
          </span>
          <span className="text-sm text-muted-foreground">tokens</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {costLabel}
        </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            
            {/* Token Sizes */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message Sizes</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    System prompt (tokens)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={systemPromptTokens}
                    onChange={(e) => setSystemPromptTokens(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm 
                      focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)]
                      tabular-nums"
                  />
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Graphs in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DraggableGraph
          data={graphData}
          maxValue={maxInputTokens}
          getValue={(p) => p.inputTokens}
          color="var(--highlight)"
          title="Input Tokens (Quadratic)"
          valueLabel={costs.inputTokens.toLocaleString()}
          costLabel={`~$${costs.inputCost.toFixed(4)} at $${inputPrice}/M`}
          currentValue={costs.inputTokens}
          currentCost={costs.inputCost}
        />
        <DraggableGraph
          data={graphData}
          maxValue={maxOutputTokens}
          getValue={(p) => p.outputTokens}
          color="#a78bfa"
          title="Output Tokens (Linear)"
          valueLabel={costs.outputTokens.toLocaleString()}
          costLabel={`~$${costs.outputCost.toFixed(4)} at $${outputPrice}/M`}
          currentValue={costs.outputTokens}
          currentCost={costs.outputCost}
        />

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
            
            {/* Stacked area - Output (bottom) */}
            <path
              d={`${graphData
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (point.outputCost / maxTotalCost) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")} L 200 100 L ${1/MAX_TURNS * 200} 100 Z`}
              fill="#a78bfa"
              fillOpacity="0.3"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Stacked area - Input (on top of output) */}
            <path
              d={`${graphData
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const yTop = 100 - (point.totalCost / maxTotalCost) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${yTop}`;
                })
                .join(" ")} ${graphData
                .slice()
                .reverse()
                .map((point) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (point.outputCost / maxTotalCost) * 100;
                  return `L ${x} ${y}`;
                })
                .join(" ")} Z`}
              fill="var(--highlight)"
              fillOpacity="0.3"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Total cost line */}
            <path
              d={graphData
                .map((point, i) => {
                  const x = (point.n / MAX_TURNS) * 200;
                  const y = 100 - (point.totalCost / maxTotalCost) * 100;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#f472b6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 pointer-events-none"
            />
            
            {/* Vertical line at current position */}
            <line
              x1={(chatLength / MAX_TURNS) * 200}
              y1={100 - (currentPoint.totalCost / maxTotalCost) * 100}
              x2={(chatLength / MAX_TURNS) * 200}
              y2={100}
              stroke="#f472b6"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeDasharray="3,3"
              className="pointer-events-none"
            />
            
            {/* Current position marker */}
            <circle
              cx={(chatLength / MAX_TURNS) * 200}
              cy={100 - (currentPoint.totalCost / maxTotalCost) * 100}
              r={isDraggingCombined ? 8 : 6}
              fill="#f472b6"
              className="drop-shadow-lg"
              style={{ 
                filter: isDraggingCombined ? 'drop-shadow(0 0 8px #f472b6)' : undefined,
                transition: isDraggingCombined ? 'none' : 'all 150ms',
              }}
            />
          </svg>
        </div>
        
          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--highlight)]" />
              <span className="text-xs text-muted-foreground">Input</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-xs text-muted-foreground">Output</span>
            </div>
          </div>
          
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-pink-400 tabular-nums">
              ${costs.totalCost.toFixed(4)}
            </span>
            <span className="text-sm text-muted-foreground">total</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {costs.totalCost > 0 ? ((costs.inputCost / costs.totalCost) * 100).toFixed(0) : 0}% input · {costs.totalCost > 0 ? ((costs.outputCost / costs.totalCost) * 100).toFixed(0) : 0}% output
          </p>
        </div>
      </div>

      {/* Mathematical Explanation */}
      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 space-y-2">
        <p className="font-medium text-foreground">Why does input grow quadratically?</p>
        <p>
          With naive chat history, each turn resends the system prompt plus <em>all</em> previous messages.
          With your settings ({systemPromptTokens} system + {userMessageTokens} user + {assistantMessageTokens} assistant tokens), 
          after {chatLength} turns you&apos;ve sent <strong className="text-[var(--highlight)]">{costs.inputTokens.toLocaleString()} input tokens</strong>.
        </p>
        <p className="font-mono text-xs text-muted-foreground/80">
          Each turn k costs: system + k×user + (k-1)×assistant tokens as input
        </p>
      </div>
    </div>
  );
}
