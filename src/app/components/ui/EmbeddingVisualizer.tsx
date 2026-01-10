"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Types
interface WordPoint {
  word: string;
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  embedding: number[];
  category: string;
  isNew?: boolean;
}

interface EmbeddingVisualizerProps {
  className?: string;
}

// Default words to start with
const DEFAULT_WORDS = [
  "cat", "dog", "bird", "fish", "lion",
  "computer", "phone", "robot", "algorithm", "data",
  "happy", "sad", "angry", "love", "fear",
  "apple", "pizza", "coffee", "bread", "chocolate",
  "king", "queen", "man", "woman",
  "run", "walk", "think", "speak",
];

// Color palette for categories  
const CATEGORY_COLORS: Record<string, string> = {
  animals: "#22d3ee",
  tech: "#a78bfa",
  emotions: "#f472b6",
  food: "#fbbf24",
  people: "#60a5fa",
  actions: "#34d399",
  user: "#f97316",
};

// Categorize words
function getCategory(word: string): string {
  const w = word.toLowerCase();
  const categories: Record<string, string[]> = {
    animals: ["cat", "dog", "bird", "fish", "lion", "tiger", "elephant", "mouse", "bear", "wolf", "puma", "lions", "cats", "dogs", "kitten", "puppy"],
    tech: ["computer", "phone", "robot", "algorithm", "data", "software", "internet", "code", "ai", "machine", "programming", "technology"],
    emotions: ["happy", "sad", "angry", "love", "fear", "joy", "hope", "hate", "excited", "worried", "happiness", "sadness"],
    food: ["apple", "pizza", "coffee", "bread", "chocolate", "banana", "cheese", "water", "tea", "cake", "fruit", "food"],
    people: ["king", "queen", "man", "woman", "boy", "girl", "father", "mother", "child", "person", "human"],
    actions: ["run", "walk", "think", "speak", "learn", "write", "read", "sleep", "eat", "jump", "running", "walking"],
  };
  
  for (const [cat, words] of Object.entries(categories)) {
    if (words.includes(w)) return cat;
  }
  return "user";
}

