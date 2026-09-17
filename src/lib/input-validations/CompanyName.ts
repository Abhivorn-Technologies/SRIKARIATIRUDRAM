// Import the shared interface
import { ValidationResult } from './Email';

export const validateCompanyName = (companyName: string): ValidationResult => {
  // 1. Check if empty
  if (!companyName || companyName.trim() === '') {
    return { isValid: false, errorMessage: 'Company name cannot be empty.' };
  }

  const trimmedName = companyName.trim();

  // 2. Length Checks
  if (trimmedName.length < 2) {
    return { isValid: false, errorMessage: 'Company name must be at least 2 characters long.' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, errorMessage: 'Company name is too long. Please limit to 100 characters.' };
  }

  // 3. Flexible but Secure Character Check
  // This allows: letters, numbers, spaces, ampersands (&), commas (,), periods (.), hyphens (-), and apostrophes (')
  // Example valid names: "3M", "Johnson & Johnson", "Bob's Burgers, LLC."
  // It strictly blocks emojis and dangerous characters like < > { }
  const companyRegex = /^[a-zA-Z0-9\s\&,\.\-\']+$/;
  
  if (!companyRegex.test(trimmedName)) {
    return { 
      isValid: false, 
      errorMessage: 'Company name contains invalid characters. Please use only letters, numbers, spaces, and basic punctuation (& , . - \').' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
