"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle, StepThroughPlayer } from "@/app/components/visualizations/core";
import type { Step } from "@/app/components/visualizations/core/StepThroughPlayer";
import { 
  Wrench, 
  ArrowRight, 
  Code, 
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

// =============================================================================
// Tool Invocation Visualizer
// =============================================================================

interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string;
  status: "pending" | "running" | "success" | "error";
}

const invocationSteps: Step[] = [
  { id: "prompt", label: "User sends prompt", description: "The user asks a question or makes a request" },
  { id: "analyze", label: "LLM analyzes request", description: "The model determines which tool(s) to call" },
  { id: "generate", label: "LLM generates tool call", description: "The model outputs structured tool invocation" },
  { id: "execute", label: "Your code executes tool", description: "You run the actual function with the arguments" },
  { id: "return", label: "Result returned to LLM", description: "The tool result is added to the conversation" },
  { id: "respond", label: "LLM generates response", description: "The model uses the result to answer the user" },
];

function ToolInvocationDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const toolCall: ToolCall = {
    id: "call_abc123",
    name: "get_weather",
    arguments: { location: "San Francisco", unit: "celsius" },
    result: '{"temperature": 18, "condition": "sunny"}',
    status: currentStep >= 4 ? "success" : currentStep >= 3 ? "running" : "pending",
  };

  // Auto-advance when playing
  useState(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= invocationSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  });

  const coreLogic = `// Tool Calling Flow

// 1. Define your tool
const weatherTool = {
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
        unit: { type: "string", enum: ["celsius", "fahrenheit"] }
      },
      required: ["location"]
    }
  }
};

// 2. Call the API with tools
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "What's the weather in SF?" }],
  tools: [weatherTool],
});

// 3. Check if model wants to call a tool
const message = response.choices[0].message;
if (message.tool_calls) {
  for (const toolCall of message.tool_calls) {
    // 4. Execute your actual function
    const args = JSON.parse(toolCall.function.arguments);
    const result = await getWeather(args.location, args.unit);
    
    // 5. Send result back to the model
    messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
  }
  
  // 6. Get final response
  const finalResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });
}`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Tool Calling Pattern"
      description="The complete flow of how tool calls work"
    >
      <div className="space-y-6">
        {/* Visual flow */}
        <div className="relative">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
            {invocationSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all min-w-[80px]",
                      isActive
                        ? "bg-cyan-500/20 border-cyan-500/40 ring-2 ring-cyan-500/50 scale-105"
                        : isPast
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-muted/30 border-border/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      isActive
                        ? "bg-cyan-500 text-white"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {isPast ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-xs text-center",
                      isActive ? "text-cyan-400" : isPast ? "text-emerald-400" : "text-muted-foreground"
                    )}>
                      {step.label.split(" ").slice(0, 2).join(" ")}
                    </span>
                  </button>
                  {index < invocationSteps.length - 1 && (
                    <ArrowRight className={cn(
                      "w-4 h-4 mx-1 shrink-0",
                      index < currentStep ? "text-emerald-500" : "text-muted-foreground/30"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current step detail */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">
              Step {currentStep + 1}: {invocationSteps[currentStep].label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {invocationSteps[currentStep].description}
          </p>
        </div>

        {/* Tool call visualization */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tool Call */}
          <div className={cn(
            "p-4 rounded-xl border transition-all",
            currentStep >= 2
              ? "bg-violet-500/10 border-violet-500/30"
              : "bg-muted/30 border-border/50 opacity-50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Tool Call</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground">
{`{
  "id": "${toolCall.id}",
  "name": "${toolCall.name}",
  "arguments": ${JSON.stringify(toolCall.arguments, null, 2).split("\n").map((l, i) => i === 0 ? l : "    " + l).join("\n")}
}`}
            </pre>
          </div>

          {/* Tool Result */}
          <div className={cn(
            "p-4 rounded-xl border transition-all",
            currentStep >= 4
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-muted/30 border-border/50 opacity-50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Tool Result</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground">
{currentStep >= 4 ? toolCall.result : "// Waiting for execution..."}
            </pre>
          </div>
        </div>

        {/* Controls */}
        <StepThroughPlayer
          steps={invocationSteps}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onStepChange={setCurrentStep}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          colorTheme="cyan"
        />
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function ToolsSection() {
  return (
    <section id="tools" className="scroll-mt-20">
      <SectionHeading
        id="tools-heading"
        title="Tools and Function Calling"
        subtitle="Enabling LLMs to take actions in the world"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Tools transform LLMs from text generators into <strong className="text-foreground">agents 
          that can act</strong>. By defining functions the model can call, you give it the ability 
          to fetch data, execute code, modify systems—anything your code can do.
        </p>

        <Callout variant="tip" title="The Key Insight">
          <p>
            The LLM doesn't execute tools directly. It <strong>outputs structured data</strong> describing 
            which function to call and with what arguments. <em>You</em> execute the function and 
            return the result to the model.
          </p>
        </Callout>

        {/* What are Tools */}
        <h3 id="what-are-tools" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Tools?
        </h3>

        <p className="text-muted-foreground">
          A tool is a function definition that you pass to the model. It includes:
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <Card variant="default">
            <CardContent>
              <Code className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Name</h4>
              <p className="text-xs text-muted-foreground m-0">
                A unique identifier like <code className="text-xs bg-muted px-1 rounded">get_weather</code>
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <Code className="w-5 h-5 text-violet-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Description</h4>
              <p className="text-xs text-muted-foreground m-0">
                What the tool does—guides the model on when to use it
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <Code className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-medium text-foreground mb-1">Parameters</h4>
              <p className="text-xs text-muted-foreground m-0">
                JSON Schema defining the expected arguments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tool Definitions */}
        <h3 id="tool-definitions" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Tool Definitions
        </h3>

        <CodeBlock
          language="typescript"
          filename="tool-definition.ts"
          showLineNumbers
          code={`// Tool definition following OpenAI's format
const tools = [
  {
    type: "function",
    function: {
      name: "search_documents",
      description: "Search the knowledge base for relevant documents",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query"
          },
          limit: {
            type: "number",
            description: "Maximum results to return",
            default: 5
          },
          filters: {
            type: "object",
            properties: {
              category: { type: "string" },
              dateRange: { type: "string" }
            }
          }
        },
        required: ["query"]
      }
    }
  }
];

// The model sees this schema and knows:
// 1. When this tool is useful (from description)
// 2. What arguments it needs (from parameters)
// 3. Which arguments are required vs optional`}
        />

        {/* How Invocation Works */}
        <h3 id="tool-invocation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          How Invocation Works
        </h3>

        <p className="text-muted-foreground mb-4">
          Step through the complete flow of a tool call—from user prompt to final response:
        </p>

        <InteractiveWrapper
          title="Interactive: Tool Invocation Flow"
          description="Step through the complete tool calling process"
          icon={<Wrench className="w-4 h-4" />}
          colorTheme="violet"
          minHeight="auto"
        >
          <ToolInvocationDemo />
        </InteractiveWrapper>

        {/* Error Handling */}
        <h3 id="error-handling" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Error Handling
        </h3>

        <p className="text-muted-foreground">
          Tools can fail. Your code must handle errors gracefully and communicate them back 
          to the model:
        </p>

        <CodeBlock
          language="typescript"
          filename="tool-error-handling.ts"
          code={`async function executeToolCall(toolCall: ToolCall): Promise<ToolResult> {
  try {
    const args = JSON.parse(toolCall.function.arguments);
    
    switch (toolCall.function.name) {
      case "get_weather":
        const weather = await weatherAPI.get(args.location);
        return { 
          success: true, 
          result: JSON.stringify(weather) 
        };
        
      case "search_documents":
        const docs = await searchIndex.query(args.query);
        return { 
          success: true, 
          result: JSON.stringify(docs) 
        };
        
      default:
        return { 
          success: false, 
          error: \`Unknown tool: \${toolCall.function.name}\` 
        };
    }
  } catch (error) {
    // Return error to the model so it can handle gracefully
    return {
      success: false,
      error: \`Tool execution failed: \${error.message}\`
    };
  }
}

// Important: Return errors as tool results, not exceptions
// The model can often recover or try a different approach`}
        />

        <Callout variant="important">
          <p>
            Always return tool errors as results, not exceptions. The model can often recover—it 
            might try different arguments, use a different tool, or ask the user for clarification.
          </p>
        </Callout>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="space-y-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Write Clear Descriptions</h4>
              <p className="text-sm text-muted-foreground m-0">
                The description tells the model <em>when</em> to use the tool. Be specific: 
                "Search the product catalog by name or SKU" is better than "Search products."
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Keep Tools Focused</h4>
              <p className="text-sm text-muted-foreground m-0">
                One tool, one job. <code className="text-xs bg-muted px-1 rounded">search_and_update_and_notify</code> is 
                worse than three separate tools. Composability beats complexity.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Validate Arguments</h4>
              <p className="text-sm text-muted-foreground m-0">
                The model usually respects your schema, but validate anyway. Use Zod or similar 
                to ensure arguments are safe before executing.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Coming Up: The Agentic Loop">
          <p>
            Tools become truly powerful when combined with <strong>the agentic loop</strong>—a 
            pattern where the model iteratively calls tools, observes results, and decides 
            what to do next. That's our next section.
          </p>
        </Callout>
      </div>
    </section>
  );
}
