// import customerService from '../../api/customers-requests';
import { apiRoots } from '../../api/build-client';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import ElementCreator from '../../util/element-creator';
import { CatalogCardParams } from '../../util/types';

interface Cart {
  id: string;
  version: number;
}

export default class CatalogCard extends ElementCreator {
  private router: Router;

  constructor(cardParams: CatalogCardParams, router: Router) {
    super({
      tag: 'div',
      classNames: ['catalog-card'],
      callback: () => {
        this.router.navigate(`${Pages.CATALOG}/${cardParams.key}`);
      },
    });
    this.router = router;
    this.configureCard(cardParams);
  }

  private configureCard(params: CatalogCardParams): void {
    this.addInnerElements([
      this.setImage(params.imageUrl, params.name),
      this.setPrices(params.price, params.discountPrice),
      this.setTitle(params.name),
      this.setDescription(params.description),
      this.addButton(),
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

  private addButton(): HTMLElement {
    const buttonContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-card__btn'],
    });

    const button = new ElementCreator({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Into a basket',
    });
    button.setCallback((event) => {
      if (event) event.stopPropagation();
      this.addProductToCart();
      // показать модальное окно
    }, 'click');

    buttonContainer.addInnerElements([button]);
    return buttonContainer.getElement();
  }

  private async addProductToCart(): Promise<void> {
    let cart: Cart;
    if (apiRoots.byRefreshToken) {
      try {
        const response = await apiRoots.byRefreshToken.me().activeCart().get().execute();
        cart = { id: response.body.id, version: response.body.version };
        console.log(cart);
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
            cart = { id: response.body.id, version: response.body.version };
          } catch (createError) {
            console.error('Error creating new cart:', createError);
          }
        } else {
          console.error('Error retrieving active cart:', error);
        }
      }
    }
  }
}
