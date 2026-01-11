"use client";

import { useState, useEffect } from "react";
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
  Table,
  Hash,
  Link2,
  Clock,
  FileJson,
  Braces,
  Wrench,
  ChevronRight,
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
// Production Schema Tables Visualizer
// =============================================================================

interface ObjectType {
  id: string;
  name: string;
  version: string;
  description: string;
  schema: Record<string, string>;
  embedding_dim: number;
  created_at: string;
}

interface ObjectInstance {
  id: string;
  type_id: string;
  type_version: string;
  name: string;
  data: Record<string, unknown>;
  created_at: string;
}

interface Relation {
  id: string;
  from_type: string;
  to_type: string;
  relation_type: string;
  cardinality: string;
}

const sampleObjectTypes: ObjectType[] = [
  {
    id: "creature",
    name: "Creature",
    version: "1.2",
    description: "Any creature or monster in the game",
    schema: {
      name: "string",
      hit_points: "number",
      armor_class: "number",
      challenge_rating: "number",
      abilities: "AbilityScores",
      actions: "Action[]",
    },
    embedding_dim: 1536,
    created_at: "2024-01-15",
  },
  {
    id: "action",
    name: "Action",
    version: "1.0",
    description: "A game action like grappling, casting, or attacking",
    schema: {
      name: "string",
      type: "'attack' | 'spell' | 'skill'",
      dice_roll: "DiceExpression",
      modifiers: "Modifier[]",
      description: "string",
    },
    embedding_dim: 1536,
    created_at: "2024-01-15",
  },
  {
    id: "rule",
    name: "Rule",
    version: "2.1",
    description: "A game rule or mechanic",
    schema: {
      name: "string",
      category: "string",
      text: "string",
      examples: "string[]",
      related_rules: "string[]",
    },
    embedding_dim: 1536,
    created_at: "2024-02-01",
  },
];

const sampleInstances: ObjectInstance[] = [
  {
    id: "goblin-001",
    type_id: "creature",
    type_version: "1.2",
    name: "Goblin",
    data: { hit_points: 7, armor_class: 15, challenge_rating: 0.25 },
    created_at: "2024-03-10",
  },
  {
    id: "troll-001",
    type_id: "creature",
    type_version: "1.2",
    name: "Troll",
    data: { hit_points: 84, armor_class: 15, challenge_rating: 5 },
    created_at: "2024-03-10",
  },
  {
    id: "grapple-001",
    type_id: "action",
    type_version: "1.0",
    name: "Grapple",
    data: { type: "skill", dice_roll: "1d20 + STR + proficiency" },
    created_at: "2024-03-10",
  },
];

const sampleRelations: Relation[] = [
  { id: "rel-1", from_type: "creature", to_type: "action", relation_type: "has_action", cardinality: "1:N" },
  { id: "rel-2", from_type: "action", to_type: "rule", relation_type: "governed_by", cardinality: "N:M" },
  { id: "rel-3", from_type: "creature", to_type: "creature", relation_type: "summons", cardinality: "1:N" },
];

