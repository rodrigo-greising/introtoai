"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import {
  BookOpen,
  Layers,
  Blocks,
  Database,
  GitBranch,
  Shield,
  TestTube,
  Code,
  Workflow,
  Settings,
  ChevronRight,
  Sparkles,
  Dices,
  ArrowRight,
} from "lucide-react";

// =============================================================================
// Learning Roadmap Data
// =============================================================================

interface RoadmapPart {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  sections: string[];
  keyInsight: string;
}

const roadmapParts: RoadmapPart[] = [
  {
    id: "foundations",
    number: 1,
    title: "Foundations",
    description: "How LLMs work, the stateless mental model, embeddings, and caching",
    icon: BookOpen,
    color: "cyan",
    sections: ["How LLMs Work", "The Mental Model", "Embeddings", "Caching"],
    keyInsight: "LLMs are stateless functions—every call starts fresh",
  },
  {
    id: "context",
    number: 2,
    title: "Context Engineering",
    description: "Principles, layered architecture, and context lifecycle management",
    icon: Layers,
    color: "violet",
    sections: ["Context Principles", "Layered Architecture", "Context Lifecycle"],
    keyInsight: "Signal over noise—every token must earn its place",
  },
  {
    id: "capabilities",
    number: 3,
    title: "Capabilities",
    description: "Structured outputs, tools, the agentic loop, and workflow patterns",
    icon: Blocks,
    color: "amber",
    sections: ["Structured Outputs", "Tools", "Agentic Loop", "Workflows vs Agents"],
    keyInsight: "Tools transform LLMs from text generators to actors",
  },
  {
    id: "retrieval",
    number: 4,
    title: "Knowledge & Retrieval",
    description: "RAG fundamentals, vector databases, and chunking strategies",
    icon: Database,
    color: "emerald",
    sections: ["RAG Fundamentals", "Vector Databases", "Chunking"],
    keyInsight: "RAG is automated context engineering at query time",
  },
  {
    id: "orchestration",
    number: 5,
    title: "Orchestration",
    description: "Task decomposition, parallelization, delegation, and routing",
    icon: GitBranch,
    color: "rose",
    sections: ["Task Decomposition", "Parallelization", "Delegation", "Skills", "Routing"],
    keyInsight: "Focused sub-agents outperform overloaded single contexts",
  },
  {
    id: "safety",
    number: 6,
    title: "Safety & Control",
    description: "Guardrails, RBAC, human-in-the-loop, and control patterns",
    icon: Shield,
    color: "orange",
    sections: ["Guardrails & RBAC", "Human-in-the-Loop", "External Control"],
    keyInsight: "Trust boundaries define what agents can and cannot do",
  },
  {
    id: "evaluation",
    number: 7,
    title: "Evaluation",
    description: "Test harnesses and test-driven AI development",
    icon: TestTube,
    color: "pink",
    sections: ["Harnesses & Evaluation", "Test-Driven AI"],
    keyInsight: "Tests provide the feedback loop for AI iteration",
  },
  {
    id: "coding-agents",
    number: 8,
    title: "Coding Agents",
    description: "Cursor-focused patterns for AI-assisted development",
    icon: Code,
    color: "sky",
    sections: ["Architecture", "Rules", "Modes", "Patterns", "Background Agents"],
    keyInsight: "Rules files are prompts for your codebase context",
  },
  {
    id: "workflow",
    number: 9,
    title: "Development Workflow",
    description: "Spec-driven development, CI/CD, and tooling integration",
    icon: Workflow,
    color: "indigo",
    sections: ["Spec-Driven Dev", "CI/CD Iteration", "Graphite", "Linear", "E2E Pipeline"],
    keyInsight: "Specs first, then let AI implement against tests",
  },
  {
    id: "production",
    number: 10,
    title: "Production",
    description: "Cost optimization and reliability patterns",
    icon: Settings,
    color: "slate",
    sections: ["Cost Optimization", "Reliability Patterns"],
    keyInsight: "Optimize for cost without sacrificing quality",
  },
];

// =============================================================================
// Interactive Roadmap Component
// =============================================================================

