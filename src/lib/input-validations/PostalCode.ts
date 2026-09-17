// Import the shared interface
import { ValidationResult } from './Email';

export const validatePostalCode = (postalCode: string): ValidationResult => {
  // 1. Check if empty
  if (!postalCode || postalCode.trim() === '') {
    return { isValid: false, errorMessage: 'Postal code cannot be empty.' };
  }

  const cleanedCode = postalCode.trim();

  // 2. Length Check
  // The shortest postal codes in the world are 3 characters, the longest are around 10.
  if (cleanedCode.length < 3 || cleanedCode.length > 10) {
    return { isValid: false, errorMessage: 'Postal code must be between 3 and 10 characters.' };
  }

  // 3. Security & Format Check
  // This Regex supports international formats. 
  // It ONLY allows: Letters (A-Z), Numbers (0-9), Spaces, and Hyphens (-).
  // It strictly blocks emojis, special symbols like !@#$%, and dangerous HTML tags.
  const postalRegex = /^[A-Za-z0-9\s\-]+$/;

  if (!postalRegex.test(cleanedCode)) {
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid postal code (only letters, numbers, spaces, and hyphens are allowed).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
