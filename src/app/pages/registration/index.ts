import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import './index.scss';
import InputCreator from '../../util/input-creator';
import ElementCreator from '../../util/element-creator';
import '../../../assets/scss/page/register.scss';
import { typeTextToDate, typeDateToText } from '../../util/converter-input';
import countryData from '../../util/data';
import FormCreator from '../../util/form-creator';
import {
  addressValidation,
  birthDateValidation,
  nameValidation,
  postCodeValidation,
} from '../../util/validation-fuction';
import { registerNewCustomer } from '../../api/customers-requests';
import FormPageCreator from '../../util/form-page-creator';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import modalWindowCreator from '../../components/modal-window';
import HeaderView from '../../components/header/header';

export default class RegistrationPage extends FormPageCreator {
  protected formCreator: FormCreator;

  private header: HeaderView;

  private router: Router;

  private billingAddressFields: (ElementCreator | InputCreator)[];

  private shippingAddressFields: (ElementCreator<HTMLSelectElement> | InputCreator)[];

  private isBillingFieldsValid: boolean;

  private defaultAddressCheckbox: InputCreator;

  constructor(router: Router, header: HeaderView) {
    super();
    this.billingAddressFields = [];
    this.shippingAddressFields = [];
    this.defaultAddressCheckbox = new InputCreator({
      type: 'checkbox',
      id: 'check-address__shipping',
      attributes: { name: 'checkboxAddress', disabled: 'true' },
      // classNames: ['address-field__billing'],
    });
    this.isBillingFieldsValid = false;
    this.formCreator = new FormCreator({
      classNames: ['form__register'],
      // attributes: { action: '#' },
    });
    this.setRegistrationContent();
    this.router = router;
    this.header = header;
  }

  private setRegistrationContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([
      this.createFormTitle('Register'),
      this.createMessage(),
      this.createForm(),
      this.createLink('LogIn', `${Pages.LOGIN}`),
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

    const error = this.addValidationErrorHandling(input, birthDateValidation);

    field.addInnerElements([input, error]);

    return field;
  }

  private createCountry(dependentFieldsClassName: string): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__country'],
    });

    const name = `${dependentFieldsClassName.replace('address-field__', '')}`;
    const select = new ElementCreator<HTMLSelectElement>({
      tag: 'select',
      attributes: { name: `${name}Country` },
    });

    if (dependentFieldsClassName === 'address-field__billing') {
      this.billingAddressFields.push(select);
    } else {
      this.shippingAddressFields.push(select);
    }

    this.fillSelectWithCountries(select);

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

  private fillSelectWithCountries(select: ElementCreator<HTMLSelectElement>): void {
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
        placeholder: 'City',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(input);
    } else {
      this.shippingAddressFields.push(input);
    }

    const error = this.addValidationErrorHandling(input, addressValidation);

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
        placeholder: 'Street',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
      // classNames: ['address-field__shipping'],
    });

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(input);
    } else {
      this.shippingAddressFields.push(input);
    }

    const error = this.addValidationErrorHandling(input, addressValidation);

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
        placeholder: 'Postal code',
        required: 'true',
        disabled: 'true',
      },
      classNames: [inputClassName],
    });

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(input);
    } else {
      this.shippingAddressFields.push(input);
    }
    
    const error = this.addValidationErrorHandling(input, postCodeValidation);
    field.addInnerElements([input, error]);

    return field;
  }

  private checkBillingFieldsValidation(inputCreator: InputCreator): void {
    this.billingAddressFields.push(inputCreator);

    inputCreator.getElement().addEventListener('isValidChange', () => {
      this.isBillingFieldsValid = this.billingAddressFields.every((input) => {
        if (input instanceof InputCreator) {
          return input.isValid;
        }
        return true;
      });
      this.defaultAddressCheckbox.getElement().disabled = !this.isBillingFieldsValid;
    });
  }

  private createCheckboxAddressShipping(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const label = this.defaultAddressCheckbox.createLabel(
      'Use as a default shipping address',
      'check-address__shipping'
    );
    field.addInnerElements([this.defaultAddressCheckbox, label]);

    this.defaultAddressCheckbox.getElement().addEventListener('click', (): void => {
      if (this.defaultAddressCheckbox.getElement().checked === true) {
        this.billingAddressFields.forEach((billingField, index) => {
          this.copyAddressValue(billingField, index);
        });
        this.shippingAddressFields.forEach((shippingField) => this.toggleDisabled(shippingField, true));
      } else {
        this.shippingAddressFields.forEach((shippingField) => this.toggleDisabled(shippingField, false));
      }
    });

    return field;
  }

  private toggleDisabled(fieldCreator: ElementCreator<HTMLSelectElement> | InputCreator, status: boolean): void {
    const shippingField = fieldCreator.getElement();
    shippingField.disabled = status;
  }

  private copyAddressValue(fieldCreator: ElementCreator, index: number): void {
    const billingField = fieldCreator.getElement();
    const shippingField = this.shippingAddressFields[index].getElement();
    const shippingFieldCreator = this.shippingAddressFields[index];
    if (
      (billingField instanceof HTMLSelectElement || billingField instanceof HTMLInputElement) &&
      (shippingField instanceof HTMLSelectElement || shippingField instanceof HTMLInputElement)
    ) {
      shippingField.value = billingField.value;
      if (shippingFieldCreator instanceof InputCreator) {
        shippingFieldCreator.isValid = true;
        this.formCreator.checkFormValidity();
      }
    }
  }

  protected createButton(textContent: string): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: textContent, disabled: 'true' },
      callback: (): void => {
        const form = document.querySelector('form');
        if (form !== null && form instanceof HTMLFormElement) {
          this.shippingAddressFields.forEach((shippingField) => {
            const field = shippingField.getElement();
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.disabled = false;
          });
          const formData = new FormData(form);
          const formDataObject: { [key: string]: string } = {};
          formData.forEach((value, key: string) => {
            formDataObject[key] = value as string;
          });
          this.shippingAddressFields.forEach((shippingField) => {
            const field = shippingField.getElement();
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.disabled = true;
          });
          console.log(formData, formDataObject);
          this.handleSubmitForm(formDataObject);
        }
      },
    });

    fieldBtn.addInnerElements([input]);
    this.formCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }

  protected async handleSubmitForm(formData: { [key: string]: string }): Promise<void> {
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
      modalWindowCreator.showModalWindow('info', 'Registration successful!');
      // перенаправление на главную страницу, изменение ссылок в header
      this.router.navigate(Pages.HOME);
      this.header.isLoggedIn();
    }
  }

  protected createLink(textContent: string, page: string): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator({
      tag: 'a',
      textContent,
      callback: (): void => {
        this.router.navigate(page);
      },
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}
