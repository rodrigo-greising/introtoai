import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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

        <CodeBlock
          language="bash"
          filename="harness.sh"
          code={`#!/bin/bash
# Simple harness pattern for AI iteration loops

MAX_ATTEMPTS=5
attempt=0

while [ $attempt -lt $MAX_ATTEMPTS ]; do
  echo "Attempt $((attempt + 1)) of $MAX_ATTEMPTS"
  
  # Run tests and capture output
  npm test 2>&1 | tee test_output.txt
  exit_code=\${PIPESTATUS[0]}
  
  if [ $exit_code -eq 0 ]; then
    echo "✓ All tests passed"
    exit 0
  fi
  
  # Extract error for AI feedback
  echo "Tests failed. Feeding results back to AI..."
  # Your AI feedback mechanism here
  
  attempt=$((attempt + 1))
done

echo "✗ Max attempts reached"
exit 1`}
        />

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
