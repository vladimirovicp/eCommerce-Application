import FooterView from './app/components/footer/footer';
import './assets/scss/_global.scss';

class App {
  constructor() {
    this.createView();
  }

  private createView(): void {
    // const headerView = new HeaderView();
    // const mainView = new MainView();
    const footer = new FooterView().getHtmlElement();

    document.body.appendChild(footer);
  }
}

// eslint-disable-next-line
const app = new App();
