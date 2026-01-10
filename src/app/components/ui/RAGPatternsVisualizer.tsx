"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SimulatedVector {
  id: string;
  label: string;
  x: number;
  y: number;
  category: "query" | "faq" | "hypothetical" | "sop" | "match";
  similarity?: number;
  linkedTo?: string[];
  content?: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "system" | "agent" | "tool_call" | "tool_result" | "context" | "response";
  content: string;
  highlight?: boolean;
  tokens?: number;
}

interface RAGStep {
  id: string;
  name: string;
  duration: number;
  messages: ChatMessage[];
  vectorState?: {
    activeQuery?: string;
    matches?: string[];
    showConnections?: boolean;
  };
}

interface RAGPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  steps: RAGStep[];
  vectors: SimulatedVector[];
  insight: string;
}

// ============================================================================
// Pattern Data: RAG as a Tool
// ============================================================================

const ragAsToolPattern: RAGPattern = {
  id: "rag-as-tool",
  name: "RAG as Agent Tool",
  description: "Agent decides when to search—RAG is a capability it can invoke",
  icon: "🔧",
  color: "cyan",
  insight: "The agent controls when and what to search. RAG is one of many tools available—used when the agent recognizes it needs external knowledge to answer accurately.",
  vectors: [
    // User query
    { id: "query", label: "User Query", x: 0.15, y: 0.5, category: "query", content: "How do I reset my password?" },
    // FAQ entries in the database
    { id: "faq-1", label: "Password Reset", x: 0.7, y: 0.35, category: "faq", content: "To reset your password, go to Settings > Security > Reset Password. You'll receive an email with a reset link valid for 24 hours." },
    { id: "faq-2", label: "Account Recovery", x: 0.75, y: 0.5, category: "faq", content: "For account recovery, use the 'Forgot Password' link on the login page. Verify your identity via email or phone." },
    { id: "faq-3", label: "2FA Setup", x: 0.65, y: 0.7, category: "faq", content: "Enable two-factor authentication in Settings > Security > 2FA. Scan the QR code with your authenticator app." },
    { id: "faq-4", label: "Login Issues", x: 0.8, y: 0.65, category: "faq", content: "If you can't log in, clear your browser cache, check caps lock, and ensure you're using the correct email." },
    { id: "faq-5", label: "API Keys", x: 0.55, y: 0.25, category: "faq", content: "Generate API keys in Developer Settings. Keys are shown once—store them securely." },
  ],
  steps: [
    {
      id: "user-query",
      name: "User Question",
      duration: 600,
      messages: [
        { id: "m1", type: "user", content: "How do I reset my password?", tokens: 8 },
      ],
      vectorState: { activeQuery: "query", showConnections: false },
    },
    {
      id: "agent-thinking",
      name: "Agent Reasoning",
      duration: 1000,
      messages: [
        { id: "m2", type: "agent", content: "I need to find the specific steps for password reset. Let me search the knowledge base.", tokens: 25 },
      ],
      vectorState: { activeQuery: "query", showConnections: false },
    },
    {
      id: "tool-call",
      name: "Tool Invocation",
      duration: 800,
      messages: [
        { id: "m3", type: "tool_call", content: "search_knowledge_base({\n  query: \"password reset steps\",\n  top_k: 3\n})", tokens: 15 },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] },
    },
    {
      id: "retrieval",
      name: "Semantic Search",
      duration: 1200,
      messages: [
        { id: "m4", type: "tool_result", content: "Found 2 relevant results:\n\n[1] Password Reset (similarity: 0.94)\n\"To reset your password, go to Settings > Security > Reset Password...\"\n\n[2] Account Recovery (similarity: 0.82)\n\"For account recovery, use the 'Forgot Password' link...\"", tokens: 85, highlight: true },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] },
    },
    {
      id: "response",
      name: "Generate Response",
      duration: 1000,
      messages: [
        { id: "m5", type: "response", content: "To reset your password:\n\n1. Go to **Settings > Security > Reset Password**\n2. Click the reset button\n3. Check your email for a reset link (valid for 24 hours)\n4. Follow the link to create a new password\n\nAlternatively, you can use the \"Forgot Password\" link on the login page to recover your account.", tokens: 75 },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] },
    },
  ],
};

