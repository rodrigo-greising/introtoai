"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import { InteractiveWrapper, ViewCodeToggle } from "@/app/components/visualizations/core";
import { 
  Check, 
  X, 
  Plus, 
  Trash2, 
  FileJson,
  Code,
  AlertCircle,
} from "lucide-react";

// =============================================================================
// Schema Builder Visualization
// =============================================================================

interface SchemaField {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  required: boolean;
}

function SchemaBuilder() {
  const [fields, setFields] = useState<SchemaField[]>([
    { id: "1", name: "title", type: "string", description: "The title of the item", required: true },
    { id: "2", name: "priority", type: "number", description: "Priority level 1-5", required: true },
    { id: "3", name: "completed", type: "boolean", description: "Whether the task is done", required: false },
  ]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<SchemaField["type"]>("string");
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const jsonSchema = useMemo(() => {
    const properties: Record<string, { type: string; description: string }> = {};
    const required: string[] = [];

    for (const field of fields) {
      properties[field.name] = {
        type: field.type,
        description: field.description,
      };
      if (field.required) {
        required.push(field.name);
      }
    }

    return {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    };
  }, [fields]);

  const zodSchema = useMemo(() => {
    const lines = fields.map((field) => {
      const typeMap: Record<string, string> = {
        string: "z.string()",
        number: "z.number()",
        boolean: "z.boolean()",
        array: "z.array(z.unknown())",
        object: "z.object({})",
      };
      const base = typeMap[field.type];
      const optional = field.required ? "" : ".optional()";
      return `  ${field.name}: ${base}${optional},`;
    });

    return `const schema = z.object({\n${lines.join("\n")}\n});`;
  }, [fields]);

  const addField = () => {
    if (!newFieldName.trim()) return;
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: newFieldName.trim(),
      type: newFieldType,
      description: `Description for ${newFieldName}`,
      required: true,
    };
    setFields([...fields, newField]);
    setNewFieldName("");
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const toggleRequired = (id: string) => {
    setFields(
      fields.map((f) =>
        f.id === id ? { ...f, required: !f.required } : f
      )
    );
  };

  const validateOutput = () => {
    try {
      const output = JSON.parse(testOutput || "{}");
      const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
      const missingFields = requiredFields.filter((name) => !(name in output));
      
      if (missingFields.length > 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch {
      setIsValid(false);
    }
  };

  const generateSampleOutput = () => {
    const sample: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.required || Math.random() > 0.5) {
        switch (field.type) {
          case "string":
            sample[field.name] = `Sample ${field.name}`;
            break;
          case "number":
            sample[field.name] = Math.floor(Math.random() * 100);
            break;
          case "boolean":
            sample[field.name] = Math.random() > 0.5;
            break;
          case "array":
            sample[field.name] = ["item1", "item2"];
            break;
          case "object":
            sample[field.name] = { nested: "value" };
            break;
        }
      }
    }
    setTestOutput(JSON.stringify(sample, null, 2));
    setIsValid(null);
  };

  const coreLogic = `// Structured Outputs with Zod and OpenAI

import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// 1. Define your schema with Zod
const TaskSchema = z.object({
  title: z.string().describe("The task title"),
  priority: z.number().min(1).max(5),
  completed: z.boolean().optional(),
});

// 2. Use it with the API
const response = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract task details from the message." },
    { role: "user", content: "Create a high priority task to review the PR" }
  ],
  // This tells the API to return JSON matching your schema
  response_format: zodResponseFormat(TaskSchema, "task"),
});

// 3. Get type-safe, validated output
const task = response.choices[0].message.parsed;
// task is typed as { title: string; priority: number; completed?: boolean }

// The API guarantees the output matches your schema
// No more parsing or validation needed!`;

  return (
    <ViewCodeToggle
      code={coreLogic}
      title="Structured Output Pattern"
      description="How to get type-safe, validated responses from LLMs"
    >
      <div className="space-y-6">
        {/* Schema editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Schema Fields</span>
            <span className="text-xs text-muted-foreground">
              {fields.length} fields • {fields.filter(f => f.required).length} required
            </span>
          </div>

          {/* Field list */}
          <div className="space-y-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  field.required
                    ? "bg-cyan-500/10 border-cyan-500/30"
                    : "bg-muted/30 border-border"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{field.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {field.type}
                    </span>
                    {field.required && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                        required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                </div>
                <button
                  onClick={() => toggleRequired(field.id)}
                  className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground transition-colors"
                  title={field.required ? "Make optional" : "Make required"}
                >
                  {field.required ? <Check className="w-4 h-4 text-cyan-400" /> : <X className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-1.5 rounded hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Field name"
              className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              onKeyDown={(e) => e.key === "Enter" && addField()}
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as SchemaField["type"])}
              className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="array">array</option>
              <option value="object">object</option>
            </select>
            <button
              onClick={addField}
              disabled={!newFieldName.trim()}
              className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Generated schemas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileJson className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-medium text-muted-foreground">JSON Schema</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-32">
              {JSON.stringify(jsonSchema, null, 2)}
            </pre>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-muted-foreground">Zod Schema</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-32">
              {zodSchema}
            </pre>
          </div>
        </div>

        {/* Test output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Test Output Validation</span>
            <button
              onClick={generateSampleOutput}
              className="text-xs text-cyan-400 hover:underline"
            >
              Generate sample
            </button>
          </div>
          <textarea
            value={testOutput || ""}
            onChange={(e) => {
              setTestOutput(e.target.value);
              setIsValid(null);
            }}
            placeholder='{&quot;title&quot;: &quot;Test&quot;, &quot;priority&quot;: 1}'
            className="w-full h-24 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={validateOutput}
              disabled={!testOutput}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors text-sm"
            >
              Validate
            </button>
            {isValid !== null && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                isValid
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              )}>
                {isValid ? (
                  <>
                    <Check className="w-4 h-4" />
                    Valid output
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Invalid output
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewCodeToggle>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function StructuredOutputsSection() {
  return (
    <section id="structured-outputs" className="scroll-mt-20">
      <SectionHeading
        id="structured-outputs-heading"
        title="Structured Outputs"
        subtitle="JSON schemas, Zod, and deterministic parsing"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Structured outputs let you constrain LLM responses to match a specific schema. Instead 
          of hoping the model returns valid JSON, you <strong className="text-foreground">guarantee</strong> it. 
          This is the foundation for reliable tool calling and data extraction.
        </p>

        <Callout variant="tip" title="Why This Matters">
          <p>
            Without structured outputs, you&apos;re playing &quot;parse the LLM output&quot; roulette. With them, 
            you get <strong>type-safe, validated data</strong> every time. No more &quot;the model 
            returned a string instead of a number&quot; bugs.
          </p>
        </Callout>

        {/* Why Structured Outputs */}
        <h3 id="why-structured" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Why Structured Outputs?
        </h3>

        <p className="text-muted-foreground">
          LLMs naturally produce free-form text. But applications need structured data:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">❌ Free-form Output</h4>
              <pre className="text-xs font-mono text-muted-foreground bg-muted/30 p-3 rounded">
{`Sure! Here's the data you wanted:
The title is "Buy groceries" and the
priority is high (I'd say 4 out of 5).
Not completed yet.`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Good luck parsing this reliably...
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Structured Output</h4>
              <pre className="text-xs font-mono text-muted-foreground bg-muted/30 p-3 rounded">
{`{
  "title": "Buy groceries",
  "priority": 4,
  "completed": false
}`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Guaranteed to match your schema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* JSON Mode vs Schemas */}
        <h3 id="json-mode" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          JSON Mode vs Schemas
        </h3>

        <p className="text-muted-foreground">
          There are two levels of structure you can enforce:
        </p>

        <div className="space-y-4 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">JSON Mode</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Guarantees valid JSON, but not the structure. The model might return 
                <code className="text-xs bg-muted px-1 rounded">{`{&quot;foo&quot;: &quot;bar&quot;}`}</code> when you 
                expected <code className="text-xs bg-muted px-1 rounded">{`{&quot;title&quot;: &quot;...&quot;}`}</code>.
              </p>
              <div className="text-xs text-muted-foreground/70">
                Use for: Simple cases, unstructured JSON, or when you&apos;ll validate manually
              </div>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">Schema-Constrained Output</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Guarantees JSON that matches your exact schema—required fields, types, 
                and constraints are all enforced. The model <strong>cannot</strong> deviate.
              </p>
              <div className="text-xs text-muted-foreground/70">
                Use for: All production use cases, tool calling, data extraction
              </div>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important">
          <p>
            Always prefer <strong>schema-constrained outputs</strong> for production. JSON mode 
            alone leaves you vulnerable to structural changes that break your code.
          </p>
        </Callout>

        {/* Zod Integration */}
        <h3 id="zod-integration" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Type-Safe with Zod
        </h3>

        <p className="text-muted-foreground">
          Zod provides the best developer experience for structured outputs. Define your schema 
          once, get TypeScript types and runtime validation automatically:
        </p>

        <CodeBlock
          language="typescript"
          filename="zod-structured-output.ts"
          showLineNumbers
          code={`import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Define your schema with rich validation
const ExtractedEvent = z.object({
  title: z.string().min(1).describe("Event title"),
  date: z.string().regex(/\\d{4}-\\d{2}-\\d{2}/).describe("ISO date"),
  location: z.string().optional(),
  attendees: z.array(z.string()).default([]),
  isAllDay: z.boolean().default(false),
});

// Use with the API
const response = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract event details from text." },
    { role: "user", content: userInput }
  ],
  response_format: zodResponseFormat(ExtractedEvent, "event"),
});

// Type-safe access - TypeScript knows the shape!
const event = response.choices[0].message.parsed;
console.log(event.title);      // string
console.log(event.attendees);  // string[]

// The model is constrained to produce exactly this shape
// No parsing errors, no type mismatches`}
        />

        {/* Interactive Schema Builder */}
        <h3 id="schema-builder" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Interactive: Schema Builder
        </h3>

        <p className="text-muted-foreground mb-4">
          Build a schema and see the generated JSON Schema and Zod code. Add fields, mark them 
          as required or optional, and test outputs against your schema.
        </p>

        <InteractiveWrapper
          title="Interactive: Schema Builder"
          description="Build schemas and validate outputs"
          icon="📋"
          colorTheme="cyan"
          minHeight="auto"
        >
          <SchemaBuilder />
        </InteractiveWrapper>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="space-y-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Add Descriptions</h4>
              <p className="text-sm text-muted-foreground m-0">
                Use <code className="text-xs bg-muted px-1 rounded">.describe()</code> on every field. 
                These descriptions guide the model on what to extract or generate.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Use Enums When Possible</h4>
              <p className="text-sm text-muted-foreground m-0">
                <code className="text-xs bg-muted px-1 rounded">z.enum([&quot;low&quot;, &quot;medium&quot;, &quot;high&quot;])</code> is 
                more reliable than <code className="text-xs bg-muted px-1 rounded">z.string()</code>. 
                Constrain the output space wherever you can.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Handle Refusals</h4>
              <p className="text-sm text-muted-foreground m-0">
                The model might refuse to generate structured output for safety reasons. Check 
                <code className="text-xs bg-muted px-1 rounded">response.choices[0].message.refusal</code> before 
                accessing <code className="text-xs bg-muted px-1 rounded">.parsed</code>.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Coming Up: Tools">
          <p>
            Structured outputs are the foundation for <strong>tools and function calling</strong>. 
            In the next section, we&apos;ll see how to combine schemas with tool definitions to let 
            LLMs take actions in the world.
          </p>
        </Callout>
      </div>
    </section>
  );
}
