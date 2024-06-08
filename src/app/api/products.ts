import { Cart, ProductProjection } from '@commercetools/platform-sdk';
import { apiRoot, apiRoots } from './build-client';

// interface Cart {
//   id: string;
//   version: number;
//   products: LineItem[];
// }

export async function updateProducts(
  limit: number,
  offset: number,
  category: string,
  sort: string,
  filters?: { [key: string]: string[] },
  searchValue?: string
): Promise<ProductProjection[] | undefined> {
  try {
    const query: string[] = [];

    if (category) query.push(`categories.id:"${category}"`);
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key].length > 0) {
          const values = filters[key].map((value) => `"${value}"`).join(', ');
          query.push(`variants.attributes.${key}:${values}`);
        }
      });
    }
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit,
          offset,
          'filter.query': query,
          sort,
          ...(searchValue ? { 'text.en-GB': `${searchValue}` } : {}),
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return undefined;
  }
}

export async function getTheCart(): Promise<Cart | undefined> {
  // let cart: Cart;
  const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;
  // получить корзину
  if (currentApiRoot) {
    try {
      const response = await currentApiRoot.me().activeCart().get().execute();
      // cart = { id: response.body.id, version: response.body.version, products: response.body.lineItems };
      return response.body;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 404) {
        // создаём новую корзину
        try {
          const response = await currentApiRoot
            .me()
            .carts()
            .post({
              body: {
                currency: 'USD',
              },
            })
            .execute();
          // cart = { id: response.body.id, version: response.body.version, products: response.body.lineItems };
          return response.body;
        } catch (createError) {
          console.error('Error creating new cart:', createError);
        }
      } else {
        console.error('Error retrieving active cart:', error);
      }
    }
  }
  return undefined;
}
