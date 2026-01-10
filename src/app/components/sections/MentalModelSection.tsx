import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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

        <h3 className="text-xl font-semibold mt-8 mb-4">Why This Matters</h3>

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

        <Callout variant="tip" title="The Stateless Principle">
          <p>
            Design AI features as if each call is the first and only call. If your feature 
            works well with a single, well-crafted prompt, it will scale. If it requires 
            multi-turn "conversations," you're accumulating technical debt.
          </p>
        </Callout>

        <h3 className="text-xl font-semibold mt-8 mb-4">Practical Implications</h3>

        <CodeBlock
          language="typescript"
          filename="practical-example.ts"
          code={`// ❌ Anti-pattern: relying on conversation history
async function chatWithUser(userMessage: string) {
  conversationHistory.push(userMessage);
  const response = await callLLM(conversationHistory.join("\\n"));
  conversationHistory.push(response);
  return response;
  // Problems: unbounded growth, accumulated errors, high cost
}

// ✅ Pattern: self-contained context
async function processRequest(request: Request) {
  const context = buildContext({
    systemPrompt: SYSTEM_PROMPT,
    userRequest: request.message,
    relevantDocs: await retrieveRelevantDocs(request),
    userPreferences: request.user.preferences,
  });
  
  return await callLLM(context);
  // Benefits: predictable, testable, cost-controlled
}`}
        />
      </div>
    </section>
  );
}
