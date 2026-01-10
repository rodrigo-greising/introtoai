import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

export function CursorIDESection() {
  return (
    <section id="cursor-ide" className="scroll-mt-20">
      <SectionHeading
        id="cursor-ide-heading"
        title="Cursor IDE"
        subtitle="AI-native IDE features, rules, and workflows"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Cursor represents the <strong className="text-foreground">AI-native IDE paradigm</strong>—an 
          editor built from the ground up around AI assistance. Understanding its architecture helps 
          you use it effectively and transfer those patterns to similar tools.
        </p>

        <Callout variant="info" title="Example Tool Notice">
          <p className="m-0">
            Cursor is used as the primary example in this section. The patterns apply to other 
            AI-native IDEs: <strong>Windsurf</strong>, <strong>Zed + AI</strong>, <strong>VS Code + Copilot</strong>, 
            <strong>JetBrains AI Assistant</strong>, <strong>AWS Kiro</strong>, <strong>Google Antigravity</strong>.
          </p>
        </Callout>

        {/* Cursor Architecture and Features */}
        <h3 id="cursor-architecture" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Cursor Architecture and Features
        </h3>

        <p className="text-muted-foreground">
          Cursor is a VS Code fork with deep AI integration. It maintains <strong className="text-foreground">codebase 
          indexing</strong> for context retrieval, supports <strong className="text-foreground">multiple 
          interaction modes</strong>, and enables <strong className="text-foreground">project-level 
          customization</strong> via rules.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Core Features</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Codebase indexing and semantic search</li>
                <li>Tab completion with context</li>
                <li>Inline edits (Cmd+K)</li>
                <li>Chat with codebase awareness</li>
                <li>Composer for multi-file changes</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Integration Points</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Terminal output as context</li>
                <li>Git integration for diffs</li>
                <li>Documentation fetching (@docs)</li>
                <li>Web search integration (@web)</li>
                <li>Image/screenshot input</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Rules and Context Management */}
        <h3 id="cursor-rules" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Rules and Context Management
        </h3>

        <p className="text-muted-foreground">
          Rules let you <strong className="text-foreground">customize AI behavior per-project</strong>. 
          They&apos;re injected into the system prompt, ensuring consistent responses aligned with your 
          codebase patterns, conventions, and constraints.
        </p>

        <CodeBlock
          language="markdown"
          filename=".cursor/rules/development.mdc"
          code={`---
description: Development guidelines for this project
globs: ["src/**/*.ts", "src/**/*.tsx"]
alwaysApply: false
---

# Development Guidelines

## Code Style
- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript strict mode

## Patterns
- State management: Zustand for global, useState for local
- Data fetching: React Query with typed responses
- Styling: Tailwind CSS with design tokens

## Constraints
- No \`any\` types without explicit comment
- All API calls must have error handling
- Components must have prop type definitions`}
        />

        <Callout variant="tip" title="Rules Organization">
          <p className="m-0">
            Use <code>.cursor/rules/</code> directory with multiple rule files. Scope rules with 
            globs—frontend rules for React files, backend rules for API routes. This keeps context 
            focused and relevant.
          </p>
        </Callout>

        {/* Composer vs Chat vs Agent Mode */}
        <h3 id="cursor-modes" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Composer vs Chat vs Agent Mode
        </h3>

        <p className="text-muted-foreground">
          Cursor offers multiple interaction modes, each suited for different tasks. Choosing the 
          right mode <strong className="text-foreground">dramatically affects output quality</strong>.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Chat</h4>
              <p className="text-sm text-muted-foreground m-0">
                Questions, explanations, debugging discussion. Doesn&apos;t directly modify files.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Composer</h4>
              <p className="text-sm text-muted-foreground m-0">
                Multi-file edits in one go. Best for coordinated changes across files.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Agent</h4>
              <p className="text-sm text-muted-foreground m-0">
                Autonomous execution. Can run commands, iterate on feedback, chain actions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Background Agent (Web Version) */}
        <h3 id="cursor-background-agent" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Background Agent (Web Version)
        </h3>

        <p className="text-muted-foreground">
          Cursor&apos;s background agent runs in the cloud, enabling <strong className="text-foreground">autonomous 
          task execution</strong> while you work on other things. Tasks are queued, executed, and 
          results are available for review when complete.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Background Agent Workflow</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>Define task with clear acceptance criteria</li>
              <li>Submit to background agent queue</li>
              <li>Agent works in isolated cloud environment</li>
              <li>Agent can run tests, lint, iterate on failures</li>
              <li>Results are presented for review when complete</li>
              <li>Human approves, requests changes, or rejects</li>
            </ol>
          </CardContent>
        </Card>

        <Callout variant="warning" title="Task Scoping">
          <p className="m-0">
            Background agents work best with <strong>well-scoped tasks</strong>. &quot;Implement the 
            entire authentication system&quot; is too broad. &quot;Add password reset endpoint matching 
            this spec&quot; is appropriately scoped.
          </p>
        </Callout>

        {/* Voice and Multi-modal Workflows */}
        <h3 id="cursor-voice" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Voice and Multi-modal Workflows
        </h3>

        <p className="text-muted-foreground">
          Voice input enables <strong className="text-foreground">hands-free coding</strong>—speak 
          your intent, let AI translate to code. Combined with image input (screenshots, diagrams), 
          this creates multi-modal workflows that match how developers actually think.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Voice Use Cases</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Describing changes while hands are busy</li>
                <li>Rubber duck debugging out loud</li>
                <li>Quick notes and TODOs</li>
                <li>Accessibility workflows</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Image Use Cases</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Screenshot of desired UI to implement</li>
                <li>Error message screenshots</li>
                <li>Architecture diagrams for context</li>
                <li>Design mockups to code</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Effective Usage Patterns */}
        <h3 id="cursor-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Effective Usage Patterns
        </h3>

        <p className="text-muted-foreground">
          Getting the most from Cursor (or any AI IDE) requires adapting your workflow. The best 
          results come from <strong className="text-foreground">working with the tool&apos;s strengths</strong>, 
          not fighting against its limitations.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">High-Impact Patterns</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">@-mention files:</strong> Explicitly include relevant files in context</li>
              <li><strong className="text-foreground">Break big tasks:</strong> Multiple small prompts beat one huge prompt</li>
              <li><strong className="text-foreground">Show examples:</strong> Include examples of desired patterns in rules</li>
              <li><strong className="text-foreground">Use tests as specs:</strong> Let test files guide implementation</li>
              <li><strong className="text-foreground">Review diffs carefully:</strong> AI makes plausible-looking mistakes</li>
              <li><strong className="text-foreground">Iterate on feedback:</strong> Don&apos;t accept first output blindly</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Alternative Tools">
          <p className="m-0">
            <strong>Windsurf:</strong> Similar AI-native IDE with different UX choices • 
            <strong>Zed:</strong> Performance-focused editor with AI features • 
            <strong>VS Code + Copilot:</strong> Familiar environment with AI add-on • 
            <strong>JetBrains AI:</strong> IDE-integrated AI for JetBrains users
          </p>
        </Callout>
      </div>
    </section>
  );
}
