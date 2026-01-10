"use client";

import { useState, useCallback } from "react";
import { SectionHeading, Card, CardContent, Callout, CodeBlock } from "@/app/components/ui";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  Clock,
  Play,
  RotateCcw,
} from "lucide-react";

// Interactive Retry Simulator
function RetrySimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState<Array<{ success: boolean; delay: number; error?: string }>>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [strategy, setStrategy] = useState<"exponential" | "linear" | "none">("exponential");
  const [failureRate, setFailureRate] = useState(60);

  const maxAttempts = 5;
  const baseDelay = 1000;

  const getDelay = useCallback((attempt: number) => {
    switch (strategy) {
      case "exponential":
        return baseDelay * Math.pow(2, attempt);
      case "linear":
        return baseDelay * (attempt + 1);
      case "none":
        return 0;
    }
  }, [strategy]);

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setAttempts([]);
    setCurrentAttempt(0);

    for (let i = 0; i < maxAttempts; i++) {
      setCurrentAttempt(i + 1);
      const delay = getDelay(i);
      
      // Simulate delay (scaled down for demo)
      await new Promise(r => setTimeout(r, Math.min(delay / 5, 800)));

      // Simulate success/failure
      const success = Math.random() * 100 > failureRate;
      
      setAttempts(prev => [...prev, {
        success,
        delay,
        error: success ? undefined : ["Rate limited", "Timeout", "Server error", "Model overloaded"][Math.floor(Math.random() * 4)],
      }]);

      if (success) {
        setIsRunning(false);
        return;
      }
    }

    setIsRunning(false);
  }, [failureRate, getDelay]);

  const handleReset = () => {
    setIsRunning(false);
    setAttempts([]);
    setCurrentAttempt(0);
  };

  const lastAttempt = attempts[attempts.length - 1];
  const succeeded = lastAttempt?.success;
  const failed = attempts.length === maxAttempts && !succeeded;

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry Simulator
        </h4>
        <div className="flex items-center gap-2">
          {!isRunning && attempts.length === 0 && (
            <button
              onClick={runSimulation}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
          {attempts.length > 0 && !isRunning && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Retry Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as typeof strategy)}
            disabled={isRunning}
            className="w-full p-2 rounded-lg bg-muted border border-border text-foreground text-sm"
          >
            <option value="exponential">Exponential Backoff</option>
            <option value="linear">Linear Backoff</option>
            <option value="none">No Backoff (Immediate)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Failure Rate: <span className="text-foreground font-medium">{failureRate}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={failureRate}
            onChange={(e) => setFailureRate(Number(e.target.value))}
            disabled={isRunning}
            className="w-full accent-rose-400"
          />
        </div>
      </div>

      {/* Attempt visualization */}
      <div className="space-y-2">
        {Array.from({ length: maxAttempts }).map((_, i) => {
          const attempt = attempts[i];
          const isCurrent = currentAttempt === i + 1 && isRunning;
          const isPending = !attempt && !isCurrent;

          return (
            <div
              key={i}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all
                ${isCurrent ? "bg-amber-500/10 border-amber-500/30 scale-[1.02]" : ""}
                ${attempt?.success ? "bg-emerald-500/10 border-emerald-500/30" : ""}
                ${attempt && !attempt.success ? "bg-rose-500/10 border-rose-500/30" : ""}
                ${isPending ? "bg-muted/20 border-border opacity-40" : ""}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isCurrent ? "bg-amber-500/20" : ""}
                ${attempt?.success ? "bg-emerald-500/20" : ""}
                ${attempt && !attempt.success ? "bg-rose-500/20" : ""}
                ${isPending ? "bg-muted/40" : ""}
              `}>
                {isCurrent && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
                {attempt?.success && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {attempt && !attempt.success && <XCircle className="w-4 h-4 text-rose-400" />}
                {isPending && <span className="text-xs text-muted-foreground">{i + 1}</span>}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  isCurrent ? "text-amber-400" :
                  attempt?.success ? "text-emerald-400" :
                  attempt && !attempt.success ? "text-rose-400" :
                  "text-muted-foreground"
                }`}>
                  Attempt {i + 1}
                </div>
                {attempt && !attempt.success && (
                  <div className="text-xs text-muted-foreground">{attempt.error}</div>
                )}
                {attempt?.success && (
                  <div className="text-xs text-muted-foreground">Request succeeded</div>
                )}
              </div>

              {(attempt || isCurrent) && strategy !== "none" && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getDelay(i) / 1000}s delay
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {succeeded && !isRunning && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Success after {attempts.length} attempt(s)</span>
          </div>
        </div>
      )}

      {failed && !isRunning && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Failed after {maxAttempts} attempts - escalate to fallback</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReliabilitySection() {
  return (
    <section id="reliability" className="scroll-mt-20">
      <SectionHeading
        id="reliability-heading"
        title="Reliability Patterns"
        subtitle="Retries, fallbacks, and error handling for AI systems"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          LLM APIs fail. Rate limits, timeouts, model overload—production systems need 
          <strong className="text-foreground"> robust error handling</strong> to remain reliable 
          despite upstream instability.
        </p>

        <Callout variant="warning" title="Expect Failures">
          <p className="m-0">
            Even the most reliable LLM providers have outages and rate limits. Design your 
            system assuming API calls will fail, and build in recovery mechanisms from day one.
          </p>
        </Callout>

        {/* Building Reliable Systems */}
        <h3 id="reliability-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Building Reliable Systems
        </h3>

        <p className="text-muted-foreground">
          Reliability isn&apos;t about preventing failures—it&apos;s about <strong className="text-foreground">graceful 
          degradation</strong> when failures occur. The goal: users should rarely notice when 
          things go wrong behind the scenes.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground m-0">Retries</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Automatically retry failed requests with exponential backoff
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground m-0">Fallbacks</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Switch to backup models or cached responses when primary fails
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="font-medium text-foreground m-0">Circuit Breakers</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Stop calling failing services to prevent cascade failures
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Retry Patterns */}
        <h3 id="retry-patterns" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Retry Patterns
        </h3>

        <p className="text-muted-foreground">
          Not all errors should be retried. <strong className="text-foreground">Transient 
          failures</strong> (rate limits, timeouts) are good retry candidates. Permanent errors 
          (invalid API key, malformed request) should not be retried.
        </p>

        <CodeBlock
          language="typescript"
          filename="retry-with-backoff.ts"
          code={`async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry non-retryable errors
      if (!isRetryable(error)) throw error;
      
      if (attempt === maxAttempts) throw error;
      
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      const jitter = delay * 0.1 * Math.random();
      await sleep(delay + jitter);
    }
  }
  throw new Error("Unreachable");
}

function isRetryable(error: any): boolean {
  return (
    error.code === "RATE_LIMITED" ||
    error.code === "TIMEOUT" ||
    error.code === "SERVER_ERROR" ||
    error.status >= 500
  );
}`}
        />

        {/* Interactive Retry Simulator */}
        <h3 id="retry-simulator" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Retry Simulator
        </h3>

        <p className="text-muted-foreground">
          See how different retry strategies handle failures:
        </p>

        <RetrySimulator />

        {/* Fallback Strategies */}
        <h3 id="fallback-strategies" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Fallback Strategies
        </h3>

        <p className="text-muted-foreground">
          When retries are exhausted, fall back to alternatives. The best fallback depends on 
          your use case and acceptable degradation level.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Model Fallback</h4>
              <p className="text-sm text-muted-foreground m-0">
                Try a different model or provider. Claude fails? Try GPT. GPT fails? Try a 
                local model. Chain through options.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Cached Responses</h4>
              <p className="text-sm text-muted-foreground m-0">
                Return cached responses for common queries. Stale data is often better than 
                no data—with appropriate staleness indicators.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Graceful Degradation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Offer reduced functionality. Can&apos;t generate full response? Provide a 
                template or partial answer with an apology.
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">Human Escalation</h4>
              <p className="text-sm text-muted-foreground m-0">
                Route to human support. If AI can&apos;t help, connect the user to a person 
                with all context preserved.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <h3 id="best-practices" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Best Practices
        </h3>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-3">Reliability Checklist</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-2">
              <li><strong className="text-foreground">Timeouts:</strong> Set aggressive timeouts (10-30s). Don&apos;t wait forever.</li>
              <li><strong className="text-foreground">Idempotency:</strong> Ensure retries don&apos;t cause duplicate effects.</li>
              <li><strong className="text-foreground">Logging:</strong> Log all attempts with timing, errors, and outcomes.</li>
              <li><strong className="text-foreground">Monitoring:</strong> Track success rates, latency percentiles, retry rates.</li>
              <li><strong className="text-foreground">Alerting:</strong> Notify on unusual failure patterns before users notice.</li>
              <li><strong className="text-foreground">Testing:</strong> Inject failures in staging to verify recovery works.</li>
            </ul>
          </CardContent>
        </Card>

        <Callout variant="tip" title="Multi-Provider Strategy">
          <p className="m-0">
            Don&apos;t depend on a single LLM provider. Build abstractions that let you switch 
            providers easily. When OpenAI is down, route to Anthropic. When Anthropic is 
            rate-limited, try Google. Diversification is reliability.
          </p>
        </Callout>
      </div>
    </section>
  );
}
