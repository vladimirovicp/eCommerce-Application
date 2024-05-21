import ElementCreator from './element-creator';
import { ElementParams, InputParams } from './types';

class InputCreator extends ElementCreator<HTMLInputElement> {
  public isValid: boolean;

  private isValidChangeEvent: Event;

  constructor(params: InputParams) {
    super({ ...params, tag: 'input' });
    this.isValid = false;
    this.isValidChangeEvent = new Event('isValidChange');
    this.setCallbackFocus(params.callbackFocus);
    this.setCallbackBlur(params.callbackBlur);
    this.setType(params.type);
  }

  public setType(type: string): void {
    this.element.setAttribute('type', type);
  }

  public createLabel(labelText: string, labelClass?: string): HTMLLabelElement {
    const labelParams: ElementParams = {
      tag: 'label',
      textContent: labelText,
      classNames: labelClass ? [labelClass] : undefined,
    };
    const labelCreator = new ElementCreator<HTMLLabelElement>(labelParams);
    const labelElement = labelCreator.getElement();

    if (this.element.id) {
      labelElement.htmlFor = this.element.id;
    }

    return labelElement;
  }

  public addValidation(
    validationRule: (value: string) => { isValid: boolean; errorMessage: string },
    errorSpan: HTMLSpanElement
  ): void {
    const errorElement = errorSpan;
    this.element.addEventListener('input', () => {
      const validationResult = validationRule(this.element.value);
      const wasValid = this.isValid;

      if (!validationResult.isValid) {
        errorElement.textContent = validationResult.errorMessage;
        errorElement.style.display = 'block';
        this.isValid = false;
      } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        this.isValid = true;
      }
      if (this.isValid !== wasValid) {
        this.element.dispatchEvent(this.isValidChangeEvent);
      }
    });
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
}

export default InputCreator;
