// Import the shared interface
import { ValidationResult } from './Email';

export const validateLastName = (lastName: string): ValidationResult => {
  // 1. Check if empty
  if (!lastName || lastName.trim() === '') {
    return { isValid: false, errorMessage: 'Last name cannot be empty.' };
  }

  const trimmedName = lastName.trim();

  // 2. Length Checks
  if (trimmedName.length < 2) {
    return { isValid: false, errorMessage: 'Last name must be at least 2 characters long.' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, errorMessage: 'Last name is too long. Please limit to 50 characters.' };
  }

  // 3. Strict Character Check (SPACES ALLOWED)
  // This allows: letters, spaces, hyphens (-), and apostrophes (')
  // It blocks numbers and emojis!
  const strictNameRegex = /^[a-zA-Z\s\-']+$/;
  
  if (!strictNameRegex.test(trimmedName)) {
    return { 
      isValid: false, 
      errorMessage: 'Last name can only contain letters, spaces, hyphens, and apostrophes.' 
    };
  }

  return { isValid: true, errorMessage: null };
};
