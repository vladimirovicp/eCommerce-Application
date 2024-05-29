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
        },
      })
      .execute();
    console.log('Products received:', response.body.results);
    return response.body.results;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return undefined;
  }
}
