"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { 
  FileText, 
  FolderTree, 
  Globe,
  Check,
  X,
  Pencil,
} from "lucide-react";

// Interactive Rules Editor Preview
function RulesEditorPreview() {
  const [activeRule, setActiveRule] = useState<string>("development");
  const [showPreview, setShowPreview] = useState(true);

  const rules = [
    {
      id: "development",
      name: "development.mdc",
      globs: ["src/**/*.ts", "src/**/*.tsx"],
      alwaysApply: false,
      content: `---
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
- Components must have prop type definitions`,
    },
    {
      id: "api",
      name: "api-patterns.mdc",
      globs: ["src/api/**/*.ts", "src/lib/api/**/*.ts"],
      alwaysApply: false,
      content: `---
description: API design patterns and conventions
globs: ["src/api/**/*.ts", "src/lib/api/**/*.ts"]
alwaysApply: false
---

# API Patterns

## Route Structure
- Use Next.js App Router conventions
- Separate route handlers by HTTP method
- Always validate request bodies with Zod

## Error Handling
- Return consistent error shapes
- Include request ID in errors
- Log errors with context

## Security
- Validate auth on every request
- Sanitize user input
- Rate limit by IP and user`,
    },
    {
      id: "testing",
      name: "testing.mdc",
      globs: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
      alwaysApply: false,
      content: `---
description: Testing conventions and requirements
globs: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
alwaysApply: false
---

# Testing Guidelines

## Test Structure
- Use describe/it blocks
- Group by behavior, not implementation
- One assertion per test (ideally)

## Mocking
- Mock at the boundary (API calls, DB)
- Never mock the unit under test
- Use dependency injection where possible

## Coverage
- Aim for 80% on critical paths
- Don't chase 100% blindly
- Focus on behavior, not lines`,
    },
    {
      id: "always",
      name: "always-applied.mdc",
      globs: [],
      alwaysApply: true,
      content: `---
description: Core rules that apply to all interactions
globs: []
alwaysApply: true
---

# Core Principles

## Communication
- Be concise and direct
- Explain reasoning for non-obvious choices
- Ask clarifying questions when ambiguous

## Safety
- Never delete files without confirmation
- Always run tests before committing
- Review all diffs carefully

## This Project
- This is a Next.js 15 app with Tailwind CSS
- We use pnpm as our package manager
- All components are in src/app/components`,
    },
  ];

  const activeRuleData = rules.find(r => r.id === activeRule)!;

  // Simulated files that would match the globs
  const matchingFiles: Record<string, string[]> = {
    development: ["src/app/page.tsx", "src/components/Button.tsx", "src/lib/utils.ts"],
    api: ["src/api/users/route.ts", "src/lib/api/client.ts"],
    testing: ["src/components/Button.test.tsx", "src/lib/utils.spec.ts"],
    always: ["(All files - always applied)"],
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Rules Editor Preview</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`text-xs px-2 py-1 rounded ${showPreview ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}`}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[200px,1fr]">
        {/* File tree */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <FolderTree className="w-4 h-4" />
            <span>.cursor/rules/</span>
          </div>
          <div className="space-y-1">
            {rules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRule(rule.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 transition-colors ${
                  activeRule === rule.id 
                    ? 'bg-[var(--highlight)]/20 text-[var(--highlight)]' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <FileText className="w-3 h-3" />
                {rule.name}
                {rule.alwaysApply && (
                  <span className="ml-auto" title="Always Applied">
                    <Globe className="w-3 h-3 text-amber-400" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="space-y-4">
          {/* Rule metadata */}
          <div className="flex flex-wrap gap-3 p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">alwaysApply:</span>
              {activeRuleData.alwaysApply ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="w-3 h-3" /> true
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <X className="w-3 h-3" /> false
                </span>
              )}
            </div>
            {!activeRuleData.alwaysApply && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">globs:</span>
                <span className="text-xs text-cyan-400 font-mono">
                  {activeRuleData.globs.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Rule content */}
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-muted/50 px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{activeRuleData.name}</span>
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </div>
            <pre className="p-4 text-xs overflow-x-auto bg-muted/20 max-h-[300px] overflow-y-auto">
              <code className="text-muted-foreground">{activeRuleData.content}</code>
            </pre>
          </div>

          {/* Matching files preview */}
          {showPreview && (
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-cyan-400">Files that match:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingFiles[activeRule].map((file, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CursorRulesSection() {
  return (
    <section id="cursor-rules" className="scroll-mt-20">
      <SectionHeading
        id="cursor-rules-heading"
        title="Rules and Context Management"
        subtitle="Customizing AI behavior per-project"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Rules let you <strong className="text-foreground">customize AI behavior per-project</strong>. 
          They&apos;re injected into the system prompt, ensuring consistent responses aligned with your 
          codebase patterns, conventions, and constraints.
        </p>

        {/* Understanding Rules */}
        <h3 id="rules-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Understanding Rules
        </h3>

        <p className="text-muted-foreground">
          Rules are markdown files (with <code>.mdc</code> extension) stored in <code>.cursor/rules/</code>. 
          Each rule has frontmatter metadata that controls when it&apos;s applied:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Glob-Matched Rules</h4>
              <p className="text-sm text-muted-foreground m-0">
                Applied when you&apos;re working with files matching the glob patterns. Use for 
                language-specific or feature-specific guidelines.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Always-Applied Rules</h4>
              <p className="text-sm text-muted-foreground m-0">
                Applied to every interaction regardless of file context. Use for project-wide 
                conventions and core guidelines.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Editor */}
        <h3 id="rule-types" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Rule Types
        </h3>

        <p className="text-muted-foreground">
          Explore different rule configurations. Notice how glob patterns scope rules to specific 
          file types, keeping context focused and relevant.
        </p>

        <RulesEditorPreview />

        {/* Best Practices */}
        <h3 id="rules-best-practices" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Best Practices
        </h3>

        <div className="grid gap-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Organize by Domain</h4>
              <p className="text-sm text-muted-foreground m-0">
                Create separate rule files for frontend, backend, testing, and infrastructure. 
                This prevents irrelevant rules from consuming context tokens.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Include Examples</h4>
              <p className="text-sm text-muted-foreground m-0">
                Instead of just describing patterns, show them. Include code snippets that 
                demonstrate the exact style you want. Examples are more effective than descriptions.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Be Specific About Constraints</h4>
              <p className="text-sm text-muted-foreground m-0">
                &quot;Use TypeScript&quot; is too vague. &quot;No any types without explicit comment explaining 
                why&quot; is actionable. Specific constraints produce better results.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Keep Rules Focused</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each rule file should cover one domain. Long, sprawling rules are hard to 
                maintain and may not all be relevant to the current task.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Example Rule Structure */}
        <h3 id="rules-editor" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Example Rule Structure
        </h3>

        <CodeBlock
          language="markdown"
          filename=".cursor/rules/react-patterns.mdc"
          code={`---
description: React component conventions
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
alwaysApply: false
---

# React Component Patterns

## Component Structure
Every component should follow this structure:

\`\`\`tsx
// 1. Imports (grouped: react, external, internal, types)
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import type { User } from "@/types";

// 2. Types
interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component (named export)
export function UserCard({ user, onUpdate }: Props) {
  // hooks first
  const [editing, setEditing] = useState(false);
  
  // handlers
  const handleSave = () => {
    onUpdate(user);
    setEditing(false);
  };

  // render
  return (
    <div>...</div>
  );
}
\`\`\`

## Naming
- Components: PascalCase
- Hooks: useXxx
- Handlers: handleXxx

## Prohibited
- No default exports
- No inline styles (use Tailwind)
- No useEffect for data fetching (use React Query)`}
        />

        <Callout variant="tip" title="Version Control Your Rules">
          <p className="m-0">
            Commit <code>.cursor/rules/</code> to your repository. This ensures all team members 
            get the same AI behavior and your rules evolve with your codebase.
          </p>
        </Callout>

        <Callout variant="warning" title="Context Budget">
          <p className="m-0">
            Rules consume context tokens. Very long rules can push out actual code context. 
            Monitor your context usage and keep rules concise. The best rules are under 
            500 words—enough to guide, not overwhelm.
          </p>
        </Callout>
      </div>
    </section>
  );
}
