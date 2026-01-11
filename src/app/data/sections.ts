/**
 * Section Registry - V3
 *
 * Centralized definition of all content sections organized into 10 parts.
 * This powers the sidebar navigation and scroll tracking.
 *
 * Part 1: Foundations - LLM basics, mental model, embeddings, caching
 * Part 2: Context Engineering - Principles, layers, lifecycle
 * Part 3: Capabilities - Structured outputs, tools, agentic loop, workflows
 * Part 4: Knowledge & Retrieval - RAG, vectors, chunking
 * Part 5: Orchestration - Task decomposition, delegation, skills, routing
 * Part 6: Safety & Control - Guardrails, RBAC, human-in-loop
 * Part 7: Evaluation - Harnesses, TDD
 * Part 8: Coding Agents - Cursor-focused patterns
 * Part 9: Development Workflow - Spec-driven, CI/CD, tooling
 * Part 10: Production - Cost optimization, reliability
 */

export interface SubSection {
  id: string;
  title: string;
}

export interface Section {
  id: string;
  title: string;
  part:
    | "foundations"
    | "context"
    | "capabilities"
    | "retrieval"
    | "orchestration"
    | "safety"
    | "evaluation"
    | "coding-agents"
    | "workflow"
    | "production"
    | "capstone";
  description?: string;
  subSections?: SubSection[];
}

// Part metadata for sidebar grouping
export const partMeta = {
  foundations: { label: "Part 1: Foundations", order: 1 },
  context: { label: "Part 2: Context Engineering", order: 2 },
  capabilities: { label: "Part 3: Capabilities", order: 3 },
  retrieval: { label: "Part 4: Knowledge & Retrieval", order: 4 },
  orchestration: { label: "Part 5: Orchestration", order: 5 },
  safety: { label: "Part 6: Safety & Control", order: 6 },
  evaluation: { label: "Part 7: Evaluation", order: 7 },
  "coding-agents": { label: "Part 8: Coding Agents", order: 8 },
  workflow: { label: "Part 9: Development Workflow", order: 9 },
  production: { label: "Part 10: Production", order: 10 },
  capstone: { label: "Capstone Project", order: 11 },
} as const;

