import ElementCreator from '../../util/element-creator';
import { CatalogCardParams } from '../../util/types';

export default class CatalogCard extends ElementCreator {
  constructor(cardParams: CatalogCardParams) {
    super({
      tag: 'div',
      classNames: ['catalog-card'],
    });
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
    button.setCallback(() => {}, 'click');

    buttonContainer.addInnerElements([button]);
    return buttonContainer.getElement();
  }
}
