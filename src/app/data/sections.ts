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
  },
  {
    id: "prompt-caching",
    title: "Prompt Caching",
    part: "foundations",
    description: "How providers optimize the stateless function",
    subSections: [
      {
        id: "what-this-means",
        title: "What This Means for Context Engineering",
      },
      {
        id: "provider-comparison",
        title: "Provider Comparison",
      },
      {
        id: "implementing",
        title: "Implementing Cache-Friendly Prompts",
      },
      {
        id: "break-even",
        title: "Break-Even Analysis",
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
    title: "Context Engineering",
    part: "foundations",
    description: "Signal vs noise, pure context principles",
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

  // Part 4: Development Workflow
  {
    id: "test-driven-ai",
    title: "Test-Driven AI Dev",
    part: "workflow",
    description: "Harness first, validation, spec-driven prompts",
  },
  {
    id: "cursor-workflows",
    title: "Cursor Workflows",
    part: "workflow",
    description: "Rules, context, voice, efficient usage",
  },
  {
    id: "code-review-ai",
    title: "Code Review with AI",
    part: "workflow",
    description: "Short tasks, fast reviews, iteration patterns",
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
