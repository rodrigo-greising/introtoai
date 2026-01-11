"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  User, 
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

// =============================================================================
// Approval Flow Simulator
// =============================================================================

interface ApprovalRequest {
  id: string;
  action: string;
  details: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected" | "modified";
  agentReason?: string;
}

function ApprovalFlowSimulator() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "1",
      action: "Delete old backups",
      details: "Remove 47 backup files older than 30 days (2.3GB)",
      risk: "medium",
      status: "pending",
      agentReason: "Cleaning up disk space per maintenance schedule",
    },
    {
      id: "2",
      action: "Deploy to production",
      details: "Deploy v2.4.1 with 3 changed files",
      risk: "high",
      status: "pending",
      agentReason: "All tests passing, changelog reviewed",
    },
    {
      id: "3",
      action: "Update API key",
      details: "Rotate Stripe API key in production secrets",
      risk: "high",
      status: "pending",
      agentReason: "Key rotation required per security policy",
    },
  ]);

  const [showFlow, setShowFlow] = useState(false);

  const handleApprove = useCallback((id: string) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: "approved" as const } : r
    ));
  }, []);

  const handleReject = useCallback((id: string) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: "rejected" as const } : r
    ));
  }, []);

  const resetAll = useCallback(() => {
    setRequests(prev => prev.map(r => ({ ...r, status: "pending" as const })));
  }, []);

  const getRiskColor = (risk: ApprovalRequest["risk"]) => {
    switch (risk) {
      case "low": return "text-emerald-400 bg-emerald-500/10";
      case "medium": return "text-amber-400 bg-amber-500/10";
      case "high": return "text-rose-400 bg-rose-500/10";
    }
  };

  const getStatusIcon = (status: ApprovalRequest["status"]) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "rejected": return <XCircle className="w-5 h-5 text-rose-400" />;
      default: return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Flow visualization toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFlow(!showFlow)}
          className={cn(
            "text-sm px-3 py-1.5 rounded-lg transition-all",
            showFlow ? "bg-cyan-500/20 text-cyan-400" : "bg-muted/30 text-muted-foreground"
          )}
        >
          {showFlow ? "Hide Flow" : "Show Flow Diagram"}
        </button>
        <button
          onClick={resetAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Reset All
        </button>
      </div>

      {/* Flow diagram */}
      {showFlow && (
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Agent</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>High-Risk Action</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <User className="w-4 h-4 text-violet-400" />
              <span>Human Review</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Execute</span>
            </div>
          </div>
        </div>
      )}

      {/* Pending requests */}
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className={cn(
              "p-4 rounded-lg border transition-all",
              request.status === "pending"
                ? "bg-muted/30 border-border"
                : request.status === "approved"
                ? "bg-emerald-500/5 border-emerald-500/30"
                : "bg-rose-500/5 border-rose-500/30"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(request.status)}
                  <span className="font-medium">{request.action}</span>
                  <span className={cn("px-2 py-0.5 text-xs rounded-full", getRiskColor(request.risk))}>
                    {request.risk} risk
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{request.details}</p>
                <div className="flex items-start gap-2 text-xs">
                  <MessageSquare className="w-3 h-3 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground italic">&quot;{request.agentReason}&quot;</span>
                </div>
              </div>
              
              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <span>
          {requests.filter(r => r.status === "pending").length} pending
        </span>
        <span className="text-emerald-400">
          {requests.filter(r => r.status === "approved").length} approved
        </span>
        <span className="text-rose-400">
          {requests.filter(r => r.status === "rejected").length} rejected
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function HumanInLoopSection() {
  return (
    <section id="human-in-loop" className="scroll-mt-20">
      <SectionHeading
        id="human-in-loop-heading"
        title="Human-in-the-Loop"
        subtitle="Keeping humans in control of critical decisions"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Even highly autonomous agents need human oversight for critical decisions. 
          <strong className="text-foreground"> Human-in-the-loop (HITL)</strong> patterns ensure humans 
          can review, approve, or modify agent actions before they take effect.
        </p>

        <Callout variant="important" title="When to Require Human Approval">
          <p className="m-0">
            Consider HITL for: <strong>irreversible actions</strong> (deletes, deployments), 
            <strong> high-stakes decisions</strong> (financial, legal), <strong>novel situations</strong> 
            (first time the agent encounters something), and <strong>edge cases</strong> where agent confidence is low.
          </p>
        </Callout>

        {/* Interactive Approval Flow */}
        <h3 id="approval-flow" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Approval Flow
        </h3>

        <p className="text-muted-foreground">
          Simulate reviewing agent requests. Approve or reject each action to see how the flow works.
        </p>

        <InteractiveWrapper
          title="Interactive: Approval Queue"
          description="Review and approve agent actions"
          icon="👤"
          colorTheme="violet"
          minHeight="auto"
        >
          <ApprovalFlowSimulator />
        </InteractiveWrapper>

        {/* Patterns */}
        <h3 id="hitl-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          HITL Patterns
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Approval Gates</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agent pauses and waits for explicit human approval before proceeding. Good for 
                irreversible or high-risk operations. Adds latency but maximum safety.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Review Queues</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agent continues working but flags outputs for human review. Humans can correct 
                before final delivery. Balances speed with oversight.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Confidence Thresholds</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agent proceeds autonomously when confident but escalates to humans when unsure. 
                Requires calibrated confidence scores from the model.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Audit Trails</h4>
              <p className="text-sm text-muted-foreground m-0">
                Agent acts autonomously but logs everything for post-hoc review. Humans can 
                inspect, correct, and improve the system after the fact.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Implementation */}
        <h3 id="implementation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Implementation
        </h3>

        <p className="text-muted-foreground">
          Implement a human approval gate that requests approval for high-risk actions. The approval request 
          includes the action, details, risk level, and agent reasoning. Notify humans via Slack, email, or 
          dashboard, wait for their decision (or timeout), and use the response to proceed or stop. The human 
          can approve, reject, or modify the details before approval.
        </p>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Provide context for why agent wants to act</li>
                <li>Allow humans to modify, not just approve/reject</li>
                <li>Set reasonable timeouts (don&apos;t block forever)</li>
                <li>Log all approval decisions for learning</li>
                <li>Make the approval UI fast and friction-free</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Approval fatigue from too many requests</li>
                <li>Blocking on decisions that could be automated</li>
                <li>Missing context in approval requests</li>
                <li>No fallback when approver is unavailable</li>
                <li>Inconsistent approval criteria</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Reducing Approval Fatigue">
          <p className="m-0">
            If humans approve 99% of requests, your thresholds are too low. Tune the system so HITL 
            triggers only for genuinely uncertain or risky cases. Track approval rates and adjust.
          </p>
        </Callout>

        <Callout variant="info" title="Next: External Control" className="mt-8">
          <p className="m-0">
            HITL is reactive (humans respond to agent requests). <strong>External control patterns</strong> 
            give humans proactive control—boundaries, budgets, and kill switches.
          </p>
        </Callout>
      </div>
    </section>
  );
}
