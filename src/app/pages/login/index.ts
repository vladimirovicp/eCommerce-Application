import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import logoSrc from '../../../assets/img/svg/logo.svg';
import '../../../assets/scss/page/login.scss';

const imageSrc = {
  LOGO: `${logoSrc}`,
};

class LoginPage extends View {
  constructor() {
    const params = {
      tag: 'main',
      classNames: ['main', 'login-page'],
    };
    super(params);
    this.setContent();
  }

  setContent(): void {
    this.viewElementCreator.addInnerElements([this.createContainer()]);
  }

  createContainer(): ElementCreator<HTMLElement> {
    const container = new ElementCreator({
      tag: 'div',
      classNames: ['container'],
    });
    container.addInnerElements([this.createLoginBox()]);
    return container;
  }

  createLoginBox(): ElementCreator<HTMLElement> {
    const loginBox = new ElementCreator({
      tag: 'div',
      classNames: ['form', 'login__box'],
    });

    loginBox.addInnerElements([this.createFormTitle(), this.createMessage(), this.createForm(), this.createLink()]);

    return loginBox;
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
      textContent: 'Login',
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
      classNames: ['form__login'],
      attributes: { action: '#' },
    });
    form.addInnerElements([this.createFieldEmail(), this.createFieldPassword(), this.createButton()]);
    return form;
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
      attributes: { value: 'Login' },
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
      attributes: { href: '/register' },
      textContent: 'Register',
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}

export default LoginPage;
