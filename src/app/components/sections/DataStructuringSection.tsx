"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import {
  Layers,
  Database,
  Shield,
  Zap,
  GitBranch,
  Box,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Code2,
  Settings,
  Play,
  RefreshCw,
} from "lucide-react";

// =============================================================================
// Ontology Builder Demo
// =============================================================================

interface OntologyEntity {
  id: string;
  name: string;
  type: "entity" | "action" | "relationship";
  description: string;
  properties?: string[];
  actions?: string[];
}

const sampleOntology: OntologyEntity[] = [
  {
    id: "user",
    name: "User",
    type: "entity",
    description: "A user of the system",
    properties: ["id", "email", "role", "preferences"],
    actions: ["create", "update", "deactivate"],
  },
  {
    id: "document",
    name: "Document",
    type: "entity",
    description: "A document stored in the system",
    properties: ["id", "title", "content", "owner_id", "status"],
    actions: ["create", "update", "delete", "share", "publish"],
  },
  {
    id: "permission",
    name: "Permission",
    type: "relationship",
    description: "Links users to documents with access levels",
    properties: ["user_id", "document_id", "access_level"],
  },
  {
    id: "workflow",
    name: "Workflow",
    type: "entity",
    description: "An automated process definition",
    properties: ["id", "name", "steps", "triggers"],
    actions: ["create", "execute", "pause", "resume"],
  },
];

