import '../../assets/scss/_secondary-menu.scss';
import View from '../common/view';
import ElementCreator from '../util/element-creator';

export default class SecondaryMenu extends View {
  private container: ElementCreator<HTMLDivElement>;

  private breadcrumbs: ElementCreator<HTMLDivElement>;

  constructor() {
    const params = {
      classNames: ['secondary-menu'],
    };
    super(params);
    this.container = new ElementCreator<HTMLDivElement>({ classNames: ['container'] });
    this.breadcrumbs = new ElementCreator<HTMLDivElement>({
      classNames: ['secondary-menu__breadcrumbs'],
      textContent: 'Home',
    });
    this.setContent();
  }

  private setContent(): void {
    this.container.addInnerElements([this.breadcrumbs]);
    this.viewElementCreator.addInnerElements([this.container]);
  }

  public updateContent(): void {
    this.container.getElement().innerHTML = '';
    // контейнер для хлебных крошек, textContent заменить на обновление из истории (роутинга?)
    this.breadcrumbs.getElement().textContent = 'Home/';
    this.container.addInnerElements([this.breadcrumbs]);
  }

  public addElement(elements: (HTMLElement | ElementCreator)[]): void {
    this.container.addInnerElements(elements);
  }
}
