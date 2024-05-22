// import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { Customer } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import customerService from '../../api/customers-requests';
import modalWindowCreator from '../../components/modal-window';
import ElementCreator from '../../util/element-creator';
import FormCreator from '../../util/form-creator';
import FormPageCreator from '../../util/form-page-creator';
import InputCreator from '../../util/input-creator';

export default class ProfilePage extends FormPageCreator {
  private customerInfo: Customer | undefined;

  constructor() {
    super();
    this.customerInfo = customerService.customerInfo;
    console.log(customerService.customerInfo);
    this.setContent();
  }

  private setContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([this.createPersonalInfoForm(), this.createPasswordForm()]);
    this.viewElementCreator.addInnerElements([box]);
  }

  private createPersonalInfoForm(): FormCreator {
    const [billingAddressesContainer, shippingAddressesContainer] = this.fillInAddressForm();

    billingAddressesContainer.addInnerElements([]);
    this.formCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFirstName(),
      this.createLastName(),
      this.createBirthDate(),
      this.createFieldEmail(),

      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Billing address'),
      billingAddressesContainer,

      this.createFieldsSubTitle('Shipping address'),
      shippingAddressesContainer,

      this.createNewAddressButton('Add address'),
      this.createSubmitButton('Save changes', () => this.collectDataFromForm()),
    ]);

    return this.formCreator;
  }

  private fillInAddressForm(): ElementCreator<HTMLDivElement>[] {
    const billingContainer = new ElementCreator<HTMLDivElement>({ classNames: ['billing-container'] });
    const shippingContainer = new ElementCreator<HTMLDivElement>({ classNames: ['shipping-container'] });
    if (this.customerInfo) {
      this.customerInfo.addresses.forEach((address) => {
        if (address.id) {
          // typePrefix определяет, входит ли id адреса в список shippingAddressIds, и дальше пляшем от этого
          const typePrefix = this.customerInfo!.shippingAddressIds?.includes(address.id) ? 'shipping' : 'billing';
          const addressForm = this.createAddressGroup(typePrefix === 'billing', address.id).getElement();
          const container = typePrefix === 'shipping' ? shippingContainer : billingContainer;
          container.addInnerElements([addressForm]);

          const fields = [
            { field: 'Country', value: address.country },
            { field: 'City', value: address.city ?? '' },
            { field: 'Street', value: address.streetName ?? '' },
            { field: 'PostalCode', value: address.postalCode ?? '' },
          ];
          fields.forEach(({ field, value }) => {
            const selectElement = addressForm.querySelector(`[name="${typePrefix}${field}"]`);
            if (
              (selectElement && selectElement instanceof HTMLSelectElement) ||
              selectElement instanceof HTMLInputElement
            ) {
              selectElement.value = value;
            }
          });
        }
      });
    }
    return [billingContainer, shippingContainer];
  }

  private createPasswordForm(): ElementCreator<HTMLElement> {
    const passwordFormCreator = new FormCreator({});
    passwordFormCreator.addInnerElements([this.createFieldsTitle('Password'), this.createFieldPassword()]);
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

  protected createNewAddressButton(textContent: string): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: textContent, disabled: 'true' },
      callback: (): void => {
        modalWindowCreator.showModalWindow('standart', 'What type of address do you want to add?');
        modalWindowCreator.createButton(() => this.addNewAddressField(false), 'Shipping Address');
        modalWindowCreator.createButton(() => this.addNewAddressField(true), 'Billing Address');
      },
    });

    fieldBtn.addInnerElements([input]);
    this.formCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }

  private addNewAddressField(isBillingField: boolean): void {
    const newAddress = this.createAddressGroup(isBillingField);
    if (isBillingField) {
      document.querySelector('.billing-container')?.appendChild(newAddress.getElement());
    } else {
      document.querySelector('.shipping-container')?.appendChild(newAddress.getElement());
    }
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
    // billingAddresses.forEach((address) => {
    //   const billingAddressData = {
    //     addressId: address.id,
    //     address: {
    //       streetName: address.querySelector('[name="billingStreet"]').value,
    //       postalCode: '11111',
    //       city: 'Any City',
    //       country: 'US',
    //     },
    //   };
    // });
  }
}
