export const tools = Object.freeze([
  {
    id: 'timer',
    name: 'Timer',
    description: 'Cronômetro para conduzir momentos importantes.',
    route: '/timer',
    icon: '◷',
    tileClass: 'tool-tile--timer',
  },
  {
    id: 'duvido',
    name: 'Duvido que validou!',
    description: 'Jogo de perguntas para energizar o grupo.',
    route: '/duvido',
    icon: '?',
    tileClass: 'tool-tile--duvido',
  },
]);

export function findToolByRoute(route) {
  return tools.find((tool) => tool.route === route);
}
