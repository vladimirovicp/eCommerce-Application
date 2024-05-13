import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
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
import { registerNewCustomer } from '../../api/customers-requests';

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
      this.createFields(this.createCountry('address-field__billing'), this.createCity('address-field__billing')),
      this.createFields(this.createPostalCode('address-field__billing'), this.createStreet('address-field__billing')),
      this.createCheckboxAddressShipping(),
      this.createFieldsSubTitle('Shipping address'),
      this.createFields(this.createCountry('address-field__shipping'), this.createCity('address-field__shipping')),
      this.createFields(this.createPostalCode('address-field__shipping'), this.createStreet('address-field__shipping')),
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
      attributes: { name: 'firstName', placeholder: 'First name', required: 'true' },
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
      attributes: { name: 'lastName', placeholder: 'Last name', required: 'true' },
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
      attributes: { name: 'birthDate', placeholder: 'Birth date', required: 'true' },
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
  private createCountry(dependentFieldsClassName: string): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__country'],
    });

    const name = `${dependentFieldsClassName.replace('address-field__', '')}`;

    const select = new ElementCreator({
      tag: 'select',
      attributes: { name: `${name}Country` },
    });

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

    select.getElement().addEventListener(
      'change',
      () => {
        const addressFields = document.querySelectorAll(`.${dependentFieldsClassName}`);
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
    return field;
  }

  private createCity(inputClassName: string): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });
    const name = `${inputClassName.replace('address-field__', '')}`;
    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}City`,
        placeholder: 'city',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createStreet(inputClassName: string): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const name = `${inputClassName.replace('address-field__', '')}`;

    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}Street`,
        placeholder: 'street',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
      // classNames: ['address-field__shipping'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.formCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createPostalCode(inputClassName: string): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });
    const name = `${inputClassName.replace('address-field__', '')}`;
    const input = new InputCreator({
      type: 'text',
      attributes: {
        name: `${name}PostalCode`,
        placeholder: 'postal code',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
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
      attributes: { name: 'checkboxAddress', disabled: 'true' },
      classNames: ['address-field__billing'],
    });

    const label = input.createLabel('Use as a default shipping address', 'check-address__shipping');
    field.addInnerElements([input, label]);

    return field;
  }

  protected async handleSubmitForm(formData: { [key: string]: string }): Promise<void> {
    if (formData.email && formData.password) {
      const billingAddress: BaseAddress = {
        country: formData.billingCountry,
        streetName: formData.billingStreet,
        postalCode: formData.billingPostalCode,
        city: formData.billingCity,
      };

      const shippingAddress: BaseAddress = {
        country: formData.shippingCountry,
        streetName: formData.shippingStreet,
        postalCode: formData.shippingPostalCode,
        city: formData.shippingCity,
      };

      const customerDraft: CustomerDraft = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.birthDate,
        addresses: [billingAddress, shippingAddress],
        defaultShippingAddress: 1,
        authenticationMode: 'Password',
      };

      const isRegistered = await registerNewCustomer(customerDraft);
      if (isRegistered) {
        alert('Registration successful!'); // eslint-disable-line
        // перенаправление на главную страницу, изменение ссылок в header
      }
    } else {
      // модальное окно с ошибкой? а нужен ли тут вообще этот блок?
      console.error('something went wrong, please try again');
    }
  }
}
