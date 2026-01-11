"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Shield, 
  Check,
  X,
  AlertTriangle,
  Lock,
  User,
  Bot,
} from "lucide-react";

// =============================================================================
// Permission Matrix Visualizer
// =============================================================================

interface Permission {
  id: string;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
}

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Record<string, "allowed" | "denied" | "approval">;
}

function PermissionMatrix() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const permissions: Permission[] = [
    { id: "read_files", name: "Read Files", description: "Access file contents", risk: "low" },
    { id: "write_files", name: "Write Files", description: "Modify file contents", risk: "medium" },
    { id: "execute_code", name: "Execute Code", description: "Run code/scripts", risk: "high" },
    { id: "network_access", name: "Network Access", description: "Make HTTP requests", risk: "medium" },
    { id: "database", name: "Database Access", description: "Query databases", risk: "high" },
    { id: "secrets", name: "Access Secrets", description: "Read API keys/credentials", risk: "high" },
  ];

  const roles: Role[] = [
    {
      id: "viewer",
      name: "Viewer Agent",
      color: "cyan",
      permissions: {
        read_files: "allowed",
        write_files: "denied",
        execute_code: "denied",
        network_access: "denied",
        database: "denied",
        secrets: "denied",
      },
    },
    {
      id: "developer",
      name: "Developer Agent",
      color: "violet",
      permissions: {
        read_files: "allowed",
        write_files: "allowed",
        execute_code: "approval",
        network_access: "allowed",
        database: "approval",
        secrets: "denied",
      },
    },
    {
      id: "admin",
      name: "Admin Agent",
      color: "amber",
      permissions: {
        read_files: "allowed",
        write_files: "allowed",
        execute_code: "allowed",
        network_access: "allowed",
        database: "allowed",
        secrets: "approval",
      },
    },
  ];

  const getPermissionIcon = (status: "allowed" | "denied" | "approval") => {
    switch (status) {
      case "allowed": return <Check className="w-4 h-4 text-emerald-400" />;
      case "denied": return <X className="w-4 h-4 text-rose-400" />;
      case "approval": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getRiskBadge = (risk: Permission["risk"]) => {
    const colors = {
      low: "bg-emerald-500/10 text-emerald-400",
      medium: "bg-amber-500/10 text-amber-400",
      high: "bg-rose-500/10 text-rose-400",
    };
    return (
      <span className={cn("px-1.5 py-0.5 text-[10px] rounded uppercase", colors[risk])}>
        {risk}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Role selector */}
      <div className="flex gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              selectedRole === role.id
                ? `bg-${role.color}-500/20 text-${role.color}-400 ring-1 ring-${role.color}-500/50`
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
            style={{
              backgroundColor: selectedRole === role.id ? `var(--${role.color}-500-20, rgba(100,150,200,0.2))` : undefined,
              color: selectedRole === role.id ? `var(--${role.color}-400, rgb(100,180,220))` : undefined,
            }}
          >
            <Bot className="w-4 h-4" />
            {role.name}
          </button>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium text-foreground">Permission</th>
              <th className="text-center p-3 font-medium text-muted-foreground text-xs">Risk</th>
              {roles.map((role) => (
                <th 
                  key={role.id} 
                  className={cn(
                    "text-center p-3 font-medium text-xs transition-all",
                    selectedRole === role.id ? `text-${role.color}-400` : "text-muted-foreground"
                  )}
                  style={{
                    color: selectedRole === role.id ? `var(--${role.color}-400, rgb(100,180,220))` : undefined,
                  }}
                >
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} className="border-b border-border/50">
                <td className="p-3">
                  <div className="font-medium text-foreground">{perm.name}</div>
                  <div className="text-xs text-muted-foreground">{perm.description}</div>
                </td>
                <td className="p-3 text-center">{getRiskBadge(perm.risk)}</td>
                {roles.map((role) => (
                  <td 
                    key={role.id} 
                    className={cn(
                      "p-3 text-center transition-all",
                      selectedRole === role.id ? "bg-muted/20" : ""
                    )}
                  >
                    {getPermissionIcon(role.permissions[perm.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Allowed</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="w-3 h-3 text-rose-400" />
          <span>Denied</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Requires Approval</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function GuardrailsSection() {
  return (
    <section id="guardrails" className="scroll-mt-20">
      <SectionHeading
        id="guardrails-heading"
        title="Guardrails & RBAC"
        subtitle="Protecting your systems with access controls"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          As agents gain more capabilities, <strong className="text-foreground">guardrails</strong> become 
          essential. Role-Based Access Control (RBAC) and permission systems ensure agents can only 
          perform actions appropriate to their role and the current context.
        </p>

        <Callout variant="important" title="The Principle of Least Privilege">
          <p className="m-0">
            Agents should have the <strong>minimum permissions</strong> necessary to accomplish their task. 
            A documentation agent doesn&apos;t need database write access. A code reviewer doesn&apos;t need 
            to execute code. Restrict by default, grant explicitly.
          </p>
        </Callout>

        {/* Permission Matrix */}
        <h3 id="permission-matrix" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Permission Matrix
        </h3>

        <p className="text-muted-foreground">
          Define what each agent role can and cannot do. Click roles below to highlight their permissions.
        </p>

        <InteractiveWrapper
          title="Interactive: RBAC Permission Matrix"
          description="Explore role-based access controls"
          icon="🛡️"
          colorTheme="amber"
          minHeight="auto"
        >
          <PermissionMatrix />
        </InteractiveWrapper>

        {/* Types of Guardrails */}
        <h3 id="guardrail-types" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Types of Guardrails
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Tool Access Control</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Restrict which tools an agent can invoke. A read-only agent gets <code>readFile</code> 
                    but not <code>writeFile</code>. Define tool sets per role.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Input Validation</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Check agent outputs before executing. Validate file paths are within allowed 
                    directories. Verify SQL queries don&apos;t contain dangerous operations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Content Filtering</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Filter agent inputs and outputs for sensitive content. Block PII, detect 
                    prompt injection attempts, prevent data exfiltration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Human Approval Gates</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Require human confirmation for high-risk operations. Database deletes, 
                    production deployments, and financial transactions should pause for approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation */}
        <h3 id="implementation" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Implementation Pattern
        </h3>

        <p className="text-muted-foreground">
          Implement guardrails using role-based access control. Define roles with allowed tools, denied tools, 
          tools requiring approval, path restrictions, and optional cost limits. Validate tool calls by checking 
          explicit denials first, then approval requirements, then allowed tools (including wildcards). For file 
          operations, validate paths against restrictions. This ensures agents can only perform actions appropriate 
          for their role.
        </p>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Default deny, explicitly allow</li>
                <li>Log all permission checks and decisions</li>
                <li>Validate at the boundary, not inside</li>
                <li>Use separate roles for different contexts</li>
                <li>Regularly audit permission usage</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Trusting agent output without validation</li>
                <li>Overly permissive default roles</li>
                <li>Skipping guardrails for &quot;trusted&quot; agents</li>
                <li>Silent failures on permission denials</li>
                <li>Hardcoding permissions in agent code</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Next: Human-in-the-Loop" className="mt-8">
          <p className="m-0">
            Guardrails set boundaries. <strong>Human-in-the-loop</strong> patterns ensure humans remain 
            in control for critical decisions, even when agents are highly autonomous.
          </p>
        </Callout>
      </div>
    </section>
  );
}
