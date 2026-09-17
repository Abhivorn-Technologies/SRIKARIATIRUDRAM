// Import the shared interface
import { ValidationResult } from './Email';

export const validateGSTIN = (gstin: string): ValidationResult => {
  // 1. Check if empty
  if (!gstin || gstin.trim() === '') {
    return { isValid: false, errorMessage: 'GSTIN cannot be empty.' };
  }

  // 2. Clean input: Automatically convert to uppercase and remove spaces
  const cleanedGSTIN = gstin.trim().toUpperCase();

  // 3. Length Check: GSTIN is ALWAYS exactly 15 characters
  if (cleanedGSTIN.length !== 15) {
    return { isValid: false, errorMessage: 'GSTIN must be exactly 15 characters long.' };
  }

  // 4. Strict Format Check
  // [0-9]{2}       = First 2 are numbers (State Code)
  // [A-Z]{5}[0-9]{4}[A-Z]{1} = Next 10 are the PAN Card number
  // [1-9A-Z]{1}    = 13th character is entity code (Number or Letter)
  // Z              = 14th character is ALWAYS 'Z'
  // [0-9A-Z]{1}$   = 15th character is a checksum (Number or Letter)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstinRegex.test(cleanedGSTIN)) {
    return { 
      isValid: false, 
      errorMessage: 'Invalid GSTIN format. Please verify the 15-character code (e.g., 22AAAAA0000A1Z5).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
