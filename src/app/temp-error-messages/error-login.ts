export const enum EmailErrors {
  Required = 'Field is required',
  Incorrect = 'Invalid email address',
  Hint = `Email address must match the pattern 'username@domain.extension'.
  Username and domain name should have at least 2 symbols, be separated with '@', and include only lowercase letters, digits or symbols '. _ #'`,
  Whitespace = 'Whitespaces are not allowed',
}