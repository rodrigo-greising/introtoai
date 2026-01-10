"use client";

import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { 
  Code2, 
  Bot,
  FileText,
  Terminal,
  GitBranch,
  Zap,
} from "lucide-react";

export function CodingAgentsIntroSection() {
  return (
    <section id="coding-agents-intro" className="scroll-mt-20">
      <SectionHeading
        id="coding-agents-intro-heading"
        title="What Are Coding Agents?"
        subtitle="AI assistants that understand and modify code"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Coding agents</strong> are AI systems specialized for 
          software development. Unlike general-purpose assistants, they have deep integration with 
          your development environment—reading files, running commands, understanding project context, 
          and making changes across your codebase.
        </p>

        <Callout variant="info" title="Beyond Chat">
          <p className="m-0">
            A chat-based LLM can <em>talk about</em> code. A coding agent can <strong>work with</strong> your 
            code—reading your project structure, understanding dependencies, running tests, and 
            iterating until tasks are complete.
          </p>
        </Callout>

        {/* What Makes Coding Agents Different */}
        <h3 id="what-makes-different" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What Makes Coding Agents Different
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Codebase Awareness</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Can read and search your entire project. Understands file structure, 
                    imports, and how components connect.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Terminal className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Command Execution</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Can run terminal commands, execute tests, and verify changes work 
                    before presenting them to you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Multi-File Edits</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Makes coordinated changes across multiple files. Refactoring, 
                    feature implementation, and bug fixes span boundaries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Iterative Problem Solving</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Runs tests, sees errors, fixes them, and repeats. Works in loops 
                    until the task is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The Coding Agent Loop */}
        <h3 id="agent-loop" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          The Coding Agent Loop
        </h3>

        <p className="text-muted-foreground">
          Coding agents apply the agentic loop specifically to development tasks. They observe 
          your codebase, think about the approach, take action (edit/run), and iterate until 
          the task passes verification.
        </p>

        <div className="my-6 p-6 rounded-xl bg-card border border-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">1</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Read Context</span>
                <span className="text-muted-foreground text-sm ml-2">→ Explore codebase, understand structure</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">2</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Plan Changes</span>
                <span className="text-muted-foreground text-sm ml-2">→ Determine what files to modify</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">3</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Make Edits</span>
                <span className="text-muted-foreground text-sm ml-2">→ Write code, create files</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">4</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Verify</span>
                <span className="text-muted-foreground text-sm ml-2">→ Run tests, check linter, confirm behavior</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-medium shrink-0">5</div>
              <div className="flex-1 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="font-medium text-amber-400">Iterate if Needed</span>
                <span className="text-muted-foreground text-sm ml-2">→ Fix errors and repeat until success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Examples of Coding Agents */}
        <h3 id="examples" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Examples of Coding Agents
        </h3>

        <div className="grid gap-4">
          <Card variant="highlight">
            <CardContent>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[var(--highlight)] mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Cursor</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    IDE with integrated AI. Agent mode can read files, run commands, and 
                    iterate on code. Deep integration with the editor experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-violet-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Claude Code</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    CLI-based coding agent from Anthropic. Works in your terminal with 
                    access to files and commands. Skills-based architecture.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">GitHub Copilot Workspace</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Integrated with GitHub. Can plan changes, implement across files, 
                    and create pull requests directly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Devin, SWE-Agent, OpenHands</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Autonomous or semi-autonomous agents that work on issues end-to-end. 
                    Often run in sandboxed environments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* When to Use Coding Agents */}
        <h3 id="when-to-use" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Use Coding Agents
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Great For</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Implementing well-specified features</li>
                <li>Refactoring with clear patterns</li>
                <li>Fixing bugs with reproducible steps</li>
                <li>Boilerplate and routine code</li>
                <li>Learning new codebases quickly</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">✗ Challenging For</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Vague or exploratory requirements</li>
                <li>Complex architectural decisions</li>
                <li>Highly creative or novel problems</li>
                <li>Tasks requiring deep domain expertise</li>
                <li>Security-critical implementations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Collaboration, Not Replacement">
          <p className="m-0">
            The most effective use of coding agents is as a <strong>skilled collaborator</strong>, not 
            an autonomous replacement. You provide direction, context, and judgment. The agent provides 
            speed, breadth, and tireless iteration.
          </p>
        </Callout>

        <Callout variant="info" title="Next: Cursor Architecture" className="mt-8">
          <p className="m-0">
            The following sections dive deep into <strong>Cursor</strong>—how it works, how to 
            configure it effectively, and patterns for getting the most out of AI-assisted development.
          </p>
        </Callout>
      </div>
    </section>
  );
}
