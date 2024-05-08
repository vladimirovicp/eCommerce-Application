import { Pages, PRODUCT_ID } from './pages';
import { Route, SearchBarState } from './router-types';

export default class Router {
  routes: Array<Route>;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    document.addEventListener('DOMContentLoaded', () => {
      const path = this.getCurrentPath();
      this.navigate(path);
    });
    window.addEventListener('popstate', this.handlePathChange.bind(this));
    window.addEventListener('hashchange', this.handlePathChange.bind(this));
  }

  navigate(url: string): void {
    const parsedPath = this.parseUrl(url);
    const pathToFind = parsedPath.productId === '' ? parsedPath.path : `${parsedPath.path}/${PRODUCT_ID}`;
    const route = this.routes.find((item) => item.path === pathToFind);
    if (!route) {
      const routeNotFound = this.routes.find((item) => item.path === Pages.NOT_FOUND);
      if (routeNotFound) {
        this.navigate(routeNotFound.path);
      }
      return;
    }
    route.callback(parsedPath.productId);
  }

  private parseUrl(url: string): SearchBarState {
    const resultPath: SearchBarState = {
      path: '',
    };

    const parsedPath = url.split('/');
    if (parsedPath !== undefined) {
      [resultPath.path = '', resultPath.productId = ''] = parsedPath;
    }
    return resultPath;
  }

  private getCurrentPath(): string {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname.slice(1);
  }

  private handlePathChange(): void {
    this.navigate(this.getCurrentPath());
  }
}
