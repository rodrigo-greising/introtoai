"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import {
  Eye,
  Tag,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  RefreshCw,
  Zap,
  Database,
  Search,
  Settings,
  Activity,
} from "lucide-react";

// =============================================================================
// Trace Viewer Demo
// =============================================================================

interface TraceEvent {
  id: string;
  type: "input" | "generation" | "tool_call" | "tool_result" | "output" | "error";
  name: string;
  tokens?: number;
  latency?: number;
  status?: "success" | "error";
  content?: string;
}

interface Trace {
  id: string;
  task: string;
  timestamp: string;
  totalTokens: number;
  totalLatency: number;
  status: "success" | "error" | "partial";
  score?: number;
  events: TraceEvent[];
  labels?: string[];
}

const sampleTraces: Trace[] = [
  {
    id: "trace-1",
    task: "Generate quarterly report SQL",
    timestamp: "2024-01-15 14:32:00",
    totalTokens: 2340,
    totalLatency: 3200,
    status: "success",
    score: 0.92,
    labels: ["sql", "reports", "correct"],
    events: [
      { id: "e1", type: "input", name: "User Request", tokens: 45 },
      { id: "e2", type: "generation", name: "LLM Response", tokens: 280, latency: 1200 },
      { id: "e3", type: "tool_call", name: "execute_sql", tokens: 180 },
      { id: "e4", type: "tool_result", name: "SQL Result", tokens: 520, status: "success" },
      { id: "e5", type: "generation", name: "Format Response", tokens: 340, latency: 800 },
      { id: "e6", type: "output", name: "Final Output", tokens: 420 },
    ],
  },
  {
    id: "trace-2",
    task: "Parse invoice PDF",
    timestamp: "2024-01-15 14:35:22",
    totalTokens: 4120,
    totalLatency: 5800,
    status: "error",
    score: 0.34,
    labels: ["pdf", "parsing", "hallucination"],
    events: [
      { id: "e1", type: "input", name: "User Request", tokens: 52 },
      { id: "e2", type: "tool_call", name: "extract_pdf_text", tokens: 120 },
      { id: "e3", type: "tool_result", name: "PDF Content", tokens: 1850, status: "success" },
      { id: "e4", type: "generation", name: "LLM Analysis", tokens: 920, latency: 2400 },
      { id: "e5", type: "error", name: "Validation Failed", content: "Line item total mismatch" },
      { id: "e6", type: "generation", name: "Retry Attempt", tokens: 780, latency: 1800 },
      { id: "e7", type: "output", name: "Partial Output", tokens: 400, status: "error" },
    ],
  },
  {
    id: "trace-3",
    task: "Summarize support ticket",
    timestamp: "2024-01-15 14:40:15",
    totalTokens: 890,
    totalLatency: 1100,
    status: "success",
    score: 0.88,
    labels: ["summarization", "support", "correct"],
    events: [
      { id: "e1", type: "input", name: "User Request", tokens: 320 },
      { id: "e2", type: "generation", name: "Summary", tokens: 420, latency: 900 },
      { id: "e3", type: "output", name: "Final Output", tokens: 150 },
    ],
  },
];

