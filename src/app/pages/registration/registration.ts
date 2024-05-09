import '../../../assets/scss/page/home.scss';
import View from '../../common/view';
import InputCreator from '../../util/input-creator';
import ElementCreator from '../../util/element-creator';
import logoSrc from '../../../assets/img/svg/logo.svg';
import '../../../assets/scss/page/register.scss';
import { typeTextToDate, typeDateToText } from '../../util/converter-input';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

export default class RegistrationPage extends View {
  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.setContent();
  }

  setContent(): void {
    const box = new ElementCreator({ classNames: ['form', 'register__box'] });
    box.addInnerElements([this.createFormTitle(), this.createMessage(), this.createForm(), this.createLink()]);
    this.viewElementCreator.addInnerElements([box]);
  }

  createFormTitle(): ElementCreator<HTMLElement> {
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

  createMessage(): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      tag: 'div',
      classNames: ['form__message'],
    });

    return formTitle;
  }

  createForm(): ElementCreator<HTMLElement> {
    const form = new ElementCreator({
      tag: 'form',
      classNames: ['form__register'],
      attributes: { action: '#' },
    });
    form.addInnerElements([
      this.createFieldsTitle('Personal info'),
      this.createFieldEmail(),
      this.createFields(this.createFirstName(), this.createLastName()),
      this.createbirthDate(),
      this.createFieldsTitle('Address'),
      this.createFieldsSubTitle('Shipping adress'),
      this.createFieldPassword(),
      this.createButton(),
    ]);
    return form;
  }

  createFieldsTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-title'],
    });
  }

  createFieldsSubTitle(text: string): ElementCreator<HTMLElement> {
    return new ElementCreator({
      textContent: text,
      classNames: ['form__fields-sub-title'],
    });
  }

  createFields(
    fieldOne: ElementCreator<HTMLElement>,
    fieldTwo: ElementCreator<HTMLElement>
  ): ElementCreator<HTMLElement> {
    const fields = new ElementCreator({
      classNames: ['form__fields'],
    });

    fields.addInnerElements([fieldOne, fieldTwo]);

    return fields;
  }

  createFieldEmail(): ElementCreator<HTMLElement> {
    const fieldEmail = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'email',
      attributes: { placeholder: 'Enter your password', required: 'true' },
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    fieldEmail.addInnerElements([input, error]);

    return fieldEmail;
  }

  createFirstName(): ElementCreator<HTMLElement> {
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

    field.addInnerElements([input, error]);

    return field;
  }

  createLastName(): ElementCreator<HTMLElement> {
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

    field.addInnerElements([input, error]);

    return field;
  }

  createbirthDate(): ElementCreator<HTMLElement> {
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

    field.addInnerElements([input, error]);

    return field;
  }

  createFieldPassword(): ElementCreator<HTMLElement> {
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
    });

    const error = new ElementCreator({
      tag: 'span',
      classNames: ['password'],
    });

    fieldEye.addInnerElements([input, btnEye]);
    fieldPassword.addInnerElements([fieldEye, error]);

    return fieldPassword;
  }

  createButton(): ElementCreator<HTMLElement> {
    const fieldBtn = new ElementCreator({
      tag: 'div',
      classNames: ['form__field', 'form__button'],
    });

    const input = new InputCreator({
      type: 'button',
      attributes: { value: 'Register' },
    });

    fieldBtn.addInnerElements([input]);
    return fieldBtn;
  }

  createLink(): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator({
      tag: 'a',
      attributes: { href: '/login' },
      textContent: 'LogIn',
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}
