import '../../../assets/scss/page/about.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

export default class AboutPage extends View {
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
      textContent: 'About page',
    });
    this.viewElementCreator.addInnerElements([text]);
  }
}
