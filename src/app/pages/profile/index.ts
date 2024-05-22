// import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { Customer } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import customerService from '../../api/customers-requests';
import ElementCreator from '../../util/element-creator';
import FormCreator from '../../util/form-creator';
import FormPageCreator from '../../util/form-page-creator';
import InputCreator from '../../util/input-creator';

export default class ProfilePage extends FormPageCreator {
  private customerInfo: Customer | undefined;

  constructor() {
    super();
    this.customerInfo = customerService.customerInfo;
    this.setContent();
  }

  private setContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([this.createPersonalInfoForm(), this.createPasswordForm()]);
    this.viewElementCreator.addInnerElements([box]);
  }

  private createPersonalInfoForm(): FormCreator {
    if (this.customerInfo) {
      this.customerInfo.addresses.forEach((address) => {
        if (address.id && this.customerInfo!.shippingAddressIds?.includes(address.id)) {
          this.createAddressGroup(false, address.id);
        }
      });
    }

    this.formCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFirstName(),
      this.createLastName(),
      this.createBirthDate(),
      this.createFieldEmail(),

      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Billing address'),
      this.createAddressGroup(true),

      this.createFieldsSubTitle('Shipping address'),
      this.createAddressGroup(false),

      this.createButton('Add address'),
      this.createButton('Save changes'),
    ]);

    return this.formCreator;
  }

  private createPasswordForm(): ElementCreator<HTMLElement> {
    const passwordFormCreator = new FormCreator({});
    passwordFormCreator.addInnerElements([this.createFieldsTitle('Choose password'), this.createFieldPassword()]);
    return passwordFormCreator;
  }

  protected createFirstName(): ElementCreator<HTMLElement> {
    const field = super.createFirstName();
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.firstName) {
      input.value = this.customerInfo.firstName;
    }
    return field;
  }

  protected createLastName(): ElementCreator<HTMLElement> {
    const field = super.createLastName();
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.lastName) {
      input.value = this.customerInfo.lastName;
    }
    return field;
  }

  protected createBirthDate(): ElementCreator<HTMLElement> {
    const field = super.createBirthDate();
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.dateOfBirth) {
      input.value = this.customerInfo.dateOfBirth;
    }
    return field;
  }

  protected createFieldEmail(): ElementCreator<HTMLElement> {
    const field = super.createFieldEmail();
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo) {
      input.value = this.customerInfo.email;
    }
    return field;
  }

  protected createButton(textContent: string): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: textContent, disabled: 'true' },
      callback: (): void => {},
    });

    fieldBtn.addInnerElements([input]);
    this.formCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }

  private collectDataFromForm(): void {
    const formData: { [key: string]: string } = { email: customerService.customerInfo?.email ?? '' };

    const mainFields = document.querySelectorAll('.main__field');
    mainFields.forEach((field) => {
      if (field instanceof HTMLInputElement && typeof field.name === 'string') {
        formData[field.name] = field.value;
      }
    });

    // const billingAddresses = document.querySelectorAll('.billing-address');
    // billingAddresses.forEach((address) => {});
  }
}
