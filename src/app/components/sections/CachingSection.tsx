import { SectionHeading, Card, CardContent, Callout, CodeBlock, CachingCostVisualizer } from "@/app/components/ui";

export function CachingSection() {
  return (
    <section id="llm-caching" className="scroll-mt-20">
      <SectionHeading
        id="llm-caching-heading"
        title="LLM Caching"
        subtitle="How providers optimize the stateless function"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Remember that LLMs are <strong className="text-foreground">stateless functions</strong>? 
          Every call rebuilds the model's internal state from scratch. <strong className="text-foreground">Prompt 
          caching</strong> lets providers skip this expensive work when your prompts share identical prefixes.
        </p>

        <Callout variant="tip" title="The Key Insight">
          <p>
            When an LLM receives a prompt, it performs a <strong>prefill</strong> pass over input tokens 
            to build its attention state (KV cache). Provider caching lets future requests with 
            identical prefixes <strong>reuse that precomputed state</strong>—slashing both cost and latency.
          </p>
        </Callout>

        <h3 id="how-caching-works" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">How LLM Caching Actually Works</h3>

        <p className="text-muted-foreground">
          Most providers enable prompt caching automatically. But there are important 
          nuances to understand:
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">1. Minimum Token Threshold</h4>
              <p className="text-sm text-muted-foreground m-0">
                Caching typically turns on automatically for prompts <strong className="text-emerald-500">1,024 tokens or longer</strong>. 
                Below this threshold, the overhead of caching isn't worth it.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">2. Exact Prefix Matches Only</h4>
              <p className="text-sm text-muted-foreground m-0">
                Cache hits are only possible when the new request's prompt starts with an <strong className="text-foreground">identical prefix</strong>—same 
                messages, same tool definitions, same images/settings, same structured-output schema, same ordering. 
                Any change to earlier content <strong className="text-rose-400">breaks the match</strong>.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">3. Prefix-Only Caching</h4>
              <p className="text-sm text-muted-foreground m-0">
                The "new stuff" you append at the end (latest user message, any changed tool list, 
                any changed image detail, etc.) <strong className="text-foreground">won't be cached for that request</strong>. 
                Caching applies to the prefix that was already sent before.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">4. Caches Expire</h4>
              <p className="text-sm text-muted-foreground m-0">
                With typical in-memory caching policies, cached prefixes persist for <strong className="text-foreground">5–10 minutes 
                of inactivity</strong> (sometimes up to ~1 hour). If you pause longer, you'll get a cache miss 
                and pay full price again.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">5. High Throughput Can Reduce Hit Rates</h4>
              <p className="text-sm text-muted-foreground m-0">
                Requests are routed by a hash of the initial prefix. If the same prefix exceeds roughly 
                <strong className="text-foreground"> 15 requests/minute</strong>, some requests may spill to other machines, 
                reducing cache effectiveness.
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 id="conversations-and-caching" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">How Conversations Benefit from Caching</h3>

        <p className="text-muted-foreground">
          In a typical chat-style integration, each API call includes the whole <code className="text-xs bg-muted px-1 py-0.5 rounded">messages</code> array 
          (system + prior user/assistant turns) plus the new user turn at the end. Because the earlier 
          turns are repeated verbatim and sit at the beginning of the prompt, they often become a 
          <strong className="text-foreground"> cacheable prefix</strong>.
        </p>

        <Callout variant="important" title='Not "Everything Is Cached"'>
          <p className="mb-2">
            A growing conversation tends to benefit from caching, but it's not as simple as 
            "all prior messages are always cached":
          </p>
          <ul className="space-y-1 text-sm m-0 pl-4 list-disc">
            <li>The latest user message (the "new stuff") is always processed fresh</li>
            <li>If you modify the system prompt, inject a new tool schema, or reorder messages, you lose the cache</li>
            <li>Long pauses (lunch break, overnight) will cause cache expiration</li>
            <li>Different API routes or high request volumes can cause cache misses</li>
          </ul>
        </Callout>

        <CodeBlock
          language="text"
          filename="conversation-caching-example.txt"
          code={`Turn 1:
  [System prompt] → NEW, written to cache
  [User message 1] → NEW
  ─────────────────
  Total: ~2,100 tokens, all at full price

Turn 2:
  [System prompt] → ✅ CACHED (identical prefix)
  [User message 1] → ✅ CACHED (part of prefix)
  [Assistant reply 1] → ✅ CACHED (part of prefix)
  [User message 2] → NEW (appended at end)
  ─────────────────
  ~1,800 tokens cached, ~100 tokens new

Turn 3:
  [System prompt] → ✅ CACHED
  [User message 1] → ✅ CACHED
  [Assistant reply 1] → ✅ CACHED
  [User message 2] → ✅ CACHED
  [Assistant reply 2] → ✅ CACHED
  [User message 3] → NEW
  ─────────────────
  ~2,100 tokens cached, ~100 tokens new

The cacheable prefix grows each turn while only
~100-300 new tokens are charged at full price.`}
        />

        <h3 id="what-this-means" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">What This Means for Context Engineering</h3>

        <p className="text-muted-foreground">
          Caching fundamentally changes how you should structure prompts. The rule is simple:
        </p>

        <CodeBlock
          language="typescript"
          filename="cache-friendly-context.ts"
          showLineNumbers
          code={`// ❌ BAD: Variable content at the beginning breaks caching
async function badApproach(userQuery: string, docs: string[]) {
  return await callLLM(\`
    User asks: \${userQuery}
    
    Here are your instructions...
    [10,000 tokens of system prompt, tools, examples]
  \`);
}

// ✅ GOOD: Static prefix, variable content at the end
async function goodApproach(userQuery: string, docs: string[]) {
  return await callLLM(\`
    [System instructions - STATIC]
    [Tool schemas - STATIC]
    [Few-shot examples - STATIC]
    [Reference docs - mostly STATIC]
    
    User query: \${userQuery}
  \`);
}

// Every request that shares the same static prefix 
// can reuse the cached KV tensors`}
        />

        <h3 id="caching-economics" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Caching Economics</h3>

        <p className="text-muted-foreground mb-4">
          Different providers have different caching economics, but the general pattern is:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Cache Read Discount
              </h4>
              <p className="text-sm text-muted-foreground m-0">
                When you hit a cached prefix, you typically pay <strong className="text-emerald-500">~10% of the normal input price</strong> (90% discount). 
                This is the key savings mechanism.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Cache Write Premium
              </h4>
              <p className="text-sm text-muted-foreground m-0">
                Some providers charge a <strong className="text-amber-500">~25% premium</strong> when writing to the cache (first request). 
                Others have no write premium. Either way, the read discount quickly pays off.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Break-Even Analysis">
          <p className="m-0">
            With a 25% write premium and 90% read discount, you <strong>break even at just 2 requests</strong> using 
            the same prefix. With no write premium (like some providers), you win immediately on the first cache hit.
          </p>
        </Callout>

        <h3 id="caching-cost-explorer" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Interactive: Caching Cost Explorer</h3>

        <p className="text-muted-foreground mb-4">
          Use this interactive tool to explore how caching <strong className="text-foreground">dramatically 
          reduces input cost for long conversations</strong> and <strong className="text-foreground">extends 
          the horizon of how many turns you can use</strong> before it becomes prohibitively expensive. 
          The key insight: with caching, your <em>entire message prefix</em>—including conversation 
          history—is cached. Only the new tokens each turn are charged at full price.
        </p>

        <Callout variant="tip" title="What to Explore" className="mb-6">
          <ul className="space-y-1.5 text-sm m-0 pl-4 list-disc">
            <li>Watch the <strong>dramatic difference</strong> between the dashed line (quadratic, no cache) and solid line (linear, with cache)</li>
            <li>Notice how the <strong>cacheable prefix grows</strong> to include all previous messages—not just static content</li>
            <li>Adjust <strong>cache hit rate</strong> to see how TTL expiration (long pauses) impacts costs</li>
            <li>Toggle <strong>write premium</strong> to see how different provider economics affect the curve</li>
          </ul>
        </Callout>

        <CachingCostVisualizer className="mb-8" />

        <Callout variant="important" title="The Critical Factor: Cache Hits" className="mb-8">
          <p className="mb-2">
            <strong>Caching is powerful—but only when you maintain cache hits.</strong>
          </p>
          <p className="m-0">
            Caches expire after 5-10 minutes of inactivity. A user who pauses for lunch loses the cache entirely, 
            falling back to expensive quadratic costs. For applications with long gaps between messages, consider 
            session management strategies: prompt users to continue soon, or design for shorter, focused conversations 
            rather than marathon sessions.
          </p>
        </Callout>

        <h3 id="where-caching-delivers" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Where Caching Delivers Most Value</h3>

        <ul className="space-y-3 text-muted-foreground pl-4 list-disc">
          <li>
            <strong className="text-foreground">Agentic Systems</strong> — Heavy tool schemas + long instruction hierarchies create large, stable prefixes that get reused on every tool call.
          </li>
          <li>
            <strong className="text-foreground">RAG Pipelines</strong> — Retrieved context often stays stable across follow-up questions. Cache the document chunks and system prompt together.
          </li>
          <li>
            <strong className="text-foreground">Document Q&A</strong> — Cache the document once, ask many questions. The document is the stable prefix, questions are the variable suffix.
          </li>
          <li>
            <strong className="text-foreground">Codebase Assistants</strong> — Cache repository context (file tree, key files, conventions), then do iterative Q&A or refactoring against that cached base.
          </li>
        </ul>

        <Callout variant="important" title="The Golden Rule" className="mt-8">
          <p className="mb-2">
            <strong>Static content first, variable content last.</strong>
          </p>
          <p className="m-0">
            System prompts → Tool schemas → Examples → Reference docs → User message. 
            This ordering maximizes the cacheable prefix across all your requests.
          </p>
        </Callout>

        <h3 id="connection-to-mental-model" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Connection to the Mental Model</h3>

        <p className="text-muted-foreground">
          Caching reinforces our core mental model: the LLM is a stateless function. Each call 
          rebuilds internal state from the context you provide. Caching just lets the provider 
          <em> skip the rebuild</em> when the prefix is identical.
        </p>

        <p className="text-muted-foreground">
          This has profound implications for how you architect AI features:
        </p>

        <CodeBlock
          language="typescript"
          filename="context-architecture.ts"
          code={`// Your context is your API contract with the model.
// Structure it for both quality AND cacheability.

interface OptimizedContext {
  // Layer 1: System identity (almost never changes)
  systemPrompt: string;
  
  // Layer 2: Capabilities (rarely changes)
  toolSchemas: ToolSchema[];
  
  // Layer 3: Domain knowledge (changes occasionally)
  referenceDocuments: Document[];
  
  // Layer 4: Session state (changes per session)
  conversationSummary?: string;
  
  // Layer 5: Request specifics (changes every call)
  userMessage: string;
}

// Layers 1-3 are your "cache surface"
// Layers 4-5 are your "variable tail"
// Maximize surface, minimize tail = maximum savings`}
        />

        <Callout variant="info" title="Observability Matters">
          <p className="m-0">
            All providers expose cache metrics in their responses. Monitor <code className="text-xs bg-muted px-1 py-0.5 rounded">cached_tokens</code>, 
            <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_read_input_tokens</code>, or equivalent fields. If your cache hit rate 
            is low, revisit your prompt structure—something in your "stable" prefix is probably varying.
          </p>
        </Callout>

        <Callout variant="warning" title="API vs. Consumer Products" className="mt-6">
          <p className="m-0">
            This guide is about <strong>API behavior</strong> for developers. Consumer products like ChatGPT 
            may implement conversation assembly and caching differently internally—the documentation describes 
            API behavior, not necessarily how the consumer UI's backend works.
          </p>
        </Callout>
      </div>
    </section>
  );
}
