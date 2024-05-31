import { ProductProjection } from '@commercetools/platform-sdk';
import { apiRoot } from './build-client';

// export async function getProducts(limit: number, offset: number): Promise<ProductProjection[] | undefined> {
//   try {
//     const response = await apiRoot
//       .productProjections()
//       .get({
//         queryArgs: {
//           limit,
//           offset,
//           filter: 'masterVariant.prices.discounted',
//           priceCurrency: 'USD',
//         },
//       })
//       .execute();
//     return response.body.results;
//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//     return undefined;
//   }
// }

export default async function updateProducts(
  limit: number,
  offset: number,
  category: string,
  filters?: { [key: string]: string[] }
): Promise<ProductProjection[] | undefined> {
  try {
    const query: string[] = [`categories.id:"${category}"`];
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
        },
      })
      .execute();

    return response.body.results;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return undefined;
  }
}
