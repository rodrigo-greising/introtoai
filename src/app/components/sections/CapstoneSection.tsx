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
} from "lucide-react";

// =============================================================================
// D&D Assistant Architecture Visualization
// =============================================================================

interface ArchitectureNode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  concepts: string[];
}

const architectureNodes: ArchitectureNode[] = [
  {
    id: "pdf-parser",
    name: "PDF Parser",
    description: "Extract rules, monsters, spells from source books",
    icon: BookOpen,
    color: "cyan",
    concepts: ["Chunking Strategies", "Document Preprocessing"],
  },
  {
    id: "vector-store",
    name: "Vector Store",
    description: "pgvector for rules, monsters, session history",
    icon: Database,
    color: "emerald",
    concepts: ["Embeddings", "RAG", "Vector Databases"],
  },
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    description: "Routes requests to specialized handlers",
    icon: Sparkles,
    color: "violet",
    concepts: ["Model Routing", "Orchestration Patterns", "Task Decomposition"],
  },
  {
    id: "rules-agent",
    name: "Rules Agent",
    description: "Answers questions about game mechanics",
    icon: BookOpen,
    color: "amber",
    concepts: ["RAG Fundamentals", "Context Engineering", "Structured Outputs"],
  },
  {
    id: "monster-agent",
    name: "Monster Agent",
    description: "Retrieves and formats creature stat blocks",
    icon: Zap,
    color: "rose",
    concepts: ["Skills", "Dynamic Schema", "Parallel Processing"],
  },
  {
    id: "dm-agent",
    name: "DM Assistant",
    description: "Generates encounters, NPCs, plot hooks",
    icon: Users,
    color: "sky",
    concepts: ["Agentic Loop", "Creative Generation", "Human-in-Loop"],
  },
  {
    id: "session-manager",
    name: "Session Manager",
    description: "Tracks game state, player actions, history",
    icon: MessageSquare,
    color: "pink",
    concepts: ["Context Lifecycle", "Episodic Summarization", "Evolving Context"],
  },
  {
    id: "guardrails",
    name: "Safety & Permissions",
    description: "Content filtering, player permissions",
    icon: Shield,
    color: "orange",
    concepts: ["Guardrails", "RBAC", "External Control"],
  },
];

function ArchitectureVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeFlow, setActiveFlow] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const flowSteps = [
    { nodes: ["orchestrator"], message: "User: 'What's the AC of a Beholder?'" },
    { nodes: ["orchestrator", "monster-agent"], message: "Routing to Monster Agent..." },
    { nodes: ["monster-agent", "vector-store"], message: "Searching vector store for 'Beholder'..." },
    { nodes: ["monster-agent"], message: "Formatting stat block with dynamic schema..." },
    { nodes: ["guardrails", "monster-agent"], message: "Checking content permissions..." },
    { nodes: ["orchestrator"], message: "Response: 'The Beholder has AC 18...'" },
  ];

  const runDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setActiveFlow([]);
  };

  // Auto-advance flow
  useState(() => {
    if (!isRunning) return;
    if (currentStep >= flowSteps.length) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveFlow(flowSteps[currentStep].nodes);
      setCurrentStep(prev => prev + 1);
    }, 1500);
    return () => clearTimeout(timer);
  });

  const selected = selectedNode ? architectureNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="space-y-6">
      {/* Architecture grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {architectureNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeFlow.includes(node.id);
          const isSelected = selectedNode === node.id;
          
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

          const colors = colorClasses[node.color];

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className={cn(
                "p-3 rounded-lg border transition-all text-left",
                colors.bg,
                isActive ? "ring-2 ring-emerald-500 scale-105" : "",
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
          `bg-${selected.color}-500/5 border-${selected.color}-500/20`
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

      {/* Demo flow */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Demo: Monster Lookup Flow</span>
          <div className="flex gap-2">
            {!isRunning && (
              <button
                onClick={runDemo}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              >
                <Play className="w-3 h-3" />
                Run
              </button>
            )}
            <button
              onClick={() => {
                setIsRunning(false);
                setCurrentStep(0);
                setActiveFlow([]);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
        <div className="min-h-[60px] flex items-center">
          {currentStep > 0 && currentStep <= flowSteps.length ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-muted-foreground">{flowSteps[currentStep - 1].message}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Click &quot;Run&quot; to see the request flow</span>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Cost Calculator for Capstone
// =============================================================================

function CapstoneCostCalculator() {
  const [queries, setQueries] = useState(1000);
  const [avgContextTokens, setAvgContextTokens] = useState(4000);
  const [avgOutputTokens, setAvgOutputTokens] = useState(500);
  const [cacheHitRate, setCacheHitRate] = useState(60);

  // Cost per 1M tokens (illustrative)
  const inputCost = 3; // $3/1M input
  const outputCost = 15; // $15/1M output
  const cachedCost = 0.3; // $0.30/1M cached

  const totalInputTokens = queries * avgContextTokens;
  const totalOutputTokens = queries * avgOutputTokens;
  const cachedTokens = totalInputTokens * (cacheHitRate / 100);
  const freshTokens = totalInputTokens - cachedTokens;

  const inputCostTotal = (freshTokens / 1_000_000) * inputCost;
  const cachedCostTotal = (cachedTokens / 1_000_000) * cachedCost;
  const outputCostTotal = (totalOutputTokens / 1_000_000) * outputCost;
  const totalCost = inputCostTotal + cachedCostTotal + outputCostTotal;

  const noCacheCost = (totalInputTokens / 1_000_000) * inputCost + outputCostTotal;
  const savings = noCacheCost - totalCost;
  const savingsPercent = noCacheCost > 0 ? (savings / noCacheCost) * 100 : 0;

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
            min="100"
            max="100000"
            step="100"
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
            min="500"
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
            max="4000"
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
            {((totalInputTokens + totalOutputTokens) / 1_000_000).toFixed(2)}M
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
            <span className="text-xs text-muted-foreground">Cache Savings</span>
          </div>
          <div className="text-lg font-bold text-violet-400">
            {savingsPercent.toFixed(0)}% (${savings.toFixed(2)})
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Cost Breakdown</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Fresh input tokens ({((freshTokens / 1_000_000)).toFixed(2)}M @ ${inputCost}/1M)</span>
            <span>${inputCostTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cached tokens ({((cachedTokens / 1_000_000)).toFixed(2)}M @ ${cachedCost}/1M)</span>
            <span>${cachedCostTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Output tokens ({((totalOutputTokens / 1_000_000)).toFixed(2)}M @ ${outputCost}/1M)</span>
            <span>${outputCostTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border text-foreground font-medium">
            <span>Total</span>
            <span>${totalCost.toFixed(2)}/month</span>
          </div>
        </div>
      </div>
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
        title="Capstone: D&D Game Assistant"
        subtitle="A production-ready example combining all guide concepts"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Let&apos;s bring everything together with a <strong className="text-foreground">real-world example</strong>: 
          a D&D Game Assistant that helps Dungeon Masters run sessions. This project uses every major concept 
          from the guide—RAG, orchestration, tools, guardrails, and cost optimization.
        </p>

        <Callout variant="tip" title="Why D&D?">
          <p className="m-0">
            A tabletop RPG assistant is an ideal capstone because it requires: PDF parsing (rulebooks), 
            RAG (rules lookup), dynamic schemas (stat blocks), parallel processing (multiple lookups), 
            human-in-loop (DM approval), and session memory (game state). It&apos;s a microcosm of 
            production AI systems.
          </p>
        </Callout>

        {/* Architecture Overview */}
        <h3 id="architecture" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          System Architecture
        </h3>

        <p className="text-muted-foreground">
          The assistant uses an orchestrator pattern with specialized sub-agents. Click each component 
          to see which guide concepts it applies.
        </p>

        <InteractiveWrapper
          title="Interactive: D&D Assistant Architecture"
          description="Click components to explore related concepts"
          icon="🎲"
          colorTheme="violet"
          minHeight="auto"
        >
          <ArchitectureVisualizer />
        </InteractiveWrapper>

        {/* Key Implementation Details */}
        <h3 id="implementation-details" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Key Implementation Details
        </h3>

        <div className="space-y-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">1. PDF Parsing & Chunking</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Rulebooks are parsed into chunks optimized for retrieval:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Semantic chunking for rules (keep related rules together)</li>
                <li>Structured extraction for stat blocks (monsters, spells)</li>
                <li>Metadata tagging (source book, page number, category)</li>
                <li>Chunk size: ~500 tokens for rules, structured JSON for stat blocks</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">2. RAG Pipeline</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Multi-index RAG with query routing:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Separate indexes: rules, monsters, spells, session history</li>
                <li>HyDE for ambiguous queries (&quot;how does grappling work?&quot;)</li>
                <li>Hybrid search: keyword for exact terms + semantic for concepts</li>
                <li>Re-ranking with cross-encoder for precision</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">3. Agent Orchestration</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                The orchestrator routes to specialized agents:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Small router model classifies intent (rules, monster, creative)</li>
                <li>Each sub-agent has focused context and tools</li>
                <li>Parallel execution for multi-part queries</li>
                <li>Results synthesized by orchestrator before response</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">4. Session Memory</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Long-running game sessions need careful context management:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Episodic summarization after each major event</li>
                <li>Entity extraction: NPCs, locations, plot points</li>
                <li>Rolling context window with important facts preserved</li>
                <li>Session persistence in database for multi-session campaigns</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">5. Safety & Permissions</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Content filtering and access control:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>DM-only tools (encounter generation, plot spoilers)</li>
                <li>Content filter for player-facing outputs</li>
                <li>Human-in-loop for generated encounters (DM approval)</li>
                <li>Rate limiting and cost caps per session</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Cost Calculator */}
        <h3 id="cost-estimation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Cost Estimation
        </h3>

        <p className="text-muted-foreground">
          Estimate the monthly cost of running your D&D assistant based on usage patterns:
        </p>

        <InteractiveWrapper
          title="Interactive: Cost Calculator"
          description="Estimate monthly costs based on usage"
          icon="💰"
          colorTheme="emerald"
          minHeight="auto"
        >
          <CapstoneCostCalculator />
        </InteractiveWrapper>

        {/* What You've Learned */}
        <h3 id="concepts-applied" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
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
                <li>LLM caching for repeated queries</li>
                <li>Stateless function model</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context Engineering</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Layered context architecture</li>
                <li>Episodic summarization</li>
                <li>Signal over noise principles</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Capabilities</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Structured outputs for stat blocks</li>
                <li>Tool use for database queries</li>
                <li>Agentic loop for complex tasks</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Orchestration</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Model routing for efficiency</li>
                <li>Parallel processing</li>
                <li>Delegation to sub-agents</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="Build Your Own">
          <p className="mb-2">
            This capstone is a template. Adapt it to your domain: replace D&D rules with 
            legal documents, medical guidelines, or company documentation. The architecture 
            patterns transfer directly.
          </p>
          <p className="m-0">
            The key is <strong>starting simple</strong>: begin with basic RAG, add orchestration 
            when needed, then layer on advanced features like caching and parallel processing 
            as you scale.
          </p>
        </Callout>
      </div>
    </section>
  );
}
