// import { Pages, PRODUCT_ID } from './pages';
import { Pages } from './pages';
import { PagePath, Route } from './router-types';

export default class Router {
  routes: Array<Route>;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    document.addEventListener('DOMContentLoaded', () => {
      const path = this.getCurrentPath();
      this.navigate(path);
    });
    window.addEventListener('popstate', () => {
      const path = window.location.pathname.slice(1);
      this.navigateOnload(path);
    });
  }

  navigate(path: string): void {
    const parsedPath = this.parseUrl(path);
    const pathToFind =
      parsedPath.productId === undefined ? parsedPath.pageName : `${parsedPath.pageName}/${parsedPath.productId}`;
    const route = this.routes.find((item) => item.path === pathToFind);
    if (route === undefined) {
      const routeNotFound = this.routes.find((item) => item.path === Pages.NOT_FOUND);
      if (routeNotFound !== undefined) {
        routeNotFound.callback();
      }
    } else {
      // route.callback(parsedPath.productId);
      window.history.pushState({}, '', `/${route.path}`);
      route.callback();
    }
  }

  private navigateOnload(path: string): void {
    const route = this.routes.find((item) => item.path === path);
    if (route === undefined) {
      const routeNotFound = this.routes.find((item) => item.path === Pages.NOT_FOUND);
      if (routeNotFound !== undefined) {
        routeNotFound.callback();
      }
    } else {
      route.callback();
    }
  }

  private parseUrl(path: string): PagePath {
    const resultPath: PagePath = {
      pageName: '',
    };
    const parsedPath = path.split('/');
    [resultPath.pageName, resultPath.productId] = parsedPath;
    return resultPath;
  }

  private getCurrentPath(): string {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname.slice(1);
  }
}
