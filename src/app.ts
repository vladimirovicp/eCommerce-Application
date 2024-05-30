import './assets/scss/_global.scss';
import HeaderView from './app/components/header/header';
import MainView from './app/components/main/main';
import FooterView from './app/components/footer/footer';
import Router from './app/router/router';
import { Pages } from './app/router/pages';
import { Route } from './app/router/router-types';
import NotFoundPage from './app/pages/not-found';
import HomePage from './app/pages/home';
import CatalogPage from './app/pages/catalog';
import AboutPage from './app/pages/about';
import LoginPage from './app/pages/login';
import RegistrationPage from './app/pages/registration';
import ProfilePage from './app/pages/profile';
import CartPage from './app/pages/cart';
import View from './app/common/view';
import SecondaryMenu from './app/components/secondary-menu';
import { createApiRootRefreshTokenFlow } from './app/api/build-client';
import customerService from './app/api/customers-requests';

class App {
  private header: HeaderView;

  private main: MainView;

  private router: Router;

  private secondaryMenu: SecondaryMenu;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);

    this.header = new HeaderView(this.router);
    this.secondaryMenu = new SecondaryMenu();
    this.main = new MainView();
    const token = localStorage.getItem('refresh_token');
    if (token) {
      console.log('ffffffff');
      customerService.apiRootRefreshToken = createApiRootRefreshTokenFlow(token);
      this.header.isLoggedIn();
    }
    this.createView();
  }

  private createView(): void {
    const footer = new FooterView().getHtmlElement();
    document.body.append(
      this.header.getHtmlElement(),
      this.secondaryMenu.getHtmlElement(),
      this.main.getHtmlElement(),
      footer
    );
  }

  /* eslint-disable max-lines-per-function */
  private createRoutes(): Array<Route> {
    return [
      {
        path: `${Pages.NOT_FOUND}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new NotFoundPage(), 'not-found-page');
        },
      },
      {
        path: '',
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new HomePage(), 'home-page');
        },
      },
      {
        path: `${Pages.HOME}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new HomePage(), 'home-page');
        },
      },
      {
        path: 'main',
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new HomePage(), 'home-page');
        },
      },
      {
        path: `${Pages.CATALOG}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new CatalogPage(this.secondaryMenu), 'catalog-page');
        },
      },
      /* {
        path: `${Pages.CATALOG}/${PRODUCT_ID}`,
        callback: (id?: string): void => {},
      }, */
      {
        path: `${Pages.ABOUT}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new AboutPage(), 'not-found-page');
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          if (localStorage.userId === undefined) {
            this.updateMain(new LoginPage(this.router, this.header), 'login-page');
          } else {
            this.updateMain(new HomePage(), 'home-page');
            this.header.isLoggedIn();
          }
        },
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          if (localStorage.userId === undefined) {
            this.updateMain(new RegistrationPage(this.router, this.header), 'register-page');
          } else {
            this.updateMain(new HomePage(), 'home-page');
            this.header.isLoggedIn();
          }
        },
      },
      {
        path: `${Pages.PROFILE}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
          this.updateMain(new ProfilePage(), 'account-page');
        },
      },
      {
        path: `${Pages.CART}`,
        callback: (): void => {
          this.secondaryMenu.updateContent();
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
