import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

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
          Building on the delegation principles we've covered, <strong className="text-foreground">Skills</strong> are 
          a powerful pattern for creating modular, reusable agent capabilities. Pioneered by Anthropic in Claude Code, 
          this approach treats specialized capabilities as <em>self-contained packages</em> that agents can discover 
          and load on demand.
        </p>

        <Callout variant="info" title="Why This Matters">
          <p className="m-0">
            Skills solve a fundamental tension in agent design: you want agents to be capable of many things, 
            but you don't want to bloat every context with instructions for everything. Skills let you 
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
          In Anthropic's agent skills standard, each skill is organized as a directory with a specific structure. 
          The central component is a <code className="text-cyan-400">SKILL.md</code> file that serves as the 
          skill's "contract"—defining what it does and how to use it.
        </p>

        <CodeBlock
          language="plaintext"
          title="Skill Directory Structure"
          code={`skills/
├── code-review/
│   ├── SKILL.md           # Purpose, capabilities, usage patterns
│   ├── instructions.md    # Detailed review guidelines
│   ├── checklists/
│   │   ├── security.md    # Security review checklist
│   │   └── performance.md # Performance review checklist
│   └── tools/
│       └── review-diff.sh # Script to analyze diffs
│
├── database-migration/
│   ├── SKILL.md
│   ├── patterns/          # Migration patterns & examples
│   ├── validators/        # Schema validation scripts
│   └── rollback.md        # Rollback procedures
│
└── api-design/
    ├── SKILL.md
    ├── openapi-guide.md   # OpenAPI specification guide
    └── examples/          # Well-designed API examples`}
        />

        <p className="text-muted-foreground mt-4">
          The <code className="text-cyan-400">SKILL.md</code> file typically contains:
        </p>

        <CodeBlock
          language="markdown"
          title="Example SKILL.md"
          code={`# Code Review Skill

## Purpose
Perform thorough code reviews focusing on correctness, security, 
performance, and maintainability.

## When to Use
- Pull request review requests
- Security audit tasks
- Pre-merge code quality checks

## Capabilities
- Analyze diffs for common issues
- Apply language-specific best practices
- Check against security checklists
- Suggest performance improvements

## Required Context
- The code diff or files to review
- Repository coding standards (if available)
- Specific focus areas (optional)

## Tools Available
- \`review-diff.sh\`: Parses and annotates diff output
- Access to security and performance checklists

## Output Format
Structured review with:
- Summary assessment
- Critical issues (blocking)
- Suggestions (non-blocking)
- Positive observations`}
        />

        <Callout variant="tip" title="Skills are Composable">
          <p className="m-0">
            Skills can reference other skills. A "Full PR Review" skill might compose 
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
            by loading only what's relevant to the current task.
          </p>
        </Callout>

        <CodeBlock
          language="typescript"
          title="Progressive Disclosure Implementation"
          code={`interface SkillMetadata {
  id: string;
  name: string;
  description: string;  // Brief, for relevance matching
  triggers: string[];   // Keywords that suggest this skill
}

interface Skill extends SkillMetadata {
  instructions: string;   // Full SKILL.md content
  tools: ToolDefinition[];
  resources: ResourceRef[];
}

class SkillRegistry {
  private metadata: Map<string, SkillMetadata> = new Map();
  private loadedSkills: Map<string, Skill> = new Map();

  // Stage 1: Load just metadata at boot
  async initialize() {
    const skillDirs = await listSkillDirectories();
    for (const dir of skillDirs) {
      const meta = await loadSkillMetadata(dir);
      this.metadata.set(meta.id, meta);
    }
  }

  // Stage 2: Find relevant skills without full loading
  findRelevantSkills(task: string): SkillMetadata[] {
    return Array.from(this.metadata.values())
      .filter(skill => this.isRelevant(skill, task));
  }

  // Stage 2 continued: Load full skill when needed
  async loadSkill(skillId: string): Promise<Skill> {
    if (this.loadedSkills.has(skillId)) {
      return this.loadedSkills.get(skillId)!;
    }
    const skill = await loadFullSkill(skillId);
    this.loadedSkills.set(skillId, skill);
    return skill;
  }

  // Stage 3: Load specific resource on demand
  async loadResource(skillId: string, resourcePath: string) {
    return await loadSkillResource(skillId, resourcePath);
  }
}`}
        />

        {/* Subagents and Delegation */}
        <h3 id="subagents-delegation" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Subagents and Delegation
        </h3>

        <p className="text-muted-foreground">
          Skills naturally pair with <strong className="text-foreground">subagents</strong>—specialized AI 
          instances that handle specific task types. When you delegate to a subagent, you're essentially 
          saying: "Here's a focused task. Take this skill's context, do the work, and return the result."
        </p>

        <p className="text-muted-foreground">
          Each subagent operates with:
        </p>

        <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
          <li><strong className="text-foreground">Its own context window:</strong> Fresh, uncluttered by the main agent's conversation</li>
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

        <CodeBlock
          language="typescript"
          title="Subagent Delegation Pattern"
          code={`interface SubagentConfig {
  skill: Skill;
  task: string;
  context: Record<string, unknown>;
  maxTokens?: number;
}

interface SubagentResult {
  success: boolean;
  output: unknown;
  tokensUsed: number;
  reasoning?: string;
}

async function delegateToSubagent(config: SubagentConfig): Promise<SubagentResult> {
  const { skill, task, context } = config;
  
  // Build focused context from skill definition
  const systemPrompt = buildSubagentPrompt(skill);
  
  // Subagent gets only skill-specific tools
  const tools = skill.tools;
  
  // Execute in isolated context
  const response = await llmCall({
    system: systemPrompt,
    messages: [
      { role: "user", content: formatTask(task, context) }
    ],
    tools,
    // Subagent doesn't see main conversation history
  });

  return parseSubagentResponse(response);
}

function buildSubagentPrompt(skill: Skill): string {
  return \`You are a specialized agent for: \${skill.name}

\${skill.instructions}

## Your Focus
You handle ONLY tasks related to \${skill.name}. 
Stay focused on this domain.

## Output Requirements
Provide structured output that can be consumed by the orchestrating agent.
Include confidence levels and any caveats.

## Available Tools
\${skill.tools.map(t => \`- \${t.name}: \${t.description}\`).join('\\n')}
\`;
}`}
        />

        <Callout variant="tip" title="Subagents Can Have Subagents">
          <p className="m-0">
            Complex skills might spawn their own subagents. A "Full Code Review" skill might 
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
                Intermediate work, exploration, and iteration happen in the subagent's context. 
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
                <strong className="text-foreground">Quick lookups:</strong> Simple queries don't need full subagent overhead
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

        {/* Building a Skill Library */}
        <h3 id="building-skill-library" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building a Skill Library
        </h3>

        <p className="text-muted-foreground">
          A well-curated skill library becomes a <strong className="text-foreground">reusable asset</strong> 
          across projects and teams. Here's how to approach building one:
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
                writing "this skill can do X, Y, and Z," consider splitting into multiple skills.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">3. Include Examples and Anti-patterns</h4>
              <p className="text-sm text-muted-foreground m-0">
                Skills improve dramatically when they include concrete examples of good output 
                <em> and</em> common mistakes to avoid. These become part of the skill's instructions.
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

        <CodeBlock
          language="plaintext"
          title="Example Skill Library Organization"
          code={`skills/
├── core/                    # Fundamental capabilities
│   ├── code-review/
│   ├── documentation/
│   └── testing/
│
├── security/                # Security-focused skills
│   ├── vulnerability-scan/
│   ├── dependency-audit/
│   └── secrets-detection/
│
├── data/                    # Data engineering skills
│   ├── schema-migration/
│   ├── query-optimization/
│   └── etl-design/
│
├── frontend/                # UI/UX skills
│   ├── accessibility-audit/
│   ├── component-review/
│   └── performance-audit/
│
└── team-specific/           # Custom team skills
    ├── our-api-standards/
    └── deployment-checklist/`}
        />

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
            This pattern is actively evolving. Anthropic's <strong>Agent Skills Standard</strong> provides 
            the canonical reference for skill structure. As the ecosystem matures, expect more tooling 
            for skill discovery, composition, and sharing across agent frameworks.
          </p>
        </Callout>
      </div>
    </section>
  );
}
