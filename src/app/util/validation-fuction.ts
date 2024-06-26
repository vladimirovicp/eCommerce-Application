import { validationSettings } from './data';
import { EmailErrors, PasswordErrors, FirstNameErrors, BirthDateErrors, AddressErrors } from './error-messages';

export function emailValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value) {
    return { isValid: false, errorMessage: EmailErrors.Required };
  }
  if (/\s/.test(value)) {
    return { isValid: false, errorMessage: EmailErrors.Whitespace };
  }
  const emailPattern = /^[a-z0-9._#]+@[a-z0-9]+\.[a-z]{2,}$/;
  if (!emailPattern.test(value)) {
    return { isValid: false, errorMessage: EmailErrors.Hint };
  }
  return { isValid: true, errorMessage: '' };
}

export function passwordValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value) {
    return { isValid: false, errorMessage: PasswordErrors.Required };
  }
  if (/\s/.test(value)) {
    return { isValid: false, errorMessage: PasswordErrors.Whitespace };
  }
  if (
    value.length < validationSettings.minLengthPassword ||
    !/[a-z]/.test(value) ||
    !/[A-Z]/.test(value) ||
    !/\d/.test(value)
  ) {
    return { isValid: false, errorMessage: PasswordErrors.Hint };
  }
  return { isValid: true, errorMessage: '' };
}

export function nameValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value) {
    return { isValid: false, errorMessage: FirstNameErrors.Required };
  }

  if (!/^[A-Za-z]+$/.test(value)) {
    return { isValid: false, errorMessage: FirstNameErrors.Invalid };
  }

  return { isValid: true, errorMessage: '' };
}

export function birthDateValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value) {
    return { isValid: false, errorMessage: BirthDateErrors.Required };
  }

  const userBirthDate = new Date(value);
  const currentDate = new Date();
  const minAgeYearsAgo = new Date(
    currentDate.getFullYear() - validationSettings.minRegistrationAge,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  if (userBirthDate > minAgeYearsAgo) {
    return { isValid: false, errorMessage: BirthDateErrors.Invalid };
  }

  return { isValid: true, errorMessage: '' };
}

export function addressValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value.trim()) {
    return { isValid: false, errorMessage: AddressErrors.Required };
  }
  if (!/^[a-zA-Z]+$/.test(value.trim())) {
    return { isValid: false, errorMessage: AddressErrors.InvalidCity };
  }
  return { isValid: true, errorMessage: '' };
}

export function postCodeValidation(value: string): { isValid: boolean; errorMessage: string } {
  if (!value.trim()) {
    return { isValid: false, errorMessage: AddressErrors.Required };
  }
  return { isValid: true, errorMessage: '' };
}
