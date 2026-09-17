export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, errorMessage: 'Email address cannot be empty.' };
  }

  if (email.length > 254) {
    return { isValid: false, errorMessage: 'Email address is too long. Please limit to 254 characters.' };
  }

  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!strictEmailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address (e.g., name@company.com).' };
  }

  return { isValid: true, errorMessage: null };
};
