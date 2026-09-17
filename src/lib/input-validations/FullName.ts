// Import the shared interface
import { ValidationResult } from './Email';

export const validateName = (name: string): ValidationResult => {
  // 1. Check if empty
  if (!name || name.trim() === '') {
    return { isValid: false, errorMessage: 'Name cannot be empty.' };
  }

  // Clean up any accidental spaces at the very beginning or end
  const trimmedName = name.trim();

  // 2. Check minimum length (most names are at least 2 letters, like "Ed" or "Bo")
  if (trimmedName.length < 2) {
    return { isValid: false, errorMessage: 'Name must be at least 2 characters long.' };
  }

  // 3. Check maximum length (prevents users from pasting massive paragraphs)
  if (trimmedName.length > 50) {
    return { isValid: false, errorMessage: 'Name is too long. Please limit to 50 characters.' };
  }

  // 4. Strict Character Check
  // This Regex ONLY allows: uppercase letters, lowercase letters, spaces, hyphens (-), and apostrophes (')
  // It completely blocks numbers, emojis, and dangerous characters like < > / 
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  
  if (!nameRegex.test(trimmedName)) {
    return { 
      isValid: false, 
      errorMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes (No numbers or special symbols).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
