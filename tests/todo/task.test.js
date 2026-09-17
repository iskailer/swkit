import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createTask,
  completeTask,
  TaskOrigin,
} from '../../src/tools/todo/domain/task.js';

test('creates a valid task', () => {
  const task = createTask({
    id: 'task-1',
    text: 'Validar problema',
    now: '2026-09-17T00:00:00.000Z',
  });

  assert.equal(task._id, 'task-1');

  assert.equal(
    task.type,
    'todo-task'
  );

  assert.equal(
    task.origin,
    TaskOrigin.USER
  );

  assert.equal(
    task.text,
    'Validar problema'
  );

  assert.equal(
    task.completed,
    false
  );

  assert.equal(
    task.createdAt,
    '2026-09-17T00:00:00.000Z'
  );
});

test('trims task text', () => {
  const task = createTask({
    id: 'task-1',
    text: '  Validar problema  ',
  });

  assert.equal(
    task.text,
    'Validar problema'
  );
});

test('rejects empty task text', () => {
  assert.throws(
    () => createTask({
      text: '   ',
    }),
    {
      name: 'TypeError',
    }
  );
});

test('rejects invalid task origin', () => {
  assert.throws(
    () => createTask({
      text: 'Validar problema',
      origin: 'invalid',
    }),
    {
      name: 'TypeError',
    }
  );
});

test('toggles task completion', () => {
  const task = createTask({
    id: 'task-1',
    text: 'Validar problema',
    now: '2026-09-17T00:00:00.000Z',
  });

  const completed = completeTask(
    task,
    '2026-09-17T00:01:00.000Z'
  );

  assert.equal(
    completed.completed,
    true
  );

  assert.equal(
    completed.updatedAt,
    '2026-09-17T00:01:00.000Z'
  );

  const reopened = completeTask(
    completed,
    '2026-09-17T00:02:00.000Z'
  );

  assert.equal(
    reopened.completed,
    false
  );
});