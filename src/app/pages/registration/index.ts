import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import './index.scss';
import InputCreator from '../../util/input-creator';
import ElementCreator from '../../util/element-creator';
import '../../../assets/scss/page/register.scss';
import FormCreator from '../../util/form-creator';
import customerService from '../../api/customers-requests';
import FormPageCreator from '../../util/form-page-creator';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import modalWindowCreator from '../../components/modal-window';
import HeaderView from '../../components/header/header';

export default class RegistrationPage extends FormPageCreator {
  private header: HeaderView;

  private router: Router;

  private billingAddressFields: (ElementCreator | InputCreator)[];

  private shippingAddressFields: (ElementCreator<HTMLSelectElement> | InputCreator)[];

  private isBillingFieldsValid: boolean;

  private defaultAddressCheckbox: InputCreator;

  constructor(router: Router, header: HeaderView) {
    super(['form__register']);
    this.billingAddressFields = [];
    this.shippingAddressFields = [];
    this.defaultAddressCheckbox = new InputCreator({
      type: 'checkbox',
      id: 'check-address__shipping',
      attributes: { name: 'checkboxAddress', disabled: 'true' },
      // classNames: ['address-field__billing'],
    });
    this.isBillingFieldsValid = false;
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
      this.createBirthDate(),
      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Billing address'),
      this.createAddressGroup(true),
      // this.createFields(this.createCountry('address-field__billing'), this.createCity('address-field__billing')),
      // this.createFields(this.createPostalCode('address-field__billing'), this.createStreet('address-field__billing')),
      this.createCheckboxAddressShipping(),
      this.createFieldsSubTitle('Shipping address'),
      this.createAddressGroup(false),
      // this.createFields(this.createCountry('address-field__shipping'), this.createCity('address-field__shipping')),
      // this.createFields(this.createPostalCode('address-field__shipping'), this.createStreet('address-field__shipping')),
      this.createFieldsTitle('Choose password'),
      this.createFieldPassword(),
      this.createSubmitButton('Register', () => this.submitButtonCallback()),
    ]);

    return this.formCreator;
  }

  protected createCountry(
    dependentFieldsClassName: string,
    container: ElementCreator<HTMLDivElement>
  ): { container: ElementCreator; input: ElementCreator<HTMLSelectElement> } {
    const field = super.createCountry(dependentFieldsClassName, container);

    if (dependentFieldsClassName === 'address-field__billing') {
      this.billingAddressFields.push(field.input);
    } else {
      this.shippingAddressFields.push(field.input);
    }

    return field;
  }

  protected createCity(inputClassName: string): { container: ElementCreator; input: InputCreator } {
    const field = super.createCity(inputClassName);

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(field.input);
    } else {
      this.shippingAddressFields.push(field.input);
    }

    return field;
  }

  protected createStreet(inputClassName: string): { container: ElementCreator; input: InputCreator } {
    const field = super.createStreet(inputClassName);

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(field.input);
    } else {
      this.shippingAddressFields.push(field.input);
    }

    return field;
  }

  protected createPostalCode(inputClassName: string): { container: ElementCreator; input: InputCreator } {
    const field = super.createPostalCode(inputClassName);

    if (inputClassName === 'address-field__billing') {
      this.checkBillingFieldsValidation(field.input);
    } else {
      this.shippingAddressFields.push(field.input);
    }

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
        // при выборе чекбокса копируем данные из billing в shipping
        this.billingAddressFields.forEach((billingField, index) => {
          this.copyAddressValue(billingField, index);
        });
        // делаем все поля shipping неактивными
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

  private submitButtonCallback(): void {
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
      defaultBillingAddress: 0,
      shippingAddresses: [1],
      billingAddresses: [0],
      authenticationMode: 'Password',
    };

    const isRegistered = await customerService.registerNewCustomer(customerDraft);
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
