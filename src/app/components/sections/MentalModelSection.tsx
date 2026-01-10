"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock, CostVisualizer } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { Play, RotateCcw, ArrowRight } from "lucide-react";

// =============================================================================
// Stateless Function Demo
// =============================================================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface CallLog {
  id: string;
  timestamp: number;
  contextSent: string[];
  response: string;
  tokenCount: number;
}

function StatelessFunctionDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "user", content: "Hello!" },
    { id: "2", role: "assistant", content: "Hi there! How can I help you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const estimateTokens = (text: string) => Math.ceil(text.length / 4);

  const simulateApiCall = () => {
    if (!newMessage.trim()) return;

    setIsSimulating(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Simulate API call with full context
    setTimeout(() => {
      // Calculate what was sent
      const contextSent = updatedMessages.map(
        (m) => `[${m.role}]: ${m.content}`
      );
      const totalTokens = contextSent.reduce(
        (sum, text) => sum + estimateTokens(text),
        0
      );

      // Generate response
      const response = generateResponse(userMsg.content, updatedMessages);

      // Log the call
      const log: CallLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        contextSent,
        response,
        tokenCount: totalTokens,
      };
      setCallLogs((prev) => [...prev, log]);

      // Add assistant response
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setNewMessage("");
      setIsSimulating(false);
    }, 800);
  };

  const generateResponse = (userInput: string, history: Message[]): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("name")) {
      return "I don't actually have a name—I'm just a stateless function! Each time you call me, I start fresh.";
    }
    if (input.includes("remember")) {
      return "I don't remember anything between calls. Whatever appears to be 'memory' is actually you sending the entire conversation history each time.";
    }
    if (input.includes("context") || input.includes("token")) {
      return `This conversation currently has ${history.length} messages. Each call sends ALL of them—that's ~${history.reduce((sum, m) => sum + estimateTokens(m.content), 0)} tokens just for history.`;
    }
    if (history.length > 4) {
      return "Notice how the context keeps growing? Every message you see here was sent to me in this call. There's no shortcut—long conversations = more tokens.";
    }
    return "I'm here to help demonstrate the stateless nature of LLMs! Try asking about 'memory', 'context', or 'tokens'.";
  };

  const clearConversation = () => {
    setMessages([]);
    setCallLogs([]);
    setShowLogs(false);
  };

  const coreLogic = `// The Reality: LLM as a Stateless Function

async function chat(userMessage: string, history: Message[]) {
  // Step 1: Build the FULL context from history
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,  // ALL previous messages
    { role: "user", content: userMessage }  // New message
  ];

  // Step 2: Send EVERYTHING to the API
  // The API has no memory—it sees this as a fresh request
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,  // Entire conversation sent every time
  });

  // Step 3: Return response (and store history yourself)
  return response.choices[0].message.content;
}

// What feels like a "conversation" is actually:
// Call 1: "Hello" → sends [Hello]
// Call 2: "How are you?" → sends [Hello, Hi!, How are you?]
// Call 3: "Tell me more" → sends [Hello, Hi!, How are you?, I'm good!, Tell me more]
// Each call resends EVERYTHING. Context grows linearly, cost grows quadratically.`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Stateless Function Pattern"
      description="How 'conversations' actually work under the hood"
    >
      <div className="space-y-4">
        {/* Chat interface */}
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Messages */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-3 bg-muted/20">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No messages yet. Start a conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                      msg.role === "user"
                        ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30"
                        : "bg-muted border border-border"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isSimulating && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm bg-muted border border-border">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && simulateApiCall()}
                placeholder="Try: 'What do you remember?' or 'How many tokens?'"
                className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                disabled={isSimulating}
              />
              <button
                onClick={simulateApiCall}
                disabled={isSimulating || !newMessage.trim()}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={clearConversation}
                className="px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted text-muted-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Context indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Messages: <span className="text-foreground font-medium">{messages.length}</span>
            </span>
            <span className="text-muted-foreground">
              Est. tokens:{" "}
              <span className="text-foreground font-medium">
                ~{messages.reduce((sum, m) => sum + estimateTokens(m.content), 0)}
              </span>
            </span>
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-cyan-400 hover:underline"
          >
            {showLogs ? "Hide" : "Show"} API call logs ({callLogs.length})
          </button>
        </div>

        {/* API call logs */}
        {showLogs && callLogs.length > 0 && (
          <div className="space-y-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              API Call History
            </p>
            {callLogs.map((log, index) => (
              <div
                key={log.id}
                className="text-xs p-2 rounded bg-background/50 border border-border/50"
              >
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Call #{index + 1}</span>
                  <span className="text-amber-400">{log.tokenCount} tokens sent</span>
                </div>
                <div className="text-muted-foreground/70 truncate">
                  Context: {log.contextSent.length} messages
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key insight */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <ArrowRight className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-rose-400">Key insight:</strong> Every API call sends the{" "}
            <em>entire</em> conversation. The model has no memory between calls—what looks like
            continuity is you rebuilding context each time.
          </p>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

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
          not a conversation partner</strong>. It&apos;s a stateless function that takes input and 
          produces output. Every call is independent. There is no memory, no continuity, 
          no understanding that persists.
        </p>

        {/* Interactive Demo */}
        <h3 id="stateless-function" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          The Stateless Function
        </h3>

        <p className="text-muted-foreground mb-4">
          Try this interactive demo. Have a &quot;conversation&quot; and watch what actually happens
          behind the scenes—every message you see is re-sent with each API call.
        </p>

        <InteractiveWrapper
          title="Interactive: Stateless Function Demo"
          description="Chat and see how context accumulates with each call"
          icon="🔄"
          colorTheme="cyan"
          minHeight="auto"
        >
          <StatelessFunctionDemo />
        </InteractiveWrapper>

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
          The simplest way to build a &quot;chat&quot; with an LLM is to accumulate messages and send 
          the entire history each turn. This isn&apos;t wrong—it&apos;s often the first implementation 
          you&apos;d write, and for some use cases (short conversations, prototypes, simple assistants) 
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
          Cost isn&apos;t the only concern. <strong className="text-foreground">Latency also scales with input size</strong>. 
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
          . This means longer conversations don&apos;t just 
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
            you&apos;re prototyping, or cost isn&apos;t a concern.
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
