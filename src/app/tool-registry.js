export const tools = Object.freeze([
  {
    id: 'timer',
    name: 'Timer',
    description: 'Cronômetro para conduzir momentos importantes.',
    route: '/timer',
    icon: '◷',
    tileClass: 'tool-tile--timer',
    collaborators: ['Iskailer I. Rodrigues'],
  },
  {
    id: 'duvido',
    name: 'Duvido que validou!',
    description: 'Jogo de perguntas para energizar o grupo.',
    route: '/duvido',
    icon: '?',
    tileClass: 'tool-tile--duvido',
    collaborators: ['Iskailer I. Rodrigues'],
  },
  {
    id: 'todo',
    name: 'Todo List',
    description: 'Lista de tarefas para organizar a equipe.',
    route: '/todo',
    icon: '✓',
    tileClass: 'tool-tile--todo',
    collaborators: ['Iskailer I. Rodrigues'],
  },
]);

export function findToolByRoute(route) {
  return tools.find((tool) => tool.route === route);
}