function OntologyBuilder() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"entities" | "actions" | "graph">("entities");

  const typeColors = {
    entity: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400" },
    action: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400" },
    relationship: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
  };

  // Collect all actions across entities
  const allActions = sampleOntology.flatMap(e => 
    (e.actions || []).map(a => ({ entity: e.name, action: a }))
  );

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">View:</span>
        {(["entities", "actions", "graph"] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "px-2 py-1 rounded text-xs transition-all",
              viewMode === mode
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {viewMode === "entities" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {sampleOntology.map(entity => {
            const colors = typeColors[entity.type];
            return (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(selectedEntity === entity.id ? null : entity.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  selectedEntity === entity.id
                    ? `${colors.bg} ${colors.border}`
                    : "bg-muted/20 border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px]", colors.bg, colors.text)}>
                    {entity.type}
                  </span>
                  <span className="font-medium text-foreground">{entity.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{entity.description}</p>
                
                {selectedEntity === entity.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in">
                    {entity.properties && (
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Properties</div>
                        <div className="flex flex-wrap gap-1">
                          {entity.properties.map(p => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] text-foreground">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {entity.actions && (
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Actions</div>
                        <div className="flex flex-wrap gap-1">
                          {entity.actions.map(a => (
                            <span key={a} className="px-1.5 py-0.5 rounded bg-violet-500/20 text-[10px] text-violet-400">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {viewMode === "actions" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Available actions in the system:</p>
          <div className="grid gap-1">
            {allActions.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/20 text-xs">
                <span className="text-cyan-400 font-mono">{item.entity}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-violet-400 font-mono">{item.action}()</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === "graph" && (
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                <span className="text-sm font-medium text-cyan-400">User</span>
              </div>
              <div className="text-[10px] text-muted-foreground">has many</div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/40">
                <span className="text-sm font-medium text-amber-400">Permission</span>
              </div>
              <div className="text-[10px] text-muted-foreground">grants access</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                <span className="text-sm font-medium text-cyan-400">Document</span>
              </div>
              <div className="text-[10px] text-muted-foreground">resource</div>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Relationships define the action plane—what can be done to what
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Agent as Data Structure Demo
// =============================================================================

interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  skills: string[];
  tools: string[];
  constraints: string[];
}

const sampleAgents: AgentDefinition[] = [
  {
    id: "document-analyst",
    name: "Document Analyst",
    description: "Analyzes and summarizes documents",
    skills: ["summarization", "entity-extraction", "sentiment-analysis"],
    tools: ["read_document", "search_documents", "extract_entities"],
    constraints: ["max_tokens: 4000", "no_external_apis", "read_only"],
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description: "Reviews code for issues and improvements",
    skills: ["code-analysis", "security-audit", "style-check"],
    tools: ["read_file", "search_codebase", "run_linter"],
    constraints: ["no_file_writes", "max_files: 10", "timeout: 60s"],
  },
];

function AgentDataStructureDemo() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(sampleAgents[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const simulateExecution = () => {
    setIsRunning(true);
    setLogs([]);
    
    const steps = [
      `Loading agent: ${selectedAgent.name}`,
      `Skills loaded: ${selectedAgent.skills.join(", ")}`,
      `Tools available: ${selectedAgent.tools.length}`,
      `Constraints applied: ${selectedAgent.constraints.length}`,
      `Validating against API schema...`,
      `Ready for execution`,
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (i === steps.length - 1) setIsRunning(false);
      }, (i + 1) * 400);
    });
  };

  return (
    <div className="space-y-4">
      {/* Agent Selector */}
      <div className="flex gap-2">
        {sampleAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-all",
              selectedAgent.id === agent.id
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                : "bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent"
            )}
          >
            {agent.name}
          </button>
        ))}
      </div>

      {/* Agent Definition */}
      <div className="p-4 rounded-lg bg-muted/20 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-foreground">{selectedAgent.name}</h4>
            <p className="text-xs text-muted-foreground">{selectedAgent.description}</p>
          </div>
          <button
            onClick={simulateExecution}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {isRunning ? "Loading..." : "Initialize"}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase mb-2">Skills</div>
            <div className="space-y-1">
              {selectedAgent.skills.map(s => (
                <div key={s} className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono">
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase mb-2">Tools</div>
            <div className="space-y-1">
              {selectedAgent.tools.map(t => (
                <div key={t} className="px-2 py-1 rounded bg-violet-500/10 text-violet-400 text-xs font-mono">
                  {t}()
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase mb-2">Constraints</div>
            <div className="space-y-1">
              {selectedAgent.constraints.map(c => (
                <div key={c} className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Log */}
        {logs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-[10px] text-muted-foreground uppercase mb-2">Execution Log</div>
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Agents defined as data: skills, tools, and constraints are configurable without code changes
      </p>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function DataStructuringSection() {
  return (
    <section id="data-structuring" className="scroll-mt-20">
      <SectionHeading
        id="data-structuring-heading"
        title="Structuring Data for AI"
        subtitle="Making data actionable through ontologies and schemas"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          AI systems don&apos;t just need data—they need <strong className="text-foreground">actionable data</strong>. 
          This means structuring your domain into clear ontologies, defining deterministic APIs, and representing 
          agents themselves as data structures. The goal: AI that operates within well-defined boundaries with 
          predictable, validatable behavior.
        </p>

        <Callout variant="tip" title="The Core Insight">
          <p className="m-0">
            Instead of hardcoding agent behaviors, define them as <strong>data</strong>. Skills, tools, 
            permissions—all configurable. The AI runtime reads these definitions and operates within them. 
            You change behavior by updating data, not code.
          </p>
        </Callout>

        {/* The Data Structure Problem */}
        <h3 id="data-structure-problem" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          The Data Structure Problem
        </h3>

        <p className="text-muted-foreground">
          When building AI systems, you face a fundamental choice: <strong className="text-foreground">how tightly 
          coupled should AI capabilities be to your code?</strong> Hardcoded behaviors are inflexible. Pure 
          prompting is unpredictable. The solution is a middle layer.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h4 className="font-medium text-foreground">Hardcoded Agents</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Tools, skills, and permissions baked into code. Every change requires deployment. 
                Doesn&apos;t scale to many agent types.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Pure Prompting</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                &quot;You are an agent that can...&quot; in the prompt. Flexible but unreliable. No enforcement 
                of constraints. Hard to audit.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight" className="sm:col-span-2">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Data-Driven Agents</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Agent definitions stored as structured data. A generic runtime interprets them. 
                Change behavior via configuration. Deterministic validation. Easy to audit and test.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ontology and Action Planes */}
        <h3 id="ontology-action-planes" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Ontology and Action Planes
        </h3>

        <p className="text-muted-foreground">
          An <strong className="text-foreground">ontology</strong> defines what exists in your system—the entities, 
          their properties, and relationships. The <strong className="text-foreground">action plane</strong> defines 
          what can be done—the operations available on each entity.
        </p>

        <InteractiveWrapper
          title="Interactive: Ontology Builder"
          description="Explore how entities, actions, and relationships form your domain model"
          icon="🏗️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <OntologyBuilder />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">Why This Matters for AI</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Layers className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Bounded Operations:</span>{" "}
                <span className="text-muted-foreground">
                  AI can only perform actions defined in the ontology. &quot;Delete all users&quot; fails if 
                  the action plane doesn&apos;t expose that operation.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Type Safety:</span>{" "}
                <span className="text-muted-foreground">
                  Entity properties have types. AI outputs can be validated against the schema 
                  before execution.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GitBranch className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Relationship Awareness:</span>{" "}
                <span className="text-muted-foreground">
                  AI understands how entities connect. &quot;Share document with user&quot; requires 
                  understanding the Permission relationship.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deterministic API Layer */}
        <h3 id="deterministic-api-layer" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Deterministic API Layer
        </h3>

        <p className="text-muted-foreground">
          Between AI outputs and your system, there should be a <strong className="text-foreground">deterministic 
          API layer</strong>. AI generates intents; the API validates and executes them.
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Code2 className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-cyan-400">Schema Validation</h4>
              <p className="text-sm text-muted-foreground mt-1">
                AI output → Zod/JSON Schema validation → Execution. If the output doesn&apos;t match the 
                expected schema, reject before any side effects occur.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Permission Checking</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Even if AI generates a valid action, the API layer enforces permissions. 
                User role determines what operations actually execute.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-amber-400">Rate Limiting & Quotas</h4>
              <p className="text-sm text-muted-foreground mt-1">
                The API layer enforces resource limits. AI can&apos;t execute 1000 operations in a loop— 
                deterministic guards catch runaway behavior.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-6">
          The API layer defines an action schema with name, entity, parameters, and validation. It provides 
          an execute function that validates the action against the schema, checks permissions for the user 
          role, and only then performs the operation. If validation fails, the action is rejected before 
          any side effects occur.
        </p>

        {/* AI Validation Against APIs */}
        <h3 id="ai-validation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          AI Validation Against APIs
        </h3>

        <p className="text-muted-foreground">
          The key pattern is <strong className="text-foreground">AI proposes, API disposes</strong>. AI 
          generates structured outputs that match your API schema. The API validates and executes—or rejects.
        </p>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">The Validation Flow</h4>
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="p-2 rounded bg-violet-500/20 text-violet-400">AI Output</div>
              <span className="text-muted-foreground">Structured intent</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="p-2 rounded bg-cyan-500/20 text-cyan-400">Schema Check</div>
              <span className="text-muted-foreground">Zod validation</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="p-2 rounded bg-amber-500/20 text-amber-400">Permission</div>
              <span className="text-muted-foreground">RBAC check</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="p-2 rounded bg-emerald-500/20 text-emerald-400">Execute</div>
              <span className="text-muted-foreground">Safe operation</span>
            </div>
          </div>
        </div>

        <Callout variant="important" title="Never Trust Raw AI Output">
          <p className="m-0">
            Even with structured outputs, validate everything. AI can generate syntactically valid JSON that 
            is semantically wrong. The deterministic layer is your safety net—never bypass it.
          </p>
        </Callout>

        {/* Data-Driven Skills */}
        <h3 id="data-driven-skills" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Data-Driven Skills
        </h3>

        <p className="text-muted-foreground">
          Skills—the capabilities your AI can use—should be <strong className="text-foreground">defined as 
          data, not hardcoded</strong>. This enables dynamic composition, A/B testing, and per-user customization.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">Skill Definition</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Each skill has: name, description, system prompt, available tools, output schema. 
                Stored in database or config files.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Box className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground">Skill Registry</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Central registry of all skills. Query by capability, load dynamically. 
                Hot-reload without redeployment.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Skill Versioning</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Version skills like code. Roll back if a new prompt performs worse. 
                A/B test skill variants.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Skill Permissions</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Different users get different skills. Admin users might have &quot;delete&quot; skills; 
                regular users only get &quot;read&quot; skills.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mt-6">
          A skill definition includes id, name, description, systemPrompt, tools (array of tool names), 
          outputSchema (Zod schema), and constraints. The skill registry loads skills from database, 
          provides lookup by name, and returns skill definitions that the runtime uses to configure 
          agent behavior. Updating a skill&apos;s system prompt or tools requires only a database update.
        </p>

        {/* Agents as Data Structures */}
        <h3 id="agents-as-data" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Agents as Data Structures
        </h3>

        <p className="text-muted-foreground">
          The ultimate pattern: <strong className="text-foreground">define entire agents as data</strong>. 
          An agent definition includes its skills, tools, constraints, and permissions—all configurable 
          without code changes.
        </p>

        <InteractiveWrapper
          title="Interactive: Agent Data Structure"
          description="See how agents are defined as data with skills, tools, and constraints"
          icon="🤖"
          colorTheme="violet"
          minHeight="auto"
        >
          <AgentDataStructureDemo />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Agent Definition Schema</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">id</span>
              <span className="text-muted-foreground">Unique identifier for the agent type</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">name</span>
              <span className="text-muted-foreground">Human-readable name</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">skills[]</span>
              <span className="text-muted-foreground">Array of skill IDs this agent can use</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">tools[]</span>
              <span className="text-muted-foreground">Array of tool IDs available to the agent</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">constraints</span>
              <span className="text-muted-foreground">Resource limits, timeouts, access restrictions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono text-xs w-24">model</span>
              <span className="text-muted-foreground">Which LLM model to use (or model alias)</span>
            </div>
          </div>
        </div>

        <Callout variant="tip" title="The Power of Data-Driven Agents">
          <p>
            When agents are data: create new agent types without deployment; A/B test agent configurations; 
            per-customer agent customization; audit trail for all changes; rollback on regression. 
            Your AI system becomes a <strong>platform</strong>, not a fixed application.
          </p>
        </Callout>

        <h3 className="text-xl font-semibold mt-10 mb-4">Implementation Patterns</h3>

        <div className="space-y-4 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Database-Backed Definitions</h4>
              <p className="text-sm text-muted-foreground m-0">
                Store agent, skill, and tool definitions in PostgreSQL or similar. Use JSON columns 
                for flexible schemas. Admin UI for editing definitions. Cache in Redis for runtime performance.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Config File Approach</h4>
              <p className="text-sm text-muted-foreground m-0">
                YAML/JSON files in repo defining agents. Git-versioned changes. CI/CD deploys new 
                configurations. Good for smaller systems or when you want code review for changes.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Hybrid: Config + Database</h4>
              <p className="text-sm text-muted-foreground m-0">
                Core definitions in config files (versioned, reviewed). Runtime overrides in database 
                (feature flags, A/B tests, per-customer). Best of both worlds.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
            <li>
              <strong>Define your ontology</strong>—entities, properties, relationships, and actions
            </li>
            <li>
              <strong>Build a deterministic API layer</strong>—AI proposes, API validates and executes
            </li>
            <li>
              <strong>Store skills as data</strong>—configurable, versionable, testable
            </li>
            <li>
              <strong>Define agents as data structures</strong>—skills, tools, and constraints all configurable
            </li>
            <li>
              <strong>Validate everything</strong>—schema validation is your safety net against AI mistakes
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
