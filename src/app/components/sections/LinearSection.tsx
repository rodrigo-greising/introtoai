import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

export function LinearSection() {
  return (
    <section id="linear-task-management" className="scroll-mt-20">
      <SectionHeading
        id="linear-task-management-heading"
        title="Linear and Task Management"
        subtitle="From customer feedback to automated task execution"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Task management is the <strong className="text-foreground">bridge between intent and 
          execution</strong>. When integrated with AI workflows, your issue tracker becomes the 
          source of truth that drives automated development—from customer feedback to deployed code.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Linear is used as the primary example. These patterns apply to other tools: 
            <strong>Jira</strong>, <strong>Notion</strong>, <strong>Asana</strong>, 
            <strong>GitHub Issues/Projects</strong>, <strong>Shortcut</strong>, 
            <strong>Height</strong>, <strong>Plane</strong>.
          </p>
        </Callout>

        {/* Linear as the Source of Truth */}
        <h3 id="linear-source-of-truth" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Linear as the Source of Truth
        </h3>

        <p className="text-muted-foreground">
          In an agentic workflow, the issue tracker is <strong className="text-foreground">where 
          work is defined and tracked</strong>. Every task, bug, and feature has a canonical 
          representation that both humans and AI systems reference.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">What Lives in Linear</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Task definitions and acceptance criteria</li>
                <li>Priority and status tracking</li>
                <li>Links to PRs and deployments</li>
                <li>Discussion and decisions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Why Single Source Matters</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>AI knows where to find task context</li>
                <li>Humans and AI see same state</li>
                <li>Automation has reliable triggers</li>
                <li>Progress is visible and auditable</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* From Customer Feedback to Tasks */}
        <h3 id="feedback-to-tasks" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          From Customer Feedback to Tasks
        </h3>

        <p className="text-muted-foreground">
          The journey from &quot;customer says X&quot; to &quot;code is deployed&quot; can be <strong className="text-foreground">partially 
          automated</strong>. AI helps translate feedback into structured tasks, but humans validate 
          that the translation is correct.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Feedback to Task Pipeline</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li><strong className="text-foreground">Capture:</strong> Customer feedback arrives (support ticket, interview, survey)</li>
              <li><strong className="text-foreground">Triage:</strong> AI categorizes and suggests priority</li>
              <li><strong className="text-foreground">Draft:</strong> AI creates draft issue with proposed scope</li>
              <li><strong className="text-foreground">Refine:</strong> PM reviews, adjusts, adds acceptance criteria</li>
              <li><strong className="text-foreground">Commit:</strong> Issue enters backlog with clear definition</li>
            </ol>
          </CardContent>
        </Card>

        <Callout variant="tip" title="AI for PM Work">
          <p className="m-0">
            AI can help PMs process meeting transcripts, synthesize user research, and draft 
            PRDs. The key is <strong>human review</strong> of AI-generated artifacts—AI accelerates, 
            humans validate.
          </p>
        </Callout>

        {/* AI-Assisted PM Workflows */}
        <h3 id="ai-pm-workflows" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          AI-Assisted PM Workflows
        </h3>

        <p className="text-muted-foreground">
          Product managers can use AI to <strong className="text-foreground">accelerate the 
          definition work</strong>—turning rough ideas into structured specs faster, while 
          maintaining ownership of the actual decisions.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Research Synthesis</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI summarizes user interviews, identifies patterns, highlights key quotes
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Spec Drafting</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI generates first draft of PRD from rough notes and discussions
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Task Breakdown</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI suggests how to decompose feature into implementable tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Issue-to-PR Automation */}
        <h3 id="issue-to-pr" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Issue-to-PR Automation
        </h3>

        <p className="text-muted-foreground">
          The holy grail: <strong className="text-foreground">issues that automatically become 
          PRs</strong>. With sufficiently well-defined tasks and capable AI agents, this becomes 
          possible for certain classes of work.
        </p>

        <CodeBlock
          language="typescript"
          filename="issue-to-pr.ts"
          code={`// Webhook triggered when issue is marked "Ready for AI"
async function handleReadyIssue(issue: LinearIssue) {
  // Extract task definition
  const spec = parseIssueToSpec(issue);
  
  // Validate spec has required fields
  if (!spec.acceptanceCriteria || !spec.scope) {
    await issue.addComment("⚠️ Missing acceptance criteria or scope");
    return;
  }
  
  // Submit to background agent
  const job = await backgroundAgent.submit({
    task: spec,
    repo: issue.project.repo,
    branch: \`ai/\${issue.identifier}\`,
  });
  
  // Link job to issue
  await issue.update({ 
    status: "In Progress",
    metadata: { agentJobId: job.id }
  });
}`}
        />

        <Callout variant="warning" title="Scope Appropriately">
          <p className="m-0">
            Not every issue should be auto-implemented. Start with <strong>well-scoped, 
            low-risk tasks</strong>: bug fixes with clear repro steps, small features with 
            explicit specs. Build trust before expanding scope.
          </p>
        </Callout>

        {/* Cycles, Projects, and Roadmaps */}
        <h3 id="cycles-projects" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Cycles, Projects, and Roadmaps
        </h3>

        <p className="text-muted-foreground">
          Task management isn&apos;t just individual issues—it&apos;s <strong className="text-foreground">organizing 
          work over time</strong>. Cycles (sprints), projects, and roadmaps provide the structure 
          that makes planning possible.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Cycles</h4>
              <p className="text-sm text-muted-foreground m-0">
                Time-boxed periods (1-2 weeks) with committed work. AI can help estimate and 
                flag over-commitment.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Projects</h4>
              <p className="text-sm text-muted-foreground m-0">
                Groups of related issues toward a goal. AI can track progress and surface blockers.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">AI-Enhanced Planning</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Estimation:</strong> AI suggests story points based on similar past issues</li>
              <li><strong className="text-foreground">Dependency detection:</strong> AI identifies issues that should be sequenced</li>
              <li><strong className="text-foreground">Risk flagging:</strong> AI highlights issues without clear acceptance criteria</li>
              <li><strong className="text-foreground">Progress tracking:</strong> AI summarizes cycle/project status from issue data</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Alternative Tools" className="mt-6">
          <p className="m-0">
            <strong>Jira:</strong> Enterprise-grade with extensive integrations • 
            <strong>Notion:</strong> Flexible, database-driven task tracking • 
            <strong>GitHub Projects:</strong> Native integration with repos • 
            <strong>Shortcut:</strong> Linear-like UX for larger teams
          </p>
        </Callout>
      </div>
    </section>
  );
}
