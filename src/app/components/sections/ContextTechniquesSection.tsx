import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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

        {/* Conversation Context Patterns */}
        <h3 id="conversation-context-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Conversation Context Patterns
        </h3>

        <p className="text-muted-foreground">
          Managing multi-turn conversations is one of the most common context challenges. The key insight: 
          <strong className="text-foreground"> treat every API call as self-contained</strong> while 
          strategically managing what history to include.
        </p>

        <CodeBlock
          language="typescript"
          filename="conversation-context.ts"
          code={`// ❌ Implicit: assumes the model "remembers" prior context
async function handleFollowUp(userMessage: string) {
  // Where did the project context go? The model has no idea.
  return await callLLM(\`User says: \${userMessage}\`);
}

// ✅ Explicit: rebuilds all necessary context each call
const MAX_RECENT_MESSAGES = 20;
const COMPACTION_THRESHOLD = 20;

async function handleFollowUp(userMessage: string, session: Session) {
  // Get conversation history with smart compaction
  const conversationContext = await getConversationContext(session);
  
  const context = assembleContext({
    // Layer 1: System instructions (stable, cached)
    systemPrompt: SYSTEM_PROMPT,
    
    // Layer 2: Static settings and tool definitions
    staticSettings: session.settings,
    
    // Layer 3: Conversation summary (if history is long)
    conversationSummary: conversationContext.summary,
    
    // Layer 4: Recent messages (keeps continuity)
    recentMessages: conversationContext.recentMessages,
    
    // Layer 5: Current user message
    currentMessage: userMessage,
  });
  
  return await callLLM(context);
}

async function getConversationContext(session: Session) {
  const allMessages = session.getMessages();
  
  // If under threshold, no compaction needed
  if (allMessages.length <= MAX_RECENT_MESSAGES) {
    return { summary: null, recentMessages: allMessages };
  }
  
  // Compact: summarize older messages, keep recent ones
  const recentMessages = allMessages.slice(-MAX_RECENT_MESSAGES);
  const olderMessages = allMessages.slice(0, -MAX_RECENT_MESSAGES);
  
  // Generate or update rolling summary of older context
  const summary = await summarizeConversation(
    session.existingSummary,  // Build on previous summary
    olderMessages             // Add newly-aged messages
  );
  
  return { summary, recentMessages };
}

// Every call is self-contained. No implicit state.
// Compaction preserves context while managing token budget.`}
        />

        <div className="space-y-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">The Explicitness Checklist</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Does the model know what role it's playing?</li>
                <li>Does it have the specific information needed for this task?</li>
                <li>Does it know what format the output should be in?</li>
                <li>Does it have relevant history if the task requires continuity?</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Compression Strategies */}
        <h3 id="compression-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Compression Strategies
        </h3>

        <p className="text-muted-foreground">
          When context grows beyond limits, compression becomes mandatory. The key: 
          <strong className="text-foreground"> preserve information density, not token count</strong>. 
          Intelligent summaries beat naive truncation every time.
        </p>

        <p className="text-muted-foreground">
          This aligns with primacy/recency findings: the middle of long contexts gets the 
          least attention anyway. So when you must compress, <strong className="text-foreground">compress 
          the middle first</strong>—keep the critical prefix and the fresh tail intact.
        </p>

        <CodeBlock
          language="typescript"
          filename="compression-strategy.ts"
          code={`// ❌ Naive truncation: loses information unpredictably
function naiveTruncate(messages: Message[], maxTokens: number) {
  // Just drop older messages until we fit
  while (countTokens(messages) > maxTokens) {
    messages.shift(); // Bye bye, context!
  }
  return messages;
}

// ✅ Intelligent compression: preserves information density
const MAX_RECENT = 20;  // Keep up to 20 recent messages

async function smartCompress(messages: Message[], maxTokens: number) {
  const systemPrompt = messages[0]; // Keep Layer 1 (prefix)
  const recentMessages = messages.slice(-MAX_RECENT); // Fresh tail
  const olderMessages = messages.slice(1, -MAX_RECENT);
  
  // Compress older messages into a rolling summary
  const summary = await summarize(olderMessages);
  
  return [
    systemPrompt,      // Prefix intact (cache-eligible)
    { role: "system", content: \`
## Conversation Summary
\${summary}
---
(Recent messages follow)
\` },
    ...recentMessages  // Fresh tail intact (recency)
  ];
}

// Pattern: summarize the middle, keep the prefix and recent tail
// As conversation grows, older messages roll into the summary`}
        />

        <Callout variant="warning" title="Beware Auto-Truncation">
          <p className="m-0">
            Some APIs offer automatic truncation when inputs exceed context limits. This 
            typically drops earlier content blindly—exactly the opposite of what you want. 
            <strong> Prefer deliberate curation</strong> over automated truncation.
          </p>
        </Callout>

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

        {/* System Architecture Patterns */}
        <h3 id="system-architecture-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          System Architecture Patterns
        </h3>

        <p className="text-muted-foreground">
          Different system types require different context management strategies:
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">💬 Chat Applications</h4>
              <p className="text-sm text-muted-foreground m-0">
                History grows → Layer 4 evolves → summarize strategically to maintain cache prefix. 
                The challenge is keeping the stable prefix intact while conversation accumulates. 
                Compress history into Layer 4 summaries rather than letting raw messages bloat the context.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🤖 Agent Systems</h4>
              <p className="text-sm text-muted-foreground m-0">
                Tool schemas stay stable (Layer 2, cached) → only tool <em>results</em> vary (Layer 5). 
                Agents benefit enormously from caching because heavy instruction sets and tool definitions 
                form a large, stable prefix that gets reused across every tool call.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">📚 RAG Systems</h4>
              <p className="text-sm text-muted-foreground m-0">
                Retrieved documents form dynamic Layer 3 content. Order matters: place the most relevant 
                chunks closest to the query (recency effect). Consider caching frequently-accessed 
                document chunks as part of your stable prefix.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🔄 Multi-Step Pipelines</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each step may need different context slices. Pass only what's relevant to each step—don't 
                carry the entire context through every stage. Use structured outputs to extract and forward 
                only the information the next step needs.
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
            <strong>Mental Model:</strong> Context is the only thing the function sees. 
            Everything the model "knows" must be passed in explicitly, every time.
          </p>
          <p className="mb-2">
            <strong>Caching:</strong> Good context structure = good cache hits. The layered 
            architecture isn't just logical organization—it's a cost and performance optimization.
          </p>
          <p className="m-0">
            <strong>Principles:</strong> The techniques here are direct applications of 
            signal-over-noise, layered architecture, and compression-without-loss.
          </p>
        </Callout>

        <p className="text-muted-foreground">
          Context engineering is where theory meets practice. The stateless function mental 
          model tells you <em>why</em> context matters. Caching tells you <em>how</em> structure 
          affects efficiency. The principles tell you <em>what</em> to optimize for. And these 
          techniques show you <em>how</em> to actually implement it.
        </p>
      </div>
    </section>
  );
}
