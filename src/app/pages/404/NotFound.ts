import number4 from '../../../assets/img/svg/4.svg';
import wheel from '../../../assets/img/svg/wheel.svg';
import '../../../assets/scss/page/not-found.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

const ImageSrc = {
  NUMBER_4: `${number4}`,
  WHEEL: `${wheel}`,
};

const ScssStyles = {
  CONTAINER: 'container',
  LOGO: 'not-found__logo',
  LOGO_ELEMENT: 'not-found__logo-el',
  LOGO_WHEEL: 'not-found__logo-wheel',
  LOGO_INFO: 'not-found__info',
};

const NOT_FOUND_TEXT = 'Page is not found';

export default class NotFound extends View {
  constructor() {
    const params = {
      tag: 'div',
      classNames: [ScssStyles.CONTAINER],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    this.viewElementCreator.addInnerElements([this.createNotFoundLogo(), this.createText()]);
  }

  private createNotFoundLogo(): ElementCreator {
    const notFoundLogo = new ElementCreator({
      tag: 'div',
      classNames: [ScssStyles.LOGO],
    });
    const firstLogoNumber = this.createLogoElement([ScssStyles.LOGO_ELEMENT], ImageSrc.NUMBER_4);
    const secondLogoNumber = this.createLogoElement([ScssStyles.LOGO_ELEMENT], ImageSrc.NUMBER_4);
    const logoWheel = this.createLogoElement([ScssStyles.LOGO_ELEMENT, ScssStyles.LOGO_WHEEL], ImageSrc.WHEEL);
    notFoundLogo.addInnerElements([firstLogoNumber, logoWheel, secondLogoNumber]);
    return notFoundLogo;
  }

  private createLogoElement(classes: Array<string>, source: string): ElementCreator {
    const logoElement = new ElementCreator({
      tag: 'div',
      classNames: classes,
    });
    logoElement.addInnerElements([
      new ElementCreator({
        tag: 'img',
        classNames: ['img-full'],
        attributes: {
          src: source,
          alt: '',
        },
      }),
    ]);
    return logoElement;
  }

  private createText(): ElementCreator {
    const info = new ElementCreator({
      tag: 'div',
      classNames: [ScssStyles.LOGO_INFO],
      textContent: NOT_FOUND_TEXT,
    });
    return info;
  }
}
