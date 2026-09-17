import {
  createTask,
  TaskOrigin,
} from '../domain/task.js';

export const seedTasks = Object.freeze([
  [
    'todo-seed-1',
    'Definir a equipe organizadora e os responsáveis por cada frente',
  ],
  [
    'todo-seed-2',
    'Confirmar local, estrutura e recursos necessários para o evento',
  ],
  [
    'todo-seed-3',
    'Divulgar o evento e acompanhar as inscrições dos participantes',
  ],
  [
    'todo-seed-4',
    'Confirmar mentores, facilitadores, jurados e convidados',
  ],
  [
    'todo-seed-5',
    'Preparar materiais, sinalização, crachás e itens de apoio',
  ],

  [
    'todo-seed-6',
    'Realizar o credenciamento e orientar os participantes na chegada',
  ],
  [
    'todo-seed-7',
    'Apresentar a programação, regras e dinâmica do evento',
  ],
  [
    'todo-seed-8',
    'Acompanhar a formação das equipes e o desenvolvimento das ideias',
  ],
  [
    'todo-seed-9',
    'Organizar mentorias, checkpoints e apoio às equipes',
  ],
  [
    'todo-seed-10',
    'Garantir o cumprimento da programação e apoiar os facilitadores',
  ],
  [
    'todo-seed-11',
    'Organizar a apresentação final, avaliação e momento de premiação',
  ],

  [
    'todo-seed-12',
    'Registrar fotos, vídeos e principais momentos do evento',
  ],
  [
    'todo-seed-13',
    'Recolher materiais, organizar o espaço e finalizar a operação',
  ],
  [
    'todo-seed-14',
    'Enviar agradecimentos aos participantes, mentores, jurados e parceiros',
  ],
  [
    'todo-seed-15',
    'Realizar retrospectiva da organização e registrar aprendizados para o próximo evento',
  ],
].map(([id, text]) =>
  createTask({
    id,
    origin: TaskOrigin.SEED,
    text,
    now: '2026-09-17T00:00:00.000Z',
  })
));

export async function ensureSeedTasks(
  repository,
  tasks = seedTasks
) {
  const created = [];

  for (const task of tasks) {
    const existing = await repository.find(task._id);

    if (!existing) {
      await repository.create(task);
      created.push(task._id);
    }
  }

  return created;
}