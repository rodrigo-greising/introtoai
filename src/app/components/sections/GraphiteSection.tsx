import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

export function GraphiteSection() {
  return (
    <section id="graphite-stacked-prs" className="scroll-mt-20">
      <SectionHeading
        id="graphite-stacked-prs-heading"
        title="Graphite and Stacked PRs"
        subtitle="Managing dependent changes and AI code review"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Stacked PRs break large changes into <strong className="text-foreground">smaller, reviewable 
          chunks</strong> that build on each other. Combined with AI code review, this pattern 
          dramatically accelerates the feedback loop from code to production.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Graphite is used as the primary example. The stacking pattern works with other tools: 
            <strong>GitHub Stacked PRs</strong>, <strong>Phabricator (Differential)</strong>, 
            <strong>Gerrit</strong>, <strong>GitLab merge request chains</strong>, <strong>ghstack</strong>.
          </p>
        </Callout>

        {/* What are Stacked PRs */}
        <h3 id="what-are-stacked-prs" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What are Stacked PRs
        </h3>

        <p className="text-muted-foreground">
          A stack is a series of PRs where each one <strong className="text-foreground">builds on 
          the previous</strong>. Instead of one massive PR with 50 files, you have 5 PRs with 10 
          files each, reviewed and merged in sequence.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Without Stacking</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>One PR with 2000 lines changed</li>
                <li>Reviewer overwhelmed, rubber-stamps</li>
                <li>Blocked until entire feature is ready</li>
                <li>Merge conflicts accumulate</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">With Stacking</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>5 PRs with ~400 lines each</li>
                <li>Each PR is focused and reviewable</li>
                <li>Earlier PRs can merge while later ones are WIP</li>
                <li>Continuous integration with main</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          language="bash"
          filename="stacking-workflow.sh"
          code={`# Create a stack with Graphite CLI
gt create -m "feat: add user model"      # PR 1
gt create -m "feat: add user API routes" # PR 2, stacked on PR 1
gt create -m "feat: add user UI"         # PR 3, stacked on PR 2

# View the stack
gt log

# Submit all PRs in the stack
gt submit --stack`}
        />

        {/* The Graphite Workflow */}
        <h3 id="graphite-workflow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Graphite Workflow
        </h3>

        <p className="text-muted-foreground">
          Graphite streamlines the stacking workflow with <strong className="text-foreground">CLI 
          tooling</strong> and a <strong className="text-foreground">web dashboard</strong>. It handles 
          the complex rebasing that stacking requires, so you focus on the code.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Typical Graphite Workflow</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>Work on feature, commit frequently</li>
              <li>Use <code>gt create</code> to start each logical unit as a stacked PR</li>
              <li>Push stack with <code>gt submit</code></li>
              <li>Reviewers review each PR in the stack</li>
              <li>CI runs on each PR individually</li>
              <li>When PR 1 is approved, merge it—Graphite rebases PR 2 automatically</li>
              <li>Continue until stack is fully merged</li>
            </ol>
          </CardContent>
        </Card>

        {/* AI-Powered Code Review */}
        <h3 id="ai-code-review" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          AI-Powered Code Review
        </h3>

        <p className="text-muted-foreground">
          AI code review provides <strong className="text-foreground">instant, automated feedback</strong> 
          on every PR. It catches common issues before human reviewers see the code, speeding up 
          the review cycle and letting humans focus on higher-level concerns.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">AI Catches</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Common bugs and anti-patterns</li>
                <li>Security vulnerabilities</li>
                <li>Style violations</li>
                <li>Missing error handling</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Human Reviews</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Architectural decisions</li>
                <li>Business logic correctness</li>
                <li>User experience impacts</li>
                <li>Long-term maintainability</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Combined Value</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Faster feedback loops</li>
                <li>Consistent quality bar</li>
                <li>Human time spent wisely</li>
                <li>Higher quality merges</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Cursor + Graphite">
          <p className="m-0">
            Cursor acquired Graphite, signaling deeper integration between AI coding and code 
            review. Expect tighter workflows: AI that writes code can also explain it in PR 
            descriptions and respond to review comments.
          </p>
        </Callout>

        {/* Managing Dependent Changes */}
        <h3 id="managing-dependent-changes" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Managing Dependent Changes
        </h3>

        <p className="text-muted-foreground">
          The trickiest part of stacking is <strong className="text-foreground">handling changes 
          that affect earlier PRs</strong>. When PR 1 needs changes, everything stacked on it 
          needs rebasing. Good tooling makes this manageable.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Upstack Updates</h4>
              <p className="text-sm text-muted-foreground m-0">
                Changes to PR 3 don&apos;t affect PR 1 or 2. Simple case—just update and push.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Downstack Updates</h4>
              <p className="text-sm text-muted-foreground m-0">
                Changes to PR 1 require rebasing PR 2 and 3. Graphite handles this automatically.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rebasing and Stack Maintenance */}
        <h3 id="stack-maintenance" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Rebasing and Stack Maintenance
        </h3>

        <p className="text-muted-foreground">
          Regular stack maintenance keeps your PRs mergeable. <strong className="text-foreground">Rebase 
          frequently</strong> to avoid large conflict resolution sessions later.
        </p>

        <CodeBlock
          language="bash"
          filename="stack-maintenance.sh"
          code={`# Sync your stack with main
gt sync

# Rebase entire stack on latest main
gt restack

# If conflicts occur, resolve them and continue
gt continue

# Force-push updated stack
gt submit --force`}
        />

        <Callout variant="warning" title="Conflict Resolution">
          <p className="m-0">
            When conflicts arise in stacked PRs, they cascade. Resolve conflicts in the 
            <strong> lowest affected PR first</strong>, then let the tool propagate fixes upward. 
            Trying to fix conflicts out of order creates a mess.
          </p>
        </Callout>

        <Callout variant="tip" title="Alternative Tools" className="mt-6">
          <p className="m-0">
            <strong>GitHub Stacked PRs:</strong> Native GitHub feature for PR chains • 
            <strong>Phabricator:</strong> Meta&apos;s code review with stacking (Differential) • 
            <strong>Gerrit:</strong> Google&apos;s review system with change chains • 
            <strong>ghstack:</strong> CLI for GitHub stacking
          </p>
        </Callout>
      </div>
    </section>
  );
}
