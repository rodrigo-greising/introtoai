"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type TaskStatus = "pending" | "running" | "completed";
type DAGType = "static" | "dynamic";

interface ContextDetail {
  label: string;
  value: string;
  type: "system" | "tools" | "input" | "state" | "output";
}

interface Task {
  id: string;
  name: string;
  description: string;
  shortLabel: string;
  dependencies: string[];
  duration: number;
  column: number;
  row: number;
  context?: ContextDetail[];
}

interface TaskState extends Task {
  status: TaskStatus;
  startTime?: number;
}

interface DAGScenario {
  id: string;
  name: string;
  description: string;
  type: DAGType;
  typeDescription: string;
  tasks: Task[];
}

// ============================================================================
// Example Scenarios
// ============================================================================

const scenarios: DAGScenario[] = [
  {
    id: "search-mapreduce",
    name: "Search MapReduce",
    description: "Fan-out search results to parallel analyzers, then reduce",
    type: "static",
    typeDescription: "Statically defined workflow—the graph shape is known at design time. Every search query follows this exact pattern: search → fan-out to N analyzers → synthesize results.",
    tasks: [
      {
        id: "query",
        name: "Parse Query",
        shortLabel: "Query",
        description: "Parse and expand the user's search query into search terms",
        dependencies: [],
        duration: 400,
        column: 0,
        row: 2,
        context: [
          { label: "System", value: "Query parser prompt: Extract intent, entities, and generate search variants", type: "system" },
          { label: "Input", value: "Raw user query: \"How do I optimize React renders?\"", type: "input" },
          { label: "Output", value: "Structured query object with terms, filters, and synonyms", type: "output" },
        ],
      },
      {
        id: "search",
        name: "Execute Search",
        shortLabel: "Search",
        description: "Run search against the index, retrieve top 10 results",
        dependencies: ["query"],
        duration: 800,
        column: 1,
        row: 2,
        context: [
          { label: "System", value: "Search executor—no LLM needed, pure retrieval", type: "system" },
          { label: "Input", value: "Parsed query terms: [\"react\", \"optimize\", \"render\", \"performance\"]", type: "input" },
          { label: "State", value: "Vector DB connection, BM25 index access", type: "state" },
          { label: "Output", value: "Top 10 document chunks with metadata and scores", type: "output" },
        ],
      },
      {
        id: "analyze-1",
        name: "Analyze Result 1",
        shortLabel: "Doc 1",
        description: "Extract key information and relevance score from document 1",
        dependencies: ["search"],
        duration: 1200,
        column: 2,
        row: 0,
        context: [
          { label: "System", value: "Document analyzer: Extract claims, assess relevance, identify citations", type: "system" },
          { label: "Input", value: "Doc: \"React.memo prevents re-renders by memoizing...\" (~800 tokens)", type: "input" },
          { label: "Tools", value: "extract_claims(), score_relevance(), find_citations()", type: "tools" },
          { label: "Output", value: "Structured analysis: { claims: [...], relevance: 0.92, citations: [...] }", type: "output" },
        ],
      },
      {
        id: "analyze-2",
        name: "Analyze Result 2",
        shortLabel: "Doc 2",
        description: "Extract key information and relevance score from document 2",
        dependencies: ["search"],
        duration: 1000,
        column: 2,
        row: 1,
        context: [
          { label: "System", value: "Document analyzer: Extract claims, assess relevance, identify citations", type: "system" },
          { label: "Input", value: "Doc: \"useMemo and useCallback are hooks for...\" (~650 tokens)", type: "input" },
          { label: "Tools", value: "extract_claims(), score_relevance(), find_citations()", type: "tools" },
          { label: "Output", value: "Structured analysis: { claims: [...], relevance: 0.87, citations: [...] }", type: "output" },
        ],
      },
      {
        id: "analyze-3",
        name: "Analyze Result 3",
        shortLabel: "Doc 3",
        description: "Extract key information and relevance score from document 3",
        dependencies: ["search"],
        duration: 1400,
        column: 2,
        row: 2,
        context: [
          { label: "System", value: "Document analyzer: Extract claims, assess relevance, identify citations", type: "system" },
          { label: "Input", value: "Doc: \"Virtual DOM diffing algorithm compares...\" (~920 tokens)", type: "input" },
          { label: "Tools", value: "extract_claims(), score_relevance(), find_citations()", type: "tools" },
          { label: "Output", value: "Structured analysis: { claims: [...], relevance: 0.78, citations: [...] }", type: "output" },
        ],
      },
      {
        id: "analyze-4",
        name: "Analyze Result 4",
        shortLabel: "Doc 4",
        description: "Extract key information and relevance score from document 4",
        dependencies: ["search"],
        duration: 900,
        column: 2,
        row: 3,
        context: [
          { label: "System", value: "Document analyzer: Extract claims, assess relevance, identify citations", type: "system" },
          { label: "Input", value: "Doc: \"React DevTools Profiler helps identify...\" (~450 tokens)", type: "input" },
          { label: "Tools", value: "extract_claims(), score_relevance(), find_citations()", type: "tools" },
          { label: "Output", value: "Structured analysis: { claims: [...], relevance: 0.82, citations: [...] }", type: "output" },
        ],
      },
      {
        id: "analyze-5",
        name: "Analyze Result 5",
        shortLabel: "Doc 5",
        description: "Extract key information and relevance score from document 5",
        dependencies: ["search"],
        duration: 1100,
        column: 2,
        row: 4,
        context: [
          { label: "System", value: "Document analyzer: Extract claims, assess relevance, identify citations", type: "system" },
          { label: "Input", value: "Doc: \"Code splitting with React.lazy reduces...\" (~580 tokens)", type: "input" },
          { label: "Tools", value: "extract_claims(), score_relevance(), find_citations()", type: "tools" },
          { label: "Output", value: "Structured analysis: { claims: [...], relevance: 0.71, citations: [...] }", type: "output" },
        ],
      },
      {
        id: "synthesize",
        name: "Synthesize Answer",
        shortLabel: "Synthesize",
        description: "Combine analyzed results into a coherent, cited response",
        dependencies: ["analyze-1", "analyze-2", "analyze-3", "analyze-4", "analyze-5"],
        duration: 1500,
        column: 3,
        row: 2,
        context: [
          { label: "System", value: "Synthesizer: Combine analyses into coherent answer with proper citations", type: "system" },
          { label: "Input", value: "5 structured analyses (~400 tokens total)—NOT the original documents", type: "input" },
          { label: "State", value: "Original query for reference, citation format requirements", type: "state" },
          { label: "Output", value: "Final answer with inline citations: \"To optimize React renders: 1) Use React.memo [1]...\"", type: "output" },
        ],
      },
    ],
  },
  {
    id: "coding-agent",
    name: "Coding Agent",
    description: "Agent-planned feature implementation with dependency analysis",
    type: "dynamic",
    typeDescription: "Dynamically generated plan—the agent analyzes the task and creates a DAG. The orchestrator validates the plan is acyclic and connected before execution. Each run may produce a different graph based on the specific task.",
    tasks: [
      {
        id: "plan",
        name: "Generate Plan",
        shortLabel: "Plan",
        description: "Analyze the feature request and decompose into subtasks with dependencies",
        dependencies: [],
        duration: 1200,
        column: 0,
        row: 1.5,
        context: [
          { label: "System", value: "Planning agent: Decompose task into subtasks, identify dependencies, output DAG structure", type: "system" },
          { label: "Input", value: "Feature request: \"Add user notifications with email and in-app delivery\"", type: "input" },
          { label: "State", value: "Codebase summary, existing patterns, tech stack constraints", type: "state" },
          { label: "Tools", value: "analyze_codebase(), list_patterns(), estimate_complexity()", type: "tools" },
          { label: "Output", value: "DAG definition: { nodes: [...], edges: [...], parallelizable: true }", type: "output" },
        ],
      },
      {
        id: "validate",
        name: "Validate DAG",
        shortLabel: "Validate",
        description: "Check plan is acyclic, connected, and all dependencies are satisfiable",
        dependencies: ["plan"],
        duration: 200,
        column: 1,
        row: 1.5,
        context: [
          { label: "System", value: "DAG validator—deterministic code, no LLM needed", type: "system" },
          { label: "Input", value: "Proposed DAG from planner", type: "input" },
          { label: "State", value: "Graph algorithms: topological sort, cycle detection, connectivity check", type: "state" },
          { label: "Output", value: "Validation result: { valid: true, executionOrder: [...] } or { valid: false, error: '...' }", type: "output" },
        ],
      },
      {
        id: "schema",
        name: "Define Schema",
        shortLabel: "Schema",
        description: "Create TypeScript interfaces and database schema for the new feature",
        dependencies: ["validate"],
        duration: 800,
        column: 2,
        row: 0,
        context: [
          { label: "System", value: "Schema designer: Create types and DB schema following project conventions", type: "system" },
          { label: "Input", value: "Task: Define notification data structures", type: "input" },
          { label: "State", value: "Existing types, DB ORM patterns, naming conventions from codebase", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), run_typescript()", type: "tools" },
          { label: "Output", value: "New files: types/notification.ts, prisma/schema additions", type: "output" },
        ],
      },
      {
        id: "api",
        name: "Implement API",
        shortLabel: "API",
        description: "Build REST endpoints for the feature (depends on schema)",
        dependencies: ["schema"],
        duration: 1400,
        column: 3,
        row: 0,
        context: [
          { label: "System", value: "API implementer: Build endpoints following REST conventions", type: "system" },
          { label: "Input", value: "Task: Create notification CRUD + delivery endpoints", type: "input" },
          { label: "State", value: "Schema types from prior step, existing API patterns, auth middleware", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), run_tests(), grep_codebase()", type: "tools" },
          { label: "Output", value: "New files: api/notifications/route.ts, services/notification.ts", type: "output" },
        ],
      },
      {
        id: "ui-types",
        name: "Generate Types",
        shortLabel: "Types",
        description: "Generate frontend TypeScript types from schema",
        dependencies: ["schema"],
        duration: 400,
        column: 3,
        row: 1,
        context: [
          { label: "System", value: "Type generator: Transform backend schema to frontend types", type: "system" },
          { label: "Input", value: "Backend types from schema step", type: "input" },
          { label: "Tools", value: "codegen script execution, file writes", type: "tools" },
          { label: "Output", value: "Generated: src/types/api/notifications.ts with request/response types", type: "output" },
        ],
      },
      {
        id: "config",
        name: "Update Config",
        shortLabel: "Config",
        description: "Add feature flags and configuration (independent of schema)",
        dependencies: ["validate"],
        duration: 600,
        column: 2,
        row: 3,
        context: [
          { label: "System", value: "Config updater: Add feature flags and environment variables", type: "system" },
          { label: "Input", value: "Task: Add notification feature toggles and delivery settings", type: "input" },
          { label: "State", value: "Existing config patterns, feature flag system", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), validate_env()", type: "tools" },
          { label: "Output", value: "Updated: config/features.ts, .env.example", type: "output" },
        ],
      },
      {
        id: "ui",
        name: "Build UI",
        shortLabel: "UI",
        description: "Create React components using generated types",
        dependencies: ["ui-types", "config"],
        duration: 1800,
        column: 4,
        row: 1.5,
        context: [
          { label: "System", value: "UI builder: Create React components following design system", type: "system" },
          { label: "Input", value: "Task: Build notification center, preferences panel, toast system", type: "input" },
          { label: "State", value: "Generated types, design system components, feature flags from config", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), component library access", type: "tools" },
          { label: "Output", value: "New components: NotificationCenter, NotificationPrefs, NotificationToast", type: "output" },
        ],
      },
      {
        id: "integrate",
        name: "Integration",
        shortLabel: "Integrate",
        description: "Connect UI to API, wire up state management",
        dependencies: ["api", "ui"],
        duration: 1000,
        column: 5,
        row: 0.75,
        context: [
          { label: "System", value: "Integration specialist: Wire UI to API, set up state management", type: "system" },
          { label: "Input", value: "Task: Connect components to endpoints, add real-time updates", type: "input" },
          { label: "State", value: "API endpoints from api step, UI components from ui step, state patterns", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), run_dev_server()", type: "tools" },
          { label: "Output", value: "Updated hooks, API client methods, WebSocket integration", type: "output" },
        ],
      },
      {
        id: "test",
        name: "Write Tests",
        shortLabel: "Test",
        description: "Generate unit and integration tests for all components",
        dependencies: ["integrate"],
        duration: 1200,
        column: 6,
        row: 0.75,
        context: [
          { label: "System", value: "Test writer: Generate comprehensive tests for new feature", type: "system" },
          { label: "Input", value: "Task: Test notification system end-to-end", type: "input" },
          { label: "State", value: "All implemented files, existing test patterns, coverage requirements", type: "state" },
          { label: "Tools", value: "read_file(), write_file(), run_tests(), coverage_report()", type: "tools" },
          { label: "Output", value: "Test files: *.test.ts for API, components, integration", type: "output" },
        ],
      },
    ],
  },
  {
    id: "rag-pipeline",
    name: "RAG Pipeline",
    description: "Retrieval-augmented generation with parallel chunk processing",
    type: "static",
    typeDescription: "Statically defined retrieval pattern—query understanding, parallel retrieval from multiple sources, reranking, and generation. The structure is fixed; only the content varies.",
    tasks: [
      {
        id: "understand",
        name: "Query Understanding",
        shortLabel: "Understand",
        description: "Parse query intent, extract entities, identify information need",
        dependencies: [],
        duration: 600,
        column: 0,
        row: 1.5,
        context: [
          { label: "System", value: "Query analyzer: Identify intent, extract entities, classify query type", type: "system" },
          { label: "Input", value: "Raw query: \"What's the refund policy for enterprise plans?\"", type: "input" },
          { label: "Output", value: "{ intent: 'policy_lookup', entities: ['refund', 'enterprise'], type: 'factual' }", type: "output" },
        ],
      },
      {
        id: "rewrite",
        name: "Query Rewrite",
        shortLabel: "Rewrite",
        description: "Generate multiple query variations for better recall",
        dependencies: ["understand"],
        duration: 500,
        column: 1,
        row: 0.5,
        context: [
          { label: "System", value: "Query expander: Generate semantic variations and related phrasings", type: "system" },
          { label: "Input", value: "Structured query with intent and entities", type: "input" },
          { label: "Output", value: "Queries: [\"enterprise refund policy\", \"cancel enterprise subscription\", \"money back guarantee business\"]", type: "output" },
        ],
      },
      {
        id: "embed",
        name: "Generate Embeddings",
        shortLabel: "Embed",
        description: "Create vector embeddings for semantic search",
        dependencies: ["understand"],
        duration: 300,
        column: 1,
        row: 2.5,
        context: [
          { label: "System", value: "Embedding model: text-embedding-3-small (no LLM, deterministic)", type: "system" },
          { label: "Input", value: "Original query text", type: "input" },
          { label: "Output", value: "1536-dimensional vector for similarity search", type: "output" },
        ],
      },
      {
        id: "vector-search",
        name: "Vector Search",
        shortLabel: "Vector",
        description: "Retrieve semantically similar chunks from vector DB",
        dependencies: ["embed"],
        duration: 400,
        column: 2,
        row: 2,
        context: [
          { label: "System", value: "Vector DB query—pure retrieval, no LLM", type: "system" },
          { label: "Input", value: "Query embedding vector", type: "input" },
          { label: "State", value: "Pinecone/Weaviate index with 50k document chunks", type: "state" },
          { label: "Output", value: "Top 20 chunks by cosine similarity with scores", type: "output" },
        ],
      },
      {
        id: "keyword-search",
        name: "Keyword Search",
        shortLabel: "Keyword",
        description: "BM25 keyword search for exact matches",
        dependencies: ["rewrite"],
        duration: 350,
        column: 2,
        row: 0,
        context: [
          { label: "System", value: "BM25 search—lexical matching, no LLM", type: "system" },
          { label: "Input", value: "Rewritten query variations", type: "input" },
          { label: "State", value: "Elasticsearch/OpenSearch index", type: "state" },
          { label: "Output", value: "Top 20 chunks by keyword relevance", type: "output" },
        ],
      },
      {
        id: "graph-search",
        name: "Knowledge Graph",
        shortLabel: "Graph",
        description: "Traverse knowledge graph for related entities",
        dependencies: ["rewrite"],
        duration: 500,
        column: 2,
        row: 1,
        context: [
          { label: "System", value: "Graph traversal—follows entity relationships", type: "system" },
          { label: "Input", value: "Extracted entities: ['refund', 'enterprise']", type: "input" },
          { label: "State", value: "Neo4j knowledge graph with entity relationships", type: "state" },
          { label: "Output", value: "Related nodes: 'billing', 'cancellation', 'SLA', 'support tiers'", type: "output" },
        ],
      },
      {
        id: "rerank",
        name: "Rerank Results",
        shortLabel: "Rerank",
        description: "Cross-encoder reranking to find most relevant chunks",
        dependencies: ["vector-search", "keyword-search", "graph-search"],
        duration: 700,
        column: 3,
        row: 1,
        context: [
          { label: "System", value: "Cross-encoder model: Pairwise relevance scoring (query, chunk) pairs", type: "system" },
          { label: "Input", value: "Original query + ~50 candidate chunks from all sources", type: "input" },
          { label: "State", value: "Reranker model (e.g., Cohere rerank, BGE reranker)", type: "state" },
          { label: "Output", value: "Top 5 chunks sorted by relevance, duplicates removed", type: "output" },
        ],
      },
      {
        id: "generate",
        name: "Generate Response",
        shortLabel: "Generate",
        description: "Synthesize answer from top-k reranked chunks with citations",
        dependencies: ["rerank"],
        duration: 1500,
        column: 4,
        row: 1,
        context: [
          { label: "System", value: "Answer generator: Synthesize response grounded in retrieved context", type: "system" },
          { label: "Input", value: "Original query + top 5 reranked chunks (~2000 tokens)", type: "input" },
          { label: "State", value: "Output format requirements, citation style, confidence thresholds", type: "state" },
          { label: "Output", value: "\"Enterprise plans have a 30-day refund policy [1]. To request a refund...\" with citations", type: "output" },
        ],
      },
    ],
  },
];

