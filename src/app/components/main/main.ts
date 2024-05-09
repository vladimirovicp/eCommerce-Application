import '../../../assets/scss/_global.scss';
import View from '../../common/view';

export default class MainView extends View {
  constructor() {
    const params = {
      tag: 'main',
      classNames: ['main'],
    };
    super(params);
  }

  setContent(page: View): void {
    const currentContent = this.viewElementCreator.getElement();
    const newContent = page.getHtmlElement();

    while (currentContent.firstElementChild) {
      currentContent.firstElementChild.remove();
    }
    this.viewElementCreator.addInnerElements([newContent]);
  }

  updateStyleClasses(newClass?: string): void {
    const element = this.viewElementCreator.getElement();
    element.className = 'main';
    if (newClass) {
      element.classList.add(newClass);
    }
  }
}
