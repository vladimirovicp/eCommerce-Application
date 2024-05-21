import ElementCreator from '../util/element-creator';
import '../../assets/scss/_modal.scss';

class ModalWindowCreator extends ElementCreator<HTMLDivElement> {
  private modalContent: ElementCreator<HTMLDivElement>;

  private iconSpan: ElementCreator<HTMLSpanElement>;

  constructor() {
    const params = {
      classNames: ['modal'],
    };
    super(params);
    this.modalContent = new ElementCreator<HTMLDivElement>({ classNames: ['modal__content'] });
    this.iconSpan = new ElementCreator<HTMLSpanElement>({ tag: 'span', classNames: ['modal-icon'] });
    this.initModal();
  }

  private initModal(): void {
    const closeButton = new ElementCreator({
      tag: 'span',
      classNames: ['modal__close'],
      callback: (): void => {
        this.closeModalWindow();
      },
    });
    this.addInnerElements([closeButton, this.modalContent]);
    document.body.appendChild(this.element);
  }

  public showModalWindow(modalType: 'error' | 'info' | 'standart', text: string): void {
    this.modalContent.getElement().innerHTML = text;
    this.element.className = `modal modal__${modalType} active`;
    if (modalType !== 'standart') {
      this.modalContent.addInnerElements([this.iconSpan]);
    }
    document.body.classList.add('_lock');

    document.addEventListener('click', this.handleCloseClick.bind(this));
  }

  public createButton(callback: (event: Event | undefined) => void, textContent: string): void {
    const buttonContainer = new ElementCreator<HTMLDivElement>({ classNames: ['modal__btn-box'] });
    const button = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      classNames: ['modal__btn'],
      textContent,
      callback: (event: Event | undefined): void => {
        callback(event);
        this.closeModalWindow();
      },
    });
    buttonContainer.addInnerElements([button]);
    this.element.append(buttonContainer.getElement());
  }

  private closeModalWindow(): void {
    this.element.classList.remove('active');
    document.body.classList.remove('_lock');
    while (this.modalContent.getElement().nextElementSibling) {
      this.modalContent.getElement().nextElementSibling?.remove();
    }
    document.removeEventListener('click', this.handleCloseClick);
  }

  private handleCloseClick(event: Event): void {
    if (event.target instanceof HTMLElement && event.target.classList.contains('_lock')) {
      this.closeModalWindow();
    }
  }
}

const modalWindowCreator = new ModalWindowCreator();
export default modalWindowCreator;
