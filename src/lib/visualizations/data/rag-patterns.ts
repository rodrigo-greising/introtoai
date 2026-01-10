/**
 * RAG Pattern Scenario Data
 *
 * Pre-defined scenarios demonstrating different RAG patterns:
 * - RAG as an agent tool (agentic retrieval)
 * - RAG for context engineering (HyDE-like patterns)
 */

import type {
  Scenario,
  ScenarioStep,
  ChatMessage,
  VectorPoint,
} from "../types";

// =============================================================================
// Helper Functions
// =============================================================================

function createStep(
  id: string,
  name: string,
  duration: number,
  messages: ChatMessage[] = [],
  vectorState?: ScenarioStep["vectorState"]
): ScenarioStep {
  return { id, name, duration, messages, vectorState };
}

function createMessage(
  id: string,
  role: ChatMessage["role"],
  content: string,
  metadata?: ChatMessage["metadata"]
): ChatMessage {
  return { id, role, content, metadata };
}

function createVector(
  id: string,
  label: string,
  x: number,
  y: number,
  category: VectorPoint["category"],
  content?: string,
  linkedTo?: string[]
): VectorPoint {
  return { id, label, x, y, category, content, linkedTo };
}

// =============================================================================
// Scenario: RAG as Agent Tool
// =============================================================================

const ragAsToolVectors: VectorPoint[] = [
  // User query
  createVector("query", "User Query", 0.15, 0.5, "query", "How do I reset my password?"),
  // FAQ entries in the database
  createVector("faq-1", "Password Reset", 0.7, 0.35, "faq", "To reset your password, go to Settings > Security > Reset Password. You'll receive an email with a reset link valid for 24 hours."),
  createVector("faq-2", "Account Recovery", 0.75, 0.5, "faq", "For account recovery, use the 'Forgot Password' link on the login page. Verify your identity via email or phone."),
  createVector("faq-3", "2FA Setup", 0.65, 0.7, "faq", "Enable two-factor authentication in Settings > Security > 2FA. Scan the QR code with your authenticator app."),
  createVector("faq-4", "Login Issues", 0.8, 0.65, "faq", "If you can't log in, clear your browser cache, check caps lock, and ensure you're using the correct email."),
  createVector("faq-5", "API Keys", 0.55, 0.25, "faq", "Generate API keys in Developer Settings. Keys are shown once—store them securely."),
];

const ragAsToolSteps: ScenarioStep[] = [
  createStep(
    "user-query",
    "User Question",
    600,
    [createMessage("m1", "user", "How do I reset my password?", { tokens: 8 })],
    { activeQuery: "query", showConnections: false }
  ),
  createStep(
    "agent-thinking",
    "Agent Reasoning",
    1000,
    [createMessage("m2", "orchestrator", "I need to find the specific steps for password reset. Let me search the knowledge base.", { tokens: 25 })],
    { activeQuery: "query", showConnections: false }
  ),
  createStep(
    "tool-call",
    "Tool Invocation",
    800,
    [createMessage("m3", "tool_call", "search_knowledge_base({\n  query: \"password reset steps\",\n  top_k: 3\n})", { tokens: 15 })],
    { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] }
  ),
  createStep(
    "retrieval",
    "Semantic Search",
    1200,
    [createMessage("m4", "tool_result", "Found 2 relevant results:\n\n[1] Password Reset (similarity: 0.94)\n\"To reset your password, go to Settings > Security > Reset Password...\"\n\n[2] Account Recovery (similarity: 0.82)\n\"For account recovery, use the 'Forgot Password' link...\"", { tokens: 85, highlight: true })],
    { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] }
  ),
  createStep(
    "response",
    "Generate Response",
    1000,
    [createMessage("m5", "assistant", "To reset your password:\n\n1. Go to **Settings > Security > Reset Password**\n2. Click the reset button\n3. Check your email for a reset link (valid for 24 hours)\n4. Follow the link to create a new password\n\nAlternatively, you can use the \"Forgot Password\" link on the login page to recover your account.", { tokens: 75 })],
    { activeQuery: "query", showConnections: true, matches: ["faq-1", "faq-2"] }
  ),
];

export const ragAsToolPattern: Scenario = {
  id: "rag-as-tool",
  name: "RAG as Agent Tool",
  description: "Agent decides when to search—RAG is a capability it can invoke",
  patternType: "dynamic",
  patternDescription: "The agent controls when and what to search. RAG is one of many tools available—used when the agent recognizes it needs external knowledge.",
  icon: "🔧",
  colorTheme: "cyan",
  steps: ragAsToolSteps,
  chatMessages: ragAsToolSteps.flatMap((s) => s.messages || []),
  vectors: ragAsToolVectors,
  insight: "The agent controls when and what to search. RAG is one of many tools available—used when the agent recognizes it needs external knowledge to answer accurately.",
};

// =============================================================================
// Scenario: RAG for Context Engineering (HyDE-like)
// =============================================================================

