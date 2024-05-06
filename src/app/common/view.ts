abstract class View {
  public app: HTMLElement;

  constructor() {
    this.app = document.querySelector('body') as HTMLElement;
  }

  render(): void {}
}

export default View;
