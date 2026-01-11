"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper, StepThroughPlayer } from "@/app/components/visualizations/core";
import type { Step } from "@/app/components/visualizations/core/StepThroughPlayer";
import { 
  Wrench, 
  Code, 
  CheckCircle,
  Zap,
  User,
  Brain,
  Server,
  MessageSquare,
} from "lucide-react";

// =============================================================================
// Tool Invocation Visualizer
// =============================================================================

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

  // More realistic weather response
  const weatherResult = JSON.stringify({
    temperature: 18,
    condition: "sunny",
    humidity: 65,
    wind_speed: "12 km/h",
    feels_like: 17,
    location: "San Francisco, CA"
  }, null, 2);

  // Panel content based on step
  const getPanelContent = (step: number) => {
    const chatMessages = [];
    const llmThoughts = [];
    const serverLogs = [];

    if (step >= 0) {
      chatMessages.push({ role: "user", content: "What's the weather in San Francisco?" });
    }
    if (step >= 1) {
      llmThoughts.push("Analyzing user request...");
      llmThoughts.push("User wants weather data for San Francisco");
      llmThoughts.push("I need to use the get_weather tool");
    }
    if (step >= 2) {
      llmThoughts.push("Generating tool call with location parameter");
    }
    if (step >= 3) {
      serverLogs.push({ type: "request", message: "Received tool call: get_weather" });
      serverLogs.push({ type: "info", message: "Fetching weather for San Francisco..." });
    }
    if (step >= 4) {
      serverLogs.push({ type: "success", message: "Weather data retrieved successfully" });
      serverLogs.push({ type: "response", message: "Returning result to LLM" });
    }
    if (step >= 5) {
      llmThoughts.push("Processing weather data...");
      llmThoughts.push("Formatting response for user");
      chatMessages.push({ 
        role: "assistant", 
        content: "The weather in San Francisco is sunny with a temperature of 18°C. Humidity is at 65% with winds of 12 km/h. It feels like 17°C." 
      });
    }

    return { chatMessages, llmThoughts, serverLogs };
  };

  const { chatMessages, llmThoughts, serverLogs } = getPanelContent(currentStep);

  // Auto-advance when playing - faster speed (800ms)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= invocationSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* 3-Panel Design */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Panel 1: Chat Interface */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-500/30 bg-cyan-500/10">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">Chat Interface</span>
          </div>
          <div className="p-3 space-y-3 min-h-[200px]">
            {chatMessages.map((msg, i) => (
              <div 
                key={i}
                className={cn(
                  "flex gap-2 animate-in fade-in slide-in-from-bottom-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Brain className="w-3 h-3 text-violet-400" />
                  </div>
                )}
                <div className={cn(
                  "px-3 py-2 rounded-lg text-xs max-w-[85%]",
                  msg.role === "user" 
                    ? "bg-cyan-500/20 text-cyan-300" 
                    : "bg-violet-500/20 text-violet-300"
                )}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <User className="w-3 h-3 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}
            {chatMessages.length === 1 && currentStep > 0 && currentStep < 5 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: LLM Internal Processing */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-500/30 bg-violet-500/10">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-medium text-violet-400">LLM Processing</span>
          </div>
          <div className="p-3 space-y-2 min-h-[200px] font-mono text-xs">
            {llmThoughts.map((thought, i) => (
              <div 
                key={i}
                className="flex items-start gap-2 text-violet-300 animate-in fade-in slide-in-from-left-2"
              >
                <Zap className="w-3 h-3 text-violet-400 mt-0.5 shrink-0" />
                <span>{thought}</span>
              </div>
            ))}
            {currentStep >= 2 && currentStep < 5 && (
              <div className="mt-3 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <div className="text-[10px] text-violet-400 mb-1">Tool Call Generated:</div>
                <pre className="text-[10px] text-muted-foreground">
{`{
  "name": "get_weather",
  "arguments": {
    "location": "San Francisco",
    "unit": "celsius"
  }
}`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Tool Server */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-500/30 bg-emerald-500/10">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Tool Server</span>
          </div>
          <div className="p-3 space-y-2 min-h-[200px] font-mono text-xs">
            {serverLogs.length === 0 && currentStep < 3 && (
              <div className="text-muted-foreground/50">Waiting for tool call...</div>
            )}
            {serverLogs.map((log, i) => (
              <div 
                key={i}
                className={cn(
                  "flex items-start gap-2 animate-in fade-in slide-in-from-right-2",
                  log.type === "success" ? "text-emerald-300" :
                  log.type === "request" ? "text-amber-300" :
                  log.type === "response" ? "text-cyan-300" :
                  "text-muted-foreground"
                )}
              >
                <span className={cn(
                  "text-[10px] px-1 rounded shrink-0",
                  log.type === "success" ? "bg-emerald-500/20" :
                  log.type === "request" ? "bg-amber-500/20" :
                  log.type === "response" ? "bg-cyan-500/20" :
                  "bg-muted/50"
                )}>
                  {log.type.toUpperCase()}
                </span>
                <span>{log.message}</span>
              </div>
            ))}
            {currentStep >= 4 && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[10px] text-emerald-400 mb-1">Response Data:</div>
                <pre className="text-[10px] text-muted-foreground overflow-x-auto">
{weatherResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {invocationSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                  <button
              key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs",
                      isActive
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                        : isPast
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-muted/30 border-border/50 text-muted-foreground"
              )}
            >
              {isPast ? <CheckCircle className="w-3 h-3" /> : <span className="font-mono">{index + 1}</span>}
              <span className="hidden sm:inline">{step.label.split(" ").slice(0, 2).join(" ")}</span>
                  </button>
              );
            })}
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
            The LLM doesn&apos;t execute tools directly. It <strong>outputs structured data</strong> describing 
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

        <p className="text-muted-foreground">
          A tool definition includes a name, description, and parameter schema. The model uses the 
          description to decide when to use the tool, and the parameter schema to understand what 
          arguments are needed and which are required vs optional.
        </p>

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
          to the model. Always return errors as tool results, not exceptions—the model can 
          often recover or try a different approach.
        </p>

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
                &quot;Search the product catalog by name or SKU&quot; is better than &quot;Search products.&quot;
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
              <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 m-0">
                  <strong>Exception:</strong> Consolidate tools only if they&apos;re <em>always</em> used 
                  together in the same order. If a tool might be used independently (search OR update OR notify), 
                  keep them separate. The model should be able to call just the step it needs.
                </p>
              </div>
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
            what to do next. That&apos;s our next section.
          </p>
        </Callout>
      </div>
    </section>
  );
}