export const sections: Section[] = [
  // ==========================================================================
  // Part 1: Foundations (5 sections)
  // ==========================================================================
  {
    id: "intro",
    title: "Introduction",
    part: "foundations",
    description: "What this guide is and who it's for",
    subSections: [
      { id: "learning-roadmap", title: "Learning Roadmap" },
      { id: "prerequisites", title: "Prerequisites" },
    ],
  },
  {
    id: "how-llms-work",
    title: "How LLMs Work",
    part: "foundations",
    description: "Pre-training, RLHF, and how reasoning emerges",
    subSections: [
      { id: "pretraining", title: "Pre-training: Learning from Text" },
      { id: "rlhf", title: "RLHF: Learning to Follow Goals" },
      { id: "emergence", title: "Emergence of Reasoning" },
      { id: "implications", title: "Implications for Engineers" },
    ],
  },
  {
    id: "mental-model",
    title: "The Mental Model",
    part: "foundations",
    description: "LLM as a stateless function, not a chat",
    subSections: [
      { id: "stateless-function", title: "The Stateless Function" },
      { id: "why-this-matters", title: "Why This Matters" },
      { id: "practical-implications", title: "Practical Implications" },
      { id: "visualizing-cost", title: "Visualizing the Cost Problem" },
      { id: "two-approaches", title: "The Two Approaches" },
    ],
  },
  {
    id: "embeddings",
    title: "Understanding Embeddings",
    part: "foundations",
    description: "How text becomes vectors and why it matters",
    subSections: [
      { id: "what-are-embeddings", title: "What are Embeddings?" },
      { id: "similarity-search", title: "Similarity and Distance" },
      { id: "embedding-models", title: "Embedding Models" },
      { id: "practical-uses", title: "Practical Applications" },
    ],
  },
  {
    id: "llm-caching",
    title: "LLM Caching",
    part: "foundations",
    description: "How providers optimize the stateless function",
    subSections: [
      { id: "how-caching-works", title: "How LLM Caching Works" },
      { id: "conversations-and-caching", title: "Conversations and Caching" },
      { id: "caching-economics", title: "Caching Economics" },
      { id: "caching-cost-explorer", title: "Caching Cost Explorer" },
      { id: "cache-friendly-design", title: "Cache-Friendly Design" },
    ],
  },

  // ==========================================================================
  // Part 2: Context Engineering (3 sections)
  // ==========================================================================
  {
    id: "context-principles",
    title: "Context Principles",
    part: "context",
    description: "The theoretical foundations of effective context",
    subSections: [
      { id: "signal-over-noise", title: "Signal Over Noise" },
      { id: "explicit-over-implicit", title: "Explicit Over Implicit" },
      { id: "separation-of-concerns", title: "Separation of Concerns" },
      { id: "attention-patterns", title: "Attention Patterns" },
    ],
  },
  {
    id: "layered-context",
    title: "Layered Context Architecture",
    part: "context",
    description: "System prompts, layers, and optimal ordering",
    subSections: [
      { id: "layer-overview", title: "The Five Layers" },
      { id: "system-prompts", title: "System Prompts" },
      { id: "static-vs-dynamic", title: "Static vs Dynamic Content" },
      { id: "ordering-for-cache", title: "Ordering for Cache Efficiency" },
      { id: "layer-builder", title: "Interactive: Layer Builder" },
    ],
  },
  {
    id: "context-lifecycle",
    title: "Context Lifecycle",
    part: "context",
    description: "Summarization, compression, and context management",
    subSections: [
      { id: "lifecycle-overview", title: "The Context Lifecycle" },
      { id: "summarization", title: "Summarization Strategies" },
      { id: "sliding-window", title: "Sliding Window Patterns" },
      { id: "compression-techniques", title: "Compression Techniques" },
    ],
  },
  {
    id: "episodic-summarization",
    title: "Episodic Summarization & Retrospectives",
    part: "context",
    description: "Evolving context through learnings and error analysis",
    subSections: [
      { id: "episodic-overview", title: "What is Episodic Summarization?" },
      { id: "building-retrospectives", title: "Building Retrospectives" },
      { id: "learning-from-failures", title: "Learning from Failures" },
      { id: "embedding-similar-situations", title: "Embedding Similar Situations" },
      { id: "integrating-learnings", title: "Integrating Learnings into Context" },
    ],
  },

  // ==========================================================================
  // Part 3: Capabilities (6 sections)
  // ==========================================================================
  {
    id: "structured-outputs",
    title: "Structured Outputs",
    part: "capabilities",
    description: "JSON schemas, Zod, and deterministic parsing",
    subSections: [
      { id: "why-structured", title: "Why Structured Outputs?" },
      { id: "json-mode", title: "JSON Mode vs Schemas" },
      { id: "zod-integration", title: "Type-Safe with Zod" },
      { id: "schema-builder", title: "Interactive: Schema Builder" },
    ],
  },
  {
    id: "tools",
    title: "Tools and Function Calling",
    part: "capabilities",
    description: "Enabling LLMs to take actions in the world",
    subSections: [
      { id: "what-are-tools", title: "What are Tools?" },
      { id: "tool-definitions", title: "Tool Definitions" },
      { id: "tool-invocation", title: "How Invocation Works" },
      { id: "tool-playground", title: "Interactive: Tool Playground" },
      { id: "error-handling", title: "Error Handling" },
    ],
  },
  {
    id: "agentic-loop",
    title: "The Agentic Loop",
    part: "capabilities",
    description: "How agents iterate: observe, think, act, repeat",
    subSections: [
      { id: "loop-anatomy", title: "Anatomy of the Loop" },
      { id: "context-accumulation", title: "Context Accumulation" },
      { id: "stopping-conditions", title: "When to Stop" },
      { id: "loop-visualizer", title: "Interactive: Loop Visualizer" },
    ],
  },
  {
    id: "workflows-vs-agents",
    title: "Workflows vs Agents",
    part: "capabilities",
    description: "Deterministic paths vs autonomous decisions",
    subSections: [
      { id: "workflows-defined", title: "What are Workflows?" },
      { id: "agents-defined", title: "What are Agents?" },
      { id: "comparison", title: "When to Use Each" },
      { id: "hybrid-patterns", title: "Hybrid Patterns" },
    ],
  },
  {
    id: "data-structuring",
    title: "Structuring Data for AI",
    part: "capabilities",
    description: "Making data actionable through ontologies and schemas",
    subSections: [
      { id: "data-structure-problem", title: "The Data Structure Problem" },
      { id: "ontology-action-planes", title: "Ontology and Action Planes" },
      { id: "deterministic-api-layer", title: "Deterministic API Layer" },
      { id: "ai-validation", title: "AI Validation Against APIs" },
      { id: "data-driven-skills", title: "Data-Driven Skills" },
      { id: "agents-as-data", title: "Agents as Data Structures" },
      { id: "production-schema-patterns", title: "Production Schema Patterns" },
      { id: "dynamic-tool-generation", title: "Dynamic Tool Generation" },
    ],
  },
  {
    id: "streaming-voice",
    title: "Streaming & Voice Agents",
    part: "capabilities",
    description: "Real-time responses and voice agent architecture",
    subSections: [
      { id: "streaming-fundamentals", title: "Streaming Fundamentals" },
      { id: "live-call-flows", title: "Live Call Flows" },
      { id: "voice-agent-architecture", title: "Voice Agent Architecture" },
      { id: "realtime-patterns", title: "Real-time Patterns" },
      { id: "streaming-best-practices", title: "Streaming Best Practices" },
    ],
  },

  // ==========================================================================
  // Part 4: Knowledge & Retrieval (3 sections)
  // ==========================================================================
  {
    id: "rag-fundamentals",
    title: "RAG Fundamentals",
    part: "retrieval",
    description: "Retrieval-Augmented Generation explained",
    subSections: [
      { id: "what-is-rag", title: "What is RAG?" },
      { id: "why-rag", title: "Why RAG?" },
      { id: "rag-pipeline", title: "The RAG Pipeline" },
      { id: "rag-patterns", title: "RAG Patterns" },
      { id: "rag-vs-alternatives", title: "RAG vs Alternatives" },
    ],
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    part: "retrieval",
    description: "Storing and searching embeddings at scale",
    subSections: [
      { id: "vector-db-overview", title: "Vector Database Overview" },
      { id: "ann-search", title: "Approximate Nearest Neighbor" },
      { id: "database-options", title: "Database Options" },
      { id: "vector-navigator", title: "Interactive: Vector Navigator" },
    ],
  },
  {
    id: "chunking-strategies",
    title: "Chunking Strategies",
    part: "retrieval",
    description: "Document splitting for optimal retrieval",
    subSections: [
      { id: "why-chunking", title: "Why Chunking Matters" },
      { id: "chunking-methods", title: "Chunking Methods" },
      { id: "chunk-size", title: "Optimal Chunk Size" },
      { id: "chunker-demo", title: "Interactive: Document Chunker" },
    ],
  },

  // ==========================================================================
  // Part 5: Orchestration (6 sections)
  // ==========================================================================
  {
    id: "task-decomposition",
    title: "Task Decomposition",
    part: "orchestration",
    description: "Breaking complex tasks into manageable pieces",
    subSections: [
      { id: "decomposition-overview", title: "Why Decompose?" },
      { id: "dag-patterns", title: "DAG Patterns" },
      { id: "llm-compiler", title: "LLM Compiler Concepts" },
      { id: "dag-builder", title: "Interactive: DAG Builder" },
    ],
  },
  {
    id: "orchestration-patterns",
    title: "Orchestration Patterns",
    part: "orchestration",
    description: "MapReduce, fan-out, and coordination patterns",
    subSections: [
      { id: "pattern-overview", title: "Pattern Overview" },
      { id: "map-reduce", title: "MapReduce Pattern" },
      { id: "fan-out-gather", title: "Fan-Out/Gather" },
      { id: "orchestrator-worker", title: "Orchestrator-Worker" },
      { id: "pattern-visualizer", title: "Interactive: Pattern Library" },
    ],
  },
  {
    id: "parallelization",
    title: "Parallelization",
    part: "orchestration",
    description: "Running independent tasks concurrently",
    subSections: [
      { id: "parallel-vs-serial", title: "Parallel vs Serial" },
      { id: "dependency-analysis", title: "Dependency Analysis" },
      { id: "cost-time-tradeoffs", title: "Cost/Time Tradeoffs" },
      { id: "timeline-comparison", title: "Interactive: Timeline Comparison" },
    ],
  },
  {
    id: "delegation",
    title: "Delegation and Subagents",
    part: "orchestration",
    description: "Spawning focused workers with isolated context",
    subSections: [
      { id: "delegation-overview", title: "Why Delegate?" },
      { id: "subagent-pattern", title: "The Subagent Pattern" },
      { id: "context-isolation", title: "Context Isolation" },
      { id: "handoff-animation", title: "Interactive: Handoff Flow" },
    ],
  },
  {
    id: "skills",
    title: "Skills & Progressive Discovery",
    part: "orchestration",
    description: "Modular capabilities loaded on demand",
    subSections: [
      { id: "what-are-skills", title: "What are Skills?" },
      { id: "skill-anatomy", title: "Anatomy of a Skill" },
      { id: "progressive-loading", title: "Progressive Loading" },
      { id: "skill-browser", title: "Interactive: Skill Browser" },
    ],
  },
  {
    id: "model-routing",
    title: "Model Routing",
    part: "orchestration",
    description: "Intelligent routing with small models",
    subSections: [
      { id: "what-is-routing", title: "What is Model Routing?" },
      { id: "small-models", title: "Power of Small Models" },
      { id: "routing-strategies", title: "Routing Strategies" },
      { id: "router-simulator", title: "Interactive: Router Simulator" },
    ],
  },

  // ==========================================================================
  // Part 6: Safety & Control (3 sections)
  // ==========================================================================
  {
    id: "guardrails",
    title: "Guardrails and RBAC",
    part: "safety",
    description: "Permissions, constraints, and safety boundaries",
    subSections: [
      { id: "guardrails-overview", title: "Why Guardrails?" },
      { id: "rbac-patterns", title: "RBAC for AI Systems" },
      { id: "tool-permissions", title: "Tool Permissions" },
      { id: "permission-matrix", title: "Interactive: Permission Matrix" },
    ],
  },
  {
    id: "human-in-loop",
    title: "Human-in-the-Loop",
    part: "safety",
    description: "Approval flows and confidence thresholds",
    subSections: [
      { id: "hitl-overview", title: "When Humans Should Intervene" },
      { id: "approval-flows", title: "Approval Flow Patterns" },
      { id: "confidence-thresholds", title: "Confidence Thresholds" },
      { id: "approval-simulator", title: "Interactive: Approval Flow" },
    ],
  },
  {
    id: "external-control",
    title: "External Control Patterns",
    part: "safety",
    description: "Outer loops and safety boundaries",
    subSections: [
      { id: "outer-loop", title: "The Outer Loop Pattern" },
      { id: "ai-orchestration", title: "AI-to-AI Orchestration" },
      { id: "safety-boundaries", title: "Safety Boundaries" },
      { id: "control-visualizer", title: "Interactive: Control Flow" },
    ],
  },

  // ==========================================================================
  // Part 7: Evaluation (2 sections)
  // ==========================================================================
  {
    id: "harnesses",
    title: "Harnesses and Evaluation",
    part: "evaluation",
    description: "Building frameworks to validate AI outputs",
    subSections: [
      { id: "harness-overview", title: "What is a Test Harness?" },
      { id: "building-harnesses", title: "Building Harnesses" },
      { id: "eval-metrics", title: "Evaluation Metrics" },
      { id: "harness-builder", title: "Interactive: Harness Builder" },
    ],
  },
  {
    id: "tdd-ai",
    title: "Test-Driven AI Development",
    part: "evaluation",
    description: "Write tests first, let AI make them pass",
    subSections: [
      { id: "tdd-fundamentals", title: "TDD for AI Workflows" },
      { id: "tests-before-ai", title: "Tests Before AI" },
      { id: "red-green-refactor", title: "Red-Green-Refactor with AI" },
      { id: "tdd-animation", title: "Interactive: TDD Cycle" },
    ],
  },
  {
    id: "observability",
    title: "Observability & Monitoring",
    part: "evaluation",
    description: "Tracking, labeling, and learning from agent behavior",
    subSections: [
      { id: "why-observability", title: "Why Observability Matters" },
      { id: "labeling-langfuse", title: "Labeling with Langfuse" },
      { id: "failure-pattern-analysis", title: "Failure Pattern Analysis" },
      { id: "prompt-iteration", title: "Prompt Iteration from Data" },
      { id: "automated-learning", title: "Automated Learning Systems" },
    ],
  },

  // ==========================================================================
  // Part 8: Coding Agents (6 sections)
  // ==========================================================================
  {
    id: "coding-agents-intro",
    title: "What are Coding Agents",
    part: "coding-agents",
    description: "Understanding AI-powered code assistants",
    subSections: [
      { id: "agent-landscape", title: "The Agent Landscape" },
      { id: "capabilities-overview", title: "Capabilities Overview" },
      { id: "transferable-principles", title: "Transferable Principles" },
    ],
  },
  {
    id: "cursor-architecture",
    title: "Cursor Architecture",
    part: "coding-agents",
    description: "How Cursor works under the hood",
    subSections: [
      { id: "architecture-overview", title: "Architecture Overview" },
      { id: "context-assembly", title: "Context Assembly" },
      { id: "model-integration", title: "Model Integration" },
      { id: "architecture-diagram", title: "Interactive: Architecture" },
    ],
  },
  {
    id: "cursor-rules",
    title: "Rules and Context",
    part: "coding-agents",
    description: "Managing context with rules files",
    subSections: [
      { id: "rules-overview", title: "Understanding Rules" },
      { id: "rule-types", title: "Rule Types" },
      { id: "rules-best-practices", title: "Best Practices" },
      { id: "rules-editor", title: "Interactive: Rules Editor" },
    ],
  },
  {
    id: "cursor-modes",
    title: "Cursor Modes",
    part: "coding-agents",
    description: "Composer vs Chat vs Agent mode",
    subSections: [
      { id: "mode-overview", title: "Mode Overview" },
      { id: "composer-mode", title: "Composer Mode" },
      { id: "chat-mode", title: "Chat Mode" },
      { id: "agent-mode", title: "Agent Mode" },
      { id: "mode-matcher", title: "Interactive: Mode Matcher" },
    ],
  },
  {
    id: "cursor-patterns",
    title: "Effective Patterns",
    part: "coding-agents",
    description: "Patterns for getting the most from Cursor",
    subSections: [
      { id: "pattern-library", title: "Pattern Library" },
      { id: "context-strategies", title: "Context Strategies" },
      { id: "iteration-patterns", title: "Iteration Patterns" },
      { id: "patterns-demo", title: "Interactive: Pattern Explorer" },
    ],
  },
  {
    id: "background-agents",
    title: "Background Agents",
    part: "coding-agents",
    description: "Autonomous agents running in the cloud",
    subSections: [
      { id: "background-overview", title: "What are Background Agents?" },
      { id: "sandboxing", title: "Sandboxing and Security" },
      { id: "capabilities-limits", title: "Capabilities and Limits" },
      { id: "task-monitor", title: "Interactive: Task Monitor" },
    ],
  },

  // ==========================================================================
  // Part 9: Development Workflow (5 sections)
  // ==========================================================================
  {
    id: "spec-driven",
    title: "Spec-Driven Development",
    part: "workflow",
    description: "Define specifications before AI implementation",
    subSections: [
      { id: "spec-overview", title: "What is Spec-Driven Dev?" },
      { id: "writing-specs", title: "Writing Effective Specs" },
      { id: "prd-to-code", title: "PRD to Implementation" },
      { id: "spec-flow", title: "Interactive: Spec Flow" },
    ],
  },
  {
    id: "cicd-iteration",
    title: "CI/CD Iteration",
    part: "workflow",
    description: "Automated pipelines that iterate until tests pass",
    subSections: [
      { id: "iterate-pattern", title: "The Iterate-Until-Pass Pattern" },
      { id: "failure-handling", title: "Failure Handling" },
      { id: "self-healing", title: "Self-Healing Pipelines" },
      { id: "pipeline-viz", title: "Interactive: Pipeline Visualizer" },
    ],
  },
  {
    id: "graphite",
    title: "Graphite and Stacked PRs",
    part: "workflow",
    description: "Managing dependent changes efficiently",
    subSections: [
      { id: "stacked-prs", title: "What are Stacked PRs?" },
      { id: "graphite-workflow", title: "The Graphite Workflow" },
      { id: "ai-review", title: "AI Code Review" },
      { id: "stack-viz", title: "Interactive: Stack Visualizer" },
    ],
  },
  {
    id: "linear",
    title: "Linear and Task Management",
    part: "workflow",
    description: "From customer feedback to automated execution",
    subSections: [
      { id: "linear-overview", title: "Linear as Source of Truth" },
      { id: "feedback-to-tasks", title: "Feedback to Tasks" },
      { id: "issue-to-pr", title: "Issue to PR Automation" },
      { id: "flow-diagram", title: "Interactive: Issue Flow" },
    ],
  },
  {
    id: "e2e-pipeline",
    title: "E2E Agentic Pipeline",
    part: "workflow",
    description: "Full stack from feedback to production",
    subSections: [
      { id: "full-stack", title: "The Full Stack" },
      { id: "customer-to-task", title: "Customer to Task" },
      { id: "task-to-production", title: "Task to Production" },
      { id: "pipeline-demo", title: "Interactive: Pipeline Demo" },
    ],
  },

  // ==========================================================================
  // Part 10: Production (2 sections)
  // ==========================================================================
  {
    id: "cost-optimization",
    title: "Cost Optimization",
    part: "production",
    description: "Token budgeting, model selection, and cost control",
    subSections: [
      { id: "cost-overview", title: "Understanding Costs" },
      { id: "token-budgeting", title: "Token Budgeting" },
      { id: "model-selection", title: "Model Selection" },
      { id: "budget-calculator", title: "Interactive: Budget Calculator" },
    ],
  },
  {
    id: "reliability",
    title: "Reliability Patterns",
    part: "production",
    description: "Retries, fallbacks, and error handling",
    subSections: [
      { id: "reliability-overview", title: "Building Reliable Systems" },
      { id: "retry-patterns", title: "Retry Patterns" },
      { id: "fallback-strategies", title: "Fallback Strategies" },
      { id: "retry-simulator", title: "Interactive: Retry Simulator" },
    ],
  },

  // ==========================================================================
  // Capstone Project (1 section)
  // ==========================================================================
  {
    id: "capstone",
    title: "Virtual Tabletop Assistant",
    part: "capstone",
    description: "Architectural deep-dive combining all guide concepts",
    subSections: [
      { id: "vtt-overview", title: "System Overview" },
      { id: "multi-system-support", title: "Multi-System Support" },
      { id: "pdf-parsing-strategy", title: "PDF Parsing Strategy" },
      { id: "dynamic-schema-generation", title: "Dynamic Schema Generation" },
      { id: "intake-agent-pipeline", title: "Intake Agent Pipeline" },
      { id: "agents-building-agents", title: "Agents Building Agents" },
      { id: "player-assistant-demo", title: "Player Assistant in Action" },
      { id: "permission-system", title: "Permission System Design" },
      { id: "query-architecture", title: "Query Architecture" },
      { id: "cost-architecture", title: "Cost Architecture" },
      { id: "concepts-applied", title: "Concepts Applied" },
    ],
  },
];

// =============================================================================
// Helpers
// =============================================================================

/** Get section by ID */
export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}

/** Get adjacent sections for navigation */
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

/** Get all sections for a given part */
export function getSectionsByPart(part: Section["part"]): Section[] {
  return sections.filter((s) => s.part === part);
}

/** Get part label for display */
export function getPartLabel(part: Section["part"]): string {
  return partMeta[part].label;
}

/** Get all unique parts in order */
export function getAllParts(): Array<{
  key: Section["part"];
  label: string;
  order: number;
}> {
  return Object.entries(partMeta)
    .map(([key, value]) => ({
      key: key as Section["part"],
      label: value.label,
      order: value.order,
    }))
    .sort((a, b) => a.order - b.order);
}
