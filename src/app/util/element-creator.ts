import { ElementParams } from './types';

class ElementCreator<T extends HTMLElement = HTMLElement> {
  protected element: T;

  constructor(params: ElementParams) {
    this.element = <T>document.createElement(params.tag !== undefined ? params.tag : 'div');
    this.setCssClasses(params.classNames);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback, params.eventType);
    this.setCallbackFocus(params.callbackFocus);
    this.setCallbackBlur(params.callbackBlur);
    this.setAttributes(params.attributes);
  }

  getElement(): T {
    return this.element;
  }

  setCallback(callback: ((event: Event | undefined) => void) | undefined, eventType: string | undefined): void {
    if (typeof callback === 'function') {
      if (eventType) {
        this.element.addEventListener(eventType, callback);
      } else {
        this.element.addEventListener('click', callback);
      }
    }
  }

  setCallbackFocus(callback: ((event: Event | undefined) => void) | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('focus', callback);
    }
  }

  setCallbackBlur(callback: ((event: Event | undefined) => void) | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('blur', callback);
    }
  }

  addInnerElements(children: Array<HTMLElement | ElementCreator>): void {
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

  private setAttributes(attributes: { [key: string]: string } | undefined): void {
    if (attributes !== undefined) {
      const keys = Object.keys(attributes);
      keys.forEach((key) => {
        this.element.setAttribute(key, attributes[key]);
      });
    }
  }
}

export default ElementCreator;
