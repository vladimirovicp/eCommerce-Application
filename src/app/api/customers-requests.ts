import { CustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import modalWindowCreator from '../components/modal-window';
import apiRoot from './build-client';

export async function authorizeCustomer(customerDraft: MyCustomerSignin): Promise<boolean> {
  try {
    const response = await apiRoot.me().login().post({ body: customerDraft }).execute();
    if (response && response.statusCode === 200) {
      const { id } = response.body.customer;
      localStorage.setItem('userId', id);
      return true;
    }
    modalWindowCreator.showModalWindow('error', 'Authorization failed. Please try again.');
    return false;
  } catch (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? error.message
        : 'Unknown error. Please try again later';
    modalWindowCreator.showModalWindow('error', `${errorMessage}`);
    return false;
  }
}

export async function registerNewCustomer(customerDraft: CustomerDraft): Promise<boolean> {
  try {
    await apiRoot.customers().post({ body: customerDraft }).execute();
    // авторизуем пользователя после регистрации автоматически, хотя это не рекомендуется для безопасности
    await authorizeCustomer({
      email: customerDraft.email,
      password: customerDraft.password!,
    });
    return true;
  } catch (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? error.message
        : 'Unknown error. Please try again later';
    modalWindowCreator.showModalWindow('error', `Registration failed: ${errorMessage}`);
    return false;
  }
}
