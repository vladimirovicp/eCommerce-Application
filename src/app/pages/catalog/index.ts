class Catalog {
  main: HTMLElement | null;

  constructor() {
    this.main = document.body.querySelector('main');
  }

  render(): void {
    if (this.main) {
      this.main.className = 'main';
      this.main.classList.add('not-found-page');
      this.main.innerHTML = `<div class="container">Catalog in progress</div>`;
    }
  }
}

export default Catalog;
