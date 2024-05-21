import { MyCustomerSignin } from '@commercetools/platform-sdk';
import ElementCreator from '../../util/element-creator';
import '../../../assets/scss/page/login.scss';
import FormCreator from '../../util/form-creator';
import { customerService } from '../../api/customers-requests';
import FormPageCreator from '../../util/form-page-creator';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import InputCreator from '../../util/input-creator';
import modalWindowCreator from '../../components/modal-window';
import HeaderView from '../../components/header/header';

class LoginPage extends FormPageCreator {
  protected formCreator: FormCreator;

  private header: HeaderView;

  router: Router;

  constructor(router: Router, header: HeaderView) {
    super();
    this.formCreator = new FormCreator({
      classNames: ['form__login'],
      // attributes: { action: '#' },
    });
    this.setContent();
    this.router = router;
    this.header = header;
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
      this.createLink('Register', `${Pages.REGISTRATION}`),
    ]);

    return loginBox;
  }

  protected createForm(): FormCreator {
    this.formCreator.addInnerElements([
      this.createFieldEmail(),
      this.createFieldPassword(),
      this.createButton('Login'),
    ]);
    return this.formCreator;
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
        const form = document.querySelector('form');
        if (form !== null && form instanceof HTMLFormElement) {
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

  protected async handleSubmitForm(formData: { [key: string]: string }): Promise<void> {
    const customerDraft: MyCustomerSignin = {
      email: formData.email,
      password: formData.password,
    };

    const isAuthorized = await customerService.authorizeCustomer(customerDraft);
    if (isAuthorized) {
      modalWindowCreator.showModalWindow('info', 'Authorization successful!');
      this.router.navigate(Pages.HOME);
      this.header.isLoggedIn();
      // перенаправление на главную страницу, изменение ссылок в header
    }
  }

  protected createLink(textContent: string, page: string): ElementCreator<HTMLElement> {
    const linkBox = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      classNames: ['form__link'],
    });

    const link = new ElementCreator<HTMLAnchorElement>({
      tag: 'a',
      textContent,
      callback: (): void => {
        this.router.navigate(page);
      },
    });

    linkBox.addInnerElements([link]);
    return linkBox;
  }
}

export default LoginPage;
