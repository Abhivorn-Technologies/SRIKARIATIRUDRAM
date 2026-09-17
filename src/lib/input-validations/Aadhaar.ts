// Import the shared interface
import { ValidationResult } from './Email';

export const validateAadhaar = (aadhaar: string): ValidationResult => {
  // 1. Check if empty
  if (!aadhaar || aadhaar.trim() === '') {
    return { isValid: false, errorMessage: 'Aadhaar number cannot be empty.' };
  }

  // 2. Clean input: Automatically remove all spaces
  // Example: "1234 5678 9012" becomes "123456789012"
  const cleanedAadhaar = aadhaar.replace(/\s/g, '');

  // 3. Length Check: Aadhaar is ALWAYS exactly 12 digits
  if (cleanedAadhaar.length !== 12) {
    return { isValid: false, errorMessage: 'Aadhaar number must be exactly 12 digits long.' };
  }

  // 4. Strict Format Check
  // ^[2-9]{1}  = The very first digit MUST be between 2 and 9
  // [0-9]{11}$ = The remaining 11 digits can be any number
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;

  if (!aadhaarRegex.test(cleanedAadhaar)) {
    return { 
      isValid: false, 
      errorMessage: 'Invalid Aadhaar number. It must contain only numbers and cannot start with 0 or 1.' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
