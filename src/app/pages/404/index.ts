import number4 from '../../../assets/img/svg/4.svg';
import wheel from '../../../assets/img/svg/wheel.svg';
import '../../../assets/scss/page/not-found.scss';

class NotFound {
  render(): void {
    const main = document.querySelector('.main');
    if (main) {
      main.className = 'main';
      main.classList.add('not-found-page');
      main.innerHTML = `<div class="container">
      <div class="not-found__logo">
          <div class="not-found__logo-el">
              <img class="img-full" src="${number4}" alt="">
          </div>
          <div class="not-found__logo-el not-found__logo-wheel">
              <img class="img-full" src="${wheel}" alt="">
          </div>
          <div class="not-found__logo-el">
              <img class="img-full" src="${number4}" alt="">
          </div>
      </div>
      <div class="not-found__info">Page not found return</div>
    </div>`;
    }
  }
}

export default NotFound;
