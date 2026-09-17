export const TaskOrigin = Object.freeze({
  SEED: 'seed',
  USER: 'user',
});

export const TASK_TYPE = 'todo-task';

function generateTaskId() {
  if (globalThis.crypto?.randomUUID) {
    return `todo-task-${globalThis.crypto.randomUUID()}`;
  }

  return `todo-task-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function createTask({
  id,
  text,
  origin = TaskOrigin.USER,
  completed = false,
  now = new Date().toISOString(),
} = {}) {
  const normalizedText = String(text ?? '').trim();

  if (!normalizedText) {
    throw new TypeError('O texto da tarefa é obrigatório.');
  }

  if (!Object.values(TaskOrigin).includes(origin)) {
    throw new TypeError('A origem da tarefa é inválida.');
  }

  return {
    _id: id ?? generateTaskId(),
    type: TASK_TYPE,
    origin,
    text: normalizedText,
    completed: Boolean(completed),
    createdAt: now,
    updatedAt: now,
  };
}

export function completeTask(task, now = new Date().toISOString()) {
  return {
    ...task,
    completed: !task.completed,
    updatedAt: now,
  };
}