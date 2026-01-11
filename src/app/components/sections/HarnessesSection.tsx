"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Play, 
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Terminal,
} from "lucide-react";

// =============================================================================
// Test Harness Builder
// =============================================================================

interface TestCase {
  id: string;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: number;
  error?: string;
}

function TestHarnessBuilder() {
  const [tests, setTests] = useState<TestCase[]>([
    { id: "1", name: "should return correct sum for positive numbers", status: "pending" },
    { id: "2", name: "should handle zero correctly", status: "pending" },
    { id: "3", name: "should handle negative numbers", status: "pending" },
    { id: "4", name: "should throw for non-numeric input", status: "pending" },
    { id: "5", name: "should handle large numbers", status: "pending" },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setIteration(prev => prev + 1);
    
    // Reset all tests
    setTests(prev => prev.map(t => ({ ...t, status: "pending", error: undefined })));
    
    for (let i = 0; i < tests.length; i++) {
      // Set running
      setTests(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: "running" as const } : t
      ));
      
      // Simulate test execution
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      
      // Random pass/fail (weighted toward pass after more iterations)
      const passRate = 0.6 + (iteration * 0.1);
      const passed = Math.random() < passRate;
      const duration = Math.floor(10 + Math.random() * 90);
      
      setTests(prev => prev.map((t, idx) => 
        idx === i ? { 
          ...t, 
          status: passed ? "passed" as const : "failed" as const,
          duration,
          error: passed ? undefined : "AssertionError: Expected 42 but got 41"
        } : t
      ));
    }
    
    setIsRunning(false);
  };

  const reset = () => {
    setTests(prev => prev.map(t => ({ ...t, status: "pending", error: undefined, duration: undefined })));
    setIteration(0);
  };

  const passedCount = tests.filter(t => t.status === "passed").length;
  const failedCount = tests.filter(t => t.status === "failed").length;
  const allPassed = passedCount === tests.length;

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-rose-400" />;
      case "running": return <Clock className="w-4 h-4 text-amber-400 animate-spin" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            !isRunning
              ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              : "bg-muted/30 text-muted-foreground cursor-not-allowed"
          )}
        >
          <Play className="w-4 h-4" />
          Run Tests
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        {iteration > 0 && (
          <span className="ml-auto text-sm text-muted-foreground">
            Iteration #{iteration}
          </span>
        )}
      </div>

      {/* Test list */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Test Suite: add.test.ts</span>
        </div>
        <div className="divide-y divide-border">
          {tests.map((test) => (
            <div
              key={test.id}
              className={cn(
                "px-4 py-3 flex items-start gap-3 transition-all",
                test.status === "running" && "bg-amber-500/5",
                test.status === "failed" && "bg-rose-500/5"
              )}
            >
              {getStatusIcon(test.status)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono">{test.name}</div>
                {test.error && (
                  <div className="text-xs text-rose-400 mt-1 font-mono">{test.error}</div>
                )}
              </div>
              {test.duration && (
                <span className="text-xs text-muted-foreground shrink-0">{test.duration}ms</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(passedCount > 0 || failedCount > 0) && (
        <div className={cn(
          "p-4 rounded-lg flex items-center justify-between",
          allPassed 
            ? "bg-emerald-500/10 border border-emerald-500/30"
            : "bg-rose-500/10 border border-rose-500/30"
        )}>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-emerald-400">{passedCount} passed</span>
            {failedCount > 0 && (
              <span className="text-rose-400">{failedCount} failed</span>
            )}
          </div>
          <span className={cn(
            "text-sm font-medium",
            allPassed ? "text-emerald-400" : "text-rose-400"
          )}>
            {allPassed ? "✓ All tests pass!" : "✗ Some tests failed"}
          </span>
        </div>
      )}

      {/* AI feedback hint */}
      <div className="text-xs text-muted-foreground">
        {failedCount > 0 
          ? "→ AI would receive error messages and iterate on the implementation"
          : passedCount > 0 
            ? "→ AI iteration complete. Implementation verified."
            : "→ Run tests to validate AI-generated code"
        }
      </div>
    </div>
  );
}

export function HarnessesSection() {
  return (
    <section id="harnesses-evaluation" className="scroll-mt-20">
      <SectionHeading
        id="harnesses-evaluation-heading"
        title="Harnesses and Evaluation"
        subtitle="Building frameworks to validate AI-generated code"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          A test harness provides the <strong className="text-foreground">infrastructure for automated 
          validation</strong>—running tests, capturing results, and enabling iteration. For AI coding 
          workflows, harnesses are essential for closing the feedback loop.
        </p>

        <Callout variant="info" title="Harness vs Test Suite">
          <p className="m-0">
            A <strong>test suite</strong> is a collection of tests. A <strong>harness</strong> is the 
            machinery that runs those tests, reports results, and integrates with your workflow. 
            The harness enables automation; the tests define correctness.
          </p>
        </Callout>

        {/* Interactive Harness */}
        <h3 id="try-harness" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Try It: Test Harness Simulation
        </h3>

        <p className="text-muted-foreground">
          See how a test harness provides feedback to AI. Run the tests multiple times—the &quot;AI&quot; 
          improves with each iteration (simulated by increasing pass rate).
        </p>

        <InteractiveWrapper
          title="Interactive: Test Harness"
          description="Simulate AI iteration against tests"
          icon="🧪"
          colorTheme="cyan"
          minHeight="auto"
        >
          <TestHarnessBuilder />
        </InteractiveWrapper>

        {/* What is a Test Harness */}
        <h3 id="what-is-harness" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What is a Test Harness
        </h3>

        <p className="text-muted-foreground">
          A test harness abstracts the mechanics of test execution: <strong className="text-foreground">setup</strong>, 
          <strong className="text-foreground">execution</strong>, <strong className="text-foreground">teardown</strong>, 
          and <strong className="text-foreground">reporting</strong>. It enables consistent, repeatable validation 
          that can be triggered programmatically.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Harness Components</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Test runner (Jest, pytest, etc.)</li>
                <li>Environment setup/teardown</li>
                <li>Result capture and formatting</li>
                <li>Exit code for pass/fail</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">AI Integration Points</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Trigger harness after code generation</li>
                <li>Parse results for AI feedback</li>
                <li>Loop until pass or max attempts</li>
                <li>Surface actionable error messages</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Building Evaluation Harnesses */}
        <h3 id="building-harnesses" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building Evaluation Harnesses
        </h3>

        <p className="text-muted-foreground">
          An effective harness for AI workflows needs to be <strong className="text-foreground">fast</strong>, 
          <strong className="text-foreground">informative</strong>, and <strong className="text-foreground">automatable</strong>. 
          The faster the feedback, the tighter the iteration loop.
        </p>

        <p className="text-muted-foreground">
          A simple harness pattern for AI iteration loops: run tests up to a maximum number of attempts, 
          capture the output, check if tests passed, and if not, extract errors and feed them back to 
          the AI for the next iteration. The harness output is what the AI sees, so clear, actionable 
          error messages are critical.
        </p>

        <Callout variant="tip" title="Error Message Quality">
          <p className="m-0">
            The harness output is what the AI sees. <strong>Clear, actionable error messages</strong> are 
            critical. &quot;Test failed&quot; is useless; &quot;Expected 15 but got 10 in calculateDiscount for input 150&quot; 
            tells the AI exactly what to fix.
          </p>
        </Callout>

        {/* Iterative Test Generation */}
        <h3 id="iterative-test-gen" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Iterative Test Generation
        </h3>

        <p className="text-muted-foreground">
          Harnesses can also drive <strong className="text-foreground">test generation</strong> itself. 
          Start with core tests, measure coverage, and iteratively add tests for uncovered paths. 
          AI can propose tests; the harness validates they&apos;re meaningful.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Iterative Test Gen Flow</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>Run existing tests, measure coverage</li>
              <li>Identify uncovered code paths</li>
              <li>AI proposes tests for uncovered paths</li>
              <li>Harness runs new tests, validates they exercise intended paths</li>
              <li>Human reviews and approves meaningful additions</li>
              <li>Repeat until coverage target met</li>
            </ol>
          </CardContent>
        </Card>

        {/* Benchmarking AI Code Quality */}
        <h3 id="benchmarking-quality" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Benchmarking AI Code Quality
        </h3>

        <p className="text-muted-foreground">
          Beyond pass/fail, harnesses can measure <strong className="text-foreground">quality metrics</strong>: 
          code complexity, test coverage, performance benchmarks. Track these over time to understand 
          how AI-generated code compares to human-written code.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Correctness</h4>
              <p className="text-sm text-muted-foreground m-0">
                Test pass rate, edge case coverage, regression detection
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Quality</h4>
              <p className="text-sm text-muted-foreground m-0">
                Cyclomatic complexity, code duplication, linter warnings
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Performance</h4>
              <p className="text-sm text-muted-foreground m-0">
                Execution time, memory usage, benchmark comparisons
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Key References">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li><strong>TestForge</strong> (arxiv.org/abs/2503.14713) — Agentic iterative test suite generation</li>
            <li><strong>SWE-bench</strong> — Benchmark for evaluating AI on real GitHub issues</li>
            <li><strong>HumanEval</strong> — Code generation benchmark with test-based evaluation</li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
