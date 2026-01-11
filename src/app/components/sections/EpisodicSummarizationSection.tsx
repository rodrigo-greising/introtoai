"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import {
  Brain,
  RefreshCw,
  Database,
  Search,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  History,
  Zap,
  Target,
} from "lucide-react";

// =============================================================================
// Retrospective Builder Demo
// =============================================================================

interface EpisodeEntry {
  id: string;
  task: string;
  outcome: "success" | "failure" | "partial";
  errorPattern?: string;
  learning: string;
  embedding?: number[];
}

const sampleEpisodes: EpisodeEntry[] = [
  {
    id: "ep1",
    task: "Generate SQL query for user reports",
    outcome: "failure",
    errorPattern: "Syntax error in nested JOIN",
    learning: "Always validate SQL syntax before execution. Use parameterized queries for complex JOINs.",
  },
  {
    id: "ep2",
    task: "Parse PDF invoice for line items",
    outcome: "partial",
    errorPattern: "Missed multi-page tables",
    learning: "Check document page count first. For multi-page tables, collect all rows before processing.",
  },
  {
    id: "ep3",
    task: "Generate API integration code",
    outcome: "success",
    learning: "Breaking down into auth, request, response parsing steps works well for API integrations.",
  },
  {
    id: "ep4",
    task: "Summarize legal document",
    outcome: "failure",
    errorPattern: "Hallucinated clause numbers",
    learning: "For legal docs, always quote exact clause numbers from source. Never infer or generate numbers.",
  },
  {
    id: "ep5",
    task: "Debug authentication flow",
    outcome: "success",
    learning: "Trace the full token lifecycle: generation, storage, validation, refresh. Check each step.",
  },
];

