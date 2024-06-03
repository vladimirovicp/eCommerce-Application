import { ProductProjection } from '@commercetools/platform-sdk';
import { apiRoot } from './build-client';

export default async function updateProducts(
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
          ...(searchValue ? { 'text.en-GB': searchValue } : {}),
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return undefined;
  }
}
