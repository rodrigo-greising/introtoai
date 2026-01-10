/**
 * Embedding and Vector Space Types
 *
 * These types support embedding visualization and vector space rendering
 * for RAG patterns and semantic similarity demonstrations.
 */

/**
 * Categories for vector points in visualizations
 */
export type VectorCategory =
  | "query"
  | "document"
  | "faq"
  | "hypothetical"
  | "sop"
  | "match"
  | "animals"
  | "tech"
  | "emotions"
  | "food"
  | "people"
  | "actions"
  | "user";

/**
 * A point in the embedding space
 */
export interface EmbeddingPoint {
  id: string;
  /** Display label */
  label: string;
  /** X position (0-1, normalized) */
  x: number;
  /** Y position (0-1, normalized) */
  y: number;
  /** Category for coloring/grouping */
  category: VectorCategory;
  /** Optional text content this point represents */
  content?: string;
  /** Similarity score (0-1) relative to query */
  similarity?: number;
  /** IDs of other points this one links to */
  linkedTo?: string[];
  /** The actual embedding vector (for real embeddings) */
  embedding?: number[];
  /** Whether this point was newly added (for animation) */
  isNew?: boolean;
  /** Previous position (for animation) */
  prevX?: number;
  prevY?: number;
}

/**
 * Category color mapping
 */
export const CATEGORY_COLORS: Record<VectorCategory, string> = {
  query: "#22d3ee",
  document: "#94a3b8",
  faq: "#94a3b8",
  hypothetical: "#a78bfa",
  sop: "#10b981",
  match: "#fbbf24",
  animals: "#22d3ee",
  tech: "#a78bfa",
  emotions: "#f472b6",
  food: "#fbbf24",
  people: "#60a5fa",
  actions: "#34d399",
  user: "#f97316",
};

/**
 * Category display labels
 */
export const CATEGORY_LABELS: Record<VectorCategory, string> = {
  query: "Query",
  document: "Document",
  faq: "FAQ Entry",
  hypothetical: "Hypothetical Q",
  sop: "SOP Document",
  match: "Match",
  animals: "Animals",
  tech: "Technology",
  emotions: "Emotions",
  food: "Food",
  people: "People",
  actions: "Actions",
  user: "User Added",
};

/**
 * Configuration for embedding space visualization
 */
export interface EmbeddingSpaceConfig {
  /** Whether to show the grid background */
  showGrid?: boolean;
  /** Whether to show connection lines */
  showConnections?: boolean;
  /** Whether to show similarity scores */
  showSimilarityScores?: boolean;
  /** Whether to show the legend */
  showLegend?: boolean;
  /** Whether to enable point selection */
  enableSelection?: boolean;
  /** Whether to enable point hover */
  enableHover?: boolean;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
  /** Minimum height */
  minHeight?: number;
}

/**
 * Default embedding space configuration
 */
export const DEFAULT_EMBEDDING_CONFIG: EmbeddingSpaceConfig = {
  showGrid: true,
  showConnections: true,
  showSimilarityScores: true,
  showLegend: true,
  enableSelection: true,
  enableHover: true,
  colorTheme: "cyan",
  minHeight: 280,
};

/**
 * State for interactive embedding exploration
 */
export interface EmbeddingExplorerState {
  points: EmbeddingPoint[];
  selectedPointId: string | null;
  hoveredPointId: string | null;
  isLoading: boolean;
  loadingStatus: string;
  error: string | null;
}

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

/**
 * Get the N nearest neighbors to a point
 */
export function getNearestNeighbors(
  targetId: string,
  points: EmbeddingPoint[],
  n: number = 5
): { point: EmbeddingPoint; similarity: number }[] {
  const target = points.find((p) => p.id === targetId);
  if (!target || !target.embedding) return [];

  return points
    .filter((p) => p.id !== targetId && p.embedding)
    .map((p) => ({
      point: p,
      similarity: cosineSimilarity(target.embedding!, p.embedding!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, n);
}

/**
 * Get color for a category
 */
export function getCategoryColor(category: VectorCategory): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.user;
}

/**
 * Get label for a category
 */
export function getCategoryLabel(category: VectorCategory): string {
  return CATEGORY_LABELS[category] || "Unknown";
}

/**
 * Categorize a word (for embedding explorer)
 */
export function categorizeWord(word: string): VectorCategory {
  const w = word.toLowerCase();

  const categories: Record<VectorCategory, string[]> = {
    animals: [
      "cat", "dog", "bird", "fish", "lion", "tiger", "elephant", "mouse",
      "bear", "wolf", "puma", "lions", "cats", "dogs", "kitten", "puppy",
    ],
    tech: [
      "computer", "phone", "robot", "algorithm", "data", "software",
      "internet", "code", "ai", "machine", "programming", "technology",
    ],
    emotions: [
      "happy", "sad", "angry", "love", "fear", "joy", "hope", "hate",
      "excited", "worried", "happiness", "sadness",
    ],
    food: [
      "apple", "pizza", "coffee", "bread", "chocolate", "banana", "cheese",
      "water", "tea", "cake", "fruit", "food",
    ],
    people: [
      "king", "queen", "man", "woman", "boy", "girl", "father", "mother",
      "child", "person", "human",
    ],
    actions: [
      "run", "walk", "think", "speak", "learn", "write", "read", "sleep",
      "eat", "jump", "running", "walking",
    ],
    // These categories are not word-based
    query: [],
    document: [],
    faq: [],
    hypothetical: [],
    sop: [],
    match: [],
    user: [],
  };

  for (const [cat, words] of Object.entries(categories)) {
    if (words.includes(w)) {
      return cat as VectorCategory;
    }
  }

  return "user";
}
