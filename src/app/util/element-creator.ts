import { ElementParams } from './types';

class ElementCreator<T extends HTMLElement = HTMLElement> {
  protected element: T;

  constructor(params: ElementParams) {
    this.element = <T>document.createElement(params.tag);
    this.setCssClasses(params.classNames);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  setCallback(callback: ((event: Event | undefined) => void) | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', callback);
    }
  }

  addInnerElements(children: Array<T | HTMLElement>): void {
    const fragment = new DocumentFragment();
    children.forEach((child) => {
      if (child instanceof ElementCreator) {
        fragment.append(child.getElement());
      } else {
        fragment.append(child);
      }
    });
    this.element.append(fragment);
  }

  private setCssClasses(cssClasses: Array<string> | undefined): void {
    if (cssClasses !== undefined) {
      cssClasses.map((cssClass) => this.element.classList.add(cssClass));
    }
  }

  private setTextContent(text: string | undefined): void {
    if (text !== undefined) {
      this.element.textContent = text;
    }
  }
}

export default ElementCreator;
