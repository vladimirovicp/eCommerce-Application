import { Cart, LineItem } from '@commercetools/platform-sdk';
import Router from '../../app/router/router';
import { applyPromoCode, clearCart } from '../../app/api/products';
import modalWindowCreator from '../../app/components/modal-window';
import CartPage from '../../app/pages/cart';

jest.mock('../../app/components/modal-window');
jest.mock('../../app/api/products');
jest.mock('../../app/router/router', () => {
  return jest.fn().mockImplementation(() => {
    return {
      navigate: jest.fn(),
    };
  });
});

describe('CartPage', () => {
  const router = new Router([]);
  const cartPage = new CartPage(router);

  beforeEach(() => {
    cartPage['cart'] = {
      lineItems: [
        {
          id: 'Product-1',
          price: { discounted: { value: { centAmount: 300 } }, value: { centAmount: 500 } },
          quantity: 1,
        } as LineItem,
        { id: 'Product-1', price: { value: { centAmount: 400 } }, quantity: 2 } as LineItem,
      ],
      discountCodes: [{ state: 'MatchesCart' }],
      totalPrice: { centAmount: 1000 },
    } as Cart;
  });

  it('should create a removeall button', async () => {
    (clearCart as jest.Mock).mockResolvedValue({ statusCode: 200, body: { 'new cart': 'new cart' } });
    const buttonContainer = cartPage['createRemoveAllButton']();
    const button = buttonContainer.getElement().querySelector('button');

    expect(buttonContainer).toBeDefined();
    expect(button?.textContent).toBe('Remove all');

    await button?.click();
    expect(cartPage['cart']).toEqual({ 'new cart': 'new cart' });
    expect(cartPage['viewElementCreator'].getElement().querySelector('.basket__empty')).toBeDefined();
  });

  it('should create a basket card with the correct structure', () => {
    const mockLineItem = {
      discountedPricePerQuantity: [{ discountedPrice: { value: { centAmount: 500 } } }],
      productKey: 'test-key',
      productId: 'test-id',
      name: { 'en-GB': 'Test Product' },
      variant: { images: [{ url: 'test-url' }], prices: [{ discounted: { value: { centAmount: 1000 } } }] },
      quantity: 1,
    };

    const cardContainer = cartPage['createBasketCard'](mockLineItem as unknown as LineItem);

    const cardContainerElement = cardContainer.getElement();
    expect(cardContainerElement.innerHTML).toContain('<img class="img-full" src="test-url" alt="Test Product">');
    expect(cardContainerElement.innerHTML).toContain('<div class="price__current">$ 5</div>');
    expect(cardContainerElement.innerHTML).toContain('<div class="basket__card-name"><a>Test Product</a></div>');
    expect(cardContainerElement.innerHTML).toContain('<div class="basket__card-control">');
    expect(cardContainerElement.innerHTML).toContain('<div class="basket__card-price">');
  });

  it('should correctly handle promo code apply', async () => {
    const promocodeContainer = cartPage['createPromocode']();
    const applyButton = promocodeContainer.getElement().querySelector('button');
    const input = promocodeContainer.getElement().querySelector('input');

    if (input) input.value = '';
    await applyButton?.click();
    expect(modalWindowCreator.showModalWindow).toHaveBeenCalledWith('error', 'Promo code cannot be empty!');

    if (input) input.value = 'test';
    await applyButton?.click();
    expect(applyPromoCode).toHaveBeenCalledWith(cartPage['cart'], 'test');
  });

  it('updates old price if there are applicable discount codes', () => {
    cartPage['updateTotalCosts']();

    expect(cartPage['oldPriceElement']!.getElement()).toHaveTextContent('$ 11');
    expect(cartPage['totalPriceElement']!.getElement()).toHaveTextContent('$ 10');
  });

  it('clears old price text if discounted price matches total price', () => {
    cartPage['cart'] = {
      lineItems: [
        {
          price: { discounted: { value: { centAmount: 300 } }, value: { centAmount: 500 } },
          quantity: 1,
        } as LineItem,
        { price: { value: { centAmount: 400 } }, quantity: 2 } as LineItem,
      ],
      discountCodes: [{ state: 'MatchesCart' }],
      totalPrice: { centAmount: 1100 },
    } as Cart;
    cartPage['updateTotalCosts']();

    expect(cartPage['oldPriceElement']!.getElement()).toHaveTextContent('');
  });
});
