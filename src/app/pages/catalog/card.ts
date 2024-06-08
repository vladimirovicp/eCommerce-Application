// import customerService from '../../api/customers-requests';
import { apiRoots } from '../../api/build-client';
import { getTheCart } from '../../api/products';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import ElementCreator from '../../util/element-creator';
import { CatalogCardParams } from '../../util/types';

export default class CatalogCard extends ElementCreator {
  private router: Router;

  private productId: string;

  constructor(cardParams: CatalogCardParams, router: Router, isInCart = false) {
    super({
      tag: 'div',
      classNames: ['catalog-card'],
      callback: () => {
        this.router.navigate(`${Pages.CATALOG}/${cardParams.key}`);
      },
    });
    this.router = router;
    this.productId = cardParams.id;
    this.configureCard(cardParams, isInCart);
  }

  private configureCard(params: CatalogCardParams, isInCart: boolean): void {
    this.addInnerElements([
      this.setImage(params.imageUrl, params.name),
      this.setPrices(params.price, params.discountPrice),
      this.setTitle(params.name),
      this.setDescription(params.description),
      this.addButton(isInCart),
    ]);
  }

  private setImage(url: string, altText: string): HTMLElement {
    const imageContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__img'],
    });
    const image = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: url,
        alt: altText,
      },
    });
    imageContainer.addInnerElements([image]);
    return imageContainer.getElement();
  }

  private setPrices(fullPrice: number, discountPrice: number): HTMLElement {
    const pricesContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__price'],
    });

    const oldPrice = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__price-old'],
      textContent: `$ ${String(Math.ceil(fullPrice / 100))}`,
    });

    const currentPrice = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__price-current'],
      textContent: `$ ${String(Math.ceil(discountPrice / 100))}`,
    });

    pricesContainer.addInnerElements([currentPrice, oldPrice]);
    return pricesContainer.getElement();
  }

  private setTitle(text: string): HTMLElement {
    const title = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__title'],
      textContent: text,
    });
    return title.getElement();
  }

  private setDescription(text: string): HTMLElement {
    const description = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__description'],
      textContent: text,
    });
    return description.getElement();
  }

  private addButton(isInCart: boolean): HTMLElement {
    const buttonContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__btn'],
    });

    const button = new ElementCreator({
      tag: 'button',
      classNames: isInCart ? ['btn-default', 'remove-btn'] : ['btn-default'],
      textContent: isInCart ? 'Remove from cart' : 'Add to cart',
    });
    button.setCallback((event) => {
      if (event) event.stopPropagation();
      const isRemoveButton = button.getElement().classList.toggle('remove-btn');
      if (isRemoveButton) {
        this.addProductToCart();
        button.getElement().textContent = 'Remove from cart';
        // показать модальное окно?
      } else {
        this.removeProductFromCart();
        button.getElement().textContent = 'Add to cart';
      }
    }, 'click');

    buttonContainer.addInnerElements([button]);
    return buttonContainer.getElement();
  }

  private async addProductToCart(): Promise<void> {
    const cart = await getTheCart();
    const apiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

    if (cart && apiRoot) {
      await apiRoot
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'addLineItem',
                productId: this.productId,
                quantity: 1,
              },
            ],
          },
        })
        .execute();
    }
  }

  private async removeProductFromCart(): Promise<void> {
    const cart = await getTheCart();
    const apiRoot = apiRoots.byRefreshToken ? apiRoots.byRefreshToken : apiRoots.byAnonymousId;

    if (cart && apiRoot) {
      try {
        // находим в корзине нужную строчку с искомым продуктом
        const lineItem = cart.lineItems.find((item) => item.productId === this.productId);
        await apiRoot
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
      } catch (error) {
        console.error('Error removing product from cart:', error);
      }
    }
  }
}
