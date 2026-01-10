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
            This isn't a bug to work around—it's a fundamental property that shapes how we 
            should structure context. Several of the principles below directly address this.
          </p>
        </Callout>

        {/* Principle 1: Signal Over Noise */}
        <h3 id="signal-over-noise" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          1. Signal Over Noise
        </h3>

        <p className="text-muted-foreground">
          Every token must <strong className="text-foreground">earn its place</strong>. The context 
          window is finite and expensive—irrelevant information doesn't just waste tokens, it 
          actively <em>dilutes</em> the model's attention and degrades output quality.
        </p>

        <p className="text-muted-foreground">
          The "Lost in the Middle" research shows that adding distractor content can <strong className="text-foreground">actively 
          hurt performance</strong>, especially when that content lands in the middle of long contexts. 
          More tokens ≠ better results.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Low Signal Density</h4>
              <p className="text-sm text-muted-foreground m-0">
                "Here's all the documentation we have, plus the full codebase, plus every 
                conversation we've ever had, plus some examples that might be relevant..."
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">✓ High Signal Density</h4>
              <p className="text-sm text-muted-foreground m-0">
                "Here's the specific function signature, the error message, and the two 
                most relevant code patterns from our codebase."
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Core Question">
          <p className="m-0">
            For every piece of context you include, ask: <strong>"Does this directly help 
            the model complete this specific task?"</strong> If not, it's noise.
          </p>
        </Callout>

        {/* Principle 2: Layered Context Architecture */}
        <h3 id="layered-architecture" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          2. Layered Context Architecture
        </h3>

        <p className="text-muted-foreground">
          Structure your context in <strong className="text-foreground">layers ordered by 
          volatility</strong>—stable content first, volatile content last. This isn't arbitrary: 
          it simultaneously optimizes for cache efficiency <em>and</em> attention allocation.
        </p>

        <ContextLayersVisualizer className="mt-6" />

        <Callout variant="tip" title="Why This Ordering Works">
          <p className="mb-2">
            <strong>For caching:</strong> Stable prefixes enable cache reuse across requests. 
            When Layers 1-3 don't change, providers can skip expensive recomputation.
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
            token thresholds, and what qualifies as an "identical prefix" all vary. The 
            principle remains constant: <strong>stable tokens first = maximum cache opportunity</strong>.
          </p>
        </Callout>

        {/* Principle 3: Explicit Over Implicit */}
        <h3 id="explicit-over-implicit" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          3. Explicit Over Implicit
        </h3>

        <p className="text-muted-foreground">
          Never assume the model "knows" or "remembers" anything. Every call is independent. 
          <strong className="text-foreground"> If something matters, it must be in the context 
          explicitly.</strong>
        </p>

        <Callout variant="important" title="Tying Back to the Mental Model">
          <p className="m-0">
            Remember: an LLM is a <strong>stateless function</strong>. There is no persistent 
            memory between calls. What feels like "memory" is actually the entire conversation 
            being passed in the context each time. If you don't include it, it doesn't exist.
          </p>
        </Callout>

        <p className="text-muted-foreground mt-4">
          This principle has profound implications:
        </p>

        <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
          <li><strong className="text-foreground">Role clarity:</strong> The model should always know what role it's playing</li>
          <li><strong className="text-foreground">Task specificity:</strong> Include the exact information needed for this particular task</li>
          <li><strong className="text-foreground">Format requirements:</strong> Explicitly state expected output format</li>
          <li><strong className="text-foreground">Relevant history:</strong> Include conversation history only if the task requires continuity</li>
        </ul>

        {/* Principle 4: Dynamic Relevance */}
        <h3 id="dynamic-relevance" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          4. Dynamic Relevance
        </h3>

        <p className="text-muted-foreground">
          As conversations grow, context must evolve. The principle: <strong className="text-foreground">keep 
          what's relevant, compress what's useful but not critical, drop what's stale</strong>.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Keep</h4>
              <p className="text-sm text-muted-foreground m-0">
                Active task state, current objectives, recent decisions that affect next steps
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-500 mb-2">Compress</h4>
              <p className="text-sm text-muted-foreground m-0">
                Earlier conversation history → summary. Explored options → key conclusions only
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Drop</h4>
              <p className="text-sm text-muted-foreground m-0">
                Resolved subtasks, superseded decisions, tangential discussions that led nowhere
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mt-6">
          This directly connects to caching: <strong className="text-foreground">pruning the middle 
          of your context breaks the cache</strong>. If you need to modify Layer 3 content, you 
          invalidate the cached prefix. Design your compression strategy to preserve the stable 
          prefix while evolving the variable portions.
        </p>

        <Callout variant="info" title="Cache Breakpoints">
          <p className="m-0">
            Some providers (e.g., Anthropic) support explicit <strong>cache breakpoints</strong>—markers 
            that let you modify content after the breakpoint without invalidating everything before it. 
            This enables more flexible context management while preserving cache benefits.
          </p>
        </Callout>

        {/* Principle 5: Compression Without Loss */}
        <h3 id="compression-without-loss" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          5. Compression Without Loss
        </h3>

        <p className="text-muted-foreground">
          When context grows beyond limits, compression is mandatory. The principle: 
          <strong className="text-foreground"> preserve information density, not token count</strong>. 
          Intelligent summaries beat naive truncation every time.
        </p>

        <p className="text-muted-foreground">
          This aligns with primacy/recency findings: the middle of long contexts gets the 
          least attention anyway. So when you must compress, <strong className="text-foreground">compress 
          the middle first</strong>—keep the critical prefix and the fresh tail intact.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Naive Truncation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Drop older messages blindly until tokens fit. Loses important context unpredictably.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">✓ Intelligent Compression</h4>
              <p className="text-sm text-muted-foreground m-0">
                Summarize older content, keep recent messages intact. Preserves information density.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Auto-Truncation Hazard">
          <p className="m-0">
            Some APIs offer automatic truncation when inputs exceed context limits. This 
            typically drops earlier content blindly—exactly the opposite of what you want. 
            <strong> Prefer deliberate curation</strong> over automated truncation.
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
          This isn't just about readability—it's <strong className="text-foreground">control-plane 
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
            headers—to reinforce boundaries between what you control and what you don't.
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
