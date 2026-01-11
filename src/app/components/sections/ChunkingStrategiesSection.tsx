"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Scissors, 
  FileText, 
  Code2,
  BookOpen,
  Layers,
} from "lucide-react";

// =============================================================================
// Chunking Strategy Comparison Visualizer
// =============================================================================

type ChunkingStrategy = "fixed" | "semantic" | "recursive" | "structure";

interface ChunkDisplay {
  id: string;
  content: string;
  type: string;
  overlap?: boolean;
}

function ChunkingComparisonVisualizer() {
  const [activeStrategy, setActiveStrategy] = useState<ChunkingStrategy>("fixed");

  const strategies: Record<ChunkingStrategy, {
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    chunks: ChunkDisplay[];
    pros: string[];
    cons: string[];
  }> = {
    fixed: {
      name: "Fixed-Size",
      icon: <Scissors className="w-4 h-4" />,
      color: "cyan",
      description: "Split at fixed character/token count with optional overlap",
      chunks: [
        { id: "f1", content: "Introduction to Machine Learning\n\nMachine learning is a subset of artificial intelligence that enables systems to learn from data. Unlike traditional...", type: "chunk 1" },
        { id: "f2", content: "...traditional programming where rules are explicitly coded, ML systems discover patterns automatically.\n\nKey Concepts\n\nThere are three main...", type: "chunk 2", overlap: true },
        { id: "f3", content: "...three main types of machine learning:\n1. Supervised Learning - Learning from labeled examples\n2. Unsupervised Learning...", type: "chunk 3", overlap: true },
        { id: "f4", content: "...Learning - Finding patterns in unlabeled data\n3. Reinforcement Learning - Learning through trial and error\n\nSupervised Learning...", type: "chunk 4", overlap: true },
      ],
      pros: ["Simple to implement", "Predictable chunk sizes", "Works with any content"],
      cons: ["Breaks mid-sentence/paragraph", "No semantic awareness", "Arbitrary boundaries"],
    },
    semantic: {
      name: "Semantic",
      icon: <BookOpen className="w-4 h-4" />,
      color: "violet",
      description: "Split by sentence or paragraph boundaries",
      chunks: [
        { id: "s1", content: "Introduction to Machine Learning", type: "heading" },
        { id: "s2", content: "Machine learning is a subset of artificial intelligence that enables systems to learn from data.", type: "sentence" },
        { id: "s3", content: "Unlike traditional programming where rules are explicitly coded, ML systems discover patterns automatically.", type: "sentence" },
        { id: "s4", content: "Key Concepts", type: "heading" },
        { id: "s5", content: "There are three main types of machine learning:\n1. Supervised Learning - Learning from labeled examples\n2. Unsupervised Learning - Finding patterns in unlabeled data\n3. Reinforcement Learning - Learning through trial and error", type: "list" },
      ],
      pros: ["Preserves sentence boundaries", "More coherent chunks", "Better for Q&A"],
      cons: ["Variable chunk sizes", "May be too small", "Language-dependent"],
    },
    recursive: {
      name: "Recursive",
      icon: <Layers className="w-4 h-4" />,
      color: "amber",
      description: "Try paragraph splits, then sentences, then characters",
      chunks: [
        { id: "r1", content: "Introduction to Machine Learning\n\nMachine learning is a subset of artificial intelligence that enables systems to learn from data. Unlike traditional programming where rules are explicitly coded, ML systems discover patterns automatically.", type: "paragraph 1" },
        { id: "r2", content: "Key Concepts\n\nThere are three main types of machine learning:\n1. Supervised Learning - Learning from labeled examples\n2. Unsupervised Learning - Finding patterns in unlabeled data\n3. Reinforcement Learning - Learning through trial and error", type: "paragraph 2" },
        { id: "r3", content: "Supervised Learning Details\n\nIn supervised learning, the model is trained on input-output pairs. Common algorithms include linear regression, decision trees, and neural networks. The goal is to learn a mapping function from inputs to outputs.", type: "paragraph 3" },
        { id: "r4", content: "Unsupervised Learning Details\n\nUnsupervised learning finds hidden structure in data without labels. Clustering algorithms group similar items together, while dimensionality reduction techniques compress high-dimensional data.", type: "paragraph 4" },
      ],
      pros: ["Respects document structure", "Balanced chunk sizes", "Most versatile approach"],
      cons: ["More complex logic", "Needs tuning per content type"],
    },
    structure: {
      name: "Structure-Aware",
      icon: <Code2 className="w-4 h-4" />,
      color: "emerald",
      description: "Parse document structure (Markdown, code, HTML)",
      chunks: [
        { id: "st1", content: "# Introduction to Machine Learning\n\nMachine learning is a subset of artificial intelligence...", type: "section: intro" },
        { id: "st2", content: "# Key Concepts\n\nThere are three main types of machine learning:\n1. Supervised Learning...\n2. Unsupervised Learning...\n3. Reinforcement Learning...", type: "section: concepts" },
        { id: "st3", content: "## Supervised Learning Details\n\nIn supervised learning, the model is trained on input-output pairs...", type: "subsection" },
        { id: "st4", content: "## Unsupervised Learning Details\n\nUnsupervised learning finds hidden structure in data...", type: "subsection" },
      ],
      pros: ["Semantic coherence", "Preserves hierarchy", "Best for structured docs"],
      cons: ["Requires parsing logic", "Content-type specific", "Not universal"],
    },
  };

  const current = strategies[activeStrategy];

  return (
    <div className="space-y-4">
        {/* Strategy tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(strategies) as ChunkingStrategy[]).map((strategy) => {
            const s = strategies[strategy];
            return (
              <button
                key={strategy}
                onClick={() => setActiveStrategy(strategy)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  activeStrategy === strategy
                    ? `bg-${s.color}-500/20 text-${s.color}-400 ring-1 ring-${s.color}-500/50`
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                )}
                style={{
                  backgroundColor: activeStrategy === strategy ? `var(--${s.color}-500-20, rgba(100,150,200,0.2))` : undefined,
                  color: activeStrategy === strategy ? `var(--${s.color}-400, rgb(100,180,220))` : undefined,
                }}
              >
                {s.icon}
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {current.description}
        </p>

        {/* Chunk visualization */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {current.chunks.map((chunk, idx) => (
            <div
              key={chunk.id}
              className={cn(
                "p-3 rounded-lg border text-sm transition-all animate-in fade-in",
                chunk.overlap
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-muted/30 border-border"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded",
                  `bg-${current.color}-500/20 text-${current.color}-400`
                )} style={{
                  backgroundColor: `var(--${current.color}-500-20, rgba(100,150,200,0.2))`,
                  color: `var(--${current.color}-400, rgb(100,180,220))`,
                }}>
                  {chunk.type}
                </span>
                {chunk.overlap && (
                  <span className="text-xs text-amber-400">↺ overlap</span>
                )}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed m-0 font-mono whitespace-pre-wrap">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>

        {/* Pros and Cons */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-xs font-medium text-emerald-400 uppercase mb-2">✓ Strengths</h4>
            <ul className="text-xs text-muted-foreground m-0 pl-4 list-disc space-y-1">
              {current.pros.map((pro, i) => (
                <li key={i}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <h4 className="text-xs font-medium text-rose-400 uppercase mb-2">✗ Weaknesses</h4>
            <ul className="text-xs text-muted-foreground m-0 pl-4 list-disc space-y-1">
              {current.cons.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function ChunkingStrategiesSection() {
  return (
    <section id="chunking-strategies" className="scroll-mt-20">
      <SectionHeading
        id="chunking-strategies-heading"
        title="Chunking Strategies"
        subtitle="How to split documents for optimal retrieval"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Chunking is the process of <strong className="text-foreground">splitting documents into retrievable units</strong>. 
          The quality of your RAG system depends heavily on how you chunk—too large and you waste context tokens 
          on irrelevant content; too small and you lose important context.
        </p>

        <Callout variant="important" title="Chunking is Not One-Size-Fits-All">
          <p className="m-0">
            Different content types need different strategies. Legal documents, code, conversations, 
            and technical manuals all have different optimal approaches. Start with recursive chunking 
            and tune based on retrieval quality.
          </p>
        </Callout>

        {/* Core Trade-offs */}
        <h3 id="chunking-tradeoffs" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Core Trade-off
        </h3>

        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-center gap-4">
            <div className="flex-1 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-lg font-bold text-rose-400">Too Small</div>
              <p className="text-xs text-muted-foreground mt-1 mb-0">
                Loses context. &quot;Paris&quot; without &quot;France&quot; loses meaning.
              </p>
            </div>
            <div className="text-2xl text-muted-foreground">⟷</div>
            <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-lg font-bold text-emerald-400">Just Right</div>
              <p className="text-xs text-muted-foreground mt-1 mb-0">
                Complete thoughts. Semantically coherent. Answerable.
              </p>
            </div>
            <div className="text-2xl text-muted-foreground">⟷</div>
            <div className="flex-1 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-lg font-bold text-rose-400">Too Large</div>
              <p className="text-xs text-muted-foreground mt-1 mb-0">
                Wastes tokens. Dilutes relevance score. Costs more.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Comparison */}
        <h3 id="strategies-comparison" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Strategies Comparison
        </h3>

        <InteractiveWrapper
          title="Interactive: Chunking Strategies"
          description="See how different strategies handle the same document"
          icon="✂️"
          colorTheme="violet"
          minHeight="auto"
        >
          <ChunkingComparisonVisualizer />
        </InteractiveWrapper>

        {/* Chunk Overlap */}
        <h3 id="chunk-overlap" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Chunk Overlap
        </h3>

        <p className="text-muted-foreground">
          Overlap adds redundancy by including the end of the previous chunk at the start of the next. 
          This helps maintain context across boundaries but increases storage and may surface duplicates.
        </p>

        <div className="my-6 p-4 rounded-lg bg-muted/30 border border-border font-mono text-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cyan-400">Chunk 1:</span>
            <span className="text-muted-foreground">The quick brown fox jumps over</span>
            <span className="text-amber-400 bg-amber-500/10 px-1 rounded">the lazy dog</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">Chunk 2:</span>
            <span className="text-amber-400 bg-amber-500/10 px-1 rounded">the lazy dog</span>
            <span className="text-muted-foreground">who was sleeping...</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3 mb-0">
            ↑ &quot;the lazy dog&quot; appears in both chunks (overlap = 3 words)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">When to Use Overlap</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Prose and narrative content</li>
                <li>When sentences span chunk boundaries</li>
                <li>Important to catch boundary context</li>
                <li>Typical: 10-20% of chunk size</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">When to Skip Overlap</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Structured data (JSON, tables)</li>
                <li>Already using semantic boundaries</li>
                <li>Storage is a major concern</li>
                <li>Content has natural divisions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Content-Specific Strategies */}
        <h3 id="content-specific" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Content-Specific Strategies
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Code</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Split on function/class boundaries. Keep imports with the code that uses them. 
                    Consider AST-based splitting for accuracy. Include docstrings with their functions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Documentation / Markdown</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Split on headers (##, ###). Keep sections with their headings. 
                    Flatten nested structures or maintain hierarchy in metadata.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Conversational / Chat Logs</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Keep Q&A pairs together. Split on topic boundaries, not arbitrary turn counts. 
                    Maintain speaker context. Consider summarization for long conversations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Start with recursive chunking (most versatile)</li>
                <li>Match chunk size to your embedding model&apos;s sweet spot</li>
                <li>Include metadata for filtering and context</li>
                <li>Test retrieval quality, not just chunk appearance</li>
                <li>Consider the questions users will ask</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Using one strategy for all content types</li>
                <li>Chunks so small they lose meaning</li>
                <li>Chunks so large they dilute relevance</li>
                <li>Forgetting about the retrieval step</li>
                <li>Over-optimizing before measuring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Sizing Guidelines">
          <p className="m-0">
            <strong>General prose:</strong> 500-1000 tokens<br />
            <strong>Technical docs:</strong> 750-1500 tokens<br />
            <strong>Code:</strong> 1000-2000 tokens (function-sized)<br />
            <strong>Q&A pairs:</strong> Keep together regardless of size<br />
            Start here and adjust based on your retrieval performance.
          </p>
        </Callout>

        <Callout variant="info" title="Next: Orchestration" className="mt-8">
          <p className="m-0">
            With RAG fundamentals covered, we move to <strong>Orchestration</strong>—how to coordinate 
            multiple LLM calls, parallelize work, and build complex AI systems from simple components.
          </p>
        </Callout>
      </div>
    </section>
  );
}
