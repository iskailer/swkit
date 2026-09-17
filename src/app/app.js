import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/switch/switch.js';
import '@material/web/textfield/outlined-text-field.js';
import { Router } from './router.js';
import { findToolByRoute, tools } from './tool-registry.js';
import { renderHome } from '../tools/home/presentation/home-view.js';
import { renderToolPlaceholder } from '../tools/shared/presentation/tool-placeholder-view.js';
import { renderTimer } from '../tools/timer/presentation/timer-view.js';
import { renderDuvido } from '../tools/duvido/presentation/duvido-view.js';
import { renderCardManager } from '../tools/duvido/presentation/card-manager-view.js';
import { renderTodo } from '../tools/todo/presentation/todo-view.js';

const root = document.querySelector('#app');

function render(route) {
  root.replaceChildren();
  if (route === '/') {
    renderHome(
      root,
      tools,
      (destination) => router.navigate(destination)
    );
  } else if (route === '/timer') {
    const timerTool = findToolByRoute('/timer');
    renderTimer(
      root,
      () => router.navigate('/'),
      timerTool?.collaborators ?? []
    );
  } else if (route === '/duvido') {
    const duvidoTool = findToolByRoute('/duvido');
    renderDuvido(
      root,
      () => router.navigate('/'),
      () => router.navigate('/duvido/cards'),
      duvidoTool?.collaborators ?? []
    );
  } else if (route === '/duvido/cards') {
    renderCardManager(
      root,
      () => router.navigate('/duvido')
    );
  } else if (route === '/todo') {
    const todoTool = findToolByRoute('/todo');
    renderTodo(
      root,
      () => router.navigate('/'),
      todoTool?.collaborators ?? []
    );
  } else {
    renderToolPlaceholder(
      root,
      findToolByRoute(route),
      () => router.navigate('/')
    );
  }

  root.focus();
}

const router = new Router({
  onRouteChange: render,
});

router.renderCurrentRoute();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}