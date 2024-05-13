import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import logoSrc from '../../../assets/img/svg/logo.svg';
import '../../../assets/scss/page/login.scss';
import { emailValidation, passwordValidation } from '../../util/validation-fuction';
import FormCreator from '../../util/form-creator';
import { makeAuthorizationCustomerDraft } from '../../api/customers-requests';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

class LoginPage extends View {
  protected formCreator: FormCreator;

  constructor(setLoginContent = true) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.formCreator = new FormCreator({
      classNames: ['form__login'],
      attributes: { action: '#' },
    });
    if (setLoginContent) {
      this.setContent();
    }
  }

  private setContent(): void {
    this.viewElementCreator.addInnerElements([this.createLoginBox()]);
  }

  private createLoginBox(): ElementCreator<HTMLElement> {
    const loginBox = new ElementCreator({
      tag: 'div',
      classNames: ['form', 'login__box'],
    });

    loginBox.addInnerElements([
      this.createFormTitle('Login'),
      this.createMessage(),
      this.createForm(),
      this.createLink('Register'),
    ]);

    return loginBox;
  }

  protected createFormTitle(textContent: string): ElementCreator<HTMLElement> {
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
      textContent,
    });

    formTitle.addInnerElements([logo, text]);
    return formTitle;
  }

  protected createMessage(): ElementCreator<HTMLElement> {
    const formTitle = new ElementCreator({
      tag: 'div',
      classNames: ['form__message'],
    });

    return formTitle;
  }

  protected createForm(): FormCreator {
    this.formCreator.addInnerElements([
      this.createFieldEmail(),
      this.createFieldPassword(),
      this.createButton('Login'),
    ]);
    return this.formCreator;
  }

  protected createFieldEmail(): ElementCreator<HTMLElement> {
    const fieldEmail = new ElementCreator({
      tag: 'div',
      classNames: ['form__field'],
    });

    const input = new InputCreator({
      type: 'email',
      attributes: { placeholder: 'Enter your email address', name: 'email', required: 'true' },
    });

    const error = this.addValidationErrorHandling(input, emailValidation);
    fieldEmail.addInnerElements([input, error]);

    return fieldEmail;
  }

  protected createFieldPassword(): ElementCreator<HTMLElement> {
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
      attributes: { name: 'password', placeholder: 'Enter your password', required: 'true' },
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

    const error = this.addValidationErrorHandling(input, passwordValidation);

    fieldEye.addInnerElements([input, btnEye]);
    fieldPassword.addInnerElements([fieldEye, error]);

    return fieldPassword;
  }

  protected addValidationErrorHandling(
    inputCreator: InputCreator,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string }
  ): ElementCreator<HTMLSpanElement> {
    const errorCreator = new ElementCreator({
      tag: 'span',
    });

    inputCreator.addValidation(validationFunction, errorCreator.getElement());
    this.formCreator.addValidationField(inputCreator);

    return errorCreator;
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
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          const formData = new FormData(form);
          const formDataObject: { [key: string]: string } = {};
          formData.forEach((value, key: string) => {
            formDataObject[key] = value as string;
          });
          this.handleSubmitForm(formDataObject);
        }
      },
    });

    fieldBtn.addInnerElements([input]);
    this.formCreator.addSubmitButton(input.getElement());
    return fieldBtn;
  }

  protected handleSubmitForm(formDataObject: { [key: string]: string }): void {
    if (formDataObject.email && formDataObject.password) {
      makeAuthorizationCustomerDraft(formDataObject);
    } else {
      // модальное окно с ошибкой? а нужен ли тут вообще этот блок?
      console.error('something went wrong, please try again');
    }
  }

  protected createLink(textContent: string): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator({
      tag: 'a',
      // attributes: { href: '/register' },
      textContent,
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}

export default LoginPage;
