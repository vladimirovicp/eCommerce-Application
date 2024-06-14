import '../../../assets/scss/page/about.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

export default class AboutPage extends View {
  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.setContent();
  }

  private setContent(): void {
    const aboutWrapper = this.infoGeneral();

    this.viewElementCreator.addInnerElements([aboutWrapper]);
  }

  private infoGeneral(): ElementCreator<HTMLElement> {
    const aboutWrapper = new ElementCreator({
      classNames: ['about-wrapper'],
    });

    const aboutLogoData = this.aboutLogo();
    const aboutInfoData = this.aboutInfo();
    const aboutLogoRSData = this.aboutLogoRS();

    aboutWrapper.addInnerElements([aboutLogoData, aboutInfoData, aboutLogoRSData]);

    return aboutWrapper;
  }

  private aboutLogo(): ElementCreator<HTMLElement> {
    const aboutLogo = new ElementCreator({
      classNames: ['about__logo'],
    });

    const aboutLogoLink = new ElementCreator({
      tag: 'a',
      classNames: ['about__logo-link'],
      attributes: { href: '/' },
    });

    const imgLogo = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: './assets/img/svg/logo.svg',
        alt: 'Логотип',
      },
    });

    const logoText = new ElementCreator({
      tag: 'p',
      textContent: 'Holy Grail',
    });

    aboutLogoLink.addInnerElements([imgLogo]);
    aboutLogo.addInnerElements([aboutLogoLink, logoText]);
    return aboutLogo;
  }

  private aboutInfo(): ElementCreator<HTMLElement> {
    const aboutInfo = new ElementCreator({
      classNames: ['about__info'],
    });

    const title = new ElementCreator({
      textContent: 'About the project',
      classNames: ['title'],
    });

    const text = new ElementCreator({
      classNames: ['text'],
      textContent: `Holy Grail is created as a final studying assignment for the RSSchool JS/Front-end course, completed by asimo-git, vladimirovicp, and svorokhobina.`,
    });

    const text2 = new ElementCreator({
      classNames: ['text'],
      textContent: `The project's primary purpose is to design a detailed, true-to-life imitation of real e-commerce applications, where visitors could quickly and effortlessly browse, select, and order preferred products from the available range. Among the implemented features, the application includes customer registration and authorisation forms and a shop catalogue with filtering, sorting, and searching functions. Customers are able to view the detailed item descriptions or move to the product pages for more information, add the chosen items to the cart, and proceed to checkout to finalise their orders. The application is designed using Commercetools, one of the leading cloud-based commerce platforms.`,
    });

    aboutInfo.addInnerElements([title, text, text2]);

    return aboutInfo;
  }

  private aboutLogoRS(): ElementCreator<HTMLElement> {
    const aboutLogoRS = new ElementCreator({
      classNames: ['about__logo-rs'],
    });

    const logoRsLink = new ElementCreator({
      tag: 'a',
      classNames: ['logo-rs__link'],
      attributes: { href: 'https://rs.school/courses/javascript-ru' },
    });

    const imgLogoRS = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: './assets/img/svg/rs.svg',
        alt: 'logo rs',
      },
    });

    logoRsLink.addInnerElements([imgLogoRS]);
    aboutLogoRS.addInnerElements([logoRsLink]);

    return aboutLogoRS;
  }
}
