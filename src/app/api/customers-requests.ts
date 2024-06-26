import {
  CustomerDraft,
  MyCustomerSignin,
  Customer,
  MyCustomerUpdate,
  MyCustomerChangePassword,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import modalWindowCreator from '../components/modal-window';
import { apiRoot, apiRoots, createApiRootRefreshTokenFlow, fetchAnonymousToken, fetchAuthToken } from './build-client';
import { addProductsToCart, getTheCart } from './products';

enum ErrorMessages {
  authorize = 'Authorization failed:',
  register = 'Registration failed:',
  getInfo = "Can't get customer profile:",
  updateInfo = "Can't update customer profile:",
}

class CustomerService {
  public async authorizeCustomer(customerDraft: MyCustomerSignin): Promise<boolean> {
    try {
      const response = await apiRoot.me().login().post({ body: customerDraft }).execute();
      if (response && response.statusCode === 200) {
        const actions = await this.copyCart();
        const token = await fetchAuthToken(customerDraft.email, customerDraft.password);
        createApiRootRefreshTokenFlow(token);
        if (actions) addProductsToCart(actions);
        return true;
      }
      modalWindowCreator.showModalWindow('error', 'Authorization failed. Please try again.');
      return false;
    } catch (error) {
      this.handleError(ErrorMessages.authorize, error);
      return false;
    }
  }

  private async copyCart(): Promise<CartUpdateAction[] | undefined> {
    const cart = await getTheCart();
    if (cart && cart.lineItems.length > 0) {
      const actions: CartUpdateAction[] = cart.lineItems.map((item) => ({
        action: 'addLineItem',
        productId: item.productId,
        quantity: item.quantity,
      }));
      return actions;
    }
    return undefined;
  }

  public async registerNewCustomer(customerDraft: CustomerDraft): Promise<boolean> {
    try {
      await apiRoot.customers().post({ body: customerDraft }).execute();
      // авторизуем пользователя после регистрации автоматически, хотя это не рекомендуется для безопасности
      await this.authorizeCustomer({
        email: customerDraft.email,
        password: customerDraft.password!,
      });
      return true;
    } catch (error) {
      this.handleError(ErrorMessages.register, error);
      return false;
    }
  }

  public async getCustomerInfo(): Promise<null | Customer> {
    try {
      if (apiRoots.byRefreshToken) {
        const response = await apiRoots.byRefreshToken.me().get().execute();
        const customerInfo = response.body;
        return customerInfo;
      }
      return null;
    } catch (error) {
      this.handleError(ErrorMessages.getInfo, error);
      return null;
    }
  }

  public async updateCustomer(updateData: MyCustomerUpdate): Promise<boolean> {
    try {
      if (apiRoots.byRefreshToken) {
        const response = await apiRoots.byRefreshToken.me().post({ body: updateData }).execute();
        if (response.statusCode === 200) {
          return true;
        }
      }
      modalWindowCreator.showModalWindow('error', 'Unknown error. Please try again later');
      return false;
    } catch (error) {
      this.handleError(ErrorMessages.updateInfo, error);
      return false;
    }
  }

  public async changePassword(updateData: MyCustomerChangePassword): Promise<boolean> {
    try {
      if (apiRoots.byRefreshToken) {
        const response = await apiRoots.byRefreshToken
          .me()
          .password()
          .post({
            body: updateData,
          })
          .execute();
        if (response.statusCode === 200) {
          // обновление апиРута и токенов
          const refreshToken = await fetchAuthToken(response.body.email, updateData.newPassword);
          createApiRootRefreshTokenFlow(refreshToken);
          return true;
        }
      }
      // при ошибке модальное окно с инпутами  НЕ ЗАКРЫВАЕТСЯ меняется только текст сообщения
      modalWindowCreator.showModalWindow('error', 'Unknown error. Please try again later');
      return false;
    } catch (error) {
      this.handleError(ErrorMessages.getInfo, error);
      return false;
    }
  }

  public async clearCustomerInfo(): Promise<void> {
    localStorage.removeItem('refresh_token');
    await fetchAnonymousToken();
    await getTheCart();
  }

  private handleError(message: ErrorMessages, error: unknown): void {
    if (error instanceof Error && 'code' in error && error.code === 401) {
      this.clearCustomerInfo();
      window.location.reload();
      modalWindowCreator.showModalWindow('error', `Your session has expired. Please log in again`);
    }
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? error.message
        : 'Unknown error. Please try again later';
    modalWindowCreator.showModalWindow('error', `${message} ${errorMessage}`);
  }
}

const customerService = new CustomerService();
export default customerService;
