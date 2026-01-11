"use client";

import { useState } from "react";
import { SectionHeading, Card, CardContent, Callout, EmbeddingVisualizer } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { ArrowRight, Layers, Search, Database, Sparkles } from "lucide-react";

// =============================================================================
// Similarity Calculator Demo
// =============================================================================

function SimilarityDemo() {
  const [vectorA, setVectorA] = useState([0.8, 0.2, 0.5]);
  const [vectorB, setVectorB] = useState([0.7, 0.3, 0.6]);

  // Calculate cosine similarity
  const cosineSimilarity = (): number => {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vectorA.length; i++) {
      dot += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // Calculate Euclidean distance
  const euclideanDistance = (): number => {
    let sum = 0;
    for (let i = 0; i < vectorA.length; i++) {
      sum += Math.pow(vectorA[i] - vectorB[i], 2);
    }
    return Math.sqrt(sum);
  };

  const similarity = cosineSimilarity();
  const distance = euclideanDistance();

  const updateVector = (which: "A" | "B", index: number, value: number) => {
    if (which === "A") {
      const newVec = [...vectorA];
      newVec[index] = value;
      setVectorA(newVec);
    } else {
      const newVec = [...vectorB];
      newVec[index] = value;
      setVectorB(newVec);
    }
  };

  return (
    <div className="space-y-6">
        {/* Vector editors */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Vector A */}
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-sm font-medium text-cyan-400 mb-3">Vector A</div>
            <div className="space-y-2">
              {vectorA.map((val, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">dim {i + 1}</span>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={val}
                    onChange={(e) => updateVector("A", i, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-muted cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${((val + 1) / 2) * 100}%, rgb(var(--muted)) ${((val + 1) / 2) * 100}%, rgb(var(--muted)) 100%)`,
                    }}
                  />
                  <span className="text-xs font-mono w-10 text-right">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vector B */}
          <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
            <div className="text-sm font-medium text-violet-400 mb-3">Vector B</div>
            <div className="space-y-2">
              {vectorB.map((val, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">dim {i + 1}</span>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={val}
                    onChange={(e) => updateVector("B", i, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-muted cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(167 139 250) 0%, rgb(167 139 250) ${((val + 1) / 2) * 100}%, rgb(var(--muted)) ${((val + 1) / 2) * 100}%, rgb(var(--muted)) 100%)`,
                    }}
                  />
                  <span className="text-xs font-mono w-10 text-right">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Cosine Similarity
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {(similarity * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {similarity > 0.8 ? "Very similar" : similarity > 0.5 ? "Somewhat similar" : "Different"}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Euclidean Distance
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {distance.toFixed(3)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {distance < 0.3 ? "Very close" : distance < 0.6 ? "Moderate distance" : "Far apart"}
            </div>
          </div>
        </div>

        {/* Visual representation */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-2">Visual: Vector directions (2D projection)</div>
          <div className="relative h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="-1.5 -1.5 3 3">
              {/* Grid */}
              <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="currentColor" strokeWidth="0.02" className="text-border" />
              <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="currentColor" strokeWidth="0.02" className="text-border" />
              
              {/* Vector A */}
              <line
                x1="0"
                y1="0"
                x2={vectorA[0]}
                y2={-vectorA[1]}
                stroke="rgb(34 211 238)"
                strokeWidth="0.05"
                markerEnd="url(#arrowA)"
              />
              <defs>
                <marker id="arrowA" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="rgb(34 211 238)" />
                </marker>
              </defs>
              <text x={vectorA[0] + 0.1} y={-vectorA[1]} fill="rgb(34 211 238)" fontSize="0.2">A</text>

              {/* Vector B */}
              <line
                x1="0"
                y1="0"
                x2={vectorB[0]}
                y2={-vectorB[1]}
                stroke="rgb(167 139 250)"
                strokeWidth="0.05"
                markerEnd="url(#arrowB)"
              />
              <defs>
                <marker id="arrowB" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="rgb(167 139 250)" />
                </marker>
              </defs>
              <text x={vectorB[0] + 0.1} y={-vectorB[1]} fill="rgb(167 139 250)" fontSize="0.2">B</text>

              {/* Angle arc */}
              <path
                d={`M ${vectorA[0] * 0.3} ${-vectorA[1] * 0.3} A 0.3 0.3 0 0 ${vectorA[1] * vectorB[0] - vectorA[0] * vectorB[1] > 0 ? 1 : 0} ${vectorB[0] * 0.3} ${-vectorB[1] * 0.3}`}
                fill="none"
                stroke="rgb(52 211 153)"
                strokeWidth="0.03"
                strokeDasharray="0.05 0.03"
              />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Cosine similarity measures the angle between vectors, not their length
          </p>
        </div>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function EmbeddingsSection() {
  return (
    <section id="embeddings" className="scroll-mt-20">
      <SectionHeading
        id="embeddings-heading"
        title="Understanding Embeddings"
        subtitle="How text becomes vectors and why it matters"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Embeddings are the foundation of modern AI&apos;s ability to understand meaning. They transform 
          text (or images, audio, anything) into <strong className="text-foreground">dense vectors</strong>—lists 
          of numbers that capture semantic meaning in a way computers can process.
        </p>

        <Callout variant="info" title="Why This Matters">
          <p>
            Embeddings power RAG, semantic search, similarity detection, clustering, and more. 
            Understanding them is essential for building effective AI systems that can find 
            relevant information and understand relationships between concepts.
          </p>
        </Callout>

        {/* What are Embeddings */}
        <h3 id="what-are-embeddings" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          What are Embeddings?
        </h3>

        <p className="text-muted-foreground">
          An embedding is a <strong className="text-foreground">learned representation</strong>—a 
          neural network&apos;s way of encoding the &quot;meaning&quot; of something into numbers. When trained 
          on large amounts of data, these representations capture rich semantic information:
        </p>

        <div className="my-6 p-5 rounded-xl bg-card border border-border">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-1 p-4 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">Text Input</div>
              <div className="text-lg font-medium text-foreground">&quot;The cat sat on the mat&quot;</div>
            </div>
            <ArrowRight className="w-6 h-6 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />
            <div className="flex-1 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="text-sm text-cyan-400 mb-2">Embedding Vector</div>
              <div className="text-sm font-mono text-muted-foreground">
                [0.234, -0.891, 0.445, 0.112, ..., -0.332]
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                (384-1536 dimensions typical)
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          The magic is in how these vectors are arranged: <strong className="text-foreground">semantically 
          similar items end up close together</strong> in this high-dimensional space. &quot;Cat&quot; and &quot;kitten&quot; 
          will be near each other; &quot;cat&quot; and &quot;algorithm&quot; will be far apart.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <Layers className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-medium text-foreground mb-2">Dense Representation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Unlike sparse one-hot vectors, embeddings pack meaning into relatively few dimensions 
                (hundreds, not vocabulary size)
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <Sparkles className="w-5 h-5 text-violet-400 mb-2" />
              <h4 className="font-medium text-foreground mb-2">Learned Features</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each dimension captures some learned aspect of meaning—not human-interpretable, 
                but useful for comparison
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Embedding Visualizer */}
        <h3 id="embedding-visualizer" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Interactive: Explore Word Embeddings
        </h3>

        <p className="text-muted-foreground mb-4">
          This visualization runs a <strong className="text-foreground">real embedding model</strong> (all-MiniLM-L6-v2) 
          directly in your browser. Add words and watch how semantically similar words cluster together. 
          Click any word to see similarity scores.
        </p>

        <EmbeddingVisualizer />

        {/* Similarity and Distance */}
        <h3 id="similarity-search" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Similarity and Distance
        </h3>

        <p className="text-muted-foreground">
          Once we have embeddings, we need ways to measure how similar two vectors are. The most 
          common metric is <strong className="text-foreground">cosine similarity</strong>—it measures 
          the angle between vectors, ignoring their magnitude.
        </p>

        <InteractiveWrapper
          title="Interactive: Similarity Calculator"
          description="Adjust vectors and see how similarity metrics change"
          icon="📐"
          colorTheme="emerald"
          minHeight="auto"
        >
          <SimilarityDemo />
        </InteractiveWrapper>

        <Callout variant="tip" title="Why Cosine Similarity?">
          <p>
            Cosine similarity is preferred for embeddings because it&apos;s <strong>magnitude-invariant</strong>. 
            Two vectors pointing in the same direction are &quot;similar&quot; regardless of their length. This 
            makes it robust for comparing text of different lengths.
          </p>
        </Callout>

        {/* Embedding Models */}
        <h3 id="embedding-models" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Embedding Models
        </h3>

        <p className="text-muted-foreground">
          Different embedding models have different strengths. The choice affects retrieval quality, 
          cost, and speed:
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Model</th>
                <th className="text-left p-3 font-medium text-foreground">Dimensions</th>
                <th className="text-left p-3 font-medium text-foreground">Best For</th>
                <th className="text-left p-3 font-medium text-foreground">Trade-offs</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-cyan-400">text-embedding-3-small</td>
                <td className="p-3">1536</td>
                <td className="p-3">General purpose, cost-effective</td>
                <td className="p-3">Lower quality than large</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-cyan-400">text-embedding-3-large</td>
                <td className="p-3">3072</td>
                <td className="p-3">Best quality, multilingual</td>
                <td className="p-3">Higher cost, more storage</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-violet-400">all-MiniLM-L6-v2</td>
                <td className="p-3">384</td>
                <td className="p-3">Fast, runs locally</td>
                <td className="p-3">Lower quality for complex queries</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-violet-400">voyage-large-2</td>
                <td className="p-3">1024</td>
                <td className="p-3">Code, legal, technical docs</td>
                <td className="p-3">Domain-specific</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="important" title="Match Your Models">
          <p>
            You must use the <strong>same embedding model</strong> for both indexing and querying. 
            Vectors from different models live in incompatible spaces—comparing them is meaningless.
          </p>
        </Callout>

        {/* Practical Uses */}
        <h3 id="practical-uses" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Practical Applications
        </h3>

        <p className="text-muted-foreground">
          Embeddings are the foundation for many AI capabilities:
        </p>

        <div className="grid gap-4 mt-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Search className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-cyan-400">Semantic Search</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Find documents by meaning, not just keywords. &quot;How do I fix authentication?&quot; matches 
                docs about &quot;login issues&quot; even if they don&apos;t share words.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <Database className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-violet-400">RAG (Retrieval-Augmented Generation)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Embed your documents, embed the user&apos;s query, find the most similar chunks, 
                inject them into the LLM context. Covered in detail in Part 4.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Layers className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Clustering & Classification</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Group similar items together automatically. Useful for topic modeling, 
                duplicate detection, and organizing large document collections.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-amber-400">Recommendations</h4>
              <p className="text-sm text-muted-foreground mt-1">
                &quot;Users who liked X also liked Y&quot;—but based on semantic similarity of content, 
                not just collaborative filtering.
              </p>
            </div>
          </div>
        </div>

        <Callout variant="tip" title="Coming Up: RAG">
          <p>
            In Part 4 (Knowledge & Retrieval), we&apos;ll build on embeddings to create full RAG systems. 
            You&apos;ll see how to index documents, perform similarity search at scale, and inject 
            retrieved context into LLM prompts.
          </p>
        </Callout>
      </div>
    </section>
  );
}
