import { createTask } from '../domain/task.js';

export class TaskManagementService {
  constructor(repository) {
    this.repository = repository;
  }

  async listTasks() {
    return this.repository.findAll();
  }

  async create(text) {
    const normalizedText = String(text ?? '').trim();

    if (!normalizedText) {
      return {
        task: null,
        error: 'Informe uma tarefa.',
      };
    }

    const task = createTask({
      text: normalizedText,
    });

    const created = await this.repository.create(task);

    return {
      task: created,
      error: null,
    };
  }

  async toggleCompleted(id) {
    return this.repository.toggleCompleted(id);
  }

  async deleteTask(id) {
    return this.repository.delete(id);
  }
}