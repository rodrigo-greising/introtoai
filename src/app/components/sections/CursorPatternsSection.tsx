"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { 
  BookOpen,
  Layers,
  RefreshCw,
  FileText,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveWrapper } from "@/app/components/visualizations/core";

// Interactive Prompt Quality Demo
function PromptQualityDemo() {
  const [selectedPrompt, setSelectedPrompt] = useState<"poor" | "good">("poor");

  const prompts = {
    poor: {
      title: "Polluted Chat",
      likelihood: 35,
      messages: [
        { role: "user", content: "Fix the bug" },
        { role: "assistant", content: "I'd be happy to help fix the bug. Could you tell me more about what's happening?" },
        { role: "user", content: "In the login" },
        { role: "assistant", content: "I see you're having an issue with the login. Can you share the error message or describe the unexpected behavior?" },
        { role: "user", content: "It's not working" },
        { role: "assistant", content: "I understand. To help fix the login issue, I'd need to see:\n1. The relevant code files\n2. The error message\n3. What you expect vs what happens\n\nCould you share these?" },
        { role: "user", content: "Just fix it please" },
      ],
      issues: [
        "No specific context provided",
        "No @-mentions of relevant files",
        "Ambiguous problem description",
        "Multiple back-and-forth messages wasting tokens",
        "AI forced to guess about the issue",
      ],
    },
    good: {
      title: "Perfect Prompt",
      likelihood: 92,
      messages: [
        { 
          role: "user", 
          content: `@auth/login.ts @auth/useAuth.ts @types/user.ts

The login form submits successfully but the user state isn't being updated.

Expected: After login, user object should be populated
Actual: user remains null, isAuthenticated stays false

Error in console:
"TypeError: Cannot read property 'id' of undefined at useAuth.ts:24"

Please fix the state update logic in useAuth.ts.`
        },
        { 
          role: "assistant", 
          content: `I can see the issue. In \`useAuth.ts\` line 24, you're accessing \`response.user.id\` but the API returns the user directly in \`response.data\`, not \`response.user\`.

Here's the fix:

\`\`\`typescript
// useAuth.ts line 22-28
const handleLogin = async (credentials) => {
  const response = await authApi.login(credentials);
  // Fix: Access response.data instead of response.user
  setUser(response.data);
  setIsAuthenticated(true);
};
\`\`\`

This change correctly extracts the user from the API response structure.`
        },
      ],
      strengths: [
        "Relevant files @-mentioned explicitly",
        "Clear expected vs actual behavior",
        "Specific error message included",
        "Single, focused request",
        "AI can solve immediately",
      ],
    },
  };

  const current = prompts[selectedPrompt];

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="flex gap-2 p-1 rounded-lg bg-muted/30">
        <button
          onClick={() => setSelectedPrompt("poor")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all",
            selectedPrompt === "poor"
              ? "bg-rose-500/20 text-rose-400"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertCircle className="w-4 h-4" />
          Polluted Chat
        </button>
        <button
          onClick={() => setSelectedPrompt("good")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all",
            selectedPrompt === "good"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Perfect Prompt
        </button>
      </div>

      {/* Success likelihood meter */}
      <div className="p-4 rounded-lg bg-muted/20 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Success Likelihood</span>
          <span className={cn(
            "text-lg font-bold",
            current.likelihood >= 80 ? "text-emerald-400" : 
            current.likelihood >= 50 ? "text-amber-400" : "text-rose-400"
          )}>
            {current.likelihood}%
          </span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              current.likelihood >= 80 ? "bg-emerald-500" : 
              current.likelihood >= 50 ? "bg-amber-500" : "bg-rose-500"
            )}
            style={{ width: `${current.likelihood}%` }}
          />
        </div>
      </div>

      {/* Chat display */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 border-b",
          selectedPrompt === "poor" 
            ? "bg-rose-500/10 border-rose-500/30"
            : "bg-emerald-500/10 border-emerald-500/30"
        )}>
          <MessageSquare className={cn(
            "w-4 h-4",
            selectedPrompt === "poor" ? "text-rose-400" : "text-emerald-400"
          )} />
          <span className={cn(
            "text-xs font-medium",
            selectedPrompt === "poor" ? "text-rose-400" : "text-emerald-400"
          )}>
            {current.title}
          </span>
        </div>
        <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto bg-background/50">
          {current.messages.map((msg, i) => (
            <div 
              key={i}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "px-3 py-2 rounded-lg text-xs max-w-[85%] whitespace-pre-wrap",
                msg.role === "user" 
                  ? "bg-cyan-500/20 text-cyan-300" 
                  : "bg-violet-500/20 text-violet-300"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className={cn(
        "p-4 rounded-lg border",
        selectedPrompt === "poor" 
          ? "bg-rose-500/5 border-rose-500/30"
          : "bg-emerald-500/5 border-emerald-500/30"
      )}>
        <div className={cn(
          "text-xs font-medium uppercase tracking-wide mb-2",
          selectedPrompt === "poor" ? "text-rose-400" : "text-emerald-400"
        )}>
          {selectedPrompt === "poor" ? "Issues" : "Strengths"}
        </div>
        <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
          {(selectedPrompt === "poor" ? current.issues : current.strengths)?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Interactive Pattern Library
function PatternLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("context");
  const [selectedPattern, setSelectedPattern] = useState<string>("explicit-mentions");

  const categories = [
    { id: "context", name: "Context Strategies", icon: Layers },
    { id: "iteration", name: "Iteration Patterns", icon: RefreshCw },
    { id: "specification", name: "Specification Patterns", icon: FileText },
    { id: "verification", name: "Verification Patterns", icon: CheckCircle2 },
  ];

  const patterns: Record<string, Array<{
    id: string;
    name: string;
    problem: string;
    solution: string;
    example: string;
    tip: string;
  }>> = {
    context: [
      {
        id: "explicit-mentions",
        name: "@-Mention Everything",
        problem: "AI doesn't have context about related files and makes assumptions",
        solution: "Explicitly @-mention all relevant files, even if they seem obvious",
        example: `@Button.tsx @buttonStyles.ts @types.ts

Add a loading spinner to the Button component that 
shows when isLoading prop is true`,
        tip: "Better to over-mention than under-mention. Extra context rarely hurts, missing context always does.",
      },
      {
        id: "show-examples",
        name: "Show, Don't Tell",
        problem: "AI interprets 'follow our patterns' differently than you expect",
        solution: "@-mention existing code that exemplifies the pattern you want",
        example: `Create a new UserSettings component following the 
same pattern as @ProfileCard.tsx

It should:
- Use the same Card layout
- Follow the same prop structure
- Use our standard form validation`,
        tip: "One example file is worth a hundred words of description.",
      },
      {
        id: "layered-context",
        name: "Layer Your Context",
        problem: "Single massive prompt becomes unfocused",
        solution: "Build context in layers: rules provide baseline, @-mentions add specifics",
        example: `# In .cursor/rules/forms.mdc:
All forms use react-hook-form with zod validation...

# In your prompt:
@userSchema.ts @useFormSubmit.ts

Add email verification to the registration form`,
        tip: "Rules are persistent context, @-mentions are task-specific context.",
      },
    ],
    iteration: [
      {
        id: "small-steps",
        name: "Small Steps Over Big Jumps",
        problem: "Large changes are hard to verify and often have subtle bugs",
        solution: "Break work into small, verifiable steps. Apply and test each.",
        example: `Step 1: "Add the UserCard component with just the layout"
→ Apply, verify visually

Step 2: "Add the edit button and onClick handler"
→ Apply, verify behavior

Step 3: "Add the modal for editing"
→ Apply, test the full flow`,
        tip: "If a step fails, you know exactly where. If a giant change fails, good luck debugging.",
      },
      {
        id: "feedback-loop",
        name: "Close the Feedback Loop",
        problem: "AI doesn't know if its changes worked",
        solution: "After applying changes, share the result (errors, test output, behavior)",
        example: `After applying your changes, I ran the tests:

FAIL  src/utils.test.ts
  ✕ formatDate should handle null input (5ms)
  Error: Cannot read property 'toISOString' of null

Please fix the null handling.`,
        tip: "Agent mode does this automatically. In Composer, do it manually.",
      },
      {
        id: "checkpoint-rollback",
        name: "Checkpoint Before Risky Changes",
        problem: "Big change goes wrong, hard to undo cleanly",
        solution: "Git commit before major changes. Use Cursor's checkpoints.",
        example: `Before: git commit -m "checkpoint before auth refactor"

Then: Let AI make changes
If wrong: git checkout . to restore

Cursor also creates automatic checkpoints you can 
restore from the command palette.`,
        tip: "Commits are free. Time spent debugging bad changes is not.",
      },
    ],
    specification: [
      {
        id: "tests-as-spec",
        name: "Tests as Specification",
        problem: "AI doesn't understand exactly what behavior you want",
        solution: "Write (or @-mention) tests first. They're unambiguous specs.",
        example: `@userService.test.ts

The tests define the expected behavior. Implement 
userService.ts to make all tests pass.

Don't change the tests—they're the specification.`,
        tip: "Failed tests tell AI exactly what's wrong. Natural language specs are ambiguous.",
      },
      {
        id: "acceptance-criteria",
        name: "Explicit Acceptance Criteria",
        problem: "AI implements something, but it's not what you wanted",
        solution: "State clear, checkable acceptance criteria upfront",
        example: `Add user search to the admin panel.

Acceptance criteria:
- [ ] Search input with debounce (300ms)
- [ ] Results show name, email, and role
- [ ] Clicking a result navigates to /admin/users/:id
- [ ] Empty state shows "No users found"
- [ ] Loading state shows skeleton`,
        tip: "Checkboxes become your review checklist. If AI misses one, it's obvious.",
      },
      {
        id: "negative-constraints",
        name: "Specify What NOT to Do",
        problem: "AI over-engineers or adds unwanted features",
        solution: "Explicitly state constraints and anti-patterns",
        example: `Add caching to the API client.

Constraints:
- Do NOT add new dependencies
- Do NOT change the existing function signatures
- Do NOT add caching to mutation endpoints
- Keep it simple—no TTL config, just in-memory`,
        tip: "AI will helpfully add features you don't want. Preempt this with explicit constraints.",
      },
    ],
    verification: [
      {
        id: "run-before-done",
        name: "Run Before Declaring Done",
        problem: "AI claims it's done, but the code doesn't actually work",
        solution: "Always run tests/lint/type-check before accepting 'done'",
        example: `In Agent mode:
"Run npm test and npm run lint. Fix any errors."

In Composer mode:
After applying, run the commands yourself and 
paste back any errors for fixing.`,
        tip: "Trust but verify. Even good AI makes runtime errors.",
      },
      {
        id: "diff-review",
        name: "Review Every Diff Line",
        problem: "Subtle bugs slip through because you auto-accepted",
        solution: "Read every line of the diff. Look for logic errors, not just syntax.",
        example: `Common issues to watch for:
- Removed null checks
- Changed comparison operators (< vs <=)
- Removed error handling
- Hardcoded values that should be variables
- Imports from wrong paths`,
        tip: "AI makes plausible-looking mistakes. They compile but do the wrong thing.",
      },
      {
        id: "edge-cases",
        name: "Test Edge Cases Explicitly",
        problem: "Happy path works, edge cases fail",
        solution: "Ask AI to enumerate edge cases, then verify each",
        example: `What edge cases should I test for this function?

Then verify:
- Empty array: ✓
- Single element: ✓  
- Duplicate values: ✗ Bug found!
- Null input: ✓`,
        tip: "AI is good at generating edge case lists. Use that to guide your verification.",
      },
    ],
  };

  const currentPatterns = patterns[selectedCategory];
  const currentPattern = currentPatterns.find(p => p.id === selectedPattern) || currentPatterns[0];

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Pattern Library</h4>
        <span className="text-xs text-muted-foreground">Explore effective patterns</span>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4 p-1 rounded-lg bg-muted/30">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedPattern(patterns[cat.id][0].id);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[var(--highlight)] text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[250px,1fr]">
        {/* Pattern list */}
        <div className="space-y-1">
          {currentPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedPattern === pattern.id
                  ? 'bg-[var(--highlight)]/20 text-[var(--highlight)]'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className="text-sm font-medium">{pattern.name}</div>
            </button>
          ))}
        </div>

        {/* Pattern detail */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/20 border border-border">
            <h5 className="font-medium text-foreground mb-2">{currentPattern.name}</h5>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-rose-400 uppercase tracking-wide mb-1">Problem</div>
                <p className="text-sm text-muted-foreground m-0">{currentPattern.problem}</p>
              </div>
              
              <div>
                <div className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Solution</div>
                <p className="text-sm text-foreground m-0">{currentPattern.solution}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Example</div>
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{currentPattern.example}</pre>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 shrink-0">💡</span>
            <p className="text-sm text-amber-200 m-0">{currentPattern.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CursorPatternsSection() {
  return (
    <section id="cursor-patterns" className="scroll-mt-20">
      <SectionHeading
        id="cursor-patterns-heading"
        title="Effective Patterns"
        subtitle="Patterns for getting the most from AI-assisted development"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Getting the most from Cursor (or any AI IDE) requires adapting your workflow. The best 
          results come from <strong className="text-foreground">working with the tool&apos;s strengths</strong>, 
          not fighting against its limitations.
        </p>

        {/* Prompt Quality Demo */}
        <h3 id="prompt-quality" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Perfect Prompt vs Polluted Chat
        </h3>

        <p className="text-muted-foreground">
          The difference between effective and ineffective AI assistance often comes down to 
          <strong className="text-foreground"> how you start the conversation</strong>. Compare these two approaches:
        </p>

        <InteractiveWrapper
          title="Interactive: Prompt Quality"
          description="Compare polluted chat vs perfect prompt"
          icon="💬"
          colorTheme="cyan"
          minHeight="auto"
        >
          <PromptQualityDemo />
        </InteractiveWrapper>

        <Callout variant="important" title="The First Message Matters Most">
          <p className="m-0">
            A single, well-crafted first message with all necessary context will outperform a lengthy 
            back-and-forth conversation. Each message in a polluted chat wastes tokens and compounds 
            ambiguity. <strong>Front-load your context.</strong>
          </p>
        </Callout>

        {/* Pattern Library */}
        <h3 id="pattern-library" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Pattern Library
        </h3>

        <p className="text-muted-foreground">
          Explore proven patterns organized by category. Each pattern addresses a common challenge 
          and provides actionable solutions.
        </p>

        <PatternLibrary />

        {/* Context Strategies */}
        <h3 id="context-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Context Strategies Summary
        </h3>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-3">The Context Hierarchy</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-medium shrink-0">1</div>
                <div>
                  <span className="text-sm font-medium text-foreground">Rules (Persistent)</span>
                  <p className="text-sm text-muted-foreground m-0">
                    Project conventions that apply to every interaction
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-medium shrink-0">2</div>
                <div>
                  <span className="text-sm font-medium text-foreground">@-Mentions (Explicit)</span>
                  <p className="text-sm text-muted-foreground m-0">
                    Files you explicitly include for this task
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-medium shrink-0">3</div>
                <div>
                  <span className="text-sm font-medium text-foreground">Retrieved (Automatic)</span>
                  <p className="text-sm text-muted-foreground m-0">
                    Code found by semantic search based on your prompt
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium shrink-0">4</div>
                <div>
                  <span className="text-sm font-medium text-foreground">Current File (Implicit)</span>
                  <p className="text-sm text-muted-foreground m-0">
                    The file you&apos;re actively editing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Iteration Patterns Summary */}
        <h3 id="iteration-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Iteration Patterns Summary
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground m-0">Small Steps</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Break large tasks into small, verifiable steps. Apply and test each before proceeding.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground m-0">Tight Feedback</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Share errors, test results, and outcomes back to the AI. Close the loop.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground m-0">Tests as Specs</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Write tests first. They&apos;re unambiguous specifications AI can implement against.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground m-0">Verify Everything</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Run tests, review diffs line-by-line, check edge cases. Trust but verify.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Meta-Pattern">
          <p className="m-0">
            All these patterns share one theme: <strong>explicit over implicit</strong>. Don&apos;t 
            assume the AI knows what you mean. Be explicit about context, constraints, and criteria. 
            The clearer your input, the better the output.
          </p>
        </Callout>

        <Callout variant="info" title="Continuous Improvement">
          <p className="m-0">
            Update your rules when you find yourself repeating the same feedback. If you keep 
            saying &quot;don&apos;t use default exports,&quot; add it to your rules. Your patterns should evolve 
            with your experience.
          </p>
        </Callout>
      </div>
    </section>
  );
}
