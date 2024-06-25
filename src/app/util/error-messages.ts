export enum EmailErrors {
  Required = 'Field is required',
  Invalid = 'Invalid email address',
  Hint = "Email address must match the pattern 'username@domain.extension'",
  Hint1 = "Username and domain name should have at least 2 symbols, be separated with '@', and include only lowercase letters, digits or symbols '. _ #'",
  Whitespace = 'Whitespaces are not allowed',
}

export enum PasswordErrors {
  Required = 'Field is required',
  Incorrect = 'Incorrect password',
  Hint = 'Password must be at least 8 symbols long and include uppercase and lowercase letters, and digits',
  Hint1 = 'Password must be at least 8 symbols long and include uppercase and lowercase letters, digits, special symbols (e.g.!@#$%^&*)',
  Whitespace = 'Whitespaces are not allowed',
}

export enum FirstNameErrors {
  Required = 'Field is required',
  Invalid = 'Invalid name. May include only uppercase and lowercase letters',
}

export enum SecondNameErrors {
  Required = 'Field is required',
  Invalid = 'Invalid second name. May include only uppercase and lowercase letters',
}

export enum BirthDateErrors {
  Required = 'Field is required',
  Invalid = 'You must be 13 years or older to use the service',
}

export enum AddressErrors {
  Required = 'Field is required',
  InvalidCity = 'Invalid city name. May include only uppercase and lowercase letters',
  InvalidPostalCode = 'Invalid postal code',
}
