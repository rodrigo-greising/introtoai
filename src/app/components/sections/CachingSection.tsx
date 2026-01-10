import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

export function CachingSection() {
  return (
    <section id="prompt-caching" className="scroll-mt-20">
      <SectionHeading
        id="prompt-caching-heading"
        title="Prompt Caching"
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

        <h3 id="provider-comparison" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Provider Comparison</h3>

        <p className="text-muted-foreground mb-6">
          Each major provider implements caching differently. Understanding these differences 
          helps you optimize for your specific use case.
        </p>

        <div className="space-y-8">
          {/* OpenAI */}
          <div className="border-l-2 border-emerald-500 pl-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              OpenAI: Automatic Prefix Caching
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="m-0">
                <strong className="text-foreground">How it works:</strong> Automatic. OpenAI routes 
                requests based on a hash of the initial prefix (typically first 256 tokens). Cache 
                lookup checks for matching prefixes, with hits reusing cached KV tensors. No explicit 
                markup needed.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Minimum:</strong> 1,024+ tokens to be eligible. 
                All requests show <code className="text-xs bg-muted px-1 py-0.5 rounded">cached_tokens</code> in usage details.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Retention:</strong> Two policies available:
              </p>
              <ul className="ml-4 mt-1 space-y-1 list-disc">
                <li>
                  <strong className="text-foreground">In-memory:</strong> 5-10 minutes of inactivity, 
                  up to 1 hour maximum (default, all models)
                </li>
                <li>
                  <strong className="text-foreground">Extended (24h):</strong> Up to 24 hours retention 
                  (gpt-5.2, gpt-5.1, gpt-5, gpt-4.1 and newer). Configure via <code className="text-xs bg-muted px-1 py-0.5 rounded">prompt_cache_retention</code> parameter.
                </li>
              </ul>
              <p className="m-0">
                <strong className="text-foreground">Savings:</strong> Up to <strong className="text-emerald-500">90% off</strong> input 
                token costs and up to <strong className="text-emerald-500">80% latency reduction</strong> on cache hits.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Optimization:</strong> Use <code className="text-xs bg-muted px-1 py-0.5 rounded">prompt_cache_key</code> parameter 
                to influence routing and improve hit rates. Keep each prefix-key combination below ~15 requests/min to avoid cache overflow.
              </p>
              <p className="m-0">
                <strong className="text-foreground">What's cached:</strong> Messages array, images, tool definitions, 
                and structured output schemas. Exact prefix matches required for cache hits.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Tip:</strong> Structure prompts with static content first, 
                dynamic content last. Monitor <code className="text-xs bg-muted px-1 py-0.5 rounded">cached_tokens</code> in usage to track performance.
              </p>
              <p className="m-0 pt-3 mt-3 border-t border-border/50">
                <a 
                  href="https://platform.openai.com/docs/guides/prompt-caching" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  OpenAI Prompt Caching Docs →
                </a>
              </p>
            </div>
          </div>

          {/* Anthropic */}
          <div className="border-l-2 border-orange-500 pl-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Anthropic: Explicit Cache Breakpoints
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="m-0">
                <strong className="text-foreground">How it works:</strong> Explicit. You mark cacheable 
                regions with <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_control</code> breakpoints (up to 4). 
                Cache prefixes are created in order: <code className="text-xs bg-muted px-1 py-0.5 rounded">tools</code> → 
                <code className="text-xs bg-muted px-1 py-0.5 rounded">system</code> → <code className="text-xs bg-muted px-1 py-0.5 rounded">messages</code>.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Supported models:</strong> Claude Opus 4.5, Opus 4.1, Opus 4, 
                Sonnet 4.5, Sonnet 4, Sonnet 3.7, Haiku 4.5, Haiku 3.5, Haiku 3.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Minimum:</strong> 4,096 tokens (Opus 4.5, Haiku 4.5), 
                1,024 tokens (Opus 4.1/4, Sonnet 4.5/4/3.7), 2,048 tokens (Haiku 3.5/3).
              </p>
              <p className="m-0">
                <strong className="text-foreground">Retention:</strong> 5 minutes default (refreshed on use), 
                1 hour optional at extra cost. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">ttl: "1h"</code> in 
                <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_control</code> for extended cache.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Pricing:</strong> Write premium (<strong className="text-amber-500">1.25×</strong> for 5min, <strong className="text-amber-500">2×</strong> for 1hr), 
                but reads are <strong className="text-emerald-500">0.1×</strong> (90% off). Break even at 2 calls using the same cached prefix.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Automatic prefix checking:</strong> System checks backwards up to 20 blocks 
                before each breakpoint to find the longest matching cached sequence. For prompts with more than 20 blocks, 
                add explicit breakpoints earlier to ensure caching.
              </p>
              <p className="m-0">
                <strong className="text-foreground">What can be cached:</strong> Tools, system messages, text messages, 
                images, documents, tool use/results. Thinking blocks are cached automatically alongside other content.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Cache invalidation:</strong> Changes to tools invalidate everything. 
                Changes to system (web search, citations toggle) invalidate system and messages. Changes to messages 
                (images, tool_choice, thinking params) only invalidate messages cache.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Important:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">input_tokens</code> in usage 
                represents only tokens <strong>after the last cache breakpoint</strong>, not total input. Calculate total as: 
                <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_read_input_tokens + cache_creation_input_tokens + input_tokens</code>.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Bonus:</strong> Up to 4 breakpoints, cache shared within organization, 
                organization-isolated (different orgs never share caches).
              </p>
              <p className="m-0 pt-3 mt-3 border-t border-border/50">
                <a 
                  href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Anthropic Prompt Caching Docs →
                </a>
              </p>
            </div>
          </div>

          {/* Gemini */}
          <div className="border-l-2 border-blue-500 pl-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Gemini: Implicit + Explicit Caching
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="m-0">
                <strong className="text-foreground">How it works:</strong> Two mechanisms available:
              </p>
              <ul className="ml-4 mt-1 space-y-1 list-disc">
                <li>
                  <strong className="text-foreground">Implicit caching:</strong> Automatically enabled on most models (effective May 8, 2025). 
                  No configuration needed. Cost savings automatically passed on when requests hit caches.
                </li>
                <li>
                  <strong className="text-foreground">Explicit caching:</strong> Manually create cache objects with system instructions, 
                  documents, or video files. Reference cached content by name in subsequent requests.
                </li>
              </ul>
              <p className="m-0">
                <strong className="text-foreground">Minimum token limits:</strong>
              </p>
              <ul className="ml-4 mt-1 space-y-1 list-disc">
                <li>Gemini 3 Flash Preview: 1,024 tokens</li>
                <li>Gemini 3 Pro Preview: 4,096 tokens</li>
                <li>Gemini 2.5 Flash: 1,024 tokens</li>
                <li>Gemini 2.5 Pro: 4,096 tokens</li>
              </ul>
              <p className="m-0">
                <strong className="text-foreground">Implicit caching tips:</strong> Put large and common content at the beginning of your prompt. 
                Send requests with similar prefixes in a short amount of time. Cache hits visible in <code className="text-xs bg-muted px-1 py-0.5 rounded">usage_metadata</code>.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Explicit caching retention:</strong> 1 hour default TTL (adjustable). 
                Can update TTL or set specific <code className="text-xs bg-muted px-1 py-0.5 rounded">expire_time</code>. 
                Supports listing, updating, and deleting caches.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Pricing:</strong> Implicit caching provides automatic cost savings on hits (no cost saving guarantee). 
                Explicit caching billing based on: (1) cache token count at reduced rate, (2) storage duration (TTL), 
                (3) non-cached input tokens and output tokens.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Best for explicit caching:</strong> Chatbots with extensive system instructions, 
                repetitive video file analysis, recurring queries against large document sets, frequent code repository analysis.
              </p>
              <p className="m-0 pt-3 mt-3 border-t border-border/50 flex flex-wrap gap-x-4 gap-y-1">
                <a 
                  href="https://ai.google.dev/gemini-api/docs/caching" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Gemini API Docs →
                </a>
                <a 
                  href="https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Vertex AI Docs →
                </a>
              </p>
            </div>
          </div>
        </div>

        <h3 id="implementing" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Implementing Cache-Friendly Prompts</h3>

        <p className="text-muted-foreground mb-4">
          Here's how to structure your context for maximum cache hits with Anthropic's explicit approach:
        </p>

        <CodeBlock
          language="typescript"
          filename="anthropic-caching.ts"
          showLineNumbers
          code={`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Example: Multiple cache breakpoints for different update frequencies
// Breakpoint 1: Tools (rarely change)
const tools = [
  {
    name: "search_documents",
    description: "Search through the knowledge base",
    input_schema: { /* ... */ }
  },
  {
    name: "get_document",
    description: "Retrieve a specific document by ID",
    input_schema: { /* ... */ },
    cache_control: { type: "ephemeral" }  // Cache all tools
  }
];

// Breakpoint 2: System instructions (rarely change)
const systemInstructions = {
  type: "text",
  text: "You are a helpful assistant...\\n# Instructions\\n- Always search first\\n- Provide citations",
  cache_control: { type: "ephemeral" }
};

// Breakpoint 3: Reference documents (change occasionally)
const referenceDocs = {
  type: "text",
  text: largeDocumentContent,  // Large document (must meet minimum: 1024+ tokens)
  cache_control: { type: "ephemeral" }  // Or { type: "ephemeral", ttl: "1h" } for 1-hour cache
};

async function askQuestion(userQuestion: string) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",  // Supported: Opus 4.5, Sonnet 4.5, Haiku 4.5, etc.
    max_tokens: 1024,
    tools: tools,  // Cached at breakpoint 1
    system: [systemInstructions, referenceDocs],  // Cached at breakpoints 2 & 3
    messages: [{
      role: "user",
      content: userQuestion  // Variable part - not cached
    }]
  });
  
  // Understanding usage metrics:
  // - cache_read_input_tokens: tokens read from cache (before breakpoints)
  // - cache_creation_input_tokens: tokens written to cache (at breakpoints)
  // - input_tokens: tokens AFTER last breakpoint only (not total input!)
  console.log("Cache read:", response.usage.cache_read_input_tokens);
  console.log("Cache write:", response.usage.cache_creation_input_tokens);
  console.log("Uncached input:", response.usage.input_tokens);
  
  // Total input = cache_read + cache_creation + input_tokens
  const totalInput = response.usage.cache_read_input_tokens + 
                     response.usage.cache_creation_input_tokens + 
                     response.usage.input_tokens;
  console.log("Total input tokens:", totalInput);
  
  return response;
}`}
        />

        <h3 id="break-even" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Break-Even Analysis</h3>

        <p className="text-muted-foreground mb-4">
          Different providers have different economics. Here's when caching pays off:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">OpenAI</h4>
              <p className="text-sm text-muted-foreground m-0">
                No write premium. <strong className="text-emerald-500">Win on first cache hit</strong> (up to 90% savings). 
                Focus on maximizing hit rate via stable prefixes and <code className="text-xs bg-muted px-1 py-0.5 rounded">prompt_cache_key</code>.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Anthropic</h4>
              <p className="text-sm text-muted-foreground m-0">
                Write costs 1.25×, reads cost 0.1×. <strong className="text-emerald-500">Break even at 2 calls</strong> using 
                the same cached prefix.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Gemini</h4>
              <p className="text-sm text-muted-foreground m-0">
                Implicit caching is automatic with cost savings on hits (no guarantee). Explicit caching 
                has storage costs based on token count and TTL duration—<strong className="text-amber-500">break-even depends on reuse frequency</strong> within the cache lifetime.
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 id="where-caching-delivers" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Where Caching Delivers Most Value</h3>

        <div className="space-y-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🤖 Agentic Systems</h4>
              <p className="text-sm text-muted-foreground m-0">
                Heavy tool schemas + long instruction hierarchies create large, stable prefixes. 
                Each tool call reuses the cached system context.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">📚 RAG Pipelines</h4>
              <p className="text-sm text-muted-foreground m-0">
                Retrieved context often stays stable across follow-up questions. Cache the 
                document chunks and system prompt together.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">📄 Document Q&A</h4>
              <p className="text-sm text-muted-foreground m-0">
                Cache the document once, ask many questions. Perfect use case—the document 
                is the stable prefix, questions are the variable suffix.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">💻 Codebase Assistants</h4>
              <p className="text-sm text-muted-foreground m-0">
                Cache repository context (file tree, key files, conventions), then do iterative 
                Q&A or refactoring tasks against that cached base.
              </p>
            </CardContent>
          </Card>
        </div>

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
          <p className="mb-2">
            All providers expose cache metrics in their responses. Monitor <code className="text-xs bg-muted px-1 py-0.5 rounded">cached_tokens</code>, 
            <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_read_input_tokens</code>, or equivalent fields. If your cache hit rate 
            is low, revisit your prompt structure—something in your "stable" prefix is probably varying.
          </p>
          <p className="m-0">
            <strong>Important for Anthropic:</strong> The <code className="text-xs bg-muted px-1 py-0.5 rounded">input_tokens</code> field only represents 
            tokens <strong>after your last cache breakpoint</strong>, not your total input. To get total input tokens, add 
            <code className="text-xs bg-muted px-1 py-0.5 rounded">cache_read_input_tokens + cache_creation_input_tokens + input_tokens</code>. 
            This affects both cost calculation and rate limit tracking.
          </p>
        </Callout>
      </div>
    </section>
  );
}
