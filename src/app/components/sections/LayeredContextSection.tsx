"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  GripVertical, 
  Trash2, 
  Zap, 
  Lock, 
  Database, 
  MessageSquare, 
  User,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

// =============================================================================
// Layer Builder Visualization
// =============================================================================

interface ContextLayer {
  id: string;
  name: string;
  description: string;
  content: string;
  tokens: number;
  volatility: "static" | "semi-static" | "dynamic" | "variable";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isCustom?: boolean;
}

const defaultLayers: ContextLayer[] = [
  {
    id: "system",
    name: "System Prompt",
    description: "Identity, role, core behaviors",
    content: "You are an expert TypeScript developer. Always use strict typing...",
    tokens: 200,
    volatility: "static",
    icon: Lock,
    color: "cyan",
  },
  {
    id: "tools",
    name: "Tool Schemas",
    description: "Available functions and their signatures",
    content: '[{"name": "readFile", "params": {...}}, {"name": "writeFile"...}]',
    tokens: 500,
    volatility: "static",
    icon: Zap,
    color: "violet",
  },
  {
    id: "examples",
    name: "Few-shot Examples",
    description: "Demonstrations of expected behavior",
    content: "Example 1: User asks... Assistant responds...",
    tokens: 300,
    volatility: "semi-static",
    icon: Database,
    color: "amber",
  },
  {
    id: "docs",
    name: "Retrieved Context",
    description: "RAG results, relevant documentation",
    content: "From docs: useEffect cleanup runs when component unmounts...",
    tokens: 800,
    volatility: "dynamic",
    icon: Database,
    color: "emerald",
  },
  {
    id: "realtime",
    name: "Real-time Data",
    description: "Current time, live state, session variables",
    content: `Current time: ${new Date().toISOString()}, user_timezone: "America/New_York", session_id: "abc123"`,
    tokens: 50,
    volatility: "variable",
    icon: Clock,
    color: "pink",
  },
  {
    id: "history",
    name: "Conversation History",
    description: "Recent messages (summarized if needed)",
    content: "Previous discussion about React hooks and state management...",
    tokens: 400,
    volatility: "dynamic",
    icon: MessageSquare,
    color: "rose",
  },
  {
    id: "user",
    name: "Current Request",
    description: "The user's current message",
    content: "How do I properly clean up a useEffect subscription?",
    tokens: 30,
    volatility: "variable",
    icon: User,
    color: "sky",
  },
];

