import '../../../assets/scss/page/home.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

export default class CartPage extends View {
  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.setContent();
  }

  setContent(): void {
    const text = new ElementCreator({
      tag: 'p',
      textContent: 'Cart page',
    });
    this.viewElementCreator.addInnerElements([text]);
  }
}