// ============================================================================
// Pattern Data: RAG for Context Engineering (HyDE-like)
// ============================================================================

const ragContextEngPattern: RAGPattern = {
  id: "rag-context-eng",
  name: "RAG for Context Engineering",
  description: "Pre-index hypothetical questions → match user queries → inject relevant SOPs",
  icon: "🧠",
  color: "violet",
  insight: "Instead of matching raw documents, we pre-generate hypothetical questions for each SOP. User queries match better against questions than document text—this is the 'HyDE' pattern in action.",
  vectors: [
    // User query
    { id: "query", label: "User Query", x: 0.12, y: 0.5, category: "query", content: "Customer says product arrived damaged" },
    // Hypothetical questions (pre-generated, linked to SOPs)
    { id: "hypo-1", label: "\"Damaged delivery?\"", x: 0.45, y: 0.3, category: "hypothetical", linkedTo: ["sop-1"], content: "What do I do if a customer reports damaged goods?" },
    { id: "hypo-2", label: "\"Broken in transit?\"", x: 0.5, y: 0.45, category: "hypothetical", linkedTo: ["sop-1"], content: "How to handle items broken during shipping?" },
    { id: "hypo-3", label: "\"Refund request?\"", x: 0.4, y: 0.6, category: "hypothetical", linkedTo: ["sop-2"], content: "Customer wants a refund, what's the process?" },
    { id: "hypo-4", label: "\"Return policy?\"", x: 0.55, y: 0.7, category: "hypothetical", linkedTo: ["sop-2"], content: "What is our return and exchange policy?" },
    { id: "hypo-5", label: "\"Shipping delay?\"", x: 0.35, y: 0.8, category: "hypothetical", linkedTo: ["sop-3"], content: "How to handle late delivery complaints?" },
    // SOPs (the actual documents)
    { id: "sop-1", label: "SOP: Damaged Items", x: 0.8, y: 0.35, category: "sop", content: "DAMAGED ITEM PROCEDURE:\n1. Express empathy and apologize\n2. Request photos of damage\n3. Offer replacement OR full refund\n4. Arrange return pickup if needed\n5. Process within 24 hours\n6. Send follow-up satisfaction survey" },
    { id: "sop-2", label: "SOP: Refunds", x: 0.85, y: 0.6, category: "sop", content: "REFUND PROCEDURE:\n1. Verify order in system\n2. Check refund eligibility (30 days)\n3. Process via original payment\n4. Confirm refund timeline (3-5 days)\n5. Send confirmation email" },
    { id: "sop-3", label: "SOP: Shipping", x: 0.75, y: 0.8, category: "sop", content: "SHIPPING DELAY PROCEDURE:\n1. Check tracking status\n2. Contact carrier if needed\n3. Offer expedited reshipping\n4. Provide discount for inconvenience" },
  ],
  steps: [
    {
      id: "user-query",
      name: "User Request",
      duration: 600,
      messages: [
        { id: "m1", type: "user", content: "Customer says their product arrived damaged, what should I do?", tokens: 12 },
      ],
      vectorState: { activeQuery: "query", showConnections: false },
    },
    {
      id: "context-matching",
      name: "Match Hypothetical Qs",
      duration: 1000,
      messages: [
        { id: "m2", type: "system", content: "Matching query against pre-indexed hypothetical questions...\n\nThese questions were generated from SOPs during ingestion, not from the user.", tokens: 30 },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2"] },
    },
    {
      id: "retrieve-sops",
      name: "Follow Links to SOPs",
      duration: 800,
      messages: [
        { id: "m3", type: "context", content: "Hypothetical questions matched → following links to source SOPs:\n\n✓ \"What do I do if customer reports damaged goods?\" → SOP: Damaged Items\n✓ \"How to handle items broken during shipping?\" → SOP: Damaged Items\n\nInjecting SOP into context...", tokens: 45, highlight: true },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] },
    },
    {
      id: "context-injection",
      name: "Context Assembled",
      duration: 1000,
      messages: [
        { id: "m4", type: "system", content: "Context now includes:\n\n📋 **DAMAGED ITEM PROCEDURE**\n1. Express empathy and apologize\n2. Request photos of damage\n3. Offer replacement OR full refund\n4. Arrange return pickup if needed\n5. Process within 24 hours\n6. Send follow-up satisfaction survey", tokens: 65, highlight: true },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] },
    },
    {
      id: "response",
      name: "Generate Response",
      duration: 1200,
      messages: [
        { id: "m5", type: "response", content: "Here's how to handle this damaged item case:\n\n1. **Start with empathy**: \"I'm so sorry your order arrived damaged. Let me make this right for you.\"\n\n2. **Gather evidence**: Ask the customer to send photos of the damage.\n\n3. **Offer resolution**: Give them the choice of:\n   - Full replacement shipped immediately, OR\n   - Complete refund to original payment method\n\n4. **Handle logistics**: If they want a refund, arrange a free return pickup.\n\n5. **Follow up**: Process everything within 24 hours and send a satisfaction survey after.\n\nWould you like me to draft a response message to the customer?", tokens: 140 },
      ],
      vectorState: { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] },
    },
  ],
};

