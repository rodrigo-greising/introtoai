"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import {
  FileText,
  Code,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

// Interactive Spec Flow Visualization
function SpecFlowVisualization() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: "idea",
      title: "1. Idea",
      icon: "💡",
      color: "cyan",
      content: "User needs to reset their password via email",
      detail: "High-level requirement from user feedback or product planning",
    },
    {
      id: "prd",
      title: "2. PRD",
      icon: "📋",
      color: "violet",
      content: `## Password Reset Feature

**Goal:** Allow users to reset forgotten passwords

**User Story:**
As a user who forgot my password,
I want to receive a reset link via email,
So that I can regain access to my account.

**Requirements:**
- Email must be validated
- Reset link expires in 1 hour
- Password must meet security requirements`,
      detail: "Product Requirements Document defines the what and why",
    },
    {
      id: "spec",
      title: "3. Technical Spec",
      icon: "📐",
      color: "amber",
      content: `## Password Reset Implementation Spec

### Endpoints
POST /api/auth/forgot-password
  Input: { email: string }
  Output: { success: boolean, message: string }
  
POST /api/auth/reset-password
  Input: { token: string, password: string }
  Output: { success: boolean }

### Validation
- Email: Valid format, exists in database
- Token: 32-byte random, stored hashed
- Password: Min 8 chars, 1 uppercase, 1 number

### Constraints
- Rate limit: 3 requests per email per hour
- Token expiry: 1 hour
- Must not reveal if email exists`,
      detail: "Technical spec defines the how with precise contracts",
    },
    {
      id: "implement",
      title: "4. AI Implementation",
      icon: "🤖",
      color: "emerald",
      content: `// Generated from spec
export async function forgotPassword(email: string) {
  // Validate email format
  if (!isValidEmail(email)) {
    return { success: false, message: "Invalid email" };
  }
  
  // Rate limit check
  await enforceRateLimit(email, 3, "1h");
  
  // Generate token (don't reveal if user exists)
  const user = await findUserByEmail(email);
  if (user) {
    const token = generateSecureToken(32);
    await storeHashedToken(user.id, token, "1h");
    await sendResetEmail(email, token);
  }
  
  // Same response regardless of user existence
  return { success: true, message: "Check your email" };
}`,
      detail: "AI generates implementation that matches the spec exactly",
    },
    {
      id: "verify",
      title: "5. Verify",
      icon: "✅",
      color: "pink",
      content: `✓ Endpoint matches spec signature
✓ Email validation implemented
✓ Rate limiting: 3/hour enforced
✓ Token is 32 bytes, stored hashed
✓ 1 hour expiry set
✓ Same response for existing/non-existing users
✓ All tests passing`,
      detail: "Verify implementation against spec criteria",
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  };

  const currentStep = steps[activeStep];
  const colors = colorClasses[currentStep.color];

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Spec-Driven Flow</h4>
        <span className="text-xs text-muted-foreground">Click steps to explore</span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setActiveStep(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                index === activeStep
                  ? `${colorClasses[step.color].bg} ${colorClasses[step.color].border} border-2 scale-110`
                  : index < activeStep
                  ? "bg-emerald-500/20 border border-emerald-500/30"
                  : "bg-muted/40 border border-border"
              }`}
            >
              {step.icon}
            </button>
            {index < steps.length - 1 && (
              <ArrowRight className={`w-4 h-4 mx-1 ${index < activeStep ? "text-emerald-400" : "text-muted-foreground"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{currentStep.icon}</span>
          <div>
            <h5 className={`font-medium ${colors.text}`}>{currentStep.title}</h5>
            <p className="text-xs text-muted-foreground m-0">{currentStep.detail}</p>
          </div>
        </div>
        
        <pre className="mt-4 p-3 rounded bg-background/50 border border-border/50 text-xs overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
          {currentStep.content}
        </pre>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="px-3 py-1.5 text-sm rounded bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="px-3 py-1.5 text-sm rounded bg-[var(--highlight)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

export function SpecDrivenDevSection() {
  return (
    <section id="spec-driven" className="scroll-mt-20">
      <SectionHeading
        id="spec-driven-heading"
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

        {/* Interactive Flow */}
        <h3 id="spec-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Spec-Driven Flow
        </h3>

        <p className="text-muted-foreground">
          Walk through a complete example of spec-driven development, from initial idea to 
          verified implementation:
        </p>

        <SpecFlowVisualization />

        {/* What is Spec-Driven Development */}
        <h3 id="writing-specs" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Writing Effective Specs
        </h3>

        <p className="text-muted-foreground">
          AI-friendly specs share common traits: they&apos;re <strong className="text-foreground">explicit</strong>, 
          <strong className="text-foreground">testable</strong>, and <strong className="text-foreground">scoped</strong>. 
          Avoid ambiguity—what&apos;s obvious to you isn&apos;t obvious to a model.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground m-0">Inputs & Outputs</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Define exact data shapes, types, and edge cases
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground m-0">Constraints</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Performance requirements, dependencies, compatibility
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground m-0">Acceptance Criteria</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Verifiable conditions that define &quot;done&quot;
              </p>
            </CardContent>
          </Card>
        </div>

        {/* From PRD to Implementation */}
        <h3 id="prd-to-code" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          PRD to Implementation
        </h3>

        <p className="text-muted-foreground">
          A Product Requirements Document (PRD) captures the <strong className="text-foreground">what 
          and why</strong>. The implementation spec captures the <strong className="text-foreground">how</strong>. 
          AI can help translate between these levels, but human judgment validates the translation.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-3">The Translation Pipeline</h4>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <div className="text-xl mb-1">📋</div>
                <div className="text-sm font-medium text-foreground">PRD</div>
                <div className="text-xs text-muted-foreground">What & Why</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <div className="text-xl mb-1">📐</div>
                <div className="text-sm font-medium text-foreground">Tech Spec</div>
                <div className="text-xs text-muted-foreground">How</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <div className="text-xl mb-1">📝</div>
                <div className="text-sm font-medium text-foreground">Unit Specs</div>
                <div className="text-xs text-muted-foreground">Focused tasks</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <div className="text-xl mb-1">💻</div>
                <div className="text-sm font-medium text-foreground">Code</div>
                <div className="text-xs text-muted-foreground">Implementation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spec Validation Patterns */}
        <h3 id="spec-flow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Spec Validation Patterns
        </h3>

        <p className="text-muted-foreground">
          A spec is only useful if you can verify implementation against it. Build validation 
          into your workflow—automated where possible, human review where judgment is needed.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground m-0">Automated Validation</h4>
              </div>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Generated tests from spec criteria</li>
                <li>Type checking against defined shapes</li>
                <li>Contract testing for APIs</li>
                <li>Linting against conventions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground m-0">Human Validation</h4>
              </div>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>UX review against requirements</li>
                <li>Edge case judgment calls</li>
                <li>Architectural alignment</li>
                <li>Security review</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Spec Files as Rules">
          <p className="m-0">
            Store your specs in <code>.cursor/rules/</code> or a <code>/specs</code> directory 
            that AI can reference. When implementing, @-mention the relevant spec file to give 
            the AI a clear contract to implement against.
          </p>
        </Callout>

        <Callout variant="info" title="Key References">
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
