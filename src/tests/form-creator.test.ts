import FormCreator from '../app/util/form-creator';
import InputCreator from '../app/util/input-creator';

describe('class FormCreator testing', () => {
  let formCreator: FormCreator;
  let mockButton: HTMLButtonElement;

  beforeEach(() => {
    formCreator = new FormCreator({ id: 'itForm' });
    mockButton = document.createElement('button');
    formCreator.addSubmitButton(mockButton);
  });

  it('submit button should be disabled or enabled based on form validity', () => {
    const testInput1 = new InputCreator({ type: 'text' });
    const testInput2 = new InputCreator({ type: 'text' });
    mockButton.disabled = true;

    formCreator.addValidationField(testInput1);
    formCreator.addValidationField(testInput2);

    testInput1.isValid = true;
    testInput1.getElement().dispatchEvent(new CustomEvent('isValidChange'));

    expect(mockButton.disabled).toBe(true);

    testInput2.isValid = true;
    testInput2.getElement().dispatchEvent(new CustomEvent('isValidChange'));

    expect(mockButton.disabled).toBe(false);
  });

  it('addValidationField should check form validity upon field validity change', () => {
    const inputCreator = new InputCreator({ type: 'text' });
    formCreator.addValidationField(inputCreator);

    expect(formCreator['isFormValid']).toBe(false);

    inputCreator.isValid = true;
    inputCreator.getElement().dispatchEvent(new CustomEvent('isValidChange'));

    expect(formCreator['isFormValid']).toBe(true);
  });
});
