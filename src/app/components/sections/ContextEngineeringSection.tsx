import { SectionHeading, Card, CardContent, Callout, ContextLayersVisualizer } from "@/app/components/ui";

export function ContextEngineeringSection() {
  return (
    <section id="context-engineering" className="scroll-mt-20">
      <SectionHeading
        id="context-engineering-heading"
        title="Context Engineering Principles"
        subtitle="The theoretical foundations of effective context"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Context engineering is the discipline of <strong className="text-foreground">assembling 
          the right information, in the right order</strong>, so that an LLM produces quality 
          output efficiently.
        </p>

        <Callout variant="info" title='The "Lost in the Middle" Effect'>
          <p className="mb-2">
            Research by Liu et al. found that LLMs exhibit a <strong>U-shaped attention curve</strong>: 
            they attend best to content at the <em>beginning</em> and <em>end</em> of the context, 
            while middle content gets significantly less attention.
          </p>
          <p className="m-0">
            This isn&apos;t a bug to work around—it&apos;s a fundamental property that shapes how we 
            should structure context. Several of the principles below directly address this.
          </p>
        </Callout>

        {/* Principle 1: Signal Over Noise */}
        <h3 id="signal-over-noise" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          1. Signal Over Noise
        </h3>

        <p className="text-muted-foreground">
          Every token must <strong className="text-foreground">earn its place</strong>. The context 
          window is finite and expensive—irrelevant information doesn&apos;t just waste tokens, it 
          actively <em>dilutes</em> the model&apos;s attention and degrades output quality.
        </p>

        <p className="text-muted-foreground">
          The &quot;Lost in the Middle&quot; research shows that adding distractor content can <strong className="text-foreground">actively 
          hurt performance</strong>, especially when that content lands in the middle of long contexts. 
          More tokens ≠ better results.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Low Signal Density</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;Here&apos;s all the documentation we have, plus the full codebase, plus every 
                conversation we&apos;ve ever had, plus some examples that might be relevant...&quot;
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">✓ High Signal Density</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;Here&apos;s the specific function signature, the error message, and the two 
                most relevant code patterns from our codebase.&quot;
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Core Question">
          <p className="m-0">
            For every piece of context you include, ask: <strong>&quot;Does this directly help 
            the model complete this specific task?&quot;</strong> If not, it&apos;s noise.
          </p>
        </Callout>

        {/* Principle 2: Layered Context Architecture */}
        <h3 id="layered-architecture" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          2. Layered Context Architecture
        </h3>

        <p className="text-muted-foreground">
          Structure your context in <strong className="text-foreground">layers ordered by 
          volatility</strong>—stable content first, volatile content last. This isn&apos;t arbitrary: 
          it simultaneously optimizes for cache efficiency <em>and</em> attention allocation.
        </p>

        <ContextLayersVisualizer className="mt-6" />

        <Callout variant="tip" title="Why This Ordering Works">
          <p className="mb-2">
            <strong>For caching:</strong> Stable prefixes enable cache reuse across requests. 
            When Layers 1-3 don&apos;t change, providers can skip expensive recomputation.
          </p>
          <p className="m-0">
            <strong>For attention:</strong> Critical instructions at the start get the 
            strongest attention (primacy effect). The current request at the end also 
            gets strong attention (recency effect).
          </p>
        </Callout>

        <Callout variant="warning" title="Provider Variability">
          <p className="m-0">
            Cache behavior differs between providers—TTLs, explicit breakpoints, minimum 
            token thresholds, and what qualifies as an &quot;identical prefix&quot; all vary. The 
            principle remains constant: <strong>stable tokens first = maximum cache opportunity</strong>.
          </p>
        </Callout>

        {/* Principle 3: Explicit Over Implicit */}
        <h3 id="explicit-over-implicit" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          3. Explicit Over Implicit
        </h3>

        <p className="text-muted-foreground">
          Never assume the model &quot;knows&quot; or &quot;remembers&quot; anything. Every call is independent. 
          <strong className="text-foreground"> If something matters, it must be in the context 
          explicitly.</strong>
        </p>

        <Callout variant="important" title="Tying Back to the Mental Model">
          <p className="m-0">
            Remember: an LLM is a <strong>stateless function</strong>. There is no persistent 
            memory between calls. What feels like &quot;memory&quot; is actually the entire conversation 
            being passed in the context each time. If you don&apos;t include it, it doesn&apos;t exist.
          </p>
        </Callout>

        <p className="text-muted-foreground mt-4">
          This principle has profound implications:
        </p>

        <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
          <li><strong className="text-foreground">Role clarity:</strong> The model should always know what role it&apos;s playing</li>
          <li><strong className="text-foreground">Task specificity:</strong> Include the exact information needed for this particular task</li>
          <li><strong className="text-foreground">Format requirements:</strong> Explicitly state expected output format</li>
          <li><strong className="text-foreground">Relevant history:</strong> Include conversation history only if the task requires continuity</li>
        </ul>

        {/* Principle 4: Context Lifecycle */}
        <h3 id="context-lifecycle" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          4. Context Lifecycle Management
        </h3>

        <p className="text-muted-foreground">
          Context isn&apos;t static—it must <strong className="text-foreground">evolve as work progresses</strong>. 
          The principle: curate actively to preserve information density while respecting token limits.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Keep</h4>
              <p className="text-sm text-muted-foreground m-0">
                Active task state, current objectives, recent decisions affecting next steps
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-500 mb-2">Compress</h4>
              <p className="text-sm text-muted-foreground m-0">
                Earlier history → summary. Explored options → key conclusions only
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Drop</h4>
              <p className="text-sm text-muted-foreground m-0">
                Completed subtasks, superseded decisions, tangential dead-ends
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mt-6">
          When compression is needed, <strong className="text-foreground">compress the middle first</strong>. 
          This aligns with the &quot;Lost in the Middle&quot; findings—middle content gets less attention anyway—and 
          preserves your cache-friendly stable prefix. Intelligent summaries beat naive truncation.
        </p>

        <Callout variant="warning" title="Avoid Auto-Truncation">
          <p className="m-0">
            Some APIs automatically truncate when inputs exceed limits, typically dropping earlier content 
            blindly—exactly the wrong strategy. <strong>Prefer deliberate curation</strong> over automated truncation.
          </p>
        </Callout>

        {/* Principle 5: Delegation & Orchestration */}
        <h3 id="delegation-orchestration" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          5. Delegation & Orchestration
        </h3>

        <p className="text-muted-foreground">
          Stop thinking of AI as a single conversation. Think of it as <strong className="text-foreground">multiple 
          instances that can work in parallel or in series</strong>. This unlocks a powerful pattern: 
          <em>focused delegation</em>.
        </p>

        <Callout variant="important" title="The Key Insight">
          <p className="m-0">
            A sub-agent with <strong>a fresh, focused context</strong> often outperforms a single overloaded 
            context that&apos;s trying to do everything. Each delegated task gets exactly the context it needs—no 
            more, no less.
          </p>
        </Callout>

        <p className="text-muted-foreground mt-4">
          Complex tasks benefit from <strong className="text-foreground">decomposition</strong>—breaking work 
          into focused subtasks, each with its own curated context. The key insight: <em>intermediate work 
          doesn&apos;t need to pollute the main context</em>. Subtasks can explore, iterate, even fail—returning 
          only the distilled result.
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Why Delegation Works</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li><strong className="text-foreground">Focused context</strong> — Each subtask gets exactly the information it needs, nothing more</li>
                <li><strong className="text-foreground">Clean boundaries</strong> — Exploration and intermediate steps stay isolated</li>
                <li><strong className="text-foreground">Result filtering</strong> — Only the final output flows back, not the process</li>
                <li><strong className="text-foreground">Parallel potential</strong> — Independent subtasks can run simultaneously</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Context Boundaries as Architecture">
          <p className="m-0">
            Delegation creates <strong>natural context boundaries</strong>. Each subtask&apos;s context is isolated, 
            preventing cross-contamination. This is <em>separation of concerns</em> applied at the 
            instance level. See <a href="#orchestration-patterns" className="text-cyan-400 hover:underline">Orchestration Patterns</a> for 
            implementation approaches.
          </p>
        </Callout>

        {/* Principle 6: Separation of Concerns */}
        <h3 id="separation-of-concerns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          6. Separation of Concerns
        </h3>

        <p className="text-muted-foreground">
          Keep four context types distinct: <strong className="text-foreground">Instructions</strong> (what 
          to do), <strong className="text-foreground">Knowledge</strong> (reference material), 
          <strong className="text-foreground">History</strong> (conversation state), and 
          <strong className="text-foreground">Query</strong> (current request).
        </p>

        <p className="text-muted-foreground">
          This isn&apos;t just about readability—it&apos;s <strong className="text-foreground">control-plane 
          vs data-plane isolation</strong>:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Control Plane</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Instructions</strong>: System behavior, constraints, output format, 
                safety boundaries
              </p>
              <p className="text-xs text-muted-foreground/70 m-0">
                This is trusted content you control
              </p>
            </CardContent>
          </Card>
          
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Data Plane</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Knowledge / History / Query</strong>: Content the model reasons 
                about—documents, user messages, retrieved data
              </p>
              <p className="text-xs text-muted-foreground/70 m-0">
                This may include untrusted content
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="Separation Is Security">
          <p className="m-0">
            Clear separation prevents <strong>instruction injection attacks</strong> where 
            retrieved content or user input accidentally (or maliciously) overrides system 
            instructions. Use explicit delimiters—XML tags, markdown sections, or clear 
            headers—to reinforce boundaries between what you control and what you don&apos;t.
          </p>
        </Callout>

        <Callout variant="tip" title="Next: Putting Principles to Work" className="mt-8">
          <p className="m-0">
            These principles establish the <em>why</em> of context structure. The next section 
            covers <strong>Context Management Techniques</strong>—practical patterns and code 
            examples that put these principles into action.
          </p>
        </Callout>
      </div>
    </section>
  );
}
