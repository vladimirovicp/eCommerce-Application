import { ElementParams } from './types';

abstract class ElementCreator<T extends HTMLElement = HTMLElement> {
  /*
  Для использования класса можно будет потом писать
  export class InputField extends ElementTemplate<HTMLInputElement>
  или, если не нужны особые аттрибуты
  export class Element extends ElementTemplate
  */
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

  // Нужен ли он тут?
  setCallback(callback: ((event: Event | undefined) => void) | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }

  addInnerElements(children: Array<HTMLElement>): void {
    children.forEach((child) => {
      if (child instanceof ElementCreator) {
        this.element.append(child.getElement());
      } else {
        this.element.append(child);
      }
    });
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
