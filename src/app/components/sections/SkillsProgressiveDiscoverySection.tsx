"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Search,
  Code2,
  Shield,
  Database,
  FileText,
  CheckCircle,
} from "lucide-react";

// =============================================================================
// Skill Registry Browser
// =============================================================================

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  triggers: string[];
  tools: string[];
  loaded: boolean;
}

function SkillRegistryBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadedSkills, setLoadedSkills] = useState<Set<string>>(new Set());

  const skills: Skill[] = [
    {
      id: "code-review",
      name: "Code Review",
      category: "core",
      icon: <Code2 className="w-4 h-4" />,
      description: "Analyze code for correctness, style, and best practices",
      triggers: ["review", "PR", "pull request", "code quality"],
      tools: ["readFile", "analyzeDiff", "lintCode"],
      loaded: false,
    },
    {
      id: "security-audit",
      name: "Security Audit",
      category: "security",
      icon: <Shield className="w-4 h-4" />,
      description: "Check for vulnerabilities and security issues",
      triggers: ["security", "vulnerability", "CVE", "audit"],
      tools: ["scanDependencies", "checkSecrets", "analyzePermissions"],
      loaded: false,
    },
    {
      id: "database-migration",
      name: "Database Migration",
      category: "data",
      icon: <Database className="w-4 h-4" />,
      description: "Create and validate database schema changes",
      triggers: ["migration", "schema", "database", "SQL"],
      tools: ["generateMigration", "validateSchema", "rollbackPlan"],
      loaded: false,
    },
    {
      id: "documentation",
      name: "Documentation",
      category: "core",
      icon: <FileText className="w-4 h-4" />,
      description: "Generate and update technical documentation",
      triggers: ["docs", "readme", "documentation", "API docs"],
      tools: ["extractTypes", "generateDocs", "updateReadme"],
      loaded: false,
    },
  ];

  const categories = [...new Set(skills.map(s => s.category))];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.triggers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleSkillLoad = (skillId: string) => {
    setLoadedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search skills by name, trigger, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Skill cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredSkills.map(skill => {
          const isLoaded = loadedSkills.has(skill.id);
          
          return (
            <div
              key={skill.id}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer",
                isLoaded
                  ? "bg-cyan-500/10 border-cyan-500/30"
                  : "bg-muted/30 border-border hover:border-border/80"
              )}
              onClick={() => toggleSkillLoad(skill.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded",
                    isLoaded ? "bg-cyan-500/20 text-cyan-400" : "bg-muted text-muted-foreground"
                  )}>
                    {skill.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.category}</div>
                  </div>
                </div>
                {isLoaded && (
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
              
              {isLoaded && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Triggers</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.triggers.map(t => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-cyan-500/10 text-cyan-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Tools</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.tools.map(t => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <span>{skills.length} skills available</span>
        <span>•</span>
        <span className="text-cyan-400">{loadedSkills.size} loaded</span>
        <span className="ml-auto">Click a skill to load/unload</span>
      </div>
    </div>
  );
}

export function SkillsProgressiveDiscoverySection() {
  return (
    <section id="skills-progressive-discovery" className="scroll-mt-20">
      <SectionHeading
        id="skills-progressive-discovery-heading"
        title="Skills & Progressive Discovery"
        subtitle="Modular capabilities, subagents, and context-aware delegation"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Building on the delegation principles we&apos;ve covered, <strong className="text-foreground">Skills</strong> are 
          a powerful pattern for creating modular, reusable agent capabilities. Pioneered by Anthropic in Claude Code, 
          this approach treats specialized capabilities as <em>self-contained packages</em> that agents can discover 
          and load on demand.
        </p>

        <Callout variant="info" title="Why This Matters">
          <p className="m-0">
            Skills solve a fundamental tension in agent design: you want agents to be capable of many things, 
            but you don&apos;t want to bloat every context with instructions for everything. Skills let you 
            <strong> have both</strong>—broad capability with focused context.
          </p>
        </Callout>

        {/* What are Agent Skills */}
        <h3 id="what-are-skills" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          What are Agent Skills
        </h3>

        <p className="text-muted-foreground">
          An <strong className="text-foreground">Agent Skill</strong> is a modular, self-contained unit of capability 
          that packages together everything an agent needs to perform a specialized task:
        </p>

        <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
          <li><strong className="text-foreground">Instructions:</strong> Detailed guidance for how to approach the task</li>
          <li><strong className="text-foreground">Context documents:</strong> Reference materials, examples, and domain knowledge</li>
          <li><strong className="text-foreground">Specialized tools:</strong> Functions and scripts tailored to this capability</li>
          <li><strong className="text-foreground">Behavior guidelines:</strong> Constraints, best practices, and edge case handling</li>
        </ul>

        <p className="text-muted-foreground mt-4">
          Think of skills as <strong className="text-foreground">mini-experts</strong> the agent can call upon. 
          Just as a software architect might consult specialists for security audits, database optimization, 
          or frontend design, an agent with skills can tap into domain-specific expertise when needed.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Monolithic Approach</h4>
              <p className="text-sm text-muted-foreground m-0">
                One massive system prompt trying to cover every possible task—database queries, 
                code review, documentation, testing, deployment...
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">✓ Skills-Based Approach</h4>
              <p className="text-sm text-muted-foreground m-0">
                Core agent knows <em>how to find and use skills</em>. Each skill is loaded 
                only when its expertise is needed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Anatomy of a Skill */}
        <h3 id="skill-anatomy" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Anatomy of a Skill
        </h3>

        <p className="text-muted-foreground">
          In Anthropic&apos;s agent skills standard, each skill is organized as a directory with a specific structure. 
          The central component is a <code className="text-cyan-400">SKILL.md</code> file that serves as the 
          skill&apos;s &quot;contract&quot;—defining what it does and how to use it.
        </p>

        <p className="text-muted-foreground mt-4">
          Skills are organized as directories with a <code className="text-cyan-400">SKILL.md</code> file 
          that serves as the skill&apos;s contract. The SKILL.md file typically contains: purpose, when to use, 
          capabilities, required context, tools available, and output format. Skills can include additional 
          files like instructions, checklists, patterns, validators, and tools.
        </p>

        <Callout variant="tip" title="Skills are Composable">
          <p className="m-0">
            Skills can reference other skills. A &quot;Full PR Review&quot; skill might compose 
            code-review, security-audit, and documentation-check skills together, 
            creating higher-level capabilities from atomic units.
          </p>
        </Callout>

        {/* Progressive Disclosure Pattern */}
        <h3 id="progressive-disclosure" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Progressive Disclosure Pattern
        </h3>

        <p className="text-muted-foreground">
          The key insight that makes skills efficient is <strong className="text-foreground">progressive 
          disclosure</strong>—loading information only when needed. This three-stage pattern keeps 
          context lean while maintaining broad capabilities:
        </p>

        <div className="grid gap-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">1</div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Boot Stage: Metadata Only</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    At startup, load only <strong>names and brief descriptions</strong> of available skills. 
                    This gives the agent awareness of its capabilities without consuming context.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2 m-0">
                    ~50-100 tokens per skill × many skills = manageable overhead
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">2</div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Relevance Stage: Full SKILL.md</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    When a task arrives, the agent <strong>assesses which skills are relevant</strong> based 
                    on the metadata. Only for relevant skills does it load the full SKILL.md with 
                    detailed instructions.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2 m-0">
                    ~500-2000 tokens for detailed skill instructions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">On-Demand Stage: Resources & Tools</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    As the agent works, it loads <strong>additional resources on demand</strong>—checklists, 
                    reference documents, example code—only when actually needed for the current step.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2 m-0">
                    Variable—loaded incrementally as needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="Connection to Context Engineering">
          <p className="m-0">
            Progressive disclosure directly implements the <strong>Signal Over Noise</strong> principle. 
            Rather than front-loading all possible instructions, you maintain high information density 
            by loading only what&apos;s relevant to the current task.
          </p>
        </Callout>

        <p className="text-muted-foreground">
          Progressive disclosure is implemented through a skill registry that loads metadata at boot (stage 1), 
          finds relevant skills based on task keywords (stage 2), loads full skill definitions when needed (stage 2), 
          and loads specific resources on demand (stage 3). This keeps context lean while maintaining broad capabilities.
        </p>

        {/* Subagents and Delegation */}
        <h3 id="subagents-delegation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Subagents and Delegation
        </h3>

        <p className="text-muted-foreground">
          Skills naturally pair with <strong className="text-foreground">subagents</strong>—specialized AI 
          instances that handle specific task types. When you delegate to a subagent, you&apos;re essentially 
          saying: &quot;Here&apos;s a focused task. Take this skill&apos;s context, do the work, and return the result.&quot;
        </p>

        <p className="text-muted-foreground">
          Each subagent operates with:
        </p>

        <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
          <li><strong className="text-foreground">Its own context window:</strong> Fresh, uncluttered by the main agent&apos;s conversation</li>
          <li><strong className="text-foreground">Custom system prompt:</strong> Tailored instructions from the skill definition</li>
          <li><strong className="text-foreground">Scoped tool access:</strong> Only the tools relevant to this specific task</li>
          <li><strong className="text-foreground">Defined output format:</strong> Structured results that the main agent can consume</li>
        </ul>

        <div className="mt-6 p-6 bg-card/50 rounded-lg border border-border">
          <h4 className="font-medium text-foreground mb-4 text-center">Delegation Flow</h4>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-center">
              <div className="text-cyan-400 font-medium">Main Agent</div>
              <div className="text-muted-foreground text-xs mt-1">High-level orchestration</div>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
              <div className="text-amber-400 font-medium">Skill Selection</div>
              <div className="text-muted-foreground text-xs mt-1">Match task to capability</div>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
              <div className="text-emerald-400 font-medium">Subagent</div>
              <div className="text-muted-foreground text-xs mt-1">Focused execution</div>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="px-4 py-3 bg-violet-500/10 border border-violet-500/30 rounded-lg text-center">
              <div className="text-violet-400 font-medium">Result</div>
              <div className="text-muted-foreground text-xs mt-1">Structured output</div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          Subagent delegation pattern: configure a subagent with a skill, task, and context. Build a focused 
          system prompt from the skill definition, provide only skill-specific tools, execute in isolated context 
          (no main conversation history), and return structured results. The subagent operates with its own context 
          window, custom system prompt, scoped tool access, and defined output format.
        </p>

        <Callout variant="tip" title="Subagents Can Have Subagents">
          <p className="m-0">
            Complex skills might spawn their own subagents. A &quot;Full Code Review&quot; skill might 
            delegate to security-scan, performance-analysis, and style-check subagents in parallel, 
            then synthesize their results. This creates a <strong>hierarchical delegation</strong> pattern.
          </p>
        </Callout>

        {/* Context Isolation Benefits */}
        <h3 id="context-isolation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Context Isolation Benefits
        </h3>

        <p className="text-muted-foreground">
          The subagent pattern provides <strong className="text-foreground">context isolation</strong>—each 
          specialized task runs in its own context window, separate from the main conversation. This 
          architectural choice yields several benefits:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">🎯 Focus Without Distraction</h4>
              <p className="text-sm text-muted-foreground m-0">
                The subagent sees only its task and skill context. No conversation history, 
                no unrelated context from other tasks—just pure signal.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-500 mb-2">🧹 Main Context Stays Clean</h4>
              <p className="text-sm text-muted-foreground m-0">
                Intermediate work, exploration, and iteration happen in the subagent&apos;s context. 
                Only the final result returns to the main conversation.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">⚡ Parallel Execution</h4>
              <p className="text-sm text-muted-foreground m-0">
                Independent subagents can run simultaneously. Security review, performance 
                check, and documentation scan can happen in parallel.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">🔒 Controlled Tool Access</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each subagent gets only the tools it needs. Powerful or dangerous tools 
                can be restricted to specific, trusted skills.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Trade-off: Coordination Overhead">
          <p className="m-0">
            Isolation comes with a cost: the main agent must handle task decomposition, 
            subagent spawning, and result synthesis. For simple tasks, the overhead may 
            exceed the benefits. <strong>Use delegation for complex, domain-specific work</strong> 
            where focused expertise matters.
          </p>
        </Callout>

        <div className="mt-6 p-4 bg-card/30 rounded-lg border border-border">
          <h4 className="font-medium text-foreground mb-3">When Isolation Helps Most</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Deep domain work:</strong> Security audits, legal review, specialized analysis
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Exploratory tasks:</strong> Research, brainstorming, option evaluation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Parallel-friendly work:</strong> Multiple independent reviews or analyses
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✗</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Quick lookups:</strong> Simple queries don&apos;t need full subagent overhead
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✗</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Tightly coupled steps:</strong> When each step needs full prior context
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Skill Registry */}
        <h3 id="skill-registry" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Skill Registry Browser
        </h3>

        <p className="text-muted-foreground">
          A skill registry lets agents discover and load capabilities on demand. Click skills below 
          to see their full details—this simulates the progressive disclosure pattern in action.
        </p>

        <InteractiveWrapper
          title="Interactive: Skill Registry"
          description="Search and explore available skills"
          icon="📚"
          colorTheme="cyan"
          minHeight="auto"
        >
          <SkillRegistryBrowser />
        </InteractiveWrapper>

        {/* Building a Skill Library */}
        <h3 id="building-skill-library" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building a Skill Library
        </h3>

        <p className="text-muted-foreground">
          A well-curated skill library becomes a <strong className="text-foreground">reusable asset</strong> 
          across projects and teams. Here&apos;s how to approach building one:
        </p>

        <div className="space-y-4 mt-6">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">1. Start with Pain Points</h4>
              <p className="text-sm text-muted-foreground m-0">
                Identify tasks where your agents struggle or produce inconsistent results. These 
                are prime candidates for dedicated skills with specialized instructions and examples.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">2. Define Clear Boundaries</h4>
              <p className="text-sm text-muted-foreground m-0">
                Each skill should have a <strong>single, clear purpose</strong>. If you find yourself 
                writing &quot;this skill can do X, Y, and Z,&quot; consider splitting into multiple skills.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">3. Include Examples and Anti-patterns</h4>
              <p className="text-sm text-muted-foreground m-0">
                Skills improve dramatically when they include concrete examples of good output 
                <em> and</em> common mistakes to avoid. These become part of the skill&apos;s instructions.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">4. Version and Iterate</h4>
              <p className="text-sm text-muted-foreground m-0">
                Track skill versions as you refine them. When a skill produces poor results, 
                improve the instructions rather than working around the issue in your main prompts.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">5. Share Across Teams</h4>
              <p className="text-sm text-muted-foreground m-0">
                Once a skill is proven, share it. Consistent skills across an organization mean 
                consistent agent behavior and easier onboarding.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground">
          Organize skills into a library structure: core skills for fundamental capabilities, domain-specific 
          skills (security, data, frontend), and team-specific custom skills. This organization makes skills 
          discoverable, maintainable, and shareable across the organization.
        </p>

        <Callout variant="tip" title="Putting It All Together" className="mt-8">
          <p className="m-0">
            Skills + Progressive Discovery + Subagents create a powerful pattern: agents that are 
            <strong> broadly capable</strong> (many skills available) yet <strong>contextually focused</strong> 
            (only relevant skills loaded). Combined with the delegation principles from earlier sections, 
            you can build agents that rival multi-person teams in their ability to handle diverse, complex work.
          </p>
        </Callout>

        <Callout variant="info" title="Further Reading">
          <p className="m-0">
            This pattern is actively evolving. Anthropic&apos;s <strong>Agent Skills Standard</strong> provides 
            the canonical reference for skill structure. As the ecosystem matures, expect more tooling 
            for skill discovery, composition, and sharing across agent frameworks.
          </p>
        </Callout>
      </div>
    </section>
  );
}
