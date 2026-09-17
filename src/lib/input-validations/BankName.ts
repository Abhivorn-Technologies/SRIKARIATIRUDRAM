// Import the shared interface
import { ValidationResult } from './Email';

export const validateBankName = (bankName: string): ValidationResult => {
  // 1. Check if empty
  if (!bankName || bankName.trim() === '') {
    return { isValid: false, errorMessage: 'Bank name cannot be empty.' };
  }

  const trimmedName = bankName.trim();

  // 2. Length Checks
  // A bank name like "BOI" is 3 letters, but we allow 2 just to be safe.
  if (trimmedName.length < 2) {
    return { isValid: false, errorMessage: 'Bank name must be at least 2 characters long.' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, errorMessage: 'Bank name is too long. Please limit to 100 characters.' };
  }

  // 3. Flexible but Secure Character Check
  // This allows: letters, numbers, spaces, ampersands (&), commas (,), periods (.), hyphens (-), and parentheses ()
  // Example valid names: "HDFC Bank", "State Bank of India (SBI)"
  // It strictly blocks dangerous characters like < > { } !
  const bankRegex = /^[a-zA-Z0-9\s\&,\.\-\(\)]+$/;
  
  if (!bankRegex.test(trimmedName)) {
    return { 
      isValid: false, 
      errorMessage: 'Bank name contains invalid characters. Please use only letters, numbers, spaces, and basic punctuation (& , . - ()).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
