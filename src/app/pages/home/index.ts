import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import heroBgImg from '../../../assets/img/home-background-min.png';
import '../../../assets/scss/page/home.scss';

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
      tag: 'div',
      classNames: ['container'],
    });

    const heroTitle = new ElementCreator({
      tag: 'div',
      classNames: ['hero__title'],
    });

    const heroHeader = new ElementCreator({
      tag: 'div',
      classNames: ['hero__title-header'],
      textContent: 'Welcome to Holy Grail',
    });

    const constheroSubheader = new ElementCreator({
      tag: 'div',
      classNames: ['hero__title-subheader'],
      textContent: 'Bikes and Electric Bikes',
    });

    heroTitle.addInnerElements([heroHeader, constheroSubheader]);
    container.addInnerElements([heroTitle]);
    return container;
  }
}

export default Home;
