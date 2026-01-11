"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { 
  Code2, 
  Database, 
  FileSearch, 
  Terminal, 
  Zap,
  BrainCircuit,
  FolderTree,
  GitBranch,
  Globe,
  Sparkles,
} from "lucide-react";

// Interactive Architecture Diagram Component
function CursorArchitectureDiagram() {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string>("context-engine");

  // Layout constants - use a grid-based system for reliable positioning
  const NODE_SIZE = 44; // px
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 340;

  const components = [
    {
      id: "codebase-index",
      name: "Codebase Index",
      icon: Database,
      color: "cyan",
      x: 80,
      y: 60,
      description: "Semantic index of your entire codebase. Uses embeddings to enable intelligent code retrieval based on meaning, not just keywords.",
      connections: ["retrieval"],
    },
    {
      id: "retrieval",
      name: "Semantic Retrieval",
      icon: FolderTree,
      color: "blue",
      x: 200,
      y: 100,
      description: "Finds relevant code based on query semantics. Powers @codebase mentions and automatic context gathering.",
      connections: ["context-engine"],
    },
    {
      id: "rules-system",
      name: "Rules System",
      icon: FileSearch,
      color: "emerald",
      x: 80,
      y: 170,
      description: "Project-specific instructions in .cursor/rules/. Automatically included based on file globs and alwaysApply settings.",
      connections: ["context-engine"],
    },
    {
      id: "context-engine",
      name: "Context Engine",
      icon: BrainCircuit,
      color: "violet",
      x: 300,
      y: 170,
      description: "Orchestrates context assembly. Combines rules, files, conversation history, and retrieved context into optimal prompts for the LLM.",
      connections: ["llm-api"],
    },
    {
      id: "llm-api",
      name: "LLM API",
      icon: Sparkles,
      color: "amber",
      x: 520,
      y: 170,
      description: "Connection to language models (Claude, GPT-4, etc.). Handles streaming, tool calls, and response parsing.",
      connections: ["editor-bridge"],
    },
    {
      id: "editor-bridge",
      name: "Editor Bridge",
      icon: Code2,
      color: "pink",
      x: 300,
      y: 280,
      description: "Translates LLM outputs into editor operations—diffs, insertions, file creation. Handles the 'apply' workflow.",
      connections: [],
    },
    {
      id: "terminal-integration",
      name: "Terminal",
      icon: Terminal,
      color: "orange",
      x: 80,
      y: 280,
      description: "Captures terminal output, enables command execution. Powers agent mode's ability to run and iterate on commands.",
      connections: ["context-engine"],
    },
    {
      id: "external-context",
      name: "External (@web, @docs)",
      icon: Globe,
      color: "rose",
      x: 520,
      y: 60,
      description: "@web searches, @docs documentation fetching, MCP tools. Brings external knowledge into the context window.",
      connections: ["context-engine"],
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string; stroke: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", stroke: "#22d3ee" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", stroke: "#8b5cf6" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", stroke: "#f59e0b" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", stroke: "#10b981" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", stroke: "#3b82f6" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", stroke: "#ec4899" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", stroke: "#f97316" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", stroke: "#f43f5e" },
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  // Calculate edge path with proper node centers
  const getEdgePath = (fromComp: typeof components[0], toComp: typeof components[0]) => {
    const x1 = fromComp.x + NODE_SIZE / 2;
    const y1 = fromComp.y + NODE_SIZE / 2;
    const x2 = toComp.x + NODE_SIZE / 2;
    const y2 = toComp.y + NODE_SIZE / 2;

    // Create a curved path for better visuals
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Add some curve
    const curvature = 0.2;
    const cx = midX - dy * curvature;
    const cy = midY + dx * curvature;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Cursor Architecture</h4>
        <span className="text-xs text-muted-foreground">Click components to explore</span>
      </div>

      {/* Diagram */}
      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden mb-4">
        <svg 
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          style={{ minHeight: "280px" }}
        >
          {/* Defs for arrow markers and gradients */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(148, 163, 184, 0.5)" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
          </defs>

          {/* Grid background */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.05" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection lines */}
          <g className="edges">
            {components.map((comp) =>
              comp.connections.map((targetId) => {
                const target = components.find((c) => c.id === targetId);
                if (!target) return null;
                const isActive = selectedComponent === comp.id || selectedComponent === targetId;
                const isConnectedToSelected = selectedComp?.connections.includes(comp.id) || 
                  selectedComp?.connections.includes(targetId) ||
                  comp.id === selectedComponent ||
                  targetId === selectedComponent;

                return (
                  <path
                    key={`${comp.id}-${targetId}`}
                    d={getEdgePath(comp, target)}
                    fill="none"
                    stroke={isActive ? colorClasses[comp.color].stroke : "rgba(148, 163, 184, 0.3)"}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={isConnectedToSelected ? "none" : "6,4"}
                    markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    className="transition-all duration-300"
                    opacity={isConnectedToSelected ? 1 : 0.4}
                  />
                );
              })
            )}
          </g>

          {/* Component nodes */}
          <g className="nodes">
            {components.map((comp) => {
              const Icon = comp.icon;
              const colors = colorClasses[comp.color];
              const isSelected = selectedComponent === comp.id;
              const isHovered = hoveredComponent === comp.id;
              const isConnected = selectedComp?.connections.includes(comp.id) ||
                comp.connections.includes(selectedComponent);

              return (
                <g
                  key={comp.id}
                  transform={`translate(${comp.x}, ${comp.y})`}
                  onClick={() => setSelectedComponent(comp.id)}
                  onMouseEnter={() => setHoveredComponent(comp.id)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer"
                  style={{ opacity: !isSelected && !isConnected && !isHovered ? 0.5 : 1 }}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <rect
                      x="-4"
                      y="-4"
                      width={NODE_SIZE + 8}
                      height={NODE_SIZE + 8}
                      rx="14"
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth="2"
                      opacity="0.5"
                    />
                  )}
                  
                  {/* Node background */}
                  <rect
                    x="0"
                    y="0"
                    width={NODE_SIZE}
                    height={NODE_SIZE}
                    rx="10"
                    fill={isSelected || isHovered ? colors.stroke + "30" : colors.stroke + "15"}
                    stroke={colors.stroke}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-200"
                  />
                  
                  {/* Icon placeholder - we'll render actual icon in foreignObject */}
                  <foreignObject x="10" y="10" width="24" height="24">
                    <div className="flex items-center justify-center w-full h-full">
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                  </foreignObject>

                  {/* Label below node */}
                  <text
                    x={NODE_SIZE / 2}
                    y={NODE_SIZE + 16}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-current"
                    style={{ fill: isSelected || isConnected ? colors.stroke : "rgba(148, 163, 184, 0.7)" }}
                  >
                    {comp.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Central label for Context Engine */}
          <text
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT - 15}
            textAnchor="middle"
            className="text-[11px] fill-current"
            style={{ fill: "rgba(148, 163, 184, 0.6)" }}
          >
            Context flows inward → Context Engine → LLM → Editor actions
          </text>
        </svg>
      </div>

      {/* Selected component details */}
      {selectedComp && (
        <div className={`p-4 rounded-lg ${colorClasses[selectedComp.color].bg} border ${colorClasses[selectedComp.color].border}`}>
          <div className="flex items-center gap-2 mb-2">
            <selectedComp.icon className={`w-5 h-5 ${colorClasses[selectedComp.color].text}`} />
            <h5 className="font-medium text-foreground">{selectedComp.name}</h5>
          </div>
          <p className="text-sm text-muted-foreground m-0">
            {selectedComp.description}
          </p>
          {selectedComp.connections.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Flows to: </span>
              {selectedComp.connections.map((connId, i) => {
                const conn = components.find(c => c.id === connId);
                return (
                  <span key={connId}>
                    <button
                      onClick={() => setSelectedComponent(connId)}
                      className="text-xs text-[var(--highlight)] hover:underline"
                    >
                      {conn?.name}
                    </button>
                    {i < selectedComp.connections.length - 1 && ", "}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CursorIDESection() {
  return (
    <section id="cursor-architecture" className="scroll-mt-20">
      <SectionHeading
        id="cursor-architecture-heading"
        title="Cursor Architecture"
        subtitle="Understanding how AI-native IDEs work"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Cursor represents the <strong className="text-foreground">AI-native IDE paradigm</strong>—an 
          editor built from the ground up around AI assistance. Understanding its architecture helps 
          you use it effectively and transfer those patterns to similar tools.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Cursor is used as the primary example in this section. The patterns apply to other 
            AI-native IDEs: <strong>Windsurf</strong>, <strong>Zed + AI</strong>, <strong>VS Code + Copilot</strong>, 
            <strong>JetBrains AI Assistant</strong>, <strong>AWS Kiro</strong>, <strong>Google Antigravity</strong>.
          </p>
        </Callout>

        {/* Interactive Architecture Diagram */}
        <h3 id="architecture-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Architecture Overview
        </h3>

        <p className="text-muted-foreground">
          Cursor is a VS Code fork with deep AI integration. At its core, it has a <strong className="text-foreground">context 
          engine</strong> that assembles the right information from multiple sources and sends it to the LLM. 
          Click the components below to explore how they work together.
        </p>

        <CursorArchitectureDiagram />

        {/* Core Features */}
        <h3 id="core-features" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Core Features
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Codebase Indexing</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Semantic search across your entire project. Find code by meaning, not just text.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Tab Completion</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Context-aware autocomplete that understands your codebase patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Inline Edits (Cmd+K)</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Quick edits in context. Select code, describe change, apply.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Multi-File Composer</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Coordinated changes across multiple files in a single operation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Points */}
        <h3 id="integration-points" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Integration Points
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context Sources</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>@-mentioned files and folders</li>
                <li>Terminal output as context</li>
                <li>Git diffs and history</li>
                <li>@docs documentation fetching</li>
                <li>@web internet search results</li>
                <li>Image/screenshot input</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Output Actions</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Code diffs with apply/reject</li>
                <li>File creation and deletion</li>
                <li>Terminal command execution</li>
                <li>Multi-file coordinated edits</li>
                <li>Checkpoints and rollback</li>
                <li>Background task queuing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Understanding Context Flow">
          <p className="m-0">
            The key insight is that Cursor (and similar tools) are <strong>context orchestrators</strong>. 
            They don&apos;t just send your prompt to the LLM—they assemble a rich context from multiple sources: 
            your rules, relevant code, conversation history, and external data. The quality of this assembly 
            directly determines output quality.
          </p>
        </Callout>

        {/* Data Flow Example */}
        <h3 id="data-flow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Data Flow Example
        </h3>

        <p className="text-muted-foreground">
          When you ask &quot;Fix the bug in handleSubmit&quot;, here&apos;s what happens behind the scenes:
        </p>

        <div className="my-6 p-4 rounded-xl bg-card border border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-medium shrink-0">1</div>
              <div className="flex-1 p-2 rounded bg-muted/30 text-sm">
                <span className="text-muted-foreground">Query the <span className="text-cyan-400">codebase index</span> for &quot;handleSubmit&quot; → finds relevant files</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium shrink-0">2</div>
              <div className="flex-1 p-2 rounded bg-muted/30 text-sm">
                <span className="text-muted-foreground">Load matching <span className="text-emerald-400">rules</span> based on file paths (e.g., React patterns)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-medium shrink-0">3</div>
              <div className="flex-1 p-2 rounded bg-muted/30 text-sm">
                <span className="text-muted-foreground"><span className="text-violet-400">Context engine</span> assembles: rules + code + current file + conversation</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-medium shrink-0">4</div>
              <div className="flex-1 p-2 rounded bg-muted/30 text-sm">
                <span className="text-muted-foreground">Send to <span className="text-amber-400">LLM</span> → receive streamed response with code changes</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs font-medium shrink-0">5</div>
              <div className="flex-1 p-2 rounded bg-muted/30 text-sm">
                <span className="text-muted-foreground"><span className="text-pink-400">Editor bridge</span> parses response, presents diff for your review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive: Connecting to Guide Concepts */}
        <h3 id="concepts-connection" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Deep Dive: Cursor Through the Lens of This Guide
        </h3>

        <p className="text-muted-foreground">
          Cursor is a practical implementation of nearly every concept covered in this guide. Understanding 
          these connections helps you use Cursor more effectively and recognize how the patterns transfer 
          to other AI systems.
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Context Engineering (Part 2)</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Cursor&apos;s context engine is <strong className="text-foreground">context engineering in action</strong>. 
                Every concept from Part 2 applies:
              </p>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Signal over Noise:</strong> @-mentions let you explicitly include relevant files, avoiding context pollution</li>
                <li><strong className="text-foreground">Layered Context:</strong> Rules (system prompt) → codebase (retrieved context) → conversation → current request</li>
                <li><strong className="text-foreground">Cache Optimization:</strong> Static rules at the start, dynamic content after—maximizing prefix cache hits</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">RAG & Embeddings (Part 4)</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                The codebase index is a <strong className="text-foreground">vector database</strong> of your code:
              </p>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Chunking:</strong> Code is split into semantic chunks (functions, classes)</li>
                <li><strong className="text-foreground">Embeddings:</strong> Each chunk is embedded for semantic search</li>
                <li><strong className="text-foreground">Retrieval:</strong> @codebase queries find similar code by meaning, not keywords</li>
                <li><strong className="text-foreground">RAG Pipeline:</strong> Retrieved code is injected into the LLM context</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Tools & Agentic Loop (Part 3)</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Agent mode is a <strong className="text-foreground">full agentic loop</strong> with tools:
              </p>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Tools:</strong> File read/write, terminal execution, web search, docs fetch</li>
                <li><strong className="text-foreground">Observe-Think-Act:</strong> Agent reads code → decides change → executes → observes result</li>
                <li><strong className="text-foreground">Structured Outputs:</strong> LLM produces structured diffs that Cursor applies</li>
                <li><strong className="text-foreground">Stopping Conditions:</strong> Agent iterates until task complete or user intervenes</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">Skills & Progressive Discovery (Part 5)</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Cursor rules implement <strong className="text-foreground">skill-based architecture</strong>:
              </p>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Modular Skills:</strong> Each .mdc rule is a skill with instructions, examples, constraints</li>
                <li><strong className="text-foreground">Progressive Loading:</strong> Rules load based on file globs—only relevant skills activated</li>
                <li><strong className="text-foreground">Agent-Requestable:</strong> Some rules are available on-demand (agent_requestable)</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Safety & Human-in-Loop (Part 6)</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Cursor implements <strong className="text-foreground">safety boundaries</strong>:
              </p>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Human-in-Loop:</strong> Diffs require explicit acceptance; you review before applying</li>
                <li><strong className="text-foreground">Checkpoints:</strong> Rollback points let you undo agent actions</li>
                <li><strong className="text-foreground">Terminal Approval:</strong> Agent mode asks permission for certain commands</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Key Insight">
          <p className="m-0">
            Cursor isn&apos;t magic—it&apos;s <strong>systematically applied AI engineering principles</strong>. 
            Every feature maps to concepts in this guide: context engineering, RAG, tools, agentic loops, 
            skills, and safety patterns. Understanding these connections lets you use Cursor more effectively 
            and build similar systems yourself.
          </p>
        </Callout>

        <Callout variant="info" title="Alternative Tools">
          <p className="m-0">
            <strong>Windsurf:</strong> Similar AI-native IDE with different UX choices • 
            <strong>Zed:</strong> Performance-focused editor with AI features • 
            <strong>VS Code + Copilot:</strong> Familiar environment with AI add-on • 
            <strong>JetBrains AI:</strong> IDE-integrated AI for JetBrains users
          </p>
        </Callout>
      </div>
    </section>
  );
}
