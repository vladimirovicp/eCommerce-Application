// import { ProductProjection } from '@commercetools/platform-sdk';
import Swiper from 'swiper';
import 'swiper/css/bundle';

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
    /* eslint-disable */
    const swiper = new Swiper('.swiper-general', {
      direction: 'vertical',
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
  }
  /* eslint-disable max-lines-per-function */

  private setSlider(params: ProductResponse): HTMLElement {
    const slider = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__slider'],
    });
    const swiperCarouselWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-carousel__wrapper'],
    });

    const swiperCarousel2 = new ElementCreator({
      tag: 'div',
      classNames: ['swiper', 'swiper-general'],
    });

    const swiperWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-wrapper'],
    });

    const swiperslide1 = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-slide'],
    });
    const swiperslide2 = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-slide'],
    });
    const swiperslide3 = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-slide'],
    });
    const swiperslide4 = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-slide'],
    });

    const image = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: params.images[0],
        alt: 'Photo',
      },
    });
    const image2 = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: params.images[0],
        alt: 'Photo',
      },
    });
    const image3 = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: params.images[0],
        alt: 'Photo',
      },
    });
    const image4 = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: params.images[0],
        alt: 'Photo',
      },
    });

    const generalButtonprev = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-general__button-prev'],
    });
    const generalButtonNext = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-general__button-next'],
    });

    /*
    Url фотографий лежат в массиве params.images
    */

    swiperslide1.addInnerElements([image]);
    swiperslide2.addInnerElements([image2]);
    swiperslide3.addInnerElements([image3]);
    swiperslide4.addInnerElements([image4]);

    swiperWrapper.addInnerElements([
      swiperslide1,
      swiperslide2,
      swiperslide3,
      swiperslide4,
      generalButtonprev,
      generalButtonNext,
    ]);

    swiperCarousel2.addInnerElements([swiperWrapper]);
    swiperCarouselWrapper.addInnerElements([swiperCarousel2]);
    //swiperCarouselWrapper.addInnerElements([image]);
    slider.addInnerElements([swiperCarouselWrapper]);
    //slider.addInnerElements([image]);
    return slider.getElement();
  }

  private setProductInfo(params: ProductResponse): HTMLElement {
    const infoContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__info'],
    });

    const title = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__title'],
      textContent: params.name,
    });

    const descriptionContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__text'],
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
      classNames: ['catalog-product__price'],
    });

    const pricesContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__price-wrapper'],
    });
    pricesContainer.addInnerElements([
      new ElementCreator({
        tag: 'div',
        classNames: ['catalog-product__price-discount'],
        textContent: `$ ${params.discountPrice / 100}`,
      }),
      new ElementCreator({
        tag: 'div',
        classNames: ['catalog-product__price-old'],
        textContent: `$ ${params.fullPrice / 100}`,
      }),
    ]);

    const buttonContainer = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__btn'],
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
