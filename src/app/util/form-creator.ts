import ElementCreator from './element-creator';
import InputCreator from './input-creator';
import { ElementParams } from './types';

class FormCreator extends ElementCreator<HTMLFormElement> {
  private isFormValid: boolean;

  private formFields: InputCreator[];

  private submitButton: HTMLButtonElement | HTMLInputElement | undefined;

  constructor(params: ElementParams) {
    super({ ...params, tag: 'form' });
    this.isFormValid = false;
    this.formFields = [];
  }

  public addSubmitButton(button: HTMLButtonElement | HTMLInputElement): void {
    this.submitButton = button;
  }

  public addValidationField(input: InputCreator): void {
    this.formFields.push(input);
    input.getElement().addEventListener('isValidChange', () => {
      this.checkFormValidity();
    });
  }

  private checkFormValidity(): void {
    this.isFormValid = this.formFields.every((input) => input.isValid);
    if (this.submitButton) {
      this.submitButton.disabled = !this.isFormValid;
    }
  }
}

export default FormCreator;