// ============================================================================
// Constants
// ============================================================================

const NODE_WIDTH = 100;
const NODE_HEIGHT = 48;
const COLUMN_GAP = 140;
const ROW_GAP = 70;
const PADDING = 40;

const statusColors = {
  pending: {
    bg: "bg-slate-800/50",
    border: "border-slate-600/50",
    text: "text-slate-400",
    nodeBg: "rgba(51, 65, 85, 0.3)",
    nodeStroke: "rgba(100, 116, 139, 0.5)",
  },
  running: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/60",
    text: "text-amber-400",
    nodeBg: "rgba(245, 158, 11, 0.15)",
    nodeStroke: "rgba(245, 158, 11, 0.8)",
  },
  completed: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/60",
    text: "text-emerald-400",
    nodeBg: "rgba(16, 185, 129, 0.15)",
    nodeStroke: "rgba(16, 185, 129, 0.8)",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getNodePosition(task: Task) {
  return {
    x: PADDING + task.column * COLUMN_GAP,
    y: PADDING + task.row * ROW_GAP,
  };
}

function getEdgePath(from: Task, to: Task): string {
  const fromPos = getNodePosition(from);
  const toPos = getNodePosition(to);
  
  const startX = fromPos.x + NODE_WIDTH;
  const startY = fromPos.y + NODE_HEIGHT / 2;
  const endX = toPos.x;
  const endY = toPos.y + NODE_HEIGHT / 2;
  
  const midX = (startX + endX) / 2;
  
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

function calculateDimensions(tasks: Task[]) {
  const maxCol = Math.max(...tasks.map(t => t.column));
  const maxRow = Math.max(...tasks.map(t => t.row));
  return {
    width: PADDING * 2 + maxCol * COLUMN_GAP + NODE_WIDTH,
    height: PADDING * 2 + maxRow * ROW_GAP + NODE_HEIGHT,
  };
}

// ============================================================================
// Component
// ============================================================================

interface OrchestrationDAGVisualizerProps {
  className?: string;
}

export function OrchestrationDAGVisualizer({ className }: OrchestrationDAGVisualizerProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("search-mapreduce");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const scenario = useMemo(
    () => scenarios.find(s => s.id === selectedScenario) || scenarios[0],
    [selectedScenario]
  );

  const { width: svgWidth, height: svgHeight } = useMemo(
    () => calculateDimensions(scenario.tasks),
    [scenario]
  );

  // Initialize tasks when scenario changes
  useEffect(() => {
    setTasks(scenario.tasks.map(task => ({ ...task, status: "pending" })));
    setIsPlaying(false);
    setExecutionTime(0);
  }, [scenario]);

  const reset = useCallback(() => {
    setTasks(scenario.tasks.map(task => ({ ...task, status: "pending" })));
    setIsPlaying(false);
    setExecutionTime(0);
  }, [scenario]);

  const canStart = useCallback((task: TaskState, currentTasks: TaskState[]) => {
    if (task.status !== "pending") return false;
    return task.dependencies.every(depId => {
      const dep = currentTasks.find(t => t.id === depId);
      return dep?.status === "completed";
    });
  }, []);

  // Playback logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setExecutionTime(prev => prev + 50 * playbackSpeed);
      
      setTasks(currentTasks => {
        let updated = false;
        const newTasks = currentTasks.map(task => {
          if (canStart(task, currentTasks)) {
            updated = true;
            return { ...task, status: "running" as TaskStatus, startTime: executionTime };
          }
          
          if (task.status === "running" && task.startTime !== undefined) {
            const elapsed = executionTime - task.startTime;
            if (elapsed >= task.duration / playbackSpeed) {
              updated = true;
              return { ...task, status: "completed" as TaskStatus };
            }
          }
          
          return task;
        });
        
        if (newTasks.every(t => t.status === "completed")) {
          setTimeout(() => setIsPlaying(false), 100);
        }
        
        return updated ? newTasks : currentTasks;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, executionTime, canStart, playbackSpeed]);

  // Start first task(s) immediately when playing begins
  useEffect(() => {
    if (isPlaying && tasks.every(t => t.status === "pending")) {
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.dependencies.length === 0
            ? { ...task, status: "running" as TaskStatus, startTime: 0 }
            : task
        )
      );
    }
  }, [isPlaying, tasks]);

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const runningCount = tasks.filter(t => t.status === "running").length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Scenario Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedScenario === s.id
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Scenario Description */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
        <div className={cn(
          "flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          scenario.type === "static" 
            ? "bg-violet-500/20 text-violet-400" 
            : "bg-amber-500/20 text-amber-400"
        )}>
          {scenario.type === "static" ? "Static DAG" : "Dynamic DAG"}
        </div>
        <div>
          <p className="text-sm text-foreground font-medium mb-1">{scenario.description}</p>
          <p className="text-xs text-muted-foreground m-0">{scenario.typeDescription}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (tasks.every(t => t.status === "completed")) {
                reset();
                setTimeout(() => setIsPlaying(true), 50);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              isPlaying
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
            )}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </>
            ) : tasks.every(t => t.status === "completed") ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Replay
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Play
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-muted/50 border border-border rounded px-2 py-1 text-sm text-foreground"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-muted-foreground">Running ({runningCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Done ({completedCount}/{tasks.length})</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {runningCount > 0 && (
          <div
            className="absolute inset-y-0 bg-amber-500/50 animate-pulse transition-all duration-300"
            style={{ 
              left: `${progress}%`,
              width: `${(runningCount / tasks.length) * 100}%`
            }}
          />
        )}
      </div>

      {/* DAG Visualization */}
      <div className="relative rounded-xl border border-border bg-card/30 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        <div className="overflow-x-auto">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="min-w-full"
            style={{ minHeight: svgHeight }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="rgba(148, 163, 184, 0.5)"
                />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="rgba(16, 185, 129, 0.8)"
                />
              </marker>
              
              <filter id="glow-running" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-completed" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            <g className="edges">
              {tasks.map(task =>
                task.dependencies.map(depId => {
                  const depTask = tasks.find(t => t.id === depId);
                  if (!depTask) return null;
                  
                  const isActive = depTask.status === "completed";
                  const isHighlighted = hoveredTask === task.id || hoveredTask === depId;
                  
                  return (
                    <path
                      key={`${depId}-${task.id}`}
                      d={getEdgePath(depTask, task)}
                      fill="none"
                      stroke={isActive ? "rgba(16, 185, 129, 0.6)" : "rgba(148, 163, 184, 0.3)"}
                      strokeWidth={isHighlighted ? 3 : 2}
                      strokeDasharray={isActive ? "none" : "6 4"}
                      markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                      className="transition-all duration-500"
                      style={{ opacity: isHighlighted ? 1 : 0.8 }}
                    />
                  );
                })
              )}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {tasks.map(task => {
                const pos = getNodePosition(task);
                const colors = statusColors[task.status];
                const isHovered = hoveredTask === task.id;
                
                return (
                  <g
                    key={task.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => setHoveredTask(task.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                    className="cursor-pointer"
                    style={{ 
                      filter: task.status === "running" 
                        ? "url(#glow-running)" 
                        : task.status === "completed" 
                          ? "url(#glow-completed)" 
                          : "none" 
                    }}
                  >
                    <rect
                      x="0"
                      y="0"
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      rx="10"
                      fill={colors.nodeBg}
                      stroke={isHovered ? "rgba(34, 211, 238, 0.8)" : colors.nodeStroke}
                      strokeWidth={isHovered ? 2 : 1.5}
                      className="transition-all duration-300"
                    />
                    
                    {task.status === "running" && (
                      <rect
                        x="-2"
                        y="-2"
                        width={NODE_WIDTH + 4}
                        height={NODE_HEIGHT + 4}
                        rx="12"
                        fill="none"
                        stroke="rgba(245, 158, 11, 0.4)"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                    
                    <circle
                      cx="14"
                      cy="14"
                      r="4"
                      fill={
                        task.status === "completed" ? "#10B981" :
                        task.status === "running" ? "#F59E0B" :
                        "#64748B"
                      }
                      className={task.status === "running" ? "animate-pulse" : ""}
                    />
                    
                    {task.status === "completed" && (
                      <path
                        d="M11.5 14 L13.5 16 L17 12"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    <text
                      x={NODE_WIDTH / 2}
                      y={NODE_HEIGHT / 2 + 4}
                      textAnchor="middle"
                      className="text-[11px] font-medium fill-current"
                      style={{ fill: isHovered ? "#22D3EE" : "#E2E8F0" }}
                    >
                      {task.shortLabel}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Hover tooltip */}
        {hoveredTask && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-10 max-h-[400px] overflow-y-auto">
            {(() => {
              const task = tasks.find(t => t.id === hoveredTask);
              if (!task) return null;
              const colors = statusColors[task.status];
              
              const contextTypeColors = {
                system: "bg-violet-500",
                tools: "bg-cyan-500",
                input: "bg-amber-500",
                state: "bg-blue-500",
                output: "bg-emerald-500",
              };
              
              return (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.status === "completed" && "bg-emerald-500",
                      task.status === "running" && "bg-amber-500 animate-pulse",
                      task.status === "pending" && "bg-slate-500"
                    )} />
                    <h4 className="font-semibold text-foreground text-sm">{task.name}</h4>
                    <span className={cn(
                      "ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider",
                      colors.bg, colors.text
                    )}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.duration}ms
                    </span>
                    {task.dependencies.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Waits for: {task.dependencies.map(d => tasks.find(t => t.id === d)?.shortLabel).join(", ")}
                      </span>
                    )}
                  </div>
                  
                  {/* Context Details Section */}
                  {task.context && task.context.length > 0 && (
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-3.5 h-3.5 text-[var(--highlight)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Context for this step</span>
                      </div>
                      <div className="space-y-2">
                        {task.context.map((ctx, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                              contextTypeColors[ctx.type]
                            )} />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-medium text-foreground">{ctx.label}:</span>
                              <p className="text-[10px] text-muted-foreground m-0 leading-relaxed break-words">{ctx.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Context legend */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-border/50">
                        <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> System
                        </span>
                        <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Input
                        </span>
                        <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tools
                        </span>
                        <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> State
                        </span>
                        <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Output
                        </span>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Key insight callout */}
      <div className={cn(
        "rounded-lg p-4 border",
        scenario.type === "static" 
          ? "bg-violet-500/5 border-violet-500/20" 
          : "bg-amber-500/5 border-amber-500/20"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
            scenario.type === "static" ? "bg-violet-500/20" : "bg-amber-500/20"
          )}>
            {scenario.type === "static" ? (
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className={cn(
              "font-medium mb-1",
              scenario.type === "static" ? "text-violet-400" : "text-amber-400"
            )}>
              {scenario.type === "static" ? "Static Workflow Pattern" : "Dynamic Planning Pattern"}
            </h4>
            <p className="text-sm text-muted-foreground m-0">
              {scenario.type === "static" ? (
                <>
                  <strong className="text-foreground">Static DAGs</strong> are defined at design time. 
                  The graph structure is fixed—only the data flowing through it changes. This is ideal 
                  for repeatable workflows like search, RAG, or ETL pipelines where the execution 
                  pattern is known in advance.
                </>
              ) : (
                <>
                  <strong className="text-foreground">Dynamic DAGs</strong> are generated at runtime 
                  by an LLM planner. The orchestrator must <em>validate</em> the plan before execution: 
                  check for cycles, verify all dependencies exist, ensure the graph is connected. This 
                  enables flexible, task-specific parallelization—the core idea behind{" "}
                  <strong className="text-foreground">LLM Compiler</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
