import '../../../assets/scss/_header.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import logo from '../../../assets/img/svg/logo.svg';
import basket from '../../../assets/img/svg/basket.svg';
import ListCreator from '../../util/list-creator';
import LinkCreator from '../../util/link-creator';
import { LinkParams } from '../../util/types';
import Router from '../../router/router';
import { Pages } from '../../router/pages';

export default class HeaderView extends View {
  private router: Router;

  private navigationLinksParams = [
    {
      classNames: ['header__nav-link', 'active'],
      textContent: 'HOME',
      callback: (): void => {
        this.router.navigate(`${Pages.HOME}`);
      },
    },
    {
      classNames: ['header__nav-link'],
      textContent: 'CATALOG',
      callback: (): void => {
        this.router.navigate(`${Pages.CATALOG}`);
      },
    },
    {
      classNames: ['header__nav-link'],
      textContent: 'ABOUT US',
      callback: (): void => {
        this.router.navigate(`${Pages.ABOUT}`);
      },
    },
  ];

  private linksListParams = [
    {
      classNames: ['header__links-link', 'underline'],
      textContent: 'login',
      callback: (): void => {
        this.router.navigate(`${Pages.LOGIN}`);
      },
    },
    {
      classNames: ['header__links-link', 'underline'],
      textContent: 'register',
      callback: (): void => {
        this.router.navigate(`${Pages.REGISTRATION}`);
      },
    },
    {
      classNames: ['header__links-link'],
      // attributes: { href: '/' },
      callback: (): void => {
        this.router.navigate(`${Pages.CART}`);
      },
      imageData: {
        imageClassNames: 'img-full',
        containerClassNames: 'header__basket-img',
        src: basket,
        alt: 'Basket',
      },
    },
  ];

  constructor(router: Router) {
    const params = {
      tag: 'header',
      classNames: ['header'],
    };
    super(params);
    this.router = router;
    this.configureView();
  }

  private configureView(): void {
    const headerLogoElement = this.createHeaderLogo();
    const headerNavMenu = this.createHeaderMenu();
    const headerLinkList = this.createLinkList();

    const headerContentContainer = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['header__content'],
    });
    const headerContainer = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['container'],
    });

    headerContentContainer.addInnerElements([headerNavMenu, headerLinkList]);
    headerContainer.addInnerElements([headerLogoElement, headerContentContainer]);

    this.viewElementCreator.addInnerElements([headerContainer]);
  }

  private createHeaderMenu(): HTMLDivElement {
    const headerMenuCreator = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['header__menu'],
    });
    const headerMenu = headerMenuCreator.getElement();
    headerMenu.innerHTML = `<input class="header__nav-toggle" type="checkbox" id="nav-toggle">
     <label class="header__nav-button" for="nav-toggle">
       <span class="header__nav-ico"></span>
      </label>
      <div class="header__nav-background"></div>`;
    const navigationMenuElement = this.createNavigationMenu();
    headerMenu.appendChild(navigationMenuElement);
    return headerMenu;
  }

  private createNavigationMenu(): HTMLDivElement {
    const navigationMenuElement = new ElementCreator<HTMLDivElement>({
      tag: 'nav',
      classNames: ['header__nav'],
    });

    const navigationLinksParamsElements = this.createLinks(this.navigationLinksParams);

    const navigationList = new ListCreator({
      listItems: navigationLinksParamsElements,
      listClass: ['header__nav-list'],
      itemClass: ['header__nav-item'],
    });

    navigationMenuElement.addInnerElements([navigationList.getHtmlElement()]);

    return navigationMenuElement.getElement();
  }

  private createLinks(linksParams: LinkParams[]): HTMLAnchorElement[] {
    const linksElements: HTMLAnchorElement[] = [];

    linksParams.forEach((link) => {
      const newLinkCreator = new LinkCreator(link);
      linksElements.push(newLinkCreator.getElement());
    });

    return linksElements;
  }

  private createHeaderLogo(): HTMLElement {
    const headerLogoCreator = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['header__logo'],
    });

    const headerLogoElement = headerLogoCreator.getElement();
    headerLogoElement.innerHTML = `<div class="header__logo-img">
      <img class="img-full" src=${logo} alt="logo">
      </div>
      <div class="header__logo-text">Holy Grail</div>`;

    return headerLogoElement;
  }

  private createLinkList(): HTMLUListElement {
    const linkListElements = this.createLinks(this.linksListParams);

    const linkListCreator = new ListCreator({
      listItems: linkListElements,
      listClass: ['header__links-list'],
      itemClass: ['header__links-item'],
    });

    return linkListCreator.getHtmlElement();
  }
}