// Simple t-SNE implementation for 2D projection
function tsne2D(embeddings: number[][], perplexity = 5, iterations = 500, learningRate = 100): number[][] {
  const n = embeddings.length;
  if (n < 2) return [[0.5, 0.5]];
  
  // Initialize random 2D positions
  const Y: number[][] = embeddings.map(() => [
    Math.random() * 0.1 - 0.05,
    Math.random() * 0.1 - 0.05,
  ]);
  
  // Compute pairwise distances in high-dimensional space
  const distances: number[][] = [];
  for (let i = 0; i < n; i++) {
    distances[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        distances[i][j] = 0;
      } else {
        let sum = 0;
        for (let k = 0; k < embeddings[i].length; k++) {
          const diff = embeddings[i][k] - embeddings[j][k];
          sum += diff * diff;
        }
        distances[i][j] = sum;
      }
    }
  }
  
  // Compute conditional probabilities P(j|i) with perplexity
  const P: number[][] = [];
  const targetEntropy = Math.log(Math.min(perplexity, n - 1));
  
  for (let i = 0; i < n; i++) {
    P[i] = [];
    let betaMin = -Infinity;
    let betaMax = Infinity;
    let beta = 1;
    
    for (let iter = 0; iter < 50; iter++) {
      let sumP = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          P[i][j] = Math.exp(-distances[i][j] * beta);
          sumP += P[i][j];
        } else {
          P[i][j] = 0;
        }
      }
      
      for (let j = 0; j < n; j++) {
        P[i][j] /= sumP + 1e-10;
      }
      
      let entropy = 0;
      for (let j = 0; j < n; j++) {
        if (P[i][j] > 1e-10) {
          entropy -= P[i][j] * Math.log(P[i][j]);
        }
      }
      
      if (Math.abs(entropy - targetEntropy) < 1e-5) break;
      
      if (entropy > targetEntropy) {
        betaMin = beta;
        beta = betaMax === Infinity ? beta * 2 : (beta + betaMax) / 2;
      } else {
        betaMax = beta;
        beta = betaMin === -Infinity ? beta / 2 : (beta + betaMin) / 2;
      }
    }
  }
  
  // Symmetrize
  const Psym: number[][] = [];
  for (let i = 0; i < n; i++) {
    Psym[i] = [];
    for (let j = 0; j < n; j++) {
      Psym[i][j] = (P[i][j] + P[j][i]) / (2 * n);
    }
  }
  
  // Gradient descent
  const momentum = 0.8;
  const gains: number[][] = Y.map(() => [1, 1]);
  const velocities: number[][] = Y.map(() => [0, 0]);
  
  for (let iter = 0; iter < iterations; iter++) {
    const Q: number[][] = [];
    let sumQ = 0;
    
    for (let i = 0; i < n; i++) {
      Q[i] = [];
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const dx = Y[i][0] - Y[j][0];
          const dy = Y[i][1] - Y[j][1];
          Q[i][j] = 1 / (1 + dx * dx + dy * dy);
          sumQ += Q[i][j];
        } else {
          Q[i][j] = 0;
        }
      }
    }
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        Q[i][j] /= sumQ + 1e-10;
      }
    }
    
    const gradients: number[][] = Y.map(() => [0, 0]);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const mult = 4 * (Psym[i][j] - Q[i][j]) * Q[i][j] * (sumQ + 1e-10);
          gradients[i][0] += mult * (Y[i][0] - Y[j][0]);
          gradients[i][1] += mult * (Y[i][1] - Y[j][1]);
        }
      }
    }
    
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < 2; d++) {
        const signMatch = Math.sign(gradients[i][d]) === Math.sign(velocities[i][d]);
        gains[i][d] = signMatch ? gains[i][d] * 0.8 : gains[i][d] + 0.2;
        gains[i][d] = Math.max(gains[i][d], 0.01);
        
        velocities[i][d] = momentum * velocities[i][d] - learningRate * gains[i][d] * gradients[i][d];
        Y[i][d] += velocities[i][d];
      }
    }
    
    const meanX = Y.reduce((s, p) => s + p[0], 0) / n;
    const meanY = Y.reduce((s, p) => s + p[1], 0) / n;
    for (let i = 0; i < n; i++) {
      Y[i][0] -= meanX;
      Y[i][1] -= meanY;
    }
  }
  
  // Normalize to [0.08, 0.92]
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const [x, y] of Y) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const padding = 0.08;
  
  return Y.map(([x, y]) => [
    padding + (x - minX) / rangeX * (1 - 2 * padding),
    padding + (y - minY) / rangeY * (1 - 2 * padding),
  ]);
}

