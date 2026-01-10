"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  GitBranch, 
  ArrowRight,
  Plus,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  Circle,
} from "lucide-react";

// =============================================================================
// DAG Builder Visualizer
// =============================================================================

interface DAGNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: "pending" | "running" | "complete";
  dependencies: string[];
}

interface DAGEdge {
  from: string;
  to: string;
}

function DAGBuilderVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState<DAGNode[]>([
    { id: "analyze", label: "Analyze Request", x: 200, y: 40, status: "pending", dependencies: [] },
    { id: "search", label: "Search Docs", x: 100, y: 120, status: "pending", dependencies: ["analyze"] },
    { id: "fetch", label: "Fetch Context", x: 300, y: 120, status: "pending", dependencies: ["analyze"] },
    { id: "generate", label: "Generate Draft", x: 200, y: 200, status: "pending", dependencies: ["search", "fetch"] },
    { id: "review", label: "Review & Edit", x: 200, y: 280, status: "pending", dependencies: ["generate"] },
  ]);

  const edges: DAGEdge[] = [
    { from: "analyze", to: "search" },
    { from: "analyze", to: "fetch" },
    { from: "search", to: "generate" },
    { from: "fetch", to: "generate" },
    { from: "generate", to: "review" },
  ];

  const runDAG = useCallback(async () => {
    setIsRunning(true);
    
    // Reset all nodes
    setNodes(prev => prev.map(n => ({ ...n, status: "pending" as const })));
    
    // Simulate execution
    const executeNode = async (nodeId: string, delay: number) => {
      await new Promise(r => setTimeout(r, delay));
      setNodes(prev => prev.map(n => 
        n.id === nodeId ? { ...n, status: "running" as const } : n
      ));
      await new Promise(r => setTimeout(r, 800));
      setNodes(prev => prev.map(n => 
        n.id === nodeId ? { ...n, status: "complete" as const } : n
      ));
    };

    // Layer 1: analyze
    await executeNode("analyze", 300);
    
    // Layer 2: search and fetch in parallel
    await Promise.all([
      executeNode("search", 100),
      executeNode("fetch", 100),
    ]);
    
    // Layer 3: generate (waits for both)
    await executeNode("generate", 200);
    
    // Layer 4: review
    await executeNode("review", 200);
    
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setNodes(prev => prev.map(n => ({ ...n, status: "pending" as const })));
    setIsRunning(false);
  }, []);

  const getStatusIcon = (status: DAGNode["status"]) => {
    switch (status) {
      case "complete": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "running": return <Clock className="w-4 h-4 text-amber-400 animate-spin" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: DAGNode["status"]) => {
    switch (status) {
      case "complete": return "border-emerald-500/50 bg-emerald-500/10";
      case "running": return "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/30";
      default: return "border-border bg-muted/30";
    }
  };

  const coreLogic = `// Task Decomposition: Break complex tasks into a DAG
interface Task {
  id: string;
  execute: () => Promise<Result>;
  dependencies: string[];
}

async function executeDAG(tasks: Task[]): Promise<Map<string, Result>> {
  const results = new Map<string, Result>();
  const completed = new Set<string>();
  
  // Topological execution - respect dependencies
  while (completed.size < tasks.length) {
    // Find tasks ready to run (all dependencies complete)
    const ready = tasks.filter(task => 
      !completed.has(task.id) &&
      task.dependencies.every(dep => completed.has(dep))
    );
    
    // Execute ready tasks IN PARALLEL
    const batch = await Promise.all(
      ready.map(async (task) => {
        const result = await task.execute();
        return { id: task.id, result };
      })
    );
    
    // Record results
    for (const { id, result } of batch) {
      results.set(id, result);
      completed.add(id);
    }
  }
  
  return results;
}

// Example: Complex document processing
const documentPipeline: Task[] = [
  { id: "analyze", execute: () => analyzeRequest(input), dependencies: [] },
  { id: "search", execute: () => searchDocs(analyzed), dependencies: ["analyze"] },
  { id: "fetch", execute: () => fetchContext(analyzed), dependencies: ["analyze"] },
  { id: "generate", execute: () => generate(search, fetch), dependencies: ["search", "fetch"] },
  { id: "review", execute: () => reviewOutput(generated), dependencies: ["generate"] },
];`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="DAG-Based Task Execution"
      description="Decompose complex tasks and execute with parallelism"
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={runDAG}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              !isRunning
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                : "bg-muted/30 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4" />
            Execute DAG
          </button>
          <button
            onClick={reset}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* DAG Visualization */}
        <div className="relative h-80 rounded-lg bg-muted/20 border border-border overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 320">
            {/* Draw edges */}
            {edges.map((edge) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              
              const fromComplete = from.status === "complete";
              
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y + 20}
                  x2={to.x}
                  y2={to.y - 20}
                  className={cn(
                    "transition-all duration-300",
                    fromComplete ? "stroke-emerald-500/50" : "stroke-border"
                  )}
                  strokeWidth={fromComplete ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker */}
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
                  className="fill-muted-foreground/50"
                />
              </marker>
            </defs>
            
            {/* Draw nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <foreignObject
                  x={node.x - 60}
                  y={node.y - 20}
                  width="120"
                  height="40"
                >
                  <div
                    className={cn(
                      "h-full flex items-center justify-center gap-2 px-3 rounded-lg border text-xs font-medium transition-all",
                      getStatusColor(node.status)
                    )}
                  >
                    {getStatusIcon(node.status)}
                    <span className="text-foreground">{node.label}</span>
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Running</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Complete</span>
          </div>
          <div className="ml-auto text-muted-foreground">
            Notice: &quot;Search&quot; and &quot;Fetch&quot; run in parallel
          </div>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function TaskDecompositionSection() {
  return (
    <section id="task-decomposition" className="scroll-mt-20">
      <SectionHeading
        id="task-decomposition-heading"
        title="Task Decomposition"
        subtitle="Breaking complex tasks into orchestratable units"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Complex AI tasks often require multiple steps that depend on each other. <strong className="text-foreground">Task decomposition</strong> is 
          the practice of breaking work into smaller, independent units that can be orchestrated—sequentially, 
          in parallel, or as a <strong className="text-foreground">directed acyclic graph (DAG)</strong>.
        </p>

        <Callout variant="important" title="Why Decompose?">
          <p className="m-0">
            A single monolithic prompt often fails on complex tasks. Decomposition enables: 
            <strong> parallelism</strong> (run independent tasks concurrently), 
            <strong> caching</strong> (reuse completed sub-tasks), 
            <strong> debugging</strong> (isolate failures), and 
            <strong> cost control</strong> (use cheaper models for simple steps).
          </p>
        </Callout>

        {/* The DAG Model */}
        <h3 id="dag-model" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The DAG Model
        </h3>

        <p className="text-muted-foreground">
          A <strong className="text-foreground">DAG (Directed Acyclic Graph)</strong> represents tasks as nodes 
          and dependencies as edges. Tasks with no unmet dependencies can run in parallel. This is the 
          foundation of most orchestration frameworks.
        </p>

        <InteractiveWrapper
          title="Interactive: DAG Execution"
          description="Watch how tasks execute respecting dependencies"
          icon="🔀"
          colorTheme="cyan"
          minHeight="auto"
        >
          <DAGBuilderVisualizer />
        </InteractiveWrapper>

        {/* Decomposition Strategies */}
        <h3 id="strategies" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Decomposition Strategies
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Functional Decomposition</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Split by function: <code>analyze → plan → execute → verify</code>. 
                    Each step has a clear purpose and can use different models or tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Data Decomposition</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Split by data: process each document, each section, or each user request independently. 
                    Natural fit for map-reduce patterns and batch processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Plus className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Hybrid Decomposition</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Combine both: functionally decompose the pipeline, then parallelize within each stage. 
                    Example: analyze all docs in parallel, then merge results, then generate output.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <h3 id="implementation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Implementation Pattern
        </h3>

        <CodeBlock
          language="typescript"
          filename="task-decomposition.ts"
          code={`// Define tasks with explicit dependencies
interface Task<T = unknown> {
  id: string;
  execute: (deps: Record<string, unknown>) => Promise<T>;
  dependencies: string[];
}

// Example: Research assistant decomposition
const researchPipeline: Task[] = [
  {
    id: "parse_query",
    dependencies: [],
    execute: async () => {
      return await llm.analyze(query, { extractEntities: true });
    }
  },
  {
    id: "search_web",
    dependencies: ["parse_query"],
    execute: async ({ parse_query }) => {
      const entities = parse_query.entities;
      return await Promise.all(
        entities.map(e => webSearch(e)) // Parallel searches
      );
    }
  },
  {
    id: "search_docs",
    dependencies: ["parse_query"],
    execute: async ({ parse_query }) => {
      return await vectorDB.search(parse_query.embedding);
    }
  },
  {
    id: "synthesize",
    dependencies: ["search_web", "search_docs"],
    execute: async ({ search_web, search_docs }) => {
      const context = [...search_web.flat(), ...search_docs];
      return await llm.generate({
        system: "Synthesize research findings",
        context,
        query
      });
    }
  }
];

// Execute respecting dependencies
const results = await executeDAG(researchPipeline, { query });`}
        />

        {/* Benefits */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Benefits of Decomposition</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">⚡ Performance</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Independent tasks run in parallel</li>
                <li>Reduce wall-clock time significantly</li>
                <li>Better resource utilization</li>
                <li>Stream results as they complete</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">💰 Cost Control</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Use cheap models for simple tasks</li>
                <li>Cache expensive computations</li>
                <li>Skip unnecessary branches</li>
                <li>Retry only failed sub-tasks</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🔍 Debuggability</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Inspect intermediate results</li>
                <li>Isolate which step failed</li>
                <li>Replay from any checkpoint</li>
                <li>Unit test individual tasks</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🔄 Flexibility</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Swap implementations per task</li>
                <li>A/B test specific steps</li>
                <li>Add observability hooks</li>
                <li>Compose tasks into new pipelines</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* When to Decompose */}
        <h3 className="text-xl font-semibold mt-10 mb-4">When to Decompose</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Decompose When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Task has independent sub-parts</li>
                <li>Different steps need different capabilities</li>
                <li>You need to parallelize for speed</li>
                <li>Intermediate results are valuable</li>
                <li>Error isolation is important</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">✗ Keep Simple When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Task is inherently sequential</li>
                <li>Single LLM call can handle it</li>
                <li>Overhead exceeds benefit</li>
                <li>Context needs to be preserved</li>
                <li>Debugging is already easy</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Start Simple, Decompose Later">
          <p className="m-0">
            Don&apos;t over-engineer upfront. Start with a simple approach. Decompose when you hit bottlenecks 
            in latency, cost, or debuggability. The right level of decomposition depends on your specific 
            task and scale.
          </p>
        </Callout>

        <Callout variant="info" title="Next: Orchestration Patterns" className="mt-8">
          <p className="m-0">
            Task decomposition defines <em>what</em> to do. <strong>Orchestration patterns</strong> define 
            <em>how</em> to coordinate—routing, retries, fallbacks, and more.
          </p>
        </Callout>
      </div>
    </section>
  );
}
