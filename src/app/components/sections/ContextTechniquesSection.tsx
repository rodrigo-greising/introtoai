import { SectionHeading, Card, CardContent, Callout, CodeBlock, OrchestrationDAGVisualizer, OrchestratorWorkerVisualizer } from "@/app/components/ui";

export function ContextTechniquesSection() {
  return (
    <section id="context-techniques" className="scroll-mt-20">
      <SectionHeading
        id="context-techniques-heading"
        title="Context Management Techniques"
        subtitle="Practical patterns for managing context effectively"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The principles we covered establish <strong className="text-foreground">why</strong> context 
          structure matters. Now let's dive into <strong className="text-foreground">how</strong>—the 
          practical techniques and code patterns that put those principles to work.
        </p>

        {/* Orchestration Patterns */}
        <h3 id="orchestration-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Orchestration Patterns
        </h3>

        <p className="text-muted-foreground">
          The most powerful context pattern isn't about managing a single conversation—it's about 
          <strong className="text-foreground"> spawning focused sub-tasks with isolated context</strong>. 
          An orchestrator delegates, workers execute, and only results flow back.
        </p>

        <CodeBlock
          language="typescript"
          filename="orchestrator-worker.ts"
          code={`// Orchestrator: decomposes work, stays clean
async function orchestrate(task: ComplexTask): Promise<Result> {
  const plan = await planSubtasks(task);
  
  // Spawn workers in parallel or series as needed
  const results = await Promise.all(
    plan.subtasks.map(subtask => 
      // Each worker gets focused, isolated context
      spawnWorker({
        task: subtask.description,
        context: subtask.relevantContext,  // Only what's needed
        tools: subtask.allowedTools,
      })
    )
  );
  
  // Orchestrator sees results, NOT intermediate steps
  // No tool calls, no exploration, no dead ends
  return synthesizeResults(results);
}

// Worker: focused context, does the actual work
async function spawnWorker(config: WorkerConfig): Promise<WorkerResult> {
  const workerSession = createFreshSession();
  
  // Build focused context for this specific task
  const context = assembleContext({
    systemPrompt: WORKER_SYSTEM_PROMPT,
    task: config.task,
    relevantContext: config.context,  // Curated, not everything
    tools: config.tools,
  });
  
  // Worker runs 5-15 messages, iterates, uses tools
  // This could be a smaller, cheaper, faster model
  let result = await workerSession.run(context);
  
  // Return ONLY the structured result
  // All intermediate tool calls stay inside the worker
  return {
    output: result.finalOutput,
    summary: result.summary,
    // NOT: result.allMessages, result.toolCalls, etc.
  };
}

// The orchestrator's context stays clean and focused
// Workers can explore, fail, retry—invisible to orchestrator`}
        />

        <Callout variant="tip" title="Why This Works">
          <p className="m-0">
            The orchestrator never sees the 47 tool calls the worker made exploring the codebase. 
            It sees: <em>"Task: find auth bug. Result: fixed in auth/session.ts line 42."</em> This 
            is <strong>signal over noise</strong> applied at the architecture level.
          </p>
        </Callout>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Parallel Delegation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Independent subtasks run simultaneously. "Research API options" and "audit current usage" 
                can happen in parallel—each with clean, focused context.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Serial Delegation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Dependent subtasks run in sequence. Worker 1's output becomes part of Worker 2's context. 
                Each step gets exactly the context it needs from prior steps.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orchestrator-Worker Visualization */}
        <h4 className="text-lg font-medium mt-8 mb-4">Interactive: Context Isolation in Action</h4>
        
        <p className="text-muted-foreground mb-4">
          Watch how the <strong className="text-foreground">orchestrator maintains a clean, global context</strong> while 
          workers operate in <strong className="text-foreground">isolated sessions with focused context</strong>. The key insight: 
          worker exploration (tool calls, file reads, dead ends) never pollutes the orchestrator's conversation. 
          <strong className="text-foreground"> Hover over any message</strong> to see exactly what's in its context.
        </p>

        <OrchestratorWorkerVisualizer className="mt-6 mb-8" />

        {/* DAG Orchestration Visualizer */}
        <h4 className="text-lg font-medium mt-8 mb-4">Interactive: DAG-Based Task Orchestration</h4>
        
        <p className="text-muted-foreground mb-4">
          Task orchestration can be modeled as a <strong className="text-foreground">directed acyclic graph (DAG)</strong> where 
          nodes are subtasks and edges represent dependencies. The orchestrator executes tasks in <strong className="text-foreground">maximally 
          parallel fashion</strong>—each task starts the instant its dependencies complete.
        </p>

        <p className="text-muted-foreground mb-4">
          DAGs can be <strong className="text-foreground">statically defined</strong> (workflow patterns known at design time) 
          or <strong className="text-foreground">dynamically generated</strong> (agent plans a task-specific graph at runtime). 
          Explore both patterns below—press <strong className="text-foreground">Play</strong> to watch parallel execution unfold.
          <strong className="text-foreground"> Hover over any node</strong> to see the specific context that step receives: 
          system prompts, inputs, available tools, and expected outputs.
        </p>

        <OrchestrationDAGVisualizer className="mt-6 mb-8" />

        {/* System Architecture Patterns */}
        <h3 id="system-architecture-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          System Architecture Patterns
        </h3>

        <p className="text-muted-foreground">
          Different system types require different context strategies. The key: <strong className="text-foreground">match 
          context architecture to the problem shape</strong>.
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">💬 Conversational Systems</h4>
              <p className="text-sm text-muted-foreground m-0">
                History grows → summarize older exchanges → keep recent turns intact. The challenge 
                is balancing continuity with token limits. Use rolling summaries for history beyond 
                the recent window.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🎭 Multi-Agent Orchestration</h4>
              <p className="text-sm text-muted-foreground m-0">
                Big model orchestrates, smaller models execute. Each worker gets fresh, focused context 
                scoped to its task. Workers return results only—intermediate exploration stays isolated. 
                Enables parallel execution and cost optimization.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🤖 Tool-Using Agents</h4>
              <p className="text-sm text-muted-foreground m-0">
                Tool schemas stay stable (cache-friendly), only tool <em>results</em> vary. Heavy 
                instruction sets and tool definitions form a large, stable prefix reused across every 
                tool call iteration.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">📚 RAG Systems</h4>
              <p className="text-sm text-muted-foreground m-0">
                Retrieved documents form dynamic context. Order matters: most relevant chunks closest 
                to the query (recency effect). Consider caching frequently-accessed chunks as part of 
                your stable prefix.
              </p>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          language="typescript"
          filename="putting-it-together.ts"
          code={`// The context engineering equation
function buildOptimalContext(request: Request): Context {
  return {
    // Layered by volatility (cache-friendly)
    // Separated concerns (secure)
    system: STATIC_SYSTEM_PROMPT,      // Layer 1
    tools: STATIC_TOOL_SCHEMAS,        // Layer 2
    
    // Signal over noise (high density)
    // Dynamic relevance (curated)
    knowledge: retrieveRelevant(request),  // Layer 3
    history: compressIfNeeded(session),    // Layer 4
    
    // Explicit (self-contained)
    // Compressed without loss
    query: request.message,                // Layer 5
  };
}

// Result: efficient, cacheable, secure, high-quality context`}
        />

        {/* Connection to Foundations */}
        <h3 id="techniques-connection" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Connection to Foundations
        </h3>

        <Callout variant="tip" title="The Through-Line">
          <p className="mb-2">
            <strong>Mental Model:</strong> Each AI instance is a stateless function. Fresh context 
            each call—which makes orchestration natural: spawn instances for subtasks, combine results.
          </p>
          <p className="mb-2">
            <strong>Caching:</strong> Good context structure = good cache hits. Stable prefixes 
            get reused; this applies to both single conversations and worker instance templates.
          </p>
          <p className="m-0">
            <strong>Orchestration:</strong> The ultimate expression of signal-over-noise: 
            workers do the messy exploration, orchestrators see clean results.
          </p>
        </Callout>

        <p className="text-muted-foreground">
          Context engineering is where theory meets practice. The stateless function mental model 
          tells you <em>why</em> fresh context per call is actually a feature. Caching tells 
          you <em>how</em> to optimize for cost. Orchestration tells you <em>how</em> to scale 
          complexity without scaling context size.
        </p>
      </div>
    </section>
  );
}