// Compute cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function EmbeddingVisualizer({ className }: EmbeddingVisualizerProps) {
  const [words, setWords] = useState<WordPoint[]>([]);
  const [inputWord, setInputWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Loading model...");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newlyAddedWord, setNewlyAddedWord] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipelineRef = useRef<any>(null);
  const embeddingsRef = useRef<Map<string, number[]>>(new Map());
  const previousPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Get embedding for a single word
  const getEmbedding = useCallback(async (word: string): Promise<number[]> => {
    const cached = embeddingsRef.current.get(word.toLowerCase());
    if (cached) return cached;
    
    if (!pipelineRef.current) {
      throw new Error("Model not loaded");
    }
    
    const output = await pipelineRef.current(word, { 
      pooling: "mean", 
      normalize: true 
    });
    
    const embedding = Array.from(output.data as Float32Array);
    embeddingsRef.current.set(word.toLowerCase(), embedding);
    return embedding;
  }, []);

  // Recompute all positions using t-SNE with animation support
  const recomputePositions = useCallback(async (
    wordList: string[], 
    newWord?: string
  ) => {
    if (wordList.length === 0) return;
    
    // Store current positions for animation
    const prevPositions = new Map<string, { x: number; y: number }>();
    words.forEach(w => {
      prevPositions.set(w.word, { x: w.x, y: w.y });
    });
    previousPositionsRef.current = prevPositions;
    
    const embeddings: number[][] = [];
    for (const word of wordList) {
      const emb = await getEmbedding(word);
      embeddings.push(emb);
    }
    
    const positions = tsne2D(embeddings, Math.min(5, wordList.length - 1), 300, 50);
    
    // Create word points with previous positions for animation
    const newWords: WordPoint[] = wordList.map((word, i) => {
      const prev = prevPositions.get(word);
      return {
        word,
        x: positions[i][0],
        y: positions[i][1],
        prevX: prev?.x ?? positions[i][0],
        prevY: prev?.y ?? positions[i][1],
        embedding: embeddings[i],
        category: getCategory(word),
        isNew: word === newWord,
      };
    });
    
    // Start animation sequence
    if (newWord) {
      setIsAnimating(true);
      setNewlyAddedWord(newWord);
      
      // First, set words at their previous positions
      setWords(newWords.map(w => ({
        ...w,
        x: w.prevX ?? w.x,
        y: w.prevY ?? w.y,
      })));
      
      // Then animate to new positions
      requestAnimationFrame(() => {
        setTimeout(() => {
          setWords(newWords);
          
          // Clear animation state after transition completes
          setTimeout(() => {
            setIsAnimating(false);
            // Keep highlight for a bit longer
            setTimeout(() => {
              setNewlyAddedWord(null);
              setWords(prev => prev.map(w => ({ ...w, isNew: false })));
            }, 2000);
          }, 800);
        }, 50);
      });
    } else {
      setWords(newWords);
    }
  }, [words, getEmbedding]);

  // Initialize model
  useEffect(() => {
    let cancelled = false;
    
    async function init() {
      try {
        setLoadingStatus("Loading embedding model...");
        
        // Dynamic import to avoid SSR issues
        const transformers = await import("@xenova/transformers");
        
        // Configure
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
        
        if (cancelled) return;
        
        const extractor = await transformers.pipeline(
          "feature-extraction",
          "Xenova/all-MiniLM-L6-v2",
          {
            progress_callback: (progress: { status: string; progress?: number }) => {
              if (progress.status === "progress" && progress.progress !== undefined) {
                setLoadingStatus(`Downloading: ${Math.round(progress.progress)}%`);
              } else if (progress.status === "ready") {
                setLoadingStatus("Computing embeddings...");
              }
            },
          }
        );
        
        if (cancelled) return;
        
        pipelineRef.current = extractor;
        setLoadingStatus("Computing word embeddings...");
        
        // Compute default words
        const embeddings: number[][] = [];
        for (const word of DEFAULT_WORDS) {
          const output = await extractor(word, { pooling: "mean", normalize: true });
          const emb = Array.from(output.data as Float32Array);
          embeddings.push(emb);
          embeddingsRef.current.set(word.toLowerCase(), emb);
        }
        
        if (cancelled) return;
        
        // Run t-SNE
        const positions = tsne2D(embeddings, 5, 300, 50);
        
        const newWords: WordPoint[] = DEFAULT_WORDS.map((word, i) => ({
          word,
          x: positions[i][0],
          y: positions[i][1],
          embedding: embeddings[i],
          category: getCategory(word),
        }));
        
        setWords(newWords);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize:", err);
        setError(err instanceof Error ? err.message : "Failed to load model");
        setIsLoading(false);
      }
    }
    
    init();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Add a new word
  const handleAddWord = useCallback(async () => {
    const trimmed = inputWord.trim().toLowerCase();
    if (!trimmed || !pipelineRef.current || isAnimating) return;
    
    if (words.some(w => w.word.toLowerCase() === trimmed)) {
      setInputWord("");
      return;
    }
    
    setIsLoading(true);
    setLoadingStatus("Computing embedding...");
    
    try {
      const allWords = [...words.map(w => w.word), trimmed];
      await recomputePositions(allWords, trimmed);
      setInputWord("");
    } catch (err) {
      console.error("Failed to add word:", err);
    }
    
    setIsLoading(false);
  }, [inputWord, words, recomputePositions, isAnimating]);

  // Remove a word  
  const handleRemoveWord = useCallback(async (wordToRemove: string) => {
    if (isAnimating) return;
    const remaining = words.filter(w => w.word !== wordToRemove);
    if (remaining.length < 2) return;
    
    setIsLoading(true);
    setLoadingStatus("Recalculating...");
    
    await recomputePositions(remaining.map(w => w.word));
    if (selectedWord === wordToRemove) setSelectedWord(null);
    
    setIsLoading(false);
  }, [words, selectedWord, recomputePositions, isAnimating]);

  // Reset
  const handleReset = useCallback(async () => {
    if (!pipelineRef.current || isAnimating) return;
    
    setIsLoading(true);
    setLoadingStatus("Resetting...");
    setNewlyAddedWord(null);
    
    const embeddings: number[][] = [];
    for (const word of DEFAULT_WORDS) {
      const cached = embeddingsRef.current.get(word.toLowerCase());
      if (cached) {
        embeddings.push(cached);
      } else {
        const output = await pipelineRef.current(word, { pooling: "mean", normalize: true });
        const emb = Array.from(output.data as Float32Array);
        embeddings.push(emb);
        embeddingsRef.current.set(word.toLowerCase(), emb);
      }
    }
    
    const positions = tsne2D(embeddings, 5, 300, 50);
    
    const newWords: WordPoint[] = DEFAULT_WORDS.map((word, i) => ({
      word,
      x: positions[i][0],
      y: positions[i][1],
      embedding: embeddings[i],
      category: getCategory(word),
    }));
    
    setWords(newWords);
    setSelectedWord(null);
    setIsLoading(false);
  }, [isAnimating]);

  // Get similarity
  const getSimilarity = useCallback((w1: WordPoint, w2: WordPoint): number => {
    return Math.round(cosineSimilarity(w1.embedding, w2.embedding) * 100);
  }, []);

  // Nearest neighbors
  const nearestNeighbors = selectedWord ? (() => {
    const selected = words.find(w => w.word === selectedWord);
    if (!selected) return [];
    
    return words
      .filter(w => w.word !== selectedWord)
      .map(w => ({ word: w.word, similarity: getSimilarity(selected, w) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  })() : [];

  if (error) {
    return (
      <div className={cn("rounded-xl bg-card border border-border p-8 text-center", className)}>
        <div className="text-4xl mb-4">⚠️</div>
        <h4 className="font-semibold text-foreground mb-2">Failed to Load Model</h4>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--highlight)] text-black hover:opacity-90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-card border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              Word Embedding Explorer
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Real embeddings from all-MiniLM-L6-v2 running in your browser
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
              placeholder="Add a word..."
              disabled={isLoading || isAnimating}
              className="px-3 py-1.5 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]/50 focus:border-[var(--highlight)] w-36 disabled:opacity-50"
            />
            <button
              onClick={handleAddWord}
              disabled={isLoading || isAnimating || !inputWord.trim()}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--highlight)] text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading || isAnimating}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Visualization */}
      <div className="relative" style={{ height: "400px" }}>
        {isLoading && !isAnimating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm z-30">
            <div className="relative w-10 h-10 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--highlight)]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--highlight)] animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">{loadingStatus}</p>
          </div>
        )}
        
        <div className="absolute inset-4 rounded-lg bg-muted/30 border border-border overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="embedding-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#embedding-grid)" />
          </svg>
          
          {/* Connection lines */}
          {selectedWord && !isLoading && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {words.map((point) => {
                if (point.word === selectedWord) return null;
                const selected = words.find(w => w.word === selectedWord);
                if (!selected) return null;
                
                const similarity = getSimilarity(selected, point);
                const opacity = Math.max(0.1, similarity / 100 * 0.6);
                
                return (
                  <line
                    key={`line-${point.word}`}
                    x1={`${selected.x * 100}%`}
                    y1={`${selected.y * 100}%`}
                    x2={`${point.x * 100}%`}
                    y2={`${point.y * 100}%`}
                    stroke={CATEGORY_COLORS[point.category] || CATEGORY_COLORS.user}
                    strokeWidth="1"
                    strokeOpacity={opacity}
                    strokeDasharray="4 4"
                    className="transition-all duration-700 ease-out"
                  />
                );
              })}
            </svg>
          )}
          
          {/* Word points */}
          {words.map((point) => {
            const isHighlighted = hoveredWord === point.word || selectedWord === point.word;
            const isNewWord = point.word === newlyAddedWord;
            const color = CATEGORY_COLORS[point.category] || CATEGORY_COLORS.user;
            const selected = selectedWord ? words.find(w => w.word === selectedWord) : null;
            const similarity = selected && selectedWord !== point.word 
              ? getSimilarity(selected, point) 
              : null;
            
            return (
              <div
                key={point.word}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group",
                  "transition-all duration-700 ease-out",
                  isHighlighted ? "z-20" : isNewWord ? "z-30" : "z-10"
                )}
                style={{
                  left: `${point.x * 100}%`,
                  top: `${point.y * 100}%`,
                }}
                onMouseEnter={() => setHoveredWord(point.word)}
                onMouseLeave={() => setHoveredWord(null)}
                onClick={() => setSelectedWord(selectedWord === point.word ? null : point.word)}
              >
                {/* Pulse ring for new words */}
                {isNewWord && (
                  <>
                    <div 
                      className="absolute inset-0 -m-3 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: color }}
                    />
                    <div 
                      className="absolute inset-0 -m-4 rounded-full animate-pulse"
                      style={{ 
                        boxShadow: `0 0 20px 8px ${color}`,
                        opacity: 0.5,
                      }}
                    />
                  </>
                )}
                
                {/* Dot */}
                <div
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isNewWord ? "w-5 h-5 -m-1" : "w-3 h-3",
                    (isHighlighted || isNewWord) && "ring-4 ring-opacity-30"
                  )}
                  style={{
                    backgroundColor: color,
                    boxShadow: (isHighlighted || isNewWord) ? `0 0 ${isNewWord ? '20px' : '12px'} ${color}` : "none",
                    transform: isHighlighted && !isNewWord ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
                
                {/* Label - always visible for new words */}
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium transition-all duration-300",
                    isNewWord 
                      ? "opacity-100 -top-8 bg-popover border-2 shadow-lg scale-110"
                      : isHighlighted
                        ? "opacity-100 -top-7 bg-popover border border-border shadow-lg"
                        : "opacity-0 group-hover:opacity-100 -top-5"
                  )}
                  style={{ 
                    color: isNewWord || isHighlighted ? color : undefined,
                    borderColor: isNewWord ? color : undefined,
                  }}
                >
                  {isNewWord && <span className="mr-1">✨</span>}
                  {point.word}
                  {similarity !== null && (
                    <span className="ml-1 text-muted-foreground">({similarity}%)</span>
                  )}
                </div>
                
                {/* Remove button for user words */}
                {point.category === "user" && (isHighlighted || isNewWord) && !isAnimating && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWord(point.word);
                    }}
                    className="absolute -top-1 -right-3 w-4 h-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-muted-foreground font-medium">Categories:</span>
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground capitalize">{category}</span>
            </div>
          ))}
        </div>
        
        {newlyAddedWord && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm">
              <span className="text-[var(--highlight)] font-medium">✨ Added &quot;{newlyAddedWord}&quot;</span>
              <span className="text-muted-foreground"> — watch how the map reorganizes around the new word!</span>
            </p>
          </div>
        )}
        
        {!newlyAddedWord && selectedWord && nearestNeighbors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nearest to &quot;{selectedWord}&quot;:</strong>{" "}
              {nearestNeighbors.map((n, i) => (
                <span key={n.word}>
                  {n.word} <span className="text-[var(--highlight)]">({n.similarity}%)</span>
                  {i < nearestNeighbors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>
        )}
        
        {!newlyAddedWord && !selectedWord && (
          <p className="mt-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Add a word to see how the map reorganizes. 
            Click any word to see cosine similarity scores.
          </p>
        )}
      </div>
    </div>
  );
}
