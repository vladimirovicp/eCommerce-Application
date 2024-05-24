// import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { Customer, MyCustomerAddAddressAction } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import customerService from '../../api/customers-requests';
import modalWindowCreator from '../../components/modal-window';
import ElementCreator from '../../util/element-creator';
import FormCreator from '../../util/form-creator';
import FormPageCreator from '../../util/form-page-creator';
import InputCreator from '../../util/input-creator';

// type ActionMap = {
//   setFirstName: () => void;
//   setLastName: () => void;
//   setDateOfBirth: () => void;
//   changeEmail: () => void;
//   addAddress: () => void;
//   changeAddress: () => void;
//   removeAddress: () => void;
//   setDefaultBillingAddress: () => void;
//   setDefaultShippingAddress: () => void;
// };

export default class ProfilePage extends FormPageCreator {
  private customerInfo: Customer | null = null;

  private radioButtonIdCounter: number;

  constructor() {
    super();
    this.getCustomerInfo();
    this.radioButtonIdCounter = 1;
  }

  async getCustomerInfo(): Promise<void> {
    this.customerInfo = await customerService.getCustomerInfo();
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
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createBirthDate(),

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

  protected createAddressGroup(isBillingAddress: boolean, id?: string): ElementCreator<HTMLDivElement> {
    const addressContainer = super.createAddressGroup(isBillingAddress, id);

    const editElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-edit'],
      // callback: () => {},
    });
    const deleteElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-delete'],
      // callback: () => {},
    });
    addressContainer.getElement().prepend(editElementCreator.getElement(), deleteElementCreator.getElement());

    // добавляем радиобаттон для выбора дефолтного адреса
    const radioButtonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['radio-button', 'form__field'] });
    const name = isBillingAddress ? 'radio-address__billing' : 'radio-address__shipping';
    let isChecked: boolean = false;
    if (id) {
      // если адрес подгруженный, проверяем не дефолтный ли он
      const defaultAddressId = isBillingAddress
        ? this.customerInfo?.defaultBillingAddressId
        : this.customerInfo?.defaultShippingAddressId;
      isChecked = id === defaultAddressId;
    }
    radioButtonContainer.getElement().innerHTML = `<input type="radio" id="${name}${this.radioButtonIdCounter}" name="${name}" checked="${isChecked}"/>
    <label for="${name}${this.radioButtonIdCounter}">Set as a default address</label>`;
    this.radioButtonIdCounter += 1;
    addressContainer.addInnerElements([radioButtonContainer]);
    return addressContainer;
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
      attributes: { value: textContent },
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

  private collectDataFromForm(): void {}

  // private handleChangedFields(): void {
  //   const actions: MyCustomerUpdateAction[] = [];
  //   const form = this.formCreator.getElement();

  //   const addAction = (actionName: string, key: string, value: any) => {
  //     actions.push({ action: actionName, [key]: value });
  //   };

  //   form.querySelectorAll('.changed').forEach((field) => {
  //     if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
  //       const fieldActions: ActionMap = {
  //         firstName: () => addAction('setFirstName', 'firstName', field.value),
  //         lastName: () => addAction('setLastName', 'lastName', field.value),
  //         birthDate: () => addAction('setDateOfBirth', 'dateOfBirth', field.value),
  //         email: () => addAction('changeEmail', 'email', field.value),
  //       };
  //       fieldActions[field.name]?.();
  //     } else {
  //       const data = {
  //         action: 'changeAddress',
  //         addressId: field.id,
  //         address: {
  //           streetName: 'Example Street',
  //           postalCode: '80933',
  //           city: 'Exemplary City',
  //           country: 'DE',
  //         },
  //       };
  //       actions.push(data);
  //     }
  //   });
  // }

  private collectNewAddresses(): MyCustomerAddAddressAction[] {
    const actions: MyCustomerAddAddressAction[] = [];
    // вспомогательная функция
    const getInputValue = (name: string, container: Element): string => {
      const input = container.querySelector(`[name="${name}"]`);
      return input instanceof HTMLInputElement || input instanceof HTMLSelectElement ? input.value : '';
    };

    const processAddresses = (selector: string, addressType: string): void => {
      document.querySelectorAll(selector).forEach((address) => {
        // выполнить для всех адресов без id, т е новых
        if (!address.id) {
          const data: MyCustomerAddAddressAction = {
            action: 'addAddress',
            address: {
              streetName: getInputValue(`${addressType}Street`, address),
              postalCode: getInputValue(`${addressType}PostalCode`, address),
              city: getInputValue(`${addressType}City`, address),
              country: getInputValue(`${addressType}Country`, address),
            },
          };
          actions.push(data);
        }
      });
    };

    processAddresses('.billing-address', 'billing');
    processAddresses('.shipping-address', 'shipping');

    return actions;
  }
}
