// Import the shared interface
import { ValidationResult } from './Email';

export const validatePANCard = (panCard: string): ValidationResult => {
  // 1. Check if empty
  if (!panCard || panCard.trim() === '') {
    return { isValid: false, errorMessage: 'PAN Card number cannot be empty.' };
  }

  // 2. Clean input: Automatically convert to uppercase and remove spaces
  const cleanedPAN = panCard.trim().toUpperCase();

  // 3. Length Check: PAN Cards are ALWAYS exactly 10 characters
  if (cleanedPAN.length !== 10) {
    return { isValid: false, errorMessage: 'PAN Card number must be exactly 10 characters long.' };
  }

  // 4. Strict Format Check
  // ^[A-Z]{5}  = First 5 are letters
  // [0-9]{4}   = Next 4 are numbers
  // [A-Z]{1}$  = Last 1 is a letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(cleanedPAN)) {
    return { 
      isValid: false, 
      errorMessage: 'Invalid PAN Card format. It must be 5 letters, 4 numbers, and 1 letter (e.g., ABCDE1234F).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
