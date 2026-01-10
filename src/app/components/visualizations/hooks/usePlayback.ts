"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { TaskState, ChatMessage, PlaybackConfig } from "@/lib/visualizations/types";
import { DEFAULT_PLAYBACK_CONFIG, canTaskStart } from "@/lib/visualizations/types";
import { initializeTaskStates } from "@/lib/visualizations/utils";
import type { DAGTask } from "@/lib/visualizations/types";

// =============================================================================
// Types
// =============================================================================

export interface UsePlaybackOptions {
  /** Tasks to animate */
  tasks: DAGTask[];
  /** Chat messages linked to tasks */
  chatMessages: ChatMessage[];
  /** Playback configuration */
  config?: PlaybackConfig;
  /** Callback when playback completes */
  onComplete?: () => void;
}

export interface UsePlaybackReturn {
  /** Current task states */
  taskStates: TaskState[];
  /** IDs of messages that should be visible */
  visibleMessageIds: Set<string>;
  /** Whether playback is running */
  isPlaying: boolean;
  /** Whether playback has completed */
  isComplete: boolean;
  /** Current playback speed */
  speed: number;
  /** Current execution time in ms */
  executionTime: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Number of running tasks */
  runningCount: number;
  /** Number of completed tasks */
  completedCount: number;
  /** Start or resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  togglePlayPause: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Set playback speed */
  setSpeed: (speed: number) => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function usePlayback({
  tasks,
  chatMessages,
  config = DEFAULT_PLAYBACK_CONFIG,
  onComplete,
}: UsePlaybackOptions): UsePlaybackReturn {
  const { defaultSpeed = 1 } = config;

  // State
  const [taskStates, setTaskStates] = useState<TaskState[]>(() =>
    initializeTaskStates(tasks)
  );
  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [executionTime, setExecutionTime] = useState(0);

  // Refs for interval cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state
  const completedCount = taskStates.filter((t) => t.status === "completed").length;
  const runningCount = taskStates.filter((t) => t.status === "running").length;
  const isComplete = taskStates.length > 0 && taskStates.every((t) => t.status === "completed");
  const progress = taskStates.length > 0 ? (completedCount / taskStates.length) * 100 : 0;

  // Update visible messages based on task states
  const updateVisibleMessages = useCallback(
    (currentTasks: TaskState[]) => {
      const newVisibleIds = new Set<string>();

      // Always show initial user message
      const userMsg = chatMessages.find((m) => m.role === "user");
      if (userMsg) newVisibleIds.add(userMsg.id);

      for (const msg of chatMessages) {
        // Show message if its triggering task has started
        if (msg.metadata?.triggeredAtStart) {
          const task = currentTasks.find((t) => t.id === msg.metadata?.triggeredAtStart);
          if (task && (task.status === "running" || task.status === "completed")) {
            newVisibleIds.add(msg.id);
          }
        }
        // Show message if its triggering task has completed
        if (msg.metadata?.triggeredBy) {
          const task = currentTasks.find((t) => t.id === msg.metadata?.triggeredBy);
          if (task && task.status === "completed") {
            newVisibleIds.add(msg.id);
          }
        }
      }

      setVisibleMessageIds(newVisibleIds);
    },
    [chatMessages]
  );

  // Reset function
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTaskStates(initializeTaskStates(tasks));
    setVisibleMessageIds(new Set());
    setIsPlaying(false);
    setExecutionTime(0);
  }, [tasks]);

  // Reset when tasks change
  useEffect(() => {
    reset();
  }, [tasks, reset]);

  // Playback logic
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setExecutionTime((prev) => prev + 50 * speed);

      setTaskStates((currentTasks) => {
        let updated = false;
        const newTasks = currentTasks.map((task) => {
          // Start tasks whose dependencies are met
          if (canTaskStart(task, currentTasks)) {
            updated = true;
            return { ...task, status: "running" as const, startTime: executionTime };
          }

          // Complete running tasks after their duration
          if (task.status === "running" && task.startTime !== undefined) {
            const elapsed = executionTime - task.startTime;
            if (elapsed >= task.duration / speed) {
              updated = true;
              return { ...task, status: "completed" as const };
            }
          }

          return task;
        });

        // Check if all complete
        if (newTasks.every((t) => t.status === "completed")) {
          setTimeout(() => {
            setIsPlaying(false);
            onComplete?.();
          }, 100);
        }

        // Update messages based on new task states
        if (updated) {
          updateVisibleMessages(newTasks);
        }

        return updated ? newTasks : currentTasks;
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, executionTime, speed, updateVisibleMessages, onComplete]);

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

      // Show user message immediately
      const userMsg = chatMessages.find((m) => m.role === "user");
      if (userMsg) {
        setVisibleMessageIds(new Set([userMsg.id]));
      }
    }
  }, [isPlaying, taskStates, chatMessages, updateVisibleMessages]);

  // Actions
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlayPause = useCallback(() => {
    if (isComplete) {
      reset();
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isComplete, reset]);

  return {
    taskStates,
    visibleMessageIds,
    isPlaying,
    isComplete,
    speed,
    executionTime,
    progress,
    runningCount,
    completedCount,
    play,
    pause,
    togglePlayPause,
    reset,
    setSpeed,
  };
}

export default usePlayback;
