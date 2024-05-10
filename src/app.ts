import './assets/scss/_global.scss';
import HeaderView from './app/components/header/header';
import MainView from './app/components/main/main';
import FooterView from './app/components/footer/footer';
import Router from './app/router/router';
import { Pages } from './app/router/pages';
import { Route } from './app/router/router-types';
import NotFoundPage from './app/pages/not-found/not-found';
import HomePage from './app/pages/home';
import CatalogPage from './app/pages/catalog/catalog';
import AboutPage from './app/pages/about/about';
import LoginPage from './app/pages/login';
import RegistrationPage from './app/pages/registration/registration';
import ProfilePage from './app/pages/profile/profile';
import CartPage from './app/pages/cart/cart';
import View from './app/common/view';

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

  /* eslint-disable max-lines-per-function */
  private createRoutes(): Array<Route> {
    return [
      {
        path: `${Pages.NOT_FOUND}`,
        callback: (): void => {
          this.updateMain(new NotFoundPage(), 'not-found-page');
        },
      },
      // {
      //   path: '',
      //   callback: (): void => {
      //     this.updateMain(new HomePage(), 'home-page');
      //   },
      // },
      {
        path: '',
        callback: (): void => {
          this.updateMain(new RegistrationPage(), 'register-page');
        },
      },
      {
        path: `${Pages.HOME}`,
        callback: (): void => {
          this.updateMain(new HomePage(), 'home-page');
        },
      },
      {
        path: `${Pages.CATALOG}`,
        callback: (): void => {
          this.updateMain(new CatalogPage(), 'not-found-page');
        },
      },
      {
        path: `${Pages.ABOUT}`,
        callback: (): void => {
          this.updateMain(new AboutPage(), 'not-found-page');
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: (): void => {
          this.updateMain(new LoginPage(), 'not-found-page');
        },
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: (): void => {
          this.updateMain(new RegistrationPage(), 'register-page');
        },
      },
      {
        path: `${Pages.PROFILE}`,
        callback: (): void => {
          this.updateMain(new ProfilePage(), 'not-found-page');
        },
      },
      {
        path: `${Pages.CART}`,
        callback: (): void => {
          this.updateMain(new CartPage(), 'not-found-page');
        },
      },
    ];
  }

  updateMain(page: View, scssClass?: string): void {
    if (scssClass) {
      this.main.updateStyleClasses(scssClass);
    }
    this.main.setContent(page);
  }
}

// eslint-disable-next-line
const app = new App();