function ProductionSchemaVisualizer() {
  const [activeTable, setActiveTable] = useState<"types" | "instances" | "relations">("types");
  const [selectedType, setSelectedType] = useState<ObjectType | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<ObjectInstance | null>(null);

  const tables = [
    { id: "types", label: "object_types", count: sampleObjectTypes.length, color: "cyan" },
    { id: "instances", label: "object_instances", count: sampleInstances.length, color: "violet" },
    { id: "relations", label: "relations", count: sampleRelations.length, color: "amber" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Table Selector */}
      <div className="flex flex-wrap gap-2">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => {
              setActiveTable(table.id);
              setSelectedType(null);
              setSelectedInstance(null);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all border",
              activeTable === table.id
                ? table.color === "cyan"
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                  : table.color === "violet"
                  ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-muted/20 text-muted-foreground border-border hover:bg-muted/30"
            )}
          >
            <Table className="w-3 h-3" />
            {table.label}
            <span className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px]">{table.count}</span>
          </button>
        ))}
      </div>

      {/* Table View */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Table Header */}
        <div className={cn(
          "px-4 py-2 text-xs font-medium border-b",
          activeTable === "types" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" :
          activeTable === "instances" ? "bg-violet-500/10 text-violet-400 border-violet-500/30" :
          "bg-amber-500/10 text-amber-400 border-amber-500/30"
        )}>
          {activeTable === "types" && (
            <div className="grid grid-cols-6 gap-2">
              <span>id</span>
              <span>name</span>
              <span>version</span>
              <span>schema (JSONB)</span>
              <span>embedding</span>
              <span>created_at</span>
            </div>
          )}
          {activeTable === "instances" && (
            <div className="grid grid-cols-6 gap-2">
              <span>id</span>
              <span>type_id</span>
              <span>type_version</span>
              <span>name</span>
              <span>data (JSONB)</span>
              <span>created_at</span>
            </div>
          )}
          {activeTable === "relations" && (
            <div className="grid grid-cols-5 gap-2">
              <span>id</span>
              <span>from_type</span>
              <span>to_type</span>
              <span>relation_type</span>
              <span>cardinality</span>
            </div>
          )}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border bg-card">
          {activeTable === "types" && sampleObjectTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(selectedType?.id === type.id ? null : type)}
              className={cn(
                "w-full px-4 py-2 text-xs font-mono text-left transition-all hover:bg-muted/30",
                selectedType?.id === type.id && "bg-cyan-500/10"
              )}
            >
              <div className="grid grid-cols-6 gap-2 items-center">
                <span className="text-cyan-400">{type.id}</span>
                <span className="text-foreground">{type.name}</span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">v{type.version}</span>
                </span>
                <span className="text-muted-foreground truncate flex items-center gap-1">
                  <FileJson className="w-3 h-3" />
                  {Object.keys(type.schema).length} fields
                </span>
                <span className="text-muted-foreground">{type.embedding_dim}d</span>
                <span className="text-muted-foreground">{type.created_at}</span>
              </div>
            </button>
          ))}

          {activeTable === "instances" && sampleInstances.map(instance => (
            <button
              key={instance.id}
              onClick={() => setSelectedInstance(selectedInstance?.id === instance.id ? null : instance)}
              className={cn(
                "w-full px-4 py-2 text-xs font-mono text-left transition-all hover:bg-muted/30",
                selectedInstance?.id === instance.id && "bg-violet-500/10"
              )}
            >
              <div className="grid grid-cols-6 gap-2 items-center">
                <span className="text-violet-400">{instance.id}</span>
                <span className="text-cyan-400">{instance.type_id}</span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">v{instance.type_version}</span>
                </span>
                <span className="text-foreground">{instance.name}</span>
                <span className="text-muted-foreground truncate flex items-center gap-1">
                  <FileJson className="w-3 h-3" />
                  {Object.keys(instance.data).length} fields
                </span>
                <span className="text-muted-foreground">{instance.created_at}</span>
              </div>
            </button>
          ))}

          {activeTable === "relations" && sampleRelations.map(rel => (
            <div key={rel.id} className="px-4 py-2 text-xs font-mono">
              <div className="grid grid-cols-5 gap-2 items-center">
                <span className="text-amber-400">{rel.id}</span>
                <span className="text-cyan-400">{rel.from_type}</span>
                <span className="text-cyan-400">{rel.to_type}</span>
                <span className="text-foreground">{rel.relation_type}</span>
                <span className="text-muted-foreground">{rel.cardinality}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Type Detail */}
      {selectedType && (
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-cyan-400">{selectedType.name} Schema</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              v{selectedType.version}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{selectedType.description}</p>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            {Object.entries(selectedType.schema).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-cyan-400">{key}:</span>
                <span className="text-amber-400">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Instances must match this schema version. Version mismatch → validation error.
          </p>
        </div>
      )}

      {/* Selected Instance Detail */}
      {selectedInstance && (
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-violet-400">{selectedInstance.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Type:</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                {selectedInstance.type_id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                v{selectedInstance.type_version}
              </span>
            </div>
          </div>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            {Object.entries(selectedInstance.data).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-violet-400">{key}:</span>
                <span className="text-foreground">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Data validated against {selectedInstance.type_id} v{selectedInstance.type_version} schema
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click rows to see schema/data details. Version matching ensures data integrity.
      </p>
    </div>
  );
}

// =============================================================================
// Dynamic Tool Generation Demo
// =============================================================================

interface ToolGenerationStep {
  id: string;
  label: string;
  description: string;
  color: string;
}

const toolGenerationSteps: ToolGenerationStep[] = [
  { id: "schema", label: "Schema Definition", description: "Object type defines structure", color: "cyan" },
  { id: "validator", label: "Zod Validator", description: "Generated from schema", color: "violet" },
  { id: "tool", label: "Tool Definition", description: "Function with validation", color: "amber" },
  { id: "registry", label: "Tool Registry", description: "Available to agents", color: "emerald" },
];

function DynamicToolGenerationDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"grapple" | "attack" | "cast">("grapple");

  const actionSchemas = {
    grapple: {
      name: "Grapple",
      schema: {
        attacker_id: "string",
        target_id: "string",
        attacker_str: "number",
        attacker_proficiency: "number",
      },
      diceRoll: "1d20 + STR + proficiency",
      toolName: "execute_grapple",
    },
    attack: {
      name: "Melee Attack",
      schema: {
        attacker_id: "string",
        target_id: "string",
        weapon: "string",
        attacker_str: "number",
      },
      diceRoll: "1d20 + STR + proficiency (hit), weapon dice + STR (damage)",
      toolName: "execute_melee_attack",
    },
    cast: {
      name: "Spell Cast",
      schema: {
        caster_id: "string",
        spell_name: "string",
        targets: "string[]",
        spell_level: "number",
      },
      diceRoll: "varies by spell",
      toolName: "cast_spell",
    },
  };

  const currentAction = actionSchemas[selectedAction];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < toolGenerationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep]);

  const runAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-4">
      {/* Action Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(actionSchemas) as Array<keyof typeof actionSchemas>).map(action => (
          <button
            key={action}
            onClick={() => {
              setSelectedAction(action);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className={cn(
              "px-3 py-1.5 rounded text-xs transition-all",
              selectedAction === action
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {actionSchemas[action].name}
          </button>
        ))}
      </div>

      {/* Pipeline Visualization */}
      <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-muted/20 border border-border overflow-x-auto">
        {toolGenerationSteps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all min-w-[100px]",
                i <= currentStep
                  ? step.color === "cyan"
                    ? "bg-cyan-500/20 border-cyan-500/40"
                    : step.color === "violet"
                    ? "bg-violet-500/20 border-violet-500/40"
                    : step.color === "amber"
                    ? "bg-amber-500/20 border-amber-500/40"
                    : "bg-emerald-500/20 border-emerald-500/40"
                  : "bg-muted/10 border-border opacity-40"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                i <= currentStep
                  ? step.color === "cyan"
                    ? "bg-cyan-500/30 text-cyan-400"
                    : step.color === "violet"
                    ? "bg-violet-500/30 text-violet-400"
                    : step.color === "amber"
                    ? "bg-amber-500/30 text-amber-400"
                    : "bg-emerald-500/30 text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium",
                i <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                {step.description}
              </span>
            </div>
            {i < toolGenerationSteps.length - 1 && (
              <ChevronRight className={cn(
                "w-4 h-4 shrink-0 transition-all",
                i < currentStep ? "text-emerald-400" : "text-muted-foreground/30"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Schema / Input */}
        <div className={cn(
          "p-4 rounded-lg border transition-all",
          currentStep >= 0 ? "bg-cyan-500/10 border-cyan-500/30" : "bg-muted/10 border-border opacity-40"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Braces className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-medium text-cyan-400">Schema Definition</h4>
          </div>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            <div className="text-muted-foreground">{`// ${currentAction.name} schema`}</div>
            {Object.entries(currentAction.schema).map(([key, type]) => (
              <div key={key}>
                <span className="text-cyan-400">{key}</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-amber-400">{type}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-muted-foreground">dice: </span>
              <span className="text-emerald-400">&quot;{currentAction.diceRoll}&quot;</span>
            </div>
          </div>
        </div>

        {/* Generated Tool */}
        <div className={cn(
          "p-4 rounded-lg border transition-all",
          currentStep >= 2 ? "bg-amber-500/10 border-amber-500/30" : "bg-muted/10 border-border opacity-40"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-medium text-amber-400">Generated Tool</h4>
          </div>
          <div className="font-mono text-xs p-3 rounded bg-background/50 space-y-1">
            <div className="text-violet-400">function {currentAction.toolName}(</div>
            <div className="pl-4">
              <span className="text-cyan-400">params</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-amber-400">{currentAction.name}Input</span>
            </div>
            <div className="text-violet-400">): <span className="text-amber-400">DiceResult</span> {`{`}</div>
            <div className="pl-4 text-muted-foreground">{"// Validated against schema"}</div>
            <div className="pl-4 text-muted-foreground">{"// Executes dice roll logic"}</div>
            <div className="pl-4 text-muted-foreground">{"// Returns structured result"}</div>
            <div className="text-violet-400">{`}`}</div>
          </div>
        </div>
      </div>

      {/* Registry Status */}
      {currentStep >= 3 && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Tool Registered</span>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
              {currentAction.toolName}()
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tool is now available to all agents with appropriate permissions. Player Assistant can call 
            this tool when a player wants to {currentAction.name.toLowerCase()}.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={runAnimation}
          disabled={isPlaying}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          Generate Tool
        </button>
        <button
          onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Tools are generated automatically from object type schemas. No code changes needed—just define the schema.
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

        {/* Production Schema Patterns */}
        <h3 id="production-schema-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Production Schema Patterns
        </h3>

        <p className="text-muted-foreground">
          In production, your ontology lives in a database with <strong className="text-foreground">three core 
          tables</strong>: object types (schemas), object instances (data), and relations (connections). This 
          structure gives you versioning, validation, and semantic search—all in one system.
        </p>

        <InteractiveWrapper
          title="Interactive: Production Database Schema"
          description="Explore the three core tables: object_types, object_instances, and relations"
          icon="🗄️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <ProductionSchemaVisualizer />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">Why Three Tables?</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Table className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">object_types:</span>{" "}
                <span className="text-muted-foreground">
                  Define <em>what can exist</em>. Each type has a versioned JSON schema, an embedding for 
                  semantic discovery, and validators. When you parse a new action like &quot;grappling&quot;, 
                  you create a type for it.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">object_instances:</span>{" "}
                <span className="text-muted-foreground">
                  Concrete data that <em>matches a type</em>. Each instance references a type and version. 
                  The JSONB data column is validated against the type&apos;s schema. A &quot;Goblin&quot; is an instance 
                  of the &quot;Creature&quot; type.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Link2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">relations:</span>{" "}
                <span className="text-muted-foreground">
                  Define <em>how types connect</em>. Creatures &quot;have_action&quot; Actions. Actions are 
                  &quot;governed_by&quot; Rules. This enables AI to navigate your domain graph and understand 
                  dependencies.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Schema Versioning</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Types have versions (v1.0, v1.2). Instances lock to a version. Update a type? 
                Old instances stay valid. Migrate when ready. No breaking changes.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">JSONB + pgvector</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Flexible JSON storage with full SQL querying. Embeddings enable semantic search. 
                &quot;Find creatures similar to a dragon&quot; works via vector similarity.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-rose-400" />
                <h4 className="font-medium text-foreground">Validation on Insert</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Database triggers validate JSONB data against the referenced type&apos;s schema. 
                Invalid data is rejected. AI can&apos;t create malformed instances.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Audit Trail</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                created_at, updated_at, created_by on every row. Full history of who created 
                what and when. Essential for debugging AI-generated content.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Canonization">
          <p className="m-0">
            When AI extracts data, <strong>canonize it</strong>. &quot;HP&quot;, &quot;hit points&quot;, and &quot;Hit Points&quot; should 
            all map to the same field. Your intake agent should normalize before storing. This ensures 
            consistent data regardless of how different source documents phrase things.
          </p>
        </Callout>

        {/* Dynamic Tool Generation */}
        <h3 id="dynamic-tool-generation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Dynamic Tool Generation
        </h3>

        <p className="text-muted-foreground">
          Here&apos;s the magic: <strong className="text-foreground">object type schemas can automatically 
          generate tools</strong>. Define a &quot;Grapple&quot; action type with its dice roll formula, and the 
          system generates a callable tool that agents can use.
        </p>

        <InteractiveWrapper
          title="Interactive: Tool Generation Pipeline"
          description="Watch how schemas become callable tools for AI agents"
          icon="🔧"
          colorTheme="amber"
          minHeight="auto"
        >
          <DynamicToolGenerationDemo />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">The Generation Pipeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Schema defines structure</strong> — Fields, types, 
                dice expressions stored in object_types
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Zod validator generated</strong> — Type-safe input 
                validation created from schema
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Tool function created</strong> — Wraps validation + 
                execution logic + structured output
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-background/30">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">4</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Registered in tool registry</strong> — Available to 
                agents with appropriate permissions
              </span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          This is <strong className="text-foreground">intake agent architecture</strong>: when you parse 
          a rulebook and discover a new action like &quot;grappling&quot;, the intake agent proposes a schema. 
          A human reviews and approves it. The system then automatically generates the tool, validator, 
          and makes it available to player-facing agents. No deployment required.
        </p>

        <Callout variant="important" title="Human-in-the-Loop for Schema Creation">
          <p className="m-0">
            AI proposes schemas; humans approve them. When the intake agent extracts &quot;grappling&quot; rules 
            and proposes a schema, it goes to a review queue. A human verifies the dice formula is correct, 
            the fields make sense, and the validation rules are appropriate. Only then does it become 
            a live tool. This prevents AI mistakes from contaminating your tool registry.
          </p>
        </Callout>

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
              <strong>Use three tables</strong>—object_types, object_instances, relations for production ontology
            </li>
            <li>
              <strong>Generate tools from schemas</strong>—no code changes needed for new capabilities
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