function LearningRoadmap() {
  const [selectedPart, setSelectedPart] = useState<RoadmapPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
    violet: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400", glow: "shadow-violet-500/20" },
    amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", glow: "shadow-amber-500/20" },
    emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    rose: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", glow: "shadow-rose-500/20" },
    orange: { bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-400", glow: "shadow-orange-500/20" },
    pink: { bg: "bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-400", glow: "shadow-pink-500/20" },
    sky: { bg: "bg-sky-500/20", border: "border-sky-500/40", text: "text-sky-400", glow: "shadow-sky-500/20" },
    indigo: { bg: "bg-indigo-500/20", border: "border-indigo-500/40", text: "text-indigo-400", glow: "shadow-indigo-500/20" },
    slate: { bg: "bg-slate-500/20", border: "border-slate-500/40", text: "text-slate-400", glow: "shadow-slate-500/20" },
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {roadmapParts.map((part) => {
          const colors = colorClasses[part.color];
          const Icon = part.icon;
          const isSelected = selectedPart?.id === part.id;
          const isHovered = hoveredPart === part.id;

          return (
            <button
              key={part.id}
              onClick={() => setSelectedPart(isSelected ? null : part)}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                colors.bg,
                colors.border,
                isSelected && `ring-2 ring-offset-2 ring-offset-background ${colors.border} shadow-lg ${colors.glow}`,
                isHovered && !isSelected && "scale-105",
                "hover:shadow-md"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                colors.bg
              )}>
                <Icon className={cn("w-5 h-5", colors.text)} />
              </div>
              <div className="text-center">
                <div className={cn("text-xs font-bold", colors.text)}>
                  Part {part.number}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {part.title}
                </div>
              </div>
              {/* Connection line to next part */}
              {part.number < 10 && part.number % 5 !== 0 && (
                <ChevronRight className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 hidden sm:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Part Details */}
      {selectedPart && (
        <div
          className={cn(
            "p-5 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300",
            colorClasses[selectedPart.color].bg,
            colorClasses[selectedPart.color].border
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
              colorClasses[selectedPart.color].bg
            )}>
              <selectedPart.icon className={cn("w-6 h-6", colorClasses[selectedPart.color].text)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-sm font-bold", colorClasses[selectedPart.color].text)}>
                  Part {selectedPart.number}
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {selectedPart.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedPart.description}
              </p>
              
              {/* Sections list */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedPart.sections.map((section) => (
                  <span
                    key={section}
                    className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground"
                  >
                    {section}
                  </span>
                ))}
              </div>

              {/* Key Insight */}
              <div className={cn(
                "flex items-start gap-2 p-3 rounded-lg",
                "bg-background/50 border border-border/50"
              )}>
                <Sparkles className={cn("w-4 h-4 mt-0.5 shrink-0", colorClasses[selectedPart.color].text)} />
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Key Insight
                  </span>
                  <p className="text-sm text-foreground mt-0.5">
                    {selectedPart.keyInsight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint when nothing selected */}
      {!selectedPart && (
        <p className="text-center text-sm text-muted-foreground">
          Click on any part to see what you&apos;ll learn
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function IntroSection() {
  return (
    <section id="intro" className="scroll-mt-20">
      <SectionHeading
        id="intro-heading"
        title="Introduction"
        subtitle="A practical guide for software engineers on using AI effectively"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide is for <strong className="text-foreground">software engineers</strong> who
          want to leverage AI in their development workflow. Not to replace thinking, but to
          augment it. Not to generate slop, but to move faster with intention.
        </p>

        <Callout variant="tip" title="Who This Is For">
          <p>
            Engineers who already know how to code and want to understand how to
            use LLMs as a tool, not a crutch. We&apos;ll cover mental models, practical
            patterns, and real engineering considerations.
          </p>
        </Callout>

        {/* Interactive Learning Roadmap */}
        <h3 id="learning-roadmap" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Learning Roadmap
        </h3>

        <p className="text-muted-foreground mb-6">
          This guide is organized into <strong className="text-foreground">10 progressive parts</strong>. 
          Each part builds on the previous, taking you from foundational concepts to production-ready patterns. 
          Explore the roadmap below to see what&apos;s ahead.
        </p>

        <InteractiveWrapper
          title="Interactive: Learning Path"
          description="Click on any part to explore what you'll learn in each section"
          icon="🗺️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <LearningRoadmap />
        </InteractiveWrapper>

        {/* Prerequisites */}
        <h3 id="prerequisites" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Prerequisites
        </h3>

        <p className="text-muted-foreground mb-4">
          This guide assumes you&apos;re comfortable with:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Programming fundamentals</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Variables, functions, async/await, data structures
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <div>
              <span className="font-medium text-foreground">API concepts</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                REST, HTTP, JSON, request/response patterns
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Basic TypeScript/JavaScript</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Examples use TypeScript, but concepts are universal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <div>
              <span className="font-medium text-foreground">LLM API experience (helpful)</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Used OpenAI, Anthropic, or similar APIs before
              </p>
            </div>
          </div>
        </div>

        {/* Capstone Project Link */}
        <div className="mt-10 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/30">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 shrink-0">
              <Dices className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">Capstone Project: Virtual Tabletop Assistant</h4>
              <p className="text-sm text-muted-foreground mb-3">
                See all guide concepts combined in a comprehensive architectural example: a VTT assistant 
                that works with any rulebook system, featuring RAG, orchestration, dynamic schemas, and cost optimization.
              </p>
              <a
                href="#capstone"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Jump to Capstone <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* The Core Insight */}
        <h3 className="text-xl font-semibold mt-10 mb-4">The Core Insight</h3>

        <p className="text-muted-foreground">
          The key to using AI effectively isn&apos;t better prompts—it&apos;s better <em>context</em>.
          An LLM is a function that transforms context into output:
        </p>

        <p className="text-muted-foreground">
          The fundamental equation: an LLM is a function that transforms context into output. Context is 
          everything: system prompt, user message, retrieved documents, code, conversation history. 
          Output quality is directly proportional to context quality.
        </p>

        <Callout variant="important">
          <p>
            Throughout this guide, we&apos;ll return to this mental model. When something
            isn&apos;t working, the question is always: &quot;What context is missing or misleading?&quot;
          </p>
        </Callout>

        {/* How to Use This Guide */}
        <h3 className="text-xl font-semibold mt-10 mb-4">How to Use This Guide</h3>

        <div className="space-y-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">🔄 Interactive Learning</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each section includes interactive visualizations. Play with them to build intuition—the
                concepts make more sense when you can see them in action.
              </p>
            </CardContent>
          </Card>


          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">📖 Read Sequentially (First Time)</h4>
              <p className="text-sm text-muted-foreground m-0">
                The parts build on each other. If you&apos;re new to AI engineering, start from
                Part 1 and work through in order. Later, use the sidebar to jump to specific topics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
