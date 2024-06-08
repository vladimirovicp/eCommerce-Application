import { Cart, LineItem } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/home.scss';
import { getTheCart } from '../../api/products';
import View from '../../common/view';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import ElementCreator from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import LinkCreator from '../../util/link-creator';

export default class CartPage extends View {
  private router: Router;

  private cart: Cart | undefined = undefined;

  constructor(router: Router) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.router = router;
    this.setContent();
  }

  private async setContent(): Promise<void> {
    this.cart = await getTheCart();

    const basketMain = new ElementCreator({ classNames: ['basket__content'] });
    basketMain.addInnerElements([this.createRemoveButton(), this.createItemList()]);

    const basketAside = new ElementCreator({ classNames: ['basket__aside'] });
    basketAside.addInnerElements([this.createPromocode(), this.createTotalPrice()]);

    this.viewElementCreator.addInnerElements([basketMain, basketAside]);
  }

  private createRemoveButton(): ElementCreator<HTMLDivElement> {
    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__wrapper-btn'] });
    const removeAllButton = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Remove all',
      callback: (): void => {},
    });

    buttonContainer.addInnerElements([removeAllButton]);
    return buttonContainer;
  }

  private createItemList(): ElementCreator<HTMLDivElement> {
    const listContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__cards'] });

    if (this.cart && this.cart.lineItems.length > 0) {
      this.cart.lineItems.forEach((item) => {
        const card = this.createBasketCard(item);
        listContainer.addInnerElements([card]);
      });
    } else {
      // TODO добавить "ваша корзина пуста" и ссылку на каталог
    }
    return listContainer;
  }

  private createBasketCard(item: LineItem): ElementCreator<HTMLDivElement> {
    const cardContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card'] });

    const {
      productId,
      name,
      variant: { images, prices },
      quantity,
    } = item;

    const imgContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-img'] });
    imgContainer.getElement().innerHTML = `<img class="img-full" src="${images?.[0]?.url || ''}" alt="${name['en-GB']}">`;

    const nameContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-name'] });
    const nameElement = new LinkCreator({
      textContent: name['en-GB'],
      callback: (): void => {
        this.router.navigate(`${Pages.CATALOG}/${productId}`);
      },
    });
    nameContainer.addInnerElements([nameElement]);

    const deleteButton = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__card-delete'],
      callback: (): void => {},
    });

    const counterContainer = this.createItemCounter(quantity);

    const priceContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-price'] });
    const price = prices?.[0]?.discounted?.value.centAmount || 0;
    priceContainer.getElement().innerHTML = `<div class="price__current">$ ${price / 100}</div>`;

    cardContainer.addInnerElements([imgContainer, nameContainer, deleteButton, counterContainer, priceContainer]);
    return cardContainer;
  }

  private createItemCounter(quantity: number): ElementCreator<HTMLDivElement> {
    const counterContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-number'] });

    const minusElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__minus'],
      textContent: '-',
      callback: (): void => {},
    });
    const valueElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__value'],
      textContent: `${quantity}`,
    });
    const plusElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__plus'],
      textContent: '+',
      callback: (): void => {},
    });

    counterContainer.addInnerElements([minusElement, valueElement, plusElement]);
    return counterContainer;
  }

  private createPromocode(): ElementCreator<HTMLDivElement> {
    const promocodeContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__promo-code'] });

    const inputContainer = new ElementCreator<HTMLDivElement>({ classNames: ['form__field'] });
    const promoInput = new InputCreator({
      type: 'text',
      attributes: { placeholder: 'promo code' },
      callback: (): void => {},
    });
    inputContainer.addInnerElements([promoInput]);

    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['form__button'] });
    const applyButton = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Apply',
      callback: (): void => {},
    });
    buttonContainer.addInnerElements([applyButton]);

    promocodeContainer.addInnerElements([inputContainer, buttonContainer]);
    return promocodeContainer;
  }

  private createTotalPrice(): ElementCreator<HTMLDivElement> {
    const priceContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__total'] });

    const totalPrice = this.cart ? this.cart.totalPrice.centAmount : 0;

    const infoContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__total-info'] });
    const priceText = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__total-text'],
      textContent: 'Total cost',
    });
    const priceValue = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__total-price'],
      textContent: `$ ${totalPrice / 100}`,
    });
    infoContainer.addInnerElements([priceText, priceValue]);

    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['form__button'] });
    // кнопка без колбэка, просто заглушка
    buttonContainer.getElement().innerHTML = `<button class="btn-default">Place an order</button>`;

    priceContainer.addInnerElements([infoContainer, buttonContainer]);
    return priceContainer;
  }
}
