import InputCreator from '../app/util/input-creator';
import { InputParams } from '../app/util/types';

describe('InputCreator test', () => {
  let inputCreator: InputCreator;
  let mockInputParams: InputParams;
  let validationFn: jest.Mock;
  let mockErrorSpan: HTMLSpanElement;

  beforeEach(() => {
    mockInputParams = {
      type: 'text',
      callbackFocus: jest.fn(),
      callbackBlur: jest.fn(),
    };
    inputCreator = new InputCreator(mockInputParams);

    validationFn = jest.fn(); // .mockReturnValue({ isValid: true, errorMessage: '' });
    mockErrorSpan = document.createElement('span');
  });

  it('should create an input element with correct type', () => {
    expect(inputCreator.getElement().tagName).toBe('INPUT');
    expect(inputCreator.getElement()).toHaveAttribute('type', 'text');
  });

  it('should work with focus and blur callbacks', () => {
    const blurEvent = new Event('blur');
    const focusEvent = new Event('focus');

    inputCreator.getElement().dispatchEvent(focusEvent);
    inputCreator.getElement().dispatchEvent(blurEvent);

    expect(mockInputParams.callbackFocus).toHaveBeenCalled();
    expect(mockInputParams.callbackBlur).toHaveBeenCalled();
  });

  it('should validate input value and show error message if it is invalid', () => {
    validationFn.mockReturnValue({ isValid: false, errorMessage: 'Invalid input' });

    inputCreator.addValidation(validationFn, mockErrorSpan);
    inputCreator.getElement().value = 'invalid-value';
    inputCreator.getElement().dispatchEvent(new Event('input'));

    expect(validationFn).toHaveBeenCalledWith('invalid-value');
    expect(mockErrorSpan).toHaveTextContent('Invalid input');
  });

  it('should clear error message when input becomes valid', () => {
    // Сначала вызовем невалидное состояние
    validationFn.mockReturnValueOnce({ isValid: false, errorMessage: 'Invalid input' });
    inputCreator.addValidation(validationFn, mockErrorSpan);
    inputCreator.getElement().value = 'invalid-value';
    inputCreator.getElement().dispatchEvent(new Event('input'));

    // Теперь изменение на валидное состояние
    validationFn.mockReturnValueOnce({ isValid: true, errorMessage: '' });
    inputCreator.getElement().value = 'valid-value';
    inputCreator.getElement().dispatchEvent(new Event('input'));

    expect(validationFn).toHaveBeenCalledWith('invalid-value');
    expect(validationFn).toHaveBeenCalledWith('valid-value');
    expect(mockErrorSpan).toHaveTextContent('');
    expect(mockErrorSpan).toHaveStyle('display: none');
  });
});
