import {
  Cart,
  CartUpdateAction,
  ClientResponse,
  DiscountCodePagedQueryResponse,
  ProductProjection,
} from '@commercetools/platform-sdk';
import modalWindowCreator from '../components/modal-window';
import { apiRoot, apiRoots } from './build-client';

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

async function updateCartCounter(cart: Cart): Promise<void> {
  const counter = document.querySelector('#header-cart-counter');
  console.log('counter', counter);
  if (cart && counter) {
    let totalQuantity = 0;
    cart.lineItems.forEach((item) => {
      totalQuantity += item.quantity;
    });
    counter.textContent = String(totalQuantity);
  }
}

export async function getTheCart(): Promise<Cart | undefined> {
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;
  // получить корзину
  if (apiRoots.byRefreshToken) {
    try {
      const response = await apiRoots.byRefreshToken.me().activeCart().get().execute();
      updateCartCounter(response.body);
      return response.body;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 404) {
        // создаём новую корзину
        try {
          const response = await apiRoots.byRefreshToken
            .me()
            .carts()
            .post({
              body: {
                currency: 'USD',
              },
            })
            .execute();
          updateCartCounter(response.body);
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

export async function removeLineFromCart(cart: Cart, productId: string): Promise<ClientResponse<Cart> | undefined> {
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

  if (apiRoots.byRefreshToken) {
    try {
      // находим в корзине нужную строчку с искомым продуктом
      const lineItem = cart.lineItems.find((item) => item.productId === productId);
      const response = await apiRoots.byRefreshToken
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId: lineItem?.id,
              },
            ],
          },
        })
        .execute();
      updateCartCounter(response.body);
      return response;
    } catch (error) {
      console.error('Error removing product from cart:', error);
      return undefined;
    }
  }
  return undefined;
}

export async function clearCart(cart: Cart): Promise<ClientResponse<Cart> | undefined> {
  // добавить лоадер?
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

  if (apiRoots.byRefreshToken) {
    try {
      // формируем массив товаров, чтобы удаление всех строк было в одном обращени к серверу
      const actions: CartUpdateAction[] = cart.lineItems.map((item) => ({
        action: 'removeLineItem',
        lineItemId: item.id,
      }));

      const response = await apiRoots.byRefreshToken
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions,
          },
        })
        .execute();
      updateCartCounter(response.body);
      return response;
    } catch (error) {
      console.error('Error removing products from cart:', error);
      return undefined;
    }
  }
  return undefined;
}

export async function updateProductQuantity(
  cart: Cart,
  productId: string,
  increment: boolean
): Promise<ClientResponse<Cart> | undefined> {
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;
  if (apiRoots.byRefreshToken) {
    try {
      const lineItem = cart.lineItems.find((item) => item.productId === productId);
      if (lineItem) {
        const newQuantity = increment ? lineItem.quantity + 1 : lineItem.quantity - 1;
        if (newQuantity > 0) {
          const response = await apiRoots.byRefreshToken
            .carts()
            .withId({ ID: cart.id })
            .post({
              body: {
                version: cart.version,
                actions: [
                  {
                    action: 'changeLineItemQuantity',
                    lineItemId: lineItem.id,
                    quantity: newQuantity,
                  },
                ],
              },
            })
            .execute();
          updateCartCounter(response.body);
          return response;
        }
      }
      return undefined;
    } catch (error) {
      console.error('Error updating product quantity in cart:', error);
      return undefined;
    }
  }
  return undefined;
}

async function checkIsPromoCodeApplied(cart: Cart, promoCode: string): Promise<boolean> {
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;
  if (apiRoots.byRefreshToken) {
    const codeResponse: ClientResponse<DiscountCodePagedQueryResponse> = await apiRoots.byRefreshToken
      .discountCodes()
      .get({
        queryArgs: {
          where: `code="${promoCode}"`,
        },
      })
      .execute();
    if (codeResponse.body.results.length > 0) {
      const codeId = codeResponse.body.results[0].id;
      const codeInCart = cart.discountCodes.find((item) => item.discountCode.id === codeId);
      if (codeInCart && codeInCart.state === 'MatchesCart') {
        return true;
      }
    }
  }
  return false;
}

export async function applyPromoCode(cart: Cart, promoCode: string): Promise<ClientResponse<Cart> | undefined> {
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

  if (apiRoots.byRefreshToken) {
    try {
      if (await checkIsPromoCodeApplied(cart, promoCode)) {
        modalWindowCreator.showModalWindow('error', `The discount code '${promoCode}' has already been applied`);
        return undefined;
      }
      const response = await apiRoots.byRefreshToken
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'addDiscountCode',
                code: promoCode,
              },
            ],
          },
        })
        .execute();
      modalWindowCreator.showModalWindow('info', `The discount code '${promoCode}' applied successfully!`);
      return response;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 400) {
        modalWindowCreator.showModalWindow('error', `The discount code '${promoCode}' was not found`);
        return undefined;
      }
    }
  }
  return undefined;
}

export async function addProductsToCart(actions: CartUpdateAction[]): Promise<void> {
  const cart = await getTheCart();
  // const currentApiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

  if (cart && apiRoots.byRefreshToken)
    try {
      const response = await apiRoots.byRefreshToken
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions,
          },
        })
        .execute();
      updateCartCounter(response.body);
    } catch (error) {
      console.error('Error adding products to cart:', error);
    }
}

export async function toggleAddToCartButton(button: HTMLElement, productId: string): Promise<void> {
  const currentButton = button;
  const isRemoveButton = button.classList.toggle('remove-btn');
  if (isRemoveButton) {
    addProductsToCart([
      {
        action: 'addLineItem',
        productId,
        quantity: 1,
      },
    ]);
    currentButton.textContent = 'Remove from cart';
  } else {
    const cart = await getTheCart();
    if (cart) removeLineFromCart(cart, productId);
    currentButton.textContent = 'Add to cart';
  }
}

export async function checkIsProductInCart(productId: string): Promise<boolean> {
  const cart = await getTheCart();
  if (cart) {
    const lineItem = cart.lineItems.find((item) => item.productId === productId);
    return Boolean(lineItem);
  }
  return false;
}
