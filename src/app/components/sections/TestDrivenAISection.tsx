"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Play, 
  RotateCcw,
  User,
  Bot,
  CheckCircle,
  XCircle,
} from "lucide-react";

// =============================================================================
// Red-Green-Refactor Animation
// =============================================================================

type TDDPhase = "idle" | "red" | "green-attempt" | "green-fail" | "green-pass" | "refactor";

function RedGreenAnimation() {
  const [phase, setPhase] = useState<TDDPhase>("idle");
  const [iteration, setIteration] = useState(0);

  const runCycle = () => {
    setPhase("idle");
    setIteration(prev => prev + 1);
    
    const sequence: TDDPhase[] = ["red", "green-attempt", "green-fail", "green-attempt", "green-pass", "refactor"];
    
    sequence.forEach((p, i) => {
      setTimeout(() => setPhase(p), i * 1200);
    });
    
    setTimeout(() => setPhase("idle"), sequence.length * 1200 + 500);
  };

  const reset = () => {
    setPhase("idle");
    setIteration(0);
  };

  const getPhaseColor = (p: TDDPhase) => {
    if (p === "red") return "text-rose-400 bg-rose-500/20 border-rose-500/30";
    if (p.startsWith("green")) return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
    if (p === "refactor") return "text-amber-400 bg-amber-500/20 border-amber-500/30";
    return "text-muted-foreground bg-muted/30 border-border";
  };


  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={runCycle}
          disabled={phase !== "idle"}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            phase === "idle"
              ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              : "bg-muted/30 text-muted-foreground cursor-not-allowed"
          )}
        >
          <Play className="w-4 h-4" />
          Run TDD Cycle
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        {iteration > 0 && (
          <span className="ml-auto text-sm text-muted-foreground">
            Cycle #{iteration}
          </span>
        )}
      </div>

      {/* Phase visualization */}
      <div className="grid grid-cols-3 gap-4">
        {["red", "green", "refactor"].map((p) => {
          const isActive = phase.startsWith(p) || (p === "green" && phase.startsWith("green"));
          const color = p === "red" ? "rose" : p === "green" ? "emerald" : "amber";
          
          return (
            <div
              key={p}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-center",
                isActive
                  ? `bg-${color}-500/10 border-${color}-500/50 scale-105`
                  : "bg-muted/20 border-border opacity-50"
              )}
              style={{
                backgroundColor: isActive ? `var(--${color}-500-10, rgba(100,150,200,0.1))` : undefined,
                borderColor: isActive ? `var(--${color}-500-50, rgba(100,150,200,0.5))` : undefined,
              }}
            >
              <div className={cn(
                "text-lg font-bold uppercase mb-1",
                isActive ? `text-${color}-400` : "text-muted-foreground"
              )} style={{
                color: isActive ? `var(--${color}-400, rgb(150,180,200))` : undefined,
              }}>
                {p}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                {p === "red" && <User className="w-3 h-3" />}
                {p === "green" && <Bot className="w-3 h-3" />}
                {p === "refactor" && (
                  <>
                    <User className="w-3 h-3" />
                    <Bot className="w-3 h-3" />
                  </>
                )}
                <span>{p === "red" ? "Human" : p === "green" ? "AI" : "Both"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className={cn(
        "p-4 rounded-lg border flex items-center justify-between transition-all",
        getPhaseColor(phase)
      )}>
        <span className="font-medium">
          {phase === "idle" && "Ready to start TDD cycle"}
          {phase === "red" && "📝 Writing failing test..."}
          {phase === "green-attempt" && "🤖 AI implementing..."}
          {phase === "green-fail" && "❌ Test failed. Iterating..."}
          {phase === "green-pass" && "✅ Test passes!"}
          {phase === "refactor" && "🔧 Cleaning up implementation..."}
        </span>
        <div className="flex items-center gap-2">
          {phase === "green-fail" && <XCircle className="w-5 h-5 text-rose-400" />}
          {phase === "green-pass" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Human writes tests</span>
        </div>
        <div className="flex items-center gap-1">
          <Bot className="w-3 h-3" />
          <span>AI implements until pass</span>
        </div>
      </div>
    </div>
  );
}

export function TestDrivenAISection() {
  return (
    <section id="test-driven-ai" className="scroll-mt-20">
      <SectionHeading
        id="test-driven-ai-heading"
        title="Test-Driven AI Development"
        subtitle="Write tests first, let AI make them pass"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Test-Driven Development with AI inverts the typical workflow: you write the tests that 
          define correct behavior, then <strong className="text-foreground">task the AI with making 
          them pass</strong>. Tests become both specification and validation in one artifact.
        </p>

        <Callout variant="important" title="The Core Insight">
          <p className="m-0">
            Tests are <strong>executable specifications</strong>. When you give AI a failing test 
            and ask it to make it pass, you&apos;re providing an unambiguous success criterion. No 
            interpretation needed—either the test passes or it doesn&apos;t.
          </p>
        </Callout>

        {/* Red-Green-Refactor Animation */}
        <h3 id="tdd-cycle" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The TDD Cycle with AI
        </h3>

        <p className="text-muted-foreground">
          Watch the Red-Green-Refactor cycle in action. Note how AI may iterate multiple times 
          during the Green phase until tests pass.
        </p>

        <InteractiveWrapper
          title="Interactive: Red-Green-Refactor"
          description="Visualize TDD with AI assistance"
          icon="🔴🟢"
          colorTheme="emerald"
          minHeight="auto"
        >
          <RedGreenAnimation />
        </InteractiveWrapper>

        {/* TDD Fundamentals for AI Workflows */}
        <h3 id="tdd-fundamentals" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          TDD Fundamentals for AI Workflows
        </h3>

        <p className="text-muted-foreground">
          Traditional TDD follows the <strong className="text-foreground">Red-Green-Refactor</strong> cycle. 
          With AI, the cycle shifts: humans own the &quot;Red&quot; phase (writing failing tests), AI handles 
          &quot;Green&quot; (implementation), and both collaborate on &quot;Refactor.&quot;
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">Red (Human)</h4>
              <p className="text-sm text-muted-foreground m-0">
                Write a test that captures the desired behavior. It should fail because the code doesn&apos;t exist yet.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Green (AI)</h4>
              <p className="text-sm text-muted-foreground m-0">
                AI writes the minimal code to make the test pass. The test is the acceptance criterion.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-500 mb-2">Refactor (Both)</h4>
              <p className="text-sm text-muted-foreground m-0">
                Clean up the implementation while keeping tests green. AI proposes, human approves.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Writing Tests Before Tasking AI */}
        <h3 id="tests-before-ai" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Writing Tests Before Tasking AI
        </h3>

        <p className="text-muted-foreground">
          The quality of AI output is bounded by the quality of your tests. <strong className="text-foreground">Underspecified 
          tests lead to technically-correct-but-wrong implementations</strong>. Invest time in comprehensive test cases.
        </p>

        <p className="text-muted-foreground">
          Good tests capture edge cases and expected behavior. For example, a discount calculation function 
          should test: applying discount for orders over threshold, returning 0 for orders under threshold, 
          handling the exact threshold edge case, and throwing for invalid inputs like negative amounts. 
          Each test case is a clause in the contract with the AI.
        </p>

        <Callout variant="tip" title="Test as Contract">
          <p className="m-0">
            Each test case is a <strong>clause in the contract</strong> with the AI. If you don&apos;t 
            test for an edge case, don&apos;t be surprised when the AI doesn&apos;t handle it.
          </p>
        </Callout>

        {/* The Red-Green-Refactor Loop with AI */}
        <h3 id="red-green-refactor-ai" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Red-Green-Refactor Loop with AI
        </h3>

        <p className="text-muted-foreground">
          The loop becomes a conversation with tight feedback cycles. Write a test, ask AI to 
          implement, run the test, iterate. Each cycle should be <strong className="text-foreground">small 
          and focused</strong>—one behavior at a time.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">The AI-TDD Loop</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>Human writes a failing test for the next behavior</li>
              <li>Human provides test + any relevant context to AI</li>
              <li>AI generates implementation attempt</li>
              <li>Human runs tests—pass or fail?</li>
              <li>If fail: provide error output to AI, iterate</li>
              <li>If pass: write next test or refactor</li>
            </ol>
          </CardContent>
        </Card>

        {/* End-to-End Test Strategies */}
        <h3 id="e2e-test-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          End-to-End Test Strategies
        </h3>

        <p className="text-muted-foreground">
          For larger features, start with <strong className="text-foreground">end-to-end tests</strong> that 
          capture the overall behavior, then drill down into unit tests for components. This gives AI 
          both the big picture and the details.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Outside-In Approach</h4>
              <p className="text-sm text-muted-foreground m-0">
                Start with E2E tests that define user-facing behavior, then write unit tests for 
                internal components as you implement.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Test Pyramid</h4>
              <p className="text-sm text-muted-foreground m-0">
                Many unit tests, fewer integration tests, minimal E2E tests. AI can help 
                generate the high-volume unit tests.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Key References">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li><strong>TENET Framework</strong> (arxiv.org/abs/2509.24148) — Leverages tests beyond validation for code generation</li>
            <li><strong>TDFlow</strong> (arxiv.org/abs/2510.23761) — Frames repo-scale engineering as test-resolution task</li>
            <li><strong>Diffblue</strong> — Autonomous unit test generation for Java</li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
