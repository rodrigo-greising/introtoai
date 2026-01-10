import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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

        {/* The Iterate-Until-Pass Pattern */}
        <h3 id="iterate-until-pass" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Iterate-Until-Pass Pattern
        </h3>

        <p className="text-muted-foreground">
          The pattern is simple: <strong className="text-foreground">trigger pipeline → capture failures → 
          feed to AI → apply fix → repeat</strong>. Each iteration brings the code closer to passing, 
          with the pipeline serving as ground truth.
        </p>

        <CodeBlock
          language="typescript"
          filename="iterate-until-pass.ts"
          code={`async function iterateUntilPass(maxAttempts: number = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(\`Attempt \${attempt}/\${maxAttempts}\`);
    
    // Run CI pipeline
    const result = await runPipeline();
    
    if (result.passed) {
      console.log('✓ Pipeline passed!');
      return { success: true, attempts: attempt };
    }
    
    // Extract actionable failures
    const failures = extractFailures(result);
    
    // Ask AI to fix
    const fix = await aiGenerateFix(failures);
    
    // Apply the fix
    await applyChanges(fix);
  }
  
  return { success: false, attempts: maxAttempts };
}`}
        />

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
        <h3 id="failure-thresholds" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Failure Thresholds and Exit Conditions
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
        <h3 id="self-healing-pipelines" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
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
        <h3 id="autonomous-fix-workflows" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
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
