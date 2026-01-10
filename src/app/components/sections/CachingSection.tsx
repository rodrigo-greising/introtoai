"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock, CachingCostVisualizer } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { Check, X, ArrowRight, Zap } from "lucide-react";

// =============================================================================
// Prefix Match Visualization
// =============================================================================

interface PromptPart {
  id: string;
  label: string;
  content: string;
  tokens: number;
  type: "static" | "variable";
}

const samplePrompts: { request1: PromptPart[]; request2: PromptPart[] } = {
  request1: [
    { id: "sys", label: "System Prompt", content: "You are a helpful coding assistant...", tokens: 1200, type: "static" },
    { id: "tools", label: "Tool Schemas", content: "[readFile, writeFile, search]", tokens: 800, type: "static" },
    { id: "examples", label: "Few-shot Examples", content: "Example: user asks about React...", tokens: 500, type: "static" },
    { id: "user1", label: "User Message", content: "How do I create a custom hook?", tokens: 50, type: "variable" },
  ],
  request2: [
    { id: "sys", label: "System Prompt", content: "You are a helpful coding assistant...", tokens: 1200, type: "static" },
    { id: "tools", label: "Tool Schemas", content: "[readFile, writeFile, search]", tokens: 800, type: "static" },
    { id: "examples", label: "Few-shot Examples", content: "Example: user asks about React...", tokens: 500, type: "static" },
    { id: "user2", label: "User Message", content: "Now show me how to test it", tokens: 40, type: "variable" },
  ],
};

