/**
 * Orchestration Scenario Data
 *
 * Pre-defined scenarios demonstrating orchestration patterns
 * like MapReduce, parallel delegation, and worker coordination.
 */

import type {
  Scenario,
  DAGTask,
  ChatMessage,
  WorkerMessage,
  ContextDetail,
} from "../types";

// =============================================================================
// Helper Functions
// =============================================================================

function createContext(items: Array<{ label: string; value: string; tokens?: number; type: ContextDetail["type"] }>): ContextDetail[] {
  return items.map((item) => ({
    label: item.label,
    value: item.value,
    tokens: item.tokens,
    type: item.type,
  }));
}

function createChatMessage(
  id: string,
  role: ChatMessage["role"],
  content: string,
  metadata?: ChatMessage["metadata"]
): ChatMessage {
  return { id, role, content, metadata };
}

function createWorkerMessage(
  id: string,
  type: WorkerMessage["type"],
  content: string,
  tokens?: number
): WorkerMessage {
  return { id, type, content, tokens };
}

// =============================================================================
// Scenario: Search MapReduce
// =============================================================================

const searchMapReduceTasks: DAGTask[] = [
  {
    id: "query",
    name: "Parse Query",
    shortLabel: "Query",
    description: "Parse and expand the user's search query",
    dependencies: [],
    duration: 400,
    column: 0,
    row: 2,
    context: createContext([
      { label: "System", value: "Query parser: Extract intent, entities, generate search variants", type: "system", tokens: 45 },
      { label: "Input", value: "Raw query: \"How do I optimize React renders?\"", type: "input", tokens: 15 },
      { label: "Output", value: "Structured query with terms, filters, synonyms", type: "output", tokens: 25 },
    ]),
  },
  {
    id: "search",
    name: "Execute Search",
    shortLabel: "Search",
    description: "Run search against the index, retrieve top results",
    dependencies: ["query"],
    duration: 800,
    column: 1,
    row: 2,
    context: createContext([
      { label: "System", value: "Search executor—pure retrieval, no LLM", type: "system", tokens: 20 },
      { label: "Input", value: "Query terms: [\"react\", \"optimize\", \"render\"]", type: "input", tokens: 18 },
      { label: "State", value: "Vector DB + BM25 index access", type: "state", tokens: 12 },
      { label: "Output", value: "Top 5 document chunks with scores", type: "output", tokens: 15 },
    ]),
  },
  {
    id: "analyze-1",
    name: "Analyze Doc 1",
    shortLabel: "Doc 1",
    description: "Extract key information from document 1",
    dependencies: ["search"],
    duration: 1200,
    column: 2,
    row: 0,
    context: createContext([
      { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
      { label: "Input", value: "Doc: \"React.memo prevents re-renders...\" (~800 tokens)", type: "input", tokens: 800 },
      { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
      { label: "Output", value: "{ claims: [...], relevance: 0.92 }", type: "output", tokens: 45 },
    ]),
    internalChat: [
      createWorkerMessage("a1-1", "task_start", "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: React.memo Deep Dive (800 tokens)", 25),
      createWorkerMessage("a1-2", "thought", "This document discusses React.memo, which is directly relevant to preventing unnecessary re-renders. I need to extract the key claims and assess how well they answer the user's question.", 40),
      createWorkerMessage("a1-3", "tool_call", "extract_claims({\n  text: \"React.memo is a higher-order component that memoizes the rendered output. When a component is wrapped in React.memo, React will skip rendering if props haven't changed. This is useful for expensive components that render the same result given the same props...\",\n  max_claims: 5\n})", 85),
      createWorkerMessage("a1-4", "tool_result", "Extracted claims:\n1. \"React.memo memoizes component output to prevent re-renders\"\n2. \"Props comparison determines if re-render is needed\"\n3. \"Default comparison is shallow equality\"\n4. \"Custom comparison function can be provided as second argument\"\n5. \"Most effective for pure functional components\"", 95),
      createWorkerMessage("a1-5", "thought", "Good claims extracted. Now I need to score relevance. The document directly addresses the query about optimizing renders - React.memo is a primary technique for this.", 35),
      createWorkerMessage("a1-6", "tool_call", "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"React.memo memoizes component output\", \"prevents re-renders\", \"props comparison\"],\n  document_type: \"technical_guide\"\n})", 45),
      createWorkerMessage("a1-7", "tool_result", "Relevance Score: 0.92\n\nBreakdown:\n- Query match: 0.95 (directly addresses render optimization)\n- Actionability: 0.90 (provides concrete technique)\n- Completeness: 0.88 (covers basics, lacks advanced patterns)\n- Source quality: 0.94 (official React documentation)", 85),
      createWorkerMessage("a1-8", "output", "Analysis complete for Doc 1:\n• 3 actionable claims about React.memo\n• Relevance: 0.92 (highly relevant)\n• Key insight: Memoization prevents re-renders when props unchanged", 45),
    ],
  },
  {
    id: "analyze-2",
    name: "Analyze Doc 2",
    shortLabel: "Doc 2",
    description: "Extract key information from document 2",
    dependencies: ["search"],
    duration: 1000,
    column: 2,
    row: 1,
    context: createContext([
      { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
      { label: "Input", value: "Doc: \"useMemo and useCallback hooks...\" (~650 tokens)", type: "input", tokens: 650 },
      { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
      { label: "Output", value: "{ claims: [...], relevance: 0.87 }", type: "output", tokens: 42 },
    ]),
    internalChat: [
      createWorkerMessage("a2-1", "task_start", "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Hooks Optimization Guide (650 tokens)", 22),
      createWorkerMessage("a2-2", "thought", "This document covers useMemo and useCallback hooks. These are important for memoizing values and callbacks to prevent unnecessary re-renders caused by reference changes.", 38),
      createWorkerMessage("a2-3", "tool_call", "extract_claims({\n  text: \"useMemo returns a memoized value that only recomputes when dependencies change. useCallback returns a memoized callback function. Both help prevent unnecessary child re-renders by maintaining referential equality...\",\n  max_claims: 5\n})", 78),
      createWorkerMessage("a2-4", "tool_result", "Extracted claims:\n1. \"useMemo memoizes computed values between renders\"\n2. \"useCallback memoizes callback functions\"\n3. \"Both maintain referential equality for children\"\n4. \"Dependency array controls when to recompute\"\n5. \"Overuse can hurt performance (memoization has cost)\"", 88),
      createWorkerMessage("a2-5", "tool_call", "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"useMemo memoizes values\", \"useCallback memoizes callbacks\", \"prevent unnecessary re-renders\"],\n  document_type: \"tutorial\"\n})", 42),
      createWorkerMessage("a2-6", "tool_result", "Relevance Score: 0.87\n\nBreakdown:\n- Query match: 0.88 (addresses render optimization)\n- Actionability: 0.92 (concrete hook usage patterns)\n- Completeness: 0.82 (good basics, missing edge cases)\n- Source quality: 0.85 (community tutorial)", 78),
      createWorkerMessage("a2-7", "output", "Analysis complete for Doc 2:\n• 4 claims about useMemo/useCallback patterns\n• Relevance: 0.87 (highly relevant)\n• Key insight: Hooks maintain referential equality to prevent child re-renders", 42),
    ],
  },
  {
    id: "analyze-3",
    name: "Analyze Doc 3",
    shortLabel: "Doc 3",
    description: "Extract key information from document 3",
    dependencies: ["search"],
    duration: 1400,
    column: 2,
    row: 2,
    context: createContext([
      { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
      { label: "Input", value: "Doc: \"Virtual DOM diffing...\" (~920 tokens)", type: "input", tokens: 920 },
      { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
      { label: "Output", value: "{ claims: [...], relevance: 0.78 }", type: "output", tokens: 38 },
    ]),
    internalChat: [
      createWorkerMessage("a3-1", "task_start", "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Virtual DOM Deep Dive (920 tokens)", 24),
      createWorkerMessage("a3-2", "thought", "This document explains Virtual DOM and diffing algorithm internals. While foundational for understanding React, it may be more conceptual than actionable for optimization.", 42),
      createWorkerMessage("a3-3", "tool_call", "extract_claims({\n  text: \"React's reconciliation algorithm compares the new Virtual DOM tree with the previous one. It uses heuristics like same element type = update, different type = unmount/remount. Keys help identify which items changed in lists...\",\n  max_claims: 5\n})", 82),
      createWorkerMessage("a3-4", "tool_result", "Extracted claims:\n1. \"Reconciliation compares Virtual DOM trees\"\n2. \"Same element type triggers update, different triggers remount\"\n3. \"Keys optimize list diffing significantly\"\n4. \"Fiber architecture enables incremental rendering\"\n5. \"Diffing is O(n) due to heuristics, not O(n³)\"", 92),
      createWorkerMessage("a3-5", "thought", "The key claim about list keys is actionable. The rest is more background knowledge. Let me score this appropriately - useful context but not direct optimization advice.", 38),
      createWorkerMessage("a3-6", "tool_call", "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"Keys optimize list diffing\", \"reconciliation heuristics\", \"Fiber incremental rendering\"],\n  document_type: \"deep_dive\"\n})", 45),
      createWorkerMessage("a3-7", "tool_result", "Relevance Score: 0.78\n\nBreakdown:\n- Query match: 0.72 (conceptual, not directly actionable)\n- Actionability: 0.68 (only keys tip is directly useful)\n- Completeness: 0.92 (comprehensive coverage)\n- Source quality: 0.90 (official React internals)", 82),
      createWorkerMessage("a3-8", "output", "Analysis complete for Doc 3:\n• 5 claims about Virtual DOM internals\n• Relevance: 0.78 (moderately relevant)\n• Key insight: Keys critical for list performance; diffing already optimized", 38),
    ],
  },
  {
    id: "analyze-4",
    name: "Analyze Doc 4",
    shortLabel: "Doc 4",
    description: "Extract key information from document 4",
    dependencies: ["search"],
    duration: 900,
    column: 2,
    row: 3,
    context: createContext([
      { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
      { label: "Input", value: "Doc: \"React DevTools Profiler...\" (~450 tokens)", type: "input", tokens: 450 },
      { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
      { label: "Output", value: "{ claims: [...], relevance: 0.82 }", type: "output", tokens: 40 },
    ]),
    internalChat: [
      createWorkerMessage("a4-1", "task_start", "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: React DevTools Profiler (450 tokens)", 22),
      createWorkerMessage("a4-2", "thought", "DevTools Profiler is essential for identifying render performance issues. This is about measurement and diagnosis rather than specific optimization techniques.", 35),
      createWorkerMessage("a4-3", "tool_call", "extract_claims({\n  text: \"The React DevTools Profiler records render timings and identifies why components re-rendered. Flamegraph shows component hierarchy and render durations. 'Why did this render?' feature shows prop/state/hook changes...\",\n  max_claims: 4\n})", 72),
      createWorkerMessage("a4-4", "tool_result", "Extracted claims:\n1. \"Profiler records render timings per component\"\n2. \"Flamegraph visualizes component hierarchy and durations\"\n3. \"'Why did this render?' identifies change triggers\"\n4. \"Highlight updates setting shows renders in real-time\"", 75),
      createWorkerMessage("a4-5", "tool_call", "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"Profiler records timings\", \"identify why components re-rendered\", \"highlight updates\"],\n  document_type: \"tooling_guide\"\n})", 42),
      createWorkerMessage("a4-6", "tool_result", "Relevance Score: 0.82\n\nBreakdown:\n- Query match: 0.85 (directly about render analysis)\n- Actionability: 0.88 (clear steps to diagnose issues)\n- Completeness: 0.75 (diagnosis only, not fixes)\n- Source quality: 0.82 (official tooling docs)", 72),
      createWorkerMessage("a4-7", "output", "Analysis complete for Doc 4:\n• 2 key claims about profiling techniques\n• Relevance: 0.82 (relevant for diagnosis)\n• Key insight: Use Profiler to identify bottlenecks before optimizing", 40),
    ],
  },
  {
    id: "analyze-5",
    name: "Analyze Doc 5",
    shortLabel: "Doc 5",
    description: "Extract key information from document 5",
    dependencies: ["search"],
    duration: 1100,
    column: 2,
    row: 4,
    context: createContext([
      { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
      { label: "Input", value: "Doc: \"Code splitting with React.lazy...\" (~580 tokens)", type: "input", tokens: 580 },
      { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
      { label: "Output", value: "{ claims: [...], relevance: 0.71 }", type: "output", tokens: 36 },
    ]),
    internalChat: [
      createWorkerMessage("a5-1", "task_start", "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Code Splitting Patterns (580 tokens)", 22),
      createWorkerMessage("a5-2", "thought", "Code splitting with React.lazy is about initial load performance, not render optimization per se. It reduces bundle size and defers loading, but doesn't prevent re-renders.", 42),
      createWorkerMessage("a5-3", "tool_call", "extract_claims({\n  text: \"React.lazy enables dynamic imports for code splitting. Components are loaded on demand. Suspense provides loading fallbacks. Route-based splitting is the most common pattern. Preloading can improve perceived performance...\",\n  max_claims: 4\n})", 68),
      createWorkerMessage("a5-4", "tool_result", "Extracted claims:\n1. \"React.lazy enables component-level code splitting\"\n2. \"Suspense handles loading states for lazy components\"\n3. \"Route-based splitting is most effective pattern\"\n4. \"Preloading can be triggered on hover/focus\"", 72),
      createWorkerMessage("a5-5", "thought", "This is tangentially related - it's about performance but not specifically render optimization. The user asked about render optimization, and this is more about load-time optimization.", 38),
      createWorkerMessage("a5-6", "tool_call", "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"code splitting\", \"dynamic imports\", \"Suspense loading\"],\n  document_type: \"tutorial\"\n})", 38),
      createWorkerMessage("a5-7", "tool_result", "Relevance Score: 0.71\n\nBreakdown:\n- Query match: 0.62 (optimization but not render-specific)\n- Actionability: 0.85 (clear implementation pattern)\n- Completeness: 0.78 (good coverage of code splitting)\n- Source quality: 0.80 (community tutorial)", 75),
      createWorkerMessage("a5-8", "output", "Analysis complete for Doc 5:\n• 2 claims about code splitting patterns\n• Relevance: 0.71 (tangentially relevant)\n• Key insight: Helps initial load, not render performance", 36),
    ],
  },
  {
    id: "synthesize",
    name: "Synthesize Answer",
    shortLabel: "Synthesize",
    description: "Combine analyzed results into coherent response",
    dependencies: ["analyze-1", "analyze-2", "analyze-3", "analyze-4", "analyze-5"],
    duration: 1500,
    column: 3,
    row: 2,
    context: createContext([
      { label: "System", value: "Synthesizer: Combine analyses with citations", type: "system", tokens: 40 },
      { label: "Input", value: "5 analysis summaries (~200 tokens total)", type: "input", tokens: 200 },
      { label: "State", value: "Original query, citation format requirements", type: "state", tokens: 25 },
      { label: "Output", value: "Final answer: \"To optimize React renders: 1) Use React.memo [1]...\"", type: "output", tokens: 350 },
    ]),
  },
];

const searchMapReduceMessages: ChatMessage[] = [
  createChatMessage("user-query", "user", "How do I optimize React renders?", { tokens: 8 }),
  createChatMessage("start-parse", "orchestrator", "Parsing query to extract search terms...", { triggeredAtStart: "query", tokens: 15 }),
  createChatMessage("query-done", "tool_result", "→ Extracted terms: [\"react\", \"optimize\", \"render\", \"performance\"]\n→ Synonyms: [\"memoization\", \"re-render\", \"virtual DOM\"]", { triggeredBy: "query", tokens: 35 }),
  createChatMessage("start-search", "orchestrator", "Executing search against document index...", { triggeredAtStart: "search" }),
  createChatMessage("search-done", "tool_result", "→ Retrieved 5 documents (scores: 0.92, 0.87, 0.82, 0.78, 0.71)\n→ Dispatching to parallel analyzers", { triggeredBy: "search", tokens: 45 }),
  createChatMessage("fan-out", "orchestrator", "Fan-out: Spawning 5 parallel document analyzers\n\n📄 Analyzer 1: React.memo article\n📄 Analyzer 2: Hooks optimization guide\n📄 Analyzer 3: Virtual DOM deep dive\n📄 Analyzer 4: DevTools profiling\n📄 Analyzer 5: Code splitting patterns", { triggeredAtStart: "analyze-1", tokens: 60 }),
  createChatMessage("analyze-1-done", "worker", "✓ Doc 1 analyzed: 3 claims about React.memo, relevance 0.92", { sender: "Analyzer 1", triggeredBy: "analyze-1" }),
  createChatMessage("analyze-2-done", "worker", "✓ Doc 2 analyzed: 4 claims about useMemo/useCallback, relevance 0.87", { sender: "Analyzer 2", triggeredBy: "analyze-2" }),
  createChatMessage("analyze-4-done", "worker", "✓ Doc 4 analyzed: 2 claims about profiling, relevance 0.82", { sender: "Analyzer 4", triggeredBy: "analyze-4" }),
  createChatMessage("analyze-3-done", "worker", "✓ Doc 3 analyzed: 5 claims about Virtual DOM, relevance 0.78", { sender: "Analyzer 3", triggeredBy: "analyze-3" }),
  createChatMessage("analyze-5-done", "worker", "✓ Doc 5 analyzed: 2 claims about code splitting, relevance 0.71", { sender: "Analyzer 5", triggeredBy: "analyze-5" }),
  createChatMessage("reduce-start", "orchestrator", "All analyzers complete. Reducing to synthesized answer...\n\nNote: Synthesizer receives ~200 tokens of summaries, NOT the original 3,400 tokens of documents.", { triggeredAtStart: "synthesize", tokens: 200 }),
  createChatMessage("final-answer", "complete", "To optimize React renders:\n\n1. **Use React.memo** for expensive pure components [1]\n2. **Leverage useMemo/useCallback** to stabilize references [2]\n3. **Profile with DevTools** to identify bottlenecks [4]\n4. **Code split with React.lazy** for large bundles [5]\n\nThe Virtual DOM diffing is already optimized—focus on preventing unnecessary re-renders at the component level [3].", { triggeredBy: "synthesize", tokens: 150 }),
];

export const searchMapReduceScenario: Scenario = {
  id: "search-mapreduce",
  name: "Search MapReduce",
  description: "Fan-out search results to parallel analyzers, then reduce to synthesized answer",
  patternType: "static",
  patternDescription: "Static DAG—the graph shape is fixed at design time. Every query follows: parse → search → parallel analysis → synthesize.",
  colorTheme: "violet",
  tasks: searchMapReduceTasks,
  chatMessages: searchMapReduceMessages,
  insight: "Fan-out/reduce parallelizes independent work, then combines results. The synthesizer receives ~200 tokens of summaries instead of ~3,400 tokens of raw documents—an 17x context reduction while preserving all relevant information.",
};

// =============================================================================
// Scenario: Orchestrator-Worker Coordination
// =============================================================================

const coordinationTasks: DAGTask[] = [
  {
    id: "receive",
    name: "Receive Task",
    shortLabel: "Receive",
    description: "Orchestrator receives and analyzes user request",
    dependencies: [],
    duration: 300,
    column: 0,
    row: 1.5,
    context: createContext([
      { label: "System", value: "Orchestrator: Decompose tasks, delegate to workers, synthesize", type: "system", tokens: 120 },
      { label: "Input", value: "User: \"Add dark mode support to the dashboard\"", type: "input", tokens: 12 },
    ]),
  },
  {
    id: "plan",
    name: "Plan Delegation",
    shortLabel: "Plan",
    description: "Decompose into parallel subtasks",
    dependencies: ["receive"],
    duration: 500,
    column: 1,
    row: 1.5,
    context: createContext([
      { label: "System", value: "Decompose into independent subtasks for parallel execution", type: "system", tokens: 45 },
      { label: "Output", value: "3 tasks: Schema types, API endpoints, UI component", type: "output", tokens: 35 },
    ]),
  },
  {
    id: "schema-worker",
    name: "Schema Worker",
    shortLabel: "Schema",
    description: "Define TypeScript interfaces for theme",
    dependencies: ["plan"],
    duration: 1800,
    column: 2,
    row: 0,
    context: createContext([
      { label: "System", value: "TypeScript schema specialist. Define type-safe interfaces.", type: "system", tokens: 85 },
      { label: "Task", value: "Create theme config interfaces", type: "input", tokens: 25 },
      { label: "Tools", value: "grep_codebase, read_file, write_file", type: "tools", tokens: 15 },
      { label: "Output", value: "ThemeConfig, ColorTokens, ThemePreference types", type: "output", tokens: 220 },
    ]),
    internalChat: [
      createWorkerMessage("s1", "task_start", "Task: Create TypeScript interfaces for dark mode theme configuration including color tokens, component overrides, and persistence settings.", 45),
      createWorkerMessage("s2", "thought", "I need to understand the existing color and theme patterns in this codebase before defining new interfaces. Let me search for existing type definitions.", 35),
      createWorkerMessage("s3", "tool_call", "grep_codebase({ pattern: \"theme|ColorToken|color\", glob: \"**/*.ts\" })", 25),
      createWorkerMessage("s4", "tool_result", "Found 12 matches in 4 files:\n• src/styles/colors.ts (4 matches)\n• src/hooks/useTheme.ts (3 matches)\n• src/types/common.ts (2 matches)\n• src/components/Button.tsx (3 matches)", 85),
      createWorkerMessage("s5", "thought", "Good, there are existing color definitions. Let me examine the colors.ts file to understand the current token structure.", 28),
      createWorkerMessage("s6", "tool_call", "read_file(\"src/styles/colors.ts\")", 12),
      createWorkerMessage("s7", "tool_result", "export const colors = {\n  primary: '#3b82f6',\n  secondary: '#64748b',\n  success: '#10b981',\n  error: '#ef4444',\n  background: '#ffffff',\n  surface: '#f8fafc',\n  text: '#0f172a',\n  textMuted: '#64748b',\n};\n\nexport type ColorKey = keyof typeof colors;", 180),
      createWorkerMessage("s8", "thought", "I see they have a simple color object. For dark mode, I'll need to extend this with a theme-aware structure. Let me also check useTheme for any existing patterns.", 42),
      createWorkerMessage("s9", "tool_call", "read_file(\"src/hooks/useTheme.ts\")", 12),
      createWorkerMessage("s10", "tool_result", "import { useState, useEffect } from 'react';\n\nexport function useTheme() {\n  const [isDark, setIsDark] = useState(false);\n  \n  useEffect(() => {\n    // Basic implementation - needs enhancement\n    const stored = localStorage.getItem('theme');\n    setIsDark(stored === 'dark');\n  }, []);\n  \n  return { isDark, setIsDark };\n}", 145),
      createWorkerMessage("s11", "thought", "The existing hook is basic. I'll create comprehensive interfaces that support:\n1. ThemeConfig - the full theme configuration\n2. ColorTokens - semantic color tokens for light/dark\n3. ThemePreference - user preference storage format\n\nThis follows the pattern in common.ts and will integrate cleanly.", 68),
      createWorkerMessage("s12", "tool_call", "write_file(\"src/types/theme.ts\", `// Theme configuration types...`)", 420),
      createWorkerMessage("s13", "tool_result", "✓ File written successfully: src/types/theme.ts (98 lines)", 18),
      createWorkerMessage("s14", "output", "Created 3 interfaces in src/types/theme.ts:\n• ThemeConfig - Full theme configuration with overrides\n• ColorTokens - Semantic color token definitions\n• ThemePreference - User preference persistence format\n\nAlso included lightTheme and darkTheme default configurations.", 55),
    ],
  },
  {
    id: "api-worker",
    name: "API Worker",
    shortLabel: "API",
    description: "Create theme preference endpoints",
    dependencies: ["plan"],
    duration: 2000,
    column: 2,
    row: 1.5,
    context: createContext([
      { label: "System", value: "Backend API specialist. Implement RESTful endpoints.", type: "system", tokens: 90 },
      { label: "Task", value: "Create GET/POST /api/theme endpoints", type: "input", tokens: 28 },
      { label: "Tools", value: "grep_codebase, read_file, write_file, run_tests", type: "tools", tokens: 18 },
      { label: "Output", value: "Theme route with auth middleware", type: "output", tokens: 185 },
    ]),
    internalChat: [
      createWorkerMessage("a1", "task_start", "Task: Create GET/POST /api/theme endpoints for persisting user theme preferences with auth middleware.", 32),
      createWorkerMessage("a2", "thought", "I need to find existing API patterns in this codebase to ensure consistency. Let me check for existing route handlers and middleware.", 38),
      createWorkerMessage("a3", "tool_call", "grep_codebase({ pattern: \"api/preferences|route.ts\", glob: \"**/api/**\" })", 22),
      createWorkerMessage("a4", "tool_result", "Found 3 matches:\n• src/app/api/preferences/route.ts (existing preferences endpoint)\n• src/app/api/user/route.ts\n• src/app/api/auth/[...nextauth]/route.ts", 75),
      createWorkerMessage("a5", "thought", "There's an existing preferences endpoint. Let me examine its structure to follow the same patterns.", 28),
      createWorkerMessage("a6", "tool_call", "read_file(\"src/app/api/preferences/route.ts\")", 15),
      createWorkerMessage("a7", "tool_result", "import { NextRequest, NextResponse } from 'next/server';\nimport { getServerSession } from 'next-auth';\n...", 320),
      createWorkerMessage("a8", "thought", "Good pattern. I'll create a similar endpoint specifically for theme preferences. I should also check if there's a Prisma schema for this.", 35),
      createWorkerMessage("a9", "tool_call", "grep_codebase({ pattern: \"model.*Preferences|theme\", path: \"prisma/schema.prisma\" })", 20),
      createWorkerMessage("a10", "tool_result", "model UserPreferences {\n  id        String   @id @default(cuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id])\n  locale    String   @default(\"en\")\n  timezone  String   @default(\"UTC\")\n  // No theme field yet\n}", 95),
      createWorkerMessage("a11", "thought", "I need to add the theme field to the schema, then create the endpoint. Let me first update the schema.", 25),
      createWorkerMessage("a12", "tool_call", "read_file(\"prisma/schema.prisma\", { lines: \"40-55\" })", 15),
      createWorkerMessage("a13", "tool_result", "model UserPreferences {...}", 110),
      createWorkerMessage("a14", "tool_call", "write_file(\"src/app/api/theme/route.ts\", `...`)", 380),
      createWorkerMessage("a15", "tool_result", "✓ File written successfully: src/app/api/theme/route.ts (58 lines)", 18),
      createWorkerMessage("a16", "tool_call", "run_tests(\"src/app/api/theme/route.test.ts\")", 15),
      createWorkerMessage("a17", "tool_result", "PASS src/app/api/theme/route.test.ts\n  ✓ GET /api/theme returns user preference (45ms)\n  ✓ GET /api/theme returns 401 without session (12ms)\n  ✓ POST /api/theme updates preference (38ms)\n  ✓ POST /api/theme validates mode (15ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total", 95),
      createWorkerMessage("a18", "output", "Created endpoints at /api/theme:\n• GET - Fetch user's theme preference (returns ThemePreference)\n• POST - Update theme preference (validates mode)\n\nBoth endpoints use existing auth middleware pattern.\nAll 4 tests passing.", 45),
    ],
  },
  {
    id: "ui-worker",
    name: "UI Worker",
    shortLabel: "UI",
    description: "Build theme toggle component",
    dependencies: ["plan"],
    duration: 2200,
    column: 2,
    row: 3,
    context: createContext([
      { label: "System", value: "React UI specialist. Build accessible components.", type: "system", tokens: 95 },
      { label: "Task", value: "Create ThemeToggle with animations", type: "input", tokens: 30 },
      { label: "Tools", value: "grep_codebase, read_file, write_file", type: "tools", tokens: 15 },
      { label: "Output", value: "ThemeToggle component with sun/moon icons", type: "output", tokens: 280 },
    ]),
    internalChat: [
      createWorkerMessage("u1", "task_start", "Task: Create ThemeToggle component with animated sun/moon icons, keyboard accessibility, and API persistence.", 35),
      createWorkerMessage("u2", "thought", "I need to examine existing toggle/switch components in the codebase to match the design patterns and styling conventions.", 32),
      createWorkerMessage("u3", "tool_call", "grep_codebase({ pattern: \"Toggle|Switch\", glob: \"**/components/**/*.tsx\" })", 22),
      createWorkerMessage("u4", "tool_result", "Found 5 matches:\n• src/components/ui/Switch.tsx (main switch component)\n• src/components/ui/Toggle.tsx (toggle button)\n• src/components/settings/NotificationToggle.tsx\n• src/components/settings/PrivacyToggle.tsx\n• src/components/forms/Checkbox.tsx", 85),
      createWorkerMessage("u5", "thought", "Let me examine the base Switch component to understand the styling and accessibility patterns.", 28),
      createWorkerMessage("u6", "tool_call", "read_file(\"src/components/ui/Switch.tsx\")", 15),
      createWorkerMessage("u7", "tool_result", "\"use client\";\n\nimport * as React from \"react\";\nimport * as SwitchPrimitives from \"@radix-ui/react-switch\";\n...", 340),
      createWorkerMessage("u8", "thought", "Good, they use Radix UI primitives and follow a consistent pattern. I'll create a specialized ThemeToggle that includes animated sun/moon icons inside the thumb. Let me also check the existing hooks.", 45),
      createWorkerMessage("u9", "tool_call", "read_file(\"src/hooks/useTheme.ts\")", 12),
      createWorkerMessage("u10", "tool_result", "import { useState, useEffect } from 'react';\n\nexport function useTheme() {...}", 95),
      createWorkerMessage("u11", "thought", "The hook needs enhancement. I'll create an improved version that syncs with the API and handles system preference. First, let me write the component.", 38),
      createWorkerMessage("u12", "tool_call", "write_file(\"src/components/ui/ThemeToggle.tsx\", `...`)", 680),
      createWorkerMessage("u13", "tool_result", "✓ File written successfully: src/components/ui/ThemeToggle.tsx (84 lines)", 18),
      createWorkerMessage("u14", "thought", "Now I need to enhance the useTheme hook to support API persistence and system preference detection.", 28),
      createWorkerMessage("u15", "tool_call", "write_file(\"src/hooks/useTheme.ts\", `...`)", 420),
      createWorkerMessage("u16", "tool_result", "✓ File written successfully: src/hooks/useTheme.ts (68 lines)", 18),
      createWorkerMessage("u17", "output", "Created ThemeToggle component with:\n• Animated sun/moon icons with smooth transitions\n• Keyboard accessible (focus ring, aria-label)\n• Three size variants (sm, md, lg)\n• Enhanced useTheme hook with API persistence\n• System preference detection\n• Fallback to localStorage for unauthenticated users", 58),
    ],
  },
  {
    id: "collect",
    name: "Collect Results",
    shortLabel: "Collect",
    description: "Gather summaries from all workers",
    dependencies: ["schema-worker", "api-worker", "ui-worker"],
    duration: 400,
    column: 3,
    row: 1.5,
    context: createContext([
      { label: "System", value: "Orchestrator collecting worker summaries", type: "system", tokens: 25 },
      { label: "Input", value: "3 worker completion summaries (~100 tokens total)", type: "input", tokens: 100 },
      { label: "Output", value: "Synthesized completion report", type: "output", tokens: 80 },
    ]),
  },
];

const coordinationMessages: ChatMessage[] = [
  createChatMessage("user-request", "user", "Add dark mode support to the dashboard", { tokens: 12 }),
  createChatMessage("ack", "orchestrator", "Analyzing request to identify subtasks...", { triggeredAtStart: "receive", tokens: 120 }),
  createChatMessage("plan-announce", "orchestrator", "Delegating 3 parallel tasks:\n\n📐 **Schema Worker**: Define theme type interfaces\n🔌 **API Worker**: Create theme preference endpoints\n🎨 **UI Worker**: Build toggle component\n\nSpawning isolated worker sessions...", { triggeredBy: "plan", tokens: 65 }),
  createChatMessage("schema-start", "worker", "Starting... Searching for existing theme types\n→ grep_codebase({ pattern: \"theme|ColorToken\" })", { sender: "📐 Schema", triggeredAtStart: "schema-worker" }),
  createChatMessage("api-start", "worker", "Starting... Locating existing API patterns\n→ grep_codebase({ pattern: \"api/preferences\" })", { sender: "🔌 API", triggeredAtStart: "api-worker" }),
  createChatMessage("ui-start", "worker", "Starting... Finding existing toggle components\n→ grep_codebase({ pattern: \"Toggle|Switch\" })", { sender: "🎨 UI", triggeredAtStart: "ui-worker" }),
  createChatMessage("schema-done", "worker", "✓ Complete: Created 3 interfaces in src/types/theme.ts\n   • ThemeConfig\n   • ColorTokens\n   • ThemePreference", { sender: "📐 Schema", triggeredBy: "schema-worker", tokens: 35 }),
  createChatMessage("api-done", "worker", "✓ Complete: Created endpoints at /api/theme\n   • GET - fetch preference\n   • POST - update preference", { sender: "🔌 API", triggeredBy: "api-worker", tokens: 32 }),
  createChatMessage("ui-done", "worker", "✓ Complete: Created ThemeToggle component\n   • Animated sun/moon icons\n   • Keyboard accessible\n   • Persists to API", { sender: "🎨 UI", triggeredBy: "ui-worker", tokens: 38 }),
  createChatMessage("collect-start", "orchestrator", "All workers complete. Collecting summaries...\n\nNote: Orchestrator context is ~200 tokens. Each worker used 500-800 tokens internally—none of that polluted the orchestrator.", { triggeredAtStart: "collect", tokens: 25 }),
  createChatMessage("final-summary", "complete", "✓ Dark mode implementation complete!\n\n**Created:**\n• 3 TypeScript interfaces (src/types/theme.ts)\n• 2 API endpoints (GET/POST /api/theme)\n• 1 UI component (ThemeToggle)\n\nAll changes are type-safe and follow existing patterns.", { triggeredBy: "collect", tokens: 80 }),
];

export const coordinationScenario: Scenario = {
  id: "coordination",
  name: "Orchestrator-Worker",
  description: "Parallel delegation with isolated worker sessions",
  patternType: "dynamic",
  patternDescription: "Dynamic delegation—orchestrator spawns workers at runtime. Each worker has isolated context; only summaries flow back.",
  colorTheme: "amber",
  tasks: coordinationTasks,
  chatMessages: coordinationMessages,
  insight: "Isolated workers each accumulate 500-800 tokens of context (tool calls, file contents, generated code). The orchestrator only sees ~35 token summaries from each. Three workers, zero context pollution.",
};

// =============================================================================
// Export All Scenarios
// =============================================================================

export const orchestrationScenarios: Scenario[] = [
  searchMapReduceScenario,
  coordinationScenario,
];

export default orchestrationScenarios;
