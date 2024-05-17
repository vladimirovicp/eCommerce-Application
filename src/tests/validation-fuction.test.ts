import { validationSettings } from '../app/util/data';
import { BirthDateErrors, EmailErrors, FirstNameErrors, PasswordErrors } from '../app/util/error-messages';
import {
  birthDateValidation,
  emailValidation,
  nameValidation,
  passwordValidation,
} from '../app/util/validation-fuction';

describe('emailValidation function tests', () => {
  it('should return false for empty email', () => {
    const result = emailValidation('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(EmailErrors.Required);
  });

  it('should return false for email with whitespace', () => {
    const result = emailValidation('example @gmail.com');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(EmailErrors.Whitespace);
  });

  it('should return false for invalid email format', () => {
    const result = emailValidation('gmail.com');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(EmailErrors.Hint);
  });

  it('should return true for valid email', () => {
    const result = emailValidation('example@gmail.com');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe('');
  });
});

describe('passwordValidation function tests', () => {
  it('should return false for empty password', () => {
    const result = passwordValidation('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(PasswordErrors.Required);
  });

  it('should return false for password with whitespace', () => {
    const result = passwordValidation('P assword123');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(PasswordErrors.Whitespace);
  });

  it('should return false for password that does not have complexity requirements', () => {
    const result = passwordValidation('password');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(PasswordErrors.Hint);
  });

  it('should return true for valid password', () => {
    const result = passwordValidation('Password123');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe('');
  });
});

describe('nameValidation function tests', () => {
  it('should return false for empty name', () => {
    const result = nameValidation('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(FirstNameErrors.Required);
  });

  it('should return false for name with non-letters', () => {
    const result = nameValidation('John123');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(FirstNameErrors.Invalid);
  });

  it('should return true for valid name', () => {
    const result = nameValidation('John');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe('');
  });
});

describe('birthDateValidation function tests', () => {
  it('should return false for empty birth date', () => {
    const result = birthDateValidation('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(BirthDateErrors.Required);
  });

  it('should return false for underage user', () => {
    const itingDate = new Date();
    itingDate.setFullYear(itingDate.getFullYear() - validationSettings.minRegistrationAge + 1);
    const result = birthDateValidation(itingDate.toISOString().slice(0, 10));
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(BirthDateErrors.Invalid);
  });

  it('should return true for valid birth date', () => {
    const itingDate = new Date();
    itingDate.setFullYear(itingDate.getFullYear() - validationSettings.minRegistrationAge - 1);
    const result = birthDateValidation(itingDate.toISOString().slice(0, 10));
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe('');
  });
});
