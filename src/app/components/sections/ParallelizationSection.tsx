"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import { InteractiveWrapper } from "@/app/components/visualizations/core";
import { 
  Play,
  RotateCcw,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";

// =============================================================================
// Timeline Comparison Visualizer
// =============================================================================

interface Task {
  id: string;
  label: string;
  duration: number; // in "time units"
  startTime?: number;
  endTime?: number;
}

function TimelineComparisonVisualizer() {
  const [mode, setMode] = useState<"sequential" | "parallel">("sequential");
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const tasks: Task[] = useMemo(() => [
    { id: "t1", label: "Fetch User Data", duration: 2 },
    { id: "t2", label: "Search Documents", duration: 3 },
    { id: "t3", label: "Analyze Context", duration: 2 },
    { id: "t4", label: "Generate Response", duration: 4 },
  ], []);

  // Calculate timeline based on mode
  const getTimeline = useCallback(() => {
    if (mode === "sequential") {
      let time = 0;
      return tasks.map(task => {
        const scheduled = { ...task, startTime: time, endTime: time + task.duration };
        time += task.duration;
        return scheduled;
      });
    } else {
      // First 3 can run in parallel, last one depends on them
      const parallel = tasks.slice(0, 3).map(task => ({
        ...task,
        startTime: 0,
        endTime: task.duration,
      }));
      const maxParallelEnd = Math.max(...parallel.map(t => t.endTime!));
      const last = tasks[3];
      return [
        ...parallel,
        { ...last, startTime: maxParallelEnd, endTime: maxParallelEnd + last.duration },
      ];
    }
  }, [mode, tasks]);

  const timeline = getTimeline();
  const totalTime = Math.max(...timeline.map(t => t.endTime || 0));

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    setCurrentTime(0);
    const total = Math.max(...timeline.map(t => t.endTime || 0));

    let time = 0;
    const interval = setInterval(() => {
      time += 0.1;
      setCurrentTime(time);
      if (time >= total) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeline]);

  const reset = useCallback(() => {
    setCurrentTime(0);
    setIsRunning(false);
  }, []);

  const getTaskStatus = (task: Task & { startTime?: number; endTime?: number }) => {
    if (!task.startTime || !task.endTime) return "pending";
    if (currentTime < task.startTime)     return "pending";
    if (currentTime >= task.endTime) return "complete";
    return "running";
  };

  const timelineWidth = 300;
  const timeScale = timelineWidth / totalTime;

  return (
    <div className="space-y-4">
        {/* Mode toggle and controls */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-muted/30 p-1">
            <button
              onClick={() => { setMode("sequential"); reset(); }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "sequential"
                  ? "bg-rose-500/20 text-rose-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowRight className="w-4 h-4" />
              Sequential
            </button>
            <button
              onClick={() => { setMode("parallel"); reset(); }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "parallel"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="w-4 h-4" />
              Parallel
            </button>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              !isRunning
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                : "bg-muted/30 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Timeline visualization */}
        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <div className="space-y-2">
            {timeline.map((task) => {
              const status = getTaskStatus(task);
              const left = (task.startTime || 0) * timeScale;
              const width = task.duration * timeScale;
              const progress = status === "running" 
                ? Math.min(1, (currentTime - (task.startTime || 0)) / task.duration)
                : status === "complete" ? 1 : 0;

              return (
                <div key={task.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground truncate">
                    {task.label}
                  </div>
                  <div className="relative h-8 flex-1" style={{ minWidth: timelineWidth }}>
                    {/* Track */}
                    <div className="absolute inset-y-1 left-0 right-0 bg-muted/30 rounded" />
                    
                    {/* Task bar */}
                    <div
                      className={cn(
                        "absolute top-1 bottom-1 rounded transition-all",
                        status === "complete" && "bg-emerald-500/50",
                        status === "running" && "bg-amber-500/50",
                        status === "pending" && "bg-muted/50"
                      )}
                      style={{
                        left: `${(left / timelineWidth) * 100}%`,
                        width: `${(width / timelineWidth) * 100}%`,
                      }}
                    >
                      {/* Progress fill */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded",
                          status === "complete" && "bg-emerald-500",
                          status === "running" && "bg-amber-500"
                        )}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-xs text-muted-foreground text-right">
                    {task.duration}s
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time axis */}
          <div className="flex items-center gap-3 mt-4 pt-2 border-t border-border">
            <div className="w-32" />
            <div className="relative flex-1" style={{ minWidth: timelineWidth }}>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0s</span>
                <span>{totalTime}s</span>
              </div>
              {/* Current time indicator */}
              {currentTime > 0 && (
                <div
                  className="absolute top-0 w-0.5 h-4 bg-cyan-400 -translate-y-4"
                  style={{ left: `${(currentTime / totalTime) * 100}%` }}
                />
              )}
            </div>
            <div className="w-12" />
          </div>
        </div>

        {/* Stats - Percentages emphasized (they matter!), numbers secondary */}
        <div className="flex gap-4">
          <div className={cn(
            "flex-1 p-3 rounded-lg border text-center",
            mode === "sequential"
              ? "bg-rose-500/10 border-rose-500/30"
              : "bg-muted/30 border-border"
          )}>
            <div className="text-sm text-muted-foreground">11s</div>
            <div className="text-xs text-muted-foreground">Sequential</div>
          </div>
          <div className={cn(
            "flex-1 p-3 rounded-lg border text-center",
            mode === "parallel"
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-muted/30 border-border"
          )}>
            <div className="text-sm text-muted-foreground">7s</div>
            <div className="text-xs text-muted-foreground">Parallel</div>
          </div>
          <div className="flex-[2] p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
            <div className="text-3xl font-bold text-cyan-400">36%</div>
            <div className="text-sm text-cyan-300">Faster</div>
            <div className="text-xs text-muted-foreground mt-1">11s → 7s</div>
          </div>
        </div>
      </div>
  );
}

// =============================================================================
// Main Section Component
// =============================================================================

export function ParallelizationSection() {
  return (
    <section id="parallelization" className="scroll-mt-20">
      <SectionHeading
        id="parallelization-heading"
        title="Parallelization"
        subtitle="Running independent operations concurrently"
      />

      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          When tasks don&apos;t depend on each other, running them <strong className="text-foreground">in parallel</strong> can 
          dramatically reduce total execution time. This is one of the simplest optimizations with the 
          biggest impact on latency.
        </p>

        <Callout variant="tip" title="The Key Insight">
          <p className="m-0">
            <code>await a(); await b(); await c();</code> takes <strong>sum</strong> of durations.
            <br />
            <code>await Promise.all([a(), b(), c()]);</code> takes <strong>max</strong> of durations.
          </p>
        </Callout>

        {/* Timeline Comparison */}
        <h3 id="timeline-comparison" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Sequential vs Parallel
        </h3>

        <InteractiveWrapper
          title="Interactive: Execution Timeline"
          description="Compare sequential and parallel execution strategies"
          icon="⏱️"
          colorTheme="cyan"
          minHeight="auto"
        >
          <TimelineComparisonVisualizer />
        </InteractiveWrapper>

        {/* When to Parallelize */}
        <h3 id="when-to-parallelize" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          When to Parallelize
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">✓ Parallelize When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Tasks have no data dependencies</li>
                <li>Operations are I/O bound (API calls, DB)</li>
                <li>Processing independent items in a batch</li>
                <li>Latency is more important than cost</li>
                <li>Rate limits allow concurrent requests</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-rose-400 mb-2">✗ Keep Sequential When</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Later tasks depend on earlier outputs</li>
                <li>Order matters for the result</li>
                <li>Rate limits are restrictive</li>
                <li>Memory is constrained (large payloads)</li>
                <li>Debugging sequential flow is easier</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Concurrency Control */}
        <h3 id="concurrency-control" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Concurrency Control
        </h3>

        <p className="text-muted-foreground">
          Unbounded parallelism can overwhelm APIs or exhaust resources. Use concurrency limits to 
          balance speed with reliability.
        </p>

        <p className="text-muted-foreground">
          Unbounded parallelism can overwhelm APIs or exhaust resources. Use concurrency limits to 
          balance speed with reliability. Simple batched execution processes items in batches, while 
          libraries like p-limit provide fine-grained control over concurrent operations.
        </p>

        {/* Error Handling */}
        <h3 id="error-handling" className="text-xl font-semibold mt-10 mb-4 scroll-mt-20">
          Error Handling in Parallel
        </h3>

        <p className="text-muted-foreground">
          <code>Promise.all</code> fails fast—one rejection aborts everything. For batch processing, 
          you often want to continue and collect partial results.
        </p>

        <p className="text-muted-foreground">
          <code>Promise.all</code> fails fast—one rejection aborts everything. For batch processing, 
          you often want to continue and collect partial results. Use <code>Promise.allSettled</code> 
          to continue despite failures, or implement retry logic with exponential backoff for transient errors.
        </p>

        <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
          <li>Using <code>Promise.allSettled</code> to continue despite failures</li>
          <li>Implementing retry logic with exponential backoff</li>
          <li>Collecting partial results when some operations fail</li>
          <li>Handling rate limits and API quotas</li>
        </ul>

        {/* Patterns */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Common Patterns</h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Fan-Out / Fan-In</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Split input into parts, process in parallel, merge results. Great for 
                    document processing, multi-source search, and map-reduce patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Speculative Execution</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Run multiple approaches in parallel, use first success. Useful when you&apos;re 
                    unsure which approach will work or need fastest response.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Streaming Pipeline</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Start next stage as soon as any item from previous stage completes. 
                    Reduces overall latency for multi-stage processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Best Practices</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✓ Do</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Set concurrency limits based on API rate limits</li>
                <li>Use <code>Promise.allSettled</code> for partial failure tolerance</li>
                <li>Implement exponential backoff for retries</li>
                <li>Track progress for long-running batches</li>
                <li>Measure actual latency improvements</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="highlight">
            <CardContent>
              <h4 className="font-medium text-foreground mb-2">✗ Avoid</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Unbounded parallelism (respect rate limits)</li>
                <li>Ignoring memory when holding large payloads</li>
                <li>Assuming parallel is always faster</li>
                <li>Complex dependency graphs (use DAG instead)</li>
                <li>Silent failures in batch processing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Next: Delegation" className="mt-8">
          <p className="m-0">
            Parallelization handles independent tasks. <strong>Delegation</strong> goes further—delegating 
            complex subtasks to specialized agents that can make their own decisions.
          </p>
        </Callout>
      </div>
    </section>
  );
}
