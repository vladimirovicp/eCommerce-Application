import '../../../assets/scss/page/home.scss';
import './index.scss';
import InputCreator from '../../util/input-creator';
import ElementCreator from '../../util/element-creator';
import '../../../assets/scss/page/register.scss';
import { typeTextToDate, typeDateToText } from '../../util/converter-input';
import countryData from '../../util/data';
import FormCreator from '../../util/form-creator';
// import Router from '../../router/router';
import { addressValidation, birthDateValidation, nameValidation } from '../../util/validation-fuction';
import LoginPage from '../login';

export default class RegistrationPage extends LoginPage {
  protected formCreator: FormCreator;

  constructor() {
    super(false);
    this.formCreator = new FormCreator({
      classNames: ['form__register'],
      attributes: { action: '#' },
    });

    this.setRegistrationContent();
  }

  private setRegistrationContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([
      this.createFormTitle('Register'),
      this.createMessage(),
      this.createForm(),
      this.createLink('LogIn'),
    ]);
    this.viewElementCreator.addInnerElements([box]);
  }

  protected createForm(): FormCreator {
    this.formCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createbirthDate(),
      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Billing address'),
      this.createFields(this.createCountryBilling(), this.createCityBilling()),
      this.createFields(this.createPostalCodeBilling(), this.createStreetBilling()),
      this.createCheckboxAddressShipping(),
      this.createFieldsSubTitle('Shipping adress'),
      this.createFields(this.createCountryShipping(), this.createCityShipping()),
      this.createFields(this.createPostalCodeShipping(), this.createStreetShipping()),
      this.createFieldsTitle('Choose password'),
      this.createFieldPassword(),
      this.createButton('Register'),
    ]);

    return this.formCreator;
  }

  private createFieldsTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-title'],
    });
  }

  private createFieldsSubTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-sub-title'],
    });
  }

  private createFields(
    fieldOne: ElementCreator<HTMLElement>,
    fieldTwo: ElementCreator<HTMLElement>
  ): ElementCreator<HTMLElement> {
    const fields = new ElementCreator({
      classNames: ['form__fields'],
    });

    fields.addInnerElements([fieldOne, fieldTwo]);

    return fields;
  }

  private createFirstName(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'First name', required: 'true' },
    });

    // const error = new ElementCreator({
    //   tag: 'span',
    // });

    // input.addValidation(nameValidation, error.getElement());
    // this.formCreator.addValidationField(input);
    const error = this.addValidationErrorHandling(input, nameValidation);

    field.addInnerElements([input, error]);

    return field;
  }

  private createLastName(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'Last name', required: 'true' },
    });

    // const error = new ElementCreator({
    //   tag: 'span',
    // });

    // input.addValidation(nameValidation, error.getElement());
    // this.formCreator.addValidationField(input);
    const error = this.addValidationErrorHandling(input, nameValidation);

    field.addInnerElements([input, error]);

    return field;
  }

  private createbirthDate(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__birth-date'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'Birth date', required: 'true' },
      callbackFocus: typeTextToDate,
      callbackBlur: typeDateToText,
    });

    // const error = new ElementCreator({
    //   tag: 'span',
    // });

    // input.addValidation(birthDateValidation, error.getElement());
    // this.formCreator.addValidationField(input);
    const error = this.addValidationErrorHandling(input, birthDateValidation);

    field.addInnerElements([input, error]);

    return field;
  }

  /* eslint-disable max-lines-per-function */
  private createCountryShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__country'],
    });

    const select = new ElementCreator({
      tag: 'select',
    });

    const defaultOption = new ElementCreator({
      tag: 'option',
      attributes: { selected: 'true', disabled: 'true', hidden: 'true' },
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

    select.getElement().addEventListener(
      'change',
      () => {
        const addressFields = document.querySelectorAll('.address-field__shipping');
        addressFields.forEach((addressField) => {
          if (addressField instanceof HTMLInputElement) {
            const inputfield = addressField;
            inputfield.disabled = false;
          }
        });
      },
      { once: true }
    );

    // а здесь зачем error? тут пользователь ничего не вводит
    const error = new ElementCreator({
      tag: 'span',
    });

    field.addInnerElements([select, error]);
    return field;
  }

  private createCityShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'city', required: 'true', disabled: 'true' },
      classNames: ['address-field__shipping'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createStreetShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'street', required: 'true', disabled: 'true' },
      classNames: ['address-field__shipping'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createPostalCodeShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'postal code', required: 'true', disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createCheckboxAddressShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'checkbox',
      id: 'check-address__shipping',
      attributes: { disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const label = input.createLabel('Use as a default shipping address', 'check-address__shipping');
    field.addInnerElements([input, label]);

    return field;
  }

  private createCountryBilling(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__country'],
    });

    const select = new ElementCreator({
      tag: 'select',
    });

    const defaultOption = new ElementCreator({
      tag: 'option',
      attributes: { selected: 'true', disabled: 'true', hidden: 'true' },
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

    select.getElement().addEventListener(
      'change',
      () => {
        const addressFields = document.querySelectorAll('.address-field__billing');
        addressFields.forEach((addressField) => {
          if (addressField instanceof HTMLInputElement) {
            const inputfield = addressField;
            inputfield.disabled = false;
          }
        });
      },
      { once: true }
    );

    const error = new ElementCreator({
      tag: 'span',
    });

    field.addInnerElements([select, error]);
    return field;
  }

  private createCityBilling(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'city', required: 'true', disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createStreetBilling(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'street', required: 'true', disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createPostalCodeBilling(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'postal code', required: 'true', disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }
}
