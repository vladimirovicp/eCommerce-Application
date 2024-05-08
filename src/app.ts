import FooterView from './app/components/footer/footer';
import './assets/scss/_global.scss';
// import NotFound from './app/pages/404/NotFound';
import HeaderView from './app/components/header/header';
import Home from './app/pages/home';

class App {
  constructor() {
    this.createView();
  }

  private createView(): void {
    const header = new HeaderView().getHtmlElement();
    const main = new Home().getHtmlElement();
    const footer = new FooterView().getHtmlElement();

    document.body.append(header, main, footer);
  }
}

// eslint-disable-next-line
const app = new App();

// const notFound = new NotFound();
// notFound.render();
