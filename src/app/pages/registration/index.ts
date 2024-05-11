import '../../../assets/scss/page/home.scss';
import View from '../../common/view';
import InputCreator from '../../util/input-creator';
import ElementCreator from '../../util/element-creator';
import logoSrc from '../../../assets/img/svg/logo.svg';
import '../../../assets/scss/page/register.scss';
import { typeTextToDate, typeDateToText } from '../../util/converter-input';
import countryData from '../../util/data';
import FormCreator from '../../util/form-creator';
import {
  addressValidation,
  birthDateValidation,
  emailValidation,
  nameValidation,
  passwordValidation,
} from '../../util/validation-fuction';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

export default class RegistrationPage extends View {
  private registrationFormCreator: FormCreator;

  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.registrationFormCreator = new FormCreator({
      classNames: ['form__register'],
      attributes: { action: '#' },
    });
    this.setContent();
  }

  public setContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([this.createFormTitle(), this.createMessage(), this.createForm(), this.createLink()]);
    this.viewElementCreator.addInnerElements([box]);
  }

  private createFormTitle(): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      tag: 'div',
      classNames: ['form__title'],
    });
    const logo = new ElementCreator({
      tag: 'span',
      classNames: ['form__title-logo'],
    });
    const logoImg = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: imageSrc.LOGO,
        alt: 'logo',
      },
    });

    logo.addInnerElements([logoImg]);

    const text = new ElementCreator({
      tag: 'span',
      classNames: ['form__title-text'],
      textContent: 'Register',
    });

    formTitle.addInnerElements([logo, text]);
    return formTitle;
  }

  private createMessage(): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      tag: 'div',
      classNames: ['form__message'],
    });

    return formTitle;
  }

  private createForm(): FormCreator {
    this.registrationFormCreator.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createbirthDate(),
      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Shipping adress'),
      this.createFields(this.createCountry(), this.createCity()),
      this.createFields(this.createPostalCode(), this.createStreet()),
      this.createCheckboxAddress(),
      this.createFieldsTitle('Choose password'),
      this.createFieldPassword(),
      this.createButton(),
    ]);

    return this.registrationFormCreator;
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

  private createFieldEmail(): ElementCreator<HTMLElement> {
    const fieldEmail = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'email',
      attributes: { placeholder: 'Enter your e-mail', required: 'true' },
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(emailValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

    fieldEmail.addInnerElements([input, error]);

    return fieldEmail;
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

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(nameValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

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

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(nameValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

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

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(birthDateValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  /* eslint-disable max-lines-per-function */
  private createCountry(): ElementCreator<HTMLElement> {
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
        const addressFields = document.querySelectorAll('.address-field');
        addressFields.forEach((addressField) => {
          if (addressField instanceof HTMLInputElement) {
            const inputfield = addressField;
            inputfield.disabled = false;
          }
        });
      },
      { once: true }
    );

    // countryData

    const error = new ElementCreator({
      tag: 'span',
    });

    field.addInnerElements([select, error]);
    return field;
  }

  private createCity(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'city', required: 'true', disabled: 'true' },
      classNames: ['address-field'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createStreet(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'street', required: 'true', disabled: 'true' },
      classNames: ['address-field'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createPostalCode(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'postal code', required: 'true', disabled: 'true' },
      classNames: ['address-field'],
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(addressValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);

    field.addInnerElements([input, error]);

    return field;
  }

  private createCheckboxAddress(): ElementCreator<HTMLElement> {
    const field = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'checkbox',
      id: 'check-address',
    });

    const label = input.createLabel('Set as default address', 'check-address');
    field.addInnerElements([input, label]);

    return field;
  }

  private createFieldPassword(): ElementCreator<HTMLElement> {
    const fieldPassword = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'field__password'],
    });

    const fieldEye = new ElementCreator({
      tag: 'div',
      classNames: ['form__field-eye'],
    });

    const input = new InputCreator({
      type: 'password',
      classNames: ['password'],
      attributes: { placeholder: 'Enter your password', required: 'true' },
    });

    const btnEye = new ElementCreator({
      tag: 'div',
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
    const error = new ElementCreator({
      tag: 'span',
      classNames: ['password'],
    });
    input.addValidation(passwordValidation, error.getElement());
    this.registrationFormCreator.addValidationField(input);
    fieldEye.addInnerElements([input, btnEye]);
    fieldPassword.addInnerElements([fieldEye, error]);
    return fieldPassword;
  }

  private createButton(): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: 'Register', disabled: 'true' },
    });

    this.registrationFormCreator.addSubmitButton(input.getElement());

    fieldBtn.addInnerElements([input]);
    return fieldBtn;
  }

  private createLink(): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator({
      tag: 'a',
      attributes: { href: '#login' },
      textContent: 'LogIn',
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}
