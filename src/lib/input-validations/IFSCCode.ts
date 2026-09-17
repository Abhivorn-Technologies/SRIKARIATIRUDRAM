// Import the shared interface
import { ValidationResult } from './Email';

export const validateIFSCCode = (ifscCode: string): ValidationResult => {
  // 1. Check if empty
  if (!ifscCode || ifscCode.trim() === '') {
    return { isValid: false, errorMessage: 'IFSC code cannot be empty.' };
  }

  // 2. Clean input: Automatically convert to uppercase and remove spaces
  const cleanedIFSC = ifscCode.trim().toUpperCase();

  // 3. Length Check: IFSC codes are ALWAYS exactly 11 characters
  if (cleanedIFSC.length !== 11) {
    return { isValid: false, errorMessage: 'IFSC code must be exactly 11 characters long.' };
  }

  // 4. Strict Format Check
  // ^[A-Z]{4}  = First 4 are letters
  // 0          = 5th is the number zero
  // [A-Z0-9]{6}$ = Last 6 are letters or numbers
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  if (!ifscRegex.test(cleanedIFSC)) {
    return { 
      isValid: false, 
      errorMessage: 'Invalid IFSC code format. Please check for typos and ensure the 5th character is a zero (0).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
