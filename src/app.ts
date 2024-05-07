import './assets/scss/_global.scss';
import './assets/scss/_header.scss';
import Home from './app/pages/home';
import Catalog from './app/pages/catalog';
import About from './app/pages/about';
import NotFound from './app/pages/404';
import Login from './app/pages/login';
import Register from './app/pages/register';
import Basket from './app/pages/basket';
import ElementCreator from './app/util/element-creator';
import HeaderView from './app/components/header/header';
import FooterView from './app/components/footer/footer';

class App {
  routes = [
    { path: '', view: Home },
    { path: '#catalog', view: Catalog },
    { path: '#about', view: About },
    { path: '#login', view: Login },
    { path: '#register', view: Register },
    { path: '#basket', view: Basket },
  ];

  constructor() {
    window.addEventListener('hashchange', this.route.bind(this));
    this.createView();
  }

  private createView(): void {
    const header = new HeaderView().getHtmlElement();
    const mainTag = new ElementCreator<HTMLDivElement>({
      tag: 'main',
      classNames: ['main'],
    });
    const footer = new FooterView().getHtmlElement();
    document.body.append(header, mainTag.getElement(), footer);
    this.route();
  }

  route(): void {
    const Page = this.routes.find((r) => r.path === window.location.hash)?.view;
    if (Page) {
      new Page().render();
    } else {
      new NotFound().render();
    }
  }
}

// eslint-disable-next-line
const app = new App();
