import '../../assets/scss/_secondary-menu.scss';
import View from '../common/view';
import { Pages } from '../router/pages';
import Router from '../router/router';
import ElementCreator from '../util/element-creator';

export default class SecondaryMenu extends View {
  private container: ElementCreator<HTMLDivElement>;

  private breadcrumbs: ElementCreator<HTMLDivElement>;

  private router: Router;

  constructor(router: Router) {
    const params = {
      classNames: ['secondary-menu'],
    };
    super(params);
    this.container = new ElementCreator<HTMLDivElement>({ classNames: ['container'] });
    this.breadcrumbs = new ElementCreator<HTMLDivElement>({
      classNames: ['secondary-menu__breadcrumbs'],
      textContent: 'Home',
    });
    this.router = router;
    this.setContent();
  }

  private setContent(): void {
    this.container.addInnerElements([this.breadcrumbs]);
    this.viewElementCreator.addInnerElements([this.container]);
  }

  public updateContent(links: string[], updatePage = true): void {
    if (updatePage) {
      this.container.getElement().innerHTML = '';
      this.container.addInnerElements([this.breadcrumbs]);
    }
    this.breadcrumbs.getElement().innerHTML = '';

    const homeLink = new ElementCreator<HTMLSpanElement>({
      tag: 'span',
      textContent: 'Home',
      callback: (): void => {
        this.router.navigate(`${Pages.HOME}`);
      },
    });
    homeLink.getElement().style.cursor = 'pointer';
    this.breadcrumbs.addInnerElements([homeLink]);

    links.forEach((link, index, arr) => {
      let callback;
      if (index === 0 && arr.length === 3) {
        callback = (): void => this.router.navigate(`${Pages.CATALOG}`);
      } else if (index === 1 && arr.length === 3) {
        // вот в этом случае надо как-то открыть каталог на нужной категории
        callback = (): void => this.router.navigate(`${Pages.CATALOG}`);
      }

      const element = new ElementCreator<HTMLSpanElement>({
        tag: 'span',
        textContent: ` /${link}`,
        callback,
      });
      if (callback) element.getElement().style.cursor = 'pointer';
      this.breadcrumbs.addInnerElements([element]);
    });
  }

  public addElement(elements: (HTMLElement | ElementCreator)[]): void {
    this.container.addInnerElements(elements);
  }
}
