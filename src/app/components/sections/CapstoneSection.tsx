"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  BookOpen,
  Sparkles,
  Database,
  Shield,
  Users,
  MessageSquare,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Play,
  RotateCcw,
  Layers,
  GitBranch,
  Settings,
  Search,
  Lock,
  RefreshCw,
  Bot,
} from "lucide-react";

// =============================================================================
// Virtual Tabletop Architecture Visualization
// =============================================================================

interface ArchitectureNode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  concepts: string[];
  layer: "ingestion" | "storage" | "agents" | "control";
}

const architectureNodes: ArchitectureNode[] = [
  // Ingestion Layer
  {
    id: "pdf-parser",
    name: "PDF Parser",
    description: "Extract rules, monsters, spells from any rulebook system",
    icon: BookOpen,
    color: "cyan",
    concepts: ["Chunking Strategies", "Document Preprocessing"],
    layer: "ingestion",
  },
  {
    id: "schema-generator",
    name: "Schema Generator",
    description: "Dynamically create schemas for stat blocks, rules, entities",
    icon: GitBranch,
    color: "violet",
    concepts: ["Structured Outputs", "Dynamic Schema", "Zod"],
    layer: "ingestion",
  },
  // Storage Layer
  {
    id: "vector-store",
    name: "Vector Store (pgvector)",
    description: "Embeddings + SQL queries for rules, monsters, sessions",
    icon: Database,
    color: "emerald",
    concepts: ["Embeddings", "RAG", "Vector Databases", "Hybrid Search"],
    layer: "storage",
  },
  {
    id: "entity-store",
    name: "Entity Database",
    description: "Structured storage for creatures, spells, items, NPCs",
    icon: Layers,
    color: "amber",
    concepts: ["Data Structuring", "Ontology", "Relational Data"],
    layer: "storage",
  },
  // Agent Layer
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    description: "Routes requests to specialized handlers",
    icon: Sparkles,
    color: "violet",
    concepts: ["Model Routing", "Orchestration Patterns", "Task Decomposition"],
    layer: "agents",
  },
  {
    id: "rules-agent",
    name: "Rules Agent",
    description: "Answers questions about game mechanics",
    icon: BookOpen,
    color: "amber",
    concepts: ["RAG Fundamentals", "Context Engineering", "Structured Outputs"],
    layer: "agents",
  },
  {
    id: "monster-agent",
    name: "Creature Agent",
    description: "Retrieves and formats creature stat blocks",
    icon: Zap,
    color: "rose",
    concepts: ["Skills", "Dynamic Schema", "Parallel Processing"],
    layer: "agents",
  },
  {
    id: "dm-agent",
    name: "GM Assistant",
    description: "Generates encounters, NPCs, plot hooks, tactics",
    icon: Users,
    color: "sky",
    concepts: ["Agentic Loop", "Creative Generation", "Human-in-Loop"],
    layer: "agents",
  },
  {
    id: "session-manager",
    name: "Session Manager",
    description: "Tracks game state, player actions, campaign history",
    icon: MessageSquare,
    color: "pink",
    concepts: ["Context Lifecycle", "Episodic Summarization", "Evolving Context"],
    layer: "agents",
  },
  // Control Layer
  {
    id: "guardrails",
    name: "Permission System",
    description: "GM-only tools, player content filtering, spoiler protection",
    icon: Shield,
    color: "orange",
    concepts: ["Guardrails", "RBAC", "External Control"],
    layer: "control",
  },
];

function ArchitectureVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const layers = [
    { id: "ingestion", label: "Ingestion Layer", color: "cyan" },
    { id: "storage", label: "Storage Layer", color: "emerald" },
    { id: "agents", label: "Agent Layer", color: "violet" },
    { id: "control", label: "Control Layer", color: "orange" },
  ];

  const selected = selectedNode ? architectureNodes.find(n => n.id === selectedNode) : null;

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
    sky: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
  };

  return (
    <div className="space-y-6">
      {/* Layer Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveLayer(null)}
          className={cn(
            "px-3 py-1.5 rounded text-xs transition-all",
            !activeLayer ? "bg-foreground/10 text-foreground" : "bg-muted/30 text-muted-foreground hover:text-foreground"
          )}
        >
          All Layers
        </button>
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            className={cn(
              "px-3 py-1.5 rounded text-xs transition-all",
              activeLayer === layer.id
                ? `${colorClasses[layer.color].bg} ${colorClasses[layer.color].text}`
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Architecture grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {architectureNodes
          .filter(node => !activeLayer || node.layer === activeLayer)
          .map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            const colors = colorClasses[node.color];

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  colors.bg,
                  isSelected ? `${colors.border} ring-2 ring-offset-2 ring-offset-background` : colors.border
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn("w-4 h-4", colors.text)} />
                  <span className={cn("text-xs font-medium", colors.text)}>{node.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{node.description}</p>
              </button>
            );
          })}
      </div>

      {/* Selected node detail */}
      {selected && (
        <div className={cn(
          "p-4 rounded-lg border animate-in fade-in slide-in-from-top-2",
          colorClasses[selected.color].bg,
          colorClasses[selected.color].border
        )}>
          <h4 className="font-medium text-foreground mb-2">{selected.name}</h4>
          <p className="text-sm text-muted-foreground mb-3">{selected.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Related concepts:</span>
            {selected.concepts.map((concept, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Query Flow Demo
// =============================================================================

function QueryFlowDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const flows = [
    {
      name: "Player Rules Query",
      query: "How does grappling work in 5e?",
      steps: [
        { agent: "Orchestrator", action: "Classifies as rules question", color: "violet" },
        { agent: "Rules Agent", action: "Searches vector store for 'grappling'", color: "amber" },
        { agent: "Vector Store", action: "Returns relevant rule chunks", color: "emerald" },
        { agent: "Rules Agent", action: "Synthesizes answer with citations", color: "amber" },
        { agent: "Orchestrator", action: "Returns formatted response", color: "violet" },
      ],
    },
    {
      name: "GM Creature Lookup",
      query: "What are the stats for a Beholder?",
      steps: [
        { agent: "Orchestrator", action: "Classifies as creature lookup", color: "violet" },
        { agent: "Permission Check", action: "Verifies GM role (creature stats hidden from players)", color: "orange" },
        { agent: "Creature Agent", action: "Queries entity database", color: "rose" },
        { agent: "Entity DB", action: "Returns structured stat block", color: "emerald" },
        { agent: "Creature Agent", action: "Formats with dynamic schema", color: "rose" },
        { agent: "Orchestrator", action: "Returns stat block to GM only", color: "violet" },
      ],
    },
    {
      name: "Tactical Advice",
      query: "How should these 3 trolls fight the party?",
      steps: [
        { agent: "Orchestrator", action: "Classifies as tactical advice + creature lookup", color: "violet" },
        { agent: "Permission Check", action: "Verifies GM role", color: "orange" },
        { agent: "Creature Agent", action: "Parallel lookup: 3x troll stats", color: "rose" },
        { agent: "Session Manager", action: "Retrieves party composition from session", color: "pink" },
        { agent: "GM Assistant", action: "Generates tactical recommendations", color: "sky" },
        { agent: "Human-in-Loop", action: "GM reviews before applying", color: "orange" },
      ],
    },
  ];

  const [selectedFlow, setSelectedFlow] = useState(0);
  const flow = flows[selectedFlow];

  const runFlow = () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    const advanceStep = (step: number) => {
      if (step < flow.steps.length) {
        setCurrentStep(step);
        setTimeout(() => advanceStep(step + 1), 1200);
      } else {
        setIsRunning(false);
      }
    };
    
    advanceStep(0);
  };

  const colorClasses: Record<string, string> = {
    violet: "bg-violet-500/20 text-violet-400 border-violet-500/40",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    sky: "bg-sky-500/20 text-sky-400 border-sky-500/40",
    pink: "bg-pink-500/20 text-pink-400 border-pink-500/40",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  };

  return (
    <div className="space-y-4">
      {/* Flow Selector */}
      <div className="flex flex-wrap gap-2">
        {flows.map((f, i) => (
          <button
            key={i}
            onClick={() => { setSelectedFlow(i); setCurrentStep(0); setIsRunning(false); }}
            disabled={isRunning}
            className={cn(
              "px-3 py-1.5 rounded text-xs transition-all",
              selectedFlow === i
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-muted/30 text-muted-foreground hover:text-foreground",
              isRunning && "opacity-50 cursor-not-allowed"
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Query Display */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border">
        <div className="text-xs text-muted-foreground mb-1">Query:</div>
        <div className="text-sm font-medium text-foreground">&quot;{flow.query}&quot;</div>
      </div>

      {/* Flow Steps */}
      <div className="space-y-2">
        {flow.steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all",
              i <= currentStep && isRunning
                ? colorClasses[step.color]
                : i < currentStep
                ? "bg-muted/20 border-border opacity-60"
                : "bg-muted/10 border-border/50 opacity-30"
            )}
          >
            <div className="w-20 text-xs font-medium">{step.agent}</div>
            <ArrowRight className="w-3 h-3 shrink-0" />
            <div className="text-xs flex-1">{step.action}</div>
            {i < currentStep && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {i === currentStep && isRunning && <RefreshCw className="w-4 h-4 animate-spin" />}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={runFlow}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          Run Flow
        </button>
        <button
          onClick={() => { setCurrentStep(0); setIsRunning(false); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Enhanced Cost Architecture Calculator
// =============================================================================

interface QueryType {
  id: string;
  name: string;
  description: string;
  avgContextTokens: number;
  avgOutputTokens: number;
  modelTier: "router" | "standard" | "reasoning";
  cacheablePercent: number;
  color: string;
}

function EnhancedCostCalculator() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Monthly query volume
  const [monthlyQueries, setMonthlyQueries] = useState(10000);
  
  // Query distribution (percentages that sum to 100)
  const [rulesQueriesPercent, setRulesQueriesPercent] = useState(50);
  const [creatureLookupPercent, setCreatureLookupPercent] = useState(30);
  const [tacticalPercent, setTacticalPercent] = useState(15);
  const sessionPercent = 100 - rulesQueriesPercent - creatureLookupPercent - tacticalPercent;
  
  // Model pricing ($/M tokens)
  const [routerInputPrice, setRouterInputPrice] = useState(0.15);
  const [routerOutputPrice, setRouterOutputPrice] = useState(0.60);
  const [standardInputPrice, setStandardInputPrice] = useState(3.00);
  const [standardOutputPrice, setStandardOutputPrice] = useState(15.00);
  const [reasoningInputPrice, setReasoningInputPrice] = useState(15.00);
  const [reasoningOutputPrice, setReasoningOutputPrice] = useState(60.00);
  
  // Caching settings
  const [cacheReadDiscount, setCacheReadDiscount] = useState(10); // 10% of normal price
  const [globalCacheHitRate, setGlobalCacheHitRate] = useState(70);
  
  // Query type configurations
  const queryTypes: QueryType[] = [
    {
      id: "rules",
      name: "Rules Queries",
      description: "How does grappling work?",
      avgContextTokens: 4000,
      avgOutputTokens: 400,
      modelTier: "standard",
      cacheablePercent: 80,
      color: "amber",
    },
    {
      id: "creature",
      name: "Creature Lookups",
      description: "What are the stats for a Troll?",
      avgContextTokens: 2000,
      avgOutputTokens: 600,
      modelTier: "standard",
      cacheablePercent: 90,
      color: "rose",
    },
    {
      id: "tactical",
      name: "Tactical Advice",
      description: "How should these trolls fight the party?",
      avgContextTokens: 8000,
      avgOutputTokens: 1200,
      modelTier: "reasoning",
      cacheablePercent: 40,
      color: "sky",
    },
    {
      id: "session",
      name: "Session Queries",
      description: "What happened last session?",
      avgContextTokens: 6000,
      avgOutputTokens: 800,
      modelTier: "standard",
      cacheablePercent: 60,
      color: "pink",
    },
  ];
  
  // Calculate costs for each query type
  const calculateQueryTypeCost = (
    queryType: QueryType,
    queryCount: number,
    cacheHitRate: number
  ) => {
    const prices = {
      router: { input: routerInputPrice, output: routerOutputPrice },
      standard: { input: standardInputPrice, output: standardOutputPrice },
      reasoning: { input: reasoningInputPrice, output: reasoningOutputPrice },
    };
    
    const modelPrices = prices[queryType.modelTier];
    const cachedPrice = modelPrices.input * (cacheReadDiscount / 100);
    
    // Router cost (all queries go through router)
    const routerTokens = queryCount * 200;
    const routerCost = (routerTokens / 1_000_000) * (prices.router.input + prices.router.output);
    
    // Input tokens
    const totalInputTokens = queryCount * queryType.avgContextTokens;
    const cachedInputTokens = totalInputTokens * (queryType.cacheablePercent / 100) * (cacheHitRate / 100);
    const freshInputTokens = totalInputTokens - cachedInputTokens;
    
    const freshInputCost = (freshInputTokens / 1_000_000) * modelPrices.input;
    const cachedInputCost = (cachedInputTokens / 1_000_000) * cachedPrice;
    
    // Output tokens
    const totalOutputTokens = queryCount * queryType.avgOutputTokens;
    const outputCost = (totalOutputTokens / 1_000_000) * modelPrices.output;
    
    return {
      queryCount,
      routerCost,
      inputCost: freshInputCost + cachedInputCost,
      outputCost,
      totalCost: routerCost + freshInputCost + cachedInputCost + outputCost,
      totalTokens: totalInputTokens + totalOutputTokens,
      cachedTokens: cachedInputTokens,
    };
  };
  
  // Calculate costs for all query types
  const queryDistribution = [rulesQueriesPercent, creatureLookupPercent, tacticalPercent, sessionPercent];
  const costBreakdown = queryTypes.map((qt, i) => {
    const queryCount = Math.round(monthlyQueries * (queryDistribution[i] / 100));
    return {
      ...qt,
      ...calculateQueryTypeCost(qt, queryCount, globalCacheHitRate),
    };
  });
  
  const totalCost = costBreakdown.reduce((sum, cb) => sum + cb.totalCost, 0);
  const totalTokens = costBreakdown.reduce((sum, cb) => sum + cb.totalTokens, 0);
  const totalCachedTokens = costBreakdown.reduce((sum, cb) => sum + cb.cachedTokens, 0);
  
  // Calculate baseline (everything to reasoning model, no caching)
  const baselineCost = costBreakdown.reduce((sum, cb) => {
    const routerTokens = cb.queryCount * 200;
    const routerCost = (routerTokens / 1_000_000) * (routerInputPrice + routerOutputPrice);
    const inputCost = (cb.queryCount * queryTypes.find(qt => qt.id === cb.id)!.avgContextTokens / 1_000_000) * reasoningInputPrice;
    const outputCost = (cb.queryCount * queryTypes.find(qt => qt.id === cb.id)!.avgOutputTokens / 1_000_000) * reasoningOutputPrice;
    return sum + routerCost + inputCost + outputCost;
  }, 0);
  
  const savingsPercent = baselineCost > 0 ? ((baselineCost - totalCost) / baselineCost) * 100 : 0;
  const maxCost = Math.max(...costBreakdown.map(cb => cb.totalCost), 0.01);
  
  const colorClasses: Record<string, { bg: string; border: string; text: string; bar: string }> = {
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-500" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", bar: "bg-rose-500" },
    sky: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-400", bar: "bg-sky-500" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", bar: "bg-pink-500" },
  };

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">
              Monthly Queries
          </label>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-200",
                isConfigOpen 
                  ? "bg-cyan-500/20 text-cyan-400" 
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <Settings className={cn("w-3.5 h-3.5 transition-transform duration-300", isConfigOpen && "rotate-90")} />
              Configure
            </button>
          </div>
          <span className="text-2xl font-bold text-cyan-400 tabular-nums">
            {monthlyQueries.toLocaleString()}
          </span>
        </div>
        
          <input
            type="range"
          min="1000"
          max="100000"
          step="1000"
          value={monthlyQueries}
          onChange={(e) => setMonthlyQueries(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-cyan-400
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab"
          />
        </div>

      {/* Configuration Panel */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isConfigOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-card border border-border rounded-xl p-5 space-y-6">
          {/* Query Distribution */}
        <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Query Distribution
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-amber-400 block mb-1.5">Rules Queries</label>
                <div className="flex items-center gap-2">
          <input
            type="range"
                    min="0"
                    max="100"
                    value={rulesQueriesPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const remaining = 100 - val - tacticalPercent;
                      if (remaining >= 0) {
                        setRulesQueriesPercent(val);
                        setCreatureLookupPercent(Math.max(0, remaining - sessionPercent));
                      }
                    }}
                    className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-amber-400"
                  />
                  <span className="text-xs text-amber-400 font-medium w-8">{rulesQueriesPercent}%</span>
                </div>
        </div>
        <div>
                <label className="text-xs text-rose-400 block mb-1.5">Creature Lookups</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creatureLookupPercent}
                    onChange={(e) => setCreatureLookupPercent(Math.min(Number(e.target.value), 100 - rulesQueriesPercent - tacticalPercent))}
                    className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-rose-400"
                  />
                  <span className="text-xs text-rose-400 font-medium w-8">{creatureLookupPercent}%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-sky-400 block mb-1.5">Tactical (Reasoning)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tacticalPercent}
                    onChange={(e) => setTacticalPercent(Math.min(Number(e.target.value), 100 - rulesQueriesPercent - creatureLookupPercent))}
                    className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-sky-400"
                  />
                  <span className="text-xs text-sky-400 font-medium w-8">{tacticalPercent}%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-pink-400 block mb-1.5">Session Queries</label>
                <div className="flex items-center gap-2">
                  <div className="w-full h-1.5 bg-pink-500/30 rounded-full" />
                  <span className="text-xs text-pink-400 font-medium w-8">{sessionPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Pricing */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Model Pricing ($/M tokens)
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                <div className="text-xs font-medium text-muted-foreground">Router (Small)</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Input</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={routerInputPrice}
                      onChange={(e) => setRouterInputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Output</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={routerOutputPrice}
                      onChange={(e) => setRouterOutputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                <div className="text-xs font-medium text-muted-foreground">Standard</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Input</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={standardInputPrice}
                      onChange={(e) => setStandardInputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Output</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={standardOutputPrice}
                      onChange={(e) => setStandardOutputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                <div className="text-xs font-medium text-muted-foreground">Reasoning</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Input</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={reasoningInputPrice}
                      onChange={(e) => setReasoningInputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Output</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={reasoningOutputPrice}
                      onChange={(e) => setReasoningOutputPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-xs tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caching Settings */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Caching Economics
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-emerald-400 block mb-1.5">
                  Cache Read Price (% of input price): <span className="font-medium">{cacheReadDiscount}%</span>
          </label>
          <input
            type="range"
                  min="5"
                  max="50"
                  value={cacheReadDiscount}
                  onChange={(e) => setCacheReadDiscount(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-emerald-400"
          />
        </div>
        <div>
                <label className="text-xs text-emerald-400 block mb-1.5">
                  Global Cache Hit Rate: <span className="font-medium">{globalCacheHitRate}%</span>
          </label>
          <input
            type="range"
            min="0"
                  max="95"
                  value={globalCacheHitRate}
                  onChange={(e) => setGlobalCacheHitRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">Total Tokens</span>
          </div>
          <div className="text-lg font-bold text-cyan-400 tabular-nums">
            {(totalTokens / 1_000_000).toFixed(2)}M
          </div>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Cached Tokens</span>
          </div>
          <div className="text-lg font-bold text-emerald-400 tabular-nums">
            {(totalCachedTokens / 1_000_000).toFixed(2)}M
          </div>
        </div>
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-muted-foreground">Monthly Cost</span>
          </div>
          <div className="text-lg font-bold text-violet-400 tabular-nums">
            ${totalCost.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-muted-foreground">vs Baseline</span>
          </div>
          <div className="text-lg font-bold text-amber-400 tabular-nums">
            {savingsPercent.toFixed(0)}% saved
          </div>
        </div>
      </div>

      {/* Cost by Query Type */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">Cost Breakdown by Query Type</h4>
        <div className="space-y-3">
          {costBreakdown.map((cb) => {
            const colors = colorClasses[cb.color];
            return (
              <div key={cb.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium", colors.text)}>{cb.name}</span>
                    <span className="text-muted-foreground">
                      {cb.queryCount.toLocaleString()} queries · {cb.modelTier}
                    </span>
          </div>
                  <span className="font-medium text-foreground tabular-nums">${cb.totalCost.toFixed(2)}</span>
          </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", colors.bar)}
                    style={{ width: `${(cb.totalCost / maxCost) * 100}%`, opacity: 0.6 }}
                  />
          </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span>Router: ${cb.routerCost.toFixed(2)}</span>
                  <span>Input: ${cb.inputCost.toFixed(2)}</span>
                  <span>Output: ${cb.outputCost.toFixed(2)}</span>
          </div>
          </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Total Monthly Cost</span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <div className="text-xs text-muted-foreground mb-1">Without Optimization</div>
          <div className="text-xl font-bold text-rose-400 tabular-nums">${baselineCost.toFixed(2)}/mo</div>
          <p className="text-xs text-muted-foreground mt-2">
            All queries to reasoning model, no caching
          </p>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="text-xs text-muted-foreground mb-1">With Routing + Caching</div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">${totalCost.toFixed(2)}/mo</div>
          <p className="text-xs text-muted-foreground mt-2">
            Smart routing, {globalCacheHitRate}% cache hit rate
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Costs are illustrative. Adjust pricing in the config panel to match your provider. 
        Key insight: routing simple queries to standard models + aggressive caching = 60-80% cost reduction.
      </p>
    </div>
  );
}

// =============================================================================
// Intake Agent Pipeline Visualization
// =============================================================================

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "complete";
  output?: string;
}

function IntakeAgentPipeline() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [proposedSchema, setProposedSchema] = useState<object | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const steps: PipelineStep[] = [
    { id: "parse", name: "PDF Parsing", description: "Extract raw content from rulebook", status: currentStep >= 0 ? (currentStep === 0 ? "active" : "complete") : "pending" },
    { id: "classify", name: "Content Classification", description: "Identify rules, entities, actions", status: currentStep >= 1 ? (currentStep === 1 ? "active" : "complete") : "pending" },
    { id: "extract", name: "Schema Inference", description: "AI proposes schema structure", status: currentStep >= 2 ? (currentStep === 2 ? "active" : "complete") : "pending" },
    { id: "review", name: "Human Review", description: "Approve or edit proposed schema", status: currentStep >= 3 ? (currentStep === 3 ? "active" : "complete") : "pending" },
    { id: "store", name: "Database Storage", description: "Save versioned schema + instances", status: currentStep >= 4 ? (currentStep === 4 ? "active" : "complete") : "pending" },
    { id: "tool", name: "Tool Generation", description: "Create callable tools from schema", status: currentStep >= 5 ? (currentStep === 5 ? "active" : "complete") : "pending" },
  ];

  const sampleGrappleSchema = {
    name: "Grapple",
    type: "action",
    version: "1.0",
    schema: {
      attacker: "CreatureRef",
      target: "CreatureRef",
      check: "d20 + STR + proficiency",
      contest: "target.Athletics or Acrobatics",
      effect: "target gains 'grappled' condition",
    },
    validators: ["attacker_within_reach", "target_not_huge"],
  };

  const runPipeline = () => {
    setIsRunning(true);
    setCurrentStep(-1);
    setProposedSchema(null);
    setIsApproved(false);

    const advance = (step: number) => {
      if (step <= 5) {
        setCurrentStep(step);
        if (step === 2) {
          setTimeout(() => setProposedSchema(sampleGrappleSchema), 600);
        }
        if (step < 3 || (step >= 3 && isApproved)) {
          setTimeout(() => advance(step + 1), 1500);
        } else if (step === 3) {
          setIsRunning(false);
        }
      } else {
        setIsRunning(false);
      }
    };

    setTimeout(() => advance(0), 500);
  };

  const approveSchema = () => {
    setIsApproved(true);
    setCurrentStep(4);
    setTimeout(() => setCurrentStep(5), 1500);
    setTimeout(() => setIsRunning(false), 3000);
  };

  const statusColors = {
    pending: "bg-muted/20 border-border text-muted-foreground",
    active: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
    complete: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
  };

  return (
    <div className="space-y-4">
      {/* Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "p-3 rounded-lg border transition-all duration-300",
              statusColors[step.status]
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                step.status === "complete" ? "bg-emerald-500/30" : 
                step.status === "active" ? "bg-cyan-500/30" : "bg-muted"
              )}>
                {step.status === "complete" ? "✓" : i + 1}
              </span>
              <span className="text-xs font-medium truncate">{step.name}</span>
            </div>
            <p className="text-[10px] text-muted-foreground line-clamp-2">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Proposed Schema Preview */}
      {proposedSchema && currentStep >= 2 && (
        <div className={cn(
          "p-4 rounded-lg border animate-in fade-in slide-in-from-top-2",
          isApproved ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"
        )}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={cn("font-medium", isApproved ? "text-emerald-400" : "text-amber-400")}>
              {isApproved ? "Approved Schema: Grapple Action" : "Proposed Schema: Grapple Action"}
            </h4>
            {!isApproved && currentStep === 3 && (
              <button
                onClick={approveSchema}
                className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-all"
              >
                Approve Schema
              </button>
            )}
          </div>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            <div><span className="text-muted-foreground">name: </span><span className="text-cyan-400">&quot;Grapple&quot;</span></div>
            <div><span className="text-muted-foreground">type: </span><span className="text-violet-400">&quot;action&quot;</span></div>
            <div><span className="text-muted-foreground">check: </span><span className="text-amber-400">&quot;d20 + STR + proficiency&quot;</span></div>
            <div><span className="text-muted-foreground">contest: </span><span className="text-amber-400">&quot;Athletics or Acrobatics&quot;</span></div>
            <div><span className="text-muted-foreground">effect: </span><span className="text-emerald-400">&quot;target gains grappled&quot;</span></div>
          </div>
          {currentStep === 3 && !isApproved && (
            <p className="text-xs text-amber-400 mt-2">
              ⚠️ Awaiting human approval before storing schema
            </p>
          )}
        </div>
      )}

      {/* Tool Generated Notification */}
      {currentStep >= 5 && (
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="font-medium text-violet-400">Tool Generated</span>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-mono text-violet-400">execute_grapple(attacker, target)</span> is now available 
            in the tool registry. Player Assistant can call this when players attempt to grapple.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={runPipeline}
          disabled={isRunning && currentStep !== 3}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
        >
          {isRunning && currentStep !== 3 ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          {currentStep === -1 ? "Run Pipeline" : isRunning ? "Processing..." : "Run Again"}
        </button>
        <button
          onClick={() => { setCurrentStep(-1); setProposedSchema(null); setIsApproved(false); setIsRunning(false); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        The pipeline pauses at human review—schemas require approval before they become live tools.
      </p>
    </div>
  );
}

// =============================================================================
// Player Assistant Demo
// =============================================================================

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  toolCall?: { name: string; args: object; result?: string };
}

function PlayerAssistantDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"idle" | "thinking" | "tool" | "result">("idle");

  const sampleConversation: ChatMessage[] = [
    { role: "user", content: "I want to grapple the goblin!" },
    { role: "system", content: "Tool lookup: execute_grapple found in registry" },
    { 
      role: "assistant", 
      content: "Rolling grapple check for Thorin against Goblin...",
      toolCall: {
        name: "execute_grapple",
        args: { attacker: "thorin", target: "goblin_1", attacker_str: 3, attacker_prof: 2 },
      }
    },
    { 
      role: "system", 
      content: "Tool result",
      toolCall: {
        name: "execute_grapple",
        args: {},
        result: "Roll: 14 + 3 (STR) + 2 (prof) = 19 vs Goblin Acrobatics: 12. SUCCESS!"
      }
    },
    { role: "assistant", content: "Thorin's powerful hands clamp down on the goblin! You rolled 19 vs the goblin's 12 Acrobatics check. The goblin is now grappled and can't move away from you. What do you want to do next?" },
  ];

  const runDemo = () => {
    setIsProcessing(true);
    setMessages([]);
    setCurrentPhase("idle");

    sampleConversation.forEach((msg, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
        if (i === 0) setCurrentPhase("thinking");
        if (i === 1) setCurrentPhase("tool");
        if (i === 3) setCurrentPhase("result");
        if (i === sampleConversation.length - 1) {
          setCurrentPhase("idle");
          setIsProcessing(false);
        }
      }, i * 1200);
    });
  };

  return (
    <div className="space-y-4">
      {/* Chat Display */}
      <div className="h-[300px] overflow-y-auto rounded-lg border border-border bg-muted/10 p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Click &quot;Run Demo&quot; to see the Player Assistant use dynamically-created tools
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2",
              msg.role === "user" ? "bg-cyan-500/10 border border-cyan-500/30 ml-8" :
              msg.role === "system" ? "bg-amber-500/10 border border-amber-500/30 mx-4" :
              "bg-violet-500/10 border border-violet-500/30 mr-8"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              {msg.role === "user" && <Users className="w-3 h-3 text-cyan-400" />}
              {msg.role === "assistant" && <Bot className="w-3 h-3 text-violet-400" />}
              {msg.role === "system" && <Settings className="w-3 h-3 text-amber-400" />}
              <span className={cn(
                "text-[10px] font-medium uppercase",
                msg.role === "user" ? "text-cyan-400" :
                msg.role === "system" ? "text-amber-400" : "text-violet-400"
              )}>
                {msg.role === "user" ? "Player (Thorin)" : msg.role === "system" ? "System" : "Assistant"}
              </span>
            </div>
            
            {msg.toolCall && (
              <div className="font-mono text-[10px] p-2 rounded bg-background/50 mb-2">
                {msg.toolCall.result ? (
                  <span className="text-emerald-400">{msg.toolCall.result}</span>
                ) : (
                  <>
                    <span className="text-violet-400">{msg.toolCall.name}</span>
                    <span className="text-muted-foreground">(</span>
                    <span className="text-amber-400">{JSON.stringify(msg.toolCall.args)}</span>
                    <span className="text-muted-foreground">)</span>
                  </>
                )}
              </div>
            )}
            
            <p className="text-xs text-foreground">{msg.content}</p>
          </div>
        ))}
        
        {isProcessing && currentPhase === "thinking" && (
          <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Assistant is thinking...
          </div>
        )}
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Phase:</span>
        {["idle", "thinking", "tool", "result"].map((phase) => (
          <span
            key={phase}
            className={cn(
              "px-2 py-0.5 rounded",
              currentPhase === phase ? "bg-cyan-500/20 text-cyan-400" : "bg-muted/30 text-muted-foreground"
            )}
          >
            {phase}
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={runDemo}
          disabled={isProcessing}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          Run Demo
        </button>
        <button
          onClick={() => { setMessages([]); setCurrentPhase("idle"); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80"
        >
          <RotateCcw className="w-3 h-3" />
          Clear
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        The <span className="text-violet-400">execute_grapple</span> tool was dynamically created from the 
        parsed rules. The assistant looks up player stats, calls the tool, and narrates the result.
      </p>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function CapstoneSection() {
  return (
    <section id="capstone" className="scroll-mt-20">
      <SectionHeading
        id="capstone-heading"
        title="Capstone: Virtual Tabletop Assistant"
        subtitle="Architectural deep-dive combining all guide concepts"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Let&apos;s bring everything together with a <strong className="text-foreground">comprehensive architectural 
          example</strong>: a Virtual Tabletop Assistant that works with <em>any</em> tabletop RPG system—D&D 5e, 
          Pathfinder, Call of Cthulhu, or your homebrew rules. This project demonstrates every major concept 
          from the guide in a cohesive, production-ready architecture.
        </p>

        <Callout variant="tip" title="Why Virtual Tabletop?">
          <p className="m-0">
            A VTT assistant is an ideal capstone because it requires: <strong>PDF parsing</strong> (any rulebook), 
            <strong> dynamic schemas</strong> (stat blocks differ by system), <strong>RAG</strong> (rules lookup), 
            <strong> parallel processing</strong> (multiple creatures), <strong>human-in-loop</strong> (GM approval), 
            <strong> session memory</strong> (campaign state), and <strong>permissions</strong> (GM vs player). 
            It&apos;s a microcosm of production AI systems.
          </p>
        </Callout>

        {/* System Overview */}
        <h3 id="vtt-overview" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          System Overview
        </h3>

        <p className="text-muted-foreground">
          The assistant uses a <strong className="text-foreground">layered architecture</strong> with four distinct 
          layers: Ingestion (processing rulebooks), Storage (vector + relational), Agents (specialized handlers), 
          and Control (permissions and safety). Click each component to explore related concepts.
        </p>

        <InteractiveWrapper
          title="Interactive: System Architecture"
          description="Explore the layered architecture—filter by layer or click components"
          icon="🏗️"
          colorTheme="violet"
          minHeight="auto"
        >
          <ArchitectureVisualizer />
        </InteractiveWrapper>

        {/* Multi-System Support */}
        <h3 id="multi-system-support" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Multi-System Support
        </h3>

        <p className="text-muted-foreground">
          The key architectural challenge: different game systems have completely different rules, stat blocks, 
          and mechanics. D&D 5e creatures have Challenge Rating; Pathfinder 2e uses Level. Call of Cthulhu 
          doesn&apos;t even have &quot;creatures&quot; in the same sense.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">Dynamic Schema Generation</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                When a new rulebook is ingested, the system analyzes its structure and generates appropriate 
                Zod schemas for entities. A D&D Monster schema differs from a Pathfinder Creature schema.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground">System-Specific Skills</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Each game system gets specialized skills: &quot;D&D Combat&quot;, &quot;Pathfinder Actions&quot;, 
                &quot;CoC Sanity Mechanics&quot;. Skills are loaded dynamically based on the active campaign.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Unified Entity Model</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                A base entity model with system-specific extensions. All entities have name, description, source. 
                System-specific fields (AC, HP, Sanity) stored in typed JSON columns.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Cross-System RAG</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Vector search works across systems. &quot;How does flanking work?&quot; retrieves from whichever 
                system is active. Metadata filtering ensures system-appropriate results.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PDF Parsing Strategy */}
        <h3 id="pdf-parsing-strategy" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          PDF Parsing Strategy
        </h3>

        <p className="text-muted-foreground">
          Rulebooks are complex documents: multi-column layouts, tables, stat blocks, sidebars, and artwork. 
          A naive &quot;extract all text&quot; approach produces garbage. Instead:
        </p>

        <div className="my-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Three-Pass Parsing Pipeline</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0">1</div>
              <div>
                <div className="text-sm font-medium text-foreground">Layout Analysis</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detect document structure: chapters, sections, sidebars, tables. Use vision models or 
                  specialized PDF layout tools. Tag regions by type.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0">2</div>
              <div>
                <div className="text-sm font-medium text-foreground">Structured Extraction</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Extract stat blocks into structured JSON. Tables become arrays. Rules text becomes 
                  semantic chunks with cross-references preserved.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0">3</div>
              <div>
                <div className="text-sm font-medium text-foreground">Validation & Enrichment</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Validate extracted entities against schema. Enrich with embeddings. Link related 
                  entities (spells referenced by creatures, rules referenced by abilities).
                </p>
              </div>
            </div>
          </div>
        </div>

        <Callout variant="important" title="Human-in-the-Loop for Ingestion">
          <p className="m-0">
            PDF parsing is imperfect. The system flags low-confidence extractions for human review. 
            A GM reviews &quot;Did we correctly parse this stat block?&quot; before it enters the database. 
            This prevents garbage from contaminating the knowledge base.
          </p>
        </Callout>

        {/* Dynamic Schema Generation */}
        <h3 id="dynamic-schema-generation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Dynamic Schema Generation
        </h3>

        <p className="text-muted-foreground">
          When ingesting a new game system, the assistant analyzes example entities and generates appropriate 
          schemas. This is <strong className="text-foreground">meta-programming via AI</strong>:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Step 1: Sample Analysis</h4>
              <p className="text-sm text-muted-foreground m-0">
                Extract 5-10 example stat blocks from the rulebook. Use vision models if PDFs have 
                non-standard formatting. The examples teach the system what fields exist.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Step 2: Schema Inference</h4>
              <p className="text-sm text-muted-foreground m-0">
                An LLM analyzes the samples and generates a Zod schema. Output includes field names, 
                types, optionality, and validation rules. Human reviews before acceptance.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Step 3: Schema Versioning</h4>
              <p className="text-sm text-muted-foreground m-0">
                Schemas are versioned. When a new sourcebook adds fields (like &quot;Mythic Actions&quot;), 
                create a new schema version. Old entities migrate or remain on old version.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mt-6">
          The schema inference prompt asks the LLM to analyze sample stat blocks, identify all fields, 
          generate a Zod schema with appropriate types and validation, and include comments explaining 
          each field. The human reviews the generated schema and can edit before committing.
        </p>

        {/* Intake Agent Pipeline */}
        <h3 id="intake-agent-pipeline" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Intake Agent Pipeline
        </h3>

        <p className="text-muted-foreground">
          After parsing PDFs, an <strong className="text-foreground">Intake Agent</strong> processes the 
          extracted content. This agent doesn&apos;t just store data—it <em>creates the infrastructure</em> 
          for that data: schemas, validators, and callable tools.
        </p>

        <InteractiveWrapper
          title="Interactive: Intake Agent Pipeline"
          description="Watch the full pipeline from PDF to callable tool"
          icon="⚙️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <IntakeAgentPipeline />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">What the Intake Agent Does</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Schema Inference</div>
              <p className="text-xs text-muted-foreground">
                Analyzes parsed content to propose schemas. &quot;Grappling&quot; becomes an Action type 
                with check formulas, effects, and constraints.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Tool Generation</div>
              <p className="text-xs text-muted-foreground">
                Automatically creates tools from approved schemas. execute_grapple() is generated 
                with validation against the Action schema.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Skill Attachment</div>
              <p className="text-xs text-muted-foreground">
                Links generated tools to appropriate agents. Combat tools go to the Combat Agent, 
                magic tools to the Spellcasting Agent.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Index & Embed</div>
              <p className="text-xs text-muted-foreground">
                Creates embeddings for semantic search. &quot;How do I grab someone?&quot; finds the 
                grappling rules via vector similarity.
              </p>
            </div>
          </div>
        </div>

        <Callout variant="important" title="Human-in-the-Loop Gate">
          <p className="m-0">
            The pipeline <strong>pauses for human approval</strong> before schemas become live. This 
            prevents AI mistakes from polluting your tool registry. The GM reviews proposed schemas, 
            can edit field names or types, and only then does the system generate the actual tool.
          </p>
        </Callout>

        {/* Agents Building Agents */}
        <h3 id="agents-building-agents" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Agents Building Agents
        </h3>

        <p className="text-muted-foreground">
          The most powerful pattern: the Intake Agent doesn&apos;t just create tools—it <strong className="text-foreground">creates 
          specialized agents</strong> for each game system. When you ingest D&D 5e, you get a D&D Combat Agent. 
          Ingest Pathfinder, get a Pathfinder Actions Agent.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground">Agent as Data</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Agents are stored as database rows: name, system prompt template, available tools, 
                model config, constraints. No code changes needed to add new agents.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">System-Specific</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                D&D Agent gets D&D tools and D&D system prompts. Pathfinder Agent gets Pathfinder 
                equivalents. Same player query routes to the appropriate specialized agent.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Human Approval</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                New agents go through a review queue. GM verifies the system prompt makes sense, 
                tools are appropriate, constraints are reasonable before activation.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Hot Reload</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Agent definitions load dynamically. Update a system prompt in the database, it&apos;s 
                live immediately. No deployment, no restart.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">Dynamic Agent Configuration</h4>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            <div className="text-muted-foreground">{"// Agent stored as data in database"}</div>
            <div><span className="text-cyan-400">id:</span> <span className="text-amber-400">&quot;dnd5e-combat-agent&quot;</span></div>
            <div><span className="text-cyan-400">name:</span> <span className="text-amber-400">&quot;D&D 5e Combat Assistant&quot;</span></div>
            <div><span className="text-cyan-400">system:</span> <span className="text-amber-400">&quot;dnd5e&quot;</span></div>
            <div><span className="text-cyan-400">tools:</span> <span className="text-violet-400">[&quot;execute_grapple&quot;, &quot;roll_attack&quot;, &quot;apply_condition&quot;]</span></div>
            <div><span className="text-cyan-400">model:</span> <span className="text-amber-400">&quot;standard&quot;</span></div>
            <div><span className="text-cyan-400">prompt:</span> <span className="text-amber-400">&quot;You help players with D&D 5e combat...&quot;</span></div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            New game system = new agent row. All configuration is data, not code.
          </p>
        </div>

        {/* Player Assistant in Action */}
        <h3 id="player-assistant-demo" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Player Assistant in Action
        </h3>

        <p className="text-muted-foreground">
          See how the <strong className="text-foreground">dynamically created tools</strong> work in practice. 
          When a player says &quot;I want to grapple the goblin&quot;, the assistant uses the execute_grapple tool 
          that was generated from the parsed rules.
        </p>

        <InteractiveWrapper
          title="Interactive: Player Assistant Demo"
          description="Watch the assistant use dynamically-generated tools"
          icon="🎮"
          colorTheme="violet"
          minHeight="auto"
        >
          <PlayerAssistantDemo />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">The Full Loop</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">PDF parsed</strong> → Grappling rules extracted
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Schema inferred</strong> → Grapple action type created
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Human approves</strong> → Schema versioned and stored
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">4</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Tool generated</strong> → execute_grapple in registry
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold">5</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Player uses it</strong> → &quot;I grapple the goblin&quot; → tool called
              </span>
            </div>
          </div>
        </div>

        {/* Permission System Design */}
        <h3 id="permission-system" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Permission System Design
        </h3>

        <p className="text-muted-foreground">
          A VTT has critical permission requirements: players shouldn&apos;t see monster stats, GMs need 
          access to spoilers, certain content requires age verification. The permission system is 
          <strong className="text-foreground"> enforced at the API layer</strong>, not just the UI.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="highlight">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-orange-400" />
                <h4 className="font-medium text-foreground">Role-Based Access</h4>
              </div>
              <ul className="text-sm text-muted-foreground m-0 space-y-1">
                <li>• <strong>GM:</strong> Full access to all content</li>
                <li>• <strong>Player:</strong> Rules, own character, revealed NPCs</li>
                <li>• <strong>Spectator:</strong> Public campaign info only</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <h4 className="font-medium text-foreground">Content Filtering</h4>
              </div>
              <ul className="text-sm text-muted-foreground m-0 space-y-1">
                <li>• Stat blocks hidden from players</li>
                <li>• Plot spoilers require GM role</li>
                <li>• Generated content reviewed by GM</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="my-6 p-5 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <h4 className="text-lg font-semibold text-orange-400 mb-3">Permission Check Flow</h4>
          <div className="flex items-center justify-between text-xs overflow-x-auto gap-2 pb-2">
            <div className="flex flex-col items-center gap-1 p-2 min-w-[80px]">
              <Bot className="w-5 h-5 text-violet-400" />
              <span className="text-muted-foreground">Agent Request</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col items-center gap-1 p-2 min-w-[80px]">
              <Settings className="w-5 h-5 text-orange-400" />
              <span className="text-muted-foreground">Permission Layer</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col items-center gap-1 p-2 min-w-[80px]">
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="text-muted-foreground">Data Layer</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col items-center gap-1 p-2 min-w-[80px]">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-muted-foreground">Filtered Result</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Every data access goes through the permission layer. Even if an agent tries to retrieve 
            monster stats, the permission layer filters based on the requesting user&apos;s role.
          </p>
        </div>

        {/* Query Architecture */}
        <h3 id="query-architecture" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Query Architecture
        </h3>

        <p className="text-muted-foreground">
          Different query types require different processing paths. The orchestrator routes based on 
          intent classification, then specialized agents handle each type:
        </p>

        <InteractiveWrapper
          title="Interactive: Query Flow Demo"
          description="See how different queries flow through the system"
          icon="🔀"
          colorTheme="cyan"
          minHeight="auto"
        >
          <QueryFlowDemo />
        </InteractiveWrapper>

        <div className="space-y-4 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Rules Queries</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;How does concentration work?&quot; → RAG search → Synthesize answer with page citations. 
                Uses HyDE for ambiguous queries. Available to all users.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Creature Lookups</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;Beholder stats&quot; → Permission check → Entity database query → Format with dynamic schema. 
                GM-only for unrevealed creatures. Parallel lookup for multiple creatures.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-sky-400 mb-2">Tactical/Creative</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;How should these goblins fight?&quot; → Creature lookup + Session context → GM Assistant 
                generates tactics. Human-in-loop: GM reviews before using.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-pink-400 mb-2">Session Queries</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;What happened last session?&quot; → Session Manager retrieves episodic summaries. 
                &quot;Who is Lord Vance?&quot; → Entity lookup in session context + campaign notes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Architecture */}
        <h3 id="cost-architecture" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Cost Architecture
        </h3>

        <p className="text-muted-foreground">
          A production VTT assistant needs careful cost management. The architecture uses multiple 
          strategies: <strong className="text-foreground">model routing</strong>, <strong className="text-foreground">caching</strong>, 
          and <strong className="text-foreground">tiered processing</strong>.
        </p>

        <InteractiveWrapper
          title="Interactive: Cost Calculator"
          description="Estimate monthly costs with routing and caching"
          icon="💰"
          colorTheme="emerald"
          minHeight="auto"
        >
          <EnhancedCostCalculator />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">Cost Optimization Strategies</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Model Routing</div>
              <p className="text-xs text-muted-foreground">
                Simple queries (90%) → Standard model. Complex queries (10%) → Reasoning model. 
                Router cost is negligible.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Aggressive Caching</div>
              <p className="text-xs text-muted-foreground">
                System prompts, skill definitions, and frequently-accessed rules all cache. 
                65%+ cache hit rate is achievable.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">Precomputed Responses</div>
              <p className="text-xs text-muted-foreground">
                Common queries (&quot;how does advantage work?&quot;) have precomputed answers. 
                Only novel queries hit the LLM.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-sm font-medium text-foreground mb-1">User Quotas</div>
              <p className="text-xs text-muted-foreground">
                Rate limits per user/session. Prevents runaway costs from abuse or bugs. 
                GM gets higher limits than players.
              </p>
            </div>
          </div>
        </div>

        {/* Concepts Applied */}
        <h3 id="concepts-applied" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Concepts Applied
        </h3>

        <p className="text-muted-foreground">
          This capstone project demonstrates every major concept from the guide:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Foundations</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Embeddings for semantic search</li>
                <li>LLM caching for cost efficiency</li>
                <li>Stateless function mental model</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context Engineering</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Layered context architecture</li>
                <li>Episodic summarization for sessions</li>
                <li>Signal over noise in retrieval</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Capabilities</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Dynamic schema generation</li>
                <li>Tool use for database queries</li>
                <li>Streaming for responsive UX</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Orchestration</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Model routing for cost optimization</li>
                <li>Parallel processing for lookups</li>
                <li>Delegation to specialized agents</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Safety & Control</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>RBAC for GM vs player access</li>
                <li>Human-in-loop for generated content</li>
                <li>API-level permission enforcement</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Production</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Observability and tracing</li>
                <li>Cost monitoring and quotas</li>
                <li>Graceful degradation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="Adapt to Your Domain">
          <p className="mb-2">
            This architecture is a <strong>template</strong>. Replace rulebooks with legal documents, 
            medical guidelines, or enterprise documentation. The patterns transfer directly:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>PDF parsing → Document ingestion</li>
            <li>Creatures → Entities in your domain</li>
            <li>GM/Player → Admin/User roles</li>
            <li>Sessions → User contexts or projects</li>
          </ul>
        </Callout>

        <Callout variant="tip" title="Start Simple, Scale Up">
          <p className="m-0">
            Don&apos;t build all of this at once. Start with basic RAG for rules lookup. Add orchestration 
            when query types diverge. Layer on caching and routing as you scale. The architecture should 
            evolve with your needs—premature optimization is the root of all evil, even in AI systems.
          </p>
        </Callout>
      </div>
    </section>
  );
}
