import FooterView from './app/components/footer/footer';
import './assets/scss/_global.scss';
// import NotFound from './app/pages/404/NotFound';
import HeaderView from './app/components/header/header';

class App {
  constructor() {
    this.createView();
  }

  private createView(): void {
    const header = new HeaderView().getHtmlElement();
    // const mainView = new MainView();
    const footer = new FooterView().getHtmlElement();

    document.body.append(header, footer);
  }
}

// eslint-disable-next-line
const app = new App();

// const notFound = new NotFound();
// notFound.render();
