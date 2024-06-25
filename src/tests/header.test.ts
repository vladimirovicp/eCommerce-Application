import customerService from '../app/api/customers-requests';
import HeaderView from '../app/components/header/header';
import modalWindowCreator from '../app/components/modal-window';
import { Pages } from '../app/router/pages';
import Router from '../app/router/router';
import { adaptiveCloseMenu } from '../app/util/helper';

jest.mock('../app/router/router', () => {
  return jest.fn().mockImplementation(() => {
    return {
      navigate: jest.fn(),
    };
  });
});

jest.mock('../app/util/helper', () => {
  return {
    adaptiveCloseMenu: jest.fn(),
  };
});

jest.mock('../app/api/customers-requests');

describe('Header test', () => {
  const router = new Router([]);
  const header = new HeaderView(router);
  const headerElement = header['viewElementCreator'].getElement();
  jest.spyOn(modalWindowCreator, 'createButton').mockImplementation((callback) => {
    callback(undefined);
  });
  jest.spyOn(modalWindowCreator, 'showModalWindow');

  it('should contain basic elements', () => {
    const logo = headerElement.querySelector('.header__logo');
    const menu = headerElement.querySelector('.header__menu');
    const links = headerElement.querySelector('.header__links-list');
    expect(logo).toBeDefined();
    expect(menu).toBeDefined();
    expect(links).toBeDefined();
  });

  it('should call callback with correct page on CATALOG link click', () => {
    const homeLink = headerElement.querySelectorAll('.header__nav-link');
    const catalogLink = homeLink[1] as HTMLAnchorElement;

    expect(catalogLink).toBeInstanceOf(HTMLAnchorElement);
    catalogLink.click();
    expect(router.navigate).toHaveBeenCalledWith(Pages.CATALOG);
    expect(adaptiveCloseMenu).toHaveBeenCalled();
  });

  it('should change links when calling a method isLoggedIn', () => {
    header.isLoggedIn();
    const loginProfileLink = headerElement.querySelector('#login-profile-link');
    const registrationLogoutLink = headerElement.querySelector('#registration-logout-link');

    expect(loginProfileLink).toBeDefined();
    expect(registrationLogoutLink).toBeDefined();
    expect(loginProfileLink).toHaveTextContent('profile');
    expect(registrationLogoutLink).toHaveTextContent('logout');
  });

  it('should log out the user and redirect to the main page', () => {
    const mockIsLoggedOut = jest.spyOn(header, 'isLoggedOut');
    const registrationLogoutLink = headerElement.querySelector('#registration-logout-link') as HTMLAnchorElement;
    registrationLogoutLink.click();

    expect(modalWindowCreator.showModalWindow).toHaveBeenCalledWith('standart', 'Do you want to log out?');
    expect(modalWindowCreator.createButton).toHaveBeenCalledTimes(1);

    expect(customerService.clearCustomerInfo).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(Pages.HOME);
    expect(mockIsLoggedOut).toHaveBeenCalledTimes(1);
    mockIsLoggedOut.mockRestore();
  });

  it('should change links when calling a method isLoggedOut', () => {
    header.isLoggedOut();
    const loginProfileLink = headerElement.querySelector('#login-profile-link');
    const registrationLogoutLink = headerElement.querySelector('#registration-logout-link');

    expect(loginProfileLink).toBeDefined();
    expect(registrationLogoutLink).toBeDefined();
    expect(loginProfileLink).toHaveTextContent('login');
    expect(registrationLogoutLink).toHaveTextContent('register');
  });
});
