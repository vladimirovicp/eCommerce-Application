import {
  CustomerDraft,
  MyCustomerSignin,
  Customer,
  ByProjectKeyRequestBuilder,
  MyCustomerUpdate,
  MyCustomerChangePassword,
} from '@commercetools/platform-sdk';
import modalWindowCreator from '../components/modal-window';
import { apiRoot, createApiRootPasswordFlow } from './build-client';

class CustomerService {
  public customerInfo: Customer | undefined;

  private apiRootPasswordFlow: ByProjectKeyRequestBuilder | undefined = undefined;

  public async authorizeCustomer(customerDraft: MyCustomerSignin): Promise<boolean> {
    try {
      const response = await apiRoot.me().login().post({ body: customerDraft }).execute();
      if (response && response.statusCode === 200) {
        const { id } = response.body.customer;
        this.customerInfo = response.body.customer;
        localStorage.setItem('userId', id);
        this.apiRootPasswordFlow = createApiRootPasswordFlow(customerDraft.email, customerDraft.password);
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
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Unknown error. Please try again later';
      modalWindowCreator.showModalWindow('error', `Registration failed: ${errorMessage}`);
      return false;
    }
  }

  public async getCustomerInfo(): Promise<null | Customer> {
    try {
      if (this.apiRootPasswordFlow) {
        const response = await this.apiRootPasswordFlow.me().get().execute();
        const customerInfo = response.body;
        return customerInfo;
      }
      return null;
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Unknown error. Please try again later';
      modalWindowCreator.showModalWindow('error', `Can't get customer profile: ${errorMessage}`);
      return null;
    }
  }

  public async updateCustomer(updateData: MyCustomerUpdate): Promise<boolean> {
    try {
      if (this.apiRootPasswordFlow) {
        const response = await this.apiRootPasswordFlow.me().post({ body: updateData }).execute();
        if (response.statusCode === 200) {
          return true;
        }
      }
      modalWindowCreator.showModalWindow('error', 'Unknown error. Please try again later');
      return false;
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Unknown error. Please try again later';
      modalWindowCreator.showModalWindow('error', `Can't update customer profile: ${errorMessage}`);
      return false;
    }
  }

  public async changePassword(updateData: MyCustomerChangePassword): Promise<boolean> {
    try {
      if (this.apiRootPasswordFlow) {
        const response = await this.apiRootPasswordFlow
          .me()
          .password()
          .post({
            body: updateData,
          })
          .execute();
        if (response.statusCode === 200) {
          // обновление апиРута и токенов (?)
          this.apiRootPasswordFlow = createApiRootPasswordFlow(response.body.email, updateData.newPassword);
          return true;
        }
      }
      // при ошибке модальное окно с инпутами  НЕ ЗАКРЫВАЕТСЯ меняется только текст сообщения
      modalWindowCreator.showModalWindow('error', 'Unknown error. Please try again later');
      return false;
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Unknown error. Please try again later';
      modalWindowCreator.showModalWindow('error', `Can't get customer profile: ${errorMessage}`);
      return false;
    }
  }

  public clearCustomerInfo(): void {
    localStorage.removeItem('userId');
    this.customerInfo = undefined;
  }
}

const customerService = new CustomerService();
export default customerService;
