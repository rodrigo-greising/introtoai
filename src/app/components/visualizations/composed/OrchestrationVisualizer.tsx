"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Scenario, TaskState } from "@/lib/visualizations/types";
import { orchestrationScenarios } from "@/lib/visualizations/data";
import { initializeTaskStates } from "@/lib/visualizations/utils";
import { ChatPanel, DAGViewer, PlaybackControls } from "../core";

// =============================================================================
// Tab Types for Chat Sessions
// =============================================================================

interface ChatTab {
  id: string;
  label: string;
  shortLabel: string;
  type: "orchestrator" | "worker";
  taskId?: string;
}

// =============================================================================
// Component Props
// =============================================================================

export interface OrchestrationVisualizerProps {
  /** Scenarios to display (defaults to all orchestration scenarios) */
  scenarios?: Scenario[];
  /** Initially selected scenario ID */
  defaultScenarioId?: string;
  /** Custom className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function OrchestrationVisualizer({
  scenarios = orchestrationScenarios,
  defaultScenarioId,
  className,
}: OrchestrationVisualizerProps) {
  // Scenario selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    defaultScenarioId || scenarios[0]?.id || ""
  );

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0],
    [selectedScenarioId, scenarios]
  );

  // Playback state
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Selection state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("orchestrator");

  // Initialize when scenario changes
  useEffect(() => {
    if (scenario?.tasks) {
      setTaskStates(initializeTaskStates(scenario.tasks));
    }
    setVisibleMessageIds(new Set());
    setIsPlaying(false);
    setExecutionTime(0);
    setSelectedTaskId(null);
    setActiveTab("orchestrator");
  }, [scenario]);

  // Build tabs for chat sessions
  const tabs = useMemo<ChatTab[]>(() => {
    if (!scenario?.tasks) return [{ id: "orchestrator", label: "Orchestrator", shortLabel: "Orch", type: "orchestrator" }];

    const workerTabs: ChatTab[] = scenario.tasks
      .filter((t) => t.internalChat && t.internalChat.length > 0)
      .map((t) => ({
        id: t.id,
        label: t.name,
        shortLabel: t.shortLabel,
        type: "worker" as const,
        taskId: t.id,
      }));

    return [
      { id: "orchestrator", label: "Orchestrator", shortLabel: "Orch", type: "orchestrator" },
      ...workerTabs,
    ];
  }, [scenario]);

  // Sync active tab with selected task from DAG
  useEffect(() => {
    if (selectedTaskId) {
      const matchingTab = tabs.find((t) => t.taskId === selectedTaskId);
      if (matchingTab) {
        setActiveTab(matchingTab.id);
      } else {
        setActiveTab("orchestrator");
      }
    }
  }, [selectedTaskId, tabs]);

  // Handle tab click
  const handleTabClick = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveTab(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.taskId) {
      setSelectedTaskId(tab.taskId);
    } else {
      setSelectedTaskId(null);
    }
  }, [tabs]);

  // Reset function
  const reset = useCallback(() => {
    if (scenario?.tasks) {
      setTaskStates(initializeTaskStates(scenario.tasks));
    }
    setVisibleMessageIds(new Set());
    setIsPlaying(false);
    setExecutionTime(0);
    setSelectedTaskId(null);
    setActiveTab("orchestrator");
  }, [scenario]);

  // Check if task can start
  const canStart = useCallback((task: TaskState, currentTasks: TaskState[]) => {
    if (task.status !== "pending") return false;
    return task.dependencies.every((depId) => {
      const dep = currentTasks.find((t) => t.id === depId);
      return dep?.status === "completed";
    });
  }, []);

  // Update visible messages based on task states
  const updateVisibleMessages = useCallback(
    (currentTasks: TaskState[]) => {
      if (!scenario?.chatMessages) return;

      const newVisibleIds = new Set<string>();

      // Always show initial user message
      const userMsg = scenario.chatMessages.find((m) => m.role === "user");
      if (userMsg) newVisibleIds.add(userMsg.id);

      for (const msg of scenario.chatMessages) {
        if (msg.metadata?.triggeredAtStart) {
          const task = currentTasks.find((t) => t.id === msg.metadata?.triggeredAtStart);
          if (task && (task.status === "running" || task.status === "completed")) {
            newVisibleIds.add(msg.id);
          }
        }
        if (msg.metadata?.triggeredBy) {
          const task = currentTasks.find((t) => t.id === msg.metadata?.triggeredBy);
          if (task && task.status === "completed") {
            newVisibleIds.add(msg.id);
          }
        }
      }

      setVisibleMessageIds(newVisibleIds);
    },
    [scenario?.chatMessages]
  );

  // Playback logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setExecutionTime((prev) => prev + 50 * playbackSpeed);

      setTaskStates((currentTasks) => {
        let updated = false;
        const newTasks = currentTasks.map((task) => {
          if (canStart(task, currentTasks)) {
            updated = true;
            return { ...task, status: "running" as const, startTime: executionTime };
          }

          if (task.status === "running" && task.startTime !== undefined) {
            const elapsed = executionTime - task.startTime;
            if (elapsed >= task.duration / playbackSpeed) {
              updated = true;
              return { ...task, status: "completed" as const };
            }
          }

          return task;
        });

        if (newTasks.every((t) => t.status === "completed")) {
          setTimeout(() => setIsPlaying(false), 100);
        }

        if (updated) {
          updateVisibleMessages(newTasks);
        }

        return updated ? newTasks : currentTasks;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, executionTime, canStart, playbackSpeed, updateVisibleMessages]);

  // Start first tasks when playing begins
  useEffect(() => {
    if (isPlaying && taskStates.every((t) => t.status === "pending")) {
      setTaskStates((currentTasks) => {
        const newTasks = currentTasks.map((task) =>
          task.dependencies.length === 0
            ? { ...task, status: "running" as const, startTime: 0 }
            : task
        );
        updateVisibleMessages(newTasks);
        return newTasks;
      });

      const userMsg = scenario?.chatMessages?.find((m) => m.role === "user");
      if (userMsg) {
        setVisibleMessageIds(new Set([userMsg.id]));
      }
    }
  }, [isPlaying, taskStates, scenario?.chatMessages, updateVisibleMessages]);

  // Computed values
  const completedCount = taskStates.filter((t) => t.status === "completed").length;
  const runningCount = taskStates.filter((t) => t.status === "running").length;
  const progress = taskStates.length > 0 ? (completedCount / taskStates.length) * 100 : 0;
  const isComplete = taskStates.length > 0 && taskStates.every((t) => t.status === "completed");

  // Get current tab data
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const selectedTask = currentTab?.taskId
    ? scenario?.tasks?.find((t) => t.id === currentTab.taskId)
    : null;
  const isWorkerView = currentTab?.type === "worker" && selectedTask?.internalChat;

  // Filter orchestrator messages
  const orchestratorMessages = useMemo(() => {
    if (!scenario?.chatMessages) return [];
    return scenario.chatMessages.filter((m) => visibleMessageIds.has(m.id));
  }, [scenario?.chatMessages, visibleMessageIds]);

  // Get task status for tab indicator
  const getTaskStatus = useCallback(
    (taskId: string) => {
      const taskState = taskStates.find((t) => t.id === taskId);
      return taskState?.status || "pending";
    },
    [taskStates]
  );

  if (!scenario) {
    return <div className={cn("text-muted-foreground", className)}>No scenarios available</div>;
  }

  const colorTheme = scenario.colorTheme || "cyan";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Scenario Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenarioId(s.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedScenarioId === s.id
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Scenario Description */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg border",
          scenario.patternType === "static"
            ? "bg-violet-500/5 border-violet-500/20"
            : "bg-amber-500/5 border-amber-500/20"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
            scenario.patternType === "static"
              ? "bg-violet-500/20 text-violet-400"
              : "bg-amber-500/20 text-amber-400"
          )}
        >
          {scenario.patternType === "static" ? "Static DAG" : "Dynamic"}
        </div>
        <div>
          <p className="text-sm text-foreground font-medium mb-1 m-0">{scenario.description}</p>
          <p className="text-xs text-muted-foreground m-0">{scenario.patternDescription}</p>
        </div>
      </div>

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        isComplete={isComplete}
        speed={playbackSpeed}
        progress={progress}
        runningCount={runningCount}
        completedCount={completedCount}
        totalCount={taskStates.length}
        colorTheme={colorTheme}
        onPlayPause={() => {
          if (isComplete) {
            reset();
            setTimeout(() => setIsPlaying(true), 50);
          } else {
            setIsPlaying(!isPlaying);
          }
        }}
        onReset={reset}
        onSpeedChange={setPlaybackSpeed}
      />

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat Panel with Tabs */}
        <div className="flex flex-col h-full rounded-xl border border-border bg-card/30 overflow-hidden">
          {/* Tab Bar */}
          <div className="border-b border-border bg-muted/30">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const status = tab.taskId ? getTaskStatus(tab.taskId) : null;

                return (
                  <button
                    key={tab.id}
                    onClick={(e) => handleTabClick(e, tab.id)}
                    className={cn(
                      "px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap",
                      "border border-b-0 -mb-px relative",
                      isActive
                        ? "bg-card/80 border-border z-10"
                        : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                          tab.type === "orchestrator"
                            ? isComplete
                              ? "bg-emerald-500"
                              : "bg-violet-500"
                            : status === "completed"
                              ? "bg-emerald-500"
                              : status === "running"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-slate-500",
                          !isActive && "opacity-50"
                        )}
                      />
                      {tab.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Content */}
          <ChatPanel
            messages={isWorkerView ? [] : orchestratorMessages}
            workerChat={isWorkerView && selectedTask?.internalChat ? selectedTask.internalChat : undefined}
            isWorkerView={!!isWorkerView}
            config={{
              title: currentTab?.label || "Orchestrator",
              subtitle: isWorkerView
                ? "Internal session — hidden from orchestrator"
                : "Main conversation flow",
              showTokenCounts: true,
              colorTheme: isWorkerView ? "amber" : "violet",
            }}
            className="border-0 rounded-none"
          />
        </div>

        {/* DAG Panel */}
        <DAGViewer
          tasks={taskStates}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          config={{
            colorTheme,
            showGrid: true,
            enableSelection: true,
            animateTransitions: true,
          }}
        />
      </div>

      {/* Pattern Insight Callout */}
      {scenario.insight && (
        <div
          className={cn(
            "rounded-lg p-4 border",
            scenario.patternType === "static"
              ? "bg-violet-500/5 border-violet-500/20"
              : "bg-amber-500/5 border-amber-500/20"
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                scenario.patternType === "static" ? "bg-violet-500/20" : "bg-amber-500/20"
              )}
            >
              {scenario.patternType === "static" ? (
                <svg
                  className="w-4 h-4 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h4
                className={cn(
                  "font-medium mb-1",
                  scenario.patternType === "static" ? "text-violet-400" : "text-amber-400"
                )}
              >
                {scenario.patternType === "static" ? "MapReduce Pattern" : "Delegation Pattern"}
              </h4>
              <p className="text-sm text-muted-foreground m-0">{scenario.insight}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrchestrationVisualizer;
