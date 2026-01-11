"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  ArrowRight,
} from "lucide-react";

// Interactive Pipeline Visualizer
function PipelineVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [, setCurrentStage] = useState(-1);
  const [stageStatuses, setStageStatuses] = useState<Array<"pending" | "running" | "passed" | "failed">>([]);
  const [history, setHistory] = useState<Array<{ attempt: number; stages: string[]; fixed: string[] }>>([]);

  const stages = [
    { name: "Lint", fixable: true },
    { name: "Type Check", fixable: true },
    { name: "Unit Tests", fixable: true },
    { name: "Build", fixable: false },
  ];

  // Simulate a scenario where first 2 attempts have failures that get fixed
  const scenarios = [
    { failAt: 0, fixMessage: "Fixed: missing semicolons in utils.ts" },
    { failAt: 1, fixMessage: "Fixed: incorrect return type in apiClient.ts" },
    { failAt: -1, fixMessage: null }, // Pass all
  ];

  const runPipeline = async () => {
    setIsRunning(true);
    const scenario = scenarios[Math.min(attempt, scenarios.length - 1)];
    const newStatuses: Array<"pending" | "running" | "passed" | "failed"> = stages.map(() => "pending");
    setStageStatuses(newStatuses);

    const stageResults: string[] = [];
    
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      newStatuses[i] = "running";
      setStageStatuses([...newStatuses]);
      
      await new Promise(r => setTimeout(r, 800));
      
      if (i === scenario.failAt) {
        newStatuses[i] = "failed";
        setStageStatuses([...newStatuses]);
        stageResults.push(`${stages[i].name}: FAILED`);
        
        // Simulate AI fix
        await new Promise(r => setTimeout(r, 600));
        
        setHistory(prev => [...prev, { 
          attempt: attempt + 1, 
          stages: stageResults,
          fixed: scenario.fixMessage ? [scenario.fixMessage] : []
        }]);
        
        setAttempt(prev => prev + 1);
        setIsRunning(false);
        setCurrentStage(-1);
        return;
      } else {
        newStatuses[i] = "passed";
        setStageStatuses([...newStatuses]);
        stageResults.push(`${stages[i].name}: PASSED`);
      }
    }
    
    // All passed!
    setHistory(prev => [...prev, { 
      attempt: attempt + 1, 
      stages: stageResults,
      fixed: []
    }]);
    
    setIsRunning(false);
    setCurrentStage(-1);
  };

  const handleReset = () => {
    setIsRunning(false);
    setAttempt(0);
    setCurrentStage(-1);
    setStageStatuses([]);
    setHistory([]);
  };

  const allPassed = stageStatuses.length > 0 && stageStatuses.every(s => s === "passed");
  const hasFailed = stageStatuses.some(s => s === "failed");

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Pipeline Iteration Demo</h4>
        <div className="flex items-center gap-2">
          {!isRunning && !allPassed && (
            <button
              onClick={runPipeline}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              {attempt === 0 ? "Run Pipeline" : "Retry"}
            </button>
          )}
          {(history.length > 0 || allPassed) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="flex items-center gap-2 mb-6 p-4 rounded-lg bg-muted/20 border border-border overflow-x-auto">
        {stages.map((stage, i) => {
          const status = stageStatuses[i] || "pending";
          return (
            <div key={stage.name} className="flex items-center">
              <div className={`
                px-4 py-2 rounded-lg border flex items-center gap-2 whitespace-nowrap transition-all
                ${status === "running" ? "bg-amber-500/10 border-amber-500/30 scale-105" : ""}
                ${status === "passed" ? "bg-emerald-500/10 border-emerald-500/30" : ""}
                ${status === "failed" ? "bg-rose-500/10 border-rose-500/30" : ""}
                ${status === "pending" ? "bg-muted/30 border-border" : ""}
              `}>
                {status === "running" && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                {status === "passed" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {status === "failed" && <XCircle className="w-4 h-4 text-rose-400" />}
                {status === "pending" && <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />}
                <span className={`text-sm font-medium ${
                  status === "running" ? "text-amber-400" :
                  status === "passed" ? "text-emerald-400" :
                  status === "failed" ? "text-rose-400" :
                  "text-muted-foreground"
                }`}>{stage.name}</span>
              </div>
              {i < stages.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      {allPassed && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-400">Pipeline passed after {attempt} attempt(s)!</span>
        </div>
      )}

      {hasFailed && !isRunning && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-amber-400">AI fixing failure... Click &quot;Retry&quot; to continue</span>
        </div>
      )}

      {/* History log */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Iteration History</div>
          {history.map((h, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Attempt {h.attempt}</span>
                {h.fixed.length === 0 && i === history.length - 1 ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">PASSED</span>
                ) : h.fixed.length > 0 ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">FIXED → RETRY</span>
                ) : null}
              </div>
              {h.fixed.length > 0 && (
                <div className="text-xs text-cyan-400 font-mono mt-1">
                  🔧 {h.fixed[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {history.length === 0 && !isRunning && (
        <div className="text-sm text-muted-foreground text-center py-4">
          Click &quot;Run Pipeline&quot; to simulate an iterate-until-pass workflow
        </div>
      )}
    </div>
  );
}

export function CICDIterationSection() {
  return (
    <section id="cicd-iteration" className="scroll-mt-20">
      <SectionHeading
        id="cicd-iteration-heading"
        title="CI/CD Iteration Loops"
        subtitle="Automated pipelines that iterate until tests pass"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The most powerful pattern in agentic coding: <strong className="text-foreground">let AI 
          iterate against your CI/CD pipeline until it passes</strong>. The pipeline becomes the 
          oracle—AI proposes, CI validates, and the loop continues until success or failure threshold.
        </p>

        <Callout variant="important" title="The Key Insight">
          <p className="m-0">
            Your CI/CD pipeline already encodes your quality bar—tests, linting, type checking, 
            security scans. Instead of humans fixing failures, <strong>AI can attempt fixes 
            autonomously</strong>, using the pipeline itself as feedback.
          </p>
        </Callout>

        {/* Interactive Pipeline Demo */}
        <h3 id="iterate-pattern" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Iterate-Until-Pass Pattern
        </h3>

        <p className="text-muted-foreground">
          Watch the pattern in action: pipeline runs → fails → AI fixes → retry. Each iteration 
          brings the code closer to passing:
        </p>

        <PipelineVisualizer />

        <p className="text-muted-foreground">
          The iterate-until-pass pattern runs the CI pipeline, checks if it passed, and if not, extracts 
          actionable failures, asks AI to generate a fix, applies the changes, and repeats up to a maximum 
          number of attempts. This creates a tight feedback loop where AI fixes issues automatically until 
          the pipeline passes.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">What Works Well</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Lint errors and formatting fixes</li>
                <li>Type errors with clear messages</li>
                <li>Test failures with good assertions</li>
                <li>Missing import statements</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">What Needs Care</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Flaky tests (non-deterministic)</li>
                <li>Integration/E2E test failures</li>
                <li>Performance regressions</li>
                <li>Complex architectural issues</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Failure Thresholds and Exit Conditions */}
        <h3 id="failure-handling" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Failure Thresholds
        </h3>

        <p className="text-muted-foreground">
          Unbounded loops are dangerous. Define clear <strong className="text-foreground">exit 
          conditions</strong>: maximum attempts, time limits, or cost caps. When the threshold 
          is reached, escalate to human review.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Exit Condition Strategies</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Attempt limit:</strong> Stop after N failed attempts (e.g., 5)</li>
              <li><strong className="text-foreground">Time limit:</strong> Abort if loop runs longer than X minutes</li>
              <li><strong className="text-foreground">Cost cap:</strong> Track token usage, stop at budget limit</li>
              <li><strong className="text-foreground">Regression detection:</strong> Stop if fix makes more tests fail</li>
              <li><strong className="text-foreground">Semantic loop:</strong> Stop if AI proposes same fix twice</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="warning" title="Avoid Infinite Loops">
          <p className="m-0">
            Without exit conditions, AI might loop forever on an unfixable issue, burning tokens 
            and time. <strong>Always have a ceiling</strong>, and ensure the failure mode is 
            &quot;escalate to human&quot; not &quot;keep trying indefinitely.&quot;
          </p>
        </Callout>

        {/* Self-Healing Pipelines */}
        <h3 id="self-healing" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Self-Healing Pipelines
        </h3>

        <p className="text-muted-foreground">
          A self-healing pipeline automatically attempts to fix certain classes of failures without 
          human intervention. The key is <strong className="text-foreground">scoping what gets auto-fixed</strong>—not 
          everything should be automated.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Auto-Heal</h4>
              <p className="text-sm text-muted-foreground m-0">
                Lint fixes, formatting, simple type errors, dependency updates
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-500 mb-2">AI-Assisted</h4>
              <p className="text-sm text-muted-foreground m-0">
                Test failures, build errors, moderate complexity fixes
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Human Required</h4>
              <p className="text-sm text-muted-foreground m-0">
                Security issues, architectural problems, business logic changes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Autonomous Fix Workflows */}
        <h3 id="pipeline-viz" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Autonomous Fix Workflows
        </h3>

        <p className="text-muted-foreground">
          Autonomous fix workflows go beyond iteration—they <strong className="text-foreground">proactively 
          monitor and fix</strong> issues as they arise. This requires tight integration between 
          CI, AI, and your code review process.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Autonomous Fix Flow</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>CI detects failure on PR or main branch</li>
              <li>Failure is classified (auto-fixable vs needs human)</li>
              <li>For auto-fixable: AI generates and applies fix</li>
              <li>Fix is committed to a new branch/PR</li>
              <li>CI runs again on the fix</li>
              <li>If pass: auto-merge or flag for quick human review</li>
              <li>If fail: escalate to human with context</li>
            </ol>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Key References">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li><strong>Agent CI</strong> (agent-ci.com) — Git-native AI agent CI/CD integration</li>
            <li><strong>Gitar</strong> — Autonomous CI/CD failure fixes and code review handling</li>
            <li><strong>PALADIN</strong> (arxiv.org/abs/2509.25238) — Failure recovery for LLM agents</li>
            <li><strong>CodeCureAgent</strong> (arxiv.org/abs/2509.11787) — LLM agents for static analysis repair</li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