function LayerBuilder() {
  const [layers, setLayers] = useState<ContextLayer[]>(defaultLayers);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  const volatilityColors: Record<ContextLayer["volatility"], { bg: string; border: string; text: string; label: string }> = {
    static: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", label: "Static" },
    "semi-static": { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", label: "Semi-static" },
    dynamic: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", label: "Dynamic" },
    variable: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", label: "Variable" },
  };
  
  const totalTokens = layers.reduce((sum, l) => sum + l.tokens, 0);
  
  // Calculate cache efficiency
  const cacheAnalysis = useMemo(() => {
    let staticTokens = 0;
    let cacheBreakIndex = -1;
    
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].volatility === "static" || layers[i].volatility === "semi-static") {
        staticTokens += layers[i].tokens;
      } else {
        cacheBreakIndex = i;
        break;
      }
    }
    
    // Check if ordering is optimal (static before dynamic)
    let isOptimal = true;
    let seenDynamic = false;
    for (const layer of layers) {
      if (layer.volatility === "dynamic" || layer.volatility === "variable") {
        seenDynamic = true;
      } else if (seenDynamic && (layer.volatility === "static" || layer.volatility === "semi-static")) {
        isOptimal = false;
        break;
      }
    }
    
    return {
      staticTokens,
      cacheBreakIndex,
      isOptimal,
      cacheRatio: totalTokens > 0 ? (staticTokens / totalTokens * 100).toFixed(1) : 0,
    };
  }, [layers, totalTokens]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const draggedIndex = layers.findIndex(l => l.id === draggedId);
      const targetIndex = layers.findIndex(l => l.id === targetId);
      
      const newLayers = [...layers];
      const [removed] = newLayers.splice(draggedIndex, 1);
      newLayers.splice(targetIndex, 0, removed);
      setLayers(newLayers);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const resetLayers = () => {
    setLayers(defaultLayers);
    setExpandedLayer(null);
  };

  return (
    <div className="space-y-4">
        {/* Stats bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="font-medium text-foreground">{totalTokens} tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cacheable:</span>{" "}
              <span className={cn("font-medium", Number(cacheAnalysis.cacheRatio) > 50 ? "text-emerald-400" : "text-amber-400")}>
                {cacheAnalysis.cacheRatio}%
              </span>
            </div>
            <div className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              cacheAnalysis.isOptimal ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
            )}>
              {cacheAnalysis.isOptimal ? "✓ Optimal order" : "⚠ Suboptimal order"}
            </div>
          </div>
          <button
            onClick={resetLayers}
            className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:bg-muted transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Layer list */}
        <div className="space-y-2">
          {layers.map((layer, index) => {
            const colors = volatilityColors[layer.volatility];
            const Icon = layer.icon;
            const isCached = index < (cacheAnalysis.cacheBreakIndex === -1 ? layers.length : cacheAnalysis.cacheBreakIndex);
            const isExpanded = expandedLayer === layer.id;

            return (
              <div
                key={layer.id}
                draggable
                onDragStart={() => handleDragStart(layer.id)}
                onDragOver={(e) => handleDragOver(e, layer.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "rounded-lg border transition-all",
                  colors.bg,
                  colors.border,
                  draggedId === layer.id && "opacity-50 scale-95"
                )}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Icon */}
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
                    <Icon className={cn("w-4 h-4", colors.text)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{layer.name}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded", colors.bg, colors.text)}>
                        {colors.label}
                      </span>
                      {isCached && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          CACHED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {layer.description} • {layer.tokens} tokens
                    </p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                    className="p-1.5 rounded hover:bg-muted/50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {layer.isCustom && (
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="p-1.5 rounded hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="p-3 rounded-lg bg-background/50 border border-border/50 text-xs font-mono text-muted-foreground">
                      {layer.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cache boundary visualization */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-2">Context Structure</div>
          <div className="h-6 rounded-full overflow-hidden flex">
            {layers.map((layer) => {
              const width = (layer.tokens / totalTokens) * 100;
              const colors = {
                static: "bg-cyan-500",
                "semi-static": "bg-amber-500",
                dynamic: "bg-emerald-500",
                variable: "bg-rose-500",
              };
              return (
                <div
                  key={layer.id}
                  className={cn(
                    colors[layer.volatility],
                    "transition-all duration-300 relative group"
                  )}
                  style={{ width: `${width}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-popover border border-border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {layer.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>← Cacheable prefix</span>
            <span>Variable suffix →</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground text-center">
          💡 Drag layers to reorder them. Static content should come before dynamic content for optimal caching.
        </p>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function LayeredContextSection() {
  return (
    <section id="layered-context" className="scroll-mt-20">
      <SectionHeading
        id="layered-context-heading"
        title="Layered Context Architecture"
        subtitle="System prompts, layers, and optimal ordering"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The layered context architecture is a practical framework for organizing context from 
          <strong className="text-foreground"> stable system prompts to variable user messages</strong>. 
          This ordering isn&apos;t arbitrary—it simultaneously optimizes for cache efficiency and attention allocation.
        </p>

        <Callout variant="tip" title="The Core Principle">
          <p>
            Order context by <strong>volatility</strong>: stable content first, variable content last. 
            This maximizes the cacheable prefix while ensuring the most recent content (which gets 
            strong attention) is the current request.
          </p>
        </Callout>

        {/* The Five Layers */}
        <h3 id="layer-overview" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          The Five Layers
        </h3>

        <p className="text-muted-foreground">
          A well-structured context typically has five distinct layers, ordered from most stable 
          to most variable:
        </p>

        <div className="space-y-3 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-cyan-400 mb-1">Layer 1: System Identity</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Role definition, core behaviors, safety constraints. Changes almost never—perfect 
                    cache candidate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-violet-400 mb-1">Layer 2: Capabilities</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Tool schemas, function definitions, structured output formats. Changes when 
                    you update tools—still mostly stable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-400 mb-1">Layer 3: Domain Knowledge</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Few-shot examples, reference documentation, guidelines. Updated occasionally 
                    when you improve your prompts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-400 mb-1">Layer 4: Session State</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Conversation history, retrieved documents, session-specific context. Changes 
                    within a session but not between calls.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-medium text-rose-400 mb-1">Layer 5: Current Request</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    The user&apos;s message this instant. Changes every call—always at the end.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Layer Builder */}
        <h3 id="layer-builder" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Interactive: Layer Builder
        </h3>

        <p className="text-muted-foreground mb-4">
          Experiment with layer ordering below. Drag layers to rearrange them and see how it 
          affects cache efficiency. Notice how putting variable content before static content 
          breaks the cache for everything after it.
        </p>

        <InteractiveWrapper
          title="Interactive: Context Layer Builder"
          description="Drag to reorder layers and see the impact on caching"
          icon="🏗️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <LayerBuilder />
        </InteractiveWrapper>

        {/* System Prompts */}
        <h3 id="system-prompts" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          System Prompts
        </h3>

        <p className="text-muted-foreground">
          The system prompt is your Layer 1—the foundation of your context. It sets the model&apos;s 
          <strong className="text-foreground"> identity, constraints, and core behaviors</strong>.
        </p>

        <p className="text-muted-foreground">
          A well-structured system prompt sets the model&apos;s identity, constraints, and core behaviors. 
          It should be stable and complete—if you find yourself constantly tweaking it, extract the 
          variable parts into later layers or session-specific context. The system prompt is static 
          and never changes between requests, making it perfect for the cacheable prefix.
        </p>

        <Callout variant="important">
          <p>
            System prompts should be <strong>stable and complete</strong>. If you find yourself 
            constantly tweaking the system prompt, extract the variable parts into later layers 
            or session-specific context.
          </p>
        </Callout>

        {/* Static vs Dynamic */}
        <h3 id="static-vs-dynamic" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Static vs Dynamic Content
        </h3>

        <p className="text-muted-foreground">
          Understanding what&apos;s static vs. dynamic helps you maximize cache efficiency:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">Static (Cache-Friendly)</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>System prompt</li>
                <li>Tool/function schemas</li>
                <li>Standard examples</li>
                <li>Reference documentation</li>
                <li>Project conventions</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Dynamic (Per-Request)</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>RAG-retrieved documents</li>
                <li>Conversation history</li>
                <li>Current code being edited</li>
                <li>User preferences</li>
                <li>Current error messages</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Ordering for Cache */}
        <h3 id="ordering-for-cache" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Ordering for Cache Efficiency
        </h3>

        <p className="text-muted-foreground">
          The golden rule: <strong className="text-foreground">static content first, variable content last</strong>. 
          This ensures maximum cache reuse across requests. Build your context with: system prompt (static), 
          tool schemas (static), examples (semi-static), retrieved docs (dynamic), conversation (dynamic), 
          and user message (variable).
        </p>

        <p className="text-muted-foreground">
          With a 2,500 token static prefix and 500 token dynamic suffix, you can achieve significant cost 
          reduction. Without cache: 3,000 tokens at full price. With cache: 250 tokens (cached) + 500 tokens 
          (fresh) = 83% cost reduction!
        </p>

        <Callout variant="tip" title="Attention Benefits Too">
          <p>
            This ordering also optimizes for the &quot;Lost in the Middle&quot; effect. Your critical 
            instructions are at the <strong>start</strong> (primacy effect), and the current 
            request is at the <strong>end</strong> (recency effect)—both high-attention positions.
          </p>
        </Callout>
      </div>
    </section>
  );
}
