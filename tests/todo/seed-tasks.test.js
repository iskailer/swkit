import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ensureSeedTasks,
  seedTasks,
} from '../../src/tools/todo/application/seed-tasks.js';

class FakeTaskRepository {
  constructor() {
    this.tasks = new Map();
  }

  async find(id) {
    return this.tasks.get(id) ?? null;
  }

  async create(task) {
    this.tasks.set(task._id, task);
    return task;
  }

  async findAll() {
    return [...this.tasks.values()];
  }
}

test('seed creates all initial tasks', async () => {
  const repository = new FakeTaskRepository();

  const created = await ensureSeedTasks(
    repository
  );

  assert.equal(
    created.length,
    seedTasks.length
  );

  const tasks = await repository.findAll();

  assert.equal(
    tasks.length,
    seedTasks.length
  );
});

test('seed is idempotent', async () => {
  const repository = new FakeTaskRepository();

  const first = await ensureSeedTasks(
    repository
  );

  const second = await ensureSeedTasks(
    repository
  );

  assert.equal(
    first.length,
    seedTasks.length
  );

  assert.equal(
    second.length,
    0
  );

  const tasks = await repository.findAll();

  assert.equal(
    tasks.length,
    seedTasks.length
  );
});

test('seed tasks have seed origin', () => {
  seedTasks.forEach((task) => {
    assert.equal(
      task.origin,
      'seed'
    );

    assert.equal(
      task.type,
      'todo-task'
    );

    assert.equal(
      task.completed,
      false
    );
  });
});