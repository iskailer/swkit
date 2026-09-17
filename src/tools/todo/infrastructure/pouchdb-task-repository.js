import PouchDB from 'pouchdb/dist/pouchdb.js';

import {
  createTask,
  TASK_TYPE,
} from '../domain/task.js';

export class PouchDbTaskRepository {
  constructor(database) {
    this.database = database;
  }

  async create(taskInput) {
    const task = taskInput.type === TASK_TYPE
      ? taskInput
      : createTask(taskInput);

    const result = await this.database.put(task);

    return {
      ...task,
      _rev: result.rev,
    };
  }

  async find(id) {
    try {
      return await this.database.get(id);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }

      throw error;
    }
  }

  async findAll() {
    const result = await this.database.allDocs({
      include_docs: true,
    });

    return result.rows
      .map((row) => row.doc)
      .filter((document) => document?.type === TASK_TYPE)
      .sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }

  async update(id, changes) {
    const current = await this.find(id);

    if (!current) {
      return null;
    }

    const updated = {
      ...current,
      ...changes,
      _id: id,
      _rev: current._rev,
      updatedAt: new Date().toISOString(),
    };

    const result = await this.database.put(updated);

    return {
      ...updated,
      _rev: result.rev,
    };
  }

  async toggleCompleted(id) {
    const current = await this.find(id);

    if (!current) {
      return null;
    }

    return this.update(id, {
      completed: !current.completed,
    });
  }

  async delete(id) {
    const current = await this.find(id);

    if (!current) {
      return null;
    }

    return this.database.remove(current);
  }
}

export async function createPouchDbTaskRepository(
  PouchDBConstructor = PouchDB,
  databaseName = 's-w-todo'
) {
  return new PouchDbTaskRepository(
    new PouchDBConstructor(databaseName)
  );
}