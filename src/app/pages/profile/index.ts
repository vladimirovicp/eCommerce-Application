import {
  Customer,
  MyCustomerAddAddressAction,
  MyCustomerChangePassword,
  MyCustomerUpdate,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import '../../../assets/scss/page/account.scss';
import './index.scss';
import customerService from '../../api/customers-requests';
import modalWindowCreator from '../../components/modal-window';
import ElementCreator from '../../util/element-creator';
import FormCreator from '../../util/form-creator';
import FormPageCreator from '../../util/form-page-creator';
import { getInputValue } from '../../util/helper';
import InputCreator from '../../util/input-creator';
import { InputParams } from '../../util/types';

export default class ProfilePage extends FormPageCreator {
  // ужасно разросшийся класс, стоило бы разделить визуал и функционал, но где же на это время...
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
    this.viewElementCreator.getElement().replaceChildren(box.getElement());
  }

  private createPersonalInfoForm(): FormCreator {
    this.formCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createBirthDate(),

      this.createFieldsTitle('Address'),
      this.fillAddressForm(),

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

    const buttonContainer = new ElementCreator({ classNames: ['form__field', 'form__button'] });
    const changePasswordButton = new InputCreator({
      type: 'button',
      attributes: { value: 'Change password', disabled: 'true' },
      callback: (): Promise<void> => this.changePassword(form.getElement()),
    });
    buttonContainer.addInnerElements([changePasswordButton]);
    form.addSubmitButton(changePasswordButton.getElement());

    form.addInnerElements([message1, currentPasswordField, message2, newPasswordField, buttonContainer]);

    modalWindowCreator.addInnerElements([form]);
  }

  private async changePassword(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key: string) => {
      formDataObject[key] = value as string;
    });

    if (this.customerInfo) {
      const updateData: MyCustomerChangePassword = {
        version: this.customerInfo?.version,
        currentPassword: formDataObject.currentPassword,
        newPassword: formDataObject.newPassword,
      };
      const isSuccessful = await customerService.changePassword(updateData);
      if (isSuccessful) {
        modalWindowCreator.closeModalWindow();
        modalWindowCreator.showModalWindow('info', 'Password changed successfully');
        this.reloadProfile();
      }
    }
  }

  private fillAddressForm(): ElementCreator<HTMLDivElement> {
    const addressesContainer = new ElementCreator<HTMLDivElement>({ classNames: ['addresses-container'] });
    if (this.customerInfo) {
      this.customerInfo.addresses.forEach((address) => {
        if (address.id) {
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

  private createEditElement(addressContainer: HTMLDivElement, id: string | undefined): ElementCreator<HTMLDivElement> {
    const countrySelector = addressContainer.querySelector('select');
    const editElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-edit'],
      callback: (): void => {
        if (id && countrySelector) {
          countrySelector.disabled = false;
          countrySelector.dispatchEvent(new Event('change'));
          this.formCreator.checkFormValidity();
        }
        addressContainer.classList.add('changed');
      },
    });
    return editElementCreator;
  }

  private createDeleteElement(
    addressContainer: ElementCreator<HTMLDivElement>,
    id: string | undefined,
    addressKey: string
  ): ElementCreator<HTMLDivElement> {
    const deleteElementCreator = new ElementCreator<HTMLDivElement>({
      classNames: ['form__field-delete'],
      callback: (): void => {
        modalWindowCreator.showModalWindow('standart', 'Would you like to remove this address?');
        modalWindowCreator.createButton(() => {
          addressContainer.getElement().remove();
          this.formCreator.checkFormValidity();
          if (id) {
            this.actions.push({
              action: 'removeAddress',
              addressId: id,
            });
          } else if (addressKey) {
            // если новый адрес был установлен как дефолтный - отменяем эту установку
            if (this.defaultBillingAddress && addressKey === this.defaultBillingAddress.key) {
              this.defaultBillingAddress = undefined;
            }
            if (this.defaultShippingAddress && addressKey === this.defaultShippingAddress.key) {
              this.defaultShippingAddress = undefined;
            }
          }
        }, 'Yes!');
      },
    });
    return deleteElementCreator;
  }

  protected createAddressGroup(isBilling: boolean = true, id?: string): ElementCreator<HTMLDivElement> {
    const addressContainer = super.createAddressGroup(isBilling, id, Boolean(id));
    const countrySelector = addressContainer.getElement().querySelector('select');
    let addressKey: string = '';
    if (id) {
      // делаем поле адреса изначально disabled
      if (countrySelector) countrySelector.disabled = true;
    } else {
      // для новых адресов - уникальный идентификатор на основе времени
      addressKey = new Date().getTime().toString();
      addressContainer.getElement().setAttribute('data-address-key', addressKey);
    }
    const editElementCreator = this.createEditElement(addressContainer.getElement(), id);
    const deleteElementCreator = this.createDeleteElement(addressContainer, id, addressKey);
    addressContainer.getElement().prepend(editElementCreator.getElement(), deleteElementCreator.getElement());
    addressContainer.addInnerElements([this.createDefaultAddressRadioButtons(id ?? addressKey, Boolean(id))]);
    return addressContainer;
  }

  private createDefaultAddressRadioButtons(idKey: string, isID: boolean): ElementCreator<HTMLDivElement> {
    const radioButtonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['form__fields'] });

    const createRadioButton = (type: 'billing' | 'shipping', id: string): ElementCreator<HTMLDivElement> => {
      const radioButton = new ElementCreator<HTMLDivElement>({ classNames: ['radio-button', 'form__field'] });
      const input = new InputCreator({
        type: 'radio',
        id: `default${type}${id}`,
        attributes: { name: `default${type}` },
      });
      const label = input.createLabel(`Set as a default ${type} address`);

      input.getElement().addEventListener('change', () => {
        this[type === 'billing' ? 'defaultBillingAddress' : 'defaultShippingAddress'] = { [isID ? 'id' : 'key']: id };
        this.formCreator.checkFormValidity();
      });

      // Устанавливаем checked, если это текущий дефолтный адрес
      if (id === this.customerInfo?.[type === 'billing' ? 'defaultBillingAddressId' : 'defaultShippingAddressId']) {
        input.getElement().checked = true;
      }

      radioButton.addInnerElements([input, label]);
      return radioButton;
    };

    const billingRadioButton = createRadioButton('billing', idKey);
    const shippingRadioButton = createRadioButton('shipping', idKey);
    radioButtonContainer.addInnerElements([billingRadioButton, shippingRadioButton]);

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

  protected createFormField(
    params: InputParams,
    validationHandler: (value: string) => { isValid: boolean; errorMessage: string }
  ): ElementCreator<HTMLElement> {
    const field = super.createFormField(params, validationHandler, true);
    const input = field.getElement().firstElementChild;

    if (input instanceof HTMLInputElement && this.customerInfo && params.attributes) {
      const value = this.customerInfo[params.attributes.name as keyof typeof this.customerInfo];
      if (typeof value === 'string') {
        input.value = value;
      }
      input.disabled = true;
      const editElement = this.addEditElement(input);
      field.getElement().prepend(editElement);
    }
    return field;
  }

  private createButton(textContent: string, callback: () => void): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
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
          case 'dateOfBirth': {
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
    this.collectNewAddresses();
    this.changeDefaultAddresses();
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
    document.querySelectorAll('.billing-address').forEach((address) => {
      // выполнить для всех адресов без id, т е новых
      if (!address.id) {
        const data: MyCustomerAddAddressAction = {
          action: 'addAddress',
          address: {
            key: address.getAttribute('data-address-key') ?? '',
            streetName: getInputValue(`billingStreet`, address),
            postalCode: getInputValue(`billingPostalCode`, address),
            city: getInputValue(`billingCity`, address),
            country: getInputValue(`billingCountry`, address),
          },
        };
        this.actions.push(data);
      }
    });
  }

  private async sendUpdatedData(actions: MyCustomerUpdateAction[]): Promise<void> {
    if (this.customerInfo) {
      const updateData: MyCustomerUpdate = {
        version: this.customerInfo.version,
        actions,
      };
      const isSuccessful = await customerService.updateCustomer(updateData);
      if (isSuccessful) {
        modalWindowCreator.showModalWindow('info', 'Data updated successfully!');
        // сбрасываем все на ноль, перезагружаем профиль
        this.reloadProfile();
      }
    }
  }

  private reloadProfile(): void {
    this.formCreator.getElement().innerHTML = '';
    this.actions = [];
    this.defaultBillingAddress = undefined;
    this.defaultShippingAddress = undefined;
    this.getCustomerInfo();
  }
}
