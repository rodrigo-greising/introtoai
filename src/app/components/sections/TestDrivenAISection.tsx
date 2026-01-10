import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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

        <CodeBlock
          language="typescript"
          filename="example.test.ts"
          code={`// Good: Tests capture edge cases and expected behavior
describe('calculateDiscount', () => {
  it('applies 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(15);
  });
  
  it('returns 0 for orders under $100', () => {
    expect(calculateDiscount(50)).toBe(0);
  });
  
  it('handles edge case at exactly $100', () => {
    expect(calculateDiscount(100)).toBe(0); // or 10? Test makes it explicit
  });
  
  it('throws for negative amounts', () => {
    expect(() => calculateDiscount(-10)).toThrow();
  });
});`}
        />

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
