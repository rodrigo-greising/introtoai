import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { OrchestrationVisualizer, OrchestrationCostAnalysis } from "@/app/components/visualizations";

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
          structure matters. Now let&apos;s dive into <strong className="text-foreground">how</strong>—the 
          practical techniques and code patterns that put those principles to work.
        </p>

        {/* Orchestration Patterns */}
        <h3 id="orchestration-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Orchestration Patterns
        </h3>

        <p className="text-muted-foreground">
          The most powerful context pattern isn&apos;t about managing a single conversation—it&apos;s about 
          <strong className="text-foreground"> spawning focused sub-tasks with isolated context</strong>. 
          An orchestrator delegates, workers execute, and only results flow back.
        </p>

        <Callout variant="tip" title="Why This Works">
          <p className="m-0">
            The orchestrator never sees the 47 tool calls the worker made exploring the codebase. 
            It sees: <em>&quot;Task: find auth bug. Result: fixed in auth/session.ts line 42.&quot;</em> This 
            is <strong>signal over noise</strong> applied at the architecture level.
          </p>
        </Callout>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Parallel Delegation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Independent subtasks run simultaneously. &quot;Research API options&quot; and &quot;audit current usage&quot; 
                can happen in parallel—each with clean, focused context.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Serial Delegation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Dependent subtasks run in sequence. Worker 1&apos;s output becomes part of Worker 2&apos;s context. 
                Each step gets exactly the context it needs from prior steps.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Orchestration Visualization */}
        <h4 className="text-lg font-medium mt-8 mb-4">Interactive: Orchestration Patterns</h4>
        
        <p className="text-muted-foreground mb-4">
          Explore two key orchestration patterns side-by-side: <strong className="text-foreground">Search MapReduce</strong> (fan-out 
          to parallel analyzers, then reduce) and <strong className="text-foreground">Orchestrator-Worker</strong> (dynamic 
          delegation with isolated sessions). The <strong className="text-foreground">left panel</strong> shows the simulated 
          chat—messages that would appear as the system executes. The <strong className="text-foreground">right panel</strong> visualizes 
          the same execution as a DAG, showing dependencies and parallel execution.
        </p>

        <p className="text-muted-foreground mb-4">
          Press <strong className="text-foreground">Play</strong> to watch both views animate in sync. 
          <strong className="text-foreground"> Hover over DAG nodes</strong> to see context details, or{" "}
          <strong className="text-foreground">hover over chat messages</strong> to see what triggered them.
        </p>

        <OrchestrationVisualizer className="mt-6 mb-8" />

        {/* Cost & Time Comparison */}
        <h4 className="text-lg font-medium mt-8 mb-4">Cost & Time Analysis: Parallel vs. Linear</h4>
        
        <p className="text-muted-foreground mb-4">
          So what&apos;s the <strong className="text-foreground">actual benefit</strong> of orchestration patterns? 
          The comparison below calculates the token counts from the scenarios above and shows what happens 
          when you execute them in parallel (with isolated context) versus linearly (with accumulated context).
        </p>

        <p className="text-muted-foreground mb-4">
          In <strong className="text-foreground">linear execution</strong>, each step inherits all context 
          from previous steps—the final synthesizer would need to process the entire accumulated history. 
          In <strong className="text-foreground">parallel execution</strong>, workers have isolated context, 
          and only summaries flow back to the orchestrator.
        </p>

        <OrchestrationCostAnalysis className="mt-6 mb-8" />

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

        <p className="text-muted-foreground">
          The context engineering equation: build optimal context by layering content by volatility 
          (cache-friendly), separating concerns (secure), prioritizing signal over noise (high density), 
          using dynamic relevance (curated), and keeping it explicit and self-contained. The result is 
          efficient, cacheable, secure, high-quality context.
        </p>

        {/* Evolving Context */}
        <h3 id="evolving-context" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Evolving Context
        </h3>

        <p className="text-muted-foreground">
          Static context gets you started, but production systems need context that <strong className="text-foreground">learns 
          and adapts</strong>. This is about capturing insights from past interactions and incorporating them 
          into future calls.
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Episodic Summarization</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Long-running sessions accumulate too much history to keep in context. Instead, periodically 
                <strong className="text-foreground"> summarize completed episodes</strong>:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-0">
                <li>After each major task completion, generate a summary</li>
                <li>Store summaries with timestamps and outcomes</li>
                <li>Inject relevant summaries as &quot;memory&quot; in future sessions</li>
                <li>Enables continuity without exponential context growth</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Learning from Errors</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Track patterns in failures and surface them proactively:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-0">
                <li>Log when the agent corrects itself or user overrides</li>
                <li>Identify recurring failure modes (wrong tool choice, missed edge cases)</li>
                <li>Add targeted instructions: &quot;When dealing with dates, always check timezone&quot;</li>
                <li>Periodically review and prune outdated learnings</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">User Preference Learning</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">
                Capture and inject user-specific preferences:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-0">
                <li>Code style preferences (tabs vs spaces, naming conventions)</li>
                <li>Communication style (concise vs detailed, formal vs casual)</li>
                <li>Domain-specific terminology and conventions</li>
                <li>Store as a &quot;user profile&quot; layer injected into system prompts</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Learning Loop">
          <p className="mb-2">
            A practical pattern: after each session, ask the model to extract learnings in a structured 
            format. Store these, then inject the most relevant ones (by recency or similarity) into 
            future sessions as part of the system prompt.
          </p>
          <p className="m-0">
            <code className="text-xs bg-muted px-1 rounded">
              {'{'}learnings: [&quot;User prefers TypeScript&quot;, &quot;Always include error handling examples&quot;]{'}'}
            </code>
          </p>
        </Callout>

        <p className="text-muted-foreground">
          The key insight: <strong className="text-foreground">treat context as a living system</strong>. 
          Static prompts hit a ceiling; systems that learn from their interactions compound improvements 
          over time. This is especially powerful when combined with observability tools that track 
          what&apos;s working and what isn&apos;t.
        </p>

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
