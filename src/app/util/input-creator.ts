import ElementCreator from './element-creator';
import { ElementParams, InputParams } from './types';

class InputCreator extends ElementCreator<HTMLInputElement> {
  public isValid: boolean;

  constructor(params: InputParams) {
    super({ ...params, tag: 'input' });
    this.isValid = false;
    this.setType(params.type);
  }

  private setType(type: string): void {
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

  public addValidation(validationRule: (value: string) => { isValid: boolean; errorMessage: string }): void {
    let errorSpan: HTMLSpanElement | null = null;

    this.element.addEventListener('input', () => {
      const validationResult = validationRule(this.element.value);

      // создаем span для сообщений об ошибке
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.style.display = 'none';
        if (this.element.parentElement) {
          // span добавляется сразу после инпута
          this.element.parentElement.insertBefore(errorSpan, this.element.nextSibling);
        }
      }

      if (!validationResult.isValid) {
        if (errorSpan && errorSpan instanceof HTMLSpanElement) {
          errorSpan.textContent = validationResult.errorMessage;
          errorSpan.style.display = 'block';
        }
        this.isValid = false;
      } else {
        if (errorSpan && errorSpan instanceof HTMLSpanElement) {
          errorSpan.textContent = '';
          errorSpan.style.display = 'none';
        }
        this.isValid = true;
      }
    });
  }
}

export default InputCreator;
