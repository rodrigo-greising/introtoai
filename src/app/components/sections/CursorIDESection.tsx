"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { 
  Code2, 
  Database, 
  FileSearch, 
  MessageSquare, 
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
  const [selectedComponent, setSelectedComponent] = useState<string>("codebase-index");

  const components = [
    {
      id: "codebase-index",
      name: "Codebase Index",
      icon: Database,
      color: "cyan",
      x: 10,
      y: 15,
      description: "Semantic index of your entire codebase. Uses embeddings to enable intelligent code retrieval based on meaning, not just keywords.",
      connections: ["context-engine", "retrieval"],
    },
    {
      id: "context-engine",
      name: "Context Engine",
      icon: BrainCircuit,
      color: "violet",
      x: 50,
      y: 15,
      description: "Orchestrates context assembly. Combines rules, files, conversation history, and retrieved context into optimal prompts for the LLM.",
      connections: ["llm-api"],
    },
    {
      id: "llm-api",
      name: "LLM API",
      icon: Sparkles,
      color: "amber",
      x: 90,
      y: 15,
      description: "Connection to language models (Claude, GPT-4, etc.). Handles streaming, tool calls, and response parsing.",
      connections: [],
    },
    {
      id: "rules-system",
      name: "Rules System",
      icon: FileSearch,
      color: "emerald",
      x: 10,
      y: 55,
      description: "Project-specific instructions in .cursor/rules/. Automatically included based on file globs and alwaysApply settings.",
      connections: ["context-engine"],
    },
    {
      id: "retrieval",
      name: "Semantic Retrieval",
      icon: FolderTree,
      color: "blue",
      x: 30,
      y: 35,
      description: "Finds relevant code based on query semantics. Powers @codebase mentions and automatic context gathering.",
      connections: ["context-engine"],
    },
    {
      id: "editor-bridge",
      name: "Editor Bridge",
      icon: Code2,
      color: "pink",
      x: 50,
      y: 55,
      description: "Translates LLM outputs into editor operations—diffs, insertions, file creation. Handles the 'apply' workflow.",
      connections: ["context-engine"],
    },
    {
      id: "terminal-integration",
      name: "Terminal Integration",
      icon: Terminal,
      color: "orange",
      x: 70,
      y: 55,
      description: "Captures terminal output, enables command execution. Powers agent mode's ability to run and iterate on commands.",
      connections: ["context-engine"],
    },
    {
      id: "external-context",
      name: "External Context",
      icon: Globe,
      color: "rose",
      x: 90,
      y: 55,
      description: "@web searches, @docs documentation fetching, MCP tools. Brings external knowledge into the context window.",
      connections: ["context-engine"],
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Cursor Architecture</h4>
        <span className="text-xs text-muted-foreground">Click components to explore</span>
      </div>

      {/* Diagram */}
      <div className="relative aspect-[16/9] bg-muted/30 rounded-lg border border-border overflow-hidden mb-4">
        {/* Connection lines - drawn first so they appear behind nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {components.map((comp) =>
            comp.connections.map((targetId) => {
              const target = components.find((c) => c.id === targetId);
              if (!target) return null;
              const isActive = selectedComponent === comp.id || selectedComponent === targetId;
              return (
                <line
                  key={`${comp.id}-${targetId}`}
                  x1={`${comp.x + 5}%`}
                  y1={`${comp.y + 8}%`}
                  x2={`${target.x + 5}%`}
                  y2={`${target.y + 8}%`}
                  stroke={isActive ? "var(--highlight)" : "hsl(var(--border))"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? "none" : "4,4"}
                  className="transition-all duration-200"
                />
              );
            })
          )}
        </svg>

        {/* Component nodes */}
        {components.map((comp) => {
          const Icon = comp.icon;
          const colors = colorClasses[comp.color];
          const isSelected = selectedComponent === comp.id;
          const isHovered = hoveredComponent === comp.id;
          const isConnected = selectedComp?.connections.includes(comp.id) ||
            components.find(c => c.id === selectedComponent)?.id === comp.id ||
            comp.connections.includes(selectedComponent);

          return (
            <button
              key={comp.id}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200
                p-2 rounded-lg border cursor-pointer
                ${colors.bg} ${colors.border}
                ${isSelected ? "ring-2 ring-[var(--highlight)] scale-110" : ""}
                ${isHovered ? "scale-105" : ""}
                ${!isSelected && !isConnected ? "opacity-50" : "opacity-100"}
              `}
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              onClick={() => setSelectedComponent(comp.id)}
              onMouseEnter={() => setHoveredComponent(comp.id)}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </button>
          );
        })}

        {/* Labels for nodes */}
        {components.map((comp) => {
          const colors = colorClasses[comp.color];
          const isSelected = selectedComponent === comp.id;
          const isConnected = selectedComp?.connections.includes(comp.id) ||
            comp.connections.includes(selectedComponent);

          return (
            <div
              key={`label-${comp.id}`}
              className={`
                absolute transform -translate-x-1/2 text-[10px] font-medium whitespace-nowrap transition-opacity duration-200
                ${colors.text}
                ${!isSelected && !isConnected ? "opacity-40" : "opacity-100"}
              `}
              style={{ left: `${comp.x}%`, top: `${comp.y + 15}%` }}
            >
              {comp.name}
            </div>
          );
        })}
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
              <span className="text-xs text-muted-foreground">Connects to: </span>
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
