export enum SortParameters {
  'name.en-GB asc' = 'Alphabetically, A-Z',
  'name.en-GB desc' = 'Alphabetically, Z-A',
  'variants.attributes.discount-price asc' = 'Price, low to high',
  'variants.attributes.discount-price desc' = 'Price, high to low',
}

export enum Categories {
  'Show all' = '',
  'Youth Bikes' = 'af205cea-c574-49fd-9d83-4f1daa2f4edc',
  'Hardtail Bikes' = 'f8375995-f174-4e8a-a3e4-bea3b402c725',
  'Road Bikes' = '34c9a93e-cc3d-4495-bbfe-ad10edc02adb',
  'Dual Suspension Mountain Bikes' = 'b7bf9e66-3831-425a-96d2-3752598ede46',
  'Electric Dual Suspension Mountain Bikes' = '8a42fd4e-8279-454a-8bc9-ed68a79103f8',
}

export const CategoriesReverse = Object.fromEntries(Object.entries(Categories).map(([key, value]) => [value, key]));

export interface FilterParameter {
  name: string;
  title: string;
  filterItems: string[];
}

export const FilterParameters: FilterParameter[] = [
  { name: 'brand', title: 'Brand', filterItems: ['Apollo', 'BMC', 'Marin', 'Merida', 'Norco', 'Radius'] },
  { name: 'wheel-size', title: 'Wheel size', filterItems: ['24', '27.5', '29', '700'] },
  {
    name: 'brake-type',
    title: 'Brake type',
    filterItems: ['hydraulic disc brakes', 'mechanical disc brakes', 'v-brakes'],
  },
];