const ragContextEngVectors: VectorPoint[] = [
  // User query
  createVector("query", "User Query", 0.12, 0.5, "query", "Customer says product arrived damaged"),
  // Hypothetical questions (pre-generated, linked to SOPs)
  createVector("hypo-1", "\"Damaged delivery?\"", 0.45, 0.3, "hypothetical", "What do I do if a customer reports damaged goods?", ["sop-1"]),
  createVector("hypo-2", "\"Broken in transit?\"", 0.5, 0.45, "hypothetical", "How to handle items broken during shipping?", ["sop-1"]),
  createVector("hypo-3", "\"Refund request?\"", 0.4, 0.6, "hypothetical", "Customer wants a refund, what's the process?", ["sop-2"]),
  createVector("hypo-4", "\"Return policy?\"", 0.55, 0.7, "hypothetical", "What is our return and exchange policy?", ["sop-2"]),
  createVector("hypo-5", "\"Shipping delay?\"", 0.35, 0.8, "hypothetical", "How to handle late delivery complaints?", ["sop-3"]),
  // SOPs (the actual documents)
  createVector("sop-1", "SOP: Damaged Items", 0.8, 0.35, "sop", "DAMAGED ITEM PROCEDURE:\n1. Express empathy and apologize\n2. Request photos of damage\n3. Offer replacement OR full refund\n4. Arrange return pickup if needed\n5. Process within 24 hours\n6. Send follow-up satisfaction survey"),
  createVector("sop-2", "SOP: Refunds", 0.85, 0.6, "sop", "REFUND PROCEDURE:\n1. Verify order in system\n2. Check refund eligibility (30 days)\n3. Process via original payment\n4. Confirm refund timeline (3-5 days)\n5. Send confirmation email"),
  createVector("sop-3", "SOP: Shipping", 0.75, 0.8, "sop", "SHIPPING DELAY PROCEDURE:\n1. Check tracking status\n2. Contact carrier if needed\n3. Offer expedited reshipping\n4. Provide discount for inconvenience"),
];

const ragContextEngSteps: ScenarioStep[] = [
  createStep(
    "user-query",
    "User Request",
    600,
    [createMessage("m1", "user", "Customer says their product arrived damaged, what should I do?", { tokens: 12 })],
    { activeQuery: "query", showConnections: false }
  ),
  createStep(
    "context-matching",
    "Match Hypothetical Qs",
    1000,
    [createMessage("m2", "system", "Matching query against pre-indexed hypothetical questions...\n\nThese questions were generated from SOPs during ingestion, not from the user.", { tokens: 30 })],
    { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2"] }
  ),
  createStep(
    "retrieve-sops",
    "Follow Links to SOPs",
    800,
    [createMessage("m3", "context", "Hypothetical questions matched → following links to source SOPs:\n\n✓ \"What do I do if customer reports damaged goods?\" → SOP: Damaged Items\n✓ \"How to handle items broken during shipping?\" → SOP: Damaged Items\n\nInjecting SOP into context...", { tokens: 45, highlight: true })],
    { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] }
  ),
  createStep(
    "context-injection",
    "Context Assembled",
    1000,
    [createMessage("m4", "system", "Context now includes:\n\n📋 **DAMAGED ITEM PROCEDURE**\n1. Express empathy and apologize\n2. Request photos of damage\n3. Offer replacement OR full refund\n4. Arrange return pickup if needed\n5. Process within 24 hours\n6. Send follow-up satisfaction survey", { tokens: 65, highlight: true })],
    { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] }
  ),
  createStep(
    "response",
    "Generate Response",
    1200,
    [createMessage("m5", "assistant", "Here's how to handle this damaged item case:\n\n1. **Start with empathy**: \"I'm so sorry your order arrived damaged. Let me make this right for you.\"\n\n2. **Gather evidence**: Ask the customer to send photos of the damage.\n\n3. **Offer resolution**: Give them the choice of:\n   - Full replacement shipped immediately, OR\n   - Complete refund to original payment method\n\n4. **Handle logistics**: If they want a refund, arrange a free return pickup.\n\n5. **Follow up**: Process everything within 24 hours and send a satisfaction survey after.\n\nWould you like me to draft a response message to the customer?", { tokens: 140 })],
    { activeQuery: "query", showConnections: true, matches: ["hypo-1", "hypo-2", "sop-1"] }
  ),
];

export const ragContextEngPattern: Scenario = {
  id: "rag-context-eng",
  name: "RAG for Context Engineering",
  description: "Pre-index hypothetical questions → match user queries → inject relevant SOPs",
  patternType: "static",
  patternDescription: "System automatically matches queries to pre-generated hypothetical questions, then injects linked SOPs into context.",
  icon: "🧠",
  colorTheme: "violet",
  steps: ragContextEngSteps,
  chatMessages: ragContextEngSteps.flatMap((s) => s.messages || []),
  vectors: ragContextEngVectors,
  insight: "Instead of matching raw documents, we pre-generate hypothetical questions for each SOP. User queries match better against questions than document text—this is the 'HyDE' pattern in action.",
};

// =============================================================================
// Export All RAG Patterns
// =============================================================================

export const ragPatterns: Scenario[] = [
  ragAsToolPattern,
  ragContextEngPattern,
];

export default ragPatterns;
