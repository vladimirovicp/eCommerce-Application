import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import heroBgImg from '../../../assets/img/home-background-min.png';
import '../../../assets/scss/page/home.scss';
import './index.scss';

const imageSrc = {
  HERO_BG_IMG: `${heroBgImg}`,
};

class Home extends View {
  constructor() {
    const params = {
      tag: 'section',
      classNames: ['hero'],
    };
    super(params);
    this.setContent();
  }

  public setContent(): void {
    this.viewElementCreator.addInnerElements([this.createHeroBg(), this.createHeroContainer()]);
  }

  private createHeroBg(): ElementCreator<HTMLElement> {
    const heroBg = new ElementCreator({
      tag: 'div',
      classNames: ['hero__bg'],
    });

    const heroBGImg = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: imageSrc.HERO_BG_IMG,
        alt: 'hero',
      },
    });
    heroBg.addInnerElements([heroBGImg]);
    return heroBg;
  }

  private createHeroContainer(): ElementCreator<HTMLElement> {
    const container = new ElementCreator({
      classNames: ['container'],
    });
    const heroTitle = new ElementCreator({
      classNames: ['hero__title'],
    });
    const heroHeader = new ElementCreator({
      classNames: ['hero__title-header'],
      textContent: 'Welcome to Holy Grail',
    });
    const constheroSubheader = new ElementCreator({
      classNames: ['hero__title-subheader'],
      textContent: 'Bikes and Electric Bikes',
    });

    const codeText = new ElementCreator({
      classNames: ['hero__title-code'],
      textContent: 'Apply promo code',
    });
    const codePromo = new ElementCreator({
      tag: 'span',
      classNames: ['promo-code'],
      textContent: 'APOLLO5',
    });
    const codeTextEnd = new ElementCreator({
      tag: 'span',
      textContent: 'to receive an extra 5% discount for all Apollo bikes.',
    });
    const code2Text = new ElementCreator({
      classNames: ['hero__title-code'],
      textContent: 'Apply promo code',
    });
    code2Text.getElement().innerHTML =
      'To receive a 3% discount on any electric bike, use the promocode<span class="promo-code">SUMMER</span>';
    codeText.addInnerElements([codePromo, codeTextEnd]);
    heroTitle.addInnerElements([heroHeader, constheroSubheader, codeText, code2Text]);
    container.addInnerElements([heroTitle]);
    return container;
  }
}

export default Home;
