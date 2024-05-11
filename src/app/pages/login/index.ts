import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import logoSrc from '../../../assets/img/svg/logo.svg';
import '../../../assets/scss/page/login.scss';
import { emailValidation, passwordValidation } from '../../util/validation-fuction';
import FormCreator from '../../util/form-creator';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

class LoginPage extends View {
  private loginFormCreator: FormCreator;

  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.loginFormCreator = this.createForm();
    this.setContent();
  }

  setContent(): void {
    this.viewElementCreator.addInnerElements([this.createLoginBox()]);
  }

  private createLoginBox(): ElementCreator<HTMLElement> {
    const loginBox = new ElementCreator({
      tag: 'div',
      classNames: ['form', 'login__box'],
    });

    loginBox.addInnerElements([this.createFormTitle(), this.createMessage(), this.createForm(), this.createLink()]);

    return loginBox;
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
      textContent: 'Login',
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
    this.loginFormCreator = new FormCreator({
      classNames: ['form__login'],
      attributes: { action: '#' },
    });

    this.loginFormCreator.addInnerElements([this.createFieldEmail(), this.createFieldPassword(), this.createButton()]);
    return this.loginFormCreator;
  }

  private createFieldEmail(): ElementCreator<HTMLElement> {
    const fieldEmail = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'email',
      attributes: { placeholder: 'Enter your email address', required: 'true' },
    });

    const error = new ElementCreator({
      tag: 'span',
    });

    input.addValidation(emailValidation, error.getElement());
    this.loginFormCreator.addValidationField(input);
    fieldEmail.addInnerElements([input, error]);

    return fieldEmail;
  }

  /* eslint-disable max-lines-per-function */
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

    this.loginFormCreator.addValidationField(input);
    input.addValidation(passwordValidation, error.getElement());

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
      attributes: { value: 'Login', disabled: 'true' },
    });

    fieldBtn.addInnerElements([input]);
    this.loginFormCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }

  private createLink(): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator({
      tag: 'a',
      attributes: { href: '/register' },
      textContent: 'Register',
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}

export default LoginPage;
