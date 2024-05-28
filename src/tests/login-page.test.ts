import HeaderView from '../app/components/header/header';
import LoginPage from '../app/pages/login';
import { Pages } from '../app/router/pages';
import Router from '../app/router/router';
import customerService from '../app/api/customers-requests';
import modalWindowCreator from '../app/components/modal-window';

jest.mock('../app/components/modal-window', () => ({
  showModalWindow: jest.fn(),
}));

jest.mock('../app/api/customers-requests', () => ({
  default: {
    authorizeCustomer: jest.fn(() => Promise.resolve(true)),
  },
}));

describe('LoginPage testing', () => {
  let router: Router;
  let header: HeaderView;
  let loginPage: LoginPage;

  beforeEach(() => {
    const routes = [
      {
        path: `${Pages.HOME}`,
        callback: jest.fn(),
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: jest.fn(),
      },
    ];
    router = new Router(routes);
    header = new HeaderView(router);
    jest.spyOn(router, 'navigate').mockImplementation();
    jest.spyOn(header, 'isLoggedIn').mockImplementation();
    loginPage = new LoginPage(router, header);
  });

  it('should initialize with given router and header', () => {
    expect(loginPage.router).toBe(router);
    expect(loginPage['header']).toBe(header);
  });

  it('should navigate to home page on successful login and initialize modal window', async () => {
    const formData = { email: 'user@example.com', password: 'password123' };
    await loginPage['handleSubmitForm'](formData);
    expect(customerService.authorizeCustomer).toHaveBeenCalledWith({
      email: formData.email,
      password: formData.password,
    });
    expect(modalWindowCreator.showModalWindow).toHaveBeenCalledWith('info', 'Authorization successful!');
    expect(router.navigate).toHaveBeenCalledWith(Pages.HOME);
    expect(header.isLoggedIn).toHaveBeenCalled();
  });

  it('should create a login form with elements', () => {
    const form = loginPage['createForm']();
    expect(form).toBeDefined();
    expect(form.getElement().querySelector('input[type="email"]')).not.toBeNull();
    expect(form.getElement().querySelector('input[type="password"]')).not.toBeNull();
    expect(form.getElement().querySelector('input[type="button"]')).not.toBeNull();
  });

  it('should create a registration link and handle its navigation', () => {
    const link = loginPage['createLink']('Register', Pages.REGISTRATION);
    expect(link.getElement()).toHaveTextContent('Register');
    link.getElement().dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(Pages.REGISTRATION);
    }, 0);
  });
});
