"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types (exported for reuse in cost comparison)
// ============================================================================

type TaskStatus = "pending" | "running" | "completed";

export interface ContextDetail {
  label: string;
  value: string;
  tokens?: number;
  type: "system" | "tools" | "input" | "state" | "output" | "result" | "dynamic";
}

export interface WorkerMessage {
  id: string;
  type: "task_start" | "thought" | "tool_call" | "tool_result" | "output";
  content: string;
  tokens?: number;
}

export interface DAGTask {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  dependencies: string[];
  duration: number;
  column: number;
  row: number;
  context?: ContextDetail[];
  internalChat?: WorkerMessage[]; // Full worker session for worker nodes
}

interface TaskState extends DAGTask {
  status: TaskStatus;
  startTime?: number;
}

export interface ChatMessage {
  id: string;
  triggeredByTaskId?: string; // Links message to DAG task completion
  triggeredAtStart?: string;  // Links message to DAG task start
  type: "user" | "orchestrator" | "tool_call" | "tool_result" | "worker" | "complete";
  sender?: string;
  content: string;
  context?: ContextDetail[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  patternType: "static" | "dynamic";
  patternDescription: string;
  tasks: DAGTask[];
  chatMessages: ChatMessage[];
}

// ============================================================================
// DAG Layout Constants
// ============================================================================

const NODE_WIDTH = 100;
const NODE_HEIGHT = 48;
const COLUMN_GAP = 130;
const ROW_GAP = 65;
const PADDING = 40;

// ============================================================================
// Scenario Data: Search MapReduce
// ============================================================================

const searchMapReduceScenario: Scenario = {
  id: "search-mapreduce",
  name: "Search MapReduce",
  description: "Fan-out search results to parallel analyzers, then reduce to synthesized answer",
  patternType: "static",
  patternDescription: "Static DAG—the graph shape is fixed at design time. Every query follows: parse → search → parallel analysis → synthesize.",
  tasks: [
    {
      id: "query",
      name: "Parse Query",
      shortLabel: "Query",
      description: "Parse and expand the user's search query",
      dependencies: [],
      duration: 400,
      column: 0,
      row: 2,
      context: [
        { label: "System", value: "Query parser: Extract intent, entities, generate search variants", type: "system", tokens: 45 },
        { label: "Input", value: "Raw query: \"How do I optimize React renders?\"", type: "input", tokens: 15 },
        { label: "Output", value: "Structured query with terms, filters, synonyms", type: "output", tokens: 25 },
      ],
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
      context: [
        { label: "System", value: "Search executor—pure retrieval, no LLM", type: "system", tokens: 20 },
        { label: "Input", value: "Query terms: [\"react\", \"optimize\", \"render\"]", type: "input", tokens: 18 },
        { label: "State", value: "Vector DB + BM25 index access", type: "state", tokens: 12 },
        { label: "Output", value: "Top 5 document chunks with scores", type: "output", tokens: 15 },
      ],
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
      context: [
        { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
        { label: "Input", value: "Doc: \"React.memo prevents re-renders...\" (~800 tokens)", type: "input", tokens: 800 },
        { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
        { label: "Output", value: "{ claims: [...], relevance: 0.92 }", type: "output", tokens: 45 },
      ],
      internalChat: [
        { id: "a1-1", type: "task_start", content: "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: React.memo Deep Dive (800 tokens)", tokens: 25 },
        { id: "a1-2", type: "thought", content: "This document discusses React.memo, which is directly relevant to preventing unnecessary re-renders. I need to extract the key claims and assess how well they answer the user's question.", tokens: 40 },
        { id: "a1-3", type: "tool_call", content: "extract_claims({\n  text: \"React.memo is a higher-order component that memoizes the rendered output. When a component is wrapped in React.memo, React will skip rendering if props haven't changed. This is useful for expensive components that render the same result given the same props...\",\n  max_claims: 5\n})", tokens: 85 },
        { id: "a1-4", type: "tool_result", content: "Extracted claims:\n1. \"React.memo memoizes component output to prevent re-renders\"\n2. \"Props comparison determines if re-render is needed\"\n3. \"Default comparison is shallow equality\"\n4. \"Custom comparison function can be provided as second argument\"\n5. \"Most effective for pure functional components\"", tokens: 95 },
        { id: "a1-5", type: "thought", content: "Good claims extracted. Now I need to score relevance. The document directly addresses the query about optimizing renders - React.memo is a primary technique for this.", tokens: 35 },
        { id: "a1-6", type: "tool_call", content: "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"React.memo memoizes component output\", \"prevents re-renders\", \"props comparison\"],\n  document_type: \"technical_guide\"\n})", tokens: 45 },
        { id: "a1-7", type: "tool_result", content: "Relevance Score: 0.92\n\nBreakdown:\n- Query match: 0.95 (directly addresses render optimization)\n- Actionability: 0.90 (provides concrete technique)\n- Completeness: 0.88 (covers basics, lacks advanced patterns)\n- Source quality: 0.94 (official React documentation)", tokens: 85 },
        { id: "a1-8", type: "output", content: "Analysis complete for Doc 1:\n• 3 actionable claims about React.memo\n• Relevance: 0.92 (highly relevant)\n• Key insight: Memoization prevents re-renders when props unchanged", tokens: 45 },
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
      context: [
        { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
        { label: "Input", value: "Doc: \"useMemo and useCallback hooks...\" (~650 tokens)", type: "input", tokens: 650 },
        { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
        { label: "Output", value: "{ claims: [...], relevance: 0.87 }", type: "output", tokens: 42 },
      ],
      internalChat: [
        { id: "a2-1", type: "task_start", content: "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Hooks Optimization Guide (650 tokens)", tokens: 22 },
        { id: "a2-2", type: "thought", content: "This document covers useMemo and useCallback hooks. These are important for memoizing values and callbacks to prevent unnecessary re-renders caused by reference changes.", tokens: 38 },
        { id: "a2-3", type: "tool_call", content: "extract_claims({\n  text: \"useMemo returns a memoized value that only recomputes when dependencies change. useCallback returns a memoized callback function. Both help prevent unnecessary child re-renders by maintaining referential equality...\",\n  max_claims: 5\n})", tokens: 78 },
        { id: "a2-4", type: "tool_result", content: "Extracted claims:\n1. \"useMemo memoizes computed values between renders\"\n2. \"useCallback memoizes callback functions\"\n3. \"Both maintain referential equality for children\"\n4. \"Dependency array controls when to recompute\"\n5. \"Overuse can hurt performance (memoization has cost)\"", tokens: 88 },
        { id: "a2-5", type: "tool_call", content: "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"useMemo memoizes values\", \"useCallback memoizes callbacks\", \"prevent unnecessary re-renders\"],\n  document_type: \"tutorial\"\n})", tokens: 42 },
        { id: "a2-6", type: "tool_result", content: "Relevance Score: 0.87\n\nBreakdown:\n- Query match: 0.88 (addresses render optimization)\n- Actionability: 0.92 (concrete hook usage patterns)\n- Completeness: 0.82 (good basics, missing edge cases)\n- Source quality: 0.85 (community tutorial)", tokens: 78 },
        { id: "a2-7", type: "output", content: "Analysis complete for Doc 2:\n• 4 claims about useMemo/useCallback patterns\n• Relevance: 0.87 (highly relevant)\n• Key insight: Hooks maintain referential equality to prevent child re-renders", tokens: 42 },
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
      context: [
        { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
        { label: "Input", value: "Doc: \"Virtual DOM diffing...\" (~920 tokens)", type: "input", tokens: 920 },
        { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
        { label: "Output", value: "{ claims: [...], relevance: 0.78 }", type: "output", tokens: 38 },
      ],
      internalChat: [
        { id: "a3-1", type: "task_start", content: "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Virtual DOM Deep Dive (920 tokens)", tokens: 24 },
        { id: "a3-2", type: "thought", content: "This document explains Virtual DOM and diffing algorithm internals. While foundational for understanding React, it may be more conceptual than actionable for optimization.", tokens: 42 },
        { id: "a3-3", type: "tool_call", content: "extract_claims({\n  text: \"React's reconciliation algorithm compares the new Virtual DOM tree with the previous one. It uses heuristics like same element type = update, different type = unmount/remount. Keys help identify which items changed in lists...\",\n  max_claims: 5\n})", tokens: 82 },
        { id: "a3-4", type: "tool_result", content: "Extracted claims:\n1. \"Reconciliation compares Virtual DOM trees\"\n2. \"Same element type triggers update, different triggers remount\"\n3. \"Keys optimize list diffing significantly\"\n4. \"Fiber architecture enables incremental rendering\"\n5. \"Diffing is O(n) due to heuristics, not O(n³)\"", tokens: 92 },
        { id: "a3-5", type: "thought", content: "The key claim about list keys is actionable. The rest is more background knowledge. Let me score this appropriately - useful context but not direct optimization advice.", tokens: 38 },
        { id: "a3-6", type: "tool_call", content: "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"Keys optimize list diffing\", \"reconciliation heuristics\", \"Fiber incremental rendering\"],\n  document_type: \"deep_dive\"\n})", tokens: 45 },
        { id: "a3-7", type: "tool_result", content: "Relevance Score: 0.78\n\nBreakdown:\n- Query match: 0.72 (conceptual, not directly actionable)\n- Actionability: 0.68 (only keys tip is directly useful)\n- Completeness: 0.92 (comprehensive coverage)\n- Source quality: 0.90 (official React internals)", tokens: 82 },
        { id: "a3-8", type: "output", content: "Analysis complete for Doc 3:\n• 5 claims about Virtual DOM internals\n• Relevance: 0.78 (moderately relevant)\n• Key insight: Keys critical for list performance; diffing already optimized", tokens: 38 },
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
      context: [
        { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
        { label: "Input", value: "Doc: \"React DevTools Profiler...\" (~450 tokens)", type: "input", tokens: 450 },
        { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
        { label: "Output", value: "{ claims: [...], relevance: 0.82 }", type: "output", tokens: 40 },
      ],
      internalChat: [
        { id: "a4-1", type: "task_start", content: "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: React DevTools Profiler (450 tokens)", tokens: 22 },
        { id: "a4-2", type: "thought", content: "DevTools Profiler is essential for identifying render performance issues. This is about measurement and diagnosis rather than specific optimization techniques.", tokens: 35 },
        { id: "a4-3", type: "tool_call", content: "extract_claims({\n  text: \"The React DevTools Profiler records render timings and identifies why components re-rendered. Flamegraph shows component hierarchy and render durations. 'Why did this render?' feature shows prop/state/hook changes...\",\n  max_claims: 4\n})", tokens: 72 },
        { id: "a4-4", type: "tool_result", content: "Extracted claims:\n1. \"Profiler records render timings per component\"\n2. \"Flamegraph visualizes component hierarchy and durations\"\n3. \"'Why did this render?' identifies change triggers\"\n4. \"Highlight updates setting shows renders in real-time\"", tokens: 75 },
        { id: "a4-5", type: "tool_call", content: "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"Profiler records timings\", \"identify why components re-rendered\", \"highlight updates\"],\n  document_type: \"tooling_guide\"\n})", tokens: 42 },
        { id: "a4-6", type: "tool_result", content: "Relevance Score: 0.82\n\nBreakdown:\n- Query match: 0.85 (directly about render analysis)\n- Actionability: 0.88 (clear steps to diagnose issues)\n- Completeness: 0.75 (diagnosis only, not fixes)\n- Source quality: 0.82 (official tooling docs)", tokens: 72 },
        { id: "a4-7", type: "output", content: "Analysis complete for Doc 4:\n• 2 key claims about profiling techniques\n• Relevance: 0.82 (relevant for diagnosis)\n• Key insight: Use Profiler to identify bottlenecks before optimizing", tokens: 40 },
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
      context: [
        { label: "System", value: "Document analyzer: Extract claims, assess relevance", type: "system", tokens: 35 },
        { label: "Input", value: "Doc: \"Code splitting with React.lazy...\" (~580 tokens)", type: "input", tokens: 580 },
        { label: "Tools", value: "extract_claims(), score_relevance()", type: "tools", tokens: 12 },
        { label: "Output", value: "{ claims: [...], relevance: 0.71 }", type: "output", tokens: 36 },
      ],
      internalChat: [
        { id: "a5-1", type: "task_start", content: "Analyze document chunk for relevance to query: \"How do I optimize React renders?\"\n\nDocument: Code Splitting Patterns (580 tokens)", tokens: 22 },
        { id: "a5-2", type: "thought", content: "Code splitting with React.lazy is about initial load performance, not render optimization per se. It reduces bundle size and defers loading, but doesn't prevent re-renders.", tokens: 42 },
        { id: "a5-3", type: "tool_call", content: "extract_claims({\n  text: \"React.lazy enables dynamic imports for code splitting. Components are loaded on demand. Suspense provides loading fallbacks. Route-based splitting is the most common pattern. Preloading can improve perceived performance...\",\n  max_claims: 4\n})", tokens: 68 },
        { id: "a5-4", type: "tool_result", content: "Extracted claims:\n1. \"React.lazy enables component-level code splitting\"\n2. \"Suspense handles loading states for lazy components\"\n3. \"Route-based splitting is most effective pattern\"\n4. \"Preloading can be triggered on hover/focus\"", tokens: 72 },
        { id: "a5-5", type: "thought", content: "This is tangentially related - it's about performance but not specifically render optimization. The user asked about render optimization, and this is more about load-time optimization.", tokens: 38 },
        { id: "a5-6", type: "tool_call", content: "score_relevance({\n  query: \"optimize React renders\",\n  claims: [\"code splitting\", \"dynamic imports\", \"Suspense loading\"],\n  document_type: \"tutorial\"\n})", tokens: 38 },
        { id: "a5-7", type: "tool_result", content: "Relevance Score: 0.71\n\nBreakdown:\n- Query match: 0.62 (optimization but not render-specific)\n- Actionability: 0.85 (clear implementation pattern)\n- Completeness: 0.78 (good coverage of code splitting)\n- Source quality: 0.80 (community tutorial)", tokens: 75 },
        { id: "a5-8", type: "output", content: "Analysis complete for Doc 5:\n• 2 claims about code splitting patterns\n• Relevance: 0.71 (tangentially relevant)\n• Key insight: Helps initial load, not render performance", tokens: 36 },
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
      context: [
        { label: "System", value: "Synthesizer: Combine analyses with citations", type: "system", tokens: 40 },
        { label: "Input", value: "5 analysis summaries (~200 tokens total)", type: "input", tokens: 200 },
        { label: "State", value: "Original query, citation format requirements", type: "state", tokens: 25 },
        { label: "Output", value: "Final answer: \"To optimize React renders: 1) Use React.memo [1]...\"", type: "output", tokens: 350 },
      ],
    },
  ],
  chatMessages: [
    {
      id: "user-query",
      type: "user",
      content: "How do I optimize React renders?",
      context: [{ label: "User Query", value: "Natural language question to be processed", tokens: 8, type: "input" }],
    },
    {
      id: "start-parse",
      triggeredAtStart: "query",
      type: "orchestrator",
      content: "Parsing query to extract search terms...",
      context: [
        { label: "System", value: "Orchestrator dispatching to query parser", tokens: 15, type: "system" },
      ],
    },
    {
      id: "query-done",
      triggeredByTaskId: "query",
      type: "tool_result",
      content: "→ Extracted terms: [\"react\", \"optimize\", \"render\", \"performance\"]\n→ Synonyms: [\"memoization\", \"re-render\", \"virtual DOM\"]",
      context: [
        { label: "Parser Output", value: "Structured query ready for search", tokens: 35, type: "result" },
      ],
    },
    {
      id: "start-search",
      triggeredAtStart: "search",
      type: "orchestrator",
      content: "Executing search against document index...",
    },
    {
      id: "search-done",
      triggeredByTaskId: "search",
      type: "tool_result",
      content: "→ Retrieved 5 documents (scores: 0.92, 0.87, 0.82, 0.78, 0.71)\n→ Dispatching to parallel analyzers",
      context: [
        { label: "Search Results", value: "5 relevant chunks ready for analysis", tokens: 45, type: "result" },
      ],
    },
    {
      id: "fan-out",
      triggeredAtStart: "analyze-1",
      type: "orchestrator",
      content: "Fan-out: Spawning 5 parallel document analyzers\n\n📄 Analyzer 1: React.memo article\n📄 Analyzer 2: Hooks optimization guide\n📄 Analyzer 3: Virtual DOM deep dive\n📄 Analyzer 4: DevTools profiling\n📄 Analyzer 5: Code splitting patterns",
      context: [
        { label: "Parallel Dispatch", value: "5 independent LLM calls, each with isolated context", tokens: 60, type: "system" },
      ],
    },
    {
      id: "analyze-1-done",
      triggeredByTaskId: "analyze-1",
      type: "worker",
      sender: "Analyzer 1",
      content: "✓ Doc 1 analyzed: 3 claims about React.memo, relevance 0.92",
    },
    {
      id: "analyze-2-done",
      triggeredByTaskId: "analyze-2",
      type: "worker",
      sender: "Analyzer 2",
      content: "✓ Doc 2 analyzed: 4 claims about useMemo/useCallback, relevance 0.87",
    },
    {
      id: "analyze-4-done",
      triggeredByTaskId: "analyze-4",
      type: "worker",
      sender: "Analyzer 4",
      content: "✓ Doc 4 analyzed: 2 claims about profiling, relevance 0.82",
    },
    {
      id: "analyze-3-done",
      triggeredByTaskId: "analyze-3",
      type: "worker",
      sender: "Analyzer 3",
      content: "✓ Doc 3 analyzed: 5 claims about Virtual DOM, relevance 0.78",
    },
    {
      id: "analyze-5-done",
      triggeredByTaskId: "analyze-5",
      type: "worker",
      sender: "Analyzer 5",
      content: "✓ Doc 5 analyzed: 2 claims about code splitting, relevance 0.71",
    },
    {
      id: "reduce-start",
      triggeredAtStart: "synthesize",
      type: "orchestrator",
      content: "All analyzers complete. Reducing to synthesized answer...\n\nNote: Synthesizer receives ~200 tokens of summaries, NOT the original 3,400 tokens of documents.",
      context: [
        { label: "Context Efficiency", value: "Reduce step sees summaries only—massive token savings", tokens: 200, type: "state" },
      ],
    },
    {
      id: "final-answer",
      triggeredByTaskId: "synthesize",
      type: "complete",
      content: "To optimize React renders:\n\n1. **Use React.memo** for expensive pure components [1]\n2. **Leverage useMemo/useCallback** to stabilize references [2]\n3. **Profile with DevTools** to identify bottlenecks [4]\n4. **Code split with React.lazy** for large bundles [5]\n\nThe Virtual DOM diffing is already optimized—focus on preventing unnecessary re-renders at the component level [3].",
      context: [
        { label: "Final Output", value: "Synthesized answer with citations to source documents", tokens: 150, type: "output" },
      ],
    },
  ],
};

// ============================================================================
// Scenario Data: Orchestrator-Worker Coordination
// ============================================================================

const coordinationScenario: Scenario = {
  id: "coordination",
  name: "Orchestrator-Worker",
  description: "Parallel delegation with isolated worker sessions",
  patternType: "dynamic",
  patternDescription: "Dynamic delegation—orchestrator spawns workers at runtime. Each worker has isolated context; only summaries flow back.",
  tasks: [
    {
      id: "receive",
      name: "Receive Task",
      shortLabel: "Receive",
      description: "Orchestrator receives and analyzes user request",
      dependencies: [],
      duration: 300,
      column: 0,
      row: 1.5,
      context: [
        { label: "System", value: "Orchestrator: Decompose tasks, delegate to workers, synthesize", type: "system", tokens: 120 },
        { label: "Input", value: "User: \"Add dark mode support to the dashboard\"", type: "input", tokens: 12 },
      ],
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
      context: [
        { label: "System", value: "Decompose into independent subtasks for parallel execution", type: "system", tokens: 45 },
        { label: "Output", value: "3 tasks: Schema types, API endpoints, UI component", type: "output", tokens: 35 },
      ],
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
      context: [
        { label: "System", value: "TypeScript schema specialist. Define type-safe interfaces.", type: "system", tokens: 85 },
        { label: "Task", value: "Create theme config interfaces", type: "input", tokens: 25 },
        { label: "Tools", value: "grep_codebase, read_file, write_file", type: "tools", tokens: 15 },
        { label: "Output", value: "ThemeConfig, ColorTokens, ThemePreference types", type: "output", tokens: 220 },
      ],
      internalChat: [
        { id: "s1", type: "task_start", content: "Task: Create TypeScript interfaces for dark mode theme configuration including color tokens, component overrides, and persistence settings.", tokens: 45 },
        { id: "s2", type: "thought", content: "I need to understand the existing color and theme patterns in this codebase before defining new interfaces. Let me search for existing type definitions.", tokens: 35 },
        { id: "s3", type: "tool_call", content: "grep_codebase({ pattern: \"theme|ColorToken|color\", glob: \"**/*.ts\" })", tokens: 25 },
        { id: "s4", type: "tool_result", content: "Found 12 matches in 4 files:\n• src/styles/colors.ts (4 matches)\n• src/hooks/useTheme.ts (3 matches)\n• src/types/common.ts (2 matches)\n• src/components/Button.tsx (3 matches)", tokens: 85 },
        { id: "s5", type: "thought", content: "Good, there are existing color definitions. Let me examine the colors.ts file to understand the current token structure.", tokens: 28 },
        { id: "s6", type: "tool_call", content: "read_file(\"src/styles/colors.ts\")", tokens: 12 },
        { id: "s7", type: "tool_result", content: "export const colors = {\n  primary: '#3b82f6',\n  secondary: '#64748b',\n  success: '#10b981',\n  error: '#ef4444',\n  background: '#ffffff',\n  surface: '#f8fafc',\n  text: '#0f172a',\n  textMuted: '#64748b',\n};\n\nexport type ColorKey = keyof typeof colors;", tokens: 180 },
        { id: "s8", type: "thought", content: "I see they have a simple color object. For dark mode, I'll need to extend this with a theme-aware structure. Let me also check useTheme for any existing patterns.", tokens: 42 },
        { id: "s9", type: "tool_call", content: "read_file(\"src/hooks/useTheme.ts\")", tokens: 12 },
        { id: "s10", type: "tool_result", content: "import { useState, useEffect } from 'react';\n\nexport function useTheme() {\n  const [isDark, setIsDark] = useState(false);\n  \n  useEffect(() => {\n    // Basic implementation - needs enhancement\n    const stored = localStorage.getItem('theme');\n    setIsDark(stored === 'dark');\n  }, []);\n  \n  return { isDark, setIsDark };\n}", tokens: 145 },
        { id: "s11", type: "thought", content: "The existing hook is basic. I'll create comprehensive interfaces that support:\n1. ThemeConfig - the full theme configuration\n2. ColorTokens - semantic color tokens for light/dark\n3. ThemePreference - user preference storage format\n\nThis follows the pattern in common.ts and will integrate cleanly.", tokens: 68 },
        { id: "s12", type: "tool_call", content: "write_file(\"src/types/theme.ts\", `// Theme configuration types for dark mode support\n\nexport interface ColorTokens {\n  // Semantic colors\n  primary: string;\n  secondary: string;\n  accent: string;\n  \n  // Status colors\n  success: string;\n  warning: string;\n  error: string;\n  info: string;\n  \n  // Surface colors\n  background: string;\n  surface: string;\n  surfaceElevated: string;\n  \n  // Text colors\n  textPrimary: string;\n  textSecondary: string;\n  textMuted: string;\n  textInverse: string;\n  \n  // Border colors\n  border: string;\n  borderFocus: string;\n}\n\nexport interface ThemeConfig {\n  name: 'light' | 'dark' | 'system';\n  colors: ColorTokens;\n  // Component-level overrides\n  overrides?: {\n    button?: Partial<ColorTokens>;\n    card?: Partial<ColorTokens>;\n    input?: Partial<ColorTokens>;\n  };\n}\n\nexport interface ThemePreference {\n  mode: 'light' | 'dark' | 'system';\n  updatedAt: string;\n  // For syncing across devices\n  syncEnabled?: boolean;\n}\n\n// Default themes\nexport const lightTheme: ThemeConfig = {\n  name: 'light',\n  colors: {\n    primary: '#3b82f6',\n    secondary: '#64748b',\n    accent: '#8b5cf6',\n    success: '#10b981',\n    warning: '#f59e0b',\n    error: '#ef4444',\n    info: '#06b6d4',\n    background: '#ffffff',\n    surface: '#f8fafc',\n    surfaceElevated: '#ffffff',\n    textPrimary: '#0f172a',\n    textSecondary: '#334155',\n    textMuted: '#64748b',\n    textInverse: '#ffffff',\n    border: '#e2e8f0',\n    borderFocus: '#3b82f6',\n  },\n};\n\nexport const darkTheme: ThemeConfig = {\n  name: 'dark',\n  colors: {\n    primary: '#60a5fa',\n    secondary: '#94a3b8',\n    accent: '#a78bfa',\n    success: '#34d399',\n    warning: '#fbbf24',\n    error: '#f87171',\n    info: '#22d3ee',\n    background: '#0f172a',\n    surface: '#1e293b',\n    surfaceElevated: '#334155',\n    textPrimary: '#f8fafc',\n    textSecondary: '#cbd5e1',\n    textMuted: '#94a3b8',\n    textInverse: '#0f172a',\n    border: '#334155',\n    borderFocus: '#60a5fa',\n  },\n};\n`)", tokens: 420 },
        { id: "s13", type: "tool_result", content: "✓ File written successfully: src/types/theme.ts (98 lines)", tokens: 18 },
        { id: "s14", type: "output", content: "Created 3 interfaces in src/types/theme.ts:\n• ThemeConfig - Full theme configuration with overrides\n• ColorTokens - Semantic color token definitions\n• ThemePreference - User preference persistence format\n\nAlso included lightTheme and darkTheme default configurations.", tokens: 55 },
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
      context: [
        { label: "System", value: "Backend API specialist. Implement RESTful endpoints.", type: "system", tokens: 90 },
        { label: "Task", value: "Create GET/POST /api/theme endpoints", type: "input", tokens: 28 },
        { label: "Tools", value: "grep_codebase, read_file, write_file, run_tests", type: "tools", tokens: 18 },
        { label: "Output", value: "Theme route with auth middleware", type: "output", tokens: 185 },
      ],
      internalChat: [
        { id: "a1", type: "task_start", content: "Task: Create GET/POST /api/theme endpoints for persisting user theme preferences with auth middleware.", tokens: 32 },
        { id: "a2", type: "thought", content: "I need to find existing API patterns in this codebase to ensure consistency. Let me check for existing route handlers and middleware.", tokens: 38 },
        { id: "a3", type: "tool_call", content: "grep_codebase({ pattern: \"api/preferences|route.ts\", glob: \"**/api/**\" })", tokens: 22 },
        { id: "a4", type: "tool_result", content: "Found 3 matches:\n• src/app/api/preferences/route.ts (existing preferences endpoint)\n• src/app/api/user/route.ts\n• src/app/api/auth/[...nextauth]/route.ts", tokens: 75 },
        { id: "a5", type: "thought", content: "There's an existing preferences endpoint. Let me examine its structure to follow the same patterns.", tokens: 28 },
        { id: "a6", type: "tool_call", content: "read_file(\"src/app/api/preferences/route.ts\")", tokens: 15 },
        { id: "a7", type: "tool_result", content: "import { NextRequest, NextResponse } from 'next/server';\nimport { getServerSession } from 'next-auth';\nimport { authOptions } from '@/lib/auth';\nimport { prisma } from '@/lib/prisma';\n\nexport async function GET(req: NextRequest) {\n  const session = await getServerSession(authOptions);\n  if (!session?.user?.id) {\n    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n  }\n  \n  const prefs = await prisma.userPreferences.findUnique({\n    where: { userId: session.user.id },\n  });\n  \n  return NextResponse.json(prefs || {});\n}\n\nexport async function POST(req: NextRequest) {\n  const session = await getServerSession(authOptions);\n  if (!session?.user?.id) {\n    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n  }\n  \n  const body = await req.json();\n  // ... update logic\n}", tokens: 320 },
        { id: "a8", type: "thought", content: "Good pattern. I'll create a similar endpoint specifically for theme preferences. I should also check if there's a Prisma schema for this.", tokens: 35 },
        { id: "a9", type: "tool_call", content: "grep_codebase({ pattern: \"model.*Preferences|theme\", path: \"prisma/schema.prisma\" })", tokens: 20 },
        { id: "a10", type: "tool_result", content: "model UserPreferences {\n  id        String   @id @default(cuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id])\n  locale    String   @default(\"en\")\n  timezone  String   @default(\"UTC\")\n  // No theme field yet\n}", tokens: 95 },
        { id: "a11", type: "thought", content: "I need to add the theme field to the schema, then create the endpoint. Let me first update the schema.", tokens: 25 },
        { id: "a12", type: "tool_call", content: "read_file(\"prisma/schema.prisma\", { lines: \"40-55\" })", tokens: 15 },
        { id: "a13", type: "tool_result", content: "model UserPreferences {\n  id        String   @id @default(cuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id])\n  locale    String   @default(\"en\")\n  timezone  String   @default(\"UTC\")\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}", tokens: 110 },
        { id: "a14", type: "tool_call", content: "write_file(\"src/app/api/theme/route.ts\", `import { NextRequest, NextResponse } from 'next/server';\nimport { getServerSession } from 'next-auth';\nimport { authOptions } from '@/lib/auth';\nimport { prisma } from '@/lib/prisma';\nimport { ThemePreference } from '@/types/theme';\n\nexport async function GET(req: NextRequest) {\n  const session = await getServerSession(authOptions);\n  if (!session?.user?.id) {\n    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n  }\n  \n  const prefs = await prisma.userPreferences.findUnique({\n    where: { userId: session.user.id },\n    select: { theme: true, themeUpdatedAt: true },\n  });\n  \n  const response: ThemePreference = {\n    mode: (prefs?.theme as 'light' | 'dark' | 'system') || 'system',\n    updatedAt: prefs?.themeUpdatedAt?.toISOString() || new Date().toISOString(),\n  };\n  \n  return NextResponse.json(response);\n}\n\nexport async function POST(req: NextRequest) {\n  const session = await getServerSession(authOptions);\n  if (!session?.user?.id) {\n    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n  }\n  \n  const body: Partial<ThemePreference> = await req.json();\n  \n  if (!body.mode || !['light', 'dark', 'system'].includes(body.mode)) {\n    return NextResponse.json(\n      { error: 'Invalid theme mode' },\n      { status: 400 }\n    );\n  }\n  \n  const updated = await prisma.userPreferences.upsert({\n    where: { userId: session.user.id },\n    update: {\n      theme: body.mode,\n      themeUpdatedAt: new Date(),\n    },\n    create: {\n      userId: session.user.id,\n      theme: body.mode,\n      themeUpdatedAt: new Date(),\n    },\n  });\n  \n  return NextResponse.json({\n    mode: updated.theme,\n    updatedAt: updated.themeUpdatedAt?.toISOString(),\n  });\n}\n`)", tokens: 380 },
        { id: "a15", type: "tool_result", content: "✓ File written successfully: src/app/api/theme/route.ts (58 lines)", tokens: 18 },
        { id: "a16", type: "tool_call", content: "run_tests(\"src/app/api/theme/route.test.ts\")", tokens: 15 },
        { id: "a17", type: "tool_result", content: "PASS src/app/api/theme/route.test.ts\n  ✓ GET /api/theme returns user preference (45ms)\n  ✓ GET /api/theme returns 401 without session (12ms)\n  ✓ POST /api/theme updates preference (38ms)\n  ✓ POST /api/theme validates mode (15ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total", tokens: 95 },
        { id: "a18", type: "output", content: "Created endpoints at /api/theme:\n• GET - Fetch user's theme preference (returns ThemePreference)\n• POST - Update theme preference (validates mode)\n\nBoth endpoints use existing auth middleware pattern.\nAll 4 tests passing.", tokens: 45 },
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
      context: [
        { label: "System", value: "React UI specialist. Build accessible components.", type: "system", tokens: 95 },
        { label: "Task", value: "Create ThemeToggle with animations", type: "input", tokens: 30 },
        { label: "Tools", value: "grep_codebase, read_file, write_file", type: "tools", tokens: 15 },
        { label: "Output", value: "ThemeToggle component with sun/moon icons", type: "output", tokens: 280 },
      ],
      internalChat: [
        { id: "u1", type: "task_start", content: "Task: Create ThemeToggle component with animated sun/moon icons, keyboard accessibility, and API persistence.", tokens: 35 },
        { id: "u2", type: "thought", content: "I need to examine existing toggle/switch components in the codebase to match the design patterns and styling conventions.", tokens: 32 },
        { id: "u3", type: "tool_call", content: "grep_codebase({ pattern: \"Toggle|Switch\", glob: \"**/components/**/*.tsx\" })", tokens: 22 },
        { id: "u4", type: "tool_result", content: "Found 5 matches:\n• src/components/ui/Switch.tsx (main switch component)\n• src/components/ui/Toggle.tsx (toggle button)\n• src/components/settings/NotificationToggle.tsx\n• src/components/settings/PrivacyToggle.tsx\n• src/components/forms/Checkbox.tsx", tokens: 85 },
        { id: "u5", type: "thought", content: "Let me examine the base Switch component to understand the styling and accessibility patterns.", tokens: 28 },
        { id: "u6", type: "tool_call", content: "read_file(\"src/components/ui/Switch.tsx\")", tokens: 15 },
        { id: "u7", type: "tool_result", content: "\"use client\";\n\nimport * as React from \"react\";\nimport * as SwitchPrimitives from \"@radix-ui/react-switch\";\nimport { cn } from \"@/lib/utils\";\n\nconst Switch = React.forwardRef<\n  React.ElementRef<typeof SwitchPrimitives.Root>,\n  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>\n>(({ className, ...props }, ref) => (\n  <SwitchPrimitives.Root\n    className={cn(\n      \"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full\",\n      \"border-2 border-transparent transition-colors duration-200\",\n      \"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring\",\n      \"disabled:cursor-not-allowed disabled:opacity-50\",\n      \"data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted\",\n      className\n    )}\n    {...props}\n    ref={ref}\n  >\n    <SwitchPrimitives.Thumb\n      className={cn(\n        \"pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg\",\n        \"ring-0 transition-transform duration-200\",\n        \"data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0\"\n      )}\n    />\n  </SwitchPrimitives.Root>\n));\n\nSwitch.displayName = SwitchPrimitives.Root.displayName;\n\nexport { Switch };", tokens: 340 },
        { id: "u8", type: "thought", content: "Good, they use Radix UI primitives and follow a consistent pattern. I'll create a specialized ThemeToggle that includes animated sun/moon icons inside the thumb. Let me also check the existing hooks.", tokens: 45 },
        { id: "u9", type: "tool_call", content: "read_file(\"src/hooks/useTheme.ts\")", tokens: 12 },
        { id: "u10", type: "tool_result", content: "import { useState, useEffect } from 'react';\n\nexport function useTheme() {\n  const [isDark, setIsDark] = useState(false);\n  \n  useEffect(() => {\n    const stored = localStorage.getItem('theme');\n    setIsDark(stored === 'dark');\n  }, []);\n  \n  return { isDark, setIsDark };\n}", tokens: 95 },
        { id: "u11", type: "thought", content: "The hook needs enhancement. I'll create an improved version that syncs with the API and handles system preference. First, let me write the component.", tokens: 38 },
        { id: "u12", type: "tool_call", content: "write_file(\"src/components/ui/ThemeToggle.tsx\", `\"use client\";\n\nimport * as React from \"react\";\nimport * as SwitchPrimitives from \"@radix-ui/react-switch\";\nimport { cn } from \"@/lib/utils\";\nimport { useTheme } from \"@/hooks/useTheme\";\n\ninterface ThemeToggleProps {\n  className?: string;\n  size?: \"sm\" | \"md\" | \"lg\";\n}\n\nconst sizeClasses = {\n  sm: { root: \"h-5 w-9\", thumb: \"h-4 w-4\", translate: \"translate-x-4\", icon: \"h-3 w-3\" },\n  md: { root: \"h-6 w-11\", thumb: \"h-5 w-5\", translate: \"translate-x-5\", icon: \"h-3.5 w-3.5\" },\n  lg: { root: \"h-8 w-14\", thumb: \"h-7 w-7\", translate: \"translate-x-6\", icon: \"h-4 w-4\" },\n};\n\nexport function ThemeToggle({ className, size = \"md\" }: ThemeToggleProps) {\n  const { theme, setTheme, isLoading } = useTheme();\n  const isDark = theme === \"dark\";\n  const sizes = sizeClasses[size];\n\n  return (\n    <SwitchPrimitives.Root\n      checked={isDark}\n      onCheckedChange={(checked) => setTheme(checked ? \"dark\" : \"light\")}\n      disabled={isLoading}\n      aria-label={isDark ? \"Switch to light mode\" : \"Switch to dark mode\"}\n      className={cn(\n        \"peer inline-flex shrink-0 cursor-pointer items-center rounded-full\",\n        \"border-2 border-transparent transition-all duration-300\",\n        \"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2\",\n        \"disabled:cursor-not-allowed disabled:opacity-50\",\n        isDark ? \"bg-slate-800\" : \"bg-amber-100\",\n        sizes.root,\n        className\n      )}\n    >\n      <SwitchPrimitives.Thumb\n        className={cn(\n          \"pointer-events-none flex items-center justify-center rounded-full shadow-lg\",\n          \"ring-0 transition-all duration-300 ease-in-out\",\n          isDark ? \"bg-slate-900 translate-x-5\" : \"bg-amber-400 translate-x-0\",\n          sizes.thumb\n        )}\n        style={{ transform: isDark ? \\`translateX(calc(100% + 2px))\\` : \"translateX(2px)\" }}\n      >\n        {/* Sun Icon */}\n        <svg\n          className={cn(\n            \"absolute transition-all duration-300\",\n            sizes.icon,\n            isDark ? \"opacity-0 rotate-90 scale-0\" : \"opacity-100 rotate-0 scale-100 text-amber-600\"\n          )}\n          fill=\"currentColor\"\n          viewBox=\"0 0 20 20\"\n        >\n          <path\n            fillRule=\"evenodd\"\n            d=\"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z\"\n            clipRule=\"evenodd\"\n          />\n        </svg>\n        {/* Moon Icon */}\n        <svg\n          className={cn(\n            \"absolute transition-all duration-300\",\n            sizes.icon,\n            isDark ? \"opacity-100 rotate-0 scale-100 text-slate-300\" : \"opacity-0 -rotate-90 scale-0\"\n          )}\n          fill=\"currentColor\"\n          viewBox=\"0 0 20 20\"\n        >\n          <path d=\"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z\" />\n        </svg>\n      </SwitchPrimitives.Thumb>\n    </SwitchPrimitives.Root>\n  );\n}\n`)", tokens: 680 },
        { id: "u13", type: "tool_result", content: "✓ File written successfully: src/components/ui/ThemeToggle.tsx (84 lines)", tokens: 18 },
        { id: "u14", type: "thought", content: "Now I need to enhance the useTheme hook to support API persistence and system preference detection.", tokens: 28 },
        { id: "u15", type: "tool_call", content: "write_file(\"src/hooks/useTheme.ts\", `import { useState, useEffect, useCallback } from 'react';\nimport { ThemePreference } from '@/types/theme';\n\ntype Theme = 'light' | 'dark' | 'system';\n\nexport function useTheme() {\n  const [theme, setThemeState] = useState<Theme>('system');\n  const [isLoading, setIsLoading] = useState(true);\n\n  // Compute actual theme based on system preference\n  const resolvedTheme = useCallback(() => {\n    if (theme === 'system') {\n      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n    }\n    return theme;\n  }, [theme]);\n\n  // Load initial preference\n  useEffect(() => {\n    async function loadTheme() {\n      try {\n        // Try API first (authenticated users)\n        const res = await fetch('/api/theme');\n        if (res.ok) {\n          const pref: ThemePreference = await res.json();\n          setThemeState(pref.mode);\n        } else {\n          // Fall back to localStorage\n          const stored = localStorage.getItem('theme') as Theme;\n          if (stored) setThemeState(stored);\n        }\n      } catch {\n        // Fall back to localStorage\n        const stored = localStorage.getItem('theme') as Theme;\n        if (stored) setThemeState(stored);\n      } finally {\n        setIsLoading(false);\n      }\n    }\n    loadTheme();\n  }, []);\n\n  // Apply theme to document\n  useEffect(() => {\n    const resolved = resolvedTheme();\n    document.documentElement.classList.toggle('dark', resolved === 'dark');\n  }, [theme, resolvedTheme]);\n\n  // Update theme with persistence\n  const setTheme = useCallback(async (newTheme: Theme) => {\n    setThemeState(newTheme);\n    localStorage.setItem('theme', newTheme);\n    \n    // Try to persist to API\n    try {\n      await fetch('/api/theme', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ mode: newTheme }),\n      });\n    } catch {\n      // API persistence failed, but localStorage is updated\n    }\n  }, []);\n\n  return {\n    theme,\n    setTheme,\n    resolvedTheme: resolvedTheme(),\n    isLoading,\n    isDark: resolvedTheme() === 'dark',\n  };\n}\n`)", tokens: 420 },
        { id: "u16", type: "tool_result", content: "✓ File written successfully: src/hooks/useTheme.ts (68 lines)", tokens: 18 },
        { id: "u17", type: "output", content: "Created ThemeToggle component with:\n• Animated sun/moon icons with smooth transitions\n• Keyboard accessible (focus ring, aria-label)\n• Three size variants (sm, md, lg)\n• Enhanced useTheme hook with API persistence\n• System preference detection\n• Fallback to localStorage for unauthenticated users", tokens: 58 },
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
      context: [
        { label: "System", value: "Orchestrator collecting worker summaries", type: "system", tokens: 25 },
        { label: "Input", value: "3 worker completion summaries (~100 tokens total)", type: "input", tokens: 100 },
        { label: "Output", value: "Synthesized completion report", type: "output", tokens: 80 },
      ],
    },
  ],
  chatMessages: [
    {
      id: "user-request",
      type: "user",
      content: "Add dark mode support to the dashboard",
      context: [{ label: "User Request", value: "High-level feature request", tokens: 12, type: "input" }],
    },
    {
      id: "ack",
      triggeredAtStart: "receive",
      type: "orchestrator",
      content: "Analyzing request to identify subtasks...",
      context: [
        { label: "System", value: "Orchestrator decomposing the task", tokens: 120, type: "system" },
      ],
    },
    {
      id: "plan-announce",
      triggeredByTaskId: "plan",
      type: "orchestrator",
      content: "Delegating 3 parallel tasks:\n\n📐 **Schema Worker**: Define theme type interfaces\n🔌 **API Worker**: Create theme preference endpoints\n🎨 **UI Worker**: Build toggle component\n\nSpawning isolated worker sessions...",
      context: [
        { label: "Delegation Plan", value: "3 independent workers with isolated contexts", tokens: 65, type: "system" },
      ],
    },
    {
      id: "schema-start",
      triggeredAtStart: "schema-worker",
      type: "worker",
      sender: "📐 Schema",
      content: "Starting... Searching for existing theme types\n→ grep_codebase({ pattern: \"theme|ColorToken\" })",
    },
    {
      id: "api-start",
      triggeredAtStart: "api-worker",
      type: "worker",
      sender: "🔌 API",
      content: "Starting... Locating existing API patterns\n→ grep_codebase({ pattern: \"api/preferences\" })",
    },
    {
      id: "ui-start",
      triggeredAtStart: "ui-worker",
      type: "worker",
      sender: "🎨 UI",
      content: "Starting... Finding existing toggle components\n→ grep_codebase({ pattern: \"Toggle|Switch\" })",
    },
    {
      id: "schema-done",
      triggeredByTaskId: "schema-worker",
      type: "worker",
      sender: "📐 Schema",
      content: "✓ Complete: Created 3 interfaces in src/types/theme.ts\n   • ThemeConfig\n   • ColorTokens\n   • ThemePreference",
      context: [
        { label: "Worker Summary", value: "Only this summary returns to orchestrator", tokens: 35, type: "result" },
      ],
    },
    {
      id: "api-done",
      triggeredByTaskId: "api-worker",
      type: "worker",
      sender: "🔌 API",
      content: "✓ Complete: Created endpoints at /api/theme\n   • GET - fetch preference\n   • POST - update preference",
      context: [
        { label: "Worker Summary", value: "Only this summary returns to orchestrator", tokens: 32, type: "result" },
      ],
    },
    {
      id: "ui-done",
      triggeredByTaskId: "ui-worker",
      type: "worker",
      sender: "🎨 UI",
      content: "✓ Complete: Created ThemeToggle component\n   • Animated sun/moon icons\n   • Keyboard accessible\n   • Persists to API",
      context: [
        { label: "Worker Summary", value: "Only this summary returns to orchestrator", tokens: 38, type: "result" },
      ],
    },
    {
      id: "collect-start",
      triggeredAtStart: "collect",
      type: "orchestrator",
      content: "All workers complete. Collecting summaries...\n\nNote: Orchestrator context is ~200 tokens. Each worker used 500-800 tokens internally—none of that polluted the orchestrator.",
      context: [
        { label: "Context Isolation", value: "Workers' internal context stays isolated", tokens: 25, type: "state" },
      ],
    },
    {
      id: "final-summary",
      triggeredByTaskId: "collect",
      type: "complete",
      content: "✓ Dark mode implementation complete!\n\n**Created:**\n• 3 TypeScript interfaces (src/types/theme.ts)\n• 2 API endpoints (GET/POST /api/theme)\n• 1 UI component (ThemeToggle)\n\nAll changes are type-safe and follow existing patterns.",
      context: [
        { label: "Final Report", value: "Synthesized from 3 worker summaries", tokens: 80, type: "output" },
      ],
    },
  ],
};

// Export scenarios for reuse in cost comparison component
export const orchestrationScenarios: Scenario[] = [searchMapReduceScenario, coordinationScenario];
const scenarios = orchestrationScenarios;

// ============================================================================
// Helper Functions
// ============================================================================

function getNodePosition(task: DAGTask) {
  return {
    x: PADDING + task.column * COLUMN_GAP,
    y: PADDING + task.row * ROW_GAP,
  };
}

function getEdgePath(from: DAGTask, to: DAGTask): string {
  const fromPos = getNodePosition(from);
  const toPos = getNodePosition(to);
  
  const startX = fromPos.x + NODE_WIDTH;
  const startY = fromPos.y + NODE_HEIGHT / 2;
  const endX = toPos.x;
  const endY = toPos.y + NODE_HEIGHT / 2;
  
  const midX = (startX + endX) / 2;
  
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

function calculateDimensions(tasks: DAGTask[]) {
  const maxCol = Math.max(...tasks.map(t => t.column));
  const maxRow = Math.max(...tasks.map(t => t.row));
  return {
    width: PADDING * 2 + maxCol * COLUMN_GAP + NODE_WIDTH,
    height: PADDING * 2 + maxRow * ROW_GAP + NODE_HEIGHT,
  };
}

const statusColors = {
  pending: {
    bg: "bg-slate-800/50",
    border: "border-slate-600/50",
    text: "text-slate-400",
    nodeBg: "rgba(51, 65, 85, 0.3)",
    nodeStroke: "rgba(100, 116, 139, 0.5)",
  },
  running: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/60",
    text: "text-amber-400",
    nodeBg: "rgba(245, 158, 11, 0.15)",
    nodeStroke: "rgba(245, 158, 11, 0.8)",
  },
  completed: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/60",
    text: "text-emerald-400",
    nodeBg: "rgba(16, 185, 129, 0.15)",
    nodeStroke: "rgba(16, 185, 129, 0.8)",
  },
};

// ============================================================================
// Helper: Compute tasks completed at a given point
// ============================================================================

function getCompletedTasksAtPoint(
  selectedTaskId: string,
  tasks: DAGTask[]
): Set<string> {
  // Returns the set of task IDs that would be complete when selectedTaskId completes
  // This includes: all ancestors (transitive dependencies) + the selected task itself
  
  const completed = new Set<string>();
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  
  function addAncestors(taskId: string) {
    const task = taskMap.get(taskId);
    if (!task) return;
    
    for (const depId of task.dependencies) {
      if (!completed.has(depId)) {
        completed.add(depId);
        addAncestors(depId);
      }
    }
  }
  
  // Add all ancestors
  addAncestors(selectedTaskId);
  // Add the selected task itself
  completed.add(selectedTaskId);
  
  // For parallel siblings that would complete before/with the selected task,
  // we need to check their completion times based on duration
  // Find tasks that share the same dependencies as selectedTask
  const selectedTask = taskMap.get(selectedTaskId);
  if (selectedTask) {
    // Find sibling tasks (same parent dependencies)
    const siblings = tasks.filter(t => 
      t.id !== selectedTaskId &&
      t.dependencies.length > 0 &&
      t.dependencies.every(d => selectedTask.dependencies.includes(d)) &&
      selectedTask.dependencies.every(d => t.dependencies.includes(d))
    );
    
    // Add siblings that would complete before or at the same time
    // (based on duration - shorter or equal duration means they complete first)
    for (const sibling of siblings) {
      if (sibling.duration <= selectedTask.duration) {
        completed.add(sibling.id);
      }
    }
  }
  
  return completed;
}

// ============================================================================
// Chat Panel Component
// ============================================================================

interface ChatPanelProps {
  messages: ChatMessage[];
  tasks: DAGTask[];
  selectedTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  playbackVisibleIds: Set<string>;
}

// Helper to render a worker internal message
function WorkerInternalMessage({ msg }: { msg: WorkerMessage }) {
  const typeStyles = {
    task_start: {
      bg: "bg-violet-500/10 border border-violet-500/30",
      icon: "📋",
      label: "Task",
      labelColor: "text-violet-400",
    },
    thought: {
      bg: "bg-blue-500/10 border border-blue-500/30",
      icon: "💭",
      label: "Thinking",
      labelColor: "text-blue-400",
    },
    tool_call: {
      bg: "bg-cyan-500/10 border border-cyan-500/30 font-mono",
      icon: "→",
      label: "Tool Call",
      labelColor: "text-cyan-400",
    },
    tool_result: {
      bg: "bg-slate-700/50 border border-slate-600/30 font-mono",
      icon: "←",
      label: "Result",
      labelColor: "text-slate-400",
    },
    output: {
      bg: "bg-emerald-500/10 border border-emerald-500/30",
      icon: "✓",
      label: "Output",
      labelColor: "text-emerald-400",
    },
  };
  
  const style = typeStyles[msg.type];
  
  return (
    <div className={cn("px-3 py-2 rounded-lg text-sm transition-all duration-200", style.bg)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs">{style.icon}</span>
        <span className={cn("text-[9px] font-medium uppercase tracking-wider", style.labelColor)}>
          {style.label}
        </span>
        {msg.tokens && (
          <span className="ml-auto text-[8px] text-muted-foreground font-mono">
            ~{msg.tokens} tokens
          </span>
        )}
      </div>
      <p className={cn(
        "whitespace-pre-wrap leading-relaxed m-0",
        msg.type === "tool_call" || msg.type === "tool_result" ? "text-[11px]" : "text-[13px]"
      )}>
        {msg.content}
      </p>
    </div>
  );
}

// Tab definition for chat sessions
interface ChatTab {
  id: string;
  label: string;
  shortLabel: string;
  type: "orchestrator" | "worker";
  taskId?: string;
  color: string;
}

function ChatPanel({ messages, tasks, selectedTaskId, onSelectTask, playbackVisibleIds }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("orchestrator");
  
  // Build tabs: orchestrator + all workers with internal chats
  const tabs = useMemo<ChatTab[]>(() => {
    const workerTabs: ChatTab[] = tasks
      .filter(t => t.internalChat && t.internalChat.length > 0)
      .map(t => ({
        id: t.id,
        label: t.name,
        shortLabel: t.shortLabel,
        type: "worker" as const,
        taskId: t.id,
        color: "amber",
      }));
    
    return [
      { id: "orchestrator", label: "Orchestrator", shortLabel: "Orch", type: "orchestrator", color: "violet" },
      ...workerTabs,
    ];
  }, [tasks]);

  // Sync active tab with selected task from DAG
  useEffect(() => {
    if (selectedTaskId) {
      const matchingTab = tabs.find(t => t.taskId === selectedTaskId);
      if (matchingTab) {
        setActiveTab(matchingTab.id);
      } else {
        // Non-worker node selected, show orchestrator
        setActiveTab("orchestrator");
      }
    }
  }, [selectedTaskId, tabs]);

  // Handle tab click - also update DAG selection
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.taskId) {
      onSelectTask(tab.taskId);
    } else {
      onSelectTask(null);
    }
  };
  
  // Get current tab data
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const selectedTask = currentTab.taskId ? tasks.find(t => t.id === currentTab.taskId) : null;
  const isWorkerView = currentTab.type === "worker" && selectedTask?.internalChat;
  
  // Compute orchestrator messages
  const orchestratorMessages = useMemo(() => {
    return messages.filter(m => playbackVisibleIds.has(m.id));
  }, [messages, playbackVisibleIds]);
  
  // Auto-scroll when content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [orchestratorMessages.length, activeTab]);

  // Calculate token count for worker internal chat
  const workerTokens = selectedTask?.internalChat?.reduce((sum, m) => sum + (m.tokens || 0), 0) || 0;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/30 overflow-hidden">
      {/* Tab Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isSelected = selectedTaskId === tab.taskId;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap",
                  "border border-b-0 -mb-px relative",
                  isActive ? [
                    "bg-card/80 border-border z-10",
                    tab.type === "orchestrator" ? "text-violet-400" : "text-amber-400",
                  ] : [
                    "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  ],
                  isSelected && !isActive && "ring-1 ring-cyan-500/50"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    tab.type === "orchestrator" ? "bg-violet-500" : "bg-amber-500",
                    !isActive && "opacity-50"
                  )} />
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab Header Info */}
      <div className={cn(
        "px-4 py-2 border-b bg-muted/20",
        isWorkerView ? "border-amber-500/20" : "border-border"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isWorkerView ? "bg-amber-500" : "bg-violet-500"
            )} />
            <h5 className="font-semibold text-foreground text-sm">
              {currentTab.label}
            </h5>
          </div>
          {isWorkerView && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
              ~{workerTokens} tokens isolated
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground m-0 mt-0.5">
          {isWorkerView 
            ? "Internal session — hidden from orchestrator"
            : "Main conversation flow"
          }
        </p>
      </div>
      
      {/* Chat Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[280px] max-h-[380px]">
        {isWorkerView && selectedTask?.internalChat ? (
          // Show worker internal chat
          <>
            {/* Context isolation banner */}
            <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-3">
              <p className="text-[11px] text-amber-400 m-0 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Isolated session — this context stays inside the worker
              </p>
            </div>
            {selectedTask.internalChat.map(msg => (
              <WorkerInternalMessage key={msg.id} msg={msg} />
            ))}
            {/* Summary that returns to orchestrator */}
            <div className="mt-4 pt-3 border-t border-amber-500/20">
              <p className="text-[10px] text-amber-400/80 m-0 mb-2 font-medium">↑ All above stays isolated</p>
              <p className="text-[10px] text-muted-foreground m-0">
                Only the final <strong className="text-emerald-400">Output</strong> message returns to the orchestrator 
                (~{selectedTask.internalChat.find(m => m.type === "output")?.tokens || 50} tokens).
              </p>
            </div>
          </>
        ) : orchestratorMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Press Play to start simulation
          </div>
        ) : (
          // Orchestrator view
          orchestratorMessages.map(msg => {
            return (
              <div key={msg.id} className="relative">
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    msg.type === "user" && "bg-muted/50 border border-border text-muted-foreground",
                    msg.type === "orchestrator" && "bg-violet-500/10 border border-violet-500/30 text-foreground",
                    msg.type === "tool_call" && "bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs",
                    msg.type === "tool_result" && "bg-slate-700/50 border border-slate-600/30 font-mono text-xs",
                    msg.type === "worker" && "bg-amber-500/10 border border-amber-500/30 text-foreground",
                    msg.type === "complete" && "bg-emerald-500/10 border border-emerald-500/30 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
                        msg.type === "user" && "bg-muted text-muted-foreground",
                        msg.type === "orchestrator" && "bg-violet-500/30 text-violet-400",
                        msg.type === "tool_call" && "bg-cyan-500/30 text-cyan-400",
                        msg.type === "tool_result" && "bg-slate-600/50 text-slate-400",
                        msg.type === "worker" && "bg-amber-500/30 text-amber-400",
                        msg.type === "complete" && "bg-emerald-500/30 text-emerald-400"
                      )}
                    >
                      {msg.type === "user" ? "U" : msg.type === "worker" ? "W" : "O"}
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-medium uppercase tracking-wider",
                        msg.type === "user" && "text-muted-foreground",
                        msg.type === "orchestrator" && "text-violet-400",
                        msg.type === "tool_call" && "text-cyan-400",
                        msg.type === "tool_result" && "text-slate-400",
                        msg.type === "worker" && "text-amber-400",
                        msg.type === "complete" && "text-emerald-400"
                      )}
                    >
                      {msg.sender || (msg.type === "user" ? "User" : msg.type === "worker" ? "Worker" : "Orchestrator")}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed m-0 text-[13px]">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DAG Panel Component
// ============================================================================

interface DAGPanelProps {
  tasks: TaskState[];
  selectedTaskId: string | null;
  onSelectTask: (id: string | null) => void;
}

function DAGPanel({ tasks, selectedTaskId, onSelectTask }: DAGPanelProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  
  const { width: svgWidth, height: svgHeight } = useMemo(
    () => calculateDimensions(tasks),
    [tasks]
  );

  // Compute which tasks would be complete when selectedTaskId completes
  const completedAtSelection = useMemo(() => {
    if (!selectedTaskId) return new Set<string>();
    return getCompletedTasksAtPoint(selectedTaskId, tasks);
  }, [selectedTaskId, tasks]);

  const activeTaskId = selectedTaskId || hoveredTaskId;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <h5 className="font-semibold text-foreground text-sm">DAG Visualization</h5>
          </div>
          {selectedTaskId && (
            <button
              onClick={() => onSelectTask(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground m-0 mt-1">
          Click a node to filter the chat view
        </p>
      </div>
      
      <div className="flex-1 relative overflow-auto min-h-[300px]">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        
        <svg
          width={svgWidth}
          height={svgHeight}
          className="min-w-full relative z-10"
          style={{ minHeight: svgHeight }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onSelectTask(null);
            }
          }}
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(148, 163, 184, 0.5)" />
            </marker>
            <marker id="arrow-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(16, 185, 129, 0.8)" />
            </marker>
            <marker id="arrow-selected" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(34, 211, 238, 0.8)" />
            </marker>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          <g className="edges" style={{ pointerEvents: 'none' }}>
            {tasks.map(task =>
              task.dependencies.map(depId => {
                const depTask = tasks.find(t => t.id === depId);
                if (!depTask) return null;
                
                // When a node is selected, highlight edges in the path
                const isInSelectionPath = selectedTaskId && 
                  completedAtSelection.has(depId) && 
                  completedAtSelection.has(task.id);
                const isActive = depTask.status === "completed";
                const isHighlighted = activeTaskId === task.id || activeTaskId === depId;
                
                return (
                  <path
                    key={`${depId}-${task.id}`}
                    d={getEdgePath(depTask, task)}
                    fill="none"
                    stroke={
                      isInSelectionPath ? "rgba(34, 211, 238, 0.7)" :
                      isActive ? "rgba(16, 185, 129, 0.6)" : 
                      "rgba(148, 163, 184, 0.3)"
                    }
                    strokeWidth={isHighlighted || isInSelectionPath ? 2.5 : 1.5}
                    strokeDasharray={isActive || isInSelectionPath ? "none" : "5 3"}
                    markerEnd={
                      isInSelectionPath ? "url(#arrow-selected)" :
                      isActive ? "url(#arrow-active)" : 
                      "url(#arrow)"
                    }
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {tasks.map(task => {
              const pos = getNodePosition(task);
              const isHovered = hoveredTaskId === task.id;
              const isSelected = selectedTaskId === task.id;
              const isInSelectionPath = selectedTaskId && completedAtSelection.has(task.id);
              const isActive = isHovered || isSelected;
              
              // Determine visual state
              let nodeBg: string;
              let nodeStroke: string;
              let statusIndicator: string;
              
              if (isSelected) {
                nodeBg = "rgba(34, 211, 238, 0.2)";
                nodeStroke = "rgba(34, 211, 238, 1)";
                statusIndicator = "#22D3EE";
              } else if (isInSelectionPath) {
                nodeBg = "rgba(34, 211, 238, 0.1)";
                nodeStroke = "rgba(34, 211, 238, 0.6)";
                statusIndicator = "#22D3EE";
              } else {
                const colors = statusColors[task.status];
                nodeBg = colors.nodeBg;
                nodeStroke = isHovered ? "rgba(34, 211, 238, 0.8)" : colors.nodeStroke;
                statusIndicator = task.status === "completed" ? "#10B981" :
                  task.status === "running" ? "#F59E0B" : "#64748B";
              }
              
              return (
                <g
                  key={task.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTask(selectedTaskId === task.id ? null : task.id);
                  }}
                  className="cursor-pointer"
                  style={{ filter: (task.status !== "pending" || isInSelectionPath) ? "url(#glow)" : "none" }}
                >
                  {/* Invisible larger hit area */}
                  <rect
                    x="-5"
                    y="-5"
                    width={NODE_WIDTH + 10}
                    height={NODE_HEIGHT + 10}
                    fill="transparent"
                  />
                  
                  <rect
                    x="0"
                    y="0"
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="8"
                    fill={nodeBg}
                    stroke={nodeStroke}
                    strokeWidth={isActive || isSelected ? 2 : 1.5}
                    className="transition-all duration-300"
                  />
                  
                  {/* Selection ring */}
                  {isSelected && (
                    <rect
                      x="-3"
                      y="-3"
                      width={NODE_WIDTH + 6}
                      height={NODE_HEIGHT + 6}
                      rx="11"
                      fill="none"
                      stroke="rgba(34, 211, 238, 0.5)"
                      strokeWidth="2"
                    />
                  )}
                  
                  {task.status === "running" && !isInSelectionPath && (
                    <rect
                      x="-2"
                      y="-2"
                      width={NODE_WIDTH + 4}
                      height={NODE_HEIGHT + 4}
                      rx="10"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.4)"
                      strokeWidth="2"
                      className="animate-pulse"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill={statusIndicator}
                    className={task.status === "running" && !isInSelectionPath ? "animate-pulse" : ""}
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {(task.status === "completed" || isInSelectionPath) && (
                    <path
                      d="M9.5 12 L11.5 14 L15 10"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  
                  <text
                    x={NODE_WIDTH / 2}
                    y={NODE_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-current"
                    style={{ 
                      fill: isActive || isInSelectionPath ? "#22D3EE" : "#E2E8F0", 
                      pointerEvents: 'none' 
                    }}
                  >
                    {task.shortLabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface UnifiedOrchestrationVisualizerProps {
  className?: string;
}

export function UnifiedOrchestrationVisualizer({ className }: UnifiedOrchestrationVisualizerProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("search-mapreduce");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const scenario = useMemo(
    () => scenarios.find(s => s.id === selectedScenario) || scenarios[0],
    [selectedScenario]
  );

  // Initialize when scenario changes
  useEffect(() => {
    setTasks(scenario.tasks.map(task => ({ ...task, status: "pending" })));
    setVisibleMessageIds(new Set());
    setIsPlaying(false);
    setExecutionTime(0);
    setSelectedTaskId(null);
  }, [scenario]);

  const reset = useCallback(() => {
    setTasks(scenario.tasks.map(task => ({ ...task, status: "pending" })));
    setVisibleMessageIds(new Set());
    setIsPlaying(false);
    setExecutionTime(0);
    setSelectedTaskId(null);
  }, [scenario]);

  const canStart = useCallback((task: TaskState, currentTasks: TaskState[]) => {
    if (task.status !== "pending") return false;
    return task.dependencies.every(depId => {
      const dep = currentTasks.find(t => t.id === depId);
      return dep?.status === "completed";
    });
  }, []);

  // Update visible messages based on task states
  const updateVisibleMessages = useCallback((currentTasks: TaskState[]) => {
    const newVisibleIds = new Set<string>();
    
    // Always show initial user message
    const userMsg = scenario.chatMessages.find(m => m.type === "user");
    if (userMsg) newVisibleIds.add(userMsg.id);
    
    for (const msg of scenario.chatMessages) {
      // Show message if its triggering task has started
      if (msg.triggeredAtStart) {
        const task = currentTasks.find(t => t.id === msg.triggeredAtStart);
        if (task && (task.status === "running" || task.status === "completed")) {
          newVisibleIds.add(msg.id);
        }
      }
      // Show message if its triggering task has completed
      if (msg.triggeredByTaskId) {
        const task = currentTasks.find(t => t.id === msg.triggeredByTaskId);
        if (task && task.status === "completed") {
          newVisibleIds.add(msg.id);
        }
      }
    }
    
    setVisibleMessageIds(newVisibleIds);
  }, [scenario.chatMessages]);

  // Playback logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setExecutionTime(prev => prev + 50 * playbackSpeed);
      
      setTasks(currentTasks => {
        let updated = false;
        const newTasks = currentTasks.map(task => {
          // Start tasks whose dependencies are met
          if (canStart(task, currentTasks)) {
            updated = true;
            return { ...task, status: "running" as TaskStatus, startTime: executionTime };
          }
          
          // Complete running tasks after their duration
          if (task.status === "running" && task.startTime !== undefined) {
            const elapsed = executionTime - task.startTime;
            if (elapsed >= task.duration / playbackSpeed) {
              updated = true;
              return { ...task, status: "completed" as TaskStatus };
            }
          }
          
          return task;
        });
        
        // Check if all complete
        if (newTasks.every(t => t.status === "completed")) {
          setTimeout(() => setIsPlaying(false), 100);
        }
        
        // Update messages based on new task states
        if (updated) {
          updateVisibleMessages(newTasks);
        }
        
        return updated ? newTasks : currentTasks;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, executionTime, canStart, playbackSpeed, updateVisibleMessages]);

  // Start first task(s) when playing begins
  useEffect(() => {
    if (isPlaying && tasks.every(t => t.status === "pending")) {
      setTasks(currentTasks => {
        const newTasks = currentTasks.map(task =>
          task.dependencies.length === 0
            ? { ...task, status: "running" as TaskStatus, startTime: 0 }
            : task
        );
        updateVisibleMessages(newTasks);
        return newTasks;
      });
      
      // Show user message immediately
      const userMsg = scenario.chatMessages.find(m => m.type === "user");
      if (userMsg) {
        setVisibleMessageIds(new Set([userMsg.id]));
      }
    }
  }, [isPlaying, tasks, scenario.chatMessages, updateVisibleMessages]);

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const runningCount = tasks.filter(t => t.status === "running").length;
  const progress = (completedCount / tasks.length) * 100;
  const allComplete = tasks.every(t => t.status === "completed");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Scenario Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedScenario === s.id
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Scenario Description */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
        <div className={cn(
          "flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          scenario.patternType === "static" 
            ? "bg-violet-500/20 text-violet-400" 
            : "bg-amber-500/20 text-amber-400"
        )}>
          {scenario.patternType === "static" ? "Static DAG" : "Dynamic"}
        </div>
        <div>
          <p className="text-sm text-foreground font-medium mb-1 m-0">{scenario.description}</p>
          <p className="text-xs text-muted-foreground m-0">{scenario.patternDescription}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (allComplete) {
                reset();
                setTimeout(() => setIsPlaying(true), 50);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              isPlaying
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
            )}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </>
            ) : allComplete ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Replay
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Play
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-muted/50 border border-border rounded px-2 py-1 text-sm text-foreground"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-muted-foreground">Running ({runningCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Done ({completedCount}/{tasks.length})</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {runningCount > 0 && (
          <div
            className="absolute inset-y-0 bg-amber-500/50 animate-pulse transition-all duration-300"
            style={{ 
              left: `${progress}%`,
              width: `${(runningCount / tasks.length) * 100}%`
            }}
          />
        )}
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChatPanel
          messages={scenario.chatMessages}
          tasks={scenario.tasks}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          playbackVisibleIds={visibleMessageIds}
        />
        <DAGPanel
          tasks={tasks}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
        />
      </div>

      {/* Pattern Insight Callout */}
      <div className={cn(
        "rounded-lg p-4 border",
        scenario.patternType === "static" 
          ? "bg-violet-500/5 border-violet-500/20" 
          : "bg-amber-500/5 border-amber-500/20"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
            scenario.patternType === "static" ? "bg-violet-500/20" : "bg-amber-500/20"
          )}>
            {scenario.patternType === "static" ? (
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className={cn(
              "font-medium mb-1",
              scenario.patternType === "static" ? "text-violet-400" : "text-amber-400"
            )}>
              {scenario.patternType === "static" ? "MapReduce Pattern" : "Delegation Pattern"}
            </h4>
            <p className="text-sm text-muted-foreground m-0">
              {scenario.patternType === "static" ? (
                <>
                  <strong className="text-foreground">Fan-out/reduce</strong> parallelizes independent work, then combines results. 
                  The synthesizer receives <strong className="text-foreground">~200 tokens</strong> of summaries instead of 
                  <strong className="text-foreground"> ~3,400 tokens</strong> of raw documents—an 17x context reduction while 
                  preserving all relevant information.
                </>
              ) : (
                <>
                  <strong className="text-foreground">Isolated workers</strong> each accumulate 500-800 tokens of context 
                  (tool calls, file contents, generated code). The orchestrator only sees <strong className="text-foreground">~35 
                  token summaries</strong> from each. Three workers, <strong className="text-foreground">zero context pollution</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
