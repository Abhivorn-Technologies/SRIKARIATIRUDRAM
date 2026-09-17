// Import the shared interface
import { ValidationResult } from './Email';

export const validateAddress = (address: string): ValidationResult => {
  // 1. Check if empty
  if (!address || address.trim() === '') {
    return { isValid: false, errorMessage: 'Address cannot be empty.' };
  }

  const trimmedAddress = address.trim();

  // 2. Length Checks
  // A real address is usually at least 5 characters (like "1 A St")
  if (trimmedAddress.length < 5) {
    return { isValid: false, errorMessage: 'Address is too short. Please enter a complete address.' };
  }

  if (trimmedAddress.length > 150) {
    return { isValid: false, errorMessage: 'Address is too long. Please limit to 150 characters.' };
  }

  // 3. Flexible but Secure Character Check
  // This allows: letters, numbers, spaces, commas (,), periods (.), hyphens (-), hashes (#), and slashes (/)
  // It strictly blocks emojis and dangerous characters like < > { } 
  const addressRegex = /^[a-zA-Z0-9\s,\.\-\#\/]+$/;
  
  if (!addressRegex.test(trimmedAddress)) {
    return { 
      isValid: false, 
      errorMessage: 'Address contains invalid characters. Please use only letters, numbers, spaces, and basic punctuation (, . - # /).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
