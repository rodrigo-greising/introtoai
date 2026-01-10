import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";

export function BackgroundAgentsSection() {
  return (
    <section id="background-agents" className="scroll-mt-20">
      <SectionHeading
        id="background-agents-heading"
        title="Background Agents"
        subtitle="Autonomous coding agents running in the cloud"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Background agents execute coding tasks <strong className="text-foreground">autonomously 
          in cloud environments</strong>. You define the task, submit it, and review results when 
          complete—freeing you to work on other things while AI handles implementation.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Cursor&apos;s background agent is the primary example. Alternatives include: 
            <strong>OpenAI Codex</strong>, <strong>Claude with computer use</strong>, 
            <strong>Devin</strong>, <strong>GitHub Copilot Workspace</strong>, 
            <strong>Replit Agent</strong>, <strong>Codeium Windsurf</strong>.
          </p>
        </Callout>

        {/* What are Background Coding Agents */}
        <h3 id="what-are-background-agents" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What are Background Coding Agents
        </h3>

        <p className="text-muted-foreground">
          A background agent is an AI system that <strong className="text-foreground">works 
          independently</strong> on a coding task. Unlike interactive chat where you guide each 
          step, background agents take a task and execute it end-to-end.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Interactive Mode</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Human guides each step</li>
                <li>Immediate feedback loop</li>
                <li>Human sees work in progress</li>
                <li>Good for exploration</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Background Mode</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Agent works autonomously</li>
                <li>Async—review when ready</li>
                <li>Human sees final result</li>
                <li>Good for defined tasks</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Cursor Background Agent */}
        <h3 id="cursor-background" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Cursor Background Agent (Web Version)
        </h3>

        <p className="text-muted-foreground">
          Cursor&apos;s web-based background agent runs in <strong className="text-foreground">isolated 
          cloud environments</strong>. Tasks are queued, executed with full access to tools (terminal, 
          file system, tests), and results are presented for review.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Background Agent Capabilities</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li>Clone and work on repository branches</li>
              <li>Run tests and iterate on failures</li>
              <li>Execute terminal commands</li>
              <li>Make multi-file changes</li>
              <li>Create commits with meaningful messages</li>
              <li>Surface results for human review</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sandboxing and Security */}
        <h3 id="agent-sandboxing" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Sandboxing and Security
        </h3>

        <p className="text-muted-foreground">
          Background agents need <strong className="text-foreground">isolation</strong> to prevent 
          unintended effects. Sandboxing limits what agents can access and do, providing safety 
          boundaries for autonomous execution.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">File System</h4>
              <p className="text-sm text-muted-foreground m-0">
                Limited to project directory. No access to system files or other projects.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Network</h4>
              <p className="text-sm text-muted-foreground m-0">
                Restricted to necessary endpoints. No arbitrary external connections.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Credentials</h4>
              <p className="text-sm text-muted-foreground m-0">
                Minimal secrets exposure. Production credentials never accessible.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Trust but Verify">
          <p className="m-0">
            Even sandboxed agents can make mistakes within their allowed scope. <strong>Always 
            review agent output</strong> before merging. The sandbox prevents catastrophic failures; 
            human review prevents subtle bugs.
          </p>
        </Callout>

        {/* Agent Capabilities and Limitations */}
        <h3 id="agent-capabilities" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Agent Capabilities and Limitations
        </h3>

        <p className="text-muted-foreground">
          Understanding what agents can and can&apos;t do helps you <strong className="text-foreground">scope 
          tasks appropriately</strong>. Overly ambitious tasks lead to poor results; well-scoped 
          tasks enable success.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Agents Excel At</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Implementing well-specified features</li>
                <li>Fixing bugs with clear repro steps</li>
                <li>Adding tests for existing code</li>
                <li>Refactoring with defined patterns</li>
                <li>Updating code to new API versions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Agents Struggle With</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Vague or ambiguous requirements</li>
                <li>Novel architectural decisions</li>
                <li>Cross-cutting concerns</li>
                <li>Tasks requiring human judgment</li>
                <li>Large-scale refactoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* When to Use Background vs Interactive */}
        <h3 id="background-vs-interactive" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          When to Use Background vs Interactive
        </h3>

        <p className="text-muted-foreground">
          Neither mode is universally better—each fits different situations. The choice depends 
          on <strong className="text-foreground">task clarity</strong>, <strong className="text-foreground">risk 
          level</strong>, and <strong className="text-foreground">your availability</strong>.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Decision Guide</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Background:</strong> Clear spec, good test coverage, low risk, you&apos;re busy</li>
              <li><strong className="text-foreground">Interactive:</strong> Exploration, high risk, complex decisions, learning</li>
              <li><strong className="text-foreground">Hybrid:</strong> Start interactive to define approach, then background for implementation</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Alternative Agents">
          <p className="m-0">
            <strong>Devin:</strong> Full autonomous software engineer • 
            <strong>GitHub Copilot Workspace:</strong> Issue-to-PR automation • 
            <strong>Replit Agent:</strong> Full-stack app generation • 
            <strong>Claude computer use:</strong> General-purpose autonomous agent
          </p>
        </Callout>
      </div>
    </section>
  );
}
