import Router from '../../app/router/router';
import CatalogPage from '../../app/pages/catalog';
import SecondaryMenu from '../../app/components/secondary-menu';
import { ProductProjection } from '@commercetools/platform-sdk';
import { getTheCart } from '../../app/api/products';
import CatalogCard from '../../app/pages/catalog/card';
import ElementCreator from '../../app/util/element-creator';
import InputCreator from '../../app/util/input-creator';

jest.mock('../../app/api/products');
jest.mock('../../app/pages/catalog/card');
jest.mock('../../app/components/secondary-menu');
jest.mock('../../app/router/router', () => {
  return jest.fn().mockImplementation(() => {
    return {
      navigate: jest.fn(),
    };
  });
});

describe('Catalog page', () => {
  const router = new Router([]);
  const secondaryMenu = new SecondaryMenu(router);
  const catalog = new CatalogPage(secondaryMenu, router);

  it('should display a message when no products are found', async () => {
    await catalog['getProductCards']([]);
    expect(catalog['catalogCards'].getElement()).toHaveTextContent('No products found matching your request');
  });

  it('should create correct product cards for each product in the list', async () => {
    const mockProducts = [
      {
        id: '1',
        name: { 'en-GB': 'Product 1' },
        key: 'product-1',
        masterVariant: {
          images: [{ url: 'image1.jpg' }],
          prices: [{ value: { centAmount: 1000 } }],
        },
      },
      {
        id: '2',
        name: { 'en-GB': 'Product 2' },
        key: 'product-2',
        masterVariant: {
          images: [{ url: 'image2.jpg' }],
          prices: [{ value: { centAmount: 2000 }, discounted: { value: { centAmount: 1500 } } }],
        },
      },
    ];

    (getTheCart as jest.Mock).mockResolvedValue({ lineItems: [{ productId: '1' }] });
    await catalog['getProductCards'](mockProducts as unknown as ProductProjection[]);

    expect(CatalogCard).toHaveBeenCalledTimes(2);
    expect(catalog['cardsToShow']).toHaveLength(2);
    expect(CatalogCard).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), router, true);
    expect(CatalogCard).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }), router, false);
  });

  it('should create search menu with input and button', () => {
    const container = catalog['createSearchMenu']();

    expect(container).toBeInstanceOf(ElementCreator);
    expect(container.getElement()).toHaveClass('secondary-menu__search');

    const input = container.getElement().querySelector('input[type="search"]');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('placeholder', 'search');

    const button = container.getElement().querySelector('button');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button).toHaveTextContent('Search');
  });

  it('should create sort menu with correct structure', () => {
    const sortContainer = catalog['createSortMenu']();

    expect(sortContainer).toBeInstanceOf(ElementCreator);
    expect(sortContainer.getElement()).toHaveClass('secondary-menu__sort');
    const switchInput = sortContainer.getElement().querySelector('.sort-toggle__input');
    expect(switchInput).toBeInstanceOf(HTMLInputElement);
    expect(switchInput).toHaveAttribute('type', 'checkbox');
    expect(switchInput).toHaveAttribute('id', 'sort-toggle');
    const label = sortContainer.getElement().querySelector('.secondary-menu__sort-button');
    expect(label).toBeInstanceOf(HTMLLabelElement);
    const sortByElement = label?.querySelector('.secondary-menu__sort-text');
    expect(sortByElement).toBeInstanceOf(HTMLDivElement);
    expect(sortByElement).toHaveTextContent('Sort by:');
    const sortStringElement = label?.querySelector('.secondary-menu__sort-btn');
    expect(sortStringElement).toBeInstanceOf(HTMLSpanElement);
    const sortMenuBox = sortContainer.getElement().querySelector('.secondary-menu__sort-box');
    expect(sortMenuBox).toBeInstanceOf(HTMLDivElement);
    const sortList = sortMenuBox?.querySelector('ul');
    expect(sortList).toBeInstanceOf(HTMLUListElement);
  });

  it('should change active class after check another item', () => {
    const switchInput = new InputCreator({ type: 'checkbox' });
    const sortParametersElement = catalog['createSortParameters'](switchInput);

    const sortItems = sortParametersElement.querySelectorAll('.checkbox-with-text');
    const firstSortItem = sortItems[0];
    const secondSortItem = sortItems[1] as HTMLDivElement;

    expect(firstSortItem).toHaveClass('active');
    expect(secondSortItem).not.toHaveClass('active');

    secondSortItem.click();

    expect(firstSortItem).not.toHaveClass('active');
    expect(secondSortItem).toHaveClass('active');
  });
});
