// import { ProductProjection } from '@commercetools/platform-sdk';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css/bundle';
import { apiRoot } from '../../api/build-client';
import '../../../assets/scss/page/catalog-page.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';
import SecondaryMenu from '../../components/secondary-menu';
import { CategoriesReverse } from '../catalog/constants';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import { checkIsProductInCart, toggleAddToCartButton } from '../../api/products';

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  fullPrice: number;
  discountPrice: number;
  images: Array<string>;
  category: string;
}

export default class ProductPage extends View {
  private responseObject: ProductResponse;

  private secondaryMenu: SecondaryMenu;

  private router: Router;

  constructor(id: string, router: Router, secondaryMenu: SecondaryMenu) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.responseObject = {
      id: '',
      name: '',
      description: '',
      fullPrice: 0,
      discountPrice: 0,
      images: [],
      category: '',
    };
    this.router = router;
    this.findProductByKey(id);
    this.secondaryMenu = secondaryMenu;
  }

  private async findProductByKey(productKey: string): Promise<void> {
    try {
      const response = await apiRoot
        .productProjections()
        .withKey({ key: `${productKey}` })
        .get()
        .execute();

      this.responseObject = {
        id: response.body.id,
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
    } catch (error) {
      this.router.navigate(`${Pages.NOT_FOUND}`);
    }
  }

  private configureSwiper(): void {
    const swiperCarouselSettings = new Swiper('.swiper-carousel', {
      direction: 'vertical',
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '.swiper-general__button-next',
        prevEl: '.swiper-general__button-prev',
      },
    });
    /* eslint-disable */
    const swiperGeneralSettings = new Swiper('.swiper-general', {
      modules: [Navigation, Pagination, Thumbs],
      loop: true,
      spaceBetween: 10,
      thumbs: {
        swiper: swiperCarouselSettings,
      },
      navigation: {
        nextEl: '.swiper-general__button-next',
        prevEl: '.swiper-general__button-prev',
      },
    });

    const swiperPopupSettings = new Swiper('.swiper-popup', {
      modules: [Navigation, Thumbs],
      loop: true,
      spaceBetween: 10,
      thumbs: {
        swiper: swiperCarouselSettings,
      },
      navigation: {
        nextEl: '.swiper-popup__button-prev',
        prevEl: '.swiper-popup__button-next',
      },
    });
  }

  private async configurePage(params: ProductResponse): Promise<void> {
    this.viewElementCreator.addInnerElements([
      this.setSlider(params),
      this.setProductInfo(params),
      await this.setProductPrices(params),
      this.createModalSlide(params),
    ]);
    this.configureSwiper();
    this.secondaryMenu.updateContent([
      'catalog',
      CategoriesReverse[this.responseObject.category],
      this.responseObject.name,
    ]);
  }

  private setSlider(params: ProductResponse): HTMLElement {
    const slider = new ElementCreator({
      tag: 'div',
      classNames: ['catalog-product__slider'],
    });
    const swiperCarouselWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-carousel__wrapper'],
    });
    const swiperCarousel = this.createSlider(params.images, 'swiper-carousel');
    swiperCarouselWrapper.addInnerElements([swiperCarousel]);
    const buttonPrev = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-general__button-prev'],
    });
    const buttonNext = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-general__button-next'],
    });
    swiperCarouselWrapper.addInnerElements([buttonPrev, buttonNext]);
    const swiperGeneral = this.createSlider(params.images, 'swiper-general');
    slider.addInnerElements([swiperCarouselWrapper, swiperGeneral]);
    return slider.getElement();
  }

  private createSlider(images: string[], classSlider: string): ElementCreator {
    let swiperCarousel = new ElementCreator({
      tag: 'div',
      classNames: ['swiper', classSlider],
    });
    if (classSlider === 'swiper-carousel') {
      swiperCarousel = new ElementCreator({
        tag: 'div',
        classNames: ['swiper', classSlider],
        attributes: { thumbsSlider: '' },
      });
    }
    const swiperWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['swiper-wrapper'],
    });
    let coutn: number = 4;
    let imagDefault = true;
    if (images.length >= coutn) {
      coutn = images.length;
      imagDefault = false;
    }
    for (let i = 0; i < coutn; i += 1) {
      const src: string = imagDefault ? images[0] : images[i];
      let swiperslide = new ElementCreator({
        tag: 'div',
        classNames: ['swiper-slide'],
      });
      if (classSlider === 'swiper-general') {
        swiperslide = new ElementCreator({
          tag: 'div',
          classNames: ['swiper-slide'],
          callback: () => {
            const modalStandart = document.querySelector('.modal__standart');
            if (modalStandart) {
              modalStandart.classList.add('active');
              document.body.classList.add('_lock');
            }
          },
        });
      }
      const image = new ElementCreator({
        tag: 'img',
        classNames: ['img-full'],
        attributes: {
          src: src,
          alt: 'Photo',
        },
      });
      swiperslide.addInnerElements([image]);
      swiperWrapper.addInnerElements([swiperslide]);
    }
    swiperCarousel.addInnerElements([swiperWrapper]);
    return swiperCarousel;
  }

  private createModalSlide(params: ProductResponse): HTMLElement {
    const modal = new ElementCreator({
      tag: 'div',
      classNames: ['modal', 'modal__standart'],
    });
    const modalClose = new ElementCreator({
      tag: 'span',
      classNames: ['modal__close', 'modal-close__standart'],
      callback: () => {
        const closeModalStandart = document.querySelector('.modal-close__standart');
        const modalStandart = document.querySelector('.modal__standart');
        if (modalStandart && closeModalStandart) {
          modalStandart.classList.remove('active');
          document.body.classList.remove('_lock');
        }
      },
    });
    const modalContent = new ElementCreator({
      classNames: ['modal__content'],
    });

    const buttonPrev = new ElementCreator({
      classNames: ['swiper-popup__button-prev'],
    });
    const buttonNext = new ElementCreator({
      classNames: ['swiper-popup__button-next'],
    });

    const swiperswiperPopup = this.createSlider(params.images, 'swiper-popup');

    modalContent.addInnerElements([swiperswiperPopup]);

    modal.addInnerElements([modalClose, modalContent, buttonPrev, buttonNext]);

    return modal.getElement();
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

  private async setProductPrices(params: ProductResponse): Promise<HTMLElement> {
    const container = new ElementCreator({
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
    const isInCart = await checkIsProductInCart(this.responseObject.id);
    const button = new ElementCreator({
      tag: 'button',
      classNames: isInCart ? ['btn-default', 'remove-btn'] : ['btn-default'],
      textContent: isInCart ? 'Remove from cart' : 'Add to cart',
      callback: () => {
        toggleAddToCartButton(button.getElement(), this.responseObject.id);
      },
    });
    buttonContainer.addInnerElements([button]);

    container.addInnerElements([pricesContainer, buttonContainer]);
    return container.getElement();
  }
}
