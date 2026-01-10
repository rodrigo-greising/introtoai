/**
 * Graph Utilities
 *
 * Helper functions for working with DAG structures,
 * including traversal, dependency analysis, and layout.
 */

import type { DAGTask, TaskState, TaskStatus } from "../types";

/**
 * Build a map of task ID to task
 */
export function buildTaskMap<T extends DAGTask>(
  tasks: T[]
): Map<string, T> {
  return new Map(tasks.map((t) => [t.id, t]));
}

/**
 * Get all ancestors of a task (transitive dependencies)
 */
export function getAncestors(
  taskId: string,
  tasks: DAGTask[]
): Set<string> {
  const ancestors = new Set<string>();
  const taskMap = buildTaskMap(tasks);

  function traverse(id: string) {
    const task = taskMap.get(id);
    if (!task) return;

    for (const depId of task.dependencies) {
      if (!ancestors.has(depId)) {
        ancestors.add(depId);
        traverse(depId);
      }
    }
  }

  traverse(taskId);
  return ancestors;
}

/**
 * Get all descendants of a task (tasks that depend on this one)
 */
export function getDescendants(
  taskId: string,
  tasks: DAGTask[]
): Set<string> {
  const descendants = new Set<string>();

  function traverse(id: string) {
    for (const task of tasks) {
      if (task.dependencies.includes(id) && !descendants.has(task.id)) {
        descendants.add(task.id);
        traverse(task.id);
      }
    }
  }

  traverse(taskId);
  return descendants;
}

/**
 * Find parallel sibling tasks (tasks with the same dependencies)
 */
export function getParallelSiblings(
  taskId: string,
  tasks: DAGTask[]
): DAGTask[] {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return [];

  const depsKey = task.dependencies.sort().join(",");

  return tasks.filter((t) => {
    if (t.id === taskId) return false;
    return t.dependencies.sort().join(",") === depsKey;
  });
}

/**
 * Group tasks by their column (execution phase)
 */
export function groupTasksByColumn(
  tasks: DAGTask[]
): Map<number, DAGTask[]> {
  const groups = new Map<number, DAGTask[]>();

  for (const task of tasks) {
    if (!groups.has(task.column)) {
      groups.set(task.column, []);
    }
    groups.get(task.column)!.push(task);
  }

  return groups;
}

/**
 * Get tasks that can start (all dependencies completed)
 */
export function getReadyTasks(tasks: TaskState[]): TaskState[] {
  return tasks.filter((task) => {
    if (task.status !== "pending") return false;

    return task.dependencies.every((depId) => {
      const dep = tasks.find((t) => t.id === depId);
      return dep?.status === "completed";
    });
  });
}

/**
 * Topologically sort tasks
 */
export function topologicalSort(tasks: DAGTask[]): DAGTask[] {
  const result: DAGTask[] = [];
  const visited = new Set<string>();
  const taskMap = buildTaskMap(tasks);

  function visit(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const task = taskMap.get(id);
    if (!task) return;

    for (const depId of task.dependencies) {
      visit(depId);
    }

    result.push(task);
  }

  for (const task of tasks) {
    visit(task.id);
  }

  return result;
}

/**
 * Find the critical path (longest path through the DAG)
 */
export function findCriticalPath(tasks: DAGTask[]): string[] {
  const taskMap = buildTaskMap(tasks);
  const memo = new Map<string, { path: string[]; duration: number }>();

  function longestPath(id: string): { path: string[]; duration: number } {
    if (memo.has(id)) return memo.get(id)!;

    const task = taskMap.get(id);
    if (!task) return { path: [], duration: 0 };

    if (task.dependencies.length === 0) {
      const result = { path: [id], duration: task.duration };
      memo.set(id, result);
      return result;
    }

    let best = { path: [] as string[], duration: 0 };

    for (const depId of task.dependencies) {
      const sub = longestPath(depId);
      if (sub.duration > best.duration) {
        best = sub;
      }
    }

    const result = {
      path: [...best.path, id],
      duration: best.duration + task.duration,
    };
    memo.set(id, result);
    return result;
  }

  // Find the task with no dependents (end task)
  const endTasks = tasks.filter(
    (t) => !tasks.some((other) => other.dependencies.includes(t.id))
  );

  let criticalPath: string[] = [];
  let maxDuration = 0;

  for (const task of endTasks) {
    const { path, duration } = longestPath(task.id);
    if (duration > maxDuration) {
      maxDuration = duration;
      criticalPath = path;
    }
  }

  return criticalPath;
}

/**
 * Calculate total execution time for parallel execution
 */
export function calculateParallelDuration(tasks: DAGTask[]): number {
  const tasksByColumn = groupTasksByColumn(tasks);
  let totalDuration = 0;

  for (const [, columnTasks] of Array.from(tasksByColumn.entries()).sort(
    (a, b) => a[0] - b[0]
  )) {
    // In parallel execution, take the longest task in each column
    const maxDuration = Math.max(...columnTasks.map((t) => t.duration));
    totalDuration += maxDuration;
  }

  return totalDuration;
}

/**
 * Calculate total execution time for sequential execution
 */
export function calculateSequentialDuration(tasks: DAGTask[]): number {
  return tasks.reduce((sum, task) => sum + task.duration, 0);
}

/**
 * Validate that a DAG has no cycles
 */
export function validateDAG(tasks: DAGTask[]): {
  valid: boolean;
  error?: string;
} {
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const taskMap = buildTaskMap(tasks);

  function hasCycle(id: string): boolean {
    if (inStack.has(id)) return true;
    if (visited.has(id)) return false;

    visited.add(id);
    inStack.add(id);

    const task = taskMap.get(id);
    if (task) {
      for (const depId of task.dependencies) {
        if (hasCycle(depId)) return true;
      }
    }

    inStack.delete(id);
    return false;
  }

  for (const task of tasks) {
    if (hasCycle(task.id)) {
      return { valid: false, error: `Cycle detected involving task: ${task.id}` };
    }
  }

  // Check for missing dependencies
  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (!taskMap.has(depId)) {
        return {
          valid: false,
          error: `Task ${task.id} has missing dependency: ${depId}`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Initialize task states from task definitions
 */
export function initializeTaskStates(tasks: DAGTask[]): TaskState[] {
  return tasks.map((task) => ({
    ...task,
    status: "pending" as TaskStatus,
    startTime: undefined,
  }));
}
