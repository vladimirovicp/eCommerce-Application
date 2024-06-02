// import { ProductProjection } from '@commercetools/platform-sdk';
import { apiRoot } from '../../api/build-client';
import '../../../assets/scss/page/catalog-page.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

interface ProductResponse {
  name: string;
  description: string;
  fullPrice: number;
  discountPrice: number;
  images: Array<string>;
  category: string;
}

export default class ProductPage extends View {
  private responseObject: ProductResponse;

  constructor(id: string) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.responseObject = {
      name: '',
      description: '',
      fullPrice: 0,
      discountPrice: 0,
      images: [],
      category: '',
    };
    this.findProductByKey(id);
  }

  private async findProductByKey(productKey: string): Promise<void> {
    try {
      const response = await apiRoot
        .productProjections()
        .withKey({ key: `${productKey}` })
        .get()
        .execute();

      this.responseObject = {
        name: response.body.name['en-GB'],
        description: response?.body?.description?.['en-GB'] || '',
        fullPrice: response.body.masterVariant.prices?.[0].value.centAmount || 0,
        discountPrice: response.body.masterVariant.prices?.[0].discounted?.value.centAmount || 0,
        images: [],
        category: response.body.categories[0].id,
      };

      if (response.body.masterVariant.images?.length !== undefined) {
        for (let i = 0; i < response.body.masterVariant.images?.length; i += 1) {
          this.responseObject.images.push(response.body.masterVariant.images?.[i].url);
        }
      }
      this.configurePage(this.responseObject);
      console.log(this.responseObject);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  private configurePage(params: ProductResponse): void {
    this.viewElementCreator.addInnerElements([
      this.setSlider(params),
      this.setProductInfo(params),
      this.setProductPrices(params),
    ]);
  }

  private setSlider(params: ProductResponse): HTMLElement {
    const slider = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__slider'],
    });
    const image = new ElementCreator({
      tag: 'img',
      attributes: {
        src: params.images[0],
        alt: 'Photo',
      },
    });
    /*
    Url фотографий лежат в массиве params.images
    */

    slider.addInnerElements([image]);
    return slider.getElement();
  }

  private setProductInfo(params: ProductResponse): HTMLElement {
    const infoContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__info'],
    });

    const title = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__title'],
      textContent: params.name,
    });

    const descriptionContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__text'],
    });
    descriptionContainer.addInnerElements([
      new ElementCreator({
        tag: 'p',
        textContent: params.description,
      }),
    ]);

    infoContainer.addInnerElements([title, descriptionContainer]);
    return infoContainer.getElement();
  }

  private setProductPrices(params: ProductResponse): HTMLElement {
    const сontainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__price'],
    });

    const pricesContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__price-wrapper'],
    });
    pricesContainer.addInnerElements([
      new ElementCreator({
        tag: 'div',
        classNames: ['catalog-page__price-discount'],
        textContent: `$ ${params.discountPrice / 100}`,
      }),
      new ElementCreator({
        tag: 'div',
        classNames: ['catalog-page__price-old'],
        textContent: `$ ${params.fullPrice / 100}`,
      }),
    ]);

    const buttonContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-page__btn'],
    });
    const button = new ElementCreator({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Into a basket',
    });
    buttonContainer.addInnerElements([button]);

    сontainer.addInnerElements([pricesContainer, buttonContainer]);
    return сontainer.getElement();
  }
}
