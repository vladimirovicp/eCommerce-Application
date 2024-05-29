import ElementCreator from '../app/util/element-creator';
import FormCreator from '../app/util/form-creator';
import FormPageCreator from '../app/util/form-page-creator';
import InputCreator from '../app/util/input-creator';
import { InputParams } from '../app/util/types';

jest.mock('../app/util/form-creator');
jest.mock('../app/util/input-creator');
jest.mock('../app/util/element-creator');

describe('FormPageCreator testing', () => {
  let formPageCreator: FormPageCreator;
  const classNames = ['className'];
  const MockedInputCreator = InputCreator as jest.MockedClass<typeof InputCreator>;
  const mockValidationFunc = jest.fn().mockReturnValue({ isValid: false, errorMessage: 'Error' });
  let mockElementCreator: jest.Mocked<ElementCreator<HTMLSpanElement>>;

  const setupMockElementCreator = (): void => {
    mockElementCreator = new ElementCreator({ tag: 'span' }) as jest.Mocked<ElementCreator<HTMLSpanElement>>;
    (ElementCreator as jest.Mock).mockImplementationOnce(() => mockElementCreator);
    mockElementCreator.getElement.mockReturnValue(document.createElement('span'));
  };

  beforeEach(() => {
    formPageCreator = new FormPageCreator(classNames);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default properties', () => {
    expect(FormCreator).toHaveBeenCalledTimes(1);
    expect(FormCreator).toHaveBeenCalledWith({ classNames });
    expect(ElementCreator).toHaveBeenCalledTimes(1);
    expect(ElementCreator).toHaveBeenCalledWith({
      classNames: ['container'],
    });
  });

  it('should create a form field', () => {
    const params: InputParams = {
      type: 'text',
      attributes: { name: 'username', placeholder: 'Enter name', required: 'true' },
    };
    formPageCreator['createFormField'](params, mockValidationFunc, true);
    const firstInstance = MockedInputCreator.mock.instances[0];

    expect(ElementCreator).toHaveBeenCalledWith({ classNames: ['form__field', 'main__field'] });
    expect(InputCreator).toHaveBeenCalledWith(params);
    expect(firstInstance.isValid).toBe(true);
  });

  it('should create an address group for billing address by default', () => {
    formPageCreator['createCountry'] = jest.fn().mockReturnValue({ container: new ElementCreator<HTMLDivElement>({}) });
    formPageCreator['createCity'] = jest.fn().mockReturnValue({ container: new ElementCreator<HTMLDivElement>({}) });
    formPageCreator['createPostalCode'] = jest
      .fn()
      .mockReturnValue({ container: new ElementCreator<HTMLDivElement>({}) });
    formPageCreator['createStreet'] = jest.fn().mockReturnValue({ container: new ElementCreator<HTMLDivElement>({}) });
    const mockCreateFields = jest.fn().mockReturnValue(new ElementCreator<HTMLDivElement>({}));
    formPageCreator['createFields'] = mockCreateFields;

    const checkAddressGroup = (isBillingAddress: boolean, id?: string, isValid?: boolean): void => {
      const result = formPageCreator['createAddressGroup'](isBillingAddress, id, isValid);
      const addressType = isBillingAddress ? 'billing' : 'shipping';

      expect(ElementCreator).toHaveBeenCalledWith({
        tag: 'div',
        classNames: [`${addressType}-address`, 'form__fields-group'],
        attributes: id ? { id } : {},
      });

      expect(formPageCreator['createCountry']).toHaveBeenCalledWith(`address-field__${addressType}`, expect.anything());
      expect(formPageCreator['createCity']).toHaveBeenCalledWith(`address-field__${addressType}`, isValid);
      expect(formPageCreator['createPostalCode']).toHaveBeenCalledWith(`address-field__${addressType}`, isValid);
      expect(formPageCreator['createStreet']).toHaveBeenCalledWith(`address-field__${addressType}`, isValid);

      const firstCreateFieldsCall = mockCreateFields.mock.calls[0];
      expect(firstCreateFieldsCall[0]).toBeInstanceOf(ElementCreator);
      expect(firstCreateFieldsCall[1]).toBeInstanceOf(ElementCreator);
      const secondCreateFieldsCall = mockCreateFields.mock.calls[1];
      expect(secondCreateFieldsCall[0]).toBeInstanceOf(ElementCreator);
      expect(secondCreateFieldsCall[1]).toBeInstanceOf(ElementCreator);

      expect(result).toBeInstanceOf(ElementCreator);
    };

    checkAddressGroup(true);
    checkAddressGroup(false);
    checkAddressGroup(true, 'test-id', true);
  });

  it('should create an error element and add validation to input', () => {
    const mockInputCreator = new InputCreator({ type: 'text' });

    setupMockElementCreator();
    const result = formPageCreator['addValidationErrorHandling'](mockInputCreator, mockValidationFunc);

    const errorElement = mockElementCreator.getElement();

    expect(ElementCreator).toHaveBeenCalledWith({ tag: 'span' });
    expect(mockInputCreator.addValidation).toHaveBeenCalledWith(mockValidationFunc, errorElement);
    expect(formPageCreator['formCreator'].addValidationField).toHaveBeenCalledWith(mockInputCreator);
    expect(result).toBe(mockElementCreator);
  });
});
