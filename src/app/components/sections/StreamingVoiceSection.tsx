"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import {
  Radio,
  Mic,
  Volume2,
  ArrowRight,
  Zap,
  Clock,
  MessageSquare,
  Waves,
  Phone,
  Play,
  RefreshCw,
  Server,
  User,
  Bot,
} from "lucide-react";

// =============================================================================
// Streaming Demo
// =============================================================================

function StreamingDemo() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  
  const fullResponse = "Large Language Models generate text one token at a time. Streaming sends each token to the client as it's generated, rather than waiting for the complete response. This dramatically reduces perceived latency—users see the first word in ~200ms instead of waiting 2-3 seconds for the full response. For chat applications, streaming feels natural and conversational.";
  
  const tokens = fullResponse.split(" ");

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setStreamedText("");
    setTokenCount(0);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < tokens.length) {
        setStreamedText(prev => prev + (index > 0 ? " " : "") + tokens[index]);
        setTokenCount(index + 1);
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [tokens]);

  const reset = () => {
    setIsStreaming(false);
    setStreamedText("");
    setTokenCount(0);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isStreaming ? reset : startStreaming}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            isStreaming
              ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          )}
        >
          {isStreaming ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Reset
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Streaming
            </>
          )}
        </button>
        <div className="text-xs text-muted-foreground">
          {tokenCount}/{tokens.length} tokens
        </div>
      </div>

      {/* Stream Output */}
      <div className="p-4 rounded-lg bg-muted/20 border border-border min-h-[120px]">
        <div className="text-sm text-foreground leading-relaxed">
          {streamedText}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
          )}
        </div>
        {!streamedText && !isStreaming && (
          <div className="text-sm text-muted-foreground italic">
            Press &quot;Start Streaming&quot; to see tokens arrive in real-time
          </div>
        )}
      </div>

      {/* Latency Comparison */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-foreground">Without Streaming</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Wait 2-3s for full response → Display all at once
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted/50">
            <div className="h-full w-full rounded-full bg-amber-500/50" />
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-foreground">With Streaming</span>
          </div>
          <div className="text-xs text-muted-foreground">
            First token in ~200ms → Stream continuously
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted/50">
            <div 
              className="h-full rounded-full bg-emerald-500 transition-all duration-100"
              style={{ width: `${(tokenCount / tokens.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Voice Agent Flow Demo
// =============================================================================

interface FlowStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration: number;
  description: string;
}

const voiceFlowSteps: FlowStep[] = [
  { id: "audio-in", label: "Audio Input", icon: Mic, color: "cyan", duration: 100, description: "User speaks into microphone" },
  { id: "stt", label: "Speech-to-Text", icon: Waves, color: "violet", duration: 500, description: "Audio → Text transcription" },
  { id: "llm", label: "LLM Processing", icon: Bot, color: "amber", duration: 800, description: "Generate response" },
  { id: "tts", label: "Text-to-Speech", icon: Volume2, color: "emerald", duration: 400, description: "Text → Audio synthesis" },
  { id: "audio-out", label: "Audio Output", icon: Radio, color: "pink", duration: 100, description: "Play response to user" },
];

function VoiceAgentFlowDemo() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"sequential" | "streaming">("sequential");

  const runFlow = useCallback(() => {
    setIsRunning(true);
    setCurrentStep(0);
    
    if (mode === "sequential") {
      // Sequential: wait for each step to complete
      let totalDelay = 0;
      voiceFlowSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStep(index);
          if (index === voiceFlowSteps.length - 1) {
            setTimeout(() => {
              setIsRunning(false);
              setCurrentStep(-1);
            }, step.duration);
          }
        }, totalDelay);
        totalDelay += step.duration;
      });
    } else {
      // Streaming: overlap TTS with LLM
      const delays = [0, 100, 600, 700, 1100]; // Overlapped timing
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setCurrentStep(index);
          if (index === voiceFlowSteps.length - 1) {
            setTimeout(() => {
              setIsRunning(false);
              setCurrentStep(-1);
            }, 400);
          }
        }, delay);
      });
    }
  }, [mode]);

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" },
    pink: { bg: "bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-400" },
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Mode:</span>
          {(["sequential", "streaming"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={isRunning}
              className={cn(
                "px-2 py-1 rounded text-xs transition-all",
                mode === m
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground",
                isRunning && "opacity-50 cursor-not-allowed"
              )}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={runFlow}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 disabled:opacity-50"
        >
          {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          {isRunning ? "Running..." : "Run Flow"}
        </button>
      </div>

      {/* Flow Visualization */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-2">
        {voiceFlowSteps.map((step, index) => {
          const colors = colorClasses[step.color];
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isPast = index < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[80px]",
                  isActive
                    ? `${colors.bg} ${colors.border} border ring-2 ring-opacity-50`
                    : isPast
                    ? `${colors.bg} opacity-60`
                    : "bg-muted/20 opacity-40"
                )}
                style={isActive ? { boxShadow: `0 0 20px var(--${step.color}-500, rgba(100,200,255,0.3))` } : {}}
              >
                <Icon className={cn("w-5 h-5", isActive || isPast ? colors.text : "text-muted-foreground")} />
                <span className={cn("text-[10px] text-center font-medium", isActive ? colors.text : "text-muted-foreground")}>
                  {step.label}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {step.duration}ms
                </span>
              </div>
              {index < voiceFlowSteps.length - 1 && (
                <ArrowRight className={cn(
                  "w-4 h-4 mx-1 shrink-0 transition-colors",
                  index < currentStep ? "text-emerald-500" : "text-muted-foreground/30"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Info */}
      {currentStep >= 0 && (
        <div className={cn(
          "p-3 rounded-lg border animate-in fade-in",
          colorClasses[voiceFlowSteps[currentStep].color].bg,
          colorClasses[voiceFlowSteps[currentStep].color].border
        )}>
          <div className="text-sm font-medium text-foreground">
            {voiceFlowSteps[currentStep].label}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {voiceFlowSteps[currentStep].description}
          </div>
        </div>
      )}

      {/* Latency Comparison */}
      <div className="grid gap-3 sm:grid-cols-2 mt-4">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="text-xs font-medium text-amber-400 mb-1">Sequential Processing</div>
          <div className="text-xs text-muted-foreground">
            Total: ~1.9s latency (STT → LLM → TTS)
          </div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="text-xs font-medium text-emerald-400 mb-1">Streaming Processing</div>
          <div className="text-xs text-muted-foreground">
            Total: ~1.2s latency (overlapped TTS)
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function StreamingVoiceSection() {
  return (
    <section id="streaming-voice" className="scroll-mt-20">
      <SectionHeading
        id="streaming-voice-heading"
        title="Streaming & Voice Agents"
        subtitle="Real-time responses and voice agent architecture"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Modern AI applications demand <strong className="text-foreground">real-time interaction</strong>. 
          Streaming reduces perceived latency by showing tokens as they&apos;re generated. Voice agents take 
          this further—turning speech into action and back into speech with minimal delay.
        </p>

        <Callout variant="tip" title="Why Real-Time Matters">
          <p className="m-0">
            Studies show users perceive delays over 400ms as &quot;slow.&quot; Without streaming, a typical LLM 
            response takes 2-3 seconds. With streaming, users see the first word in ~200ms—transforming 
            the experience from &quot;waiting&quot; to &quot;conversing.&quot;
          </p>
        </Callout>

        {/* Streaming Fundamentals */}
        <h3 id="streaming-fundamentals" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Streaming Fundamentals
        </h3>

        <p className="text-muted-foreground">
          LLMs generate text <strong className="text-foreground">one token at a time</strong>. Without streaming, 
          the API waits for all tokens before responding. With streaming, each token is sent to the client 
          immediately via Server-Sent Events (SSE) or WebSockets.
        </p>

        <InteractiveWrapper
          title="Interactive: Streaming Demo"
          description="Watch tokens arrive in real-time vs waiting for the full response"
          icon="⚡"
          colorTheme="cyan"
          minHeight="auto"
        >
          <StreamingDemo />
        </InteractiveWrapper>

        <h4 className="text-lg font-medium mt-8 mb-4">Implementation Pattern</h4>

        <p className="text-muted-foreground">
          Most LLM APIs support streaming via the `stream: true` parameter. The response is an async iterator 
          of delta objects, each containing a text chunk. You yield each chunk to the client immediately, 
          building the response progressively.
        </p>

        <div className="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="text-lg font-semibold text-violet-400 mb-3">Streaming Architecture</h4>
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col items-center gap-1 p-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span className="text-muted-foreground">Client</span>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Request</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Server className="w-5 h-5 text-violet-400" />
              <span className="text-muted-foreground">Server</span>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">stream=true</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <span className="text-muted-foreground">LLM API</span>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Waves className="w-4 h-4 text-emerald-400" />
              <span>SSE: token → token → token → [DONE]</span>
            </div>
          </div>
        </div>

        {/* Live Call Flows */}
        <h3 id="live-call-flows" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Live Call Flows
        </h3>

        <p className="text-muted-foreground">
          Voice agents process audio in real-time. The typical flow is: <strong className="text-foreground">Audio 
          → STT → LLM → TTS → Audio</strong>. Each step introduces latency; optimizing the pipeline is critical 
          for natural conversation.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground">Speech-to-Text (STT)</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Convert user audio to text. Options: Whisper, Deepgram, AssemblyAI. 
                Streaming STT sends partial transcripts as the user speaks.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground">LLM Processing</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Generate response from transcript. Use streaming to begin TTS before 
                the full response is ready.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground">Text-to-Speech (TTS)</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Convert LLM output to audio. Options: ElevenLabs, Play.ht, OpenAI TTS. 
                Streaming TTS generates audio chunks progressively.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-pink-400" />
                <h4 className="font-medium text-foreground">Telephony Integration</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Connect to phone networks via Twilio, Vonage. Handle call events, 
                DTMF tones, call transfer, and multi-party calls.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voice Agent Architecture */}
        <h3 id="voice-agent-architecture" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Voice Agent Architecture
        </h3>

        <p className="text-muted-foreground">
          A production voice agent needs more than just STT + LLM + TTS. Key architectural considerations:
        </p>

        <InteractiveWrapper
          title="Interactive: Voice Agent Flow"
          description="Compare sequential vs streaming voice processing"
          icon="🎙️"
          colorTheme="violet"
          minHeight="auto"
        >
          <VoiceAgentFlowDemo />
        </InteractiveWrapper>

        <div className="space-y-3 mt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Waves className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-cyan-400">Interruption Handling</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Users interrupt AI mid-sentence. Detect voice activity, stop TTS playback immediately, 
                and restart the pipeline with the new input.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <MessageSquare className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-violet-400">Turn-Taking</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Determine when the user has finished speaking. Use voice activity detection (VAD) 
                and silence thresholds. Too aggressive = cuts off users; too slow = awkward pauses.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-amber-400">Latency Optimization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Pipeline latency: start TTS as LLM streams (don&apos;t wait for full response). 
                Use faster models for voice (quality tradeoff). Pre-buffer common responses.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Zap className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-400">WebRTC for Real-Time</h4>
              <p className="text-sm text-muted-foreground mt-1">
                WebRTC provides low-latency bidirectional audio. Better than WebSockets for voice. 
                Handles NAT traversal, echo cancellation, and codec negotiation.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Patterns */}
        <h3 id="realtime-patterns" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Real-time Patterns
        </h3>

        <p className="text-muted-foreground">
          Building real-time AI applications requires specific patterns for handling concurrent operations, 
          state management, and graceful degradation.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-cyan-400 mb-2">Streaming + Tools</h4>
              <p className="text-sm text-muted-foreground m-0">
                When streaming with tool use: stream text until tool call → execute tool → stream 
                tool result interpretation. Handle mid-stream cancellation gracefully.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-violet-400 mb-2">Chunked Processing</h4>
              <p className="text-sm text-muted-foreground m-0">
                For long outputs: chunk into sentences, process TTS per-chunk, queue playback. 
                Allows parallel processing while maintaining sequential output.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Graceful Degradation</h4>
              <p className="text-sm text-muted-foreground m-0">
                If TTS fails, fall back to text display. If STT fails, offer text input. 
                Design for partial failure—voice systems have many failure modes.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">State Synchronization</h4>
              <p className="text-sm text-muted-foreground m-0">
                Track conversation state across disconnects. Use session IDs, persist context, 
                allow resume. Mobile users lose connection frequently.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Streaming Best Practices */}
        <h3 id="streaming-best-practices" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Streaming Best Practices
        </h3>

        <p className="text-muted-foreground">
          Practical guidance for implementing streaming in production:
        </p>

        <div className="my-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-lg font-semibold text-emerald-400 mb-3">Implementation Checklist</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Use SSE for text streaming:</span>{" "}
                <span className="text-muted-foreground">
                  Simple, well-supported, works through proxies. WebSockets only if you need bidirectional.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Buffer on the client:</span>{" "}
                <span className="text-muted-foreground">
                  Don&apos;t render every token immediately—batch 2-3 tokens for smoother UX.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Handle cancellation:</span>{" "}
                <span className="text-muted-foreground">
                  User navigates away or cancels—abort the stream, stop billing tokens.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Log complete responses:</span>{" "}
                <span className="text-muted-foreground">
                  Reassemble streamed chunks for logging and analytics. Don&apos;t lose data to streaming.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Timeout appropriately:</span>{" "}
                <span className="text-muted-foreground">
                  Streaming connections can hang. Set timeouts for first-byte and inter-chunk delays.
                </span>
              </div>
            </div>
          </div>
        </div>

        <Callout variant="important" title="Voice Agent Complexity">
          <p className="m-0">
            Voice agents are significantly more complex than text chat. Expect 3-6 months to build a 
            production-quality voice agent from scratch. Consider platforms like Vapi, Bland.ai, or 
            Retell for faster time-to-market—they handle the telephony, STT/TTS, and interruption 
            handling, letting you focus on the AI logic.
          </p>
        </Callout>

        <h3 className="text-xl font-semibold mt-10 mb-4">Voice Agent Platforms</h3>

        <div className="space-y-4 mt-4">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Vapi</h4>
              <p className="text-sm text-muted-foreground m-0">
                Full-stack voice AI platform. Handles telephony, STT, TTS, and provides APIs for 
                custom LLM integration. Good for phone-based agents.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">LiveKit</h4>
              <p className="text-sm text-muted-foreground m-0">
                Open-source WebRTC infrastructure. Build custom voice agents with full control. 
                Requires more engineering but maximum flexibility.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">OpenAI Realtime API</h4>
              <p className="text-sm text-muted-foreground m-0">
                Native voice-to-voice with GPT-4o. Lower latency than STT+LLM+TTS pipeline. 
                Limited customization but excellent quality.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
            <li>
              <strong>Stream everything</strong>—200ms first-byte vs 2s full-response transforms UX
            </li>
            <li>
              <strong>Overlap pipeline stages</strong>—start TTS while LLM is still generating
            </li>
            <li>
              <strong>Handle interruptions</strong>—users will talk over your AI; detect and adapt
            </li>
            <li>
              <strong>Consider platforms</strong>—voice is complex; use existing infrastructure when possible
            </li>
            <li>
              <strong>Design for failure</strong>—graceful degradation for every stage of the pipeline
            </li>
          </ul>
        </Callout>
      </div>
    </section>
  );
}
