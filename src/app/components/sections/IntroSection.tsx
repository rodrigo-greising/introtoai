import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";

export function IntroSection() {
  return (
    <section id="intro" className="scroll-mt-20">
      <SectionHeading
        id="intro-heading"
        title="Introduction"
        subtitle="A practical guide for software engineers on using AI effectively"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide is for <strong className="text-foreground">software engineers</strong> who 
          want to leverage AI in their development workflow. Not to replace thinking, but to 
          augment it. Not to generate slop, but to move faster with intention.
        </p>

        <Callout variant="tip" title="Who This Is For">
          <p>
            Engineers who already know how to code and want to understand how to 
            use LLMs as a tool, not a crutch. We'll cover mental models, practical 
            patterns, and real engineering considerations.
          </p>
        </Callout>

        <h3 className="text-xl font-semibold mt-8 mb-4">What You'll Learn</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Mental Models</h4>
              <p className="text-sm m-0">
                How to think about LLMs as stateless functions, not chatbots
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context Engineering</h4>
              <p className="text-sm m-0">
                The art of providing signal over noise to get better outputs
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Task Architecture</h4>
              <p className="text-sm m-0">
                Breaking problems into parallelizable, verifiable chunks
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Production Patterns</h4>
              <p className="text-sm m-0">
                Guardrails, reliability, and cost optimization strategies
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">The Core Insight</h3>
        
        <p className="text-muted-foreground">
          The key to using AI effectively isn't better prompts—it's better <em>context</em>. 
          An LLM is a function that transforms context into output:
        </p>

        <CodeBlock
          language="typescript"
          filename="mental-model.ts"
          code={`// The fundamental equation
type LLM = (context: Context) => Promise<Output>;

// Context is everything: system prompt, user message, 
// retrieved documents, code, conversation history...
// Output quality is directly proportional to context quality.`}
        />

        <Callout variant="important">
          <p>
            Throughout this guide, we'll return to this mental model. When something 
            isn't working, the question is always: "What context is missing or misleading?"
          </p>
        </Callout>
      </div>
    </section>
  );
}
