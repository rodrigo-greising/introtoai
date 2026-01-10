"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  GitBranch, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// =============================================================================
// Comparison Visualizer
// =============================================================================

function ComparisonVisualizer() {
  const [activeTab, setActiveTab] = useState<"workflow" | "agent">("workflow");

  const workflowSteps = [
    { label: "Parse Input", status: "complete" },
    { label: "Validate Data", status: "complete" },
    { label: "Query Database", status: "complete" },
    { label: "Transform Results", status: "active" },
    { label: "Format Output", status: "pending" },
  ];

  const agentSteps = [
    { label: "Observe: User request", type: "observe" },
    { label: "Think: Need more info", type: "think" },
    { label: "Act: search_db()", type: "act" },
    { label: "Observe: Results sparse", type: "observe" },
    { label: "Think: Try different query", type: "think" },
    { label: "Act: search_db() v2", type: "act" },
    { label: "Complete: Answer user", type: "complete" },
  ];

  const coreLogic = `// Workflow: Deterministic path through predefined steps
async function workflow(input: Input): Promise<Output> {
  // Step 1: Always runs
  const parsed = parseInput(input);
  
  // Step 2: Conditional branch (but still deterministic)
  const validated = parsed.type === "A" 
    ? validateTypeA(parsed) 
    : validateTypeB(parsed);
  
  // Step 3: Always runs
  const results = await queryDatabase(validated);
  
  // Step 4: Transform and return
  return formatOutput(results);
}

// Agent: Dynamic decisions based on observations
async function agent(input: Input): Promise<Output> {
  const context = [{ role: "user", content: input }];
  
  while (true) {
    // LLM decides what to do next
    const response = await llm.complete({ messages: context, tools });
    
    // LLM chooses when to stop
    if (response.finishReason === "stop") {
      return response.content;
    }
    
    // LLM chooses which tools to call
    await executeToolCalls(response.toolCalls);
  }
}

// Key difference:
// Workflow: YOU define the path
// Agent: LLM decides the path`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Workflow vs Agent Patterns"
      description="Compare deterministic workflows with autonomous agents"
    >
      <div className="space-y-6">
        {/* Tab switcher */}
        <div className="flex rounded-lg bg-muted/30 p-1">
          <button
            onClick={() => setActiveTab("workflow")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "workflow"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GitBranch className="w-4 h-4" />
            Workflow
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "agent"
                ? "bg-violet-500/20 text-violet-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Agent
          </button>
        </div>

        {/* Workflow visualization */}
        {activeTab === "workflow" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cyan-400">Deterministic Path</span>
              <span className="text-xs text-muted-foreground">Fixed steps, predictable execution</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {workflowSteps.map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <div className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border min-w-[100px]",
                    step.status === "complete"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : step.status === "active"
                      ? "bg-cyan-500/10 border-cyan-500/30 ring-2 ring-cyan-500/50"
                      : "bg-muted/30 border-border/50"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      step.status === "complete"
                        ? "bg-emerald-500 text-white"
                        : step.status === "active"
                        ? "bg-cyan-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.status === "complete" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs text-center">{step.label}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground/50 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <h4 className="text-sm font-medium text-cyan-400 mb-2">Workflow Characteristics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Path is defined at compile time</li>
                <li>• Conditional branches, but predictable</li>
                <li>• Easy to test, debug, and reason about</li>
                <li>• LLM calls at specific steps only</li>
              </ul>
            </div>
          </div>
        )}

        {/* Agent visualization */}
        {activeTab === "agent" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-violet-400">Dynamic Path</span>
              <span className="text-xs text-muted-foreground">LLM decides next step each iteration</span>
            </div>

            <div className="space-y-2">
              {agentSteps.map((step, index) => {
                const colors: Record<string, { bg: string; border: string; text: string }> = {
                  observe: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
                  think: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
                  act: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
                  complete: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
                };
                const c = colors[step.type];
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg border",
                      c.bg, c.border
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className={cn("text-xs font-medium uppercase w-16", c.text)}>
                      {step.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
              <h4 className="text-sm font-medium text-violet-400 mb-2">Agent Characteristics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Path emerges at runtime</li>
                <li>• LLM decides each next step</li>
                <li>• Can adapt to unexpected situations</li>
                <li>• Harder to predict cost and behavior</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function WorkflowsVsAgentsSection() {
  return (
    <section id="workflows-vs-agents" className="scroll-mt-20">
      <SectionHeading
        id="workflows-vs-agents-heading"
        title="Workflows vs Agents"
        subtitle="Deterministic paths vs autonomous decisions"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Not every AI system needs to be an autonomous agent. <strong className="text-foreground">Workflows</strong> provide 
          predictable, testable execution paths. <strong className="text-foreground">Agents</strong> offer 
          flexibility for open-ended tasks. Understanding when to use each is crucial.
        </p>

        <Callout variant="tip" title="The Core Trade-off">
          <p>
            <strong>Workflows</strong>: You control the path → predictable, testable, efficient
            <br />
            <strong>Agents</strong>: LLM controls the path → flexible, adaptive, less predictable
          </p>
        </Callout>

        {/* Comparison */}
        <h3 id="workflows-defined" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Workflows?
        </h3>

        <p className="text-muted-foreground">
          A workflow is a <strong className="text-foreground">predefined sequence of steps</strong>. 
          You define the path at development time. LLM calls might happen at specific steps, 
          but the overall structure is deterministic.
        </p>

        <CodeBlock
          language="typescript"
          filename="workflow-example.ts"
          code={`// Workflow: Extract, transform, summarize
async function processDocument(doc: Document): Promise<Summary> {
  // Step 1: Extract text (deterministic)
  const text = await extractText(doc);
  
  // Step 2: Chunk (deterministic)
  const chunks = splitIntoChunks(text, 1000);
  
  // Step 3: Summarize each chunk (LLM, but controlled)
  const summaries = await Promise.all(
    chunks.map(chunk => llm.summarize(chunk))
  );
  
  // Step 4: Combine summaries (LLM, final step)
  return await llm.combineSummaries(summaries);
}

// The path is: extract → chunk → map-summarize → combine
// This NEVER changes. You can test, profile, and predict it.`}
        />

        {/* What are Agents */}
        <h3 id="agents-defined" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Agents?
        </h3>

        <p className="text-muted-foreground">
          An agent has <strong className="text-foreground">autonomy over its execution path</strong>. 
          The LLM decides which tools to call, how many iterations to run, and when to stop. 
          The same input can take different paths on different runs.
        </p>

        <CodeBlock
          language="typescript"
          filename="agent-example.ts"
          code={`// Agent: Research and answer
async function researchAgent(question: string): Promise<string> {
  return await agenticLoop({
    goal: question,
    tools: [
      searchWeb,      // LLM chooses when to search
      readDocument,   // LLM chooses what to read
      askFollowUp,    // LLM can ask clarifying questions
    ],
    maxIterations: 10,
  });
}

// The LLM might:
// - Search first, then read multiple documents
// - Or read one document and find the answer immediately
// - Or search, find nothing, try a different query
// The path EMERGES at runtime based on what the LLM finds`}
        />

        {/* Interactive Comparison */}
        <h3 id="comparison" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Use Each
        </h3>

        <InteractiveWrapper
          title="Interactive: Workflow vs Agent Comparison"
          description="Toggle between patterns to see the difference"
          icon="⚖️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <ComparisonVisualizer />
        </InteractiveWrapper>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">✓ Use Workflows When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>The task has a known, fixed structure</li>
                <li>You need predictable costs and latency</li>
                <li>Reliability and testability are critical</li>
                <li>Compliance requires audit trails</li>
                <li>The problem is well-understood</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">✓ Use Agents When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>The task is open-ended or exploratory</li>
                <li>You can't anticipate all paths</li>
                <li>Adaptability matters more than predictability</li>
                <li>The user expects conversational interaction</li>
                <li>Self-correction is valuable</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Hybrid Patterns */}
        <h3 id="hybrid-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Hybrid Patterns
        </h3>

        <p className="text-muted-foreground">
          The best systems often combine both. Use workflows for the outer structure, 
          with agents handling specific steps that need flexibility:
        </p>

        <CodeBlock
          language="typescript"
          filename="hybrid-pattern.ts"
          code={`// Hybrid: Workflow with agent steps
async function processCustomerRequest(request: Request): Promise<Response> {
  // Step 1: Classify (workflow - always runs)
  const category = await classifier.classify(request);
  
  // Step 2: Route based on category (workflow - deterministic)
  switch (category) {
    case "refund":
      // Workflow: fixed refund process
      return await refundWorkflow(request);
      
    case "complex_question":
      // Agent: needs flexibility to research
      return await researchAgent(request);
      
    case "simple_faq":
      // Workflow: direct lookup
      return await faqLookup(request);
  }
}

// The OUTER structure is a workflow (predictable routing)
// Some INNER steps use agents (flexibility where needed)
// Best of both worlds!`}
        />

        <Callout variant="tip" title="The Pragmatic Approach">
          <p>
            Start with workflows. Add agent capabilities only where you need them. A workflow 
            with one agent step is often better than a pure agent that's hard to control.
          </p>
        </Callout>

        {/* Decision Framework */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Decision Framework</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Consideration</th>
                <th className="text-left p-3 font-medium text-cyan-400">Workflow</th>
                <th className="text-left p-3 font-medium text-violet-400">Agent</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Predictability</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> High</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Variable</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Cost control</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Easy to estimate</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Depends on run</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Testability</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Unit testable</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Eval-based</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Flexibility</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Fixed paths</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Adaptive</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-foreground">Error handling</td>
                <td className="p-3"><CheckCircle className="w-4 h-4 text-emerald-400 inline" /> Explicit</td>
                <td className="p-3"><AlertCircle className="w-4 h-4 text-amber-400 inline" /> Self-healing</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="info" title="Coming Up: RAG">
          <p>
            With the foundations of structured outputs, tools, agentic loops, and workflow patterns 
            established, we're ready to tackle <strong>RAG (Retrieval-Augmented Generation)</strong>—the 
            technique that grounds LLM responses in your own data.
          </p>
        </Callout>
      </div>
    </section>
  );
}