// ============================================================================
// Embedding Space Visualization Component
// ============================================================================

interface EmbeddingSpaceProps {
  vectors: SimulatedVector[];
  activeQuery?: string;
  matches?: string[];
  showConnections?: boolean;
  color: string;
}

function EmbeddingSpace({ vectors, activeQuery, matches = [], showConnections, color }: EmbeddingSpaceProps) {
  const matchSet = useMemo(() => new Set(matches), [matches]);
  
  const categoryColors = {
    query: "#22d3ee",
    faq: "#94a3b8",
    hypothetical: "#a78bfa",
    sop: "#10b981",
    match: "#fbbf24",
  };

  const categoryLabels = {
    query: "Query",
    faq: "FAQ Entry",
    hypothetical: "Hypothetical Q",
    sop: "SOP Document",
    match: "Match",
  };

  // Calculate similarity scores for display
  const queriedVector = vectors.find(v => v.id === activeQuery);
  const vectorsWithSimilarity = vectors.map(v => {
    if (v.id === activeQuery || !queriedVector) return v;
    // Simulated similarity based on whether it's a match
    const similarity = matchSet.has(v.id) 
      ? 0.8 + Math.random() * 0.18 
      : 0.3 + Math.random() * 0.25;
    return { ...v, similarity };
  });

  // Find SOPs linked from matched hypotheticals
  const linkedSopIds = useMemo(() => {
    const sopIds = new Set<string>();
    vectors.forEach(v => {
      if (matchSet.has(v.id) && v.linkedTo) {
        v.linkedTo.forEach(id => sopIds.add(id));
      }
    });
    return sopIds;
  }, [vectors, matchSet]);

  return (
    <div className="relative w-full h-full min-h-[280px] bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="rag-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rag-grid)" />
      </svg>

      {/* Connection lines */}
      {showConnections && activeQuery && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Query to matches */}
          {vectorsWithSimilarity.map(v => {
            if (v.id === activeQuery) return null;
            const isMatch = matchSet.has(v.id);
            const isLinkedSop = linkedSopIds.has(v.id);
            if (!isMatch && !isLinkedSop) return null;
            
            const query = vectorsWithSimilarity.find(q => q.id === activeQuery);
            if (!query) return null;

            // For hypotheticals linking to SOPs
            if (v.category === "hypothetical" && v.linkedTo && showConnections) {
              return (
                <g key={`link-group-${v.id}`}>
                  {/* Query to hypothetical */}
                  <line
                    x1={`${query.x * 100}%`}
                    y1={`${query.y * 100}%`}
                    x2={`${v.x * 100}%`}
                    y2={`${v.y * 100}%`}
                    stroke={categoryColors.query}
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    strokeDasharray={isMatch ? "none" : "4 4"}
                    className="transition-all duration-500"
                  />
                  {/* Hypothetical to SOPs */}
                  {v.linkedTo.map(sopId => {
                    const sop = vectors.find(s => s.id === sopId);
                    if (!sop) return null;
                    return (
                      <line
                        key={`link-${v.id}-${sopId}`}
                        x1={`${v.x * 100}%`}
                        y1={`${v.y * 100}%`}
                        x2={`${sop.x * 100}%`}
                        y2={`${sop.y * 100}%`}
                        stroke={categoryColors.sop}
                        strokeWidth="2"
                        strokeOpacity={isMatch ? "0.8" : "0.3"}
                        strokeDasharray="6 3"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </g>
              );
            }

            return (
              <line
                key={`line-${v.id}`}
                x1={`${query.x * 100}%`}
                y1={`${query.y * 100}%`}
                x2={`${v.x * 100}%`}
                y2={`${v.y * 100}%`}
                stroke={isMatch ? categoryColors.query : "rgba(148, 163, 184, 0.3)"}
                strokeWidth={isMatch ? "2" : "1"}
                strokeOpacity={isMatch ? "0.6" : "0.3"}
                strokeDasharray={isMatch ? "none" : "4 4"}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
      )}

      {/* Vector points */}
      {vectorsWithSimilarity.map(v => {
        const isActive = v.id === activeQuery;
        const isMatch = matchSet.has(v.id);
        const isLinkedSop = linkedSopIds.has(v.id);
        const isHighlighted = isActive || isMatch || isLinkedSop;
        const pointColor = isActive ? categoryColors.query : categoryColors[v.category];

        return (
          <div
            key={v.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group",
              isHighlighted ? "z-20" : "z-10"
            )}
            style={{
              left: `${v.x * 100}%`,
              top: `${v.y * 100}%`,
            }}
          >
            {/* Glow effect for highlighted */}
            {isHighlighted && (
              <div
                className="absolute inset-0 -m-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: pointColor,
                  opacity: 0.2,
                  filter: "blur(8px)",
                }}
              />
            )}

            {/* Point */}
            <div
              className={cn(
                "rounded-full transition-all duration-300",
                isActive ? "w-5 h-5" : isHighlighted ? "w-4 h-4" : "w-3 h-3"
              )}
              style={{
                backgroundColor: pointColor,
                boxShadow: isHighlighted ? `0 0 12px ${pointColor}` : "none",
              }}
            />

            {/* Label */}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
                isHighlighted
                  ? "-top-8 opacity-100 bg-slate-800 border border-slate-600 px-2 py-1 rounded text-[11px]"
                  : "-top-6 opacity-60 text-[10px]"
              )}
              style={{ color: isHighlighted ? pointColor : "#94a3b8" }}
            >
              {v.label}
              {isMatch && v.similarity && (
                <span className="ml-1 text-emerald-400">
                  ({(v.similarity * 100).toFixed(0)}%)
                </span>
              )}
            </div>

            {/* Tooltip on hover */}
            {v.content && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-48 p-2 rounded bg-slate-800 border border-slate-600 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: pointColor }}>
                  {categoryLabels[v.category]}
                </div>
                <p className="m-0 line-clamp-3">{v.content}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
        {Object.entries(categoryLabels).filter(([cat]) => 
          vectors.some(v => v.category === cat)
        ).map(([cat, label]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: categoryColors[cat as keyof typeof categoryColors] }} 
            />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Embedding space label */}
      <div className={cn(
        "absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-medium",
        color === "cyan" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"
      )}>
        Embedding Space
      </div>
    </div>
  );
}

// ============================================================================
// Chat Panel Component
// ============================================================================

interface ChatPanelProps {
  messages: ChatMessage[];
  color: string;
}

function ChatPanel({ messages, color }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const typeStyles = {
    user: {
      bg: "bg-slate-700/50 border border-slate-600/50",
      icon: "👤",
      label: "User",
      labelColor: "text-slate-400",
    },
    system: {
      bg: "bg-slate-800/50 border border-slate-700/50",
      icon: "⚙️",
      label: "System",
      labelColor: "text-slate-500",
    },
    agent: {
      bg: color === "cyan" ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-violet-500/10 border border-violet-500/30",
      icon: "🤖",
      label: "Agent",
      labelColor: color === "cyan" ? "text-cyan-400" : "text-violet-400",
    },
    tool_call: {
      bg: "bg-amber-500/10 border border-amber-500/30",
      icon: "→",
      label: "Tool Call",
      labelColor: "text-amber-400",
    },
    tool_result: {
      bg: "bg-emerald-500/10 border border-emerald-500/30",
      icon: "←",
      label: "Retrieved",
      labelColor: "text-emerald-400",
    },
    context: {
      bg: "bg-violet-500/10 border border-violet-500/30",
      icon: "📋",
      label: "Context",
      labelColor: "text-violet-400",
    },
    response: {
      bg: color === "cyan" ? "bg-cyan-500/15 border border-cyan-500/40" : "bg-violet-500/15 border border-violet-500/40",
      icon: "✓",
      label: "Response",
      labelColor: color === "cyan" ? "text-cyan-400" : "text-violet-400",
    },
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2 min-h-[280px]">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Press Play to see the RAG flow
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
      {messages.map((msg) => {
        const style = typeStyles[msg.type];
        return (
          <div
            key={msg.id}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-all duration-300",
              style.bg,
              msg.highlight && "ring-2 ring-offset-1 ring-offset-slate-900",
              msg.highlight && (color === "cyan" ? "ring-cyan-500/50" : "ring-violet-500/50")
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">{style.icon}</span>
              <span className={cn("text-[9px] font-medium uppercase tracking-wider", style.labelColor)}>
                {style.label}
              </span>
              {msg.tokens && (
                <span className="ml-auto text-[9px] text-muted-foreground font-mono">
                  ~{msg.tokens} tokens
                </span>
              )}
            </div>
            <p className={cn(
              "whitespace-pre-wrap leading-relaxed m-0 text-[13px] text-slate-200",
              msg.type === "tool_call" && "font-mono text-[11px]"
            )}>
              {msg.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface RAGPatternsVisualizerProps {
  className?: string;
}

export function RAGPatternsVisualizer({ className }: RAGPatternsVisualizerProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>("rag-as-tool");
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);

  const patterns = [ragAsToolPattern, ragContextEngPattern];
  const pattern = useMemo(() => 
    patterns.find(p => p.id === selectedPattern) || patterns[0],
    [selectedPattern]
  );

  // Reset when pattern changes
  useEffect(() => {
    setCurrentStepIndex(-1);
    setVisibleMessages([]);
    setIsPlaying(false);
  }, [selectedPattern]);

  const reset = useCallback(() => {
    setCurrentStepIndex(-1);
    setVisibleMessages([]);
    setIsPlaying(false);
  }, []);

  // Playback logic
  useEffect(() => {
    if (!isPlaying) return;

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex >= pattern.steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = pattern.steps[nextStepIndex];
    const timer = setTimeout(() => {
      setCurrentStepIndex(nextStepIndex);
      setVisibleMessages(prev => [...prev, ...step.messages]);
      
      // Check if this is the last step
      if (nextStepIndex >= pattern.steps.length - 1) {
        setIsPlaying(false);
      }
    }, nextStepIndex === 0 ? 300 : step.duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, pattern]);

  // Get current vector state
  const currentVectorState = currentStepIndex >= 0 
    ? pattern.steps[currentStepIndex]?.vectorState 
    : undefined;

  const progress = pattern.steps.length > 0 
    ? ((currentStepIndex + 1) / pattern.steps.length) * 100 
    : 0;
  const isComplete = currentStepIndex >= pattern.steps.length - 1;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pattern Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPattern(p.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedPattern === p.id
                ? p.color === "cyan"
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                  : "bg-violet-500/20 text-violet-400 border-violet-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span>{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>

      {/* Pattern Description */}
      <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        pattern.color === "cyan" 
          ? "bg-cyan-500/5 border-cyan-500/20" 
          : "bg-violet-500/5 border-violet-500/20"
      )}>
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl",
          pattern.color === "cyan" ? "bg-cyan-500/20" : "bg-violet-500/20"
        )}>
          {pattern.icon}
        </div>
        <div>
          <p className="text-sm text-foreground font-medium mb-1 m-0">{pattern.name}</p>
          <p className="text-xs text-muted-foreground m-0">{pattern.description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isComplete) {
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
            ) : isComplete ? (
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
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Step {Math.max(0, currentStepIndex + 1)} of {pattern.steps.length}
          {currentStepIndex >= 0 && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded text-[10px] font-medium",
              pattern.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"
            )}>
              {pattern.steps[currentStepIndex]?.name}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-500",
            pattern.color === "cyan" 
              ? "bg-gradient-to-r from-cyan-500 to-emerald-400" 
              : "bg-gradient-to-r from-violet-500 to-pink-400"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat Panel */}
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                pattern.color === "cyan" ? "bg-cyan-500" : "bg-violet-500"
              )} />
              <h5 className="font-semibold text-foreground text-sm">Conversation Flow</h5>
            </div>
            <p className="text-[10px] text-muted-foreground m-0 mt-1">
              {pattern.id === "rag-as-tool" 
                ? "Agent decides to use search tool"
                : "System matches query to hypothetical questions"
              }
            </p>
          </div>
          <div className="p-3 min-h-[280px]">
            <ChatPanel messages={visibleMessages} color={pattern.color} />
          </div>
        </div>

        {/* Embedding Space Panel */}
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                pattern.color === "cyan" ? "bg-cyan-500" : "bg-violet-500"
              )} />
              <h5 className="font-semibold text-foreground text-sm">Vector Space</h5>
            </div>
            <p className="text-[10px] text-muted-foreground m-0 mt-1">
              Semantic similarity in embedding space
            </p>
          </div>
          <div className="p-3">
            <EmbeddingSpace
              vectors={pattern.vectors}
              activeQuery={currentVectorState?.activeQuery}
              matches={currentVectorState?.matches}
              showConnections={currentVectorState?.showConnections}
              color={pattern.color}
            />
          </div>
        </div>
      </div>

      {/* Insight Callout */}
      <div className={cn(
        "rounded-lg p-4 border",
        pattern.color === "cyan" 
          ? "bg-cyan-500/5 border-cyan-500/20" 
          : "bg-violet-500/5 border-violet-500/20"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
            pattern.color === "cyan" ? "bg-cyan-500/20" : "bg-violet-500/20"
          )}>
            <svg className={cn(
              "w-4 h-4",
              pattern.color === "cyan" ? "text-cyan-400" : "text-violet-400"
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className={cn(
              "font-medium mb-1",
              pattern.color === "cyan" ? "text-cyan-400" : "text-violet-400"
            )}>
              Key Insight
            </h4>
            <p className="text-sm text-muted-foreground m-0">{pattern.insight}</p>
          </div>
        </div>
      </div>

      {/* Comparison callout when viewing context engineering */}
      {pattern.id === "rag-context-eng" && (
        <div className="rounded-lg p-4 border bg-amber-500/5 border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-amber-500/20">
              <span className="text-base">🔀</span>
            </div>
            <div>
              <h4 className="font-medium mb-1 text-amber-400">vs. RAG as Tool</h4>
              <p className="text-sm text-muted-foreground m-0">
                The key difference: <strong className="text-foreground">RAG as Tool</strong> lets the agent decide 
                when to search. <strong className="text-foreground">RAG for Context Engineering</strong> happens 
                automatically—the system pre-fetches relevant SOPs before the agent even sees the query. 
                Both approaches have their place depending on whether you want agent autonomy or guaranteed context injection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
