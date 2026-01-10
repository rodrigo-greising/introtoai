/**
 * DAG (Directed Acyclic Graph) Types
 *
 * These types represent task graphs for orchestration visualizations,
 * including layout positioning and execution state.
 */

import type { ContextDetail, WorkerMessage } from "./chat";

/**
 * Execution status of a task in the DAG
 */
export type TaskStatus = "pending" | "running" | "completed";

/**
 * A task node in the DAG
 */
export interface DAGTask {
  id: string;
  /** Full task name */
  name: string;
  /** Short label for display in the node */
  shortLabel: string;
  /** Description of what the task does */
  description: string;
  /** IDs of tasks that must complete before this one */
  dependencies: string[];
  /** Simulated duration in milliseconds */
  duration: number;
  /** Column position in the graph (0-indexed, left to right) */
  column: number;
  /** Row position in the graph (can be fractional for centering) */
  row: number;
  /** Context visible during this task */
  context?: ContextDetail[];
  /** Full internal chat for worker nodes */
  internalChat?: WorkerMessage[];
}

/**
 * Runtime state of a task during playback
 */
export interface TaskState extends DAGTask {
  status: TaskStatus;
  /** Timestamp when the task started (for animation) */
  startTime?: number;
}

/**
 * An edge connecting two tasks in the DAG
 */
export interface DAGEdge {
  from: string;
  to: string;
  /** Whether this edge is on the critical path */
  isCritical?: boolean;
}

/**
 * Layout configuration for rendering the DAG
 */
export interface DAGLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  columnGap: number;
  rowGap: number;
  padding: number;
}

/**
 * Default layout configuration
 */
export const DEFAULT_DAG_LAYOUT: DAGLayoutConfig = {
  nodeWidth: 100,
  nodeHeight: 48,
  columnGap: 130,
  rowGap: 65,
  padding: 40,
};

/**
 * Configuration for how to render the DAG viewer
 */
export interface DAGViewerConfig {
  layout?: Partial<DAGLayoutConfig>;
  /** Whether to show the grid background */
  showGrid?: boolean;
  /** Whether to enable node selection */
  enableSelection?: boolean;
  /** Whether to animate task transitions */
  animateTransitions?: boolean;
  /** Color theme */
  colorTheme?: "cyan" | "violet" | "amber" | "emerald";
}

/**
 * Calculate the position of a node based on its column and row
 */
export function getNodePosition(
  task: DAGTask,
  layout: DAGLayoutConfig = DEFAULT_DAG_LAYOUT
): { x: number; y: number } {
  return {
    x: layout.padding + task.column * layout.columnGap,
    y: layout.padding + task.row * layout.rowGap,
  };
}

/**
 * Generate an SVG path for an edge between two tasks
 */
export function getEdgePath(
  from: DAGTask,
  to: DAGTask,
  layout: DAGLayoutConfig = DEFAULT_DAG_LAYOUT
): string {
  const fromPos = getNodePosition(from, layout);
  const toPos = getNodePosition(to, layout);

  const startX = fromPos.x + layout.nodeWidth;
  const startY = fromPos.y + layout.nodeHeight / 2;
  const endX = toPos.x;
  const endY = toPos.y + layout.nodeHeight / 2;

  const midX = (startX + endX) / 2;

  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

/**
 * Calculate the SVG dimensions needed to contain the DAG
 */
export function calculateDAGDimensions(
  tasks: DAGTask[],
  layout: DAGLayoutConfig = DEFAULT_DAG_LAYOUT
): { width: number; height: number } {
  if (tasks.length === 0) {
    return { width: layout.padding * 2, height: layout.padding * 2 };
  }

  const maxCol = Math.max(...tasks.map((t) => t.column));
  const maxRow = Math.max(...tasks.map((t) => t.row));

  return {
    width: layout.padding * 2 + maxCol * layout.columnGap + layout.nodeWidth,
    height: layout.padding * 2 + maxRow * layout.rowGap + layout.nodeHeight,
  };
}

/**
 * Get all tasks that would be complete when a given task completes
 * (including all ancestors/dependencies transitively)
 */
export function getCompletedTasksAtPoint(
  taskId: string,
  tasks: DAGTask[]
): Set<string> {
  const completed = new Set<string>();
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  function addAncestors(id: string) {
    const task = taskMap.get(id);
    if (!task) return;

    for (const depId of task.dependencies) {
      if (!completed.has(depId)) {
        completed.add(depId);
        addAncestors(depId);
      }
    }
  }

  addAncestors(taskId);
  completed.add(taskId);

  // Also include sibling tasks that would complete at the same time
  const selectedTask = taskMap.get(taskId);
  if (selectedTask) {
    const siblings = tasks.filter(
      (t) =>
        t.id !== taskId &&
        t.dependencies.length > 0 &&
        t.dependencies.every((d) => selectedTask.dependencies.includes(d)) &&
        selectedTask.dependencies.every((d) => t.dependencies.includes(d))
    );

    for (const sibling of siblings) {
      if (sibling.duration <= selectedTask.duration) {
        completed.add(sibling.id);
      }
    }
  }

  return completed;
}

/**
 * Check if a task can start based on current task states
 */
export function canTaskStart(
  task: TaskState,
  allTasks: TaskState[]
): boolean {
  if (task.status !== "pending") return false;
  return task.dependencies.every((depId) => {
    const dep = allTasks.find((t) => t.id === depId);
    return dep?.status === "completed";
  });
}
