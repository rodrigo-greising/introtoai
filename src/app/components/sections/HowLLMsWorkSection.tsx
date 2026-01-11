"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper, StepThroughPlayer } from "@/app/components/visualizations/core";
import type { Step } from "@/app/components/visualizations/core/StepThroughPlayer";
import {
  BookOpen,
  Target,
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

// =============================================================================
// Training Pipeline Visualization
// =============================================================================

interface PipelineStage {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  detail: string;
  example: string;
}

const pipelineStages: PipelineStage[] = [
  {
    id: "pretraining",
    title: "Pre-training",
    description: "Learning from massive text data",
    icon: BookOpen,
    color: "cyan",
    detail: "The model learns to predict the next token by training on trillions of tokens from the internet—books, articles, code, conversations. This is imitation learning: it learns patterns from what humans have written.",
    example: '"The cat sat on the ___" → Predicts "mat" with high probability',
  },
  {
    id: "finetuning",
    title: "Fine-tuning",
    description: "Learning to follow instructions",
    icon: Target,
    color: "violet",
    detail: "The pre-trained model is further trained on curated instruction-response pairs. This teaches it to understand prompts as instructions and generate helpful, relevant responses rather than just continuing text.",
    example: '"Summarize this article" → Learns to produce summaries, not just more text',
  },
  {
    id: "rlhf",
    title: "RLHF",
    description: "Optimizing for goals via human feedback",
    icon: Brain,
    color: "amber",
    detail: "Reinforcement Learning from Human Feedback trains the model to optimize for human preferences. Humans rank outputs, and the model learns to produce responses that score higher—more helpful, less harmful, better reasoned.",
    example: "Human prefers Response A over B → Model learns to produce more A-like outputs",
  },
  {
    id: "emergence",
    title: "Emergent Capabilities",
    description: "Reasoning and complex behaviors arise",
    icon: Sparkles,
    color: "emerald",
    detail: "At sufficient scale, capabilities emerge that weren't explicitly trained: chain-of-thought reasoning, few-shot learning, code generation, multilingual transfer. These emerge from the combination of scale and diverse training data.",
    example: "Can solve novel problems by 'thinking step by step'—a learned strategy",
  },
];

const steps: Step[] = pipelineStages.map((stage, index) => ({
  id: stage.id,
  label: `Stage ${index + 1}: ${stage.title}`,
  description: stage.description,
}));

function TrainingPipelineVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStage = pipelineStages[currentStep];

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= pipelineStages.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", ring: "ring-cyan-500/50" },
    violet: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400", ring: "ring-violet-500/50" },
    amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", ring: "ring-amber-500/50" },
    emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", ring: "ring-emerald-500/50" },
  };

  const coreLogic = `// Simplified: How LLM training works conceptually

// Stage 1: Pre-training (Next Token Prediction)
function pretrain(model, corpus) {
  for (const text of corpus) {
    for (let i = 0; i < text.length - 1; i++) {
      const context = text.slice(0, i + 1);
      const nextToken = text[i + 1];
      // Learn: P(nextToken | context)
      model.learnToPredict(context, nextToken);
    }
  }
}

// Stage 2: Fine-tuning (Instruction Following)
function finetune(model, instructionPairs) {
  for (const { instruction, response } of instructionPairs) {
    // Learn: P(response | instruction)
    model.learnToFollow(instruction, response);
  }
}

// Stage 3: RLHF (Preference Optimization)
function rlhf(model, humanPreferences) {
  for (const { prompt, preferred, rejected } of humanPreferences) {
    // Learn: prefer outputs humans like
    model.optimizeForPreference(prompt, preferred, rejected);
  }
}`;

  return (
    <div className="space-y-6">
        {/* Pipeline stages */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {pipelineStages.map((stage, index) => {
            const colors = colorClasses[stage.color];
            const Icon = stage.icon;
            const isActive = index === currentStep;
            const isPast = index < currentStep;

            return (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 min-w-[100px]",
                    isActive
                      ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} scale-105`
                      : isPast
                      ? `${colors.bg} ${colors.border} opacity-70`
                      : "bg-muted/30 border-border/50 opacity-50 hover:opacity-70"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                    isActive || isPast ? colors.bg : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive || isPast ? colors.text : "text-muted-foreground"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium text-center",
                    isActive ? colors.text : isPast ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {stage.title}
                  </span>
                </button>
                {index < pipelineStages.length - 1 && (
                  <ArrowRight className={cn(
                    "w-5 h-5 mx-2 shrink-0",
                    index < currentStep ? "text-emerald-500" : "text-muted-foreground/30"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Current stage detail */}
        <div
          className={cn(
            "p-5 rounded-xl border transition-all duration-300",
            colorClasses[currentStage.color].bg,
            colorClasses[currentStage.color].border
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
              colorClasses[currentStage.color].bg
            )}>
              <currentStage.icon className={cn("w-6 h-6", colorClasses[currentStage.color].text)} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn("text-lg font-semibold", colorClasses[currentStage.color].text)}>
                {currentStage.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStage.detail}
              </p>
              
              {/* Example */}
              <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={cn("w-4 h-4", colorClasses[currentStage.color].text)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Example
                  </span>
                </div>
                <p className="text-sm text-foreground font-mono">
                  {currentStage.example}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <StepThroughPlayer
          steps={steps}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onStepChange={setCurrentStep}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          colorTheme="cyan"
        />
      </div>
  );
}

// =============================================================================
// Next Token Prediction Demo
// =============================================================================

function NextTokenDemo() {
  const [inputText, setInputText] = useState("The quick brown fox");
  const [predictions, setPredictions] = useState<{ token: string; probability: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate token predictions (these are illustrative, not real model outputs)
  const getPredictions = (text: string): { token: string; probability: number }[] => {
    const patterns: Record<string, { token: string; probability: number }[]> = {
      "the quick brown fox": [
        { token: "jumps", probability: 0.72 },
        { token: "jumped", probability: 0.15 },
        { token: "runs", probability: 0.08 },
        { token: "is", probability: 0.03 },
        { token: "and", probability: 0.02 },
      ],
      "once upon a": [
        { token: "time", probability: 0.89 },
        { token: "day", probability: 0.05 },
        { token: "hill", probability: 0.03 },
        { token: "midnight", probability: 0.02 },
        { token: "star", probability: 0.01 },
      ],
      "def calculate": [
        { token: "(", probability: 0.45 },
        { token: "_", probability: 0.25 },
        { token: "total", probability: 0.15 },
        { token: "sum", probability: 0.10 },
        { token: "result", probability: 0.05 },
      ],
      default: [
        { token: "the", probability: 0.15 },
        { token: "a", probability: 0.12 },
        { token: "is", probability: 0.10 },
        { token: "and", probability: 0.08 },
        { token: "to", probability: 0.06 },
      ],
    };

    const normalizedInput = text.toLowerCase().trim();
    for (const [pattern, preds] of Object.entries(patterns)) {
      if (pattern !== "default" && normalizedInput.includes(pattern)) {
        return preds;
      }
    }
    return patterns.default;
  };

  const handlePredict = () => {
    setIsAnimating(true);
    setPredictions([]);
    
    // Simulate loading
    setTimeout(() => {
      const preds = getPredictions(inputText);
      setPredictions(preds);
      setIsAnimating(false);
    }, 500);
  };

  const coreLogic = `// Next Token Prediction - The Core of LLMs

function predictNextToken(context: string): TokenProbabilities {
  // 1. Tokenize the input
  const tokens = tokenize(context);
  
  // 2. Get embeddings for each token
  const embeddings = tokens.map(t => embed(t));
  
  // 3. Pass through transformer layers
  // Each layer applies attention + feed-forward
  let hidden = embeddings;
  for (const layer of transformerLayers) {
    hidden = layer.attention(hidden);  // "What should I pay attention to?"
    hidden = layer.feedForward(hidden); // "What does this mean?"
  }
  
  // 4. Project to vocabulary and apply softmax
  // Result: probability distribution over all possible next tokens
  const logits = project(hidden.last(), vocabularySize);
  const probabilities = softmax(logits);
  
  return probabilities; // e.g., { "the": 0.15, "jumps": 0.72, ... }
}`;

  return (
    <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter some text..."
            className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <button
            onClick={handlePredict}
            disabled={isAnimating || !inputText.trim()}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40",
              "hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isAnimating ? "Predicting..." : "Predict Next"}
          </button>
        </div>

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Predicted next tokens
            </p>
            <div className="space-y-2">
              {predictions.map((pred, index) => (
                <div key={pred.token} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-cyan-400 w-20">
                    &quot;{pred.token}&quot;
                  </span>
                  <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        index === 0 ? "bg-cyan-500" : "bg-cyan-500/50"
                      )}
                      style={{
                        width: `${pred.probability * 100}%`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-14 text-right">
                    {(pred.probability * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Try: &quot;Once upon a&quot;, &quot;def calculate&quot;, or any text you like
        </p>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function HowLLMsWorkSection() {
  return (
    <section id="how-llms-work" className="scroll-mt-20">
      <SectionHeading
        id="how-llms-work-heading"
        title="How LLMs Work"
        subtitle="Pre-training, RLHF, and how reasoning emerges"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Before diving into engineering patterns, it helps to understand <strong className="text-foreground">what 
          an LLM actually is</strong> and how it was built. This foundation explains both their capabilities 
          and their limitations.
        </p>

        <Callout variant="info" title="The Short Version">
          <p>
            LLMs are trained in stages: first they learn to predict text (pre-training), then to follow 
            instructions (fine-tuning), then to optimize for human preferences (RLHF). The result is a 
            statistical model that&apos;s remarkably good at generating useful text.
          </p>
        </Callout>

        {/* Pre-training Section */}
        <h3 id="pretraining" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Pre-training: Learning from Text
        </h3>

        <p className="text-muted-foreground">
          At its core, an LLM is trained to do one thing: <strong className="text-foreground">predict 
          the next token</strong>. Given a sequence of text, what word (or part of a word) comes next?
        </p>

        <InteractiveWrapper
          title="Interactive: Next Token Prediction"
          description="See how LLMs predict the most likely next word in a sequence"
          icon="🔮"
          colorTheme="cyan"
          minHeight="auto"
        >
          <NextTokenDemo />
        </InteractiveWrapper>

        <p className="text-muted-foreground">
          By training on trillions of tokens from books, websites, code, and more, the model learns:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Grammar & Syntax</h4>
              <p className="text-sm text-muted-foreground m-0">
                What sequences of tokens are grammatically valid in various languages
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">World Knowledge</h4>
              <p className="text-sm text-muted-foreground m-0">
                Facts, relationships, and patterns from its training data
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Reasoning Patterns</h4>
              <p className="text-sm text-muted-foreground m-0">
                How humans structure arguments, solve problems, write code
              </p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Style & Format</h4>
              <p className="text-sm text-muted-foreground m-0">
                Different writing styles, formats, tones, and conventions
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="important" title="It's Imitation, Not Understanding">
          <p>
            Pre-training is essentially <strong>sophisticated imitation learning</strong>. The model 
            learns to produce text that looks like what humans write. This is powerful, but it&apos;s 
            statistical pattern matching—not genuine understanding or reasoning.
          </p>
        </Callout>

        {/* Training Pipeline */}
        <h3 id="rlhf" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          RLHF: Learning to Follow Goals
        </h3>

        <p className="text-muted-foreground">
          Pre-training creates a powerful but undirected model—it can continue any text, but it doesn&apos;t 
          know what <em>you</em> want. Fine-tuning and RLHF teach it to be helpful:
        </p>

        <InteractiveWrapper
          title="Interactive: The LLM Training Pipeline"
          description="Step through the stages of how modern LLMs are trained"
          icon="🧠"
          colorTheme="violet"
          minHeight="auto"
        >
          <TrainingPipelineVisualizer />
        </InteractiveWrapper>

        {/* Emergence Section */}
        <h3 id="emergence" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Emergence of Reasoning
        </h3>

        <p className="text-muted-foreground">
          Something interesting happens at scale: capabilities <strong className="text-foreground">emerge</strong> that 
          weren&apos;t explicitly programmed. Models trained on enough data start exhibiting:
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Chain-of-Thought Reasoning</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When prompted to &quot;think step by step,&quot; models produce better answers by working through 
                problems explicitly. This pattern was learned from human reasoning in training data.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Few-Shot Learning</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Show a model a few examples of a task format, and it can generalize to new instances. 
                No retraining needed—just examples in the prompt.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">Cross-Domain Transfer</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Knowledge learned in one domain transfers to others. Code patterns help with logic problems; 
                legal training helps with structured analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Implications */}
        <h3 id="implications" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Implications for Engineers
        </h3>

        <p className="text-muted-foreground">
          Understanding how LLMs work has practical implications for how we use them:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Context Is Everything</h4>
              <p className="text-sm text-muted-foreground m-0">
                The model generates based on what&apos;s in the context window. Better context → better output. 
                This is why &quot;context engineering&quot; matters more than clever prompts.
              </p>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Patterns Over Facts</h4>
              <p className="text-sm text-muted-foreground m-0">
                LLMs are great at patterns but can confidently hallucinate facts. Use them for structure and 
                reasoning; verify facts independently or via RAG.
              </p>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Prompting Is Steering</h4>
              <p className="text-sm text-muted-foreground m-0">
                Your prompt doesn&apos;t &quot;tell&quot; the model what to do—it steers the probability distribution 
                toward certain types of outputs. Examples and format instructions help aim this steering.
              </p>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Limitations Are Predictable</h4>
              <p className="text-sm text-muted-foreground m-0">
                Models struggle with: precise counting, multi-step math, recent events (training cutoff), 
                and anything not well-represented in training data. Plan accordingly.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="The Bottom Line">
          <p>
            LLMs are <strong>statistical text generators</strong> optimized to be helpful. They&apos;re incredibly 
            powerful when used with that understanding—and frustrating when you expect them to be something 
            they&apos;re not. The rest of this guide builds on this foundation to help you get the most from them.
          </p>
        </Callout>
      </div>
    </section>
  );
}
