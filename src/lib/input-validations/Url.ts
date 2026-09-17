// Import the shared interface
import { ValidationResult } from './Email';

export const validateUrl = (url: string): ValidationResult => {
  // 1. Check if empty
  if (!url || url.trim() === '') {
    return { isValid: false, errorMessage: 'URL cannot be empty.' };
  }

  const trimmedUrl = url.trim();

  // 2. Use JavaScript's built-in URL parser to check if it is a real web address
  // This is much safer than using a Regex for URLs!
  try {
    const parsedUrl = new URL(trimmedUrl);
    
    // 3. Security Check: ONLY allow safe web links (http and https).
    // This strictly blocks dangerous links like "javascript:..." or "file://..."
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { 
        isValid: false, 
        errorMessage: 'URL must be a secure web link starting with http:// or https://' 
      };
    }

  } catch (error) {
    // If the 'new URL()' parser crashes, it means the user typed gibberish instead of a link.
    return { isValid: false, errorMessage: 'Please enter a valid web address (e.g., https://company.com).' };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