function TraceViewer() {
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "error">("all");

  const filteredTraces = sampleTraces.filter(
    t => filterStatus === "all" || t.status === filterStatus
  );

  const statusColors = {
    success: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
    error: { bg: "bg-rose-500/20", text: "text-rose-400" },
    partial: { bg: "bg-amber-500/20", text: "text-amber-400" },
  };

  const eventTypeColors: Record<TraceEvent["type"], string> = {
    input: "text-cyan-400",
    generation: "text-violet-400",
    tool_call: "text-amber-400",
    tool_result: "text-emerald-400",
    output: "text-sky-400",
    error: "text-rose-400",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Filter:</span>
        {(["all", "success", "error"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "px-2 py-1 rounded text-xs transition-all",
              filterStatus === status
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Trace List */}
      <div className="grid gap-2">
        {filteredTraces.map(trace => (
          <button
            key={trace.id}
            onClick={() => setSelectedTrace(selectedTrace?.id === trace.id ? null : trace)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all",
              selectedTrace?.id === trace.id
                ? "bg-muted/40 border-cyan-500/40 ring-1 ring-cyan-500/20"
                : "bg-muted/20 border-border hover:bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-medium",
                  statusColors[trace.status].bg,
                  statusColors[trace.status].text
                )}>
                  {trace.status}
                </span>
                <span className="text-sm font-medium text-foreground">{trace.task}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{trace.totalTokens} tokens</span>
                <span>{(trace.totalLatency / 1000).toFixed(1)}s</span>
                {trace.score !== undefined && (
                  <span className={cn(
                    "font-medium",
                    trace.score >= 0.8 ? "text-emerald-400" : 
                    trace.score >= 0.5 ? "text-amber-400" : "text-rose-400"
                  )}>
                    {(trace.score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Labels */}
            {trace.labels && (
              <div className="flex gap-1 mt-2">
                {trace.labels.map(label => (
                  <span
                    key={label}
                    className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-[10px]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Expanded View */}
            {selectedTrace?.id === trace.id && (
              <div className="mt-4 pt-4 border-t border-border animate-in fade-in">
                <div className="text-xs text-muted-foreground mb-2">Event Timeline</div>
                <div className="space-y-1">
                  {trace.events.map((event) => (
                    <div key={event.id} className="flex items-center gap-2 text-xs">
                      <span className={cn("font-mono w-20", eventTypeColors[event.type])}>
                        {event.type}
                      </span>
                      <span className="text-foreground flex-1">{event.name}</span>
                      {event.tokens && (
                        <span className="text-muted-foreground">{event.tokens} tok</span>
                      )}
                      {event.latency && (
                        <span className="text-muted-foreground">{event.latency}ms</span>
                      )}
                      {event.status === "error" && (
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Click a trace to expand and see the full event timeline
      </p>
    </div>
  );
}

// =============================================================================
// Failure Pattern Dashboard
// =============================================================================

interface FailurePattern {
  pattern: string;
  count: number;
  category: string;
  trend: "up" | "down" | "stable";
  suggestedFix: string;
}

const failurePatterns: FailurePattern[] = [
  {
    pattern: "SQL syntax errors in nested JOINs",
    count: 23,
    category: "code_generation",
    trend: "down",
    suggestedFix: "Add step-by-step SQL validation to code generation skill",
  },
  {
    pattern: "Hallucinated document references",
    count: 15,
    category: "rag",
    trend: "stable",
    suggestedFix: "Increase retrieval confidence threshold from 0.7 to 0.8",
  },
  {
    pattern: "Timeout on large file processing",
    count: 12,
    category: "tools",
    trend: "up",
    suggestedFix: "Implement chunked processing for files > 100KB",
  },
  {
    pattern: "JSON parsing failures",
    count: 8,
    category: "structured_output",
    trend: "down",
    suggestedFix: "Switch to strict JSON mode with schema validation",
  },
];

function FailurePatternDashboard() {
  const [selectedPattern, setSelectedPattern] = useState<FailurePattern | null>(null);

  const trendIcons = {
    up: <TrendingUp className="w-3 h-3 text-rose-400" />,
    down: <TrendingUp className="w-3 h-3 text-emerald-400 rotate-180" />,
    stable: <Activity className="w-3 h-3 text-muted-foreground" />,
  };

  const categoryColors: Record<string, string> = {
    code_generation: "text-violet-400 bg-violet-500/20",
    rag: "text-cyan-400 bg-cyan-500/20",
    tools: "text-amber-400 bg-amber-500/20",
    structured_output: "text-emerald-400 bg-emerald-500/20",
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <div className="text-2xl font-bold text-rose-400">
            {failurePatterns.reduce((sum, p) => sum + p.count, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Failures</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <div className="text-2xl font-bold text-amber-400">
            {failurePatterns.length}
          </div>
          <div className="text-xs text-muted-foreground">Patterns Detected</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {failurePatterns.filter(p => p.trend === "down").length}
          </div>
          <div className="text-xs text-muted-foreground">Improving</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <div className="text-2xl font-bold text-violet-400">
            {failurePatterns.filter(p => p.trend === "up").length}
          </div>
          <div className="text-xs text-muted-foreground">Needs Attention</div>
        </div>
      </div>

      {/* Pattern List */}
      <div className="space-y-2">
        {failurePatterns.map((pattern, i) => (
          <button
            key={i}
            onClick={() => setSelectedPattern(selectedPattern === pattern ? null : pattern)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all",
              selectedPattern === pattern
                ? "bg-muted/40 border-rose-500/40"
                : "bg-muted/20 border-border hover:bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {trendIcons[pattern.trend]}
                <span className="text-sm font-medium text-foreground">{pattern.pattern}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("px-1.5 py-0.5 rounded text-[10px]", categoryColors[pattern.category])}>
                  {pattern.category}
                </span>
                <span className="text-sm font-bold text-rose-400">{pattern.count}</span>
              </div>
            </div>
            
            {selectedPattern === pattern && (
              <div className="mt-3 pt-3 border-t border-border animate-in fade-in">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Suggested Fix:</div>
                    <div className="text-sm text-foreground">{pattern.suggestedFix}</div>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function ObservabilitySection() {
  return (
    <section id="observability" className="scroll-mt-20">
      <SectionHeading
        id="observability-heading"
        title="Observability & Monitoring"
        subtitle="Tracking, labeling, and learning from agent behavior"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          You can&apos;t improve what you can&apos;t measure. <strong className="text-foreground">Observability</strong> for 
          AI systems means capturing every trace, labeling outcomes, and using that data to systematically improve 
          your agents. This goes beyond logging—it&apos;s about building a feedback loop that makes your system smarter.
        </p>

        <Callout variant="important" title="The Observability Gap">
          <p className="m-0">
            Most teams ship AI features without proper observability, then wonder why performance degrades or 
            costs spike. Without traces and labels, you&apos;re flying blind—debugging by guesswork instead of data.
          </p>
        </Callout>

        {/* Why Observability Matters */}
        <h3 id="why-observability" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Why Observability Matters
        </h3>

        <p className="text-muted-foreground">
          AI systems fail in ways that traditional software doesn&apos;t. A function doesn&apos;t crash—it returns a 
          plausible-sounding hallucination. Observability helps you catch these subtle failures:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">Trace Everything</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Capture the full execution trace: inputs, LLM calls, tool invocations, intermediate outputs, 
                and final results. You&apos;ll need this for debugging.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground">Label Outcomes</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Was the output correct? Partially correct? Wrong? Labels turn raw traces into training data 
                for analysis and improvement.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Track Trends</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Is accuracy improving over time? Are certain task types degrading? Trends reveal systemic 
                issues before they become critical.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Monitor Costs</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Token usage, latency, and cost per task. Identify expensive patterns and optimize 
                where it matters most.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Labeling with Langfuse */}
        <h3 id="labeling-langfuse" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Labeling with Langfuse
        </h3>

        <p className="text-muted-foreground">
          <a href="https://langfuse.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Langfuse
          </a> is an open-source observability platform built specifically for LLM applications. It provides 
          tracing, scoring, and analytics out of the box:
        </p>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">Langfuse Integration Pattern</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">1</div>
              <div>
                <div className="font-medium text-foreground">Wrap LLM Calls</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Langfuse SDK automatically captures prompts, completions, tokens, and latency.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">2</div>
              <div>
                <div className="font-medium text-foreground">Add Trace Metadata</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tag traces with user ID, task type, session ID for filtering and analysis.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">3</div>
              <div>
                <div className="font-medium text-foreground">Score Outputs</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add scores manually (human feedback) or programmatically (automated evals).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">4</div>
              <div>
                <div className="font-medium text-foreground">Analyze in Dashboard</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View traces, filter by score, identify patterns, export for further analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          Langfuse uses a trace hierarchy: traces contain generations (LLM calls) and spans (custom events). 
          You initialize with your API keys, observe generations to capture model calls, score traces with 
          labels like &quot;accuracy&quot; or &quot;hallucination&quot;, and the dashboard aggregates everything for analysis.
        </p>

        <Callout variant="tip" title="Alternatives to Langfuse">
          <p className="m-0">
            Other observability tools include <strong>LangSmith</strong> (LangChain&apos;s platform), 
            <strong> Weights & Biases</strong> (ML experiment tracking), <strong>Helicone</strong> (proxy-based 
            logging), and <strong>Arize Phoenix</strong> (open-source tracing). The patterns are similar—pick 
            the one that fits your stack.
          </p>
        </Callout>

        {/* Interactive: Trace Viewer */}
        <h3 id="failure-pattern-analysis" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Failure Pattern Analysis
        </h3>

        <p className="text-muted-foreground">
          Individual failures are noise. <strong className="text-foreground">Patterns across failures are signal</strong>. 
          The goal is to identify systematic issues that can be addressed with prompt changes, skill updates, 
          or architectural improvements.
        </p>

        <InteractiveWrapper
          title="Interactive: Trace Viewer"
          description="Explore traces with labels, scores, and event timelines"
          icon="🔍"
          colorTheme="cyan"
          minHeight="auto"
        >
          <TraceViewer />
        </InteractiveWrapper>

        <h4 className="text-lg font-medium mt-8 mb-4">Pattern Detection</h4>

        <p className="text-muted-foreground">
          Aggregate failures by error type, task category, and time period. Look for:
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-rose-400">Recurring Error Types</h4>
              <p className="text-sm text-muted-foreground mt-1">
                &quot;SQL syntax error&quot; appearing 50+ times? That&apos;s a pattern worth fixing. Add validation, 
                improve the prompt, or create a dedicated SQL skill with guardrails.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <MessageSquare className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-amber-400">Task Type Clusters</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Failures concentrated in &quot;PDF parsing&quot; tasks? The issue might be document preprocessing, 
                not the LLM. Analyze the cluster to find root cause.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <TrendingUp className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-violet-400">Temporal Patterns</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Errors spiking after a model update? Performance degrading over time as prompts drift? 
                Time-series analysis reveals environmental factors.
              </p>
            </div>
          </div>
        </div>

        <InteractiveWrapper
          title="Interactive: Failure Pattern Dashboard"
          description="Analyze patterns across failures to identify systematic issues"
          icon="📊"
          colorTheme="rose"
          minHeight="auto"
        >
          <FailurePatternDashboard />
        </InteractiveWrapper>

        {/* Prompt Iteration from Data */}
        <h3 id="prompt-iteration" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Prompt Iteration from Data
        </h3>

        <p className="text-muted-foreground">
          Observability data should drive prompt improvements. The cycle is: <strong className="text-foreground">measure 
          → identify patterns → hypothesize fixes → test → deploy → measure again</strong>.
        </p>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">Data-Driven Prompt Iteration</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">1. Query Failures</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Filter traces by low scores or specific error labels. Export a sample for analysis.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">2. Analyze Prompts</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Compare failing prompts to successful ones. What&apos;s different? Missing context? Ambiguous instructions?
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">3. Create Variant</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Design a prompt variant that addresses the identified issue. Add examples, constraints, or clarifications.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">4. A/B Test</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Deploy both variants, route traffic, compare metrics. Statistical significance before full rollout.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          The key is <strong className="text-foreground">systematic iteration</strong>. Don&apos;t change prompts based 
          on hunches—change them based on data, and measure the impact. This transforms prompt engineering from 
          art into science.
        </p>

        {/* Automated Learning Systems */}
        <h3 id="automated-learning" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Automated Learning Systems
        </h3>

        <p className="text-muted-foreground">
          The ultimate goal is <strong className="text-foreground">closing the loop automatically</strong>. Instead of 
          humans reviewing traces and updating prompts, the system can learn from its own data:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Automatic Retrieval Tuning</h4>
              <p className="text-sm text-muted-foreground m-0">
                When RAG queries fail, log the query and expected result. Use this data to fine-tune embeddings 
                or adjust retrieval parameters automatically.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Dynamic Few-Shot Selection</h4>
              <p className="text-sm text-muted-foreground m-0">
                Track which few-shot examples lead to successful outputs. Dynamically select examples based on 
                task similarity and historical performance.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Self-Healing Prompts</h4>
              <p className="text-sm text-muted-foreground m-0">
                When a failure pattern is detected, automatically inject learnings into the prompt. &quot;Avoid X 
                when doing Y&quot; becomes part of the instructions without human intervention.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">LLM-as-Judge Pipelines</h4>
              <p className="text-sm text-muted-foreground m-0">
                Use a separate LLM to evaluate outputs and generate scores automatically. Combined with human 
                spot-checks for calibration, this scales labeling dramatically.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Research Papers">
          <p className="mb-2">
            Automated learning from traces is an active research area:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Constitutional AI</strong> - Self-improvement through critiques and revisions
            </li>
            <li>
              <strong>RLHF with AI Feedback</strong> - Using LLMs to generate preference data
            </li>
            <li>
              <strong>DSPy</strong> - Automatic prompt optimization through program synthesis
            </li>
            <li>
              <strong>Trace-Driven Development</strong> - Using execution traces to improve agent behavior
            </li>
          </ul>
        </Callout>

        <Callout variant="tip" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
            <li>
              <strong>Trace everything</strong>—you can&apos;t improve what you can&apos;t measure
            </li>
            <li>
              <strong>Label diligently</strong>—scores turn traces into actionable data
            </li>
            <li>
              <strong>Look for patterns</strong>—individual failures are noise, patterns are signal
            </li>
            <li>
              <strong>Iterate systematically</strong>—data-driven prompt changes, not hunches
            </li>
            <li>
              <strong>Automate the loop</strong>—self-healing systems outperform manual tuning at scale
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
