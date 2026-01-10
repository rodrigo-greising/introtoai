"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import {
  GitBranch,
  GitMerge,
  CheckCircle,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Interactive Stack Visualizer
function StackVisualizer() {
  const [hoveredPR, setHoveredPR] = useState<number | null>(null);
  const [mergedPRs, setMergedPRs] = useState<number[]>([]);

  const stack = [
    {
      number: 1,
      title: "feat: add user model and migrations",
      files: 4,
      additions: 156,
      status: "approved",
      reviews: 2,
      description: "Database schema and TypeScript types for User entity",
    },
    {
      number: 2,
      title: "feat: add user API routes",
      files: 6,
      additions: 234,
      status: "changes",
      reviews: 1,
      description: "REST endpoints for CRUD operations on users",
    },
    {
      number: 3,
      title: "feat: add user service layer",
      files: 3,
      additions: 189,
      status: "pending",
      reviews: 0,
      description: "Business logic and validation for user operations",
    },
    {
      number: 4,
      title: "feat: add user UI components",
      files: 8,
      additions: 412,
      status: "draft",
      reviews: 0,
      description: "React components for user management interface",
    },
  ];

  const statusColors = {
    approved: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", label: "Approved" },
    changes: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", label: "Changes Requested" },
    pending: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", label: "Pending Review" },
    draft: { bg: "bg-muted", border: "border-border", text: "text-muted-foreground", label: "Draft" },
    merged: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", label: "Merged" },
  };

  const handleMerge = (prNumber: number) => {
    // Can only merge if all previous PRs are merged
    const canMerge = stack
      .filter(pr => pr.number < prNumber)
      .every(pr => mergedPRs.includes(pr.number));
    
    if (canMerge) {
      setMergedPRs([...mergedPRs, prNumber]);
    }
  };

  const handleReset = () => {
    setMergedPRs([]);
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">PR Stack Visualizer</h4>
        {mergedPRs.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Main branch line */}
      <div className="relative pl-8">
        {/* Vertical line connecting PRs */}
        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-muted-foreground" />

        <div className="space-y-3">
          {/* Main branch indicator */}
          <div className="flex items-center gap-3 -ml-8 mb-4">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <GitBranch className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-400">main</span>
          </div>

          {stack.map((pr) => {
            const isMerged = mergedPRs.includes(pr.number);
            const status = isMerged ? "merged" : pr.status;
            const colors = statusColors[status as keyof typeof statusColors];
            const isHovered = hoveredPR === pr.number;
            const canMerge = status === "approved" || (isMerged === false && 
              stack.filter(p => p.number < pr.number).every(p => mergedPRs.includes(p.number)) && 
              pr.status === "approved");

            return (
              <div
                key={pr.number}
                className="relative"
                onMouseEnter={() => setHoveredPR(pr.number)}
                onMouseLeave={() => setHoveredPR(null)}
              >
                {/* Branch point */}
                <div className={`absolute -left-5 top-4 w-4 h-0.5 ${colors.bg}`} />
                <div className={`absolute -left-6 top-3 w-3 h-3 rounded-full border-2 ${colors.border} ${colors.bg}`} />

                <div className={`
                  p-4 rounded-lg border transition-all
                  ${colors.bg} ${colors.border}
                  ${isHovered ? "scale-[1.02]" : ""}
                `}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-mono ${colors.text}`}>#{pr.number}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                          {colors.label}
                        </span>
                      </div>
                      <h5 className="text-sm font-medium text-foreground truncate">{pr.title}</h5>
                      {isHovered && (
                        <p className="text-xs text-muted-foreground mt-1">{pr.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{pr.files} files</span>
                        <span className="text-emerald-400">+{pr.additions}</span>
                      </div>
                      {pr.reviews > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          {pr.reviews}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Merge button for approved PRs */}
                  {canMerge && !isMerged && (
                    <button
                      onClick={() => handleMerge(pr.number)}
                      className="mt-2 flex items-center gap-1 px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      <GitMerge className="w-3 h-3" />
                      Merge PR #{pr.number}
                    </button>
                  )}

                  {isMerged && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-violet-400">
                      <CheckCircle className="w-3 h-3" />
                      Merged into main
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border text-center">
        <p className="text-xs text-muted-foreground m-0">
          {mergedPRs.length === 0 ? (
            "Hover over PRs to see details. Merge approved PRs from bottom to top."
          ) : mergedPRs.length === stack.length ? (
            "🎉 Full stack merged! All changes are now in main."
          ) : (
            `${mergedPRs.length}/${stack.length} PRs merged. Continue merging approved PRs.`
          )}
        </p>
      </div>
    </div>
  );
}

export function GraphiteSection() {
  return (
    <section id="graphite" className="scroll-mt-20">
      <SectionHeading
        id="graphite-heading"
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
        <h3 id="stacked-prs" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
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

        {/* Interactive Stack Visualizer */}
        <h3 id="stack-viz" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Stack Visualizer
        </h3>

        <p className="text-muted-foreground">
          Explore how a PR stack works. Each PR builds on the previous one and merges sequentially:
        </p>

        <StackVisualizer />

        {/* The Graphite Workflow */}
        <h3 id="graphite-workflow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Graphite Workflow
        </h3>

        <p className="text-muted-foreground">
          Graphite streamlines the stacking workflow with <strong className="text-foreground">CLI 
          tooling</strong> and a <strong className="text-foreground">web dashboard</strong>. It handles 
          the complex rebasing that stacking requires, so you focus on the code.
        </p>

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
        <h3 id="ai-review" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
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
        <h3 id="managing-changes" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Managing Dependent Changes
        </h3>

        <p className="text-muted-foreground">
          The trickiest part of stacking is <strong className="text-foreground">handling changes 
          that affect earlier PRs</strong>. When PR 1 needs changes, everything stacked on it 
          needs rebasing.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground m-0">Upstack Updates</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Changes to PR 3 don&apos;t affect PR 1 or 2. Simple case—just update and push.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground m-0">Downstack Updates</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Changes to PR 1 require rebasing PR 2 and 3. Graphite handles this automatically.
              </p>
            </CardContent>
          </Card>
        </div>

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
