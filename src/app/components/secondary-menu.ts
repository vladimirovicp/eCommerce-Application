import '../../assets/scss/_secondary-menu.scss';
import View from '../common/view';
import ElementCreator from '../util/element-creator';

export default class SecondaryMenu extends View {
  private container: ElementCreator<HTMLDivElement>;

  constructor() {
    const params = {
      classNames: ['secondary-menu'],
    };
    super(params);
    this.container = new ElementCreator<HTMLDivElement>({ classNames: ['container'] });
    this.setContent();
  }

  private setContent(): void {
    // контейнер для хлебных крошек, textContent заменить на обновление из истории (роутинга?)
    const breadcrumbs = new ElementCreator({
      classNames: ['secondary-menu__breadcrumbs'],
      textContent: 'Home / Catalog',
    });

    this.container.addInnerElements([breadcrumbs]);
    this.viewElementCreator.addInnerElements([this.container]);
  }

  public addElement(elements: (HTMLElement | ElementCreator)[]): void {
    this.container.addInnerElements(elements);
  }
}
