import ElementCreator from '../util/element-creator';
import { ElementParams } from '../util/types';
import '../../assets/scss/_load.scss';
import imgLoad from '../../assets/img/svg/load.svg';

const imageSrc = {
  load: `${imgLoad}`,
};

export default class View {
  protected viewElementCreator: ElementCreator;

  constructor(params: ElementParams) {
    this.viewElementCreator = this.createView(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }

  private createView(params: ElementParams): ElementCreator {
    const viewElementCreator = new ElementCreator(params);
    return viewElementCreator;
  }

  protected loading(): void {
    const load = new ElementCreator({
      classNames: ['load', 'active'],
    });

    const loadWraper = new ElementCreator({
      classNames: ['load__wraper'],
    });

    const img = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: imageSrc.load,
        alt: 'load',
      },
    });

    loadWraper.addInnerElements([img]);
    load.addInnerElements([loadWraper]);
    this.viewElementCreator.addInnerElements([load]);
  }

  protected loadingStart(): void {
    const load = document.querySelector('.load');
    if (load) {
      load.classList.add('active');
    }
  }

  protected loadingEnd(): void {
    const load = document.querySelector('.load');
    if (load) {
      load.classList.remove('active');
    }
  }
}
