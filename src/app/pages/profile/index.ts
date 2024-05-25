// import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { Customer, MyCustomerAddAddressAction, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/account.scss';
import customerService from '../../api/customers-requests';
import modalWindowCreator from '../../components/modal-window';
import ElementCreator from '../../util/element-creator';
import FormCreator from '../../util/form-creator';
import FormPageCreator from '../../util/form-page-creator';
import { getInputValue } from '../../util/helper';
import InputCreator from '../../util/input-creator';

export default class ProfilePage extends FormPageCreator {
  private customerInfo: Customer | null = null;

  private actions: MyCustomerUpdateAction[];

  private defaultBillingAddress: { [key: string]: string } | undefined;

  private defaultShippingAddress: { [key: string]: string } | undefined;

  constructor() {
    super(['form__account']);
    this.actions = [];
    this.defaultBillingAddress = undefined;
    this.defaultShippingAddress = undefined;
    this.getCustomerInfo();
  }

  async getCustomerInfo(): Promise<void> {
    this.customerInfo = await customerService.getCustomerInfo();
    this.setContent();
  }

  private setContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'account__box'] });
    box.addInnerElements([this.createFormTitle('PROFILE'), this.createPersonalInfoForm()]);
    this.viewElementCreator.addInnerElements([box]);
  }

  private createPersonalInfoForm(): FormCreator {
    this.formCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createBirthDate(),

      this.createFieldsTitle('Address'),
      this.fillInAddressForm(),

      this.createFields(
        this.createButton('Add address', () => this.addNewAddressField()),
        this.createSubmitButton('Save changes', () => this.createUpdateData())
      ),
      this.createButton('Change password', () => this.showChangePasswordWindow()),
    ]);

    return this.formCreator;
  }

  private showChangePasswordWindow(): void {
    modalWindowCreator.showModalWindow('standart', 'Would you like to change your password?');
    // наполнение окна
    const form = new FormCreator({});

    const message1 = new ElementCreator<HTMLDivElement>({ textContent: 'Enter current password' });
    const currentPasswordField = this.createFieldPassword('currentPassword', form);

    const message2 = new ElementCreator<HTMLDivElement>({ textContent: 'Enter new password' });
    const newPasswordField = this.createFieldPassword('newPassword', form);

    const buttonContainer = this.createButton('Change password', () => this.changePassword(form.getElement()));
    const changePasswordButton = buttonContainer.getElement().querySelector('input');
    if (changePasswordButton) {
      changePasswordButton.disabled = true;
      form.addSubmitButton(changePasswordButton);
    }
    form.addInnerElements([message1, currentPasswordField, message2, newPasswordField, buttonContainer]);

    modalWindowCreator.addInnerElements([form]);
  }

  private async changePassword(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key: string) => {
      formDataObject[key] = value as string;
    });
    const { currentPassword } = formDataObject;
    const { newPassword } = formDataObject;
    const isSuccessful = await customerService.changePassword(currentPassword, newPassword);
    if (isSuccessful) {
      modalWindowCreator.closeModalWindow();
      modalWindowCreator.showModalWindow('info', 'Password changed successfully');
    }
  }

  private fillInAddressForm(): ElementCreator<HTMLDivElement> {
    const addressesContainer = new ElementCreator<HTMLDivElement>({ classNames: ['addresses-container'] });
    if (this.customerInfo) {
      this.customerInfo.addresses.forEach((address) => {
        if (address.id) {
          // typePrefix определяет, входит ли id адреса в список shippingAddressIds, и дальше пляшем от этого
          const addressForm = this.createAddressGroup(true, address.id).getElement();
          addressesContainer.addInnerElements([addressForm]);

          const fields = [
            { field: 'billingCountry', value: address.country },
            { field: 'billingCity', value: address.city ?? '' },
            { field: 'billingStreet', value: address.streetName ?? '' },
            { field: 'billingPostalCode', value: address.postalCode ?? '' },
          ];
          fields.forEach(({ field, value }) => {
            const selectElement = addressForm.querySelector(`[name="${field}"]`);
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
    return addressesContainer;
  }

  protected createAddressGroup(isBilling: boolean = true, id?: string): ElementCreator<HTMLDivElement> {
    const addressContainer = super.createAddressGroup(isBilling, id, Boolean(id));
    const countrySelector = addressContainer.getElement().querySelector('select');
    let addressKey: string = '';
    if (id) {
      // делаем поле адреса изначально disabled
      if (countrySelector) countrySelector.disabled = true;
    } else {
      // уникальный идентификатор на основе времени
      addressKey = new Date().getTime().toString();
      addressContainer.getElement().setAttribute('data-address-key', addressKey);
    }
    const editElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-edit'],
      callback: (): void => {
        if (id && countrySelector) {
          countrySelector.disabled = false;
          countrySelector.dispatchEvent(new Event('change'));
          this.formCreator.checkFormValidity();
        }
        addressContainer.getElement().classList.add('changed');
      },
    });
    const deleteElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-delete'],
      callback: (): void => {},
    });
    addressContainer.getElement().prepend(editElementCreator.getElement(), deleteElementCreator.getElement());
    addressContainer.addInnerElements([this.createDefaultAddressRadioButtons(id ?? addressKey, Boolean(id))]);
    return addressContainer;
  }

  private createDefaultAddressRadioButtons(id: string, isID: boolean): ElementCreator<HTMLDivElement> {
    const radioButtonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['radio-button', 'form__field'] });

    const defaultBillingInput = new InputCreator({
      type: 'radio',
      id: `defaultBilling${id}`,
      attributes: { name: 'defaultBilling' },
    });
    const defaultBillingLabel = defaultBillingInput.createLabel('Set as a default billing address');
    const defaultShippingInput = new InputCreator({
      type: 'radio',
      id: `defaultShipping${id}`,
      attributes: { name: 'defaultShipping' },
    });
    const defaultShippingLabel = defaultShippingInput.createLabel('Set as a default shipping address');
    defaultBillingInput.getElement().addEventListener('change', (event) => {
      if (event.target instanceof HTMLElement) {
        this.defaultBillingAddress = { [isID ? 'id' : 'key']: id };
        this.formCreator.checkFormValidity();
      }
    });
    defaultShippingInput.getElement().addEventListener('change', (event) => {
      if (event.target instanceof HTMLElement) {
        this.defaultShippingAddress = { [isID ? 'id' : 'key']: id };
        this.formCreator.checkFormValidity();
      }
    });
    if (id) {
      // если адрес подгруженный, проверяем не дефолтный ли он
      if (id === this.customerInfo?.defaultBillingAddressId) defaultBillingInput.getElement().checked = true;
      if (id === this.customerInfo?.defaultShippingAddressId) defaultShippingInput.getElement().checked = true;
    }
    radioButtonContainer.addInnerElements([
      defaultBillingInput,
      defaultBillingLabel,
      defaultShippingInput,
      defaultShippingLabel,
    ]);
    return radioButtonContainer;
  }

  private addEditElement(input: HTMLInputElement): HTMLDivElement {
    const textInput = input;
    const editElement = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-edit'],
      callback: (): void => {
        textInput.disabled = false;
        textInput.classList.add('changed');
        this.formCreator.checkFormValidity();
      },
    });
    return editElement.getElement();
  }

  protected createFirstName(): ElementCreator<HTMLElement> {
    const field = super.createFirstName(true);
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.firstName) {
      input.value = this.customerInfo.firstName;
      input.disabled = true;
      const editElement = this.addEditElement(input);
      field.getElement().prepend(editElement);
    }
    return field;
  }

  protected createLastName(): ElementCreator<HTMLElement> {
    const field = super.createLastName(true);
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.lastName) {
      input.value = this.customerInfo.lastName;
      input.disabled = true;
      const editElement = this.addEditElement(input);
      field.getElement().prepend(editElement);
    }
    return field;
  }

  protected createBirthDate(): ElementCreator<HTMLElement> {
    const field = super.createBirthDate(true);
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo && this.customerInfo.dateOfBirth) {
      input.value = this.customerInfo.dateOfBirth;
      input.disabled = true;
      const editElement = this.addEditElement(input);
      field.getElement().prepend(editElement);
    }
    return field;
  }

  protected createFieldEmail(): ElementCreator<HTMLElement> {
    const field = super.createFieldEmail(true);
    const input = field.getElement().firstElementChild;
    if (input && input instanceof HTMLInputElement && this.customerInfo) {
      input.value = this.customerInfo.email;
      input.disabled = true;
      const editElement = this.addEditElement(input);
      field.getElement().prepend(editElement);
    }
    return field;
  }

  private createButton(textContent: string, callback: () => void): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: textContent },
      callback,
    });

    fieldBtn.addInnerElements([input]);
    return fieldBtn;
  }

  private addNewAddressField(): void {
    const newAddress = this.createAddressGroup(true);
    document.querySelector('.addresses-container')?.appendChild(newAddress.getElement());
  }

  private changeDefaultAddresses(): void {
    const updateAddress = (
      address: {
        [key: string]: string;
      },
      actionType: 'setDefaultBillingAddress' | 'setDefaultShippingAddress'
    ): void => {
      if ('id' in address) {
        this.actions.push({
          action: actionType,
          addressId: address.id,
        });
      } else if ('key' in address) {
        this.actions.push({
          action: actionType,
          addressKey: address.key,
        });
      }
    };

    if (this.defaultBillingAddress) {
      updateAddress(this.defaultBillingAddress, 'setDefaultBillingAddress');
    }
    if (this.defaultShippingAddress) {
      updateAddress(this.defaultShippingAddress, 'setDefaultShippingAddress');
    }
  }

  private createUpdateData(): void {
    const form = this.formCreator.getElement();

    form.querySelectorAll('.changed').forEach((field) => {
      if (field instanceof HTMLInputElement) {
        switch (field.name) {
          case 'firstName': {
            this.actions.push({ action: 'setFirstName', firstName: field.value });
            break;
          }
          case 'lastName': {
            this.actions.push({ action: 'setLastName', lastName: field.value });
            break;
          }
          case 'birthDate': {
            this.actions.push({ action: 'setDateOfBirth', dateOfBirth: field.value });
            break;
          }
          case 'email': {
            this.actions.push({ action: 'changeEmail', email: field.value });
            break;
          }
          default: {
            // hgf
          }
        }
      } else {
        // если измененное поле не инпут, то это адрес, добавляем его в действия
        this.actions.push(this.createChangedAddressData(field));
      }
    });
    this.changeDefaultAddresses();
    this.collectNewAddresses();
    this.sendUpdatedData(this.actions);
  }

  private createChangedAddressData(field: Element): MyCustomerUpdateAction {
    const data: MyCustomerUpdateAction = {
      action: 'changeAddress',
      addressId: field.id,
      address: {
        streetName: getInputValue('billingStreet', field),
        postalCode: getInputValue('billingPostalCode', field),
        city: getInputValue('billingCity', field),
        country: getInputValue('billingCountry', field),
      },
    };
    return data;
  }

  private collectNewAddresses(): void {
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
          this.actions.push(data);
        }
      });
    };

    processAddresses('.billing-address', 'billing');
    processAddresses('.shipping-address', 'shipping');
  }

  private async sendUpdatedData(actions: MyCustomerUpdateAction[]): Promise<void> {
    const isSuccessful = await customerService.updateCustomer(actions);
    if (isSuccessful) {
      modalWindowCreator.showModalWindow('info', 'Data updated successfully!');
      console.log(document.querySelector('.account__box'));
      const a = document.querySelector('.account__box');
      if (a) a.innerHTML = '';
      document.querySelector('.account__box')?.remove();
      // this.viewElementCreator.getElement().innerHTML = '';
      this.actions = [];
      this.defaultBillingAddress = undefined;
      this.defaultShippingAddress = undefined;
      this.getCustomerInfo();
    }
  }
}
