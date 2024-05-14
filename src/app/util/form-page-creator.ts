import logoSrc from '../../assets/img/svg/logo.svg';
import View from '../common/view';
import ElementCreator from './element-creator';
import InputCreator from './input-creator';
import { emailValidation, passwordValidation } from './validation-fuction';
import FormCreator from './form-creator';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

abstract class FormPageCreator extends View {
  protected formCreator: FormCreator;

  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.formCreator = new FormCreator({ ...params, tag: 'form' });
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
}

export default FormPageCreator;
