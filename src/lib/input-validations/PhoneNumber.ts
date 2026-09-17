// Import the shared interface
import { ValidationResult } from './Email';

export const validatePhone = (phone: string): ValidationResult => {
  // 1. Check if empty
  if (!phone || phone.trim() === '') {
    return { isValid: false, errorMessage: 'Phone number cannot be empty.' };
  }

  // 2. Clean the input: Remove all spaces, dashes, and parentheses
  // Example: "(123) 456-7890" becomes "1234567890"
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');

  // 3. Strict Check: Ensure it only contains numbers (and an optional + at the start for country code)
  const phoneRegex = /^\+?[0-9]+$/;
  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, errorMessage: 'Phone number can only contain numbers.' };
  }

  // 4. Check length (Standard global phone numbers are usually between 10 and 15 digits)
  // We remove the '+' sign just for the length check
  const digitCount = cleanedPhone.replace('+', '').length;
  
  if (digitCount < 10) {
    return { isValid: false, errorMessage: 'Phone number is too short. It must be at least 10 digits.' };
  }
  
  if (digitCount > 15) {
     return { isValid: false, errorMessage: 'Phone number is too long. Please check your country code.' };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
