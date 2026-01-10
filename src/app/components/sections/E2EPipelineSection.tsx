import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";

export function E2EPipelineSection() {
  return (
    <section id="e2e-agentic-pipeline" className="scroll-mt-20">
      <SectionHeading
        id="e2e-agentic-pipeline-heading"
        title="End-to-End Agentic Pipeline"
        subtitle="Full stack from customer feedback to production"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          The end-to-end agentic pipeline connects <strong className="text-foreground">customer 
          feedback to production deployment</strong> with AI assistance at every stage. This is 
          the full vision: automated where beneficial, human-controlled where judgment is needed.
        </p>

        <Callout variant="important" title="Mix and Match">
          <p className="m-0">
            The tools shown here are <strong>examples</strong>. The pattern matters more than 
            specific vendors. Substitute any tool that fits your team&apos;s needs: the architecture 
            remains the same.
          </p>
        </Callout>

        {/* The Full Stack Architecture */}
        <h3 id="full-stack-architecture" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Full Stack Architecture
        </h3>

        <p className="text-muted-foreground">
          The pipeline has five stages: <strong className="text-foreground">Input → Execution → 
          Review → Deploy → Monitor</strong>. AI assists at each stage, but humans control the 
          gates between stages.
        </p>

        <div className="grid gap-4 sm:grid-cols-5 mt-6">
          <Card variant="default">
            <CardContent className="text-center">
              <h4 className="font-medium text-foreground mb-2">Input</h4>
              <p className="text-xs text-muted-foreground m-0">Customer feedback → Tasks</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <h4 className="font-medium text-foreground mb-2">Execute</h4>
              <p className="text-xs text-muted-foreground m-0">Tasks → Code changes</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <h4 className="font-medium text-foreground mb-2">Review</h4>
              <p className="text-xs text-muted-foreground m-0">AI + Human review</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <h4 className="font-medium text-foreground mb-2">Deploy</h4>
              <p className="text-xs text-muted-foreground m-0">Staging → Production</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="text-center">
              <h4 className="font-medium text-foreground mb-2">Monitor</h4>
              <p className="text-xs text-muted-foreground m-0">Observe → Feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer to Task */}
        <h3 id="customer-to-task" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Customer to Task (PM with AI)
        </h3>

        <p className="text-muted-foreground">
          Customer feedback arrives through support channels, user research, and analytics. AI 
          helps <strong className="text-foreground">triage, categorize, and draft tasks</strong>, 
          while PMs validate and prioritize.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Example Flow</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>Support ticket: &quot;Export to PDF is broken on Safari&quot;</li>
              <li>AI categorizes as bug, priority: high, area: export</li>
              <li>AI drafts issue with repro steps from ticket</li>
              <li>PM reviews, adds acceptance criteria, assigns to cycle</li>
              <li>Issue enters backlog in Linear (or your tool)</li>
            </ol>
          </CardContent>
        </Card>

        {/* Task to Code */}
        <h3 id="task-to-code" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Task to Code (Background Execution)
        </h3>

        <p className="text-muted-foreground">
          Well-defined tasks can be <strong className="text-foreground">automatically assigned 
          to background agents</strong>. The agent works in isolation, running tests until they 
          pass or escalating when stuck.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Agent Input</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Issue description and acceptance criteria</li>
                <li>Relevant codebase context</li>
                <li>Test harness to validate against</li>
                <li>Style guide and project rules</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Agent Output</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Branch with implementation</li>
                <li>Test results (passing/failing)</li>
                <li>PR with description</li>
                <li>Summary of changes made</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Code to Review */}
        <h3 id="code-to-review" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Code to Review (AI + Human)
        </h3>

        <p className="text-muted-foreground">
          Every PR goes through <strong className="text-foreground">layered review</strong>: 
          automated checks, AI review, then human review. Each layer catches different issues.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">CI/CD Checks</h4>
              <p className="text-sm text-muted-foreground m-0">
                Tests, linting, type checking, security scans
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">AI Review</h4>
              <p className="text-sm text-muted-foreground m-0">
                Pattern violations, potential bugs, code quality
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Human Review</h4>
              <p className="text-sm text-muted-foreground m-0">
                Architecture, business logic, UX implications
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Review Gates">
          <p className="m-0">
            CI must pass before AI review. AI review must pass before human review. Each gate 
            filters out noise so the next reviewer focuses on higher-level concerns.
          </p>
        </Callout>

        {/* Review to Production */}
        <h3 id="review-to-production" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Review to Production (Staging Flow)
        </h3>

        <p className="text-muted-foreground">
          Approved changes flow through <strong className="text-foreground">staging before 
          production</strong>. This isn&apos;t just deployment—it&apos;s validation in a production-like 
          environment before real users see changes.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Deployment Pipeline</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>PR approved and merged to main</li>
              <li>CI builds and tests on main</li>
              <li>Auto-deploy to staging environment</li>
              <li>Staging validation (automated + manual smoke tests)</li>
              <li>Promote to production (manual trigger or scheduled)</li>
              <li>Production monitoring for regressions</li>
            </ol>
          </CardContent>
        </Card>

        {/* Building Your Own Stack */}
        <h3 id="building-your-stack" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building Your Own Stack
        </h3>

        <p className="text-muted-foreground">
          You don&apos;t need to adopt every tool at once. <strong className="text-foreground">Start 
          with one integration</strong>, prove value, then expand. The pipeline is modular—each 
          piece provides value independently.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Tool Categories</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Task Management:</strong> Linear, Jira, Notion, GitHub Issues</li>
              <li><strong className="text-foreground">AI IDE:</strong> Cursor, Windsurf, VS Code + Copilot</li>
              <li><strong className="text-foreground">Background Agents:</strong> Cursor Web, Devin, Copilot Workspace</li>
              <li><strong className="text-foreground">PR Management:</strong> Graphite, GitHub, GitLab</li>
              <li><strong className="text-foreground">CI/CD:</strong> GitHub Actions, CircleCI, Jenkins</li>
              <li><strong className="text-foreground">Monitoring:</strong> Datadog, Sentry, PagerDuty</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="important" title="Human in the Loop">
          <p className="m-0">
            The pipeline optimizes for <strong>automation with oversight</strong>. Every stage 
            has a human checkpoint. Full automation without review is risky; full manual work 
            doesn&apos;t scale. Find the balance that fits your risk tolerance.
          </p>
        </Callout>

        <Callout variant="tip" title="Start Small" className="mt-6">
          <p className="m-0">
            <strong>Week 1:</strong> Add AI code review to PRs • 
            <strong>Week 2:</strong> Set up project rules for your AI IDE • 
            <strong>Week 3:</strong> Try background agent on a small task • 
            <strong>Week 4:</strong> Connect task tracker to trigger agents
          </p>
        </Callout>
      </div>
    </section>
  );
}
