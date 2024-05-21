import '../../../assets/scss/_footer.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import logo from '../../../assets/img/svg/logo.svg';

export default class FooterView extends View {
  constructor() {
    const params = {
      tag: 'footer',
      classNames: ['footer'],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    const logoElement = this.createLogoElement();
    const footerInfo = this.createFooterInfo();

    const footerContainer = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['container'],
    });

    footerContainer.addInnerElements([logoElement, footerInfo]);

    this.viewElementCreator.addInnerElements([footerContainer]);
  }

  private createLogoElement(): ElementCreator<HTMLDivElement> {
    const footerLogoContainer = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['footer__logo'],
    });

    const footerLogo = new ElementCreator<HTMLImageElement>({
      tag: 'img',
      classNames: ['img-full'],
      attributes: { src: logo, alt: 'company`s logo' },
    });
    footerLogoContainer.addInnerElements([footerLogo]);

    return footerLogoContainer;
  }

  private createFooterInfo(): ElementCreator<HTMLDivElement> {
    return new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['footer__info'],
      textContent: '© 2024 Holy Grail',
    });
  }
}
