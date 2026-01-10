import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";

export function RAGFundamentalsSection() {
  return (
    <section id="rag-fundamentals" className="scroll-mt-20">
      <SectionHeading
        id="rag-fundamentals-heading"
        title="RAG Fundamentals"
        subtitle="What RAG is and when to use it"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Retrieval-Augmented Generation (RAG) is a technique that <strong className="text-foreground">combines 
          information retrieval with LLM generation</strong>. Instead of relying solely on what the model 
          learned during training, RAG dynamically fetches relevant information and injects it into the 
          context—giving the model access to current, specific, and verifiable knowledge.
        </p>

        {/* What is RAG? */}
        <h3 id="what-is-rag" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What is RAG?
        </h3>

        <p className="text-muted-foreground">
          RAG stands for <strong className="text-foreground">Retrieval-Augmented Generation</strong>. The 
          concept was introduced by researchers at Facebook AI (now Meta) in 2020. At its core, RAG 
          addresses a fundamental limitation: LLMs are <em>frozen in time</em> at their training cutoff 
          and can only access knowledge baked into their parameters.
        </p>

        <Callout variant="important" title="Connection to the Mental Model">
          <p className="m-0">
            Remember: an LLM is a <strong>stateless function</strong>. It has no memory between calls—everything 
            it knows must be in the context. RAG is essentially <em>automated context assembly</em>: instead of 
            manually curating what goes into each request, you build a system that fetches relevant knowledge on demand.
          </p>
        </Callout>

        <div className="my-8 p-6 rounded-xl bg-card border border-border">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            The RAG Formula
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-blue-400 font-medium">Retrieval</span>
              <p className="text-xs text-muted-foreground mt-1">Find relevant docs</p>
            </div>
            <span className="text-2xl text-muted-foreground">+</span>
            <div className="px-4 py-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <span className="text-violet-400 font-medium">Augmentation</span>
              <p className="text-xs text-muted-foreground mt-1">Add to context</p>
            </div>
            <span className="text-2xl text-muted-foreground">+</span>
            <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-medium">Generation</span>
              <p className="text-xs text-muted-foreground mt-1">LLM responds</p>
            </div>
            <span className="text-2xl text-muted-foreground">=</span>
            <div className="px-4 py-3 rounded-lg bg-[var(--highlight-muted)] border border-[var(--highlight)]/20">
              <span className="text-[var(--highlight)] font-medium">Grounded Output</span>
              <p className="text-xs text-muted-foreground mt-1">Accurate & current</p>
            </div>
          </div>
        </div>

        <Callout variant="tip" title="Connection to Context Engineering">
          <p className="m-0">
            RAG is <strong>context engineering in action</strong>. Remember the principle of &quot;Signal Over Noise&quot;? 
            RAG is the mechanism that selects and injects high-signal information into your context at query time, 
            rather than stuffing everything in upfront.
          </p>
        </Callout>

        {/* Why RAG? */}
        <h3 id="why-rag" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Why RAG?
        </h3>

        <p className="text-muted-foreground">
          LLMs have inherent limitations that RAG directly addresses. Understanding these limitations 
          helps you recognize when RAG is the right solution.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-3">🧠 The Limitations</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-2">
                <li><strong className="text-foreground">Knowledge Cutoff:</strong> Models only know what was in their training data</li>
                <li><strong className="text-foreground">Hallucinations:</strong> Models confidently generate plausible but false information</li>
                <li><strong className="text-foreground">No Domain Expertise:</strong> Generic training lacks your specific business context</li>
                <li><strong className="text-foreground">No Citations:</strong> Can&apos;t point to sources for claims</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-3">✓ How RAG Helps</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-2">
                <li><strong className="text-foreground">Fresh Knowledge:</strong> Access current information without retraining</li>
                <li><strong className="text-foreground">Grounded Responses:</strong> Answers based on retrieved facts, not guesses</li>
                <li><strong className="text-foreground">Domain Expertise:</strong> Inject your docs, policies, and knowledge</li>
                <li><strong className="text-foreground">Source Attribution:</strong> Show exactly where information came from</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="RAG Doesn't Eliminate Hallucinations">
          <p className="m-0">
            RAG <em>reduces</em> hallucinations by providing factual grounding, but doesn&apos;t eliminate them entirely. 
            The model can still misinterpret retrieved content or hallucinate connections between facts. 
            RAG is a mitigation strategy, not a complete solution.
          </p>
        </Callout>

        {/* The RAG Pipeline */}
        <h3 id="rag-pipeline" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          The RAG Pipeline
        </h3>

        <p className="text-muted-foreground">
          A RAG system has two distinct pipelines: <strong className="text-foreground">ingestion</strong> (preparing 
          your knowledge base) and <strong className="text-foreground">query</strong> (answering questions). 
          Understanding both is essential for building effective RAG systems.
        </p>

        {/* Ingestion Pipeline */}
        <div className="my-6 p-6 rounded-xl bg-card border border-border">
          <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-4">
            📥 Ingestion Pipeline (Offline)
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-medium shrink-0">1</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Load Documents</span>
                <span className="text-muted-foreground text-sm ml-2">→ PDFs, web pages, databases, APIs</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-medium shrink-0">2</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Chunk</span>
                <span className="text-muted-foreground text-sm ml-2">→ Split into retrievable segments</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-medium shrink-0">3</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Embed</span>
                <span className="text-muted-foreground text-sm ml-2">→ Convert to vector representations</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-medium shrink-0">4</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Store</span>
                <span className="text-muted-foreground text-sm ml-2">→ Index in vector database</span>
              </div>
            </div>
          </div>
        </div>

        {/* Query Pipeline */}
        <div className="my-6 p-6 rounded-xl bg-card border border-border">
          <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-4">
            🔍 Query Pipeline (Online)
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">1</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Receive Query</span>
                <span className="text-muted-foreground text-sm ml-2">→ User asks a question</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">2</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Embed Query</span>
                <span className="text-muted-foreground text-sm ml-2">→ Same embedding model as ingestion</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">3</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Retrieve</span>
                <span className="text-muted-foreground text-sm ml-2">→ Find top-k similar chunks</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">4</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Augment</span>
                <span className="text-muted-foreground text-sm ml-2">→ Inject chunks into prompt context</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium shrink-0">5</div>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="font-medium text-foreground">Generate</span>
                <span className="text-muted-foreground text-sm ml-2">→ LLM produces grounded response</span>
              </div>
            </div>
          </div>
        </div>

        <Callout variant="tip" title="Connecting to Layered Context Architecture">
          <p className="m-0">
            Notice how the query pipeline maps to the <strong>Layered Context</strong> principle from Context Engineering. 
            Retrieved chunks become the &quot;Dynamic/Task&quot; layer—volatile, query-specific content injected last. 
            Your system prompt and instructions remain stable at the top, maximizing cache efficiency.
          </p>
        </Callout>

        <Callout variant="info" title="Covered in Following Sections" className="mt-4">
          <p className="m-0">
            The <strong>Vector Databases</strong> section covers storage and retrieval in depth. 
            The <strong>Chunking Strategies</strong> section explores how to split documents effectively. 
            This section focuses on the conceptual foundations.
          </p>
        </Callout>

        {/* Key Components */}
        <h3 id="rag-components" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Key Components
        </h3>

        <p className="text-muted-foreground">
          Every RAG system relies on these core building blocks. Understanding what each does helps you 
          make informed decisions when building your own system.
        </p>

        <div className="grid gap-4 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl shrink-0">
                  📐
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Embedding Model</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Converts text into dense vector representations (embeddings). These numerical representations 
                    capture semantic meaning, allowing similar concepts to be &quot;close&quot; in vector space. 
                    <strong className="text-foreground"> The same model must be used for both documents and queries.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-2xl shrink-0">
                  🗄️
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Vector Database</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Specialized storage optimized for similarity search over high-dimensional vectors. 
                    Uses algorithms like HNSW or IVF for fast approximate nearest neighbor search. 
                    Examples: Pinecone, Weaviate, pgvector, Chroma, Qdrant.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">
                  ✂️
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Chunking Strategy</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    How you split documents into retrievable pieces. Too large and you waste context tokens 
                    on irrelevant content. Too small and you lose important context. 
                    Strategies include fixed-size, semantic, recursive, and structure-based chunking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl shrink-0">
                  🔍
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Retriever</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    The component that finds relevant chunks for a query. Can use semantic similarity (vector search), 
                    keyword matching (BM25), or hybrid approaches combining both. 
                    Often includes reranking to improve result quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RAG vs Alternatives */}
        <h3 id="rag-vs-alternatives" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          RAG vs Alternatives
        </h3>

        <p className="text-muted-foreground">
          RAG isn&apos;t the only way to give LLMs access to specific knowledge. Understanding the alternatives 
          helps you choose the right approach for your use case.
        </p>

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Approach</th>
                <th className="text-left p-3 font-medium text-foreground">How It Works</th>
                <th className="text-left p-3 font-medium text-foreground">Best For</th>
                <th className="text-left p-3 font-medium text-foreground">Trade-offs</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-[var(--highlight)]">RAG</td>
                <td className="p-3">Retrieve relevant docs at query time, inject into context</td>
                <td className="p-3">Dynamic knowledge, Q&A, search, large knowledge bases</td>
                <td className="p-3">Retrieval latency, chunking complexity, retrieval quality dependencies</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-violet-400">Fine-tuning</td>
                <td className="p-3">Train model on domain-specific data to learn patterns</td>
                <td className="p-3">Consistent style/format, domain terminology, behavior modification</td>
                <td className="p-3">Expensive, slow iteration, knowledge still gets outdated</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-amber-400">Long Context</td>
                <td className="p-3">Stuff all relevant docs directly into context window</td>
                <td className="p-3">Small knowledge bases, simple use cases, prototyping</td>
                <td className="p-3">Cost scales with context size, &quot;lost in the middle&quot; problem</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-cyan-400">In-Context Learning</td>
                <td className="p-3">Provide examples in the prompt for the model to learn from</td>
                <td className="p-3">Format/style guidance, few-shot tasks, classification</td>
                <td className="p-3">Limited to what fits in context, no new factual knowledge</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="tip" title="Combine Approaches">
          <p className="m-0">
            These aren&apos;t mutually exclusive. A fine-tuned model can use RAG for current knowledge. 
            RAG results can be enhanced with in-context examples. The key is matching the approach 
            to what you&apos;re trying to achieve: <strong>style vs facts vs recency vs scale</strong>.
          </p>
        </Callout>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Choose RAG When...</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Knowledge changes frequently</li>
                <li>You need source attribution</li>
                <li>Knowledge base is too large for context</li>
                <li>Accuracy on facts is critical</li>
                <li>You want to avoid expensive fine-tuning</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Skip RAG When...</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Knowledge fits in context window</li>
                <li>You need style/behavior changes (use fine-tuning)</li>
                <li>Real-time latency is critical</li>
                <li>Simple classification or formatting tasks</li>
                <li>The domain is already well-covered by the base model</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* When to Use RAG */}
        <h3 id="when-to-use-rag" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          When to Use RAG
        </h3>

        <p className="text-muted-foreground">
          RAG shines in specific scenarios. Recognizing these patterns helps you decide whether RAG 
          is the right investment for your use case.
        </p>

        <h4 className="text-lg font-medium mt-6 mb-4 text-foreground">
          Ideal Use Cases
        </h4>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium text-foreground mb-1">Documentation Q&A</h4>
              <p className="text-sm text-muted-foreground m-0">
                Answer questions about technical docs, policies, manuals. Users get accurate answers 
                with citations to source material.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">🎧</div>
              <h4 className="font-medium text-foreground mb-1">Customer Support</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agents backed by knowledge bases of FAQs, troubleshooting guides, and product info. 
                Consistent, accurate, scalable support.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">⚖️</div>
              <h4 className="font-medium text-foreground mb-1">Legal & Compliance</h4>
              <p className="text-sm text-muted-foreground m-0">
                Query contracts, regulations, case law. Critical for accuracy and being able to 
                cite specific clauses or precedents.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">🔬</div>
              <h4 className="font-medium text-foreground mb-1">Research & Analysis</h4>
              <p className="text-sm text-muted-foreground m-0">
                Search across papers, reports, data. Synthesize findings from multiple sources 
                while maintaining provenance.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">💻</div>
              <h4 className="font-medium text-foreground mb-1">Code Assistance</h4>
              <p className="text-sm text-muted-foreground m-0">
                Answer questions about your codebase, internal libraries, architecture decisions. 
                Context-aware code suggestions.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-medium text-foreground mb-1">Enterprise Search</h4>
              <p className="text-sm text-muted-foreground m-0">
                Unified search across internal wikis, Slack, email, docs. Natural language 
                queries against organizational knowledge.
              </p>
            </CardContent>
          </Card>
        </div>

        <h4 className="text-lg font-medium mt-8 mb-4 text-foreground">
          Anti-Patterns to Avoid
        </h4>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Over-engineering Simple Tasks</h4>
              <p className="text-sm text-muted-foreground m-0">
                Don&apos;t build a RAG pipeline for tasks where a well-crafted prompt suffices. 
                If your knowledge fits in the context window and doesn&apos;t change, just include it directly.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Ignoring Retrieval Quality</h4>
              <p className="text-sm text-muted-foreground m-0">
                RAG is only as good as what it retrieves. If your chunks are poorly constructed or 
                your embedding model doesn&apos;t match your domain, garbage in = garbage out.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Expecting Perfect Accuracy</h4>
              <p className="text-sm text-muted-foreground m-0">
                RAG reduces hallucinations but doesn&apos;t eliminate them. The LLM can still misinterpret 
                retrieved content. Always validate critical outputs.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ One-Size-Fits-All Chunking</h4>
              <p className="text-sm text-muted-foreground m-0">
                Different content types need different chunking strategies. Code, legal docs, and 
                conversational content all have different optimal approaches.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Next Steps" className="mt-8">
          <p className="m-0">
            Now that you understand RAG fundamentals, the following sections dive deep into implementation: 
            <strong> Vector Databases</strong> covers storage and similarity search, while 
            <strong> Chunking Strategies</strong> explores how to prepare your documents for optimal retrieval.
          </p>
        </Callout>
      </div>
    </section>
  );
}
