import { ensureSeedTasks } from '../application/seed-tasks.js';

import {
  TaskManagementService,
} from '../application/task-management-service.js';

import {
  createPouchDbTaskRepository,
} from '../infrastructure/pouchdb-task-repository.js';

import { renderToolFooter } from '../../shared/presentation/tool-footer.js';

export async function renderTodo(root, goHome, collaborators = []) {
  const page = document.createElement('section');

  page.className = 'todo-page';

  root.replaceChildren(page);

  const repository = await createPouchDbTaskRepository();

  const service = new TaskManagementService(repository);

  await ensureSeedTasks(repository);

  page.innerHTML = `
    <header class="todo-topbar">
      <button
        class="back-link"
        type="button">
        ← Ferramentas
      </button>

      <p class="eyebrow">
        SW
      </p>

      <h1>
        Todo List
      </h1>

      <p class="todo-description">
        Organize as tarefas da equipe e acompanhe
        o que já foi concluído durante o SW.
      </p>
    </header>

    <main class="todo-content">

      <form class="todo-form">

        <md-outlined-text-field
          class="todo-input"
          label="Nova tarefa"
          placeholder="Digite uma nova tarefa"
          maxlength="200">
        </md-outlined-text-field>

        <md-filled-button
          class="todo-add-button"
          type="submit">
          Adicionar
        </md-filled-button>

      </form>

      <p
        class="todo-error"
        aria-live="polite">
      </p>

      <section
        class="todo-list"
        aria-label="Lista de tarefas">
      </section>

      <p
        class="todo-empty"
        hidden>
        Nenhuma tarefa cadastrada.
      </p>

    </main>
  `;

  const form = page.querySelector('.todo-form');

  const input = page.querySelector('.todo-input');

  const list = page.querySelector('.todo-list');

  const error = page.querySelector('.todo-error');

  const empty = page.querySelector('.todo-empty');

  page
    .querySelector('.back-link')
    .addEventListener('click', goHome);

  function renderTask(task) {
    const item = document.createElement('article');

    item.className = 'todo-item';

    if (task.completed) {
      item.classList.add('todo-item--completed');
    }

    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';

    checkbox.className = 'todo-item__checkbox';

    checkbox.checked = task.completed;

    checkbox.setAttribute(
      'aria-label',
      task.completed
        ? `Desmarcar tarefa: ${task.text}`
        : `Marcar tarefa como concluída: ${task.text}`
    );

    const text = document.createElement('span');

    text.className = 'todo-item__text';

    text.textContent = task.text;

    const removeButton = document.createElement(
      'md-text-button'
    );

    removeButton.className = 'todo-item__delete';

    removeButton.textContent = 'Excluir';

    checkbox.addEventListener(
      'change',
      async () => {
        checkbox.disabled = true;

        try {
          await service.toggleCompleted(task._id);

          await renderList();
        } catch (currentError) {
          checkbox.disabled = false;

          console.error(
            'Não foi possível atualizar a tarefa.',
            currentError
          );
        }
      }
    );

    removeButton.addEventListener(
      'click',
      async () => {
        removeButton.disabled = true;

        try {
          await service.deleteTask(task._id);

          await renderList();
        } catch (currentError) {
          removeButton.disabled = false;

          console.error(
            'Não foi possível excluir a tarefa.',
            currentError
          );
        }
      }
    );

    const content = document.createElement('div');

    content.className = 'todo-item__content';

    content.append(text);

    item.append(
      checkbox,
      content,
      removeButton
    );

    return item;
  }

  async function renderList() {
    const tasks = await service.listTasks();

    list.replaceChildren();

    if (!tasks.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;

    tasks.forEach((task) => {
      list.append(renderTask(task));
    });
  }

  form.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      error.textContent = '';

      const result = await service.create(input.value);

      if (result.error) {
        error.textContent = result.error;
        input.focus();
        return;
      }

      input.value = '';

      await renderList();

      input.focus();
    }
  );

  await renderList();

  page.append(
    renderToolFooter({
      collaborators,
    })
  );
}