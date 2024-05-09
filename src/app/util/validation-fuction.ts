export default function mailValid(value: string): { isValid: boolean; errorMessage: string } {
  let errorMessage: string = '';
  let isValid: boolean = true;
  if (!value) {
    errorMessage = 'Field is required';
    isValid = false;
    return { isValid, errorMessage };
  }
  if (value.length < 6) {
    errorMessage = 'Field is short';
    isValid = false;
    return { isValid, errorMessage };
  }
  return { isValid, errorMessage };
}
