import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";

export function SpecDrivenDevSection() {
  return (
    <section id="spec-driven-dev" className="scroll-mt-20">
      <SectionHeading
        id="spec-driven-dev-heading"
        title="Spec-Driven Development"
        subtitle="Define specifications before coding with AI assistance"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Spec-Driven Development (SDD) flips the traditional approach: instead of jumping straight 
          into code, you <strong className="text-foreground">define clear specifications first</strong>, 
          then let AI help implement them. This creates a contract that both human and AI can verify against.
        </p>

        <Callout variant="info" title="Why Specs Matter for AI">
          <p className="m-0">
            AI coding assistants excel when given clear constraints. A well-written spec acts as 
            both <strong>guidance for generation</strong> and <strong>criteria for validation</strong>. 
            Without specs, you&apos;re asking AI to guess what &quot;done&quot; looks like.
          </p>
        </Callout>

        {/* What is Spec-Driven Development */}
        <h3 id="what-is-spec-driven" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What is Spec-Driven Development
        </h3>

        <p className="text-muted-foreground">
          SDD is a methodology where <strong className="text-foreground">specifications precede 
          implementation</strong>. Specs can range from formal PRDs to structured markdown files 
          that define inputs, outputs, constraints, and acceptance criteria.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Traditional Flow</h4>
              <p className="text-sm text-muted-foreground m-0">
                Idea → Code → Discover requirements → Refactor → Hope it works
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">Spec-Driven Flow</h4>
              <p className="text-sm text-muted-foreground m-0">
                Idea → Spec → Validate spec → Generate code → Verify against spec
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Writing Effective Specs for AI */}
        <h3 id="writing-specs-for-ai" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Writing Effective Specs for AI
        </h3>

        <p className="text-muted-foreground">
          AI-friendly specs share common traits: they&apos;re <strong className="text-foreground">explicit</strong>, 
          <strong className="text-foreground">testable</strong>, and <strong className="text-foreground">scoped</strong>. 
          Avoid ambiguity—what&apos;s obvious to you isn&apos;t obvious to a model.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Inputs & Outputs</h4>
              <p className="text-sm text-muted-foreground m-0">
                Define exact data shapes, types, and edge cases
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Constraints</h4>
              <p className="text-sm text-muted-foreground m-0">
                Performance requirements, dependencies, compatibility
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Acceptance Criteria</h4>
              <p className="text-sm text-muted-foreground m-0">
                Verifiable conditions that define &quot;done&quot;
              </p>
            </CardContent>
          </Card>
        </div>

        {/* From PRD to Implementation */}
        <h3 id="prd-to-implementation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          From PRD to Implementation
        </h3>

        <p className="text-muted-foreground">
          A Product Requirements Document (PRD) captures the <strong className="text-foreground">what 
          and why</strong>. The implementation spec captures the <strong className="text-foreground">how</strong>. 
          AI can help translate between these levels, but human judgment validates the translation.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">The Translation Pipeline</h4>
            <ol className="text-sm text-muted-foreground m-0 pl-4 list-decimal space-y-1">
              <li>PRD defines user-facing requirements and business goals</li>
              <li>Technical spec breaks down into implementable units</li>
              <li>Each unit gets its own focused spec file</li>
              <li>AI implements against the spec, human verifies</li>
            </ol>
          </CardContent>
        </Card>

        {/* Spec Validation Patterns */}
        <h3 id="spec-validation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Spec Validation Patterns
        </h3>

        <p className="text-muted-foreground">
          A spec is only useful if you can verify implementation against it. Build validation 
          into your workflow—automated where possible, human review where judgment is needed.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Automated Validation</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Generated tests from spec criteria</li>
                <li>Type checking against defined shapes</li>
                <li>Contract testing for APIs</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Human Validation</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>UX review against requirements</li>
                <li>Edge case judgment calls</li>
                <li>Architectural alignment</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Key References">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li><strong>AWS Kiro</strong> — Spec-first agentic IDE approach</li>
            <li><strong>ChatDev</strong> — Structured spec interpretation via multi-agent dialogue</li>
            <li><strong>Google Antigravity</strong> — Prompt decomposition into structured specs</li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