function PrefixMatchDemo() {
  const [showRequest2, setShowRequest2] = useState(false);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);

  // Simulate what happens when a part changes
  const changedRequest2 = useMemo(() => {
    if (!selectedChange) return samplePrompts.request2;
    
    return samplePrompts.request2.map((part) => {
      if (part.id === selectedChange) {
        return { ...part, content: part.content + " [MODIFIED]", type: "variable" as const };
      }
      return part;
    });
  }, [selectedChange]);

  const calculateCacheMatch = () => {
    if (!showRequest2) return { cached: 0, fresh: 0, matched: [] };
    
    let cached = 0;
    const matched: string[] = [];
    
    for (let i = 0; i < changedRequest2.length; i++) {
      const r1Part = samplePrompts.request1[i];
      const r2Part = changedRequest2[i];
      
      if (r1Part && r2Part && r1Part.content === r2Part.content && r1Part.type === "static") {
        cached += r2Part.tokens;
        matched.push(r2Part.id);
      } else {
        break; // Cache match breaks at first difference
      }
    }
    
    const fresh = changedRequest2.reduce((sum, p) => sum + p.tokens, 0) - cached;
    return { cached, fresh, matched };
  };

  const { cached, fresh, matched } = calculateCacheMatch();

  const coreLogic = `// How prefix caching works internally (simplified)

function checkCacheMatch(newPrompt: Token[], cache: CacheEntry[]): CacheResult {
  let matchedTokens = 0;
  
  // Find the longest matching prefix in cache
  for (const entry of cache) {
    let i = 0;
    while (
      i < entry.tokens.length && 
      i < newPrompt.length &&
      entry.tokens[i] === newPrompt[i]  // Exact match required!
    ) {
      i++;
    }
    
    if (i > matchedTokens) {
      matchedTokens = i;
      cachedKVState = entry.kvState.slice(0, i);
    }
  }
  
  return {
    cachedTokens: matchedTokens,        // Reuse KV cache
    freshTokens: newPrompt.length - matchedTokens,  // Must compute
    // Fresh tokens are charged at 100% price
    // Cached tokens are charged at ~10% price (90% discount)
  };
}

// Key insight: ANY change in the prefix breaks the match!
// "Hello world" and "Hello World" are DIFFERENT prefixes`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Prefix Cache Matching"
      description="How providers determine which tokens can be served from cache"
    >
      <div className="space-y-6">
        {/* Request 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Request 1 (Initial)</span>
            <span className="text-xs text-muted-foreground">
              {samplePrompts.request1.reduce((sum, p) => sum + p.tokens, 0)} tokens total
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.request1.map((part) => (
              <div
                key={part.id}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm transition-all",
                  part.type === "static"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                )}
              >
                <div className="font-medium">{part.label}</div>
                <div className="text-xs opacity-70">{part.tokens} tokens</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            First request: all tokens processed fresh, written to cache
          </p>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setShowRequest2(!showRequest2)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-all",
            showRequest2
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <ArrowRight className={cn("w-4 h-4 transition-transform", showRequest2 && "rotate-90")} />
          {showRequest2 ? "Hide Request 2" : "Show Request 2 (with caching)"}
        </button>

        {/* Request 2 */}
        {showRequest2 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Request 2 (Subsequent)</span>
              <span className="text-xs text-muted-foreground">
                {changedRequest2.reduce((sum, p) => sum + p.tokens, 0)} tokens total
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {changedRequest2.map((part) => {
                const isCached = matched.includes(part.id);
                const wasCacheBroken = selectedChange === part.id;

                return (
                  <button
                    key={part.id}
                    onClick={() => {
                      if (part.type === "static" && part.id !== selectedChange) {
                        setSelectedChange(part.id);
                      } else if (part.id === selectedChange) {
                        setSelectedChange(null);
                      }
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-sm transition-all text-left",
                      isCached
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : wasCacheBroken
                        ? "bg-rose-500/10 border-rose-500/30"
                        : "bg-amber-500/10 border-amber-500/30",
                      part.type === "static" && !wasCacheBroken && "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-rose-500/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {isCached ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : wasCacheBroken ? (
                        <X className="w-3.5 h-3.5 text-rose-400" />
                      ) : null}
                      <span className={cn(
                        "font-medium",
                        isCached ? "text-emerald-400" : wasCacheBroken ? "text-rose-400" : "text-amber-400"
                      )}>
                        {part.label}
                      </span>
                    </div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {isCached ? "CACHED" : wasCacheBroken ? "MODIFIED - cache broken!" : "FRESH"}
                      {" • "}{part.tokens} tokens
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cache stats */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm">
                  <span className="text-emerald-400 font-medium">{cached}</span>
                  <span className="text-muted-foreground"> cached tokens (90% off)</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm">
                  <span className="text-amber-400 font-medium">{fresh}</span>
                  <span className="text-muted-foreground"> fresh tokens (full price)</span>
                </span>
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-muted-foreground">
              {selectedChange 
                ? "🔴 Modifying any part of the prefix breaks the cache for all subsequent parts!"
                : "💡 Click on any static part to simulate modifying it and breaking the cache"
              }
            </p>
          </div>
        )}
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

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
          Every call rebuilds the model&apos;s internal state from scratch. <strong className="text-foreground">Prompt 
          caching</strong> lets providers skip this expensive work when your prompts share identical prefixes.
        </p>

        <Callout variant="tip" title="The Key Insight">
          <p>
            When an LLM receives a prompt, it performs a <strong>prefill</strong> pass over input tokens 
            to build its attention state (KV cache). Provider caching lets future requests with 
            identical prefixes <strong>reuse that precomputed state</strong>—slashing both cost and latency.
          </p>
        </Callout>

        <h3 id="how-caching-works" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">How LLM Caching Works</h3>

        <p className="text-muted-foreground mb-4">
          Caching matches <strong className="text-foreground">exact prefixes</strong>. If your new request 
          starts with the same tokens as a previous request, the provider can reuse the precomputed 
          attention state for those tokens.
        </p>

        <InteractiveWrapper
          title="Interactive: Prefix Cache Matching"
          description="See how cache hits work and what breaks them"
          icon={<Zap className="w-4 h-4" />}
          colorTheme="emerald"
          minHeight="auto"
        >
          <PrefixMatchDemo />
        </InteractiveWrapper>

        <p className="text-muted-foreground mt-4">
          Most providers enable prompt caching automatically. But there are important 
          nuances to understand:
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">1. Minimum Token Threshold</h4>
              <p className="text-sm text-muted-foreground m-0">
                Caching typically turns on automatically for prompts <strong className="text-emerald-500">1,024 tokens or longer</strong>. 
                Below this threshold, the overhead of caching isn&apos;t worth it.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">2. Exact Prefix Matches Only</h4>
              <p className="text-sm text-muted-foreground m-0">
                Cache hits are only possible when the new request&apos;s prompt starts with an <strong className="text-foreground">identical prefix</strong>—same 
                messages, same tool definitions, same images/settings, same structured-output schema, same ordering. 
                Any change to earlier content <strong className="text-rose-400">breaks the match</strong>.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">3. Prefix-Only Caching</h4>
              <p className="text-sm text-muted-foreground m-0">
                The &quot;new stuff&quot; you append at the end (latest user message, any changed tool list, 
                any changed image detail, etc.) <strong className="text-foreground">won&apos;t be cached for that request</strong>. 
                Caching applies to the prefix that was already sent before.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">4. Caches Expire</h4>
              <p className="text-sm text-muted-foreground m-0">
                With typical in-memory caching policies, cached prefixes persist for <strong className="text-foreground">5–10 minutes 
                of inactivity</strong> (sometimes up to ~1 hour). If you pause longer, you&apos;ll get a cache miss 
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

        <h3 id="conversations-and-caching" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Conversations and Caching</h3>

        <p className="text-muted-foreground">
          In a typical chat-style integration, each API call includes the whole <code className="text-xs bg-muted px-1 py-0.5 rounded">messages</code> array 
          (system + prior user/assistant turns) plus the new user turn at the end. Because the earlier 
          turns are repeated verbatim and sit at the beginning of the prompt, they often become a 
          <strong className="text-foreground"> cacheable prefix</strong>.
        </p>

        <Callout variant="important" title='Not &quot;Everything Is Cached&quot;'>
          <p className="mb-2">
            A growing conversation tends to benefit from caching, but it&apos;s not as simple as 
            &quot;all prior messages are always cached&quot;:
          </p>
          <ul className="space-y-1 text-sm m-0 pl-4 list-disc">
            <li>The latest user message (the &quot;new stuff&quot;) is always processed fresh</li>
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

        <h3 id="cache-friendly-design" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Cache-Friendly Design</h3>

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

        <h4 className="text-lg font-medium mt-6 mb-3">Where Caching Delivers Most Value</h4>

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

        <Callout variant="info" title="Observability Matters" className="mt-6">
          <p className="m-0">
            All providers expose cache metrics in their responses. Monitor <code className="text-xs bg-muted px-1 py-0.5 rounded">cached_tokens</code>, 
            <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_read_input_tokens</code>, or equivalent fields. If your cache hit rate 
            is low, revisit your prompt structure—something in your &quot;stable&quot; prefix is probably varying.
          </p>
        </Callout>
      </div>
    </section>
  );
}
