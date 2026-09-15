import { appConfig } from './config/app-config.js';

function normalizeRoute(pathname) {
  const base = appConfig.basePath.replace(/\/$/, '');
  const route = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return route === '' || route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}`;
}

function routeFromHash() {
  const hash = window.location.hash.slice(1);
  return hash ? normalizeRoute(hash) : normalizeRoute(window.location.pathname);
}

export class Router {
  constructor({ onRouteChange }) {
    this.onRouteChange = onRouteChange;
    window.addEventListener('popstate', () => this.renderCurrentRoute());
    window.addEventListener('hashchange', () => this.renderCurrentRoute());
  }

  navigate(route) {
    const routeFragment = route === '/' ? '' : route;
    window.location.hash = routeFragment;
    if (!routeFragment) this.renderCurrentRoute();
  }

  renderCurrentRoute() {
    this.onRouteChange(routeFromHash());
  }
}
