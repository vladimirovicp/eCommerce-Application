import { Cart, LineItem } from '@commercetools/platform-sdk';
import '../../../assets/scss/page/basket.scss';
import './index.scss';
import { applyPromoCode, clearCart, getTheCart, removeLineFromCart, updateProductQuantity } from '../../api/products';
import View from '../../common/view';
import modalWindowCreator from '../../components/modal-window';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import ElementCreator from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import LinkCreator from '../../util/link-creator';

export default class CartPage extends View {
  private router: Router;

  private cart: Cart | undefined = undefined;

  private totalPriceElement: ElementCreator | undefined = undefined;

  private oldPriceElement: ElementCreator | undefined = undefined;

  private listContainer: ElementCreator<HTMLDivElement>;

  constructor(router: Router) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.router = router;
    this.listContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__cards'] });
    this.setContent();
  }

  private async setContent(): Promise<void> {
    this.cart = await getTheCart();

    if (this.cart?.lineItems.length === 0) {
      this.createEmptyCartPage();
    } else {
      const basketMain = new ElementCreator({ classNames: ['basket__content'] });
      basketMain.addInnerElements([this.createRemoveAllButton(), this.createItemList()]);

      const basketAside = new ElementCreator({ classNames: ['basket__aside'] });
      basketAside.addInnerElements([this.createPromocode(), this.createTotalPrice()]);

      this.viewElementCreator.addInnerElements([basketMain, basketAside]);
    }
  }

  private createRemoveAllButton(): ElementCreator<HTMLDivElement> {
    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__wrapper-btn'] });
    const removeAllButton = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Remove all',
      callback: async (): Promise<void> => {
        if (this.cart && this.cart.lineItems.length > 0) {
          const response = await clearCart(this.cart);
          if (response?.statusCode === 200) {
            this.cart = response.body;
            this.listContainer.getElement().innerHTML = '';
            this.createEmptyCartPage();
            if (this.totalPriceElement) this.totalPriceElement.getElement().textContent = '$ 0';
          } else {
            modalWindowCreator.showModalWindow('error', 'Failed to remove products from cart. Please try again');
          }
        }
      },
    });

    buttonContainer.addInnerElements([removeAllButton]);
    return buttonContainer;
  }

  private createItemList(): ElementCreator<HTMLDivElement> {
    if (this.cart) {
      this.cart.lineItems.forEach((item) => {
        const card = this.createBasketCard(item);
        this.listContainer.addInnerElements([card]);
      });
    }
    return this.listContainer;
  }

  private createEmptyCartPage(): void {
    const wraper = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__empty'],
    });
    const message = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__empty-text'],
      textContent: 'Your cart is still empty. Would you like to continue shopping?',
    });
    const catalogButton = new ElementCreator<HTMLDivElement>({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'Catalog',
      callback: (): void => {
        this.router.navigate(`${Pages.CATALOG}`);
      },
    });

    wraper.addInnerElements([message, catalogButton]);

    this.viewElementCreator.getElement().innerHTML = '';
    this.viewElementCreator.addInnerElements([wraper]);
  }

  private createBasketCard(item: LineItem): ElementCreator<HTMLDivElement> {
    const cardContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card'] });
    const {
      discountedPricePerQuantity,
      productKey,
      productId,
      name,
      variant: { images, prices },
      quantity,
    } = item;

    const imgContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-img'] });
    imgContainer.getElement().innerHTML = `<img class="img-full" src="${images?.[0]?.url || ''}" alt="${name['en-GB']}">`;

    const cardContant = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-content'] });

    const cardControl = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-control'] });
    const deleteButton = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__card-delete'],
      callback: async (): Promise<void> => {
        this.removeProduct(productId, cardContainer);
      },
    });
    cardControl.addInnerElements([deleteButton, this.createItemCounter(productId, quantity)]);

    const priceContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-price'] });
    const price = prices?.[0]?.discounted?.value.centAmount || 0;
    const newPrice = discountedPricePerQuantity[0]?.discountedPrice?.value.centAmount;
    if (newPrice) {
      priceContainer.getElement().innerHTML = `<div class="price__old">$ ${price / 100}</div>
      <div class="price__current">$ ${newPrice / 100}</div>`;
    } else {
      priceContainer.getElement().innerHTML = `<div class="price__current">$ ${price / 100}</div>`;
    }

    cardContant.addInnerElements([this.createProductName(name['en-GB'], productKey), cardControl, priceContainer]);
    cardContainer.addInnerElements([imgContainer, cardContant]);
    return cardContainer;
  }

  private createProductName(name: string, productKey: string | undefined): ElementCreator<HTMLDivElement> {
    const nameContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-name'] });
    const nameElement = new LinkCreator({
      textContent: name,
      callback: (): void => {
        this.router.navigate(`${Pages.CATALOG}/${productKey}`);
      },
    });
    nameContainer.addInnerElements([nameElement]);
    return nameContainer;
  }

  private createItemCounter(productId: string, quantity: number): ElementCreator<HTMLDivElement> {
    const counterContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__card-number'] });

    const valueElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__value'],
      textContent: `${quantity}`,
    });
    const minusElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__minus'],
      callback: (): void => {
        this.updateQuantity(productId, valueElement.getElement(), false);
      },
    });
    const plusElement = new ElementCreator<HTMLDivElement>({
      classNames: ['number__plus'],
      callback: (): void => {
        this.updateQuantity(productId, valueElement.getElement(), true);
      },
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
      callback: async (): Promise<void> => {
        const promoCode = promoInput.getElement().value;
        if (!promoCode) {
          modalWindowCreator.showModalWindow('error', 'Promo code cannot be empty!');
          return;
        }
        if (this.cart) {
          const response = await applyPromoCode(this.cart, promoCode);
          if (response) {
            this.cart = response.body;
            this.updateTotalCosts();
          }
        }
      },
    });
    buttonContainer.addInnerElements([applyButton]);

    promocodeContainer.addInnerElements([inputContainer, buttonContainer]);
    return promocodeContainer;
  }

  private createTotalPrice(): ElementCreator<HTMLDivElement> {
    const priceContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__total'] });

    const infoContainer = new ElementCreator<HTMLDivElement>({ classNames: ['basket__total-info'] });

    this.oldPriceElement = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__total-price', 'price__old'],
    });

    const priceText = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__total-text'],
      textContent: 'Total cost',
    });
    this.totalPriceElement = new ElementCreator<HTMLDivElement>({
      classNames: ['basket__total-price'],
    });

    this.updateTotalCosts();
    infoContainer.addInnerElements([priceText, this.totalPriceElement]);

    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['form__button'] });
    // кнопка без колбэка, просто заглушка
    buttonContainer.getElement().innerHTML = `<button class="btn-default">Place an order</button>`;

    priceContainer.addInnerElements([this.oldPriceElement, infoContainer, buttonContainer]);
    return priceContainer;
  }

  private async removeProduct(productId: string, card: ElementCreator): Promise<void> {
    if (this.cart) {
      const response = await removeLineFromCart(this.cart, productId);
      if (response?.statusCode === 200) {
        card.getElement()?.remove();
        this.cart = response.body;
        this.updateTotalCosts();
        if (this.cart.lineItems.length === 0) {
          this.createEmptyCartPage();
        }
      } else {
        modalWindowCreator.showModalWindow('error', 'Failed to remove product from cart. Please try again');
      }
    }
  }

  private async updateQuantity(productId: string, counter: HTMLDivElement, isPlusOne: boolean): Promise<void> {
    if (this.cart) {
      const currentCounter = counter;
      const response = await updateProductQuantity(this.cart, productId, isPlusOne);
      if (response?.statusCode === 200) {
        this.cart = response.body;
        const lineItem = this.cart.lineItems.find((item) => item.productId === productId);
        currentCounter.textContent = String(lineItem?.quantity);
        this.updateTotalCosts();
      }
    }
  }

  private updateTotalCosts(): void {
    if (this.cart) {
      if (
        this.cart.discountCodes.length > 0 &&
        this.cart.discountCodes.find((item) => item.state === 'MatchesCart') &&
        this.oldPriceElement
      ) {
        let originalPrice: number = 0;
        this.cart.lineItems.forEach((item) => {
          originalPrice += item.price.discounted
            ? item.price.discounted.value.centAmount * item.quantity
            : item.price.value.centAmount * item.quantity;
        });
        if (originalPrice !== this.cart.totalPrice.centAmount) {
          this.oldPriceElement.getElement().textContent = `$ ${originalPrice / 100}`;
        } else {
          this.oldPriceElement.getElement().textContent = ``;
        }
      }

      if (this.totalPriceElement) {
        this.totalPriceElement.getElement().textContent = `$ ${this.cart.totalPrice.centAmount / 100}`;
      }
    }
  }
}
