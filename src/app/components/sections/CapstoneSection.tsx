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
// Cost Architecture Calculator
// =============================================================================

function CostArchitectureCalculator() {
  const [queries, setQueries] = useState(5000);
  const [avgContextTokens, setAvgContextTokens] = useState(4000);
  const [avgOutputTokens, setAvgOutputTokens] = useState(500);
  const [cacheHitRate, setCacheHitRate] = useState(65);

  // Cost tiers per 1M tokens (illustrative - abstract model tiers)
  const costs = {
    router: { input: 0.15, output: 0.60 }, // Small/fast model
    standard: { input: 3.00, output: 15.00 }, // Standard model
    reasoning: { input: 15.00, output: 60.00 }, // Reasoning model
    cached: { input: 0.30, output: 0 }, // Cached input
  };

  // Assume 10% queries need reasoning, 90% standard after routing
  const reasoningQueries = queries * 0.10;
  const standardQueries = queries * 0.90;

  // Router cost (runs on all queries)
  const routerTokens = queries * 200; // ~200 tokens per router call
  const routerCost = (routerTokens / 1_000_000) * (costs.router.input + costs.router.output);

  // Main model costs
  const totalInputTokens = queries * avgContextTokens;
  const cachedTokens = totalInputTokens * (cacheHitRate / 100);
  const freshTokens = totalInputTokens - cachedTokens;
  
  const standardInputCost = (freshTokens * 0.90 / 1_000_000) * costs.standard.input;
  const reasoningInputCost = (freshTokens * 0.10 / 1_000_000) * costs.reasoning.input;
  const cachedCost = (cachedTokens / 1_000_000) * costs.cached.input;
  
  const standardOutputCost = (standardQueries * avgOutputTokens / 1_000_000) * costs.standard.output;
  const reasoningOutputCost = (reasoningQueries * avgOutputTokens / 1_000_000) * costs.reasoning.output;

  const totalCost = routerCost + standardInputCost + reasoningInputCost + cachedCost + standardOutputCost + reasoningOutputCost;

  // Without routing (all queries to reasoning model)
  const noRoutingCost = (freshTokens / 1_000_000) * costs.reasoning.input + 
                       (cachedTokens / 1_000_000) * costs.cached.input +
                       (queries * avgOutputTokens / 1_000_000) * costs.reasoning.output;

  const routingSavings = noRoutingCost - totalCost;
  const routingSavingsPercent = noRoutingCost > 0 ? (routingSavings / noRoutingCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Monthly Queries: <span className="text-foreground font-medium">{queries.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="500"
            max="50000"
            step="500"
            value={queries}
            onChange={(e) => setQueries(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Avg Context Tokens: <span className="text-foreground font-medium">{avgContextTokens.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="1000"
            max="16000"
            step="500"
            value={avgContextTokens}
            onChange={(e) => setAvgContextTokens(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Avg Output Tokens: <span className="text-foreground font-medium">{avgOutputTokens.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={avgOutputTokens}
            onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Cache Hit Rate: <span className="text-foreground font-medium">{cacheHitRate}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={cacheHitRate}
            onChange={(e) => setCacheHitRate(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">Total Tokens</span>
          </div>
          <div className="text-lg font-bold text-cyan-400">
            {((totalInputTokens + queries * avgOutputTokens) / 1_000_000).toFixed(2)}M
          </div>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Monthly Cost</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            ${totalCost.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-muted-foreground">Routing Savings</span>
          </div>
          <div className="text-lg font-bold text-violet-400">
            {routingSavingsPercent.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Cost Breakdown by Component</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Router (small model)</span>
            <span>${routerCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Standard tier (90% of queries)</span>
            <span>${(standardInputCost + standardOutputCost).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Reasoning tier (10% of queries)</span>
            <span>${(reasoningInputCost + reasoningOutputCost).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cached tokens ({cacheHitRate}% hit rate)</span>
            <span>${cachedCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border text-foreground font-medium">
            <span>Total</span>
            <span>${totalCost.toFixed(2)}/month</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Costs are illustrative. Actual costs vary by provider and model. The key insight: routing + caching 
        can reduce costs by 60-80% compared to using reasoning models for everything.
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
          <CostArchitectureCalculator />
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
