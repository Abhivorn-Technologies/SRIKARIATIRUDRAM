// Import the shared interface
import { ValidationResult } from './Email';

export const validateFirstName = (firstName: string): ValidationResult => {
  // 1. Check if empty
  if (!firstName || firstName.trim() === '') {
    return { isValid: false, errorMessage: 'First name cannot be empty.' };
  }

  const trimmedName = firstName.trim();

  // 2. Length Checks
  if (trimmedName.length < 2) {
    return { isValid: false, errorMessage: 'First name must be at least 2 characters long.' };
  }

  if (trimmedName.length > 30) {
    return { isValid: false, errorMessage: 'First name is too long. Please limit to 30 characters.' };
  }

  // 3. Strict Character Check (NO SPACES ALLOWED)
  // This ONLY allows: letters, hyphens (-), and apostrophes (')
  // It stops users from typing "John Doe" into the First Name box.
  const strictNameRegex = /^[a-zA-Z\-']+$/;
  
  if (!strictNameRegex.test(trimmedName)) {
    return { 
      isValid: false, 
      errorMessage: 'First name can only contain letters, hyphens, and apostrophes (No spaces).' 
    };
  }

  return { isValid: true, errorMessage: null };
};
