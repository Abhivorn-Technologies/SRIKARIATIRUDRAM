export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export const validatePhone = (phone: string): ValidationResult => {
  // 1. Check if empty
  if (!phone || phone.trim() === '') {
    return { isValid: false, errorMessage: 'Phone number cannot be empty.' };
  }

  // 2. Clean the input: Remove all spaces, dashes, and parentheses
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');

  // 3. Strict Check: Ensure it only contains numbers (and an optional + at the start for country code)
  const phoneRegex = /^\+?[0-9]+$/;
  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, errorMessage: 'Phone number can only contain numbers.' };
  }

  // 4. Check length (between 10 and 15 digits)
  const digitCount = cleanedPhone.replace('+', '').length;
  
  if (digitCount < 10) {
    return { isValid: false, errorMessage: 'Phone number is too short. It must be at least 10 digits.' };
  }
  
  if (digitCount > 15) {
     return { isValid: false, errorMessage: 'Phone number is too long. Please check your country code.' };
  }

  return { isValid: true, errorMessage: null };
};

export const validatePassword = (password: string): ValidationResult => {
  // 1. Check if empty
  if (!password || password.trim() === '') {
    return { isValid: false, errorMessage: 'Password cannot be empty.' };
  }

  // 2. Check length (must be at least 8 characters)
  if (password.length < 8) {
    return { isValid: false, errorMessage: 'Password must be at least 8 characters long.' };
  }

  // 3. Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, errorMessage: 'Password must contain at least one uppercase letter.' };
  }

  // 4. Check for special character/symbol
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one special character.'
    };
  }

  return { isValid: true, errorMessage: null };
};
