import ElementCreator from '../util/element-creator';
import { ElementParams } from '../util/types';

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
}
