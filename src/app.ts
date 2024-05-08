import './assets/scss/_global.scss';
import HeaderView from './app/components/header/header';
import MainView from './app/components/main/main';
import FooterView from './app/components/footer/footer';
import Router from './app/router/router';
import { Pages } from './app/router/pages';
import { Route } from './app/router/router-types';
import NotFound from './app/pages/404/NotFound';
import Home from './app/pages/home/home';

class App {
  private header: HeaderView;

  private main: MainView;

  private router: Router;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);

    this.header = new HeaderView(this.router);
    this.main = new MainView();
    this.createView();
  }

  private createView(): void {
    const footer = new FooterView().getHtmlElement();
    document.body.append(this.header.getHtmlElement(), this.main.getHtmlElement(), footer);
  }

  private createRoutes(): Array<Route> {
    return [
      {
        path: `${Pages.NOT_FOUND}`,
        callback: (): void => {
          this.main.updateStyleClasses('not-found-page');
          this.main.setContent(new NotFound());
        },
      },
      {
        path: '',
        callback: (): void => {
          this.main.updateStyleClasses('hero');
          this.main.setContent(new Home());
        },
      },
      {
        path: `${Pages.HOME}`,
        callback: (): void => {
          this.main.updateStyleClasses('hero');
          this.main.setContent(new Home());
        },
      },
    ];
  }
}

// eslint-disable-next-line
const app = new App();

/* 
      {
        path: `${Pages.LOGIN}`,
        callback: () => {},
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: () => {},
      },
      {
        path: `${Pages.CATALOGUE}`,
        callback: () => {},
      },
      {
        path: `${Pages.PROFILE}`,
        callback: () => {},
      },
      {
        path: `${Pages.ABOUT}`,
        callback: () => {},
      },
      {
        path: `${Pages.CART}`,
        callback: () => {},
}, */
