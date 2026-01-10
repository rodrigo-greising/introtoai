import { SectionHeading, Card, CardContent, Callout, CodeBlock, CostVisualizer } from "@/app/components/ui";

export function MentalModelSection() {
  return (
    <section id="mental-model" className="scroll-mt-20">
      <SectionHeading
        id="mental-model-heading"
        title="The Mental Model"
        subtitle="LLM as a stateless function, not a chat"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The most important shift in thinking: <strong className="text-foreground">an LLM is 
          not a conversation partner</strong>. It's a stateless function that takes input and 
          produces output. Every call is independent. There is no memory, no continuity, 
          no understanding that persists.
        </p>

        <CodeBlock
          language="typescript"
          filename="llm-as-function.ts"
          showLineNumbers
          code={`// This is the reality
async function callLLM(context: string): Promise<string> {
  // Each call is completely independent
  // The LLM has no memory of previous calls
  // All "memory" must be passed in the context
  return await openai.chat.completions.create({
    messages: [{ role: "user", content: context }],
  });
}

// What feels like a conversation is actually:
const response1 = await callLLM("Hello");
const response2 = await callLLM("Hello" + response1 + "How are you?");
const response3 = await callLLM("Hello" + response1 + "How are you?" + response2 + "Tell me more");

// Each call sends the ENTIRE history. 
// The "conversation" is reconstructed every time.`}
        />

        <h3 id="why-this-matters" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Why This Matters</h3>

        <p className="text-muted-foreground">
          When you understand this, several things become clear:
        </p>

        <div className="space-y-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context is Everything</h4>
              <p className="text-sm m-0">
                The quality of output is directly proportional to the quality of context. 
                Bad context → bad output. Always.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Tokens Cost Money</h4>
              <p className="text-sm m-0">
                Every call sends the full context. Long conversations get expensive fast. 
                This shapes how you architect AI features.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">State Accumulates Errors</h4>
              <p className="text-sm m-0">
                Each turn can introduce hallucinations that compound. Shorter, focused 
                interactions are more reliable than long sessions.
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 id="practical-implications" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Practical Implications</h3>

        <p className="text-muted-foreground mb-6">
          The simplest way to build a "chat" with an LLM is to accumulate messages and send 
          the entire history each turn. This isn't wrong—it's often the first implementation 
          you'd write, and for some use cases (short conversations, prototypes, simple assistants) 
          it works fine.
        </p>

        <p className="text-muted-foreground mb-6">
          But for production systems, this naive approach becomes <strong className="text-foreground">expensive 
          and inefficient</strong>. The cost math is brutal: input tokens grow quadratically, not linearly.
        </p>

        <h4 id="visualizing-cost" className="text-lg font-medium mt-8 mb-4 scroll-mt-20">Visualizing the Cost Problem</h4>
        
        <p className="text-muted-foreground mb-4">
          Drag the slider to see how costs scale with conversation length. Notice how input cost 
          dominates as conversations grow—each turn resends everything that came before.
        </p>

        <CostVisualizer className="my-8" />

        <p className="text-muted-foreground mb-6">
          Cost isn't the only concern. <strong className="text-foreground">Latency also scales with input size</strong>. 
          The time to first token (TTFT)—the delay before the model starts generating a response—increases 
          linearly with the number of input tokens. Each additional token adds approximately{" "}
          <a 
            href="https://www.glean.com/blog/glean-input-token-llm-latency" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            0.24 milliseconds to TTFT
          </a>
          , and longer sequences require more prefill computation. For example, increasing input length 
          from 2,000 to 125,000 tokens can{" "}
          <a 
            href="https://my.micron.com/about/blog/applications/ai/top-five-essential-context-window-concepts-in-large-language-models" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            roughly double latency
          </a>
          . This means longer conversations don't just 
          cost more—they also feel slower to users, creating a compounding problem of both expense and poor 
          user experience.
        </p>

        <h4 id="two-approaches" className="text-lg font-medium mt-8 mb-4 scroll-mt-20">The Two Approaches</h4>

        <CodeBlock
          language="typescript"
          filename="practical-example.ts"
          code={`// 📝 Simple approach: accumulating conversation history
// Good for: prototypes, short chats, simple assistants
// Watch out for: cost growth, context limits, error accumulation
async function chatWithUser(userMessage: string) {
  conversationHistory.push(userMessage);
  const response = await callLLM(conversationHistory.join("\\n"));
  conversationHistory.push(response);
  return response;
}

// ✅ Production approach: self-contained context
// Better for: cost control, reliability, long-running features
async function processRequest(request: Request) {
  const context = buildContext({
    systemPrompt: SYSTEM_PROMPT,
    userRequest: request.message,
    relevantDocs: await retrieveRelevantDocs(request),
    userPreferences: request.user.preferences,
    // Only include relevant history, summarized if needed
    recentContext: summarizeIfNeeded(request.recentMessages),
  });
  
  return await callLLM(context);
}`}
        />

        <Callout variant="info" title="When to use each approach" className="mt-6">
          <p className="mb-2">
            <strong>Simple chat history</strong> is fine when: conversations are short (&lt;10 turns), 
            you're prototyping, or cost isn't a concern.
          </p>
          <p>
            <strong>Self-contained context</strong> is better when: building production features, 
            conversations may be long, you need predictable costs, or reliability matters.
          </p>
        </Callout>
      </div>
    </section>
  );
}
