import logoSrc from '../../assets/img/svg/logo.svg';
import View from '../common/view';
import ElementCreator from './element-creator';
import InputCreator from './input-creator';
import {
  addressValidation,
  birthDateValidation,
  emailValidation,
  nameValidation,
  passwordValidation,
  postCodeValidation,
} from './validation-fuction';
import FormCreator from './form-creator';
import { typeDateToText, typeTextToDate } from './converter-input';
import countryData from './data';
import { InputParams } from './types';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

class FormPageCreator extends View {
  protected formCreator: FormCreator;

  constructor(classNames: string[]) {
    const params = {
      classNames: ['container'],
    };
    super(params);
    this.formCreator = new FormCreator({ classNames });
  }

  protected createFormTitle(textContent: string): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      classNames: ['form__title'],
    });
    formTitle.getElement().innerHTML = `<span class="form__title-logo">
    <img class="img-full" src="${imageSrc.LOGO}" alt="logo">
    </span><span class="form__title-text">${textContent}</span>`;

    return formTitle;
  }

  protected createMessage(): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      classNames: ['form__message'],
    });
    return formTitle;
  }

  protected createForm(): FormCreator {
    return this.formCreator;
  }

  protected createFieldsTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-title'],
    });
  }

  protected createFieldsSubTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-sub-title'],
    });
  }

  protected createFields(
    fieldOne: ElementCreator<HTMLElement>,
    fieldTwo: ElementCreator<HTMLElement>
  ): ElementCreator<HTMLElement> {
    const fields = new ElementCreator({
      classNames: ['form__fields'],
    });

    fields.addInnerElements([fieldOne, fieldTwo]);

    return fields;
  }

  protected createFormField(
    params: InputParams,
    validationHandler: (value: string) => { isValid: boolean; errorMessage: string },
    isValid?: boolean
  ): ElementCreator<HTMLElement> {
    const field = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field', 'main__field'],
    });

    const input = new InputCreator(params);

    if (isValid) {
      input.isValid = true;
    }

    const error = this.addValidationErrorHandling(input, validationHandler);

    field.addInnerElements([input, error]);

    return field;
  }

  protected createFieldPassword(name: string = 'password', form?: FormCreator): ElementCreator<HTMLElement> {
    const fieldPassword = new ElementCreator({ classNames: ['form__field', 'field__password'] });
    const fieldEye = new ElementCreator({ classNames: ['form__field-eye'] });

    const input = new InputCreator({
      type: 'password',
      classNames: ['password'],
      attributes: { name, placeholder: 'Enter your password', required: 'true' },
    });

    const btnEye = new ElementCreator({
      classNames: ['eye'],
      callback: function eyeSwitch(): void {
        const currentType = input.getElement().getAttribute('type');
        if (currentType === 'password') {
          input.setType('text');
        } else {
          input.setType('password');
        }
      },
    });

    let error: ElementCreator<HTMLSpanElement>;

    if (!form) {
      // корявенько конечно...
      error = this.addValidationErrorHandling(input, passwordValidation);
    } else {
      error = new ElementCreator({ tag: 'span' });

      input.addValidation(passwordValidation, error.getElement());
      form.addValidationField(input);
    }

    fieldEye.addInnerElements([input, btnEye]);
    fieldPassword.addInnerElements([fieldEye, error]);

    return fieldPassword;
  }

  protected createFieldEmail(isValid?: boolean): ElementCreator<HTMLElement> {
    return this.createFormField(
      {
        type: 'text',
        attributes: { placeholder: 'Enter your email address', name: 'email', required: 'true' },
      },
      emailValidation,
      isValid
    );
  }

  protected createFirstName(isValid?: boolean): ElementCreator<HTMLElement> {
    return this.createFormField(
      {
        type: 'text',
        attributes: { name: 'firstName', placeholder: 'First name', required: 'true' },
      },
      nameValidation,
      isValid
    );
  }

  protected createLastName(isValid?: boolean): ElementCreator<HTMLElement> {
    return this.createFormField(
      {
        type: 'text',
        attributes: { name: 'lastName', placeholder: 'Last name', required: 'true' },
      },
      nameValidation,
      isValid
    );
  }

  protected createBirthDate(isValid?: boolean): ElementCreator<HTMLElement> {
    return this.createFormField(
      {
        type: 'text',
        attributes: { name: 'dateOfBirth', placeholder: 'Birth date', required: 'true' },
        callbackFocus: typeTextToDate,
        callbackBlur: typeDateToText,
      },
      birthDateValidation,
      isValid
    );
  }

  protected createAddressGroup(
    isBillingAddress: boolean = true,
    id?: string,
    isValid?: boolean
  ): ElementCreator<HTMLDivElement> {
    const className = `address-field__${isBillingAddress ? 'billing' : 'shipping'}`;
    const addressContainer = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: [isBillingAddress ? 'billing-address' : 'shipping-address', 'form__fields-group'],
      attributes: id ? { id } : {},
    });
    addressContainer.addInnerElements([
      this.createFields(
        this.createCountry(className, addressContainer).container,
        this.createCity(className, isValid).container
      ),
      this.createFields(
        this.createPostalCode(className, isValid).container,
        this.createStreet(className, isValid).container
      ),
    ]);
    return addressContainer;
  }

  protected createCountry(
    dependentFieldsClassName: string,
    container: ElementCreator<HTMLDivElement>
  ): { container: ElementCreator; input: ElementCreator<HTMLSelectElement> } {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__country'],
    });

    const name = `${dependentFieldsClassName.replace('address-field__', '')}`;
    const select = new ElementCreator<HTMLSelectElement>({
      tag: 'select',
      attributes: { name: `${name}Country` },
    });

    this.fillSelectWithCountries(select);

    // включение соседних полей адреса в активный режим после первого выбора страны
    select.getElement().addEventListener(
      'change',
      () => {
        const addressFields = container.getElement().querySelectorAll(`.${dependentFieldsClassName}`);
        addressFields.forEach((addressField) => {
          if (addressField instanceof HTMLInputElement) {
            const inputfield = addressField;
            inputfield.disabled = false;
          }
        });
      },
      { once: true }
    );

    field.addInnerElements([select]);
    return { container: field, input: select };
  }

  protected fillSelectWithCountries(select: ElementCreator<HTMLSelectElement>): void {
    const defaultOption = new ElementCreator({
      tag: 'option',
      attributes: {
        selected: 'true',
        disabled: 'true',
        hidden: 'true',
      },
      textContent: 'Country',
    });
    select.addInnerElements([defaultOption]);

    countryData.forEach((el) => {
      const option = new ElementCreator({
        tag: 'option',
        attributes: { value: el.code },
        textContent: el.name,
      });
      select.addInnerElements([option]);
    });
  }

  protected createCity(inputClassName: string, isValid?: boolean): { container: ElementCreator; input: InputCreator } {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });
    const name = `${inputClassName.replace('address-field__', '')}`;
    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}City`,
        placeholder: 'City',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    if (isValid) input.isValid = true;

    const error = this.addValidationErrorHandling(input, addressValidation);

    field.addInnerElements([input, error]);

    return { container: field, input };
  }

  protected createStreet(
    inputClassName: string,
    isValid?: boolean
  ): { container: ElementCreator; input: InputCreator } {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const name = `${inputClassName.replace('address-field__', '')}`;

    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}Street`,
        placeholder: 'Street',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    if (isValid) input.isValid = true;

    const error = this.addValidationErrorHandling(input, addressValidation);

    field.addInnerElements([input, error]);

    return { container: field, input };
  }

  protected createPostalCode(
    inputClassName: string,
    isValid?: boolean
  ): { container: ElementCreator; input: InputCreator } {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });
    const name = `${inputClassName.replace('address-field__', '')}`;
    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}PostalCode`,
        placeholder: 'Postal code',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    if (isValid) input.isValid = true;

    const error = this.addValidationErrorHandling(input, postCodeValidation);
    field.addInnerElements([input, error]);

    return { container: field, input };
  }

  protected addValidationErrorHandling(
    inputCreator: InputCreator,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string }
  ): ElementCreator<HTMLSpanElement> {
    const errorCreator = new ElementCreator({
      tag: 'span',
    });

    inputCreator.addValidation(validationFunction, errorCreator.getElement());
    this.formCreator.addValidationField(inputCreator);

    return errorCreator;
  }

  protected createSubmitButton(textContent: string, callback: () => void): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: textContent, disabled: 'true' },
      callback,
    });

    fieldBtn.addInnerElements([input]);
    this.formCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }
}

export default FormPageCreator;
