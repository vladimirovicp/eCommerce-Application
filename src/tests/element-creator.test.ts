import ElementCreator from '../app/util/element-creator';

describe('class ElementCreator testing', () => {
  let elementCreator: ElementCreator;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
    elementCreator = new ElementCreator<HTMLDivElement>({
      tag: 'div',
      id: 'testId',
      classNames: ['class1', 'class2'],
      textContent: 'example',
      eventType: 'click',
      callback: mockCallback,
      attributes: {
        'data-test': 'example',
      },
    });
  });

  it('should create an element of the correct type', () => {
    expect(elementCreator.getElement()).toBeInstanceOf(HTMLDivElement);
    expect(elementCreator.getElement().tagName.toLowerCase()).toBe('div');
  });

  it('should set an id correctly', () => {
    expect(elementCreator.getElement().id).toBe('testId');
  });

  it('should add css classes correctly', () => {
    expect(elementCreator.getElement()).toHaveClass('class1');
    expect(elementCreator.getElement()).toHaveClass('class2');
  });

  it('should set text content correctly', () => {
    expect(elementCreator.getElement()).toHaveTextContent('example');
  });

  it('should set attributes correctly', () => {
    expect(elementCreator.getElement()).toHaveAttribute('data-test', 'example');
  });

  it('should add eventlistener correctly', () => {
    const mockEvent = new Event('click');
    elementCreator.getElement().dispatchEvent(mockEvent);
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should add inner elements', () => {
    const childElement = document.createElement('span');
    elementCreator.addInnerElements([childElement]);

    expect(elementCreator.getElement().contains(childElement)).toBeTruthy();
  });
});
