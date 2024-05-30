import { Product } from '@commercetools/platform-sdk';
import { apiRoot } from './build-client';

export default async function getProducts(limit: number, offset: number): Promise<Product[] | undefined> {
  try {
    const response = await apiRoot
      .products()
      .get({
        queryArgs: {
          limit,
          offset,
          filter: 'masterVariant.prices.discounted',
          priceCurrency: 'USD',
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return undefined;
  }
}
