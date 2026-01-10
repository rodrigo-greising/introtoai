/**
 * Section Registry
 * 
 * Centralized definition of all content sections.
 * This powers the sidebar navigation and scroll tracking.
 * 
 * To add a new section:
 * 1. Add an entry here with unique id
 * 2. Create the corresponding component in /components/sections/
 * 3. Import and add to the sectionComponents map
 */

export interface SubSection {
  id: string;
  title: string;
}

export interface Section {
  id: string;
  title: string;
  part: "foundations" | "retrieval" | "architecture" | "workflow" | "production";
  description?: string;
  subSections?: SubSection[];
}

export const sections: Section[] = [
  // Part 1: Foundations
  {
    id: "intro",
    title: "Introduction",
    part: "foundations",
    description: "What this guide is and who it's for",
  },
  {
    id: "mental-model",
    title: "The Mental Model",
    part: "foundations",
    description: "LLM as a stateless function, not a chat",
    subSections: [
      {
        id: "why-this-matters",
        title: "Why This Matters",
      },
      {
        id: "practical-implications",
        title: "Practical Implications",
      },
      {
        id: "visualizing-cost",
        title: "Visualizing the Cost Problem",
      },
      {
        id: "two-approaches",
        title: "The Two Approaches",
      },
    ],
  },
  {
    id: "llm-caching",
    title: "LLM Caching",
    part: "foundations",
    description: "How providers optimize the stateless function",
    subSections: [
      {
        id: "how-caching-works",
        title: "How LLM Caching Actually Works",
      },
      {
        id: "conversations-and-caching",
        title: "How Conversations Benefit from Caching",
      },
      {
        id: "what-this-means",
        title: "What This Means for Context Engineering",
      },
      {
        id: "caching-economics",
        title: "Caching Economics",
      },
      {
        id: "caching-cost-explorer",
        title: "Caching Cost Explorer",
      },
      {
        id: "where-caching-delivers",
        title: "Where Caching Delivers Most Value",
      },
      {
        id: "connection-to-mental-model",
        title: "Connection to the Mental Model",
      },
    ],
  },
  {
    id: "context-engineering",
    title: "Context Engineering Principles",
    part: "foundations",
    description: "The theoretical foundations of effective context",
    subSections: [
      {
        id: "signal-over-noise",
        title: "1. Signal Over Noise",
      },
      {
        id: "layered-architecture",
        title: "2. Layered Context Architecture",
      },
      {
        id: "explicit-over-implicit",
        title: "3. Explicit Over Implicit",
      },
      {
        id: "context-lifecycle",
        title: "4. Context Lifecycle Management",
      },
      {
        id: "delegation-orchestration",
        title: "5. Delegation & Orchestration",
      },
      {
        id: "separation-of-concerns",
        title: "6. Separation of Concerns",
      },
    ],
  },
  {
    id: "context-techniques",
    title: "Context Management Techniques",
    part: "foundations",
    description: "Practical patterns for managing context",
    subSections: [
      {
        id: "orchestration-patterns",
        title: "Orchestration Patterns",
      },
      {
        id: "system-architecture-patterns",
        title: "System Architecture Patterns",
      },
      {
        id: "techniques-connection",
        title: "Connection to Foundations",
      },
    ],
  },
  {
    id: "prompt-anatomy",
    title: "Prompt Anatomy",
    part: "foundations",
    description: "System prompts, user prompts, structured outputs",
  },

  // Part 2: Retrieval & Knowledge
  {
    id: "rag-fundamentals",
    title: "RAG Fundamentals",
    part: "retrieval",
    description: "What RAG is and when to use it",
    subSections: [
      {
        id: "what-is-rag",
        title: "What is RAG?",
      },
      {
        id: "why-rag",
        title: "Why RAG?",
      },
      {
        id: "rag-pipeline",
        title: "The RAG Pipeline",
      },
      {
        id: "rag-components",
        title: "Key Components",
      },
      {
        id: "rag-vs-alternatives",
        title: "RAG vs Alternatives",
      },
      {
        id: "when-to-use-rag",
        title: "When to Use RAG",
      },
    ],
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    part: "retrieval",
    description: "PGVector, Pinecone, similarity search",
  },
  {
    id: "chunking-strategies",
    title: "Chunking Strategies",
    part: "retrieval",
    description: "Document splitting and semantic chunking",
  },

  // Part 3: Task Architecture
  {
    id: "task-decomposition",
    title: "Task Decomposition",
    part: "architecture",
    description: "DAG orchestration and LLM compiler concepts",
  },
  {
    id: "parallelization",
    title: "Parallelization",
    part: "architecture",
    description: "Independent tasks and dependency graphs",
  },
  {
    id: "agents-orchestration",
    title: "Agents & Orchestration",
    part: "architecture",
    description: "Multi-agent patterns and tool use",
  },
  {
    id: "model-routing",
    title: "Model Routing",
    part: "architecture",
    description: "Intelligent routing with small models and proxy patterns",
    subSections: [
      { id: "what-is-model-routing", title: "What is Model Routing" },
      { id: "power-of-small-models", title: "The Power of Small Models" },
      { id: "routing-strategies", title: "Routing Strategies" },
      { id: "routing-tools", title: "Tools: ArchGW and Alternatives" },
      { id: "building-routing-proxies", title: "Building Routing Proxies" },
      { id: "routing-use-cases", title: "Practical Use Cases" },
    ],
  },
  {
    id: "skills-progressive-discovery",
    title: "Skills & Progressive Discovery",
    part: "architecture",
    description: "Modular capabilities, subagents, and context-aware delegation",
    subSections: [
      { id: "what-are-skills", title: "What are Agent Skills" },
      { id: "skill-anatomy", title: "Anatomy of a Skill" },
      { id: "progressive-disclosure", title: "Progressive Disclosure Pattern" },
      { id: "subagents-delegation", title: "Subagents and Delegation" },
      { id: "context-isolation", title: "Context Isolation Benefits" },
      { id: "building-skill-library", title: "Building a Skill Library" },
    ],
  },

  // Part 4: Development Workflow - Agentic Methodologies
  {
    id: "spec-driven-dev",
    title: "Spec-Driven Development",
    part: "workflow",
    description: "Define specifications before coding with AI assistance",
    subSections: [
      { id: "what-is-spec-driven", title: "What is Spec-Driven Development" },
      { id: "writing-specs-for-ai", title: "Writing Effective Specs for AI" },
      { id: "prd-to-implementation", title: "From PRD to Implementation" },
      { id: "spec-validation", title: "Spec Validation Patterns" },
    ],
  },
  {
    id: "test-driven-ai",
    title: "Test-Driven AI Development",
    part: "workflow",
    description: "Write tests first, let AI make them pass",
    subSections: [
      { id: "tdd-fundamentals", title: "TDD Fundamentals for AI Workflows" },
      { id: "tests-before-ai", title: "Writing Tests Before Tasking AI" },
      { id: "red-green-refactor-ai", title: "The Red-Green-Refactor Loop with AI" },
      { id: "e2e-test-strategies", title: "End-to-End Test Strategies" },
    ],
  },
  {
    id: "harnesses-evaluation",
    title: "Harnesses and Evaluation",
    part: "workflow",
    description: "Building frameworks to validate AI-generated code",
    subSections: [
      { id: "what-is-harness", title: "What is a Test Harness" },
      { id: "building-harnesses", title: "Building Evaluation Harnesses" },
      { id: "iterative-test-gen", title: "Iterative Test Generation" },
      { id: "benchmarking-quality", title: "Benchmarking AI Code Quality" },
    ],
  },
  {
    id: "cicd-iteration",
    title: "CI/CD Iteration Loops",
    part: "workflow",
    description: "Automated pipelines that iterate until tests pass",
    subSections: [
      { id: "iterate-until-pass", title: "The Iterate-Until-Pass Pattern" },
      { id: "failure-thresholds", title: "Failure Thresholds and Exit Conditions" },
      { id: "self-healing-pipelines", title: "Self-Healing Pipelines" },
      { id: "autonomous-fix-workflows", title: "Autonomous Fix Workflows" },
    ],
  },
  {
    id: "external-control",
    title: "External Control Patterns",
    part: "workflow",
    description: "Human and AI orchestration of coding pipelines",
    subSections: [
      { id: "human-controlled-pipelines", title: "Human-Controlled AI Pipelines" },
      { id: "ai-to-ai-orchestration", title: "AI-to-AI Orchestration" },
      { id: "outer-loop-pattern", title: "The Outer Loop Pattern" },
      { id: "safety-guardrails", title: "Safety and Guardrails" },
    ],
  },

  // Part 4 (continued): Development Workflow - Tooling Deep-Dives
  {
    id: "cursor-ide",
    title: "Cursor IDE",
    part: "workflow",
    description: "AI-native IDE features, rules, and workflows",
    subSections: [
      { id: "cursor-architecture", title: "Cursor Architecture and Features" },
      { id: "cursor-rules", title: "Rules and Context Management" },
      { id: "cursor-modes", title: "Composer vs Chat vs Agent Mode" },
      { id: "cursor-background-agent", title: "Background Agent (Web Version)" },
      { id: "cursor-voice", title: "Voice and Multi-modal Workflows" },
      { id: "cursor-patterns", title: "Effective Usage Patterns" },
    ],
  },
  {
    id: "graphite-stacked-prs",
    title: "Graphite and Stacked PRs",
    part: "workflow",
    description: "Managing dependent changes and AI code review",
    subSections: [
      { id: "what-are-stacked-prs", title: "What are Stacked PRs" },
      { id: "graphite-workflow", title: "The Graphite Workflow" },
      { id: "ai-code-review", title: "AI-Powered Code Review" },
      { id: "managing-dependent-changes", title: "Managing Dependent Changes" },
      { id: "stack-maintenance", title: "Rebasing and Stack Maintenance" },
    ],
  },
  {
    id: "linear-task-management",
    title: "Linear and Task Management",
    part: "workflow",
    description: "From customer feedback to automated task execution",
    subSections: [
      { id: "linear-source-of-truth", title: "Linear as the Source of Truth" },
      { id: "feedback-to-tasks", title: "From Customer Feedback to Tasks" },
      { id: "ai-pm-workflows", title: "AI-Assisted PM Workflows" },
      { id: "issue-to-pr", title: "Issue-to-PR Automation" },
      { id: "cycles-projects", title: "Cycles, Projects, and Roadmaps" },
    ],
  },
  {
    id: "background-agents",
    title: "Background Agents",
    part: "workflow",
    description: "Autonomous coding agents running in the cloud",
    subSections: [
      { id: "what-are-background-agents", title: "What are Background Coding Agents" },
      { id: "cursor-background", title: "Cursor Background Agent (Web Version)" },
      { id: "agent-sandboxing", title: "Sandboxing and Security" },
      { id: "agent-capabilities", title: "Agent Capabilities and Limitations" },
      { id: "background-vs-interactive", title: "When to Use Background vs Interactive" },
    ],
  },
  {
    id: "e2e-agentic-pipeline",
    title: "End-to-End Agentic Pipeline",
    part: "workflow",
    description: "Full stack from customer feedback to production",
    subSections: [
      { id: "full-stack-architecture", title: "The Full Stack Architecture" },
      { id: "customer-to-task", title: "Customer to Task (PM with AI)" },
      { id: "task-to-code", title: "Task to Code (Background Execution)" },
      { id: "code-to-review", title: "Code to Review (AI + Human)" },
      { id: "review-to-production", title: "Review to Production (Staging Flow)" },
      { id: "building-your-stack", title: "Building Your Own Stack" },
    ],
  },

  // Part 5: Production Concerns
  {
    id: "guardrails",
    title: "Guardrails",
    part: "production",
    description: "RBAC and design constraints",
  },
  {
    id: "cost-optimization",
    title: "Cost Optimization",
    part: "production",
    description: "Token budgeting, model selection, cost modeling",
  },
  {
    id: "reliability-patterns",
    title: "Reliability Patterns",
    part: "production",
    description: "Retries, fallbacks, structured outputs",
  },
];

// Helper to get section by ID
export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}

// Helper to get adjacent sections for navigation
export function getAdjacentSections(currentId: string): {
  prev: Section | null;
  next: Section | null;
} {
  const index = sections.findIndex((s) => s.id === currentId);
  return {
    prev: index > 0 ? sections[index - 1] : null,
    next: index < sections.length - 1 ? sections[index + 1] : null,
  };
}
