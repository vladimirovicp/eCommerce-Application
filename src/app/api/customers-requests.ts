import { BaseAddress, CustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import apiRoot from './build-client';

async function registerNewCustomer(customerDraft: CustomerDraft): Promise<void> {
  try {
    const response = await apiRoot.customers().post({ body: customerDraft }).execute();
    console.log('Customer created successfully:', response);
    // return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export function makeRegistrationCustomerDraft(formData: { [key: string]: string }): void {
  const billingAddress: BaseAddress = {
    country: formData.billingCountry ?? '',
    streetName: formData.billingStreet ?? '',
    postalCode: formData.billingPostalCode ?? '',
    city: formData.billingCity ?? '',
  };

  const shippingAddress: BaseAddress = {
    country: formData.shippingCountry ?? '',
    streetName: formData.shippingStreet ?? '',
    postalCode: formData.shippingPostalCode ?? '',
    city: formData.shippingCity ?? '',
  };

  const customerDraft: CustomerDraft = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName ?? '',
    lastName: formData.lastName ?? '',
    dateOfBirth: formData.birthDate ?? '',
    addresses: [billingAddress, shippingAddress],
    defaultShippingAddress: 1,
  };

  registerNewCustomer(customerDraft);
}

async function authorizeCustomer(customerDraft: MyCustomerSignin): Promise<void> {
  try {
    const response = await apiRoot.me().login().post({ body: customerDraft }).execute();
    console.log('Customer is authorized', response);
    // return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export function makeAuthorizationCustomerDraft(formData: { [key: string]: string }): void {
  const customerDraft: MyCustomerSignin = {
    email: formData.email,
    password: formData.password,
  };

  authorizeCustomer(customerDraft);
}