function RetrospectiveBuilder() {
  const [episodes] = useState<EpisodeEntry[]>(sampleEpisodes);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [similarLearnings, setSimilarLearnings] = useState<EpisodeEntry[]>([]);

  const outcomeColors = {
    success: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", icon: CheckCircle },
    failure: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", icon: AlertTriangle },
    partial: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", icon: RefreshCw },
  };

  const searchSimilar = () => {
    if (!newTask.trim()) return;
    
    setIsSearching(true);
    // Simulate embedding search
    setTimeout(() => {
      const taskLower = newTask.toLowerCase();
      const matches = episodes.filter(ep => {
        const taskMatch = ep.task.toLowerCase().includes(taskLower.split(" ")[0]) ||
                         ep.learning.toLowerCase().includes(taskLower.split(" ")[0]);
        const keywordMatch = ["sql", "pdf", "api", "auth", "legal"].some(kw => 
          taskLower.includes(kw) && (ep.task.toLowerCase().includes(kw) || ep.learning.toLowerCase().includes(kw))
        );
        return taskMatch || keywordMatch;
      }).slice(0, 3);
      
      setSimilarLearnings(matches.length > 0 ? matches : episodes.slice(0, 2));
      setIsSearching(false);
    }, 500);
  };

  const failureCount = episodes.filter(e => e.outcome === "failure").length;
  const successRate = ((episodes.length - failureCount) / episodes.length * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total Episodes</div>
          <div className="text-2xl font-bold text-foreground">{episodes.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
          <div className={cn("text-2xl font-bold", Number(successRate) >= 60 ? "text-emerald-400" : "text-amber-400")}>
            {successRate}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-1">Learnings Captured</div>
          <div className="text-2xl font-bold text-violet-400">{episodes.length}</div>
        </div>
      </div>

      {/* Episode List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Episode History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {episodes.map((ep) => {
            const colors = outcomeColors[ep.outcome];
            const Icon = colors.icon;
            return (
              <button
                key={ep.id}
                onClick={() => setSelectedEpisode(selectedEpisode === ep.id ? null : ep.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  selectedEpisode === ep.id
                    ? `${colors.bg} ${colors.border}`
                    : "bg-muted/20 border-border hover:bg-muted/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colors.text)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{ep.task}</div>
                    {selectedEpisode === ep.id && (
                      <div className="mt-2 space-y-2 animate-in fade-in">
                        {ep.errorPattern && (
                          <div className="text-xs text-rose-400">
                            Error: {ep.errorPattern}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          <span className="text-violet-400 font-medium">Learning:</span> {ep.learning}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Similar Learnings */}
      <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
        <h4 className="text-sm font-medium text-violet-400 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Find Similar Learnings
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Describe your current task..."
            className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <button
            onClick={searchSimilar}
            disabled={!newTask.trim() || isSearching}
            className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
        
        {similarLearnings.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">Relevant learnings from past episodes:</div>
            {similarLearnings.map((ep) => (
              <div key={ep.id} className="p-2 rounded bg-background/30 text-xs">
                <div className="text-foreground font-medium">{ep.task}</div>
                <div className="text-muted-foreground mt-1">{ep.learning}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Try: &quot;Generate SQL report&quot;, &quot;Parse PDF document&quot;, or &quot;Debug auth issue&quot;
      </p>
    </div>
  );
}

// =============================================================================
// Learning Integration Flow
// =============================================================================

function LearningIntegrationFlow() {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Task Execution",
      description: "Agent attempts a task",
      icon: Target,
      color: "cyan",
      detail: "Agent receives: 'Generate SQL query for monthly revenue report'",
    },
    {
      title: "Outcome Detection",
      description: "Success/failure is recorded",
      icon: AlertTriangle,
      color: "rose",
      detail: "Error: SQL syntax error in nested GROUP BY clause",
    },
    {
      title: "Learning Extraction",
      description: "Pattern is identified and learning created",
      icon: Lightbulb,
      color: "amber",
      detail: "Learning: 'For complex aggregations, build subqueries step-by-step and validate each'",
    },
    {
      title: "Embedding Storage",
      description: "Learning is embedded and stored",
      icon: Database,
      color: "violet",
      detail: "Stored with embedding vector for semantic retrieval",
    },
    {
      title: "Future Retrieval",
      description: "Similar task triggers learning retrieval",
      icon: Search,
      color: "emerald",
      detail: "New task: 'Generate SQL for quarterly sales' → Retrieves: 'build subqueries step-by-step'",
    },
  ];

  const currentStep = steps[step];
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400" },
    rose: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400" },
    amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
    violet: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400" },
    emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" },
  };

  return (
    <div className="space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const colors = colorClasses[s.color];
          const isActive = i === step;
          const isPast = i < step;
          
          return (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setStep(i)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[70px]",
                  isActive
                    ? `${colors.bg} ${colors.border} border ring-2 ring-${s.color}-500/30`
                    : isPast
                    ? `${colors.bg} opacity-60`
                    : "bg-muted/20 opacity-40 hover:opacity-60"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive || isPast ? colors.text : "text-muted-foreground")} />
                <span className={cn("text-[10px] text-center", isActive ? colors.text : "text-muted-foreground")}>
                  {s.title}
                </span>
              </button>
              {i < steps.length - 1 && (
                <ArrowRight className={cn(
                  "w-3 h-3 mx-1 shrink-0",
                  i < step ? "text-emerald-500" : "text-muted-foreground/30"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Detail */}
      <div className={cn(
        "p-4 rounded-lg border transition-all",
        colorClasses[currentStep.color].bg,
        colorClasses[currentStep.color].border
      )}>
        <div className="flex items-start gap-3">
          <currentStep.icon className={cn("w-5 h-5 shrink-0", colorClasses[currentStep.color].text)} />
          <div>
            <h4 className={cn("font-medium", colorClasses[currentStep.color].text)}>
              {currentStep.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>
            <div className="mt-3 p-2 rounded bg-background/50 text-xs font-mono text-foreground">
              {currentStep.detail}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="px-3 py-1.5 rounded text-sm bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function EpisodicSummarizationSection() {
  return (
    <section id="episodic-summarization" className="scroll-mt-20">
      <SectionHeading
        id="episodic-summarization-heading"
        title="Episodic Summarization & Retrospectives"
        subtitle="Evolving context through learnings and error analysis"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The most sophisticated AI systems don&apos;t just execute tasks—they <strong className="text-foreground">learn 
          from their own history</strong>. Episodic summarization captures learnings from past executions, building a 
          knowledge base that improves future performance through iterative refinement.
        </p>

        <Callout variant="tip" title="The Key Insight">
          <p className="m-0">
            Instead of starting fresh every session, agents can retrieve relevant learnings from similar past 
            situations using embeddings. A failure in &quot;SQL report generation&quot; teaches the system to be more 
            careful with &quot;SQL dashboard queries&quot;—without explicit programming.
          </p>
        </Callout>

        {/* What is Episodic Summarization */}
        <h3 id="episodic-overview" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What is Episodic Summarization?
        </h3>

        <p className="text-muted-foreground">
          Episodic summarization is the process of <strong className="text-foreground">condensing task execution 
          episodes into structured learnings</strong> that can be retrieved and applied to future tasks. Each episode 
          captures:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">Task Context</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                What was the agent trying to accomplish? What inputs and constraints were provided?
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Outcome</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Success, failure, or partial success. What actually happened versus what was expected?
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h4 className="font-medium text-foreground">Error Pattern</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                For failures: what went wrong? Categorize the error type for pattern detection across episodes.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground">Learning</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                The actionable insight: what should the agent do differently next time in similar situations?
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Building Retrospectives */}
        <h3 id="building-retrospectives" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Building Retrospectives
        </h3>

        <p className="text-muted-foreground">
          A retrospective is the <strong className="text-foreground">automated post-mortem</strong> that runs after 
          each task execution. The system analyzes what happened and extracts learnings:
        </p>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">The Retrospective Process</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">1</div>
              <div>
                <div className="text-sm font-medium text-foreground">Capture Execution Trace</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record the task, tools used, intermediate outputs, and final result.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">2</div>
              <div>
                <div className="text-sm font-medium text-foreground">Evaluate Outcome</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Compare result against expected output. Classify as success, failure, or partial.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">3</div>
              <div>
                <div className="text-sm font-medium text-foreground">Extract Learning</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use an LLM to analyze the trace and generate an actionable learning statement.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">4</div>
              <div>
                <div className="text-sm font-medium text-foreground">Store with Embedding</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Embed the task description and learning for semantic retrieval in future tasks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          The retrospective generation uses a structured output schema. After a task completes, the system generates 
          a retrospective with task type, outcome (success, failure, partial), error pattern if applicable, and a 
          concise learning statement. This structured data is then embedded and stored for future retrieval.
        </p>

        {/* Learning from Failures */}
        <h3 id="learning-from-failures" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Learning from Failures
        </h3>

        <p className="text-muted-foreground">
          Failures are the most valuable learning opportunities. The key is <strong className="text-foreground">pattern 
          detection across failures</strong>—identifying systematic issues that can be addressed:
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <Brain className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-rose-400">Error Categorization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Group failures by type: syntax errors, hallucinations, missing context, tool misuse. Each category 
                suggests different interventions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-amber-400">Trend Analysis</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Track error rates over time. Are SQL errors decreasing? Are hallucinations increasing with certain 
                document types? Use trends to prioritize improvements.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <RefreshCw className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Automatic Remediation</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When a pattern is detected (e.g., 3+ SQL syntax failures), automatically add a validation step or 
                adjust the prompt to emphasize the learned pattern.
              </p>
            </div>
          </div>
        </div>

        <Callout variant="important" title="Don't Just Log—Learn">
          <p className="m-0">
            Many systems log errors but never learn from them. The difference is <strong>actionability</strong>: 
            a learning should be specific enough that retrieving it changes agent behavior. &quot;SQL failed&quot; is a log; 
            &quot;Build complex SQL queries step-by-step, validating each JOIN before adding the next&quot; is a learning.
          </p>
        </Callout>

        {/* Interactive: Learning Integration Flow */}
        <h3 id="embedding-similar-situations" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Embedding Similar Situations
        </h3>

        <p className="text-muted-foreground">
          The power of episodic memory comes from <strong className="text-foreground">semantic retrieval</strong>. 
          When a new task arrives, embed it and find similar past episodes:
        </p>

        <InteractiveWrapper
          title="Interactive: Learning Integration Flow"
          description="Step through how learnings are captured and retrieved"
          icon="🔄"
          colorTheme="violet"
          minHeight="auto"
        >
          <LearningIntegrationFlow />
        </InteractiveWrapper>

        <p className="text-muted-foreground mt-6">
          The retrieval process finds relevant learnings by embedding the task description and searching for similar 
          episodes. Results are ranked by similarity score, and the top learnings are injected into the agent&apos;s 
          context before execution. A similarity threshold (e.g., 0.75) ensures only truly relevant learnings are included.
        </p>

        {/* Interactive: Retrospective Builder */}
        <h3 id="integrating-learnings" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Integrating Learnings into Context
        </h3>

        <p className="text-muted-foreground">
          Retrieved learnings become part of the agent&apos;s context. The key is <strong className="text-foreground">positioning 
          them appropriately</strong> in the context layers:
        </p>

        <InteractiveWrapper
          title="Interactive: Retrospective Builder"
          description="Explore how learnings are captured and retrieved for similar tasks"
          icon="📚"
          colorTheme="cyan"
          minHeight="auto"
        >
          <RetrospectiveBuilder />
        </InteractiveWrapper>

        <div className="my-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Context Layer Placement</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Skill Context:</span>{" "}
                <span className="text-muted-foreground">
                  Learnings specific to a skill (e.g., SQL generation) go in that skill&apos;s context, loaded when 
                  the skill is activated.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <History className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Dynamic Context:</span>{" "}
                <span className="text-muted-foreground">
                  Retrieved learnings are dynamic—different for each task based on semantic similarity. Place them 
                  after static prompts but before the current task.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Aggregated Insights:</span>{" "}
                <span className="text-muted-foreground">
                  Common patterns across many episodes can be promoted to the system prompt as permanent guidance.
                </span>
              </div>
            </div>
          </div>
        </div>

        <Callout variant="tip" title="The Compounding Effect">
          <p>
            Over time, the learning database becomes increasingly valuable. Early failures teach patterns that 
            prevent future failures. The agent effectively <strong>trains itself</strong> through experience, 
            without requiring model fine-tuning or code changes.
          </p>
        </Callout>

        <h3 className="text-xl font-semibold mt-10 mb-4">Research & Further Reading</h3>

        <p className="text-muted-foreground">
          Episodic memory in AI systems is an active research area. Key papers and concepts include:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Reflexion (2023)</h4>
              <p className="text-sm text-muted-foreground m-0">
                Language agents with verbal reinforcement learning. Agents generate self-reflections on failures 
                and use them to improve subsequent attempts.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Voyager (2023)</h4>
              <p className="text-sm text-muted-foreground m-0">
                An LLM-powered lifelong learning agent in Minecraft that builds a skill library from experience, 
                retrieving and composing skills for new tasks.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">MemGPT (2023)</h4>
              <p className="text-sm text-muted-foreground m-0">
                Operating system-inspired memory management for LLMs, enabling long-term memory through 
                hierarchical memory tiers and retrieval.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
            <li>
              <strong>Capture everything</strong>—task, outcome, error patterns, and actionable learnings
            </li>
            <li>
              <strong>Embed for retrieval</strong>—semantic similarity finds relevant learnings even for novel tasks
            </li>
            <li>
              <strong>Automate the loop</strong>—retrospectives should run automatically after every execution
            </li>
            <li>
              <strong>Promote patterns</strong>—frequent learnings can graduate to permanent system prompt guidance
            </li>
            <li>
              <strong>Measure improvement</strong>—track success rates over time to validate the learning system works
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
