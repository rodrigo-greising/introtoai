"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  Database, 
  Zap, 
  Target,
  Layers,
  Search,
  Play,
  RotateCcw,
} from "lucide-react";

// =============================================================================
// ANN Search Visualizer
// =============================================================================

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
  visited?: boolean;
  inResult?: boolean;
  inCluster?: number;
}

function ANNSearchVisualizer() {
  const [searchPhase, setSearchPhase] = useState<"idle" | "coarse" | "fine" | "complete">("idle");
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(null);
  const [visitedPoints, setVisitedPoints] = useState<Set<string>>(new Set());
  const [resultPoints, setResultPoints] = useState<Set<string>>(new Set());
  const [currentCluster, setCurrentCluster] = useState<number | null>(null);

  // Define clusters of points
  const clusters = [
    { id: 0, center: { x: 80, y: 80 }, color: "cyan" },
    { id: 1, center: { x: 280, y: 60 }, color: "violet" },
    { id: 2, center: { x: 180, y: 200 }, color: "amber" },
    { id: 3, center: { x: 320, y: 180 }, color: "emerald" },
  ];

  const points: Point[] = useMemo(() => [
    // Cluster 0 (cyan)
    { id: "p1", x: 60, y: 70, label: "doc_1", inCluster: 0 },
    { id: "p2", x: 90, y: 60, label: "doc_2", inCluster: 0 },
    { id: "p3", x: 70, y: 100, label: "doc_3", inCluster: 0 },
    { id: "p4", x: 100, y: 90, label: "doc_4", inCluster: 0 },
    { id: "p5", x: 50, y: 95, label: "doc_5", inCluster: 0 },
    // Cluster 1 (violet)
    { id: "p6", x: 260, y: 50, label: "doc_6", inCluster: 1 },
    { id: "p7", x: 290, y: 70, label: "doc_7", inCluster: 1 },
    { id: "p8", x: 270, y: 80, label: "doc_8", inCluster: 1 },
    { id: "p9", x: 300, y: 45, label: "doc_9", inCluster: 1 },
    // Cluster 2 (amber)
    { id: "p10", x: 160, y: 190, label: "doc_10", inCluster: 2 },
    { id: "p11", x: 190, y: 210, label: "doc_11", inCluster: 2 },
    { id: "p12", x: 170, y: 220, label: "doc_12", inCluster: 2 },
    { id: "p13", x: 200, y: 185, label: "doc_13", inCluster: 2 },
    // Cluster 3 (emerald)
    { id: "p14", x: 310, y: 170, label: "doc_14", inCluster: 3 },
    { id: "p15", x: 330, y: 190, label: "doc_15", inCluster: 3 },
    { id: "p16", x: 340, y: 165, label: "doc_16", inCluster: 3 },
  ], []);

  const runSearch = useCallback(() => {
    setSearchPhase("idle");
    setVisitedPoints(new Set());
    setResultPoints(new Set());
    setCurrentCluster(null);
    
    // Set query point
    const query = { x: 175, y: 195 };
    setQueryPoint(query);

    // Phase 1: Coarse search (find closest cluster)
    setTimeout(() => {
      setSearchPhase("coarse");
      setCurrentCluster(2); // Amber cluster is closest
    }, 500);

    // Phase 2: Fine search within cluster
    setTimeout(() => {
      setSearchPhase("fine");
      const clusterPoints = points.filter(p => p.inCluster === 2);
      clusterPoints.forEach((p, i) => {
        setTimeout(() => {
          setVisitedPoints(prev => new Set([...prev, p.id]));
        }, i * 150);
      });
    }, 1500);

    // Phase 3: Return results
    setTimeout(() => {
      setSearchPhase("complete");
      setResultPoints(new Set(["p10", "p11", "p13"])); // Top 3 closest
    }, 2500);
  }, [points]);

  const reset = useCallback(() => {
    setSearchPhase("idle");
    setQueryPoint(null);
    setVisitedPoints(new Set());
    setResultPoints(new Set());
    setCurrentCluster(null);
  }, []);

  const getClusterColor = (clusterId: number) => {
    const colors = ["cyan", "violet", "amber", "emerald"];
    return colors[clusterId] || "gray";
  };

  const coreLogic = `// Approximate Nearest Neighbor (ANN) with IVF
// Instead of checking ALL vectors, use inverted file index

interface IVFIndex {
  centroids: Vector[];     // Cluster centers
  invertedLists: Map<number, Vector[]>; // cluster_id → vectors
}

async function annSearch(query: Vector, k: number): Promise<Result[]> {
  // Phase 1: COARSE SEARCH - Find closest cluster(s)
  // O(nprobe) instead of O(n) - typically nprobe << n
  const closestClusters = findClosestCentroids(query, index.centroids, nprobe);
  
  // Phase 2: FINE SEARCH - Only search within selected clusters
  // Check ~1-5% of total vectors instead of 100%
  const candidates: ScoredVector[] = [];
  
  for (const clusterId of closestClusters) {
    const clusterVectors = index.invertedLists.get(clusterId);
    for (const vec of clusterVectors) {
      const distance = cosineSimilarity(query, vec);
      candidates.push({ vec, distance });
    }
  }
  
  // Return top-k from candidates (not all vectors!)
  return candidates.sort((a, b) => b.distance - a.distance).slice(0, k);
}

// Trade-off: Faster search, but might miss some neighbors
// If the TRUE nearest neighbor is in a different cluster,
// we won't find it. This is the "approximate" part of ANN.`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Approximate Nearest Neighbor Search"
      description="How vector databases achieve fast similarity search"
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={runSearch}
            disabled={searchPhase !== "idle" && searchPhase !== "complete"}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              searchPhase === "idle" || searchPhase === "complete"
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                : "bg-muted/30 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4" />
            Run ANN Search
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <div className="ml-auto text-sm">
            <span className="text-muted-foreground">Phase: </span>
            <span className={cn(
              "font-medium",
              searchPhase === "idle" && "text-muted-foreground",
              searchPhase === "coarse" && "text-amber-400",
              searchPhase === "fine" && "text-cyan-400",
              searchPhase === "complete" && "text-emerald-400"
            )}>
              {searchPhase === "idle" && "Ready"}
              {searchPhase === "coarse" && "Coarse Search (finding cluster)"}
              {searchPhase === "fine" && "Fine Search (within cluster)"}
              {searchPhase === "complete" && "Complete!"}
            </span>
          </div>
        </div>

        {/* Visualization */}
        <div className="relative h-64 rounded-lg bg-muted/20 border border-border overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 260">
            {/* Cluster regions */}
            {clusters.map((cluster) => (
              <g key={cluster.id}>
                <circle
                  cx={cluster.center.x}
                  cy={cluster.center.y}
                  r={55}
                  className={cn(
                    "transition-all duration-300",
                    currentCluster === cluster.id
                      ? `fill-${cluster.color}-500/20 stroke-${cluster.color}-500/50`
                      : "fill-transparent stroke-border"
                  )}
                  style={{
                    fill: currentCluster === cluster.id ? `var(--${cluster.color}-500, rgba(100,100,100,0.2))` : "transparent",
                    stroke: currentCluster === cluster.id ? `var(--${cluster.color}-500, rgba(100,100,100,0.5))` : "var(--border)",
                    strokeWidth: currentCluster === cluster.id ? 2 : 1,
                    strokeDasharray: "4 4",
                  }}
                />
                {/* Cluster centroid */}
                <circle
                  cx={cluster.center.x}
                  cy={cluster.center.y}
                  r={4}
                  className="fill-muted-foreground/50"
                />
              </g>
            ))}

            {/* Data points */}
            {points.map((point) => {
              const isVisited = visitedPoints.has(point.id);
              const isResult = resultPoints.has(point.id);
              const color = getClusterColor(point.inCluster || 0);

              return (
                <g key={point.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isResult ? 8 : 6}
                    className={cn(
                      "transition-all duration-300",
                      isResult && "animate-pulse"
                    )}
                    style={{
                      fill: isResult 
                        ? "var(--emerald-500, #10b981)" 
                        : isVisited 
                          ? `var(--${color}-400, rgba(100,150,200,0.8))`
                          : `var(--${color}-500, rgba(100,150,200,0.5))`,
                      opacity: isVisited || isResult || searchPhase === "idle" ? 1 : 0.4,
                    }}
                  />
                  {isResult && (
                    <text
                      x={point.x + 12}
                      y={point.y + 4}
                      className="fill-emerald-400 text-[10px] font-medium"
                    >
                      {point.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Query point */}
            {queryPoint && (
              <g>
                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r={10}
                  className="fill-rose-500/20 stroke-rose-500"
                  strokeWidth={2}
                />
                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r={4}
                  className="fill-rose-500"
                />
                <text
                  x={queryPoint.x - 15}
                  y={queryPoint.y - 15}
                  className="fill-rose-400 text-[10px] font-medium"
                >
                  query
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Query vector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <span>Cluster centroid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Result (top-k)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-amber-500" />
            <span>Active cluster</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
          <p className="m-0">
            <strong className="text-foreground">IVF (Inverted File Index)</strong> partitions vectors into clusters. 
            At query time, we first find the closest cluster(s), then only search within those—checking 
            ~1-5% of vectors instead of 100%. Trade-off: we might miss the true nearest neighbor if it&apos;s 
            in a different cluster.
          </p>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function VectorDatabasesSection() {
  return (
    <section id="vector-databases" className="scroll-mt-20">
      <SectionHeading
        id="vector-databases-heading"
        title="Vector Databases"
        subtitle="Storing and searching high-dimensional embeddings at scale"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Vector databases are specialized storage systems designed for <strong className="text-foreground">high-dimensional 
          similarity search</strong>. Unlike traditional databases that match exact values, vector databases find 
          the most <em>similar</em> items to a query vector—the foundation of semantic search in RAG systems.
        </p>

        <Callout variant="info" title="Prerequisites">
          <p className="m-0">
            This section builds on concepts from{" "}
            <strong><a href="#embeddings" className="text-[var(--highlight)] hover:underline">Understanding Embeddings</a></strong>{" "}
            and{" "}
            <strong><a href="#rag-fundamentals" className="text-[var(--highlight)] hover:underline">RAG Fundamentals</a></strong>.
            Make sure you understand how text becomes vectors before diving into storage.
          </p>
        </Callout>

        {/* The Challenge */}
        <h3 id="the-challenge" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The Challenge: Curse of Dimensionality
        </h3>

        <p className="text-muted-foreground">
          Embeddings are high-dimensional vectors—typically 384 to 4096 dimensions. Finding the nearest neighbor 
          by brute force means calculating distance to every stored vector. With millions of documents, 
          this becomes impossibly slow.
        </p>

        <div className="p-6 rounded-xl bg-card border border-border my-6">
          <h4 className="text-sm font-medium text-rose-400 uppercase tracking-wider mb-4">
            The Scale Problem
          </h4>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">1M</div>
              <div className="text-sm text-muted-foreground">documents</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">×1536</div>
              <div className="text-sm text-muted-foreground">dimensions</div>
            </div>
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-2xl font-bold text-rose-400">1.5B</div>
              <div className="text-sm text-muted-foreground">distance calculations</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 mb-0 text-center">
            Brute force: check every vector for every query = O(n × d)
          </p>
        </div>

        {/* ANN Algorithms */}
        <h3 id="ann-algorithms" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Approximate Nearest Neighbors (ANN)
        </h3>

        <p className="text-muted-foreground">
          The solution is <strong className="text-foreground">approximate nearest neighbor (ANN)</strong> algorithms. 
          Instead of guaranteeing the true closest vectors, they find <em>very close</em> vectors much faster. 
          The trade-off—a small accuracy loss—is almost always worth the massive speed gain.
        </p>

        <InteractiveWrapper
          title="Interactive: ANN Search with IVF"
          description="Watch how vector databases avoid checking every point"
          icon="🎯"
          colorTheme="cyan"
          minHeight="auto"
        >
          <ANNSearchVisualizer />
        </InteractiveWrapper>

        {/* Common Algorithms */}
        <h3 id="algorithms-comparison" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Common ANN Algorithms
        </h3>

        <div className="grid gap-4 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">HNSW (Hierarchical Navigable Small World)</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Builds a multi-layer graph where each layer has fewer nodes. Search starts at the top 
                    (sparse) layer and greedily descends to find neighbors. <strong className="text-foreground">Best for: 
                    read-heavy workloads, high recall requirements.</strong>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400">Fast queries</span>
                    <span className="px-2 py-1 text-xs rounded bg-amber-500/10 text-amber-400">More memory</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">IVF (Inverted File Index)</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Clusters vectors using k-means, then only searches within relevant clusters at query time. 
                    The <code>nprobe</code> parameter controls how many clusters to check. <strong className="text-foreground">Best for: 
                    large datasets, memory constraints.</strong>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400">Scalable</span>
                    <span className="px-2 py-1 text-xs rounded bg-amber-500/10 text-amber-400">Tunable recall/speed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Product Quantization (PQ)</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Compresses vectors by splitting them into sub-vectors and encoding each with a codebook. 
                    Dramatically reduces memory footprint at some accuracy cost. <strong className="text-foreground">Best for: 
                    very large datasets, memory-constrained environments.</strong>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400">Low memory</span>
                    <span className="px-2 py-1 text-xs rounded bg-rose-500/10 text-rose-400">Accuracy loss</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Combining Approaches">
          <p className="m-0">
            Most production systems combine these techniques. <strong>IVF-PQ</strong> clusters vectors (IVF) 
            and compresses them (PQ) for massive scale. <strong>IVF-HNSW</strong> uses HNSW within each cluster 
            for faster fine search. The best choice depends on your scale, latency, and accuracy requirements.
          </p>
        </Callout>

        {/* Popular Options */}
        <h3 id="database-options" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Popular Vector Database Options
        </h3>

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Database</th>
                <th className="text-left p-3 font-medium text-foreground">Type</th>
                <th className="text-left p-3 font-medium text-foreground">Best For</th>
                <th className="text-left p-3 font-medium text-foreground">Notable Features</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-[var(--highlight)]">Pinecone</td>
                <td className="p-3">Managed SaaS</td>
                <td className="p-3">Fast setup, production-ready</td>
                <td className="p-3">Auto-scaling, metadata filtering, namespaces</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-violet-400">Weaviate</td>
                <td className="p-3">Open source / Cloud</td>
                <td className="p-3">GraphQL API, hybrid search</td>
                <td className="p-3">Built-in vectorizers, multimodal support</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-cyan-400">pgvector</td>
                <td className="p-3">PostgreSQL extension</td>
                <td className="p-3">Existing Postgres users</td>
                <td className="p-3">Familiar SQL, joins with relational data</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-emerald-400">Chroma</td>
                <td className="p-3">Open source</td>
                <td className="p-3">Local development, prototyping</td>
                <td className="p-3">Simple API, embedded mode, LangChain integration</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-amber-400">Qdrant</td>
                <td className="p-3">Open source / Cloud</td>
                <td className="p-3">High performance, filtering</td>
                <td className="p-3">Rich filtering, payload storage, Rust performance</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-rose-400">Milvus</td>
                <td className="p-3">Open source</td>
                <td className="p-3">Large scale, GPU acceleration</td>
                <td className="p-3">Billion-scale vectors, multiple index types</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Usage Example */}
        <h3 id="usage-example" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Example: Pinecone Setup
        </h3>

        <CodeBlock
          language="typescript"
          filename="vector-db-example.ts"
          code={`import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI();
const index = pinecone.Index('my-rag-index');

// Ingest documents
async function ingestDocuments(documents: Document[]) {
  const vectors = await Promise.all(
    documents.map(async (doc) => ({
      id: doc.id,
      values: await embed(doc.content),  // 1536-dim vector
      metadata: { 
        source: doc.source,
        title: doc.title,
        chunk_index: doc.chunkIndex
      }
    }))
  );
  
  await index.upsert(vectors);  // Batch upsert for efficiency
}

// Query
async function query(question: string, topK = 5) {
  const queryVector = await embed(question);
  
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    filter: { source: { $eq: 'company-docs' } }  // Metadata filtering
  });
  
  return results.matches.map(m => ({
    id: m.id,
    score: m.score,
    metadata: m.metadata
  }));
}

// Embed helper
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return response.data[0].embedding;
}`}
        />

        {/* Metadata Filtering */}
        <h3 id="metadata-filtering" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Metadata Filtering
        </h3>

        <p className="text-muted-foreground">
          Vector search finds semantically similar content, but often you need to constrain results 
          by structured attributes—only docs from a specific user, within a date range, or from certain sources.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Pre-filtering
              </h4>
              <p className="text-sm text-muted-foreground m-0">
                Filter first, then search within filtered set. Fast when filter is very selective.
                Most databases optimize this path.
              </p>
              <CodeBlock
                language="typescript"
                code={`filter: { 
  user_id: "user_123",
  date: { $gte: "2024-01-01" }
}`}
              />
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">
                <Database className="w-4 h-4 inline mr-2" />
                Post-filtering
              </h4>
              <p className="text-sm text-muted-foreground m-0">
                Search all vectors, then filter results. Better when filter isn&apos;t very selective.
                May return fewer results than requested.
              </p>
              <CodeBlock
                language="typescript"
                code={`// Retrieve more, filter after
topK: 20,
// Then filter in application code
.filter(r => r.metadata.public)`}
              />
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
                <li>Use the same embedding model for ingest and query</li>
                <li>Store chunk text in metadata for retrieval</li>
                <li>Batch upserts for better throughput</li>
                <li>Index metadata fields you&apos;ll filter on</li>
                <li>Start with hosted solutions, self-host later</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Mixing embedding models between ingest/query</li>
                <li>Storing embeddings in traditional databases</li>
                <li>Over-optimizing index params prematurely</li>
                <li>Ignoring the recall/speed trade-off</li>
                <li>Expecting 100% accuracy from ANN</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Next: Chunking Strategies" className="mt-8">
          <p className="m-0">
            The quality of your vector search depends heavily on how you split documents into chunks. 
            The next section covers chunking strategies—fixed-size, semantic, and structure-aware approaches.
          </p>
        </Callout>
      </div>
    </section>
  );
}